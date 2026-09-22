import { getNewsDetails } from "@/lib/content-details";
import { buildNewsRss } from "@/lib/rss";
import { siteUrl } from "@/lib/site";

export const revalidate = 60;

export async function GET() {
  const items = await getNewsDetails();
  return new Response(buildNewsRss(items, siteUrl), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
