import { PUBLICATION_SECTIONS } from "@/data/site-navigation";
import type { Publication } from "@/lib/types";
import Link from "next/link";

export function PublicationsList({ publications }: { publications: Publication[] }) {
  const itemCounts = new Map(
    PUBLICATION_SECTIONS.map((section) => [
      section.key,
      publications.filter((publication) => publication.category === section.key).length,
    ]),
  );

  return (
    <div>
      <nav
        aria-label="출판 분류"
        className="flex flex-wrap gap-2 border-b border-hairline pb-5"
      >
        {PUBLICATION_SECTIONS.map((section) => (
          <a
            key={section.key}
            href={`#${section.key}`}
            aria-label={`${section.label} (${itemCounts.get(section.key) ?? 0}개)`}
            className="inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2 text-[20px] font-semibold text-ink-muted transition-colors hover:bg-ink hover:text-paper"
          >
            {section.label}
            <span
              aria-hidden="true"
              className="text-[16px] tabular-nums text-ink-muted"
            >
              {itemCounts.get(section.key) ?? 0}
            </span>
          </a>
        ))}
      </nav>

      <div className="divide-y divide-hairline">
        {PUBLICATION_SECTIONS.map((section) => {
          const items = publications.filter(
            (publication) => publication.category === section.key,
          );

          return (
            <section
              key={section.key}
              id={section.key}
              className="scroll-mt-28 py-12"
            >
              <h2 className="text-[28px] font-black tracking-tight">
                {section.label}
              </h2>
              {items.length > 0 ? (
                <ol className="mt-4 divide-y divide-hairline">
                  {items.map((publication, index) => (
                    <li key={publication.id} className="flex gap-4 py-4">
                      <span className="mt-0.5 shrink-0 text-[17px] font-semibold text-ink-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <>
                          <Link
                            href={`/publications/${publication.id}`}
                            className="text-[20px] leading-relaxed underline decoration-hairline underline-offset-4 transition-colors hover:text-axis-ai hover:decoration-axis-ai"
                          >
                            {publication.title}
                          </Link>
                          {/^https?:\/\//.test(publication.href ?? "") && (
                            <a
                              href={publication.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-3 text-sm font-semibold text-ink-muted underline underline-offset-4 transition-colors hover:text-ink"
                            >
                              원문 출처 ↗
                            </a>
                          )}
                        </>
                        {publication.meta && (
                          <p className="mt-1.5 text-[17px] text-ink-muted">
                            {publication.meta}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-4 text-[17px] text-ink-muted">
                  등록된 출판물이 없습니다.
                </p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
