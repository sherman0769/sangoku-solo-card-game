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
  description: "v0.13.1 手機遊玩 UI / UX 優化版：支援手機戰鬥 HUD、底部手牌操作區、戰鬥紀錄與狀態設定收合、9:16 第一章開場動畫、章節開場語音、武將登場與呂布登場語音、audioKey 語音播放框架、Web Audio API 提示音、首頁主視覺、武將立繪、敵人圖像、關卡背景、人物台詞、8 關流程、裝備卡、戰術卡、事件關卡與路線選擇的三國卡牌闖關遊戲。",
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
