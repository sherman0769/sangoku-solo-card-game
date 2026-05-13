import { describe, expect, it } from "vitest";
import {
  getGameImageObjectPositionStyle,
  getGameImageRenderMode,
  getGameImageVariantClass,
} from "@/components/GameImage";
import { enemyPool } from "@/lib/game/enemies";
import { heroes } from "@/lib/game/heroes";
import { getStageConfig } from "@/lib/game/stages";
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
        path: "/images/enemies/lu-bu.png",
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

  it("uses imported PNG portraits for the second enemy image batch", () => {
    expect(getEnemyPortrait("yellow-turban-soldier")).toBe(
      "/images/enemies/yellow-turban-soldier.png",
    );
    expect(getEnemyPortrait("bandit-leader")).toBe("/images/enemies/bandit-leader.png");
    expect(getEnemyPortrait("xiliang-cavalry")).toBe("/images/enemies/xiliang-cavalry.png");
    expect(getEnemyPortrait("lu-bu")).toBe("/images/enemies/lu-bu.png");
  });

  it("updates imported enemy manifest paths to PNG", () => {
    expect(getAssetPath("enemy-yellow-turban-soldier")).toBe(
      "/images/enemies/yellow-turban-soldier.png",
    );
    expect(getAssetPath("enemy-bandit-leader")).toBe("/images/enemies/bandit-leader.png");
    expect(getAssetPath("enemy-xiliang-cavalry")).toBe("/images/enemies/xiliang-cavalry.png");
    expect(getAssetPath("enemy-lu-bu")).toBe("/images/enemies/lu-bu.png");
  });

  it("keeps non-imported enemies on placeholder fallback keys", () => {
    expect(getEnemyPortrait("yellow-turban-archer")).toBe("enemy-yellow-turban-archer");
    expect(getEnemyPortrait("yellow-turban-brute")).toBe("enemy-yellow-turban-brute");
    expect(getEnemyPortrait("black-mountain-general")).toBe("enemy-black-mountain-general");
    expect(getEnemyPortrait("zhang-liang")).toBe("enemy-zhang-liang");
    expect(getEnemyPortrait("zhang-bao")).toBe("enemy-zhang-bao");
  });

  it("uses imported PNG backgrounds for the first stage background batch", () => {
    expect(getStageConfig(1).backgroundImage).toBe("/images/stages/abandoned-village.png");
    expect(getStageConfig(8).backgroundImage).toBe("/images/stages/hulao-gate.png");
  });

  it("updates imported stage manifest paths to PNG", () => {
    expect(getAssetPath("stage-abandoned-village")).toBe("/images/stages/abandoned-village.png");
    expect(getAssetPath("stage-hulao-gate")).toBe("/images/stages/hulao-gate.png");
  });

  it("keeps non-imported stages on placeholder fallback keys", () => {
    expect(getStageConfig(2).backgroundImage).toBe("stage-mountain-ambush");
    expect(getStageConfig(3).backgroundImage).toBe("stage-ruined-temple-night");
    expect(getStageConfig(4).backgroundImage).toBe("stage-black-mountain-fort");
    expect(getStageConfig(5).backgroundImage).toBe("stage-xiliang-cavalry");
    expect(getStageConfig(6).backgroundImage).toBe("stage-ancient-battlefield");
    expect(getStageConfig(7).backgroundImage).toBe("stage-yellow-turban-altar");
  });

  it("uses image paths when available and falls back when missing or failed", () => {
    expect(getGameImageRenderMode("/images/heroes/guan-yu.png")).toBe("image");
    expect(getGameImageRenderMode(undefined)).toBe("fallback");
    expect(getGameImageRenderMode("/images/heroes/guan-yu.png", true)).toBe("fallback");
  });

  it("supports shared image variants and object position for visual QA", () => {
    expect(getGameImageVariantClass("cover")).toContain("aspect-[16/9]");
    expect(getGameImageVariantClass("background")).toContain("aspect-[16/9]");
    expect(getGameImageVariantClass("portrait")).toContain("aspect-[3/4]");
    expect(getGameImageObjectPositionStyle("50% 18%")).toEqual({
      objectPosition: "50% 18%",
    });
  });
});

function getAssetIdsByType(type: (typeof VISUAL_ASSET_MANIFEST)[number]["type"]) {
  return VISUAL_ASSET_MANIFEST.filter((asset) => asset.type === type).map((asset) => asset.id);
}

function getHeroPortrait(heroId: string) {
  return heroes.find((hero) => hero.id === heroId)?.portrait;
}

function getEnemyPortrait(enemyId: string) {
  return enemyPool.find((enemy) => enemy.id === enemyId)?.portrait;
}

function getAssetPath(assetId: string) {
  return VISUAL_ASSET_MANIFEST.find((asset) => asset.id === assetId)?.path;
}
