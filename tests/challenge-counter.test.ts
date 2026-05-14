import { describe, expect, it } from "vitest";
import {
  getChallengeCounterBadge,
  getChallengeCounterDamage,
  isChallengeCounterEnabled,
} from "@/lib/game/challengeCounter";
import { starterDeck } from "@/lib/game/cards";
import { createGame, endTurn, playCard, resolveDefense } from "@/lib/game/engine";
import { selectEnemyForStage } from "@/lib/game/enemies";
import { getStageConfig } from "@/lib/game/stages";
import type { Card, GameState, HeroId } from "@/lib/game/types";

describe("challenge counterattack pacing", () => {
  it("does not enable counterattacks in normal mode", () => {
    const state = prepareCounterState({ mode: "normal", stage: 5 });

    expect(isChallengeCounterEnabled(state)).toBe(false);

    const first = playCard(state, "slash-a");
    const second = playCard(first, "slash-b");

    expect(second.player.health).toBe(state.player.health);
    expect(second.log.some((entry) => entry.includes("警戒反擊"))).toBe(false);
  });

  it("does not enable counterattacks in challenge stages 1 to 4", () => {
    const state = prepareCounterState({
      mode: "challenge",
      stage: 4,
      enemyId: "bandit-leader",
    });

    expect(isChallengeCounterEnabled(state)).toBe(false);

    const first = playCard(state, "slash-a");
    const second = playCard(first, "slash-b");

    expect(second.player.health).toBe(state.player.health);
    expect(second.enemyDamagedThisTurn).toBe(false);
  });

  it("marks warning on the first damage in challenge stages 5 to 8", () => {
    const state = prepareCounterState({ mode: "challenge", stage: 5 });
    const next = playCard(state, "slash-a");

    expect(isChallengeCounterEnabled(state)).toBe(true);
    expect(next.enemyDamagedThisTurn).toBe(true);
    expect(next.enemyCounteredThisTurn).toBe(false);
    expect(next.player.health).toBe(state.player.health);
    expect(next.log).toContain("敵人進入警戒，若本回合再次受傷將反擊。");
    expect(getChallengeCounterBadge(next)).toBe("警戒");
  });

  it("counterattacks on the second damage and only once per turn", () => {
    const state = prepareCounterState({ mode: "challenge", stage: 5 });
    const first = playCard(state, "slash-a");
    const second = playCard(first, "slash-b");
    const third = playCard(second, "slash-c");

    expect(second.enemyCounteredThisTurn).toBe(true);
    expect(second.player.health).toBe(first.player.health - 1);
    expect(second.log).toContain("敵人警戒反擊，造成 1 點傷害。");
    expect(getChallengeCounterBadge(second)).toBe("已反擊");
    expect(third.player.health).toBe(second.player.health);
  });

  it("resets warning and counter state on a new player turn", () => {
    const warned = playCard(prepareCounterState({ mode: "challenge", stage: 5 }), "slash-a");
    const enemyTurn = endTurn(warned);
    const nextTurn = enemyTurn.phase === "defense" ? resolveDefense(enemyTurn, false) : enemyTurn;

    expect(nextTurn.phase).toBe("player");
    expect(nextTurn.enemyDamagedThisTurn).toBe(false);
    expect(nextTurn.enemyCounteredThisTurn).toBe(false);
  });

  it("resets warning and counter state after a new battle starts", () => {
    const state = prepareCounterState({
      mode: "challenge",
      stage: 5,
      enemyHealth: 1,
      damagedThisTurn: true,
      counteredThisTurn: true,
    });
    const next = playCard(state, "slash-a", { eventRoll: () => 1 });

    expect(next.phase).toBe("reward");
    expect(next.enemyDamagedThisTurn).toBe(false);
    expect(next.enemyCounteredThisTurn).toBe(false);
  });

  it("does not allow dodge or Dilu to cancel counterattack damage", () => {
    const state = prepareCounterState({
      mode: "challenge",
      stage: 5,
      damagedThisTurn: true,
      playerHealth: 6,
    });
    const next = playCard(state, "slash-a");

    expect(next.player.health).toBe(5);
    expect(next.phase).toBe("player");
    expect(next.hand.some((card) => card.name === "閃")).toBe(true);
  });

  it("lets guard reduce counterattack damage", () => {
    const state = prepareCounterState({
      mode: "challenge",
      stage: 5,
      damagedThisTurn: true,
      playerHealth: 6,
      guardActive: true,
    });
    const next = playCard(state, "slash-a");

    expect(next.player.health).toBe(6);
    expect(next.player.guardActive).toBe(false);
    expect(next.enemyCounteredThisTurn).toBe(true);
    expect(next.log).toContain("固守發動，反擊傷害 -1。");
  });

  it("does not counterattack after the enemy is defeated", () => {
    const state = prepareCounterState({
      mode: "challenge",
      stage: 5,
      enemyHealth: 1,
    });
    const next = playCard(state, "slash-a", { eventRoll: () => 1 });

    expect(next.phase).toBe("reward");
    expect(next.log.some((entry) => entry.includes("警戒"))).toBe(false);
  });

  it("handles warlord recovery before Lu Bu warning state", () => {
    const state = prepareCounterState({
      mode: "challenge",
      stage: 8,
      enemyId: "lu-bu",
      enemyHealth: 1,
    });
    const next = playCard(state, "slash-a");

    expect(next.bossTraitUsage["warlord-recovery"]).toBe(true);
    expect(next.enemyHealth).toBeGreaterThan(0);
    expect(next.enemyDamagedThisTurn).toBe(true);
    expect(next.log).toContain("敵人進入警戒，若本回合再次受傷將反擊。");
  });

  it("raises Lu Bu counter damage to 2 after unmatched pressure", () => {
    const state = prepareCounterState({
      mode: "challenge",
      stage: 8,
      enemyId: "lu-bu",
      damagedThisTurn: true,
      playerHealth: 6,
      bossTraitUsage: { "unmatched-pressure": true },
    });
    const next = playCard(state, "slash-a");

    expect(getChallengeCounterDamage(state)).toBe(2);
    expect(next.player.health).toBe(4);
    expect(next.log).toContain("呂布以無雙之勢反擊，造成 2 點傷害。");
    expect(getChallengeCounterBadge(next)).toBe("無雙反擊");
  });

  it("can defeat the player with a counterattack", () => {
    const state = prepareCounterState({
      mode: "challenge",
      stage: 5,
      damagedThisTurn: true,
      playerHealth: 1,
    });
    const next = playCard(state, "slash-a");

    expect(next.status).toBe("lost");
    expect(next.currentDialogue?.trigger).toBe("game_lose");
    expect(next.log).toContain("敵人警戒反擊，造成 1 點傷害。你倒在反擊之下。");
  });
});

