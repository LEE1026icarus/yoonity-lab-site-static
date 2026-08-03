import type {
  Activity,
  Article,
  Member,
  Professor,
  Publication,
  TimelineEntry,
} from "./types";
import { mockArticles } from "@/data/mock-articles";
import { professor as mockProfessor } from "@/data/mock-professor";
import { mockActivities } from "@/data/mock-activities";
import { mockPublications } from "@/data/mock-publications";
import { mockMembers } from "@/data/mock-members";
import { fetchSheetRows, updateSheetCell } from "./google-sheets-client";

export async function getArticles(): Promise<Article[]> {
  const rows = await fetchSheetRows("articles");
  if (rows.length === 0) return mockArticles;
  return rows.map((r) => ({
    id: r.id,
    date: r.date,
    title: r.title,
    excerpt: r.excerpt,
    accent: (r.accent as Article["accent"]) || "ai",
    href: r.href || "#",
    thumbnail: r.thumbnail || undefined,
  }));
}

function toTimelineEntry(r: Record<string, string>): TimelineEntry {
  return {
    id: r.id,
    org: r.org,
    role: r.role,
    location: r.location,
    period: r.period,
    bullets: r.bullets ? r.bullets.split(";").filter(Boolean) : undefined,
  };
}

export async function getProfessor(): Promise<Professor> {
  const [profileRows, timelineRows] = await Promise.all([
    fetchSheetRows("professor"),
    fetchSheetRows("professor_timeline"),
  ]);
  if (profileRows.length === 0 || timelineRows.length === 0) return mockProfessor;

  const p = profileRows[0];
  const links = p.links
    ? p.links.split(";").filter(Boolean).map((pair) => {
        const [label, href] = pair.split("|");
        return { label, href };
      })
    : [];

  return {
    name: p.name,
    title: p.title,
    email: p.email,
    photo: p.photo || undefined,
    links,
    expertise: p.expertise ? p.expertise.split(";").filter(Boolean) : [],
    skills: p.skills ? p.skills.split(";").filter(Boolean) : [],
    career: timelineRows.filter((r) => r.section === "career").map(toTimelineEntry),
    education: timelineRows.filter((r) => r.section === "education").map(toTimelineEntry),
    other: timelineRows.filter((r) => r.section === "other").map(toTimelineEntry),
  };
}

export async function getActivities(): Promise<Activity[]> {
  const rows = await fetchSheetRows("activities");
  if (rows.length === 0) return mockActivities;
  return rows.map((r) => ({
    id: r.id,
    category: r.category as Activity["category"],
    title: r.title,
    org: r.org || undefined,
    tag: r.tag || undefined,
    period: r.period,
    href: r.href || undefined,
  }));
}

export async function getPublications(): Promise<Publication[]> {
  const rows = await fetchSheetRows("publications");
  if (rows.length === 0) return mockPublications;
  return rows.map((r) => ({
    id: r.id,
    category: r.category as Publication["category"],
    title: r.title,
    meta: r.meta || undefined,
    href: r.href || undefined,
    authors: r.authors
      ? r.authors.split(";").map((s) => s.trim()).filter(Boolean)
      : undefined,
  }));
}

export async function getMembers(): Promise<Member[]> {
  const rows = await fetchSheetRows("members");
  if (rows.length === 0) return mockMembers;
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    isLabHead: r.isLabHead?.toUpperCase() === "TRUE",
    role: r.role,
    affiliation: r.affiliation,
    email: r.email || undefined,
    status: r.status as Member["status"],
    photo: r.photo || undefined,
    researchField: r.researchField
      ? r.researchField.split(";").filter(Boolean)
      : undefined,
    period: r.period || undefined,
    currentAffiliation: r.currentAffiliation || undefined,
  }));
}

export async function updatePublicationHref(
  publicationTitle: string,
  href: string
): Promise<boolean> {
  const rows = await fetchSheetRows("publications");
  if (rows.length === 0) return false;

  const rowIndex = rows.findIndex((r) => r.title === publicationTitle);
  if (rowIndex === -1) return false;

  const rowNum = rowIndex + 2;
  const success = await updateSheetCell("publications", `F${rowNum}`, href);
  return success;
}
