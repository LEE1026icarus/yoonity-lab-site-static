"use client";

import { useState } from "react";
import Image from "next/image";
import type { Member, Publication } from "@/lib/types";

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

type MemberWithPublications = Member & { publications: Publication[] };

export function MembersList({
  members,
}: {
  members: MemberWithPublications[];
}) {
  const [active, setActive] = useState<(typeof TABS)[number]["key"]>("current");
  const filtered =
    active === "all" ? members : members.filter((m) => m.status === active);

  return (
    <div>
      <div className="flex flex-wrap gap-8 border-b border-hairline">
        {TABS.map((tab) => {
          const count =
            tab.key === "all"
              ? members.length
              : members.filter((m) => m.status === tab.key).length;
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={`relative flex items-baseline gap-2 pb-4 text-[20px] font-semibold transition-colors ${
                isActive ? "text-ink" : "text-ink-muted hover:text-ink"
              }`}
            >
              {tab.label}
              <span className="text-[15px] font-medium tabular-nums text-ink-muted">
                {String(count).padStart(2, "0")}
              </span>
              {isActive && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-ink" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 space-y-5">
        {filtered.map((member, i) => {
          const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
          return (
            <div
              key={member.id}
              className="flex flex-col gap-6 rounded-2xl border border-hairline bg-paper-raised p-6 sm:flex-row sm:items-start"
            >
              {/* Photo */}
              <div className="flex shrink-0 sm:flex-col sm:items-center">
                {member.photo ? (
                  <div className="h-24 w-24 overflow-hidden rounded-full ring-1 ring-axis-ai/20">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className={`flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br text-[32px] font-black ring-1 ${AVATAR_CLASSES[color]}`}
                  >
                    {member.name.slice(0, 1)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1 sm:border-r sm:border-hairline sm:pr-6">
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
                  {member.period && (
                    <span className="text-[17px] font-medium text-ink-muted">
                      ({member.period})
                    </span>
                  )}
                </p>
                <p className="mt-1.5 text-[20px] text-ink-muted">
                  {member.affiliation}
                </p>

                {member.researchField && member.researchField.length > 0 && (
                  <div className="mt-3">
                    <p className="text-[15px] font-semibold text-ink-muted">
                      연구 분야
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {member.researchField.map((field) => (
                        <span
                          key={field}
                          className="rounded-full border border-hairline px-2.5 py-0.5 text-[15px] font-medium text-ink-muted"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="mt-2 inline-block truncate text-[17px] text-ink-muted transition-colors hover:text-ink"
                  >
                    {member.email}
                  </a>
                )}
              </div>

              {/* Publications */}
              {member.publications.length > 0 && (
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold text-ink-muted">
                    논문
                  </p>
                  <ul className="mt-1.5 space-y-1.5">
                    {member.publications.map((pub) => (
                      <li key={pub.id} className="min-w-0">
                        {pub.href ? (
                          <a
                            href={pub.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block truncate text-[16px] underline decoration-hairline underline-offset-4 transition-colors hover:text-axis-ai hover:decoration-axis-ai"
                          >
                            {pub.title}
                          </a>
                        ) : (
                          <p className="truncate text-[16px] text-ink-muted">
                            {pub.title}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