function prepareCounterState({
  mode = "challenge",
  stage = 5,
  enemyId = "xiliang-cavalry",
  heroId = "zhao-yun",
  playerHealth = 6,
  enemyHealth,
  damagedThisTurn = false,
  counteredThisTurn = false,
  guardActive = false,
  bossTraitUsage = {},
}: {
  mode?: GameState["mode"];
  stage?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  enemyId?: string;
  heroId?: HeroId;
  playerHealth?: number;
  enemyHealth?: number;
  damagedThisTurn?: boolean;
  counteredThisTurn?: boolean;
  guardActive?: boolean;
  bossTraitUsage?: GameState["bossTraitUsage"];
} = {}): GameState {
  const base = createGame(heroId, { mode });
  const enemy = selectEnemyForStage(stage, enemyId, () => 0, mode);

  return {
    ...base,
    mode,
    status: "playing",
    phase: "player",
    enemyIndex: stage - 1,
    stageConfig: getStageConfig(stage),
    enemy,
    enemyHealth: enemyHealth ?? enemy.maxHealth,
    enemyDamagedThisTurn: damagedThisTurn,
    enemyCounteredThisTurn: counteredThisTurn,
    bossTraitUsage,
    bossTraitHistory: Object.keys(bossTraitUsage) as GameState["bossTraitHistory"],
    hand: [
      cloneCard("斬", "slash-a"),
      cloneCard("斬", "slash-b"),
      cloneCard("斬", "slash-c"),
      cloneCard("閃", "dodge-a"),
    ],
    discard: [],
    player: {
      ...base.player,
      health: playerHealth,
      maxHealth: Math.max(base.player.maxHealth, playerHealth),
      morale: 10,
      maxMorale: 10,
      guardActive,
      slashUsedThisTurn: false,
      equipmentUsageThisBattle: {
        ...base.player.equipmentUsageThisBattle,
        diluDodged: true,
      },
    },
  };
}

function cloneCard(cardName: string, id: string): Card {
  const card = starterDeck.find((item) => item.name === cardName);

  if (!card) {
    throw new Error(`Missing card ${cardName}`);
  }

  return { ...card, id };
}
