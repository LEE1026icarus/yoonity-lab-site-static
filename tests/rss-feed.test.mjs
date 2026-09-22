import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = new URL("https://lab.example.edu/");

test("RSS feed emits absolute news URLs, dates, summaries, and escaped XML", async () => {
  const rssModule = await import("../src/lib/rss.ts").catch(() => null);
  assert.ok(rssModule, "src/lib/rss.ts must provide the RSS behavior");

  const xml = rssModule.buildNewsRss(
    [
      {
        kind: "news",
        slug: "first-news",
        date: "2026-09-22",
        title: "AI & 데이터 연구",
        excerpt: "첫 번째 <연구> 소식입니다.",
        href: "https://source.example/news",
      },
      {
        kind: "news",
        slug: "second-news",
        date: "2026-09-21",
        title: "두 번째 소식",
        excerpt: "충분한 요약입니다.",
      },
    ],
    baseUrl,
  );

  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<rss version="2\.0"/);
  assert.match(xml, /<link>https:\/\/lab\.example\.edu\/news\/first-news<\/link>/);
  assert.match(xml, /<guid isPermaLink="true">https:\/\/lab\.example\.edu\/news\/second-news<\/guid>/);
  assert.match(xml, /<pubDate>Tue, 22 Sep 2026 00:00:00 GMT<\/pubDate>/);
  assert.match(xml, /AI &amp; 데이터 연구/);
  assert.match(xml, /첫 번째 &lt;연구&gt; 소식입니다\./);
  assert.equal((xml.match(/<item>/g) ?? []).length, 2);
});

test("RSS route returns an XML response and the site advertises it", async () => {
  const [routeModule, seoModule] = await Promise.all([
    import("../src/app/rss.xml/route.ts").catch(() => null),
    import("../src/lib/seo.ts"),
  ]);
  assert.ok(routeModule, "src/app/rss.xml/route.ts must expose the feed route");

  const response = await routeModule.GET();
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^application\/rss\+xml/);
  assert.match(body, /<channel>/);
  assert.deepEqual(seoModule.createFeedAlternates(baseUrl), {
    types: { "application/rss+xml": "https://lab.example.edu/rss.xml" },
  });
  assert.match(
    seoModule.PAGE_METADATA["/"].alternates.types["application/rss+xml"],
    /\/rss\.xml$/,
  );
});

test("detail categories expose distinct 1200 by 630 social images", async () => {
  const modules = await Promise.all(
    ["news", "projects", "publications"].map((kind) =>
      import(`../src/app/${kind}/opengraph-image.tsx`).catch(() => null),
    ),
  );

  assert.ok(modules.every(Boolean), "each detail category must provide an OG image");
  assert.deepEqual(modules.map(({ size }) => size), [
    { width: 1200, height: 630 },
    { width: 1200, height: 630 },
    { width: 1200, height: 630 },
  ]);
  assert.equal(new Set(modules.map(({ alt }) => alt)).size, 3);
  assert.ok(modules.every(({ contentType }) => contentType === "image/png"));
});
