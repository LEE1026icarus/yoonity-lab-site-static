import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AboutNews } from "../src/components/about-news.tsx";

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
  assert.match(sheets, /channelHref/);
  assert.match(sheets, /safeChannelUrl/);
  assert.match(sheets, /url\.protocol === "http:" \|\| url\.protocol === "https:"/);
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
  assert.match(page, /channelIcon/);
  assert.match(page, /\/images\/channels\/blog\.png/);
  assert.match(page, /\/images\/channels\/github\.png/);
  assert.match(page, /<SiteFooter/);
});

test("about page exposes a news anchor for the home page", async () => {
  const page = await readFile(pagePath, "utf8");

  assert.match(page, /<section id="news"/);
});

test("about collaboration offers email contact without a meeting request action", async () => {
  const page = await readFile(pagePath, "utf8");

  assert.match(page, /mailto:\$\{data\.collaborationEmail\}/);
  assert.doesNotMatch(page, /siteCopy\.home\.meetingCta/);
});

test("header navigation reaches the about page", async () => {
  const header = await readFile(headerPath, "utf8");
  assert.equal((header.match(/href="\/about"/g) ?? []).length, 2);
  assert.doesNotMatch(header, /href="\/#research"/);
});

test("header exposes the AQMRI institute link in both navigation menus", async () => {
  const header = await readFile(headerPath, "utf8");

  assert.equal((header.match(/AQMRI 연구소/g) ?? []).length, 2);
  assert.equal((header.match(/href="https:\/\/aqmri\.co\.kr\/"/g) ?? []).length, 2);
  assert.equal((header.match(/target="_blank"/g) ?? []).length, 2);
  assert.equal((header.match(/rel="noopener noreferrer"/g) ?? []).length, 2);
  assert.match(header, /ArrowUpRightIcon/);
  assert.match(header, /border-l border-hairline/);
  assert.equal((header.match(/bg-axis-quantum/g) ?? []).length, 2);
});

test("about news includes every item in server HTML and enhances accessibly", async () => {
  const news = await readFile(newsPath, "utf8");
  const items = Array.from({ length: 6 }, (_, index) => ({
    id: `news-${index + 1}`,
    date: `2026-08-${String(index + 1).padStart(2, "0")}`,
    title: `뉴스 ${index + 1}`,
    excerpt: `소식 ${index + 1}`,
    href: `https://example.com/news/${index + 1}`,
    order: index + 1,
  }));
  const html = renderToStaticMarkup(createElement(AboutNews, { items }));

  for (const item of items) {
    assert.match(html, new RegExp(item.title));
    assert.match(html, new RegExp(item.href));
  }

  assert.doesNotMatch(html, / hidden=""/);
  assert.match(html, /id="about-news-list"/);
  assert.match(html, /aria-expanded="true"/);
  assert.match(html, /aria-controls="about-news-list"/);
  assert.match(news, /^"use client"/);
  assert.match(news, /useSyncExternalStore/);
  assert.doesNotMatch(news, /slice\(0, 3\)|visibleItems/);
  assert.match(news, /전체 기사 보기/);
  assert.match(news, /기사 접기/);
  assert.match(news, /noopener noreferrer/);
});

test("about news omits the disclosure for empty and short lists", () => {
  const emptyHtml = renderToStaticMarkup(createElement(AboutNews, { items: [] }));
  const shortItems = Array.from({ length: 3 }, (_, index) => ({
    id: `short-${index + 1}`,
    date: "2026-08-21",
    title: `짧은 소식 ${index + 1}`,
    excerpt: "",
    href: `https://example.com/short/${index + 1}`,
    order: index + 1,
  }));
  const shortHtml = renderToStaticMarkup(
    createElement(AboutNews, { items: shortItems }),
  );

  assert.doesNotMatch(emptyHtml, /<button/);
  assert.doesNotMatch(shortHtml, /<button/);
  for (const item of shortItems) assert.match(shortHtml, new RegExp(item.title));
});
