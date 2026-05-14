import { describe, expect, it } from "vitest";
import { getOpeningVideoConfig, OPENING_VIDEO_CONFIG } from "@/lib/game/openingVideo";

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

  it("keeps the opening video ready for the simplified homepage entry", () => {
    expect(getOpeningVideoConfig().status).toBe("ready");
  });
});
