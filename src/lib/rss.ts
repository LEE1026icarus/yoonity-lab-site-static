import type { NewsDetail } from "./types";
import { detailDescription } from "./content-details";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function rssDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? new Date(0).toUTCString() : date.toUTCString();
}

export function buildNewsRss(items: NewsDetail[], baseUrl: URL) {
  const feedUrl = new URL("/rss.xml", baseUrl).toString();
  const homeUrl = new URL("/", baseUrl).toString();
  const entries = items.map((item) => {
    const url = new URL(`/news/${item.slug}`, baseUrl).toString();
    return [
      "    <item>",
      `      <title>${escapeXml(item.title)}</title>`,
      `      <link>${escapeXml(url)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `      <description>${escapeXml(detailDescription("news", item))}</description>`,
      `      <pubDate>${rssDate(item.date)}</pubDate>`,
      "    </item>",
    ].join("\n");
  }).join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    "    <title>Yoonity Lab 연구실 소식</title>",
    `    <link>${escapeXml(homeUrl)}</link>`,
    "    <description>Yoonity Lab의 연구, 교육, 산학협력 및 수상 소식</description>",
    "    <language>ko-KR</language>",
    `    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`,
    entries,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}
