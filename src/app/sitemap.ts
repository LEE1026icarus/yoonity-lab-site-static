import type { MetadataRoute } from "next";
import { createDetailSitemapEntries } from "@/lib/content-details";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return createDetailSitemapEntries(siteUrl);
}
