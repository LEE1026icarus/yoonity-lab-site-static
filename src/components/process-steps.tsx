import { researchProcess } from "@/data/research-process";
import { ScrollReveal } from "./scroll-reveal";

const COLOR_CLASSES = {
  ai: "border-axis-ai text-axis-ai bg-axis-ai/5",
  genai: "border-axis-genai text-axis-genai bg-axis-genai/5",
  quantum: "border-axis-quantum text-axis-quantum bg-axis-quantum/5",
} as const;

const DOT_COLORS = {
  ai: "bg-axis-ai",
  genai: "bg-axis-genai",
  quantum: "bg-axis-quantum",
} as const;

export function ProcessSteps() {
  return (
    <section id="process" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <ScrollReveal>
        <p className="text-sm font-semibold text-ink-muted">
          연구 방법론
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight tracking-tight md:text-4xl">
          문제에서 기술까지, 세 단계의 연구 프로세스
        </h2>
        <p className="mt-4 max-w-4xl text-ink-muted">
          현장 문제에서 출발하여 설계·검증을 거쳐 다음 기술을 준비하는 체계적인 연구 방법론입니다.
        </p>
      </ScrollReveal>

      <div className="mt-16 space-y-12 border-l border-hairline pl-8 md:pl-12">
        {researchProcess.map((step, idx) => {
          const colors = COLOR_CLASSES[step.color];
          const dotColor = DOT_COLORS[step.color];

          return (
            <ScrollReveal key={step.id} delay={0.1 + idx * 0.1}>
              <div className="relative -ml-[41px] flex gap-8 md:gap-12">
                {/* Dot */}
                <div
                  className={`absolute -left-5 top-2 h-3.5 w-3.5 rounded-full ${dotColor}`}
                />

                {/* Left: Number & Title */}
                <div className="min-w-fit pt-1">
                  <div className={`text-5xl md:text-6xl font-black ${colors}`}>
                    {step.number}
                  </div>
                  <h3 className="mt-4 text-xl font-bold leading-snug">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-muted">
                    {step.description}
                  </p>
                </div>

                {/* Right: Items */}
                <div className="flex-1 space-y-6 pt-2">
                  {step.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="pb-6 last:pb-0">
                      <div
                        className={`flex items-baseline gap-3 rounded-lg border-l-2 ${colors} bg-opacity-50 pl-4 py-3`}
                      >
                        <span className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-current" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold">{item.label}</p>
                          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
