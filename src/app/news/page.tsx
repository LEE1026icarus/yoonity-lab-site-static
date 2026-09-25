import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { NewsArchive } from "@/components/news-archive";
import { SiteFooter } from "@/components/site-footer";
import { getNewsDetails } from "@/lib/content-details";
import { PAGE_METADATA } from "@/lib/seo";

export const metadata: Metadata = PAGE_METADATA["/news"];
export const revalidate = 60;

export default async function NewsPage() {
  const items = await getNewsDetails();

  return (
    <>
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-32">
        <Breadcrumbs items={[{ label: "홈", href: "/" }, { label: "연구실 소식", href: "/news" }]} />
        <p className="text-sm font-semibold text-ink-muted">News</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">연구실 소식</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
          Yoonity Lab의 연구, 교육, 산학협력과 수상 소식을 모았습니다.
        </p>
        <div className="mt-12">
          <NewsArchive items={items} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
