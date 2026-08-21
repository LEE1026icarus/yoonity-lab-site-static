import type { Metadata } from "next";
import { getPublications } from "@/lib/sheets";
import { PublicationsList } from "@/components/publications-list";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SiteFooter } from "@/components/site-footer";
import { PAGE_METADATA } from "@/lib/seo";

export const metadata: Metadata = PAGE_METADATA["/publications"];

export const revalidate = 60;

export default async function PublicationsPage() {
  const publications = await getPublications();

  return (
    <>
      <main className="mx-auto max-w-4xl flex-1 px-6 py-32">
        <ScrollReveal>
          <p className="text-[20px] font-semibold text-ink-muted">출판</p>
          <h1 className="mt-3 text-[54px] font-black tracking-tight">
            검증한 질문과 축적한 지식
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.08} className="mt-12">
          <PublicationsList publications={publications} />
        </ScrollReveal>
      </main>
      <SiteFooter />
    </>
  );
}
