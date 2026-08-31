import type { OperationalMarket } from "@/lib/healthIntelligence/operations";

export const IMPORT_HEADERS = [
  "source_key",
  "country",
  "observed_product_name",
  "ingredient",
  "manufacturer",
  "strength",
  "dosage_form",
  "pack",
  "price",
  "currency",
  "basis",
  "observed_date",
  "source_reference",
] as const;
export const MAX_IMPORT_ROWS = 500;
export const MAX_IMPORT_BYTES = 1_000_000;

export type ImportPreviewRow = {
  rowNumber: number;
  raw: Record<string, string>;
  normalized?: Record<string, string | number>;
  errors: string[];
};

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"' && quoted && line[index + 1] === '"') {
      value += '"';
      index += 1;
    } else if (character === '"') quoted = !quoted;
    else if (character === "," && !quoted) {
      values.push(value);
      value = "";
    } else value += character;
  }
  if (quoted) throw new Error("Malformed quoted CSV field.");
  values.push(value);
  return values;
}

function unsafeSpreadsheetValue(value: string): boolean {
  return /^[\s]*[=+\-@]/.test(value);
}

export function validateObservationCsv(csv: string): {
  valid: boolean;
  rows: ImportPreviewRow[];
  errors: string[];
} {
  const errors: string[] = [];
  if (Buffer.byteLength(csv, "utf8") > MAX_IMPORT_BYTES)
    return { valid: false, rows: [], errors: ["File exceeds the 1 MB limit."] };
  const lines = csv
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim());
  if (!lines.length)
    return { valid: false, rows: [], errors: ["CSV is empty."] };
  let headers: string[];
  try {
    headers = parseCsvLine(lines[0]).map((value) => value.trim());
  } catch (error) {
    return {
      valid: false,
      rows: [],
      errors: [
        error instanceof Error ? error.message : "Malformed CSV header.",
      ],
    };
  }
  if (headers.join("|") !== IMPORT_HEADERS.join("|"))
    errors.push("CSV headers do not match the MMS import template.");
  if (lines.length - 1 > MAX_IMPORT_ROWS)
    errors.push(`CSV exceeds the ${MAX_IMPORT_ROWS}-row limit.`);
  const rows = lines
    .slice(1, MAX_IMPORT_ROWS + 1)
    .map((line, index): ImportPreviewRow => {
      const rowErrors: string[] = [];
      let values: string[] = [];
      try {
        values = parseCsvLine(line);
      } catch (error) {
        rowErrors.push(
          error instanceof Error ? error.message : "Malformed row.",
        );
      }
      const raw = Object.fromEntries(
        headers.map((header, position) => [
          header,
          (values[position] || "").trim(),
        ]),
      );
      if (values.length !== headers.length)
        rowErrors.push("Column count does not match the header.");
      for (const [key, value] of Object.entries(raw))
        if (unsafeSpreadsheetValue(value))
          rowErrors.push(`${key} contains a spreadsheet formula prefix.`);
      if (!raw.source_key) rowErrors.push("source_key is required.");
      if (!["MY", "TH", "SG"].includes(raw.country))
        rowErrors.push("country must be MY, TH or SG.");
      if (!raw.observed_product_name)
        rowErrors.push("observed_product_name is required.");
      const price = Number(raw.price);
      if (!Number.isFinite(price) || price < 0)
        rowErrors.push("price must be a non-negative number.");
      const expectedCurrency = (
        { MY: "MYR", TH: "THB", SG: "SGD" } as Record<string, string>
      )[raw.country];
      if (!expectedCurrency || raw.currency !== expectedCurrency)
        rowErrors.push("currency does not match the operational market.");
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(raw.observed_date) ||
        Number.isNaN(Date.parse(raw.observed_date))
      )
        rowErrors.push("observed_date must be a valid YYYY-MM-DD date.");
      return {
        rowNumber: index + 2,
        raw,
        normalized: rowErrors.length
          ? undefined
          : { ...raw, country: raw.country as OperationalMarket, price },
        errors: rowErrors,
      };
    });
  return {
    valid: errors.length === 0 && rows.every((row) => row.errors.length === 0),
    rows,
    errors,
  };
}
