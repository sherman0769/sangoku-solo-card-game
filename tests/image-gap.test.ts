import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  CHAPTER_1_IMAGE_GAP_MANIFEST,
  CHAPTER_1_READY_IMAGE_MANIFEST,
} from "@/lib/game/imageGapManifest";

const importedP0ImageIds = [
  "enemy-yellow-turban-archer",
  "enemy-yellow-turban-brute",
  "enemy-black-mountain-general",
  "enemy-zhang-liang",
  "enemy-zhang-bao",
  "stage-mountain-ambush",
  "stage-ruined-temple-night",
  "stage-black-mountain-camp",
  "stage-xiliang-charge",
  "stage-ancient-battlefield",
  "stage-yellow-turban-altar",
] as const;

const routeGapIds = [
  "route-mountain-path",
  "route-official-road",
  "route-dangerous-pass",
] as const;

const routeEventGapIds = [
  "route-mountain-spring",
  "route-hermit-guidance",
  "route-misty-path",
  "route-post-station",
  "route-military-dispatch",
  "route-remnant-troops",
  "route-cliff-ambush",
  "route-battlefield-relic",
  "route-night-raid",
] as const;

describe("chapter one image gap manifest", () => {
  it("contains planned chapter one image gaps", () => {
    expect(CHAPTER_1_IMAGE_GAP_MANIFEST).toHaveLength(12);
    expect(CHAPTER_1_IMAGE_GAP_MANIFEST.every((item) => item.status === "planned")).toBe(true);
  });

  it("moves imported enemy and stage P0 images out of the gap manifest", () => {
    const gapIds = CHAPTER_1_IMAGE_GAP_MANIFEST.map((item) => item.id);
    const readyIds = CHAPTER_1_READY_IMAGE_MANIFEST.map((item) => item.id);

    importedP0ImageIds.forEach((id) => {
      expect(gapIds).not.toContain(id);
      expect(readyIds).toContain(id);
    });
  });

  it("contains no enemy image gaps", () => {
    const enemyGaps = CHAPTER_1_IMAGE_GAP_MANIFEST.filter(
      (item) => item.type === "enemy" || item.type === "mini-boss",
    );

    expect(enemyGaps).toHaveLength(0);
  });

  it("contains no stage background gaps", () => {
    const stageGaps = CHAPTER_1_IMAGE_GAP_MANIFEST.filter((item) => item.type === "stage-background");

    expect(stageGaps).toHaveLength(0);
  });

  it("contains three route image gaps", () => {
    const routeGaps = CHAPTER_1_IMAGE_GAP_MANIFEST.filter((item) => item.type === "route");

    expect(routeGaps).toHaveLength(3);
    expect(routeGaps.map((item) => item.id)).toEqual(routeGapIds);
  });

  it("contains nine route event image gaps", () => {
    const routeEventGaps = CHAPTER_1_IMAGE_GAP_MANIFEST.filter((item) => item.type === "route-event");

    expect(routeEventGaps).toHaveLength(9);
    expect(routeEventGaps.map((item) => item.id)).toEqual(routeEventGapIds);
  });

  it("includes required fields and prompts for every gap", () => {
    CHAPTER_1_IMAGE_GAP_MANIFEST.forEach((item) => {
      expect(item.id).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.type).toBeTruthy();
      expect(item.priority).toMatch(/^P[0-2]$/);
      expect(item.aspectRatio).toBeTruthy();
      expect(item.path).toMatch(/^public\/images\//);
      expect(item.usage).toBeTruthy();
      expect(item.promptZh).toBeTruthy();
      expect(item.promptEn).toBeTruthy();
      expect(item.negativePrompt).toContain("文字");
      expect(item.status).toBe("planned");
    });
  });

  it("lists the ready homepage, hero, enemy, boss, and all stage images", () => {
    expect(CHAPTER_1_READY_IMAGE_MANIFEST.map((item) => item.id)).toEqual(
      expect.arrayContaining([
        "home-hero",
        "hero-guan-yu",
        "hero-zhao-yun",
        "hero-zhuge-liang",
        "enemy-yellow-turban-soldier",
        "enemy-yellow-turban-archer",
        "enemy-yellow-turban-brute",
        "enemy-bandit-leader",
        "enemy-black-mountain-general",
        "enemy-xiliang-cavalry",
        "enemy-zhang-liang",
        "enemy-zhang-bao",
        "enemy-lu-bu",
        "stage-abandoned-village",
        "stage-mountain-ambush",
        "stage-ruined-temple-night",
        "stage-black-mountain-camp",
        "stage-xiliang-charge",
        "stage-ancient-battlefield",
        "stage-yellow-turban-altar",
        "stage-hulao-gate",
      ]),
    );
    expect(CHAPTER_1_READY_IMAGE_MANIFEST).toHaveLength(21);
    expect(CHAPTER_1_READY_IMAGE_MANIFEST.every((item) => item.status === "ready")).toBe(true);
  });

  it("keeps ready image ids out of the gap manifest", () => {
    const gapIds = CHAPTER_1_IMAGE_GAP_MANIFEST.map((item) => item.id);

    CHAPTER_1_READY_IMAGE_MANIFEST.forEach((readyAsset) => {
      expect(gapIds).not.toContain(readyAsset.id);
    });
  });

  it("keeps the image gap document available", () => {
    expect(existsSync("docs/image-gap-chapter-1-v0.19.0.md")).toBe(true);
  });
});
