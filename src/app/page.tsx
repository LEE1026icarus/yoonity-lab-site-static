import { ResearchAxes } from "@/components/research-axes";
import { ProcessSteps } from "@/components/process-steps";
import { RelatedArticles } from "@/components/related-articles";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <main id="top" className="flex-1">
        <section className="flex min-h-[85vh] items-center">
          <div className="mx-auto max-w-6xl px-6 py-32">
            <p className="text-sm font-semibold tracking-wide text-ink-muted">
              동국대학교 · 경영정보학과
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
            <p className="mt-6 max-w-xl text-ink-muted">
              From AI to Quantum-ready. Solving Complex Decisions for
              Industry.
            </p>

          </div>
        </section>

        <ResearchAxes />
        <ProcessSteps />
        <RelatedArticles />
      </main>
      <SiteFooter />
    </>
  );
}
