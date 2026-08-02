import type { Metadata } from "next";
import { getMembers } from "@/lib/sheets";
import { MembersList } from "@/components/members-list";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "연구원 — yoonity",
  description: "Yoonity 연구실 연구원 및 졸업자",
};

export default async function ResearchersPage() {
  const members = await getMembers();

  return (
    <>
      <main className="mx-auto max-w-4xl flex-1 px-6 py-32">
        <ScrollReveal>
          <p className="text-[20px] font-semibold text-ink-muted">연구원</p>
          <h1 className="mt-3 text-[54px] font-black tracking-tight">
            하나의 팀, 무한한 가능성
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.08} className="mt-12">
          <MembersList members={members} />
        </ScrollReveal>
      </main>
      <SiteFooter />
    </>
  );
}
