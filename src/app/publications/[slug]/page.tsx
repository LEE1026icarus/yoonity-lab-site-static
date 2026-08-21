import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetail } from "@/components/content-detail";
import { createDetailMetadata } from "@/lib/seo";
import {
  detailDescription,
  detailPath,
  getDetailParams,
  getPublicationDetail,
} from "@/lib/content-details";
import { createPublicationStructuredData } from "@/lib/structured-data";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getDetailParams("publications");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const publication = await getPublicationDetail(slug);
  if (!publication) return {};

  return createDetailMetadata({
    route: detailPath("publications", publication.slug),
    title: publication.title,
    description: detailDescription("publications", publication),
    type: "article",
  });
}

export default async function PublicationDetailPage({ params }: Props) {
  const { slug } = await params;
  const publication = await getPublicationDetail(slug);
  if (!publication) notFound();

  const sectionLabel =
    publication.category === "intl-paper"
      ? "해외 논문"
      : publication.category === "domestic-paper"
        ? "국내 논문"
        : publication.category === "book"
          ? "도서"
          : "특허";

  return (
    <ContentDetail
      eyebrow={sectionLabel}
      title={publication.title}
      description={detailDescription("publications", publication)}
      metadata={publication.meta ? [{ label: "서지 정보", value: publication.meta }] : []}
      breadcrumbs={[
        { label: "홈", href: "/" },
        { label: "논문·도서·특허", href: "/publications" },
        { label: sectionLabel, href: `/publications#${publication.category}` },
        { label: publication.title, href: detailPath("publications", publication.slug) },
      ]}
      parentHref={`/publications#${publication.category}`}
      parentLabel={sectionLabel}
      sourceHref={publication.href}
      structuredData={createPublicationStructuredData(publication)}
    />
  );
}
