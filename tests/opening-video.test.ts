import { describe, expect, it } from "vitest";
import { getOpeningVideoConfig, OPENING_VIDEO_CONFIG } from "@/lib/game/openingVideo";
import { currentFeatureHighlights } from "@/lib/game/showcase";

describe("opening video config", () => {
  it("defines the ready opening intro video asset", () => {
    expect(OPENING_VIDEO_CONFIG).toMatchObject({
      id: "opening-intro",
      title: "第一章開場動畫",
      src: "/videos/opening-intro.mp4",
      aspectRatio: "9:16",
      durationSeconds: 20,
      description: "第一章：黃巾亂起 的開場動畫",
      status: "ready",
    });
  });

  it("returns the opening video config through the helper", () => {
    expect(getOpeningVideoConfig()).toBe(OPENING_VIDEO_CONFIG);
  });

  it("includes the opening video in homepage feature copy", () => {
    expect(currentFeatureHighlights).toContain("開頭動畫：以 AI 圖像、影片與音樂製作第一章開場");
  });
});
