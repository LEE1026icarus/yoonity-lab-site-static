import path from "node:path";
import type { NextConfig } from "next";

const CANONICAL_ORIGIN = "https://www.yoonity.kr";
const LEGACY_PRODUCTION_HOSTS = [
  "yoonity.kr",
  "yoonity-lab-site-static.vercel.app",
  "yoonity-lab-site-static-lee1026icarus-projects.vercel.app",
];

const LEGACY_PATH_REDIRECTS = [
  { source: "/%EC%A7%80%EB%8F%84%EA%B5%90%EC%88%98", destination: "/professor", permanent: true },
  { source: "/%EC%97%B0%EA%B5%AC%EC%9B%90", destination: "/researchers", permanent: true },
  { source: "/%EC%97%B0%EA%B5%AC%EC%9B%90/:path*", destination: "/researchers", permanent: true },
  { source: "/%EC%97%B0%EA%B5%AC%EC%9B%90-%EC%B6%9C%ED%8C%90", destination: "/publications", permanent: true },
  { source: "/%EC%B6%9C%ED%8C%90", destination: "/publications", permanent: true },
  { source: "/%ED%99%9C%EB%8F%99", destination: "/activities", permanent: true },
  { source: "/%ED%99%9C%EB%8F%99/:path*", destination: "/activities", permanent: true },
  { source: "/%EB%89%B4%EC%8A%A4-%EA%B8%B0%EC%82%AC/:path*", destination: "/about#news", permanent: true },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "drive.google.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  async redirects() {
    return [
      ...LEGACY_PATH_REDIRECTS,
      ...LEGACY_PRODUCTION_HOSTS.map((host) => ({
        source: "/:path*",
        has: [{ type: "host" as const, value: host }],
        destination: `${CANONICAL_ORIGIN}/:path*`,
        permanent: true,
      })),
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; frame-src https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com; img-src 'self' data: blob: https:; style-src 'self' 'unsafe-inline'; font-src 'self' data:;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
