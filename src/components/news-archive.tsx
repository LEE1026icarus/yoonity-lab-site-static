import Link from "next/link";
import type { NewsDetail } from "@/lib/types";

export function NewsArchive({ items }: { items: NewsDetail[] }) {
  return (
    <div className="divide-y divide-hairline border-y border-hairline">
      {items.map((item) => (
        <article key={item.slug} className="py-7">
          <time dateTime={item.date} className="text-xs font-semibold text-ink-muted">
            {item.date.replaceAll("-", ".")}
          </time>
          <h2 className="mt-2 text-xl font-bold leading-snug">
            <Link
              href={`/news/${item.slug}`}
              className="transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-axis-ai"
            >
              {item.title}
            </Link>
          </h2>
          {item.excerpt ? (
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.excerpt}</p>
          ) : null}
        </article>
      ))}
    </div>
  );
}
