import { INDEXABLE_ROUTES } from "./site.ts";

export const PAGE_METADATA = {
  "/": {
    title: "동국대학교 경영정보학과 산업 문제 해결형 AI 연구실 | Yoonity Lab",
    description:
      "동국대학교 경영정보학과 Yoonity Lab은 AI·생성형 AI·양자컴퓨팅을 활용해 산업 의사결정, 예측·최적화 및 산학협력 과제를 연구합니다.",
    alternates: { canonical: "/" },
  },
  "/about": {
    title: "연구실 소개·연구원 모집·산학협력",
    description:
      "Yoonity Lab의 연구 방향, 대학원생·학부연구생 모집, 기업·기관 산학협력, 연구실 자료와 소식을 확인하세요.",
    alternates: { canonical: "/about" },
  },
  "/professor": {
    title: "지도교수 — yoonity",
    description: "Yoonity 연구실 지도교수 소개",
    alternates: { canonical: "/professor" },
  },
  "/researchers": {
    title: "연구원 — yoonity",
    description: "Yoonity 연구실 연구원 및 졸업자",
    alternates: { canonical: "/researchers" },
  },
  "/publications": {
    title: "출판 — yoonity",
    description: "Yoonity 연구실의 해외/국내 논문, 도서, 특허",
    alternates: { canonical: "/publications" },
  },
  "/activities": {
    title: "활동 — yoonity",
    description: "Yoonity 연구실의 연구 과제, 수상내역, 학회수상, 대외 활동",
    alternates: { canonical: "/activities" },
  },
} as const;

export function createRobotsConfig(siteUrl: URL) {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
    host: siteUrl.origin,
  };
}

export function createSitemapEntries(siteUrl: URL) {
  return INDEXABLE_ROUTES.map((route) => ({
    url: new URL(route, siteUrl).toString(),
    changeFrequency: route === "/" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "/" ? 1 : 0.8,
  }));
}
