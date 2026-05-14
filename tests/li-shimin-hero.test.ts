import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { starterDeck } from "@/lib/game/cards";
import { getHeroDialogue } from "@/lib/game/dialogues";
import { createGame, endTurn, playCard } from "@/lib/game/engine";
import { heroes } from "@/lib/game/heroes";
import { simulateManyRuns } from "@/lib/game/balanceSimulator";
import { getTtsAssetByAudioKey } from "@/lib/game/ttsManifest";
import { canPlayVoice } from "@/lib/game/voice";
import { VISUAL_ASSET_MANIFEST } from "@/lib/game/visualAssetManifest";

const liShiminId = "li-shimin-ai-architect";
const liShiminAudioKeys = [
  "li-shimin-strategy",
  "li-shimin-damage",
  "li-shimin-low-hp",
  "li-shimin-victory",
] as const;

describe("Li Shimin AI architect hero", () => {
  it("adds Li Shimin as the fourth selectable hero", () => {
    expect(heroes).toHaveLength(4);
    expect(heroes).toContainEqual(
      expect.objectContaining({
        id: liShiminId,
        name: "李詩民",
        title: "AI 架構師",
        maxHp: 4,
        skillName: "架構推演",
        role: "系統調度",
        portrait: "/images/heroes/li-shimin-ai-architect.png",
        avatar: "/images/heroes/li-shimin-ai-architect.png",
        placeholderKey: "hero-li-shimin-ai-architect",
      }),
    );
    expect(VISUAL_ASSET_MANIFEST).toContainEqual(
      expect.objectContaining({
        id: "hero-li-shimin-ai-architect",
        path: "/images/heroes/li-shimin-ai-architect.png",
        status: "ready",
        usage: "首頁角色卡、遊戲玩家面板",
      }),
    );
  });

  it("creates a game with Li Shimin and still falls back to Guan Yu for unknown heroes", () => {
    const state = createGame(liShiminId);
    const fallback = createGame("unknown-hero");

    expect(state.player.heroId).toBe(liShiminId);
    expect(state.player.name).toBe("李詩民");
    expect(state.player.maxHealth).toBe(4);
    expect(state.player.skillName).toBe("架構推演");
    expect(fallback.player.heroId).toBe("guan-yu");
  });

  it("draws one extra card on the first strategy card each turn", () => {
    const manual = getCard("兵書");
    const state = {
      ...createGame(liShiminId),
      hand: [manual],
      deck: [getCard("斬"), getCard("閃"), getCard("酒")],
      discard: [],
    };
    const next = playCard(state, manual.id);

    expect(next.hand).toHaveLength(3);
    expect(next.player.architectureInferenceUsedThisTurn).toBe(true);
    expect(next.log).toContain("李詩民發動架構推演，抽 1 張牌。");
    expect(next.currentDialogue).toMatchObject(getHeroDialogue(liShiminId, "use_strategy")!);
  });

  it("does not repeat architecture inference on a second strategy card in the same turn", () => {
    const manual = getCard("兵書");
    const rally = getCard("激勵");
    const state = {
      ...createGame(liShiminId),
      hand: [manual, rally],
      deck: [getCard("斬"), getCard("閃"), getCard("酒"), getCard("破甲")],
      discard: [],
      player: {
        ...createGame(liShiminId).player,
        health: 3,
      },
    };
    const afterManual = playCard(state, manual.id);
    const afterRally = playCard(afterManual, rally.id);

    expect(afterRally.hand).toHaveLength(4);
    expect(afterRally.log.filter((entry) => entry.includes("李詩民發動架構推演"))).toHaveLength(
      1,
    );
  });

  it("recovers one health after a route event on the next battle first-turn strategy card", () => {
    const manual = getCard("兵書");
    const state = {
      ...createGame(liShiminId),
      hand: [manual],
      deck: [getCard("斬"), getCard("閃"), getCard("酒")],
      discard: [],
      routeEventRecentlyProcessed: true,
      player: {
        ...createGame(liShiminId).player,
        health: 3,
      },
    };
    const next = playCard(state, manual.id);

    expect(next.player.health).toBe(4);
    expect(next.routeEventRecentlyProcessed).toBe(false);
    expect(next.log).toContain("路線資訊已納入推演，李詩民回復 1 點體力。");
  });

  it("does not recover beyond max health and clears the route-event bonus after the first turn", () => {
    const manual = getCard("兵書");
    const state = {
      ...createGame(liShiminId),
      hand: [manual],
      deck: [getCard("斬"), getCard("閃"), getCard("酒")],
      discard: [],
      routeEventRecentlyProcessed: true,
    };
    const next = playCard(state, manual.id);
    const ended = endTurn({
      ...createGame(liShiminId),
      routeEventRecentlyProcessed: true,
      hand: [],
    });

    expect(next.player.health).toBe(4);
    expect(ended.routeEventRecentlyProcessed).toBe(false);
  });

  it("adds Li Shimin dialogues and imports preview plus intro voices", () => {
    expect(getHeroDialogue(liShiminId, "hero_preview")?.audioKey).toBe("li-shimin-preview");
    expect(getHeroDialogue(liShiminId, "hero_intro")?.audioKey).toBe("li-shimin-intro");
    expect(getHeroDialogue(liShiminId, "use_strategy")?.text).toBe(
      "不是硬打，是重構局面。",
    );

    expect(getTtsAssetByAudioKey("li-shimin-preview")).toMatchObject({
      audioKey: "li-shimin-preview",
      filePath: "/audio/voices/li-shimin/li-shimin-preview.mp3",
      speakerName: "李詩民",
      status: "ready",
    });
    expect(getTtsAssetByAudioKey("li-shimin-intro")).toMatchObject({
      audioKey: "li-shimin-intro",
      filePath: "/audio/voices/li-shimin/li-shimin-intro.mp3",
      speakerName: "李詩民",
      status: "ready",
    });
    expect(canPlayVoice("li-shimin-preview")).toBe(true);
    expect(canPlayVoice("li-shimin-intro")).toBe(true);
    liShiminAudioKeys.forEach((audioKey) => {
      expect(getTtsAssetByAudioKey(audioKey)).toMatchObject({
        audioKey,
        speakerName: "李詩民",
        status: "planned",
      });
      expect(canPlayVoice(audioKey)).toBe(false);
    });
    expect(existsSync(join(process.cwd(), "public", "audio", "voices", "li-shimin"))).toBe(
      true,
    );
  });

  it("includes Li Shimin in the balance simulator hero set", () => {
    const summary = simulateManyRuns({
      heroIds: ["guan-yu", "zhao-yun", "zhuge-liang", liShiminId],
      runsPerHero: 1,
      seed: "li-shimin-balance-test",
      maxTurns: 180,
      strategy: "basic-safe-strategy",
    });

    expect(summary.totalRuns).toBe(4);
    expect(Object.keys(summary.perHeroStats)).toEqual([
      "guan-yu",
      "zhao-yun",
      "zhuge-liang",
      liShiminId,
    ]);
  });
});

function getCard(name: string) {
  const card = starterDeck.find((item) => item.name === name);

  if (!card) {
    throw new Error(`Missing card: ${name}`);
  }

  return { ...card };
}
