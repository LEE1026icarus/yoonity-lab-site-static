import assert from "node:assert/strict";
import test from "node:test";

import {
  INDEXABLE_ROUTES,
  resolveSiteUrl,
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
  assert.match(PAGE_METADATA["/"].title, /동국대학교 경영정보학과/);
  assert.match(PAGE_METADATA["/"].description, /AI·생성형 AI·양자컴퓨팅/);
  assert.match(PAGE_METADATA["/about"].title, /연구원 모집·산학협력/);
  assert.match(PAGE_METADATA["/about"].description, /대학원생·학부연구생/);
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
