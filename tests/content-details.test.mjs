import assert from "node:assert/strict";
import test from "node:test";

import {
  createDetailSitemapEntries,
  detailDescription,
  detailMetadataTitle,
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
  assert.equal(
    metadata.openGraph.images[0].url,
    "https://lab.example.edu/projects/opengraph-image",
  );
  assert.deepEqual(metadata.twitter.images, [
    "https://lab.example.edu/projects/opengraph-image",
  ]);
  assert.equal(metadata.twitter.card, "summary_large_image");
});

test("detail descriptions enrich short records, remove repeated branding, and stay bounded", () => {
  const shortNews = detailDescription("news", {
    title: "AI 연구소 출범",
    excerpt: "관련 공식 소식",
  });
  const shortProject = detailDescription("projects", {
    title: "의료 AI 연구",
    org: "하나로병원",
    period: "2026.01 ~ 2026.12",
  });
  const repeatedBrand = detailDescription("publications", {
    title: "시청자의 온라인 리뷰를 활용한 가치측정",
  });
  const longNews = detailDescription("news", {
    title: "긴 연구실 소식",
    excerpt: "가".repeat(220),
  });

  for (const description of [shortNews, shortProject, repeatedBrand, longNews]) {
    assert.ok(description.length >= 30, description);
    assert.ok(description.length <= 160, description);
  }
  assert.match(shortNews, /AI 연구소 출범/);
  assert.match(shortProject, /하나로병원/);
  assert.doesNotMatch(repeatedBrand, /Yoonity Lab Yoonity Lab/);
});

test("publication metadata extracts a concise work title from a full citation", () => {
  const english = detailMetadataTitle(
    "publications",
    "Lee, S., & Yoon, S. H. (2026). Evolving dynamics of resistance and adoption in digital finance: A user review analysis of FinTech and traditional banking applications. Electronic Markets, 36(1), 45.",
  );
  const korean = detailMetadataTitle(
    "publications",
    "이선녕, 구민규, 윤상혁. (2026). 핀테크 앱 리뷰에서 주제-주관성 상호작용이 유용성에 미치는 영향: PPM 기반 ZINB 모형 분석. 경영학연구, 55(2), 953-972.",
  );

  assert.match(english, /^Evolving dynamics of resistance and adoption/);
  assert.doesNotMatch(english, /Lee, S\.|Electronic Markets/);
  assert.match(korean, /^핀테크 앱 리뷰에서 주제-주관성 상호작용/);
  assert.doesNotMatch(korean, /이선녕|경영학연구/);
  assert.ok(english.length <= 56);
  assert.ok(korean.length <= 56);
});

test("detail fallback descriptions remain unique and bounded", () => {
  const first = detailDescription("publications", {
    title: "첫 번째 연구",
  });
  const second = detailDescription("publications", {
    title: "두 번째 연구",
  });

  assert.notEqual(first, second);
  assert.match(first, /첫 번째 연구/);
  assert.ok(first.length <= 160);
});

test("publication detail preserves optional editorial fields", async () => {
  const publication = await getPublicationDetail("intl-0");

  assert.ok("displayTitle" in publication);
  assert.ok("summary" in publication);
  assert.ok("publishedAt" in publication);
  assert.ok("venue" in publication);
  assert.ok("doi" in publication);
  assert.ok("updatedAt" in publication);
});
