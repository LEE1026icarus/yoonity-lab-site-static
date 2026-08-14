import type { Metadata } from "next";
import Image from "next/image";
import { getProfessor } from "@/lib/sheets";
import { Timeline } from "@/components/timeline";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "지도교수 — yoonity",
  description: "Yoonity 연구실 지도교수 소개",
};

export default async function ProfessorPage() {
  const p = await getProfessor();

  return (
    <>
      <main className="mx-auto max-w-4xl flex-1 px-6 py-32">
      <ScrollReveal>
        <p className="text-[20px] font-semibold text-ink-muted">지도교수</p>
        <h1 className="mt-3 text-[42px] font-black leading-tight tracking-tight md:text-[54px]">
          산업 경험과 학술 연구를 연결합니다
        </h1>
        <p className="mt-4 max-w-3xl text-[18px] leading-relaxed text-ink-muted">
          서비스 기획과 데이터 사이언스 실무 경험을 바탕으로, 현장의 문제를 검증 가능한 연구와 해결책으로 발전시킵니다.
        </p>

        <div className="mt-8 flex flex-col items-center text-center">
          {p.photo ? (
            <div className="h-56 w-56 overflow-hidden rounded-full ring-1 ring-axis-ai/20">
              <Image
                src={p.photo}
                alt={p.name}
                width={224}
                height={224}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-axis-ai/25 to-axis-ai/5 text-5xl font-black text-axis-ai ring-1 ring-axis-ai/20">
              {p.name.slice(0, 1)}
            </div>
          )}
          <h2 className="mt-6 text-[54px] font-black tracking-tight">{p.name}</h2>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[20px] text-ink-muted">
            <a
              href={`mailto:${p.email}`}
              className="transition-colors hover:text-ink"
            >
              {p.email}
            </a>
            {p.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <p className="mt-10 text-center text-[25px] font-bold">{p.title}</p>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <section className="mt-20">
          <h2 className="text-[28px] font-black tracking-tight">주요 전문 분야</h2>
          <ul className="mt-5 space-y-3">
            {p.expertise.map((item) => (
              <li key={item} className="flex gap-3 text-[20px] text-ink-muted">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-axis-ai" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <section className="mt-20">
          <h2 className="text-[28px] font-black tracking-tight">경력</h2>
          <div className="mt-6">
            <Timeline entries={p.career} />
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <section className="mt-20">
          <h2 className="text-[28px] font-black tracking-tight">학력</h2>
          <div className="mt-6">
            <Timeline entries={p.education} />
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <section className="mt-20">
          <h2 className="text-[28px] font-black tracking-tight">보유 기술</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {p.skills.map((skill) => (
              <li
                key={skill}
                className="rounded-full border border-hairline px-3 py-1.5 text-[17px] font-medium text-ink-muted"
              >
                {skill}
              </li>
            ))}
          </ul>
        </section>
      </ScrollReveal>

      {p.other.length > 0 && (
        <ScrollReveal delay={0.1}>
          <section className="mt-20">
            <h2 className="text-[28px] font-black tracking-tight">기타</h2>
            <div className="mt-6">
              <Timeline entries={p.other} />
            </div>
          </section>
        </ScrollReveal>
      )}
      </main>
      <SiteFooter />
    </>
  );
}
