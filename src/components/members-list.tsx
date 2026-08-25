import Image from "next/image";
import { RESEARCHER_SECTIONS } from "@/data/site-navigation";
import type { Member, Publication } from "@/lib/types";

function formatPeriod(period: string): string {
  if (!period) return "";
  if (period.includes("–") || period.includes("-–")) return period;
  if (period.endsWith("-")) {
    const yearMonth = period.slice(0, -1);
    const [year, month] = yearMonth.split(".");
    return `20${year}.${month} – 현재`;
  }
  if (period.includes("-")) {
    const [start, end] = period.split("-");
    const [startYear, startMonth] = start.split(".");
    const [endYear, endMonth] = end.split(".");
    return `20${startYear}.${startMonth} – 20${endYear}.${endMonth}`;
  }
  return period;
}

const AVATAR_COLORS = ["ai", "genai", "quantum"] as const;
const AVATAR_CLASSES: Record<(typeof AVATAR_COLORS)[number], string> = {
  ai: "from-axis-ai/25 to-axis-ai/5 text-axis-ai ring-axis-ai/20",
  genai: "from-axis-genai/25 to-axis-genai/5 text-axis-genai ring-axis-genai/20",
  quantum:
    "from-axis-quantum/25 to-axis-quantum/5 text-axis-quantum ring-axis-quantum/20",
};

type MemberWithPublications = Member & { publications: Publication[] };

function MemberCard({
  member,
  color,
}: {
  member: MemberWithPublications;
  color: (typeof AVATAR_COLORS)[number];
}) {
  return (
    <article className="flex flex-col gap-6 rounded-2xl border border-hairline bg-paper-raised p-6 sm:flex-row sm:items-start">
      <div className="flex shrink-0 sm:flex-col sm:items-center">
        {member.photo ? (
          <div className="h-32 w-32 overflow-hidden rounded-full ring-1 ring-axis-ai/20">
            <Image
              src={member.photo}
              alt={member.name}
              width={128}
              height={128}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div
            className={`flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br text-[40px] font-black ring-1 ${AVATAR_CLASSES[color]}`}
            aria-hidden="true"
          >
            {member.name.slice(0, 1)}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 sm:border-r sm:border-hairline sm:pr-6">
        <h3 className="text-[22px] font-bold">
          {member.name}
          {member.isLabHead && (
            <span className="ml-2 text-[17px] font-medium text-ink-muted">
              랩장
            </span>
          )}
        </h3>
        <p className="mt-1.5 text-[17px] text-ink-muted">
          {member.role}
          {member.period && (
            <>
              <span className="mx-1.5">·</span>
              {formatPeriod(member.period)}
            </>
          )}
        </p>
        <div className="mt-2 text-[17px] text-ink-muted">
          <p>{member.affiliation}</p>
          {member.currentAffiliation && (
            <p className="mt-1 text-[16px]">
              현재: <span className="font-medium">{member.currentAffiliation}</span>
            </p>
          )}
        </div>

        {member.researchField && member.researchField.length > 0 && (
          <div className="mt-3">
            <p className="text-[15px] font-semibold text-ink-muted">연구 분야</p>
            <ul className="mt-1.5 flex flex-wrap gap-1.5">
              {member.researchField.map((field) => (
                <li
                  key={field}
                  className="rounded-full border border-hairline px-2.5 py-0.5 text-[15px] font-medium text-ink-muted"
                >
                  {field}
                </li>
              ))}
            </ul>
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

      {member.publications.length > 0 && (
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-ink-muted">논문</p>
          <ul className="mt-1.5 space-y-1.5">
            {member.publications.map((publication) => (
              <li key={publication.id} className="min-w-0">
                {publication.href ? (
                  <a
                    href={publication.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate text-[16px] underline decoration-hairline underline-offset-4 transition-colors hover:text-axis-ai hover:decoration-axis-ai"
                  >
                    {publication.title}
                  </a>
                ) : (
                  <p className="truncate text-[16px] text-ink-muted">
                    {publication.title}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

export function MembersList({
  members,
}: {
  members: MemberWithPublications[];
}) {
  return (
    <div id="members">
      <nav
        aria-label="연구원 분류"
        className="flex flex-wrap gap-2 border-b border-hairline pb-5"
      >
        {RESEARCHER_SECTIONS.map((section) => {
          const count = members.filter(
            (member) => member.status === section.key,
          ).length;
          return (
            <a
              key={section.key}
              href={`#${section.key}`}
              className="flex items-baseline gap-2 rounded-full border border-hairline px-4 py-2 text-[20px] font-semibold text-ink-muted transition-colors hover:bg-ink hover:text-paper"
            >
              {section.label}
              <span className="text-[15px] font-medium tabular-nums">
                {String(count).padStart(2, "0")}
              </span>
            </a>
          );
        })}
      </nav>

      <div className="divide-y divide-hairline">
        {RESEARCHER_SECTIONS.map((section) => {
          const sectionMembers = members.filter(
            (member) => member.status === section.key,
          );
          return (
            <section
              key={section.key}
              id={section.key}
              className="scroll-mt-28 py-12"
              aria-labelledby={`${section.key}-heading`}
            >
              <h2
                id={`${section.key}-heading`}
                className="text-[28px] font-black tracking-tight"
              >
                {section.label}
              </h2>
              {sectionMembers.length > 0 ? (
                <div className="mt-6 space-y-5">
                  {sectionMembers.map((member, index) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      color={AVATAR_COLORS[index % AVATAR_COLORS.length]}
                    />
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-[17px] text-ink-muted">
                  등록된 구성원이 없습니다.
                </p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
