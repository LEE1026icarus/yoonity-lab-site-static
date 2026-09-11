import { cache } from "react";
import type {
  Article,
  NewsDetail,
  ProjectDetail,
  PublicationDetail,
} from "./types";
import {
  createSitemapEntries,
  SITE_NAME,
} from "./seo";
import { getAboutPageData, getActivities, getArticles, getPublications } from "./sheets";

export type DetailKind = "news" | "projects" | "publications";

const SAFE_SLUG = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;

export function isSafeDetailSlug(value: string) {
  return SAFE_SLUG.test(value);
}

function toIsoDate(value: string) {
  return value.includes(".") ? value.replaceAll(".", "-") : value;
}

const getAllNews = cache(async (): Promise<NewsDetail[]> => {
  const [about, articles] = await Promise.all([getAboutPageData(), getArticles()]);
  const merged = new Map<string, NewsDetail>();

  for (const article of articles) {
    if (!isSafeDetailSlug(article.id)) continue;
    merged.set(article.id, {
      kind: "news",
      slug: article.id,
      date: toIsoDate(article.date),
      title: article.title,
      excerpt: article.excerpt,
      href: article.href,
      accent: article.accent,
      thumbnail: article.thumbnail,
      updatedAt: article.updatedAt,
    });
  }

  for (const item of about.news) {
    if (!isSafeDetailSlug(item.id)) continue;
    const existing = merged.get(item.id);
    merged.set(item.id, {
      kind: "news",
      slug: item.id,
      date: toIsoDate(item.date),
      title: item.title,
      excerpt: item.excerpt,
      href: item.href,
      accent: existing?.accent,
      thumbnail: existing?.thumbnail,
      updatedAt: existing?.updatedAt,
    });
  }

  return [...merged.values()].sort((a, b) => b.date.localeCompare(a.date));
});

const getAllProjects = cache(async (): Promise<ProjectDetail[]> =>
  (await getActivities())
    .filter((activity) => activity.category === "project" && isSafeDetailSlug(activity.id))
    .map((activity) => ({
      kind: "projects" as const,
      slug: activity.id,
      title: activity.title,
      org: activity.org,
      tag: activity.tag,
      period: activity.period,
      href: activity.href,
      summary: activity.summary,
      updatedAt: activity.updatedAt,
    })),
);

const getAllPublications = cache(async (): Promise<PublicationDetail[]> =>
  (await getPublications())
    .filter((publication) => isSafeDetailSlug(publication.id))
    .map((publication) => ({
      ...publication,
      kind: "publications" as const,
      slug: publication.id,
      displayTitle: publication.displayTitle,
      summary: publication.summary,
      publishedAt: publication.publishedAt,
      venue: publication.venue,
      doi: publication.doi,
      updatedAt: publication.updatedAt,
    })),
);

export async function getNewsDetail(slug: string) {
  if (!isSafeDetailSlug(slug)) return undefined;
  return (await getAllNews()).find((item) => item.slug === slug);
}

export async function getProjectDetail(slug: string) {
  if (!isSafeDetailSlug(slug)) return undefined;
  return (await getAllProjects()).find((item) => item.slug === slug);
}

export async function getPublicationDetail(slug: string) {
  if (!isSafeDetailSlug(slug)) return undefined;
  return (await getAllPublications()).find((item) => item.slug === slug);
}

export async function getDetailParams(kind: DetailKind) {
  const items =
    kind === "news"
      ? await getAllNews()
      : kind === "projects"
        ? await getAllProjects()
        : await getAllPublications();
  return items.map(({ slug }) => ({ slug }));
}

function detailUrl(kind: DetailKind, slug: string, baseUrl: URL) {
  return new URL(`/${kind}/${slug}`, baseUrl).toString();
}

export async function createDetailSitemapEntries(baseUrl: URL) {
  const [news, projects, publications] = await Promise.all([
    getDetailParams("news"),
    getDetailParams("projects"),
    getDetailParams("publications"),
  ]);

  return [
    ...createSitemapEntries(baseUrl),
    ...news.map(({ slug }) => ({
      url: detailUrl("news", slug, baseUrl),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...projects.map(({ slug }) => ({
      url: detailUrl("projects", slug, baseUrl),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...publications.map(({ slug }) => ({
      url: detailUrl("publications", slug, baseUrl),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}

export function detailDescription(
  kind: DetailKind,
  fields: {
    title?: string;
    excerpt?: string;
    meta?: string;
    org?: string;
    period?: string;
  },
) {
  const content = [fields.excerpt, fields.meta, fields.org, fields.period]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(" · ");
  if (content) return content;

  const labels: Record<DetailKind, string> = {
    news: "연구실 소식",
    projects: "Yoonity Lab 연구과제",
    publications: "Yoonity Lab 연구성과",
  };
  const subject = fields.title?.trim();
  return truncateText(
    subject
      ? `${subject} — ${SITE_NAME} ${labels[kind]}`
      : `${SITE_NAME} ${labels[kind]} 상세 기록`,
    160,
  );
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  const shortened = value.slice(0, maxLength - 1);
  const wordBoundary = shortened.lastIndexOf(" ");
  const end = wordBoundary >= Math.floor(maxLength * 0.65)
    ? wordBoundary
    : shortened.length;
  return `${shortened.slice(0, end).trimEnd()}…`;
}

export function detailMetadataTitle(kind: DetailKind, title: string) {
  const normalized = title.trim();
  if (kind !== "publications") return truncateText(normalized, 56);

  const citationBody = normalized.match(/\(\d{4}\)\.\s*(.+)/)?.[1] ?? normalized;
  const workTitle = citationBody.match(/^(.+?)\.\s+[^.]+(?:,|$)/)?.[1] ?? citationBody;
  return truncateText(workTitle, 56);
}

export function detailPath(kind: DetailKind, slug: string) {
  return `/${kind}/${slug}`;
}

export function articleToNewsDetail(article: Article): NewsDetail {
  return {
    kind: "news",
    slug: article.id,
    date: toIsoDate(article.date),
    title: article.title,
    excerpt: article.excerpt,
    href: article.href,
    accent: article.accent,
    thumbnail: article.thumbnail,
    updatedAt: article.updatedAt,
  };
}
