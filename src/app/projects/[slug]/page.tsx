import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetail } from "@/components/content-detail";
import { createDetailMetadata } from "@/lib/seo";
import {
  detailDescription,
  detailPath,
  getDetailParams,
  getProjectDetail,
} from "@/lib/content-details";
import { createProjectStructuredData } from "@/lib/structured-data";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getDetailParams("projects");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectDetail(slug);
  if (!project) return {};

  return createDetailMetadata({
    route: detailPath("projects", project.slug),
    title: project.title,
    description: detailDescription("projects", project),
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectDetail(slug);
  if (!project) notFound();

  return (
    <ContentDetail
      eyebrow="연구과제"
      title={project.title}
      description={detailDescription("projects", project)}
      metadata={[
        ...(project.org ? [{ label: "협력 기관", value: project.org }] : []),
        ...(project.tag ? [{ label: "구분", value: project.tag }] : []),
        { label: "기간", value: project.period },
      ]}
      breadcrumbs={[
        { label: "홈", href: "/" },
        { label: "연구과제·수상·대외활동", href: "/activities" },
        { label: "연구 과제", href: "/activities#project" },
        { label: project.title, href: detailPath("projects", project.slug) },
      ]}
      parentHref="/activities#project"
      parentLabel="연구 과제"
      sourceHref={project.href}
      structuredData={createProjectStructuredData(project)}
    />
  );
}
