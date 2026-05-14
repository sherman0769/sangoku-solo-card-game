import { describe, expect, it } from "vitest";
import {
  getGameImageObjectPositionStyle,
  getGameImageRenderMode,
  getGameImageVariantClass,
} from "@/components/GameImage";
import { enemyPool } from "@/lib/game/enemies";
import { heroes } from "@/lib/game/heroes";
import { routeEvents } from "@/lib/game/routeEvents";
import { stageRoutes } from "@/lib/game/routes";
import { getStageConfig } from "@/lib/game/stages";
import { VISUAL_ASSET_MANIFEST } from "@/lib/game/visualAssetManifest";

describe("visual asset manifest", () => {
  it("contains the imported visual assets", () => {
    expect(VISUAL_ASSET_MANIFEST).toHaveLength(34);
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

  it("includes the four hero portraits", () => {
    expect(getAssetIdsByType("hero")).toEqual([
      "hero-guan-yu",
      "hero-zhao-yun",
      "hero-zhuge-liang",
      "hero-li-shimin-ai-architect",
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

  it("includes all eight stage background assets", () => {
    expect(getAssetIdsByType("stage-background")).toEqual([
      "stage-abandoned-village",
      "stage-mountain-ambush",
      "stage-ruined-temple-night",
      "stage-black-mountain-camp",
      "stage-xiliang-charge",
      "stage-ancient-battlefield",
      "stage-yellow-turban-altar",
      "stage-hulao-gate",
    ]);
  });

  it("includes all three route image assets", () => {
    expect(getAssetIdsByType("route")).toEqual([
      "route-mountain-path",
      "route-official-road",
      "route-dangerous-pass",
    ]);
  });

  it("includes all nine route event image assets", () => {
    expect(getAssetIdsByType("route-event")).toEqual([
      "route-mountain-spring",
      "route-hermit-guidance",
      "route-misty-path",
      "route-post-station",
      "route-military-dispatch",
      "route-remnant-troops",
      "route-cliff-ambush",
      "route-battlefield-relic",
      "route-night-raid",
    ]);
  });

  it("uses imported PNG portraits for the four heroes", () => {
    expect(getHeroPortrait("guan-yu")).toBe("/images/heroes/guan-yu.png");
    expect(getHeroPortrait("zhao-yun")).toBe("/images/heroes/zhao-yun.png");
    expect(getHeroPortrait("zhuge-liang")).toBe("/images/heroes/zhuge-liang.png");
    expect(getHeroPortrait("li-shimin-ai-architect")).toBe(
      "/images/heroes/li-shimin-ai-architect.png",
    );
    expect(VISUAL_ASSET_MANIFEST).toContainEqual(
      expect.objectContaining({
        id: "hero-li-shimin-ai-architect",
        type: "hero",
        path: "/images/heroes/li-shimin-ai-architect.png",
        status: "ready",
      }),
    );
  });

  it("uses imported PNG portraits for all chapter one enemies", () => {
    expect(getEnemyPortrait("yellow-turban-soldier")).toBe(
      "/images/enemies/yellow-turban-soldier.png",
    );
    expect(getEnemyPortrait("yellow-turban-archer")).toBe(
      "/images/enemies/yellow-turban-archer.png",
    );
    expect(getEnemyPortrait("yellow-turban-brute")).toBe(
      "/images/enemies/yellow-turban-brute.png",
    );
    expect(getEnemyPortrait("bandit-leader")).toBe("/images/enemies/bandit-leader.png");
    expect(getEnemyPortrait("black-mountain-general")).toBe(
      "/images/enemies/black-mountain-general.png",
    );
    expect(getEnemyPortrait("xiliang-cavalry")).toBe("/images/enemies/xiliang-cavalry.png");
    expect(getEnemyPortrait("zhang-liang")).toBe("/images/enemies/zhang-liang.png");
    expect(getEnemyPortrait("zhang-bao")).toBe("/images/enemies/zhang-bao.png");
    expect(getEnemyPortrait("lu-bu")).toBe("/images/enemies/lu-bu.png");
  });

  it("updates imported enemy manifest paths to PNG", () => {
    expect(getAssetPath("enemy-yellow-turban-soldier")).toBe(
      "/images/enemies/yellow-turban-soldier.png",
    );
    expect(getAssetPath("enemy-yellow-turban-archer")).toBe(
      "/images/enemies/yellow-turban-archer.png",
    );
    expect(getAssetPath("enemy-yellow-turban-brute")).toBe(
      "/images/enemies/yellow-turban-brute.png",
    );
    expect(getAssetPath("enemy-bandit-leader")).toBe("/images/enemies/bandit-leader.png");
    expect(getAssetPath("enemy-black-mountain-general")).toBe(
      "/images/enemies/black-mountain-general.png",
    );
    expect(getAssetPath("enemy-xiliang-cavalry")).toBe("/images/enemies/xiliang-cavalry.png");
    expect(getAssetPath("enemy-zhang-liang")).toBe("/images/enemies/zhang-liang.png");
    expect(getAssetPath("enemy-zhang-bao")).toBe("/images/enemies/zhang-bao.png");
    expect(getAssetPath("enemy-lu-bu")).toBe("/images/enemies/lu-bu.png");
  });

  it("uses imported PNG backgrounds for all chapter one stages", () => {
    expect(getStageConfig(1).backgroundImage).toBe("/images/stages/abandoned-village.png");
    expect(getStageConfig(2).backgroundImage).toBe("/images/stages/mountain-ambush.png");
    expect(getStageConfig(3).backgroundImage).toBe("/images/stages/ruined-temple-night.png");
    expect(getStageConfig(4).backgroundImage).toBe("/images/stages/black-mountain-camp.png");
    expect(getStageConfig(5).backgroundImage).toBe("/images/stages/xiliang-charge.png");
    expect(getStageConfig(6).backgroundImage).toBe("/images/stages/ancient-battlefield.png");
    expect(getStageConfig(7).backgroundImage).toBe("/images/stages/yellow-turban-altar.png");
    expect(getStageConfig(8).backgroundImage).toBe("/images/stages/hulao-gate.png");
  });

  it("updates imported stage manifest paths to PNG", () => {
    expect(getAssetPath("stage-abandoned-village")).toBe("/images/stages/abandoned-village.png");
    expect(getAssetPath("stage-mountain-ambush")).toBe("/images/stages/mountain-ambush.png");
    expect(getAssetPath("stage-ruined-temple-night")).toBe(
      "/images/stages/ruined-temple-night.png",
    );
    expect(getAssetPath("stage-black-mountain-camp")).toBe(
      "/images/stages/black-mountain-camp.png",
    );
    expect(getAssetPath("stage-xiliang-charge")).toBe("/images/stages/xiliang-charge.png");
    expect(getAssetPath("stage-ancient-battlefield")).toBe(
      "/images/stages/ancient-battlefield.png",
    );
    expect(getAssetPath("stage-yellow-turban-altar")).toBe(
      "/images/stages/yellow-turban-altar.png",
    );
    expect(getAssetPath("stage-hulao-gate")).toBe("/images/stages/hulao-gate.png");
  });

  it("uses imported PNG images for all route choices", () => {
    expect(getRouteImage("mountain-path")).toBe("/images/routes/mountain-path.png");
    expect(getRouteImage("official-road")).toBe("/images/routes/official-road.png");
    expect(getRouteImage("dangerous-pass")).toBe("/images/routes/dangerous-pass.png");
  });

  it("updates imported route manifest paths to PNG", () => {
    expect(getAssetPath("route-mountain-path")).toBe("/images/routes/mountain-path.png");
    expect(getAssetPath("route-official-road")).toBe("/images/routes/official-road.png");
    expect(getAssetPath("route-dangerous-pass")).toBe("/images/routes/dangerous-pass.png");
  });

  it("uses imported PNG images for all route events", () => {
    expect(getRouteEventImage("mountain-spring")).toBe(
      "/images/events/route-mountain-spring.png",
    );
    expect(getRouteEventImage("hermit-guidance")).toBe(
      "/images/events/route-hermit-guidance.png",
    );
    expect(getRouteEventImage("foggy-trail")).toBe("/images/events/route-misty-path.png");
    expect(getRouteEventImage("relay-station")).toBe("/images/events/route-post-station.png");
    expect(getRouteEventImage("urgent-orders")).toBe(
      "/images/events/route-military-dispatch.png",
    );
    expect(getRouteEventImage("remnant-troops")).toBe(
      "/images/events/route-remnant-troops.png",
    );
    expect(getRouteEventImage("cliff-ambush")).toBe(
      "/images/events/route-cliff-ambush.png",
    );
    expect(getRouteEventImage("battlefield-relic")).toBe(
      "/images/events/route-battlefield-relic.png",
    );
    expect(getRouteEventImage("night-raid")).toBe("/images/events/route-night-raid.png");
  });

  it("updates imported route event manifest paths to PNG", () => {
    expect(getAssetPath("route-mountain-spring")).toBe(
      "/images/events/route-mountain-spring.png",
    );
    expect(getAssetPath("route-hermit-guidance")).toBe(
      "/images/events/route-hermit-guidance.png",
    );
    expect(getAssetPath("route-misty-path")).toBe("/images/events/route-misty-path.png");
    expect(getAssetPath("route-post-station")).toBe("/images/events/route-post-station.png");
    expect(getAssetPath("route-military-dispatch")).toBe(
      "/images/events/route-military-dispatch.png",
    );
    expect(getAssetPath("route-remnant-troops")).toBe(
      "/images/events/route-remnant-troops.png",
    );
    expect(getAssetPath("route-cliff-ambush")).toBe(
      "/images/events/route-cliff-ambush.png",
    );
    expect(getAssetPath("route-battlefield-relic")).toBe(
      "/images/events/route-battlefield-relic.png",
    );
    expect(getAssetPath("route-night-raid")).toBe("/images/events/route-night-raid.png");
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
    expect(getGameImageVariantClass("vertical")).toContain("aspect-[9/16]");
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

function getRouteImage(routeId: string) {
  return stageRoutes.find((route) => route.id === routeId)?.image;
}

function getRouteEventImage(eventId: string) {
  return routeEvents.find((event) => event.id === eventId)?.image;
}

function getAssetPath(assetId: string) {
  return VISUAL_ASSET_MANIFEST.find((asset) => asset.id === assetId)?.path;
}
