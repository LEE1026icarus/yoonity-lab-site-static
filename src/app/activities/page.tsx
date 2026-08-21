import type { Metadata } from "next";
import { getActivities } from "@/lib/sheets";
import { ActivitiesList } from "@/components/activities-list";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SiteFooter } from "@/components/site-footer";
import { PAGE_METADATA } from "@/lib/seo";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = PAGE_METADATA["/activities"];

export const revalidate = 60;

export default async function ActivitiesPage() {
  const activities = await getActivities();

  return (
    <>
      <main className="mx-auto max-w-4xl flex-1 px-6 py-32">
        <Breadcrumbs items={[{ label: "홈", href: "/" }, { label: "연구과제·수상·대외활동", href: "/activities" }]} />
        <ScrollReveal>
          <p className="text-[20px] font-semibold text-ink-muted">활동</p>
          <h1 className="mt-3 text-[54px] font-black tracking-tight">
            현장의 문제를 과제와 성과로
          </h1>
          <p className="mt-4 max-w-3xl text-[18px] leading-relaxed text-ink-muted">
            기업·기관과 함께 수행한 연구 과제와 구성원들이 만든 수상 성과를 확인하세요.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.08} className="mt-12">
          <ActivitiesList activities={activities} />
        </ScrollReveal>
      </main>
      <SiteFooter />
    </>
  );
}
