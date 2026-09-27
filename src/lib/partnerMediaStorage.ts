const PRIVATE_MEDIA_PREFIX = "storage://partner-media/";

export type PartnerMediaReference = {
  bucket: "partner-media";
  path: string;
};

export function parsePartnerMediaReference(value: string): PartnerMediaReference | null {
  if (!value.startsWith(PRIVATE_MEDIA_PREFIX)) return null;

  const path = value.slice(PRIVATE_MEDIA_PREFIX.length).trim();
  if (!path || path.startsWith("/") || path.includes("..") || path.includes("\\")) return null;
  if (!/^[A-Za-z0-9][A-Za-z0-9._\-/]{0,500}$/.test(path)) return null;

  return { bucket: "partner-media", path };
}

function requiredPartnerMediaEnv() {
  const baseUrl = process.env.MMS_PARTNER_MEDIA_SUPABASE_URL?.trim().replace(/\/$/, "");
  const secretKey = process.env.MMS_PARTNER_MEDIA_SUPABASE_SECRET_KEY?.trim();

  if (!baseUrl || !/^https:\/\/[A-Za-z0-9.-]+\.supabase\.co$/.test(baseUrl)) {
    throw new Error("Private partner media storage is not configured.");
  }
  if (!secretKey) throw new Error("Private partner media signing is not configured.");

  return { baseUrl, secretKey };
}

function encodeStoragePath(path: string): string {
  return path.split("/").map(encodeURIComponent).join("/");
}

export async function createPartnerMediaSignedUrl(
  reference: PartnerMediaReference,
  expiresInSeconds = 300,
): Promise<string> {
  const { baseUrl, secretKey } = requiredPartnerMediaEnv();
  const expiresIn = Math.min(Math.max(Math.floor(expiresInSeconds), 60), 600);
  const endpoint = `${baseUrl}/storage/v1/object/sign/${reference.bucket}/${encodeStoragePath(reference.path)}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      apikey: secretKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({ expiresIn }),
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => ({}))) as {
    signedURL?: string;
    signedUrl?: string;
    error?: string;
    message?: string;
  };

  const signedPath = payload.signedURL || payload.signedUrl;
  if (!response.ok || !signedPath) {
    throw new Error("Private partner media could not be signed.");
  }

  if (signedPath.startsWith("http://") || signedPath.startsWith("https://")) {
    const url = new URL(signedPath);
    if (url.origin !== new URL(baseUrl).origin) throw new Error("Signed media URL origin is invalid.");
    return url.toString();
  }

  return new URL(signedPath, baseUrl).toString();
}

export function partnerPresentationContentUrl(assetId: string, rawContentUrl: string): string {
  return parsePartnerMediaReference(rawContentUrl)
    ? `/api/partner-hub/presentation-centre/media/${encodeURIComponent(assetId)}`
    : rawContentUrl;
}
