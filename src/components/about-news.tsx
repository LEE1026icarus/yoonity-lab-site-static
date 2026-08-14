"use client";

import { useState } from "react";
import type { AboutNewsItem } from "@/lib/types";

export function AboutNews({ items }: { items: AboutNewsItem[] }) {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? items : items.slice(0, 3);

  return (
    <div>
      <div className="divide-y divide-hairline border-y border-hairline">
        {visibleItems.map((item) => (
          <article key={item.id} className="py-7">
            <time dateTime={item.date} className="text-xs font-semibold text-ink-muted">
              {item.date.replaceAll("-", ".")}
            </time>
            <h3 className="mt-2 text-xl font-bold leading-snug">
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-axis-ai"
              >
                {item.title}
              </a>
            </h3>
            {item.excerpt && (
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {item.excerpt}
              </p>
            )}
          </article>
        ))}
      </div>

      {items.length > 3 && (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
          className="mt-8 rounded-full border border-hairline px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-ink hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-axis-ai"
        >
          {expanded ? "기사 접기 ↑" : "전체 기사 보기 ↓"}
        </button>
      )}
    </div>
  );
}
