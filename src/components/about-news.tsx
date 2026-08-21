"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import type { AboutNewsItem } from "@/lib/types";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;
const isExternalHttpUrl = (value: string) => /^https?:\/\//.test(value);

export function AboutNews({ items }: { items: AboutNewsItem[] }) {
  const [expanded, setExpanded] = useState(false);
  const enhanced = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const effectiveExpanded = !enhanced || expanded;

  return (
    <div>
      <div
        id="about-news-list"
        className="divide-y divide-hairline border-y border-hairline"
      >
        {items.map((item, index) => (
          <article
            key={item.id}
            hidden={!effectiveExpanded && index >= 3}
            className="py-7"
          >
            <time dateTime={item.date} className="text-xs font-semibold text-ink-muted">
              {item.date.replaceAll("-", ".")}
            </time>
            <h3 className="mt-2 text-xl font-bold leading-snug">
              <Link
                href={`/news/${item.id}`}
                className="transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-axis-ai"
              >
                {item.title}
              </Link>
            </h3>
            {item.excerpt && (
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {item.excerpt}
              </p>
            )}
            {isExternalHttpUrl(item.href) && (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex text-sm font-semibold text-ink-muted underline underline-offset-4 transition-colors hover:text-ink"
              >
                원문 출처 보기 ↗
              </a>
            )}
          </article>
        ))}
      </div>

      {items.length > 3 && (
        <button
          type="button"
          aria-expanded={effectiveExpanded}
          aria-controls="about-news-list"
          onClick={() => setExpanded((value) => !value)}
          className="mt-8 rounded-full border border-hairline px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-ink hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-axis-ai"
        >
          {effectiveExpanded ? "기사 접기 ↑" : "전체 기사 보기 ↓"}
        </button>
      )}
    </div>
  );
}
