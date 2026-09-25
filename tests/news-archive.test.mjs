import assert from "node:assert/strict";
import test from "node:test";

function collectHrefs(node, hrefs = []) {
  if (node == null || typeof node === "boolean") return hrefs;
  if (Array.isArray(node)) {
    for (const child of node) collectHrefs(child, hrefs);
    return hrefs;
  }
  if (typeof node !== "object") return hrefs;

  if (typeof node.props?.href === "string") hrefs.push(node.props.href);
  collectHrefs(node.props?.children, hrefs);
  return hrefs;
}

test("news archive exposes every supplied article through a direct detail link", async () => {
  const archiveModule = await import("../src/components/news-archive.tsx").catch(() => null);
  assert.ok(archiveModule, "src/components/news-archive.tsx must provide the archive list");

  const rendered = archiveModule.NewsArchive({
    items: [
      {
        kind: "news",
        slug: "latest-news",
        date: "2026-09-25",
        title: "최신 소식",
        excerpt: "최신 소식 요약",
        href: "https://source.example/latest",
      },
      {
        kind: "news",
        slug: "super-ai-finance-innovation-2025",
        date: "2025-08-18",
        title: "금융 AI 소식",
        excerpt: "윤상혁 교수 학술자문 참여",
        href: "https://source.example/finance",
      },
    ],
  });

  assert.deepEqual(collectHrefs(rendered), [
    "/news/latest-news",
    "/news/super-ai-finance-innovation-2025",
  ]);
});

test("news archive page is an indexable canonical sitemap route", async () => {
  const seo = await import("../src/lib/seo.ts");
  const entries = seo.createSitemapEntries(new URL("https://www.yoonity.kr/"));

  assert.equal(seo.PAGE_METADATA["/news"].alternates.canonical, "/news");
  assert.ok(entries.some(({ url }) => url === "https://www.yoonity.kr/news"));
});

test("news detail pages return to the crawlable news archive", async () => {
  const pageModule = await import("../src/app/news/[slug]/page.tsx");
  const rendered = await pageModule.default({
    params: Promise.resolve({ slug: "genai-edu-award-2024" }),
  });

  assert.equal(rendered.props.parentHref, "/news");
  assert.equal(rendered.props.breadcrumbs[2].href, "/news");
});
