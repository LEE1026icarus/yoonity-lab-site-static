import assert from "node:assert/strict";
import test from "node:test";

import {
  INDEXABLE_ROUTES,
  resolveSiteUrl,
  siteUrl,
} from "../src/lib/site.ts";
import {
  createRobotsConfig,
  createSitemapEntries,
  PAGE_METADATA,
} from "../src/lib/seo.ts";
import {
  ACTIVITY_SECTIONS,
  PUBLICATION_SECTIONS,
  RESEARCHER_SECTIONS,
} from "../src/data/site-navigation.ts";

test("site URL prefers the explicit canonical domain and normalizes its path", () => {
  const url = resolveSiteUrl({
    NEXT_PUBLIC_SITE_URL: "https://lab.example.edu/some/path",
    VERCEL_PROJECT_PRODUCTION_URL: "preview.vercel.app",
  });

  assert.equal(url.href, "https://lab.example.edu/");
});

test("site URL uses Vercel's production domain when no custom domain is configured", () => {
  const url = resolveSiteUrl({
    VERCEL_PROJECT_PRODUCTION_URL: "yoonity-lab-site-static.vercel.app",
  });

  assert.equal(url.href, "https://yoonity-lab-site-static.vercel.app/");
});

test("site URL uses localhost only outside a configured deployment", () => {
  assert.equal(resolveSiteUrl({}).href, "http://localhost:3000/");
});

test("robots advertises the canonical sitemap without blocking public routes", () => {
  const robots = createRobotsConfig(new URL("https://lab.example.edu"));

  assert.deepEqual(robots, {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://lab.example.edu/sitemap.xml",
    host: "https://lab.example.edu",
  });
});

test("sitemap emits each indexable route exactly once on the canonical origin", () => {
  const entries = createSitemapEntries(new URL("https://lab.example.edu"));

  assert.deepEqual(
    entries.map((entry) => entry.url),
    [
      "https://lab.example.edu/",
      "https://lab.example.edu/about",
      "https://lab.example.edu/professor",
      "https://lab.example.edu/researchers",
      "https://lab.example.edu/publications",
      "https://lab.example.edu/activities",
    ],
  );
  assert.equal(new Set(entries.map((entry) => entry.url)).size, INDEXABLE_ROUTES.length);
});

test("every indexable page declares a self-referencing canonical URL", () => {
  assert.deepEqual(Object.keys(PAGE_METADATA), [...INDEXABLE_ROUTES]);

  for (const route of INDEXABLE_ROUTES) {
    assert.equal(PAGE_METADATA[route].alternates.canonical, route);
  }
});

test("home and about metadata reflect the current research and audience intent", () => {
  const homeTitle =
    typeof PAGE_METADATA["/"].title === "string"
      ? PAGE_METADATA["/"].title
      : PAGE_METADATA["/"].title.absolute;

  assert.match(homeTitle, /동국대학교 경영정보학과/);
  assert.match(PAGE_METADATA["/"].description, /AI·생성형 AI·양자컴퓨팅/);
  assert.match(PAGE_METADATA["/about"].title, /연구원 모집·산학협력/);
  assert.match(PAGE_METADATA["/about"].description, /대학원생·학부연구생/);
});

test("subpage metadata targets each route without duplicating the title template", () => {
  assert.match(
    PAGE_METADATA["/professor"].title,
    /윤상혁 교수.*동국대학교 경영정보학과/,
  );
  assert.match(
    PAGE_METADATA["/professor"].description,
    /지도교수.*AI.*생성형 AI.*양자컴퓨팅.*연구 분야/,
  );
  assert.match(PAGE_METADATA["/researchers"].title, /연구진·졸업생/);
  assert.match(
    PAGE_METADATA["/researchers"].description,
    /대학원생.*학부연구생.*연구 분야.*졸업생/,
  );
  assert.match(PAGE_METADATA["/publications"].title, /논문·도서·특허/);
  assert.match(
    PAGE_METADATA["/publications"].description,
    /해외.*국내.*논문.*도서.*특허.*연구성과/,
  );
  assert.match(PAGE_METADATA["/activities"].title, /연구과제·수상·대외활동/);
  assert.match(
    PAGE_METADATA["/activities"].description,
    /산학협력.*연구과제.*수상.*학술.*대외활동/,
  );

  for (const route of INDEXABLE_ROUTES.slice(1)) {
    assert.doesNotMatch(PAGE_METADATA[route].title, /Yoonity Lab/);
  }
});

test("every page has route-consistent Open Graph and Twitter metadata", () => {
  const shareImageUrl = new URL("/opengraph-image", siteUrl).toString();

  for (const route of INDEXABLE_ROUTES) {
    const entry = PAGE_METADATA[route];
    const pageUrl = new URL(route, siteUrl).toString();

    assert.equal(entry.openGraph.url, pageUrl);
    assert.equal(entry.openGraph.type, "website");
    assert.equal(entry.openGraph.locale, "ko_KR");
    assert.equal(entry.openGraph.siteName, "Yoonity Lab");
    assert.deepEqual(entry.openGraph.images, [
      {
        url: shareImageUrl,
        width: 1200,
        height: 630,
        alt: "Yoonity Lab — 산업 문제 해결형 AI 연구실",
      },
    ]);
    assert.equal(entry.twitter.card, "summary_large_image");
    assert.deepEqual(entry.twitter.images, [shareImageUrl]);
    assert.equal(entry.twitter.description, entry.description);
  }

  assert.deepEqual(PAGE_METADATA["/"].title, {
    absolute: PAGE_METADATA["/"].openGraph.title,
  });
  assert.equal(PAGE_METADATA["/about"].openGraph.url, new URL("/about", siteUrl).toString());
  assert.match(PAGE_METADATA["/about"].openGraph.title, /연구실 소개/);
  assert.equal(
    PAGE_METADATA["/about"].openGraph.title.match(/Yoonity Lab/g)?.length,
    1,
  );
});

test("category navigation uses crawlable anchors instead of duplicate query URLs", () => {
  const sections = [
    ...ACTIVITY_SECTIONS,
    ...PUBLICATION_SECTIONS,
    ...RESEARCHER_SECTIONS,
  ];

  assert.deepEqual(
    ACTIVITY_SECTIONS.map(({ key }) => key),
    ["project", "award", "academic-award", "external"],
  );
  assert.deepEqual(
    PUBLICATION_SECTIONS.map(({ key }) => key),
    ["intl-paper", "domestic-paper", "book", "patent"],
  );
  assert.deepEqual(
    RESEARCHER_SECTIONS.map(({ key }) => key),
    ["current", "alumni"],
  );
  assert.ok(sections.every(({ href }) => href.includes("#")));
  assert.ok(sections.every(({ href }) => !href.includes("?")));
});
