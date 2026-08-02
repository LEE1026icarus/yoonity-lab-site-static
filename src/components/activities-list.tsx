"use client";

import { useState } from "react";
import type { Activity, ActivityCategory } from "@/lib/types";

const CATEGORIES: { key: ActivityCategory; label: string }[] = [
  { key: "project", label: "연구 과제" },
  { key: "award", label: "수상내역" },
  { key: "academic-award", label: "학회수상" },
  { key: "external", label: "대외" },
];

export function ActivitiesList({ activities }: { activities: Activity[] }) {
  const [active, setActive] = useState<ActivityCategory>("project");
  const filtered = activities.filter((activity) => activity.category === active);

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

      <ul className="mt-2 divide-y divide-hairline">
        {filtered.map((activity) => (
          <li key={activity.id} className="py-5">
            <p className="text-[22px] font-bold">{activity.title}</p>
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
    </div>
  );
}
