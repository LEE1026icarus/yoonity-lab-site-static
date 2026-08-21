import Link from "next/link";
import { JsonLd } from "./json-ld";
import {
  createBreadcrumbStructuredData,
  type BreadcrumbItem,
} from "@/lib/structured-data";

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const current = items.at(-1);

  if (!current) return null;

  return (
    <nav aria-label="현재 위치" className="mb-10">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-muted">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li key={`${item.href}-${item.label}`} className="flex items-center gap-x-2">
              {isCurrent ? (
                <span aria-current="page" className="font-semibold text-ink">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-axis-ai"
                >
                  {item.label}
                </Link>
              )}
              {!isCurrent && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
      <JsonLd data={createBreadcrumbStructuredData(items)} />
    </nav>
  );
}
