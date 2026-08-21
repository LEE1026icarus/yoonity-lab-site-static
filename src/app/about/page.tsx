import type { Metadata } from "next";
import { AboutNews } from "@/components/about-news";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";
import { siteCopy } from "@/data/site-copy";
import { getAboutPageData } from "@/lib/sheets";
import { PAGE_METADATA } from "@/lib/seo";
import { createAboutPageStructuredData } from "@/lib/structured-data";

export const metadata: Metadata = PAGE_METADATA["/about"];

export const revalidate = 60;

const sectionClass = "border-t border-hairline py-20 md:py-24";

export default async function AboutPage() {
  const data = await getAboutPageData();

  return (
    <>
      <JsonLd data={createAboutPageStructuredData()} />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-32">
        <ScrollReveal>
          <section>
            <p className="text-sm font-semibold text-ink-muted">연구실 소개</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
              {siteCopy.brand.headline}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
              {siteCopy.brand.description}
            </p>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="join" className={`mt-24 ${sectionClass}`}>
            <p className="text-sm font-semibold text-axis-ai">Join Yoonity</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
              실제 문제를 연구로 발전시키고 싶은 사람
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
              대학원생과 학부연구생은 산업과 사회의 문제를 데이터, AI, 정보시스템 연구로 구체화하며 함께 성장합니다.
            </p>
            <a
              href={data.recruitmentHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-axis-ai"
            >
              {siteCopy.home.secondaryCta}
            </a>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className={sectionClass}>
            <p className="text-sm font-semibold text-ink-muted">Resources</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">연구실 자료</h2>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              {data.resources.map((resource) => (
                <a
                  key={resource.id}
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-hairline bg-paper-raised p-6 transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-axis-ai"
                >
                  <h3 className="font-bold">{resource.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {resource.description}
                  </p>
                </a>
              ))}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="collaboration" className={sectionClass}>
            <p className="text-sm font-semibold text-axis-genai">Collaboration</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
              함께 검증할 문제를 찾습니다
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
              기업·기관과의 공동연구, 산학과제, AI 파일럿, 데이터 분석과 자문을 논의합니다. 문제와 현재 상황을 알려주세요.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`mailto:${data.collaborationEmail}`}
                className="inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-axis-ai"
              >
                {siteCopy.home.emailCta}
              </a>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className={sectionClass}>
            <p className="text-sm font-semibold text-ink-muted">Channels</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">더 많은 기록</h2>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              {data.channels.map((channel) =>
                channel.status === "active" && channel.href ? (
                  <a
                    key={channel.id}
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl border border-hairline bg-paper-raised p-6 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-axis-ai"
                  >
                    {channel.title}
                  </a>
                ) : (
                  <div
                    key={channel.id}
                    aria-disabled="true"
                    className="rounded-2xl border border-hairline bg-paper-raised p-6"
                  >
                    <p className="font-bold">{channel.title}</p>
                    <p className="mt-2 text-sm text-ink-muted">준비 중</p>
                  </div>
                ),
              )}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="news" className={sectionClass}>
            <p className="text-sm font-semibold text-ink-muted">News</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">연구실 소식</h2>
            <div className="mt-8">
              <AboutNews items={data.news} />
            </div>
          </section>
        </ScrollReveal>
      </main>
      <SiteFooter />
    </>
  );
}
