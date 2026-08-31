import path from "node:path";
import type { NextConfig } from "next";

const CANONICAL_ORIGIN = "https://www.yoonity.kr";
const LEGACY_PRODUCTION_HOSTS = [
  "yoonity.kr",
  "yoonity-lab-site-static.vercel.app",
  "yoonity-lab-site-static-lee1026icarus-projects.vercel.app",
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
    return LEGACY_PRODUCTION_HOSTS.map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: `${CANONICAL_ORIGIN}/:path*`,
      permanent: true,
    }));
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
