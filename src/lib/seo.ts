import { INDEXABLE_ROUTES, siteUrl } from "./site.ts";

export const SITE_NAME = "Yoonity Lab";
export const HOME_TITLE =
  "동국대학교 경영정보학과 산업 문제 해결형 AI 연구실 | Yoonity Lab";
export const HOME_DESCRIPTION =
  "동국대학교 경영정보학과 Yoonity Lab은 AI·생성형 AI·양자컴퓨팅을 활용해 산업 의사결정, 예측·최적화 및 산학협력 과제를 연구합니다.";
export const GOOGLE_SITE_VERIFICATION = "-H57TbUoldZv4A5RCmg0eQMi7cCZgESj_Kuf4RB3Ekk";

export const SHARE_IMAGE = {
  url: new URL("/opengraph-image", siteUrl).toString(),
  width: 1200,
  height: 630,
  alt: "Yoonity Lab — 산업 문제 해결형 AI 연구실",
};

type IndexableRoute = (typeof INDEXABLE_ROUTES)[number];

type DetailMetadataInput = {
  route: string;
  title: string;
  description: string;
  type?: "website" | "article";
};

type PageMetadata = {
  title: string | { absolute: string };
  description: string;
  alternates: { canonical: IndexableRoute };
  openGraph: {
    type: "website";
    locale: string;
    siteName: string;
    title: string;
    description: string;
    url: string;
    images: (typeof SHARE_IMAGE)[];
  };
  twitter: {
    card: "summary_large_image";
    title: string;
    description: string;
    images: string[];
  };
};

function createPageMetadata(
  route: IndexableRoute,
  title: string,
  description: string,
  absoluteTitle = false,
): PageMetadata {
  const brandedTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: route },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      siteName: SITE_NAME,
      title: brandedTitle,
      description,
      url: new URL(route, siteUrl).toString(),
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: brandedTitle,
      description,
      images: [SHARE_IMAGE.url],
    },
  };
}

export function createDetailMetadata(
  { route, title, description, type = "website" }: DetailMetadataInput,
  baseUrl: URL = siteUrl,
) {
  const brandedTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: route },
    openGraph: {
      type,
      locale: "ko_KR",
      siteName: SITE_NAME,
      title: brandedTitle,
      description,
      url: new URL(route, baseUrl).toString(),
      images: [
        {
          ...SHARE_IMAGE,
          url: new URL("/opengraph-image", baseUrl).toString(),
        },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: brandedTitle,
      description,
      images: [new URL("/opengraph-image", baseUrl).toString()],
    },
  };
}

export const PAGE_METADATA = {
  "/": createPageMetadata("/", HOME_TITLE, HOME_DESCRIPTION, true),
  "/about": createPageMetadata(
    "/about",
    "연구실 소개·연구원 모집·산학협력",
    "Yoonity Lab의 연구 방향, 대학원생·학부연구생 모집, 기업·기관 산학협력, 연구실 자료와 소식을 확인하세요.",
  ),
  "/professor": createPageMetadata(
    "/professor",
    "윤상혁 교수 · 동국대학교 경영정보학과",
    "Yoonity Lab 지도교수 윤상혁 교수의 AI, 생성형 AI, 양자컴퓨팅과 주요 연구 분야를 소개합니다.",
  ),
  "/researchers": createPageMetadata(
    "/researchers",
    "연구진·졸업생",
    "Yoonity Lab의 대학원생, 학부연구생과 연구 분야, 졸업생 정보를 확인하세요.",
  ),
  "/publications": createPageMetadata(
    "/publications",
    "논문·도서·특허",
    "Yoonity Lab의 해외·국내 논문, 도서, 특허와 연구성과를 확인하세요.",
  ),
  "/activities": createPageMetadata(
    "/activities",
    "연구과제·수상·대외활동",
    "Yoonity Lab의 산학협력, 연구과제, 수상, 학술·대외활동 기록을 확인하세요.",
  ),
} satisfies Record<IndexableRoute, PageMetadata>;

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
