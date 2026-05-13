import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "三國單騎傳",
  description: "v0.13.2 首頁與戰鬥視覺修正版：修復手機戰鬥角色與敵人縮圖、首頁武將選擇音效與登場語音試聽、開場動畫入口上移、教學與版本特色收合，並支援手機戰鬥 HUD、底部手牌操作區、9:16 第一章開場動畫、語音播放框架與 Web Audio API 提示音的三國卡牌闖關遊戲。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hant"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
