import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import test from "node:test";
import { getAboutPageData } from "../src/lib/sheets.ts";
import { mockAboutPageData } from "../src/data/mock-about.ts";

const row = (values) => ({
  values: values.map((formattedValue) => ({ formattedValue })),
});

const grid = (headers, rows) => ({
  sheets: [{ data: [{ rowData: [row(headers), ...rows.map(row)] }] }],
});

test("About sheet data falls back safely and shares one OAuth token request", { concurrency: false }, async (t) => {
  const originalFetch = globalThis.fetch;
  const originalSpreadsheetId = process.env.GOOGLE_SHEETS_ID;
  const originalEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const originalPrivateKey = process.env.GOOGLE_PRIVATE_KEY;
  const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  let tokenRequests = 0;

  process.env.GOOGLE_SHEETS_ID = "test-sheet";
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = "service@example.com";
  process.env.GOOGLE_PRIVATE_KEY = privateKey
    .export({ type: "pkcs8", format: "pem" })
    .toString();

  const responses = {
    about_settings: grid(["key", "value"], [
      ["collaboration_email", "not-an-email"],
      ["recruitment_href", "javascript:alert(1)"],
    ]),
    about_resources: grid(["id", "title", "description", "href", "visible", "order"], [
      ["unsafe", "Unsafe resource", "", "ftp://example.com/file", "TRUE", "1"],
    ]),
    about_channels: grid(["id", "title", "href", "status", "visible", "order"], [
      ["hidden", "Hidden channel", "https://example.com/hidden", "active", "FALSE", "1"],
      ["coming", "Coming soon", "", "coming-soon", "TRUE", "2"],
    ]),
    about_news: grid(["id", "date", "title", "excerpt", "href", "visible", "order"], [
      ["invalid-date", "2026-02-30", "Invalid news", "", "https://example.com/news", "TRUE", "1"],
    ]),
  };

  globalThis.fetch = async (input) => {
    const url = new URL(String(input));
    if (url.hostname === "oauth2.googleapis.com") {
      tokenRequests += 1;
      return {
        ok: true,
        json: async () => ({ access_token: "test-token", expires_in: 3600 }),
      };
    }

    const tab = url.searchParams.get("ranges")?.replace("!A:Z", "");
    assert.ok(tab && tab in responses, `unexpected sheet request: ${url}`);
    return { ok: true, json: async () => responses[tab] };
  };

  t.after(() => {
    globalThis.fetch = originalFetch;
    if (originalSpreadsheetId === undefined) delete process.env.GOOGLE_SHEETS_ID;
    else process.env.GOOGLE_SHEETS_ID = originalSpreadsheetId;
    if (originalEmail === undefined) delete process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    else process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = originalEmail;
    if (originalPrivateKey === undefined) delete process.env.GOOGLE_PRIVATE_KEY;
    else process.env.GOOGLE_PRIVATE_KEY = originalPrivateKey;
  });

  const data = await getAboutPageData();

  assert.equal(tokenRequests, 1);
  assert.equal(data.collaborationEmail, mockAboutPageData.collaborationEmail);
  assert.equal(data.recruitmentHref, mockAboutPageData.recruitmentHref);
  assert.deepEqual(data.resources, mockAboutPageData.resources);
  assert.deepEqual(data.channels, [
    { id: "coming", title: "Coming soon", status: "coming-soon", order: 2 },
  ]);
  assert.deepEqual(data.news, mockAboutPageData.news);
});
