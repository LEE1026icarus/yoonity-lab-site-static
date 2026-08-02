import type { Metadata } from "next";
import { pretendard } from "./fonts";
import { SiteHeader } from "@/components/site-header";
import { BackgroundScene } from "@/components/background-scene";
import "./globals.css";

export const metadata: Metadata = {
  title: "yoonity — 유니티 연구실",
  description:
    "AI를 넘어, 양자가 여는 다음 가능성. 동국대학교 경영정보학과 Yoonity 연구실은 복잡한 산업의 의사결정 문제를 풀어냅니다.",
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
