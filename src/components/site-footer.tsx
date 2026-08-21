import Link from "next/link";
import { siteCopy } from "@/data/site-copy";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-ink-muted md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-black text-ink">yoonity</p>
          <p className="mt-1">동국대학교 경영정보학과 Yoonity 연구실</p>
        </div>
        <nav
          aria-label="주요 페이지"
          className="flex max-w-lg flex-wrap gap-x-4 gap-y-2 md:justify-center"
        >
          <Link href="/about" className="transition-colors hover:text-ink">
            연구실 소개
          </Link>
          <Link href="/professor" className="transition-colors hover:text-ink">
            지도교수
          </Link>
          <Link href="/researchers" className="transition-colors hover:text-ink">
            연구원
          </Link>
          <Link href="/publications" className="transition-colors hover:text-ink">
            논문·도서·특허
          </Link>
          <Link href="/activities" className="transition-colors hover:text-ink">
            연구과제·활동
          </Link>
        </nav>
        <div className="flex flex-col gap-1 md:items-end">
          <p>산학협력 및 연구 문의</p>
          <a
            href={`mailto:${siteCopy.contact.collaborationEmail}`}
            className="transition-colors hover:text-ink"
          >
            {siteCopy.contact.collaborationEmail}
          </a>
          <p>&copy; {year} Yoonity Lab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
