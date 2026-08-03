import type { Member, Publication } from "./types";

const PAPER_CATEGORIES: Publication["category"][] = ["intl-paper", "domestic-paper"];

export function matchMemberPublications(
  member: Member,
  publications: Publication[]
): Publication[] {
  return publications.filter(
    (pub) =>
      PAPER_CATEGORIES.includes(pub.category) &&
      pub.authors?.includes(member.name)
  );
}
