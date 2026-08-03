export type Article = {
  id: string;
  date: string;
  title: string;
  excerpt: string;
  accent: "ai" | "genai" | "quantum";
  href: string;
  thumbnail?: string;
};

export type ResearchAxis = {
  id: string;
  color: "ai" | "genai" | "quantum";
  tag: string;
  title: string;
  titleEn: string;
  description: string;
  keywords: string[];
};

export type TimelineEntry = {
  id: string;
  org: string;
  role: string;
  location: string;
  period: string;
  bullets?: string[];
};

export type Professor = {
  name: string;
  title: string;
  email: string;
  photo?: string;
  links: { label: string; href: string }[];
  expertise: string[];
  career: TimelineEntry[];
  education: TimelineEntry[];
  skills: string[];
  other: TimelineEntry[];
};

export type ActivityCategory = "project" | "award" | "academic-award" | "external";

export type Activity = {
  id: string;
  category: ActivityCategory;
  title: string;
  org?: string;
  tag?: string;
  period: string;
};

export type PublicationCategory = "intl-paper" | "domestic-paper" | "book" | "patent";

export type Publication = {
  id: string;
  category: PublicationCategory;
  title: string;
  meta?: string;
  href?: string;
  authors?: string[];
};

export type MemberStatus = "current" | "alumni";

export type Member = {
  id: string;
  name: string;
  isLabHead?: boolean;
  role: string;
  affiliation: string;
  email?: string;
  status: MemberStatus;
  photo?: string;
  researchField?: string[];
  period?: string;
  currentAffiliation?: string;
};
