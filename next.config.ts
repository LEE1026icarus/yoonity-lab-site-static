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
};

export default nextConfig;
