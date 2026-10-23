import type { Metadata } from "next";
import Link from "next/link";
import { getPublications } from "@/lib/sheets";
import { PublicationsList } from "@/components/publications-list";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SiteFooter } from "@/components/site-footer";
import { PAGE_METADATA } from "@/lib/seo";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = PAGE_METADATA["/publications"];

export const revalidate = 60;

const RESEARCH_TOPICS = [
  {
    label: "AI·데이터 분석",
    count: 28,
    description: "생성형 AI, 정보 검색, 텍스트 분석과 예측 모델의 활용을 연구합니다.",
    exampleTitle: "Evaluating user performance on RAG-based generative AI tools",
    exampleLabel: "RAG 기반 생성형 AI 도구 이용 성과",
  },
  {
    label: "광고·미디어",
    count: 17,
    description: "영상 광고와 미디어 이용 맥락이 시청자 반응에 미치는 영향을 살펴봅니다.",
    exampleTitle: "Effect of Media Context on Avoidance of Skippable Pre-roll Ads",
    exampleLabel: "온라인 영상 광고 회피와 미디어 맥락",
  },
  {
    label: "금융·핀테크",
    count: 10,
    description: "디지털 금융 서비스의 채택과 저항, 이용자 행동을 분석합니다.",
    exampleTitle: "Evolving dynamics of resistance and adoption in digital finance",
    exampleLabel: "디지털 금융 앱 채택과 저항",
  },
  {
    label: "교육·학습",
    count: 7,
    description: "교육용 챗봇과 AI 학습 도구의 설계 및 학습 경험을 연구합니다.",
    exampleTitle: "Designing educational chatbots in resource-constrained environments",
    exampleLabel: "교육용 챗봇 설계",
  },
  {
    label: "헬스케어",
    count: 5,
    description: "원격진료와 모바일 헬스 서비스의 이용과 전환 요인을 살펴봅니다.",
    exampleTitle: "헬스케어 서비스의 디지털 채널 전환에 영향을 미치는 요인",
    exampleLabel: "원격진료의 디지털 채널 전환",
  },
  {
    label: "정책·사회",
    count: 7,
    description: "공공가치와 사회문제를 중심으로 디지털 정책의 방향을 연구합니다.",
    exampleTitle: "A conceptual digital policy framework via mixed-methods approach",
    exampleLabel: "공공가치 중심 디지털 정책",
  },
  {
    label: "콘텐츠·문화",
    count: 14,
    description: "한류와 문화 브랜딩 등 콘텐츠의 확산과 가치를 분석합니다.",
    exampleTitle: "Unravelling the key topics of Hallyu",
    exampleLabel: "한류의 문화 브랜딩",
  },
  {
    label: "서비스·소비자",
    count: 21,
    description: "서비스 이용자 리뷰와 소비자 반응에서 행동 요인을 찾습니다.",
    exampleTitle: "레스토랑 예약 앱 사용자 리뷰의 시계열적 감성 및 주제 반응 탐색",
    exampleLabel: "레스토랑 예약 앱 사용자 리뷰",
  },
] as const;

export default async function PublicationsPage() {
  const publications = await getPublications();

  return (
    <>
      <main className="mx-auto max-w-4xl flex-1 px-6 py-32">
        <Breadcrumbs items={[{ label: "홈", href: "/" }, { label: "논문·도서·특허", href: "/publications" }]} />
        <ScrollReveal>
          <p className="text-[20px] font-semibold text-ink-muted">출판</p>
          <h1 className="mt-3 text-[36px] font-black leading-tight tracking-tight sm:text-[54px]">
            연구성과: 논문·도서·특허
          </h1>
          <p className="mt-5 text-[20px] text-ink-muted">검증한 질문과 축적한 지식</p>
        </ScrollReveal>

        <ScrollReveal delay={0.04} className="mt-12">
          <section aria-labelledby="research-topics-heading">
            <h2 id="research-topics-heading" className="text-[28px] font-black tracking-tight">
              연구 주제별 성과
            </h2>
            <p className="mt-3 text-[17px] leading-relaxed text-ink-muted">
              연구실의 주요 주제를 살펴보고 대표 논문으로 이어서 읽어보세요.
              주제별 수치는 서로 겹칠 수 있습니다.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {RESEARCH_TOPICS.map((topic) => {
                const examplePublication = publications.find((publication) =>
                  publication.title.includes(topic.exampleTitle),
                );

                return (
                  <article key={topic.label} className="rounded-2xl border border-hairline bg-paper-raised p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-[21px] font-bold">{topic.label}</h3>
                      <span className="shrink-0 text-[17px] font-semibold tabular-nums text-ink-muted">
                        {topic.count}건
                      </span>
                    </div>
                    <p className="mt-3 text-[17px] leading-relaxed text-ink-muted">
                      {topic.description}
                    </p>
                    {examplePublication && (
                      <Link
                        href={`/publications/${examplePublication.id}`}
                        className="mt-4 inline-block text-[16px] font-semibold underline decoration-hairline underline-offset-4 transition-colors hover:text-axis-ai hover:decoration-axis-ai"
                      >
                        대표 논문: {topic.exampleLabel} →
                      </Link>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.08} className="mt-12">
          <PublicationsList publications={publications} />
        </ScrollReveal>
      </main>
      <SiteFooter />
    </>
  );
}
