import Link from "next/link";
import type { JsonLdObject, BreadcrumbItem } from "@/lib/structured-data";
import { JsonLd } from "./json-ld";
import { Breadcrumbs } from "./breadcrumbs";
import { SiteFooter } from "./site-footer";

type DetailRow = { label: string; value: string };

function isExternalHttpUrl(value: string | undefined) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function ContentDetail({
  eyebrow,
  title,
  description,
  metadata,
  breadcrumbs,
  parentHref,
  parentLabel,
  sourceHref,
  structuredData,
}: {
  eyebrow: string;
  title: string;
  description: string;
  metadata: DetailRow[];
  breadcrumbs: BreadcrumbItem[];
  parentHref: string;
  parentLabel: string;
  sourceHref?: string;
  structuredData: JsonLdObject;
}) {
  return (
    <>
      <JsonLd data={structuredData} />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-32">
        <Breadcrumbs items={breadcrumbs} />
        <p className="text-sm font-semibold text-ink-muted">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-muted">
          {description}
        </p>

        {metadata.length > 0 && (
          <dl className="mt-10 divide-y divide-hairline border-y border-hairline">
            {metadata.map((item) => (
              <div key={`${item.label}-${item.value}`} className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <dt className="text-sm font-semibold text-ink-muted">{item.label}</dt>
                <dd className="leading-relaxed">{item.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          {isExternalHttpUrl(sourceHref) && (
            <a
              href={sourceHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-axis-ai"
            >
              원문 출처 보기 ↗
            </a>
          )}
          <Link
            href={parentHref}
            className="rounded-full border border-hairline px-5 py-3 text-sm font-semibold transition-colors hover:bg-paper-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-axis-ai"
          >
            {parentLabel} 목록으로 돌아가기
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
