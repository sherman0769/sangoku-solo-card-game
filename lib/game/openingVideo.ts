export type OpeningVideoStatus = "planned" | "ready";

export interface OpeningVideoConfig {
  id: string;
  title: string;
  src: string;
  aspectRatio: "9:16";
  durationSeconds: number;
  description: string;
  status: OpeningVideoStatus;
}

export const OPENING_VIDEO_CONFIG: OpeningVideoConfig = {
  id: "opening-intro",
  title: "第一章開場動畫",
  src: "/videos/opening-intro.mp4",
  aspectRatio: "9:16",
  durationSeconds: 20,
  description: "第一章：黃巾亂起 的開場動畫",
  status: "ready",
};

export function getOpeningVideoConfig() {
  return OPENING_VIDEO_CONFIG;
}
