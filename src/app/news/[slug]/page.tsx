import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetail } from "@/components/content-detail";
import { createDetailMetadata } from "@/lib/seo";
import {
  detailDescription,
  detailPath,
  getDetailParams,
  getNewsDetail,
} from "@/lib/content-details";
import { createNewsStructuredData } from "@/lib/structured-data";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getDetailParams("news");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsDetail(slug);
  if (!news) return {};

  return createDetailMetadata({
    route: detailPath("news", news.slug),
    title: news.title,
    description: detailDescription("news", news),
    type: "article",
  });
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const news = await getNewsDetail(slug);
  if (!news) notFound();

  return (
    <ContentDetail
      eyebrow="연구실 소식"
      title={news.title}
      description={news.excerpt}
      metadata={[{ label: "발행일", value: news.date }]}
      breadcrumbs={[
        { label: "홈", href: "/" },
        { label: "연구실 소개", href: "/about" },
        { label: "연구실 소식", href: "/about#news" },
        { label: news.title, href: detailPath("news", news.slug) },
      ]}
      parentHref="/about#news"
      parentLabel="연구실 소식"
      sourceHref={news.href}
      structuredData={createNewsStructuredData(news)}
    />
  );
}
