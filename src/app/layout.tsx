import type { Metadata } from "next";
import { pretendard } from "./fonts";
import { SiteHeader } from "@/components/site-header";
import { BackgroundScene } from "@/components/background-scene";
import { siteUrl } from "@/lib/site";
import { HOME_DESCRIPTION, HOME_TITLE, PAGE_METADATA } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: HOME_TITLE,
    template: "%s | Yoonity Lab",
  },
  description: HOME_DESCRIPTION,
  openGraph: PAGE_METADATA["/"].openGraph,
  twitter: PAGE_METADATA["/"].twitter,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <BackgroundScene />
        <SiteHeader />
        <div className="relative z-10 flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
