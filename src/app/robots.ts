import type { MetadataRoute } from "next";
import { createRobotsConfig } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return createRobotsConfig(siteUrl);
}
