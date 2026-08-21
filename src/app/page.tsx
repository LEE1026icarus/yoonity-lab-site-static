import type { Metadata } from "next";
import Link from "next/link";
import { ResearchAxes } from "@/components/research-axes";
import { ProcessSteps } from "@/components/process-steps";
import { RelatedArticles } from "@/components/related-articles";
import { SiteFooter } from "@/components/site-footer";
import { siteCopy } from "@/data/site-copy";
import { PAGE_METADATA } from "@/lib/seo";

export const metadata: Metadata = PAGE_METADATA["/"];

export const revalidate = 60;

export default function Home() {
  const collaborationHref = `mailto:${siteCopy.contact.collaborationEmail}`;

  return (
    <>
      <main id="top" className="flex-1">
        <section className="flex min-h-[85vh] items-center">
          <div className="mx-auto max-w-6xl px-6 py-32">
            <p className="text-sm font-semibold tracking-wide text-ink-muted">
              {siteCopy.brand.category}
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              AI를 넘어,{" "}
              <span className="text-axis-quantum">
                양자가 여는 다음 가능성
              </span>
              .
              <br />
              복잡한 산업의 의사결정 문제를 풀어냅니다.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
              {siteCopy.brand.description}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#collaboration"
                className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-axis-ai"
              >
                {siteCopy.home.primaryCta}
              </a>
              <Link
                href="/about#join"
                className="rounded-full border border-hairline px-5 py-3 text-sm font-semibold transition-colors hover:bg-paper-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-axis-ai"
              >
                {siteCopy.home.secondaryCta}
              </Link>
            </div>
          </div>
        </section>

        <ResearchAxes />
        <ProcessSteps />
        <section id="collaboration" className="mx-auto w-full max-w-6xl px-6 py-24 md:py-32">
          <div className="rounded-3xl border border-hairline bg-paper-raised p-8 md:p-12">
            <p className="text-sm font-semibold text-axis-genai">
              {siteCopy.home.collaborationLabel}
            </p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight tracking-tight md:text-5xl">
              {siteCopy.home.collaborationTitle}
            </h2>
            <p className="mt-5 max-w-2xl leading-relaxed text-ink-muted">
              {siteCopy.home.collaborationDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={collaborationHref}
                className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-axis-ai"
              >
                {siteCopy.home.emailCta}
              </a>
              <Link
                href="/about#collaboration"
                className="px-3 py-3 text-sm font-semibold text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-axis-ai"
              >
                협업 방식 자세히 보기
              </Link>
            </div>
          </div>
        </section>
        <RelatedArticles />
      </main>
      <SiteFooter />
    </>
  );
}
