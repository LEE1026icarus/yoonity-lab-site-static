import assert from "node:assert/strict";
import test from "node:test";

import {
  createDetailSitemapEntries,
  getDetailParams,
  getNewsDetail,
  getProjectDetail,
  getPublicationDetail,
} from "../src/lib/content-details.ts";
import { createDetailMetadata } from "../src/lib/seo.ts";

const baseUrl = new URL("https://lab.example.edu/");

test("detail loaders resolve repository-backed fallback records by safe id", async () => {
  const news = await getNewsDetail("genai-edu-award-2024");
  const project = await getProjectDetail("project-1");
  const publication = await getPublicationDetail("intl-0");

  assert.deepEqual(
    {
      title: news.title,
      date: news.date,
      excerpt: news.excerpt,
      href: news.href,
    },
    {
      title: "한기대, '생성형 AI 활용 교육 혁신 우수사례 공모전 발표회' 개최",
      date: "2024-12-05",
      excerpt: "AI 교수님과 채팅, 영화와 동화책 제작, 팀 프로젝트로 학업성취도 향상",
      href: "https://www.yoonity.kr/%EB%89%B4%EC%8A%A4-%EA%B8%B0%EC%82%AC/1",
    },
  );
  assert.deepEqual(
    {
      title: project.title,
      org: project.org,
      period: project.period,
    },
    {
      title: "올바로 시스템 관련 상하위법 챗봇 개발",
      org: "벨텍소프트",
      period: "2025.06 ~ 2025.12",
    },
  );
  assert.equal(
    publication.title,
    "Lee, S., & Yoon, S. H. (2026). Evolving dynamics of resistance and adoption in digital finance: A user review analysis of FinTech and traditional banking applications. Electronic Markets, 36(1), 45.",
  );
});

test("detail loaders reject missing and unsafe ids", async () => {
  assert.equal(await getNewsDetail("missing-news"), undefined);
  assert.equal(await getProjectDetail("../project-1"), undefined);
  assert.equal(await getPublicationDetail("publication/1"), undefined);
});

test("detail params expose only valid records and sitemap keeps static routes", async () => {
  const newsParams = await getDetailParams("news");
  const projectParams = await getDetailParams("projects");
  const publicationParams = await getDetailParams("publications");
  const sitemap = await createDetailSitemapEntries(baseUrl);
  const urls = sitemap.map((entry) => entry.url);

  assert.ok(newsParams.some(({ slug }) => slug === "genai-edu-award-2024"));
  assert.ok(projectParams.some(({ slug }) => slug === "project-1"));
  assert.ok(publicationParams.some(({ slug }) => slug === "intl-0"));
  assert.ok(urls.includes("https://lab.example.edu/"));
  assert.ok(urls.includes("https://lab.example.edu/about"));
  assert.ok(urls.includes("https://lab.example.edu/news/genai-edu-award-2024"));
  assert.ok(urls.includes("https://lab.example.edu/projects/project-1"));
  assert.ok(urls.includes("https://lab.example.edu/publications/intl-0"));
});

test("detail metadata uses the detail canonical and share metadata", () => {
  const metadata = createDetailMetadata(
    {
      route: "/projects/project-1",
      title: "올바로 시스템 관련 상하위법 챗봇 개발",
      description: "벨텍소프트와 수행한 연구과제입니다.",
    },
    baseUrl,
  );

  assert.equal(metadata.alternates.canonical, "/projects/project-1");
  assert.equal(metadata.title, "올바로 시스템 관련 상하위법 챗봇 개발");
  assert.equal(metadata.description, "벨텍소프트와 수행한 연구과제입니다.");
  assert.equal(metadata.openGraph.url, "https://lab.example.edu/projects/project-1");
  assert.equal(metadata.twitter.card, "summary_large_image");
});
