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
    scope: "https://www.googleapis.com/auth/spreadsheets",
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
  if (!spreadsheetId) {
    console.log(`[fetchSheetRows] No GOOGLE_SHEETS_ID for tab: ${tab}`);
    return [];
  }

  const cached = cache.get(tab);
  if (cached && cached.expires > Date.now()) {
    console.log(`[fetchSheetRows] Using cache for tab: ${tab}, rows: ${cached.rows.length}`);
    return cached.rows;
  }

  try {
    const token = await getAccessToken();
    if (!token) {
      console.log(`[fetchSheetRows] Failed to get access token for tab: ${tab}`);
      return [];
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(`${tab}!A:Z`)}`;
    console.log(`[fetchSheetRows] Fetching URL: ${url}`);
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      console.log(`[fetchSheetRows] API error for tab: ${tab}, status: ${res.status}`);
      return [];
    }

    const data = (await res.json()) as { values?: string[][] };
    const values = data.values ?? [];
    console.log(`[fetchSheetRows] Got ${values.length} rows for tab: ${tab}`);
    if (values.length < 2) {
      console.log(`[fetchSheetRows] Not enough rows (need header + data) for tab: ${tab}`);
      return [];
    }

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

    console.log(`[fetchSheetRows] Parsed ${rows.length} rows for tab: ${tab}`);
    cache.set(tab, { rows, expires: Date.now() + CACHE_TTL_MS });
    return rows;
  } catch (error) {
    console.log(`[fetchSheetRows] Exception for tab: ${tab}:`, error);
    return [];
  }
}

export async function updateSheetCell(
  tab: string,
  range: string,
  value: string
): Promise<boolean> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  if (!spreadsheetId) return false;

  try {
    const token = await getAccessToken();
    if (!token) return false;

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(`${tab}!${range}`)}?valueInputOption=USER_ENTERED`;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [[value]],
      }),
    });

    if (res.ok) {
      cache.delete(tab);
    }
    return res.ok;
  } catch {
    return false;
  }
}
