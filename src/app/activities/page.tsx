import type { Metadata } from "next";
import { getActivities } from "@/lib/sheets";
import { ActivitiesList } from "@/components/activities-list";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "활동 — yoonity",
  description: "Yoonity 연구실의 연구 과제, 수상내역, 학회수상, 대외 활동",
};

export default async function ActivitiesPage() {
  const activities = await getActivities();

  return (
    <>
      <main className="mx-auto max-w-4xl flex-1 px-6 py-32">
        <ScrollReveal>
          <p className="text-[20px] font-semibold text-ink-muted">활동</p>
          <h1 className="mt-3 text-[54px] font-black tracking-tight">
            연구 과제부터 수상까지
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.08} className="mt-12">
          <ActivitiesList activities={activities} />
        </ScrollReveal>
      </main>
      <SiteFooter />
    </>
  );
}
