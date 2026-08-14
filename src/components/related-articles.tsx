import { getArticles } from "@/lib/sheets";
import { ScrollReveal } from "./scroll-reveal";

const ACCENT_CLASSES = {
  ai: "from-axis-ai/30 text-axis-ai",
  genai: "from-axis-genai/30 text-axis-genai",
  quantum: "from-axis-quantum/30 text-axis-quantum",
} as const;

export async function RelatedArticles() {
  const articles = await getArticles();

  return (
    <section id="articles" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <ScrollReveal>
        <h2 className="text-3xl font-black tracking-tight md:text-4xl">
          연구와 현장을 연결한 기록
        </h2>
        <p className="mt-4 max-w-2xl text-ink-muted">
          Yoonity의 연구, 프로젝트와 구성원이 산업과 교육 현장에서 만든 변화를 소개합니다.
        </p>
      </ScrollReveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, i) => (
          <ScrollReveal key={article.id} delay={0.06 + (i % 3) * 0.08}>
            <a
              href={article.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block h-full overflow-hidden rounded-2xl border border-hairline bg-paper-raised transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5"
            >
              <div
                className={`relative aspect-[16/10] overflow-hidden ${
                  article.thumbnail ? "" : `bg-gradient-to-br ${ACCENT_CLASSES[article.accent]} to-transparent`
                }`}
              >
                {article.thumbnail ? (
                  // External Sheet-managed image URLs are intentionally rendered as-is.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={article.thumbnail}
                    alt={article.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className="absolute inset-0 opacity-30 transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage:
                        "radial-gradient(currentColor 1px, transparent 1px)",
                      backgroundSize: "18px 18px",
                    }}
                  />
                )}
              </div>
              <div className="p-6">
                <time className="text-xs font-medium text-ink-muted">
                  {article.date}
                </time>
                <h3 className="mt-2 line-clamp-2 text-base font-bold leading-snug">
                  {article.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-ink-muted">
                  {article.excerpt}
                </p>
              </div>
            </a>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
