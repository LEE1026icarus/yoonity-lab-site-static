import { ACTIVITY_SECTIONS } from "@/data/site-navigation";
import type { Activity } from "@/lib/types";
import Link from "next/link";

export function ActivitiesList({ activities }: { activities: Activity[] }) {
  const itemCounts = new Map(
    ACTIVITY_SECTIONS.map((section) => [
      section.key,
      activities.filter((activity) => activity.category === section.key).length,
    ]),
  );

  return (
    <div>
      <nav
        aria-label="활동 분류"
        className="flex flex-wrap gap-2 border-b border-hairline pb-5"
      >
        {ACTIVITY_SECTIONS.map((section) => (
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
        {ACTIVITY_SECTIONS.map((section) => {
          const items = activities.filter(
            (activity) => activity.category === section.key,
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
                <ul className="mt-4 divide-y divide-hairline">
                  {items.map((activity) => (
                    <li key={activity.id} className="py-5">
                      {activity.category === "project" ? (
                        <Link
                          href={`/projects/${activity.id}`}
                          className="text-[22px] font-bold underline decoration-hairline underline-offset-4 transition-colors hover:text-axis-ai hover:decoration-axis-ai"
                        >
                          {activity.title}
                        </Link>
                      ) : activity.href ? (
                        <a
                          href={activity.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[22px] font-bold underline decoration-hairline underline-offset-4 transition-colors hover:text-axis-ai hover:decoration-axis-ai"
                        >
                          {activity.title}
                        </a>
                      ) : (
                        <p className="text-[22px] font-bold">{activity.title}</p>
                      )}
                      {activity.category === "project" && /^https?:\/\//.test(activity.href ?? "") && (
                        <a
                          href={activity.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-3 text-sm font-semibold text-ink-muted underline underline-offset-4 transition-colors hover:text-ink"
                        >
                          원문 출처 ↗
                        </a>
                      )}
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[20px] text-ink-muted">
                        {activity.org && <span>{activity.org}</span>}
                        {activity.tag && (
                          <span className="rounded-full border border-hairline px-2.5 py-0.5 text-[17px] font-medium text-axis-ai">
                            {activity.tag}
                          </span>
                        )}
                        <span className="text-[17px]">{activity.period}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-[17px] text-ink-muted">
                  등록된 활동이 없습니다.
                </p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
