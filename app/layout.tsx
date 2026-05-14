import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PwaRegistrar } from "@/components/PwaRegistrar";
import { productionUrl } from "@/lib/game/share";
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
  metadataBase: new URL(productionUrl),
  title: "三國單騎傳｜李詩民 AI 協作開發",
  description:
    "李詩民以 AI 協作打造的三國單人卡牌 Roguelike 遊戲，整合文、圖、聲、影與互動部署流程。",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: "三國單騎傳",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "三國單騎傳｜李詩民 AI 協作開發",
    description:
      "李詩民以 AI 協作打造的三國單人卡牌 Roguelike 遊戲，整合文、圖、聲、影與互動部署流程。",
    url: productionUrl,
    siteName: "三國單騎傳",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "/images/covers/home-hero.png",
        width: 1200,
        height: 630,
        alt: "三國單騎傳",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "三國單騎傳｜李詩民 AI 協作開發",
    description:
      "李詩民以 AI 協作打造的三國單人卡牌 Roguelike 遊戲，整合文、圖、聲、影與互動部署流程。",
    images: ["/images/covers/home-hero.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#140c09",
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
      <body className="min-h-full flex flex-col">
        <PwaRegistrar />
        {children}
      </body>
    </html>
  );
}
