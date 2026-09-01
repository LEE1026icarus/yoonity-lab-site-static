import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { BackgroundScene } from "@/components/background-scene";
import { GoogleTagManager } from "@/components/google-tag-manager";
import { getGoogleTagManagerContainerId } from "@/lib/analytics";
import { siteUrl } from "@/lib/site";
import {
  GOOGLE_SITE_VERIFICATION,
  HOME_DESCRIPTION,
  HOME_TITLE,
  PAGE_METADATA,
} from "@/lib/seo";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: HOME_TITLE,
    template: "%s | Yoonity Lab",
  },
  description: HOME_DESCRIPTION,
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
  },
  openGraph: PAGE_METADATA["/"].openGraph,
  twitter: PAGE_METADATA["/"].twitter,
};

const gtmContainerId = getGoogleTagManagerContainerId();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <GoogleTagManager containerId={gtmContainerId} />
        <BackgroundScene />
        <SiteHeader />
        <div className="relative z-10 flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
