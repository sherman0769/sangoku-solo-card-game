import { existsSync, readFileSync } from "node:fs";
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

const importedRouteImageIds = [
  "route-mountain-path",
  "route-official-road",
  "route-dangerous-pass",
] as const;

const importedRouteEventImageIds = [
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
    expect(CHAPTER_1_IMAGE_GAP_MANIFEST).toHaveLength(0);
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

  it("moves imported route images out of the gap manifest", () => {
    const gapIds = CHAPTER_1_IMAGE_GAP_MANIFEST.map((item) => item.id);
    const readyIds = CHAPTER_1_READY_IMAGE_MANIFEST.map((item) => item.id);

    importedRouteImageIds.forEach((id) => {
      expect(gapIds).not.toContain(id);
      expect(readyIds).toContain(id);
    });
  });

  it("moves imported route event images out of the gap manifest", () => {
    const gapIds = CHAPTER_1_IMAGE_GAP_MANIFEST.map((item) => item.id);
    const readyIds = CHAPTER_1_READY_IMAGE_MANIFEST.map((item) => item.id);

    importedRouteEventImageIds.forEach((id) => {
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

  it("contains no route image gaps", () => {
    const routeGaps = CHAPTER_1_IMAGE_GAP_MANIFEST.filter((item) => item.type === "route");

    expect(routeGaps).toHaveLength(0);
  });

  it("contains no route event image gaps", () => {
    const routeEventGaps = CHAPTER_1_IMAGE_GAP_MANIFEST.filter((item) => item.type === "route-event");

    expect(routeEventGaps).toHaveLength(0);
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
        "route-mountain-path",
        "route-official-road",
        "route-dangerous-pass",
        "route-mountain-spring",
        "route-hermit-guidance",
        "route-misty-path",
        "route-post-station",
        "route-military-dispatch",
        "route-remnant-troops",
        "route-cliff-ambush",
        "route-battlefield-relic",
        "route-night-raid",
      ]),
    );
    expect(CHAPTER_1_READY_IMAGE_MANIFEST).toHaveLength(33);
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

  it("marks the image gap document as completed", () => {
    const documentText = existsSync("docs/image-gap-chapter-1-v0.19.0.md")
      ? readFileSync("docs/image-gap-chapter-1-v0.19.0.md", "utf8")
      : "";

    expect(documentText).toContain("第一章圖片缺口歸零");
    expect(documentText).toContain("`CHAPTER_1_IMAGE_GAP_MANIFEST` 目前共有 0 筆");
  });
});
