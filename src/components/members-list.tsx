"use client";

import { useState } from "react";
import type { Member } from "@/lib/types";

const TABS = [
  { key: "current", label: "연구원" },
  { key: "alumni", label: "졸업자" },
  { key: "all", label: "전체" },
] as const;

const AVATAR_COLORS = ["ai", "genai", "quantum"] as const;
const AVATAR_CLASSES: Record<(typeof AVATAR_COLORS)[number], string> = {
  ai: "from-axis-ai/25 to-axis-ai/5 text-axis-ai ring-axis-ai/20",
  genai: "from-axis-genai/25 to-axis-genai/5 text-axis-genai ring-axis-genai/20",
  quantum:
    "from-axis-quantum/25 to-axis-quantum/5 text-axis-quantum ring-axis-quantum/20",
};

export function MembersList({ members }: { members: Member[] }) {
  const [active, setActive] = useState<(typeof TABS)[number]["key"]>("current");
  const filtered =
    active === "all" ? members : members.filter((m) => m.status === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-hairline pb-5">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            className={`rounded-full px-4 py-2 text-[20px] font-semibold transition-colors ${
              active === tab.key
                ? "bg-ink text-paper"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {filtered.map((member, i) => {
          const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
          return (
            <div
              key={member.id}
              className="flex items-start gap-4 rounded-2xl border border-hairline bg-paper-raised p-5"
            >
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[25px] font-black ring-1 ${AVATAR_CLASSES[color]}`}
              >
                {member.name.slice(0, 1)}
              </div>
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[22px] font-bold">
                  <span>
                    {member.name}
                    {member.isLabHead && (
                      <span className="ml-1 text-[20px] font-medium text-ink-muted">
                        (랩장)
                      </span>
                    )}
                  </span>
                  <span className="rounded-full border border-hairline px-2 py-0.5 text-[17px] font-medium text-ink-muted">
                    {member.role}
                  </span>
                </p>
                <p className="mt-1.5 text-[20px] text-ink-muted">
                  {member.affiliation}
                </p>
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="mt-1 inline-block truncate text-[17px] text-ink-muted transition-colors hover:text-ink"
                  >
                    {member.email}
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
