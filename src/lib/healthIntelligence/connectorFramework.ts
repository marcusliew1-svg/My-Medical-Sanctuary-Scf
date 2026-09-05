import "server-only";
import type {
  SourceConnectorConfig,
} from "@/lib/healthIntelligence/ingestion";
import { connectorMayRun } from "@/lib/healthIntelligence/ingestion";
import type { SourceRegistryRecord } from "@/lib/healthIntelligence/operations";

export type ConnectorCandidate = {
  sourceItemIdentifier: string;
  originalSourceValue: string;
  originalLanguage: string;
  normalized: Record<string, string | number>;
  sourceReference: string;
  warnings: string[];
  errors: string[];
};
export type ConnectorPage<T> = {
  items: T[];
  nextCursor?: string;
};
export interface ApprovedApiConnector<T> {
  identifySource(): { sourceId: string; market: string; connectorKey: string };
  retrievePage(input: {
    cursor?: string;
    signal: AbortSignal;
    authorizationHeaders: Record<string, string>;
  }): Promise<ConnectorPage<T>>;
  normalizeItem(item: T, index: number): ConnectorCandidate;
}

function serverAuthorizationHeaders(config: SourceConnectorConfig): Record<string, string> {
  if (config.authenticationType === "none") return {};
  const values = config.environmentSecretNames.map((name) => process.env[name]?.trim() || "");
  if (!values.length || values.some((value) => !value))
    throw new Error("Connector authentication is not configured server-side.");
  if (config.authenticationType === "api_key") return { "X-API-Key": values[0] };
  if (config.authenticationType === "bearer") return { Authorization: `Bearer ${values[0]}` };
  if (config.authenticationType === "basic")
    return { Authorization: `Basic ${Buffer.from(values.slice(0, 2).join(":"), "utf8").toString("base64")}` };
  throw new Error("Connector authentication requires an approved provider-specific implementation.");
}

async function delay(milliseconds: number) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function runApprovedApiConnector<T>(input: {
  connector: ApprovedApiConnector<T>;
  config: SourceConnectorConfig;
  source: SourceRegistryRecord;
  maximumPages?: number;
}): Promise<{ candidates: ConnectorCandidate[]; warnings: string[] }> {
  const gate = connectorMayRun(input.config, input.source);
  if (!gate.allowed) throw new Error(`Connector refused: ${gate.reasons.join(", ")}`);
  if (input.config.connectorType !== "api") throw new Error("API runner requires an API connector configuration.");
  const identity = input.connector.identifySource();
  if (identity.sourceId !== input.source.id || identity.market !== input.source.country)
    throw new Error("Connector identity does not match the approved source registry entry.");
  const headers = serverAuthorizationHeaders(input.config);
  const candidates: ConnectorCandidate[] = [];
  const warnings: string[] = [];
  let cursor: string | undefined;
  const maximumPages = Math.min(Math.max(input.maximumPages || 25, 1), 100);
  for (let pageNumber = 0; pageNumber < maximumPages; pageNumber += 1) {
    let page: ConnectorPage<T> | undefined;
    let lastError: unknown;
    for (let attempt = 0; attempt <= input.config.retryLimit; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), input.config.timeoutMs);
      try {
        page = await input.connector.retrievePage({
          cursor,
          signal: controller.signal,
          authorizationHeaders: headers,
        });
        clearTimeout(timeout);
        break;
      } catch (error) {
        clearTimeout(timeout);
        lastError = error;
        if (attempt < input.config.retryLimit)
          await delay(input.config.backoffMs * 2 ** attempt);
      }
    }
    if (!page) throw new Error(lastError instanceof Error ? lastError.message : "Connector request failed.");
    page.items.forEach((item, index) => candidates.push(input.connector.normalizeItem(item, index)));
    if (!page.nextCursor) break;
    cursor = page.nextCursor;
    await delay(Math.ceil(60_000 / input.config.requestRatePerMinute));
    if (pageNumber === maximumPages - 1) warnings.push("Maximum page limit reached; batch is incomplete.");
  }
  return { candidates, warnings };
}
