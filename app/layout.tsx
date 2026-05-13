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
  description: "v0.12.3 第一批 TTS 語音導入版：支援章節開場、武將登場與呂布登場語音、audioKey 語音播放框架、Web Audio API 提示音、首頁主視覺、武將立繪、敵人圖像、關卡背景、人物台詞、8 關流程、裝備卡、戰術卡、事件關卡與路線選擇的三國卡牌闖關遊戲。",
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
