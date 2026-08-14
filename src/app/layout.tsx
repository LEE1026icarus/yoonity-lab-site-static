import type { Metadata } from "next";
import { pretendard } from "./fonts";
import { SiteHeader } from "@/components/site-header";
import { BackgroundScene } from "@/components/background-scene";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yoonity Lab — 산업 문제 해결형 AI 연구실",
  description:
    "Yoonity Lab은 산업의 복잡한 의사결정 문제를 AI와 데이터로 설계·검증하고, 다음 기술 전환을 준비하는 동국대학교 경영정보학과 연구실입니다.",
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
