import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const typesPath = new URL("../src/lib/types.ts", import.meta.url);
const sheetsPath = new URL("../src/lib/sheets.ts", import.meta.url);
const mockPath = new URL("../src/data/mock-about.ts", import.meta.url);

test("about data has typed sheet sources and local fallbacks", async () => {
  const [types, sheets, mock] = await Promise.all([
    readFile(typesPath, "utf8"),
    readFile(sheetsPath, "utf8"),
    readFile(mockPath, "utf8"),
  ]);

  for (const name of [
    "AboutResource",
    "AboutChannel",
    "AboutNewsItem",
    "AboutPageData",
  ]) {
    assert.match(types, new RegExp(`export type ${name}`));
  }

  for (const tab of [
    "about_settings",
    "about_resources",
    "about_channels",
    "about_news",
  ]) {
    assert.match(sheets, new RegExp(`fetchSheetRows\\(\"${tab}\"\\)`));
  }

  assert.match(sheets, /filter\(\(resource\) => resource\.id && resource\.title && resource\.href\)/);
  assert.match(sheets, /filter\(\(item\) => item\.id && item\.date && item\.title && item\.href\)/);
  assert.match(mock, /yoonity25@gmail\.com/);
});
