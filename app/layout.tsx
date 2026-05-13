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
  description: "v0.13.3 開場動畫體驗優化版：首頁點擊觀看開場動畫後會直接開啟全螢幕 9:16 modal 並嘗試播放，可關閉、略過、重播，並保留首頁武將選擇音效與登場語音試聽、手機戰鬥 HUD、底部手牌操作區、語音播放框架與 Web Audio API 提示音。",
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
