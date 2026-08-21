import type { MetadataRoute } from "next";
import { createSitemapEntries } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return createSitemapEntries(siteUrl);
}
