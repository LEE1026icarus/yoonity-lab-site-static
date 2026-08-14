import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const typesPath = new URL("../src/lib/types.ts", import.meta.url);
const sheetsPath = new URL("../src/lib/sheets.ts", import.meta.url);
const mockPath = new URL("../src/data/mock-about.ts", import.meta.url);
const newsPath = new URL("../src/components/about-news.tsx", import.meta.url);
const pagePath = new URL("../src/app/about/page.tsx", import.meta.url);
const headerPath = new URL("../src/components/site-header.tsx", import.meta.url);

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

test("about page renders the agreed sections in order", async () => {
  const page = await readFile(pagePath, "utf8");
  const labels = [
    "연구실 소개",
    "Join Yoonity",
    "Resources",
    "Collaboration",
    "Channels",
    "News",
  ];
  let cursor = -1;
  for (const label of labels) {
    const next = page.indexOf(label, cursor + 1);
    assert.ok(next > cursor, `${label} must follow the previous section`);
    cursor = next;
  }
  assert.match(page, /getAboutPageData\(\)/);
  assert.match(page, /<AboutNews items=\{data\.news\}/);
  assert.match(page, /mailto:/);
  assert.match(page, /target="_blank"/);
  assert.match(page, /noopener noreferrer/);
  assert.match(page, /<SiteFooter/);
});

test("header navigation reaches the about page", async () => {
  const header = await readFile(headerPath, "utf8");
  assert.equal((header.match(/href="\/about"/g) ?? []).length, 2);
  assert.doesNotMatch(header, /href="\/#research"/);
});

test("about news starts with three items and expands accessibly", async () => {
  const news = await readFile(newsPath, "utf8");
  assert.match(news, /^"use client"/);
  assert.match(news, /slice\(0, 3\)/);
  assert.match(news, /aria-expanded=\{expanded\}/);
  assert.match(news, /전체 기사 보기/);
  assert.match(news, /기사 접기/);
  assert.match(news, /noopener noreferrer/);
});
