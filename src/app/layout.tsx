import type { Metadata } from "next";
import { pretendard } from "./fonts";
import { SiteHeader } from "@/components/site-header";
import { BackgroundScene } from "@/components/background-scene";
import { siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "동국대학교 경영정보학과 산업 문제 해결형 AI 연구실 | Yoonity Lab",
    template: "%s | Yoonity Lab",
  },
  description:
    "동국대학교 경영정보학과 Yoonity Lab은 AI·생성형 AI·양자컴퓨팅을 활용해 산업 의사결정, 예측·최적화 및 산학협력 과제를 연구합니다.",
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
