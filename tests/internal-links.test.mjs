import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const footerPath = new URL("../src/components/site-footer.tsx", import.meta.url);
const axesPath = new URL("../src/components/research-axes.tsx", import.meta.url);
const aboutPath = new URL("../src/app/about/page.tsx", import.meta.url);
const professorPath = new URL("../src/app/professor/page.tsx", import.meta.url);
const sharedPagePaths = [
  new URL("../src/app/about/page.tsx", import.meta.url),
  new URL("../src/app/professor/page.tsx", import.meta.url),
  new URL("../src/app/researchers/page.tsx", import.meta.url),
  new URL("../src/app/publications/page.tsx", import.meta.url),
  new URL("../src/app/activities/page.tsx", import.meta.url),
];
const detailRoutePaths = [
  new URL("../src/app/news/[slug]/page.tsx", import.meta.url),
  new URL("../src/app/projects/[slug]/page.tsx", import.meta.url),
  new URL("../src/app/publications/[slug]/page.tsx", import.meta.url),
];

function countPath(source, path) {
  return source.split(`"${path}"`).length - 1;
}

test("footer exposes every major page through crawlable links", async () => {
  const footer = await readFile(footerPath, "utf8");

  for (const [label, href] of [
    ["연구실 소개", "/about"],
    ["지도교수", "/professor"],
    ["연구원", "/researchers"],
    ["논문·도서·특허", "/publications"],
    ["연구과제·활동", "/activities"],
  ]) {
    assert.match(footer, new RegExp(label));
    assert.match(footer, new RegExp(`href="${href}"`));
  }

  assert.match(footer, /<nav[^>]+aria-label="주요 페이지"/);
  assert.doesNotMatch(footer, /href=""/);
});

test("research axes link to relevant destinations with descriptive copy", async () => {
  const axes = await readFile(axesPath, "utf8");

  assert.equal(countPath(axes, "/publications"), 2);
  assert.equal(countPath(axes, "/activities"), 1);
  assert.match(axes, /관련 논문·연구성과/);
  assert.match(axes, /관련 연구과제·활동/);
  assert.match(axes, /Quantum-AI 연구성과/);
  assert.doesNotMatch(axes, />\s*자세히 보기\s*</);
  assert.doesNotMatch(axes, /href=""/);
});

test("About and professor copy provides the requested contextual links", async () => {
  const [about, professor] = await Promise.all([
    readFile(aboutPath, "utf8"),
    readFile(professorPath, "utf8"),
  ]);

  for (const path of ["/publications", "/activities", "/researchers"]) {
    assert.match(about, new RegExp(`href="${path}"`));
  }
  assert.match(about, /논문·도서·특허/);
  assert.match(about, /연구과제·수상·대외활동/);
  assert.match(about, /현재 연구진과 졸업생/);

  assert.match(professor, /href="\/publications"/);
  assert.match(professor, /논문·도서·특허에서 연구성과/);
  assert.doesNotMatch(`${about}${professor}`, /href=""/);
});

test("detail route families expose metadata, static params, and not-found handling", async () => {
  for (const path of detailRoutePaths) {
    let exists = true;
    try {
      await access(path);
    } catch {
      exists = false;
    }
    assert.equal(exists, true, `${path.pathname} must exist`);
    const source = await readFile(path, "utf8");
    assert.match(source, /export const revalidate = 60/);
    assert.match(source, /generateStaticParams/);
    assert.match(source, /generateMetadata/);
    assert.match(source, /notFound\(\)/);
  }
});

test("lists expose crawlable internal detail destinations", async () => {
  const [aboutNews, articles, activities, publications] = await Promise.all([
    readFile(new URL("../src/components/about-news.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/related-articles.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/activities-list.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/publications-list.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(aboutNews, /\/news\//);
  assert.match(articles, /\/news\//);
  assert.match(activities, /\/projects\//);
  assert.match(publications, /\/publications\//);
});

test("all non-home indexable pages render the shared Breadcrumbs component", async () => {
  const pages = await Promise.all(sharedPagePaths.map((path) => readFile(path, "utf8")));

  for (const page of pages) assert.match(page, /<Breadcrumbs/);
});

test("sitemap appends detail entries from the shared loader", async () => {
  const sitemap = await readFile(new URL("../src/app/sitemap.ts", import.meta.url), "utf8");

  assert.match(sitemap, /createDetailSitemapEntries/);
  assert.match(sitemap, /export default async function sitemap/);
});
