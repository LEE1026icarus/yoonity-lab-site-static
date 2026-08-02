import type { TimelineEntry } from "@/lib/types";

const DOT_COLORS = ["bg-axis-ai", "bg-axis-genai", "bg-axis-quantum"] as const;

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="space-y-8 border-l border-hairline pl-6">
      {entries.map((entry, i) => (
        <li key={entry.id} className="relative">
          <span
            className={`absolute top-1.5 -left-[29px] h-2.5 w-2.5 rounded-full ${DOT_COLORS[i % DOT_COLORS.length]}`}
          />
          <p className="text-[22px] font-bold">
            {entry.org}
            {entry.role && (
              <span className="font-medium text-ink-muted"> | {entry.role}</span>
            )}
          </p>
          <p className="mt-1 text-[17px] text-ink-muted">
            {entry.location && `${entry.location} · `}
            {entry.period}
          </p>
          {entry.bullets && entry.bullets.length > 0 && (
            <ul className="mt-3 list-inside list-disc space-y-1.5 text-[20px] text-ink-muted">
              {entry.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  );
}
