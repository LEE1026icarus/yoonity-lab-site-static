export const INDEXABLE_ROUTES = [
  "/",
  "/about",
  "/professor",
  "/researchers",
  "/publications",
  "/activities",
] as const;

type SiteEnvironment = {
  NEXT_PUBLIC_SITE_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
};

export function resolveSiteUrl(
  env: SiteEnvironment = {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  },
): URL {
  const configuredUrl = env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelDomain = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const url = new URL(
    configuredUrl || (vercelDomain ? `https://${vercelDomain}` : "http://localhost:3000"),
  );

  url.pathname = "/";
  url.search = "";
  url.hash = "";
  return url;
}

export const siteUrl = resolveSiteUrl();
