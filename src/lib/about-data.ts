import type {
  AboutChannel,
  AboutNewsItem,
  AboutPageData,
  AboutResource,
} from "./types";

type SheetRows = Record<string, string>[];

export type AboutSheetRows = {
  settings: SheetRows;
  resources: SheetRows;
  channels: SheetRows;
  news: SheetRows;
};

const isVisible = (value: string) => value.trim().toUpperCase() !== "FALSE";
const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const toOrder = (value: string, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

function toExternalHref(value: string): string | null {
  const href = value.trim();
  if (!/^https?:\/\/[^/\\?#\s]/i.test(href) || href.includes("\\")) return null;

  try {
    const url = new URL(href);
    return (url.protocol === "http:" || url.protocol === "https:") && url.hostname
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function toCalendarDate(value: string): string | null {
  const date = value.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return month >= 1 && month <= 12 && day >= 1 && day <= lastDay ? date : null;
}

function channelHref(row: Record<string, string>): string | null {
  const href = toExternalHref(row.href ?? "");
  if (href) return href;

  const status = row.status?.trim() ?? "";
  const statusHref = toExternalHref(status);
  if (statusHref) return statusHref;
  if (row.id?.trim().toLowerCase() === "blog" && /@naver\.com$/i.test(status)) {
    return `https://blog.naver.com/${status.split("@")[0]}`;
  }
  return null;
}

const sortByOrder = <T extends { order: number }>(items: T[]) =>
  [...items].sort((a, b) => a.order - b.order);

const sortNews = (items: AboutNewsItem[]) =>
  [...items].sort(
    (a, b) => b.date.localeCompare(a.date) || a.order - b.order || a.id.localeCompare(b.id),
  );

export function normalizeAboutPageData(
  rows: AboutSheetRows,
  fallback: AboutPageData,
): AboutPageData {
  const configuredEmail = rows.settings.find((row) => row.key === "collaboration_email")?.value;
  const configuredRecruitmentHref = rows.settings.find(
    (row) => row.key === "recruitment_href",
  )?.value;

  const resources = rows.resources
    .flatMap((row, index): AboutResource[] => {
      const href = toExternalHref(row.href ?? "");
      if (!isVisible(row.visible ?? "") || !row.id || !row.title || !href) return [];
      return [{
        id: row.id,
        title: row.title,
        description: row.description ?? "",
        href,
        order: toOrder(row.order ?? "", index + 1),
      }];
    })
    .sort((a, b) => a.order - b.order);

  const channels = rows.channels
    .flatMap((row, index): AboutChannel[] => {
      if (!isVisible(row.visible ?? "") || !row.id || !row.title) return [];
      const href = channelHref(row);
      return [{
        id: row.id,
        title: row.title,
        ...(href ? { href } : {}),
        status: href ? "active" : "coming-soon",
        order: toOrder(row.order ?? "", index + 1),
      }];
    })
    .sort((a, b) => a.order - b.order);

  const news = rows.news
    .flatMap((row, index): AboutNewsItem[] => {
      const href = toExternalHref(row.href ?? "");
      const date = toCalendarDate(row.date ?? "");
      if (!isVisible(row.visible ?? "") || !row.id || !date || !row.title || !href) return [];
      return [{
        id: row.id,
        date,
        title: row.title,
        excerpt: row.excerpt ?? "",
        href,
        order: toOrder(row.order ?? "", index + 1),
      }];
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.order - b.order || a.id.localeCompare(b.id));

  const recruitmentHref = toExternalHref(configuredRecruitmentHref ?? "");
  return {
    collaborationEmail:
      configuredEmail && isEmail(configuredEmail)
        ? configuredEmail
        : fallback.collaborationEmail,
    recruitmentHref: recruitmentHref ?? fallback.recruitmentHref,
    resources: resources.length ? resources : sortByOrder(fallback.resources),
    channels: channels.length ? channels : sortByOrder(fallback.channels),
    news: news.length ? news : sortNews(fallback.news),
  };
}
