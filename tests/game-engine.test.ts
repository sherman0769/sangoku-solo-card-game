import { describe, expect, it } from "vitest";
import {
  createGame,
  endTurn,
  playCard,
  rewardCatalog,
  resolveDefense,
  selectReward,
} from "@/lib/game/engine";
import type { GameState, RewardId } from "@/lib/game/types";

describe("game engine", () => {
  it("creates a Guan Yu game with the required starter hand", () => {
    const state = createGame("guan-yu");

    expect(state.status).toBe("playing");
    expect(state.phase).toBe("player");
    expect(state.player.heroId).toBe("guan-yu");
    expect(state.player.name).toBe("關羽");
    expect(state.player.title).toBe("武聖");
    expect(state.player.health).toBe(5);
    expect(state.enemy.name).toBe("黃巾兵");
    expect(state.hand.map((card) => card.name)).toEqual([
      "斬",
      "閃",
      "酒",
      "兵書",
      "破甲",
    ]);
    expect(state.deck).toHaveLength(7);
    expect(state.log[0]).toBe("第一關｜黃巾兵登場，亂世初起，試試你的刀法。");
  });

  it("creates a Zhao Yun game when selected", () => {
    const state = createGame("zhao-yun");

    expect(state.player.heroId).toBe("zhao-yun");
    expect(state.player.name).toBe("趙雲");
    expect(state.player.title).toBe("常山趙子龍");
    expect(state.player.health).toBe(4);
    expect(state.player.skillName).toBe("龍膽");
  });

  it("defaults to Guan Yu for an unknown hero", () => {
    const state = createGame("unknown-hero");

    expect(state.player.heroId).toBe("guan-yu");
    expect(state.player.name).toBe("關羽");
  });

  it("plays slash with Wusheng and spends morale", () => {
    const state = createGame();
    const slash = state.hand.find((card) => card.name === "斬")!;
    const next = playCard(state, slash.id);

    expect(next.enemyHealth).toBe(state.enemyHealth - 3);
    expect(next.player.morale).toBe(state.player.morale - slash.cost);
    expect(next.discard).toContainEqual(slash);
    expect(next.log[0]).toBe("你使用了斬，造成 3 點傷害。");
    expect(next.log[1]).toBe("關羽發動武聖，第一次斬傷害 +1。");
  });

  it("uses wine, manual, and armor break cards", () => {
    let state = createGame();
    const wine = state.hand.find((card) => card.name === "酒")!;
    state = playCard(state, wine.id);

    expect(state.player.wineBonus).toBe(1);
    expect(state.player.health).toBe(5);

    const manual = state.hand.find((card) => card.name === "兵書")!;
    state = playCard(state, manual.id);

    expect(state.hand.length).toBe(5);
    expect(state.log[0]).toBe("你使用了兵書，抽 2 張牌。");

    const pierce = state.hand.find((card) => card.name === "破甲")!;
    state = playCard(state, pierce.id);

    expect(state.enemyHealth).toBe(6);
    expect(state.enemyArmorBroken).toBe(true);
    expect(state.log[0]).toBe("你使用了破甲，造成 1 點傷害，下一次斬傷害 +1。");
  });

  it("prompts for dodge when the enemy attacks and a dodge is in hand", () => {
    const state = createGame();
    const next = endTurn(state);

    expect(next.phase).toBe("defense");
    expect(next.pendingDefense?.actionLabel).toBe("普通攻擊");
    expect(next.pendingDefense?.damage).toBe(2);
    expect(next.log[0]).toContain("你手上有閃");
  });

  it("uses dodge to cancel enemy damage", () => {
    const pending = endTurn(createGame());
    const next = resolveDefense(pending, true);

    expect(next.phase).toBe("player");
    expect(next.player.health).toBe(5);
    expect(next.turn).toBe(2);
    expect(next.hand).toHaveLength(5);
    expect(next.discard.some((card) => card.name === "閃")).toBe(true);
    expect(next.log[0]).toBe("你使用了閃，抵消 2 點傷害。");
  });

  it("allows the player to take enemy damage instead of using dodge", () => {
    const pending = endTurn(createGame());
    const next = resolveDefense(pending, false);

    expect(next.phase).toBe("player");
    expect(next.player.health).toBe(3);
    expect(next.turn).toBe(2);
    expect(next.log[0]).toBe("你選擇承受攻擊，受到 2 點傷害。");
  });

  it("runs enemy guard and charge actions", () => {
    const guardState = {
      ...createGame(),
      enemyActionIndex: 1,
      hand: [],
    };
    const guarded = endTurn(guardState);

    expect(guarded.enemyGuarding).toBe(true);
    expect(guarded.log[0]).toContain("進入防守狀態");

    const chargeState = {
      ...createGame(),
      enemyIndex: 1,
      enemy: {
        ...guarded.enemy,
        actions: [
          { kind: "charge" as const, label: "蓄力", text: "下次攻擊傷害 +1。" },
        ],
      },
      hand: [],
    };
    const charged = endTurn(chargeState);

    expect(charged.enemyCharged).toBe(true);
    expect(charged.log[0]).toContain("蓄力");
  });

  it("enters reward selection after defeating the first enemy", () => {
    const state = createGame();
    const slash = state.hand.find((card) => card.name === "斬")!;
    const nearDefeat = {
      ...state,
      enemyHealth: 3,
    };

    const next = playCard(nearDefeat, slash.id);

    expect(next.status).toBe("playing");
    expect(next.phase).toBe("reward");
    expect(next.enemy.name).toBe("黃巾兵");
    expect(next.enemyHealth).toBe(0);
    expect(next.rewardOptions).toHaveLength(3);
    expect(next.log[0]).toBe("擊敗黃巾兵，選擇一項通關獎勵。");
  });

  it("increases max health and heals after choosing max health reward", () => {
    const rewardState = forceReward(defeatFirstEnemy(), "max-health");
    const wounded = {
      ...rewardState,
      player: { ...rewardState.player, health: 3 },
    };

    const next = selectReward(wounded, "max-health");

    expect(next.phase).toBe("player");
    expect(next.enemy.name).toBe("山賊頭目");
    expect(next.player.maxHealth).toBe(6);
    expect(next.player.health).toBe(4);
    expect(next.playerUpgrades.maxHpBonus).toBe(1);
  });

  it("increases slash damage after choosing slash reward", () => {
    const rewarded = selectReward(forceReward(defeatFirstEnemy(), "slash-damage"), "slash-damage");
    const slash = createGame().hand.find((card) => card.name === "斬")!;
    const ready = {
      ...rewarded,
      hand: [slash],
      enemyHealth: rewarded.enemy.maxHealth,
      player: { ...rewarded.player, morale: rewarded.player.maxMorale },
      discard: [],
    };

    const next = playCard(ready, slash.id);

    expect(next.enemyHealth).toBe(rewarded.enemy.maxHealth - 4);
    expect(next.log[0]).toBe("你使用了斬，造成 4 點傷害。");
  });

  it("draws three cards with manual after choosing strategy mastery", () => {
    const rewarded = selectReward(forceReward(defeatFirstEnemy(), "strategy-draw"), "strategy-draw");
    const manual = createGame().hand.find((card) => card.name === "兵書")!;
    const ready = {
      ...rewarded,
      hand: [manual],
      deck: createGame().deck,
      discard: [],
      player: { ...rewarded.player, morale: rewarded.player.maxMorale },
    };

    const next = playCard(ready, manual.id);

    expect(next.hand).toHaveLength(3);
    expect(next.log[0]).toBe("你使用了兵書，抽 3 張牌。");
  });

  it("lets Zhao Yun use dodge as slash", () => {
    const state = createGame("zhao-yun");
    const dodge = state.hand.find((card) => card.name === "閃")!;
    const next = playCard(state, dodge.id);

    expect(next.enemyHealth).toBe(state.enemyHealth - 1);
    expect(next.discard).toContainEqual(dodge);
    expect(next.log[0]).toBe("趙雲發動龍膽，將閃當作斬使用，造成 1 點傷害。");
  });

  it("applies slash damage upgrades to Zhao Yun's dodge as slash", () => {
    const state = {
      ...createGame("zhao-yun"),
      playerUpgrades: {
        maxHpBonus: 0,
        startingDrawBonus: 0,
        slashDamageBonus: 1,
        strategyDrawBonus: 0,
        armorBreakDamageBonus: 0,
      },
    };
    const dodge = state.hand.find((card) => card.name === "閃")!;
    const next = playCard(state, dodge.id);

    expect(next.enemyHealth).toBe(state.enemyHealth - 2);
    expect(next.log[0]).toBe("趙雲發動龍膽，將閃當作斬使用，造成 2 點傷害。");
  });

  it("lets Zhao Yun use slash as dodge during enemy attacks", () => {
    const base = createGame("zhao-yun");
    const slash = base.hand.find((card) => card.name === "斬")!;
    const pending = endTurn({ ...base, hand: [slash] });
    const next = resolveDefense(pending, true);

    expect(pending.phase).toBe("defense");
    expect(pending.log[0]).toContain("你手上有斬");
    expect(next.player.health).toBe(4);
    expect(next.discard.some((card) => card.name === "斬")).toBe(true);
    expect(next.log[0]).toBe("趙雲發動龍膽，將斬當作閃使用，抵消 2 點傷害。");
  });

  it("moves to the next stage after choosing a reward", () => {
    const rewarded = selectReward(forceReward(defeatFirstEnemy(), "starting-draw"), "starting-draw");

    expect(rewarded.phase).toBe("player");
    expect(rewarded.enemyIndex).toBe(1);
    expect(rewarded.enemy.name).toBe("山賊頭目");
    expect(rewarded.enemyHealth).toBe(rewarded.enemy.maxHealth);
    expect(rewarded.playerUpgrades.startingDrawBonus).toBe(1);
    expect(rewarded.hand).toHaveLength(6);
    expect(rewarded.log[0]).toBe("第二關｜山賊頭目攔路，敵人開始懂得防守與蓄力。");
  });

  it("wins after the third enemy is defeated", () => {
    const state = {
      ...createGame(),
      enemyIndex: 2,
      enemy: {
        id: "lu-bu",
        name: "呂布",
        title: "第三關",
        intro: "第三關｜呂布現身，真正的考驗開始了。",
        maxHealth: 12,
        attack: 3,
        actions: [],
      },
      enemyHealth: 3,
    };
    const slash = state.hand.find((card) => card.name === "斬")!;
    const next = playCard(state, slash.id);

    expect(next.status).toBe("won");
    expect(next.log[0]).toContain("三關敵人全數擊敗");
  });

  it("loses when Guan Yu takes lethal enemy damage", () => {
    const state = {
      ...createGame(),
      player: { ...createGame().player, health: 1 },
      hand: [],
    };
    const next = endTurn(state);

    expect(next.status).toBe("lost");
    expect(next.log[0]).toBe("關羽體力歸零，戰敗。");
  });
});

function defeatFirstEnemy(): GameState {
  const state = createGame();
  const slash = state.hand.find((card) => card.name === "斬")!;

  return playCard({ ...state, enemyHealth: 3 }, slash.id);
}

function forceReward(state: GameState, rewardId: RewardId): GameState {
  const reward = rewardCatalog.find((option) => option.id === rewardId);
  if (!reward) {
    throw new Error(`Missing reward ${rewardId}`);
  }

  return {
    ...state,
    rewardOptions: [reward],
  };
}
