import { describe, expect, it } from "vitest";
import { getGameImageRenderMode } from "@/components/GameImage";
import { heroes } from "@/lib/game/heroes";
import { VISUAL_ASSET_MANIFEST } from "@/lib/game/visualAssetManifest";

describe("visual asset manifest", () => {
  it("contains the first ten planned visual assets", () => {
    expect(VISUAL_ASSET_MANIFEST).toHaveLength(10);
  });

  it("includes required fields for every asset", () => {
    for (const asset of VISUAL_ASSET_MANIFEST) {
      expect(asset.id).toBeTruthy();
      expect(asset.type).toBeTruthy();
      expect(asset.name).toBeTruthy();
      expect(asset.aspectRatio).toBeTruthy();
      expect(asset.path).toBeTruthy();
      expect(asset.usage).toBeTruthy();
      expect(asset.promptZh).toBeTruthy();
      expect(asset.promptEn).toBeTruthy();
    }
  });

  it("includes the homepage cover asset", () => {
    expect(VISUAL_ASSET_MANIFEST).toContainEqual(
      expect.objectContaining({
        id: "home-hero",
        type: "cover",
        path: "/images/covers/home-hero.png",
      }),
    );
  });

  it("includes the three hero portraits", () => {
    expect(getAssetIdsByType("hero")).toEqual([
      "hero-guan-yu",
      "hero-zhao-yun",
      "hero-zhuge-liang",
    ]);
  });

  it("includes Lu Bu as the boss asset", () => {
    expect(VISUAL_ASSET_MANIFEST).toContainEqual(
      expect.objectContaining({
        id: "enemy-lu-bu",
        type: "boss",
        name: "呂布",
      }),
    );
  });

  it("includes two stage background assets", () => {
    expect(getAssetIdsByType("stage-background")).toEqual([
      "stage-abandoned-village",
      "stage-hulao-gate",
    ]);
  });

  it("uses imported PNG portraits for the three heroes", () => {
    expect(getHeroPortrait("guan-yu")).toBe("/images/heroes/guan-yu.png");
    expect(getHeroPortrait("zhao-yun")).toBe("/images/heroes/zhao-yun.png");
    expect(getHeroPortrait("zhuge-liang")).toBe("/images/heroes/zhuge-liang.png");
  });

  it("uses image paths when available and falls back when missing or failed", () => {
    expect(getGameImageRenderMode("/images/heroes/guan-yu.png")).toBe("image");
    expect(getGameImageRenderMode(undefined)).toBe("fallback");
    expect(getGameImageRenderMode("/images/heroes/guan-yu.png", true)).toBe("fallback");
  });
});

function getAssetIdsByType(type: (typeof VISUAL_ASSET_MANIFEST)[number]["type"]) {
  return VISUAL_ASSET_MANIFEST.filter((asset) => asset.type === type).map((asset) => asset.id);
}

function getHeroPortrait(heroId: string) {
  return heroes.find((hero) => hero.id === heroId)?.portrait;
}
