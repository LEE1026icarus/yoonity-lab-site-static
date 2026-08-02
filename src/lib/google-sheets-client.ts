import { SignJWT, importPKCS8 } from "jose";

const CACHE_TTL_MS = 60_000;
const cache = new Map<string, { rows: Record<string, string>[]; expires: number }>();

let cachedToken: { value: string; expires: number } | null = null;

// Manual JWT-bearer OAuth2 flow via plain fetch — avoids the googleapis/gaxios
// SDK, whose retry-on-clone logic breaks under this Node runtime.
async function getAccessToken(): Promise<string | null> {
  if (cachedToken && cachedToken.expires > Date.now()) return cachedToken.value;

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!email || !privateKey) return null;

  const key = await importPKCS8(privateKey, "RS256");
  const now = Math.floor(Date.now() / 1000);
  const assertion = await new SignJWT({
    scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
  })
    .setProtectedHeader({ alg: "RS256" })
    .setIssuer(email)
    .setAudience("https://oauth2.googleapis.com/token")
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(key);

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!res.ok) return null;

  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: data.access_token,
    expires: Date.now() + (data.expires_in - 60) * 1000,
  };
  return data.access_token;
}

// Returns [] when the sheet isn't configured, unreachable, or has no data rows yet —
// callers fall back to local mock data in that case.
export async function fetchSheetRows(tab: string): Promise<Record<string, string>[]> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  if (!spreadsheetId) return [];

  const cached = cache.get(tab);
  if (cached && cached.expires > Date.now()) return cached.rows;

  try {
    const token = await getAccessToken();
    if (!token) return [];

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(`${tab}!A:Z`)}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];

    const data = (await res.json()) as { values?: string[][] };
    const values = data.values ?? [];
    if (values.length < 2) return [];

    const [header, ...body] = values;
    const rows = body
      .filter((row) => row.some((cell) => cell))
      .map((row) => {
        const obj: Record<string, string> = {};
        header.forEach((key, i) => {
          obj[key] = row[i] ?? "";
        });
        return obj;
      });

    cache.set(tab, { rows, expires: Date.now() + CACHE_TTL_MS });
    return rows;
  } catch {
    return [];
  }
}
