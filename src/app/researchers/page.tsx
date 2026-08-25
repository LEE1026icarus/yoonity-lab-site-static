import type { Metadata } from "next";
import { getMembers, getPublications } from "@/lib/sheets";
import { matchMemberPublications } from "@/lib/member-publications";
import { MembersList } from "@/components/members-list";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SiteFooter } from "@/components/site-footer";
import { PAGE_METADATA } from "@/lib/seo";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = PAGE_METADATA["/researchers"];

export const revalidate = 60;

export default async function ResearchersPage() {
  const [members, publications] = await Promise.all([
    getMembers(),
    getPublications(),
  ]);

  const membersWithPublications = members.map((member) => ({
    ...member,
    publications: matchMemberPublications(member, publications),
  }));

  return (
    <>
      <main className="mx-auto w-full min-w-0 max-w-4xl flex-1 px-6 py-32">
        <Breadcrumbs items={[{ label: "홈", href: "/" }, { label: "연구진·졸업생", href: "/researchers" }]} />
        <ScrollReveal>
          <p className="text-[20px] font-semibold text-ink-muted">연구원</p>
          <h1 className="mt-3 text-[54px] font-black tracking-tight">
            실제 문제를 함께 연구하는 사람들
          </h1>
          <p className="mt-4 max-w-3xl text-[18px] leading-relaxed text-ink-muted">
            서로 다른 관심과 경험을 연결해 산업과 사회의 문제를 연구 성과로 발전시킵니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.08} className="mt-12">
          <MembersList members={membersWithPublications} />
        </ScrollReveal>
      </main>
      <SiteFooter />
    </>
  );
}
