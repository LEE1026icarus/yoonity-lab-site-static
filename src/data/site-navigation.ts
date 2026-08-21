export const ACTIVITY_SECTIONS = [
  { key: "project", label: "연구 과제", href: "/activities#project" },
  { key: "award", label: "수상내역", href: "/activities#award" },
  {
    key: "academic-award",
    label: "학회수상",
    href: "/activities#academic-award",
  },
  { key: "external", label: "대외", href: "/activities#external" },
] as const;

export const PUBLICATION_SECTIONS = [
  {
    key: "intl-paper",
    label: "해외 논문",
    href: "/publications#intl-paper",
  },
  {
    key: "domestic-paper",
    label: "국내 논문",
    href: "/publications#domestic-paper",
  },
  { key: "book", label: "도서", href: "/publications#book" },
  { key: "patent", label: "특허", href: "/publications#patent" },
] as const;

export const RESEARCHER_SECTIONS = [
  { key: "current", label: "연구원", href: "/researchers#current" },
  { key: "alumni", label: "졸업자", href: "/researchers#alumni" },
] as const;

export const MAIN_NAV_LINKS = [
  { label: "지도교수", href: "/professor", submenu: undefined },
  { label: "활동", href: "/activities", submenu: "activity" },
  { label: "출판", href: "/publications", submenu: "publication" },
  { label: "연구원", href: "/researchers", submenu: "researcher" },
] as const;

export const SUBMENU_LINKS = {
  activity: ACTIVITY_SECTIONS,
  publication: PUBLICATION_SECTIONS,
  researcher: RESEARCHER_SECTIONS,
} as const;
