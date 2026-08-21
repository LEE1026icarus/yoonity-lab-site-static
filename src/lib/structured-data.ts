import { siteCopy } from "@/data/site-copy";
import type {
  NewsDetail,
  Professor,
  ProjectDetail,
  PublicationDetail,
} from "@/lib/types";
import { PAGE_METADATA } from "./seo";
import { siteUrl } from "./site";

type JsonPrimitive = string | number | boolean;
export type JsonLdValue = JsonPrimitive | JsonLdObject | JsonLdValue[];
export type JsonLdObject = {
  [key: string]: JsonLdValue | null | undefined;
};

function compactStructuredData(value: unknown): JsonLdValue | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "string") return value.trim() ? value : undefined;
  if (typeof value === "number" || typeof value === "boolean") return value;

  if (Array.isArray(value)) {
    const items = value
      .map(compactStructuredData)
      .filter((item): item is JsonLdValue => item !== undefined);
    return items.length ? items : undefined;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value).flatMap(([key, item]) => {
      const compacted = compactStructuredData(item);
      return compacted === undefined ? [] : [[key, compacted] as const];
    });
    return entries.length ? Object.fromEntries(entries) : undefined;
  }

  return undefined;
}

function compactObject(value: JsonLdObject): JsonLdObject {
  return compactStructuredData(value) as JsonLdObject;
}

function absoluteUrl(path: string, baseUrl: URL) {
  return new URL(path, baseUrl).toString();
}

function optionalWebUrl(value: string | undefined, baseUrl: URL) {
  if (!value?.trim()) return undefined;

  try {
    const url = new URL(value, baseUrl);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

function optionalExternalWebUrl(value: string | undefined) {
  if (!value?.trim()) return undefined;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

function organizationId(baseUrl: URL) {
  return absoluteUrl("/#organization", baseUrl);
}

export function createOrganizationStructuredData(
  baseUrl: URL = siteUrl,
): JsonLdObject {
  return compactObject({
    "@context": "https://schema.org",
    "@type": "ResearchOrganization",
    "@id": organizationId(baseUrl),
    name: "Yoonity Lab",
    alternateName: "yoonity",
    url: absoluteUrl("/", baseUrl),
    logo: absoluteUrl("/yoonity-logo-black.png", baseUrl),
    description: siteCopy.brand.description,
    email: siteCopy.contact.collaborationEmail,
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: "동국대학교",
    },
  });
}

export function createAboutPageStructuredData(
  baseUrl: URL = siteUrl,
): JsonLdObject {
  return compactObject({
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": absoluteUrl("/about#about-page", baseUrl),
    name: "Yoonity Lab 연구실 소개",
    description: PAGE_METADATA["/about"].description,
    url: absoluteUrl("/about", baseUrl),
    mainEntity: { "@id": organizationId(baseUrl) },
  });
}

export function createProfessorStructuredData(
  professor: Professor,
  baseUrl: URL = siteUrl,
): JsonLdObject {
  const pageUrl = absoluteUrl("/professor", baseUrl);
  const personId = absoluteUrl("/professor#person", baseUrl);
  const sameAs = professor.links.flatMap(({ href }) => {
    const url = optionalExternalWebUrl(href);
    return url ? [url] : [];
  });

  return compactObject({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": absoluteUrl("/professor#profile-page", baseUrl),
        name: `${professor.name} 교수 프로필 | Yoonity Lab`,
        description: PAGE_METADATA["/professor"].description,
        url: pageUrl,
        mainEntity: { "@id": personId },
        about: { "@id": organizationId(baseUrl) },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: professor.name,
        jobTitle: "교수",
        affiliation: {
          "@type": "Organization",
          name: "동국대학교 경영정보학과",
        },
        image: optionalWebUrl(professor.photo, baseUrl),
        email: professor.email,
        url: pageUrl,
        sameAs,
        knowsAbout: professor.expertise,
      },
    ],
  });
}

export function serializeJsonLd(value: unknown) {
  const compacted = compactStructuredData(value) ?? {};
  return JSON.stringify(compacted).replace(/</g, "\\u003c");
}

type DetailRecord = {
  kind: "news" | "projects" | "publications";
  slug: string;
  title: string;
  href?: string;
};

function detailPageUrl(record: DetailRecord, baseUrl: URL) {
  return absoluteUrl(`/${record.kind}/${record.slug}`, baseUrl);
}

function detailOrganizationReference(baseUrl: URL) {
  return { "@id": organizationId(baseUrl) };
}

function detailSourceUrl(href: string | undefined) {
  return optionalExternalWebUrl(href);
}

export function createNewsStructuredData(
  news: NewsDetail | undefined,
  baseUrl: URL = siteUrl,
): JsonLdObject {
  if (!news) return {};
  const url = detailPageUrl(news, baseUrl);

  return compactObject({
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${url}#news-article`,
    headline: news.title,
    name: news.title,
    description: news.excerpt,
    datePublished: news.date,
    url,
    mainEntityOfPage: { "@id": url },
    about: detailOrganizationReference(baseUrl),
    isBasedOn: detailSourceUrl(news.href),
  });
}

export function createProjectStructuredData(
  project: ProjectDetail | undefined,
  baseUrl: URL = siteUrl,
): JsonLdObject {
  if (!project) return {};
  const url = detailPageUrl(project, baseUrl);
  const description = [project.org, project.tag, project.period]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(" · ");

  return compactObject({
    "@context": "https://schema.org",
    "@type": "ResearchProject",
    "@id": `${url}#research-project`,
    name: project.title,
    description,
    url,
    mainEntityOfPage: { "@id": url },
    about: detailOrganizationReference(baseUrl),
    sponsor: project.org ? { "@type": "Organization", name: project.org } : undefined,
    isBasedOn: detailSourceUrl(project.href),
  });
}

export function createPublicationStructuredData(
  publication: PublicationDetail | undefined,
  baseUrl: URL = siteUrl,
): JsonLdObject {
  if (!publication) return {};
  const url = detailPageUrl(publication, baseUrl);
  const type = publication.category === "book"
    ? "Book"
    : publication.category === "patent"
      ? "CreativeWork"
      : "ScholarlyArticle";

  return compactObject({
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#publication`,
    name: publication.title,
    description: publication.meta,
    genre: publication.category === "patent" ? "특허" : undefined,
    identifier: publication.slug,
    url,
    mainEntityOfPage: { "@id": url },
    about: detailOrganizationReference(baseUrl),
    isBasedOn: detailSourceUrl(publication.href),
  });
}

export type BreadcrumbItem = { label: string; href: string };

export function createBreadcrumbStructuredData(
  items: BreadcrumbItem[],
  baseUrl: URL = siteUrl,
): JsonLdObject {
  return compactObject({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href, baseUrl),
    })),
  });
}
