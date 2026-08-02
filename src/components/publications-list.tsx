"use client";

import { useState } from "react";
import type { Publication, PublicationCategory } from "@/lib/types";

const CATEGORIES: { key: PublicationCategory; label: string }[] = [
  { key: "intl-paper", label: "해외 논문" },
  { key: "domestic-paper", label: "국내 논문" },
  { key: "book", label: "도서" },
  { key: "patent", label: "특허" },
];

export function PublicationsList({ publications }: { publications: Publication[] }) {
  const [active, setActive] = useState<PublicationCategory>("intl-paper");
  const filtered = publications.filter((pub) => pub.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-hairline pb-5">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setActive(c.key)}
            className={`rounded-full px-4 py-2 text-[20px] font-semibold transition-colors ${
              active === c.key
                ? "bg-ink text-paper"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <ol className="mt-2 divide-y divide-hairline">
        {filtered.map((pub, i) => (
          <li key={pub.id} className="flex gap-4 py-4">
            <span className="mt-0.5 shrink-0 text-[17px] font-semibold text-ink-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              {pub.href ? (
                <a
                  href={pub.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[20px] leading-relaxed underline decoration-hairline underline-offset-4 transition-colors hover:text-axis-ai hover:decoration-axis-ai"
                >
                  {pub.title}
                </a>
              ) : (
                <p className="text-[20px] leading-relaxed">{pub.title}</p>
              )}
              {pub.meta && (
                <p className="mt-1.5 text-[17px] text-ink-muted">{pub.meta}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
