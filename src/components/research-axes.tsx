import Image from "next/image";
import { researchAxes } from "@/data/research-axes";
import { ScrollReveal } from "./scroll-reveal";

const COLOR_CLASSES = {
  ai: { tag: "bg-axis-ai/10 text-axis-ai", chip: "border-axis-ai/25 text-axis-ai" },
  genai: {
    tag: "bg-axis-genai/10 text-axis-genai",
    chip: "border-axis-genai/25 text-axis-genai",
  },
  quantum: {
    tag: "bg-axis-quantum/10 text-axis-quantum",
    chip: "border-axis-quantum/25 text-axis-quantum",
  },
} as const;

const AXIS_IMAGES = {
  ai: "/images/axes/ai.png",
  genai: "/images/axes/genai.png",
  quantum: "/images/axes/quantum.png",
} as const;

export function ResearchAxes() {
  return (
    <section id="research" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <ScrollReveal>
        <p className="text-sm font-semibold text-ink-muted">
          세 개의 축, 하나의 질문
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight tracking-tight md:text-4xl">
          기술이 조직의 의사결정을 어떻게 바꾸는가
        </h2>
        <p className="mt-4 max-w-4xl text-ink-muted">
          AI에서 양자에 이르기까지, 경영정보학의 렌즈로 기술과 조직, 데이터와 전략이 만나는 지점을 탐구합니다.
        </p>
      </ScrollReveal>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {researchAxes.map((axis, i) => {
          const colors = COLOR_CLASSES[axis.color];
          return (
            <ScrollReveal key={axis.id} delay={0.1 + i * 0.1}>
              <article className="group h-full overflow-hidden rounded-2xl border border-hairline bg-paper-raised transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5">
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0b0b0e]">
                  <Image
                    src={AXIS_IMAGES[axis.color]}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-7">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${colors.tag}`}
                  >
                    {axis.tag}
                  </span>
                  <h3 className="mt-5 text-xl font-bold">{axis.title}</h3>
                  <p className="mt-1 text-xs uppercase tracking-wide text-ink-muted">
                    {axis.titleEn}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                    {axis.description}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {axis.keywords.map((k) => (
                      <li
                        key={k}
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${colors.chip}`}
                      >
                        {k}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
