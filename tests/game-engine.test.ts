import { describe, expect, it } from "vitest";
import { getVisualPlaceholderStyle } from "@/components/VisualPlaceholder";
import { starterDeck } from "@/lib/game/cards";
import {
  dialogueLines,
  getChapterIntroDialogue,
  getEnemyIntroDialogue,
  getHeroDialogue,
} from "@/lib/game/dialogues";
import {
  createGame,
  endTurn,
  enterEventPhase,
  playCard,
  rewardCatalog,
  resolveEventOption,
  resolveDefense,
  selectObservation,
  selectReward,
  selectRoute,
} from "@/lib/game/engine";
import {
  bossEnemy,
  enemyPool,
  firstStageEnemyPool,
  getEnemiesForStage,
  secondStageEnemyPool,
  selectEnemyForStage,
} from "@/lib/game/enemies";
import { gameEvents } from "@/lib/game/events";
import { heroes } from "@/lib/game/heroes";
import { stageRoutes } from "@/lib/game/routes";
import { chapterOne, chapterStages, getEventChanceForStage, getStageConfig } from "@/lib/game/stages";
import type { GameState, RewardId, StageRouteId } from "@/lib/game/types";

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
    expect(state.enemy.id).toBe("yellow-turban-soldier");
    expect(state.enemy.portrait).toBe("/images/enemies/yellow-turban-soldier.png");
    expect(state.hand.map((card) => card.name)).toEqual([
      "斬",
      "閃",
      "酒",
      "兵書",
      "破甲",
    ]);
    expect(state.deck).toHaveLength(26);
    expect(state.chapter).toEqual(chapterOne);
    expect(state.stageConfig.name).toBe("荒村初戰");
    expect(state.log[0]).toBe("第 1 關｜荒村初戰｜黃巾兵登場：基礎敵人，行動單純，適合熱身。");
    expect(state.currentDialogue).toMatchObject({
      speakerId: "guan-yu",
      trigger: "hero_intro",
      text: "關某在此，何人敢擋？",
    });
  });

  it("includes three equipment cards and eight tactical cards in the starter deck", () => {
    const equipmentCards = starterDeck.filter((card) => card.kind === "equipment");
    const tacticalCards = starterDeck.filter((card) =>
      ["combo", "guard", "rally", "fire"].includes(card.kind),
    );

    expect(starterDeck).toHaveLength(31);
    expect(equipmentCards.map((card) => card.name)).toEqual([
      "青龍偃月刀",
      "的盧馬",
      "太平要術",
    ]);
    expect(countCards(tacticalCards, "連斬")).toBe(2);
    expect(countCards(tacticalCards, "固守")).toBe(2);
    expect(countCards(tacticalCards, "激勵")).toBe(2);
    expect(countCards(tacticalCards, "火攻")).toBe(2);
  });

  it("includes the first event set", () => {
    expect(gameEvents.map((event) => event.name)).toEqual([
      "荒村補給",
      "軍師獻策",
      "伏兵突襲",
    ]);
  });

  it("includes the first stage enemy pool", () => {
    expect(firstStageEnemyPool.map((enemy) => enemy.name)).toEqual([
      "黃巾兵",
      "黃巾弓手",
    ]);
  });

  it("includes the second stage enemy pool", () => {
    expect(secondStageEnemyPool.map((enemy) => enemy.name)).toEqual([
      "黃巾弓手",
      "黃巾力士",
    ]);
  });

  it("keeps Lu Bu as the eighth stage boss", () => {
    expect(bossEnemy.name).toBe("呂布");
    expect(bossEnemy.stage).toBe(8);
    expect(bossEnemy.type).toBe("boss");
    expect(bossEnemy.maxHealth).toBe(14);
  });

  it("includes chapter one with eight stages", () => {
    expect(chapterOne.name).toBe("第一章：黃巾亂起");
    expect(chapterStages).toHaveLength(8);
    expect(chapterStages[0].name).toBe("荒村初戰");
    expect(chapterStages[6].name).toBe("黃巾祭壇");
    expect(chapterStages[6].enemyIds).toEqual(["zhang-liang", "zhang-bao"]);
    expect(chapterStages[7].name).toBe("虎牢關前");
    expect(chapterStages[7].enemyIds).toEqual(["lu-bu"]);
    expect(chapterStages[7].isFinalBoss).toBe(true);
  });

  it("includes Zhang Liang and Zhang Bao mini-boss enemies", () => {
    expect(enemyPool).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "zhang-liang", name: "張梁", stage: 7 }),
        expect.objectContaining({ id: "zhang-bao", name: "張寶", stage: 7 }),
      ]),
    );
  });

  it("selects enemies from each configured stage pool", () => {
    expect(selectEnemyForStage(1, "yellow-turban-archer").name).toBe("黃巾弓手");
    expect(selectEnemyForStage(4, "black-mountain-general").name).toBe("黑山賊將");
    expect(selectEnemyForStage(8, "yellow-turban-soldier").name).toBe("呂布");
  });

  it("uses higher event chance for event-heavy stages", () => {
    expect(getEventChanceForStage(getStageConfig(3))).toBe(0.75);
    expect(getEventChanceForStage(getStageConfig(6))).toBe(0.75);
    expect(getEventChanceForStage(getStageConfig(1))).toBe(0.5);
    expect(getEventChanceForStage(getStageConfig(7))).toBe(0.5);
  });

  it("includes the first route set", () => {
    expect(stageRoutes.map((route) => route.name)).toEqual(["山道", "官道", "險道"]);
  });

  it("adds visual prompts to core game data", () => {
    expect(heroes.every((hero) => hero.visualPrompt && hero.portrait && hero.avatar)).toBe(true);
    expect(enemyPool.every((enemy) => enemy.visualPrompt && enemy.portrait)).toBe(true);
    expect(chapterStages.every((stage) => stage.visualPrompt && stage.backgroundImage)).toBe(true);
    expect(gameEvents.every((event) => event.visualPrompt && event.image)).toBe(true);
    expect(stageRoutes.every((route) => route.visualPrompt && route.image)).toBe(true);
    expect(starterDeck.every((card) => card.visualPrompt && card.illustration)).toBe(true);
  });

  it("includes the first character dialogue set", () => {
    expect(dialogueLines).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ speakerId: "guan-yu", trigger: "hero_intro" }),
        expect.objectContaining({ speakerId: "zhao-yun", trigger: "hero_intro" }),
        expect.objectContaining({ speakerId: "zhuge-liang", trigger: "hero_intro" }),
      ]),
    );
    expect(getEnemyIntroDialogue("lu-bu", true)?.text).toBe("吾乃呂布，誰敢與我一戰？");
    expect(getChapterIntroDialogue()?.text).toContain("第一章：黃巾亂起");
    expect(dialogueLines.every((line) => "audioKey" in line)).toBe(true);
  });

  it("provides placeholder styles for visual asset types", () => {
    expect(getVisualPlaceholderStyle("hero").label).toBe("角色立繪");
    expect(getVisualPlaceholderStyle("enemy").label).toBe("敵人圖");
    expect(getVisualPlaceholderStyle("stage").label).toBe("關卡背景圖");
    expect(getVisualPlaceholderStyle("card").label).toBe("卡牌插圖");
    expect(getVisualPlaceholderStyle("event").label).toBe("事件圖");
    expect(getVisualPlaceholderStyle("route").label).toBe("路線圖");
  });

  it("creates a Zhao Yun game when selected", () => {
    const state = createGame("zhao-yun");

    expect(state.player.heroId).toBe("zhao-yun");
    expect(state.player.name).toBe("趙雲");
    expect(state.player.title).toBe("常山趙子龍");
    expect(state.player.health).toBe(4);
    expect(state.player.skillName).toBe("龍膽");
  });

  it("contains Zhuge Liang in the hero list", () => {
    expect(heroes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "zhuge-liang",
          name: "諸葛亮",
          title: "臥龍",
          maxHp: 4,
          role: "策略控牌",
        }),
      ]),
    );
  });

  it("creates a Zhuge Liang game and starts in observation", () => {
    const state = createGame("zhuge-liang");

    expect(state.player.heroId).toBe("zhuge-liang");
    expect(state.player.name).toBe("諸葛亮");
    expect(state.player.health).toBe(4);
    expect(state.player.maxHealth).toBe(4);
    expect(state.player.skillName).toBe("觀星");
    expect(state.phase).toBe("observe");
    expect(state.pendingObservation?.cards).toHaveLength(3);
    expect(state.hand).toHaveLength(0);
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
    expect(next.currentDialogue).toMatchObject(getHeroDialogue("guan-yu", "use_slash")!);
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

    expect(state.enemyHealth).toBe(3);
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

  it("triggers low health dialogue at most once per battle", () => {
    const wounded = {
      ...createGame(),
      hand: [],
      player: { ...createGame().player, health: 4 },
    };
    const firstHit = endTurn(wounded);
    const secondHit = endTurn({
      ...firstHit,
      hand: [],
      player: { ...firstHit.player, health: 4 },
      enemyActionIndex: 0,
    });

    expect(firstHit.player.health).toBe(2);
    expect(firstHit.lowHpDialogueUsed).toBe(true);
    expect(firstHit.currentDialogue).toMatchObject(getHeroDialogue("guan-yu", "low_hp")!);
    expect(secondHit.player.health).toBe(2);
    expect(secondHit.lowHpDialogueUsed).toBe(true);
    expect(secondHit.currentDialogue).not.toMatchObject(getHeroDialogue("guan-yu", "low_hp")!);
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

    const next = playCard(nearDefeat, slash.id, { eventRoll: () => 1 });

    expect(next.status).toBe("playing");
    expect(next.phase).toBe("reward");
    expect(next.enemy.name).toBe("黃巾兵");
    expect(next.enemyHealth).toBe(0);
    expect(next.rewardOptions).toHaveLength(3);
    expect(next.log[0]).toBe("擊敗黃巾兵，選擇一項通關獎勵。");
  });

  it("can enter an event phase after defeating the first enemy", () => {
    const state = createGame();
    const slash = state.hand.find((card) => card.name === "斬")!;
    const nearDefeat = {
      ...state,
      enemyHealth: 3,
    };

    const next = playCard(nearDefeat, slash.id, {
      eventRoll: () => 0,
      eventId: "village-supply",
    });

    expect(next.status).toBe("playing");
    expect(next.phase).toBe("event");
    expect(next.currentEvent?.name).toBe("荒村補給");
    expect(next.rewardOptions).toHaveLength(0);
    expect(next.log[0]).toBe("事件出現：荒村補給。");
  });

  it("can deterministically select Yellow Turban Archer for stage one", () => {
    const state = createGame("guan-yu", {
      enemyIds: { 1: "yellow-turban-archer" },
    });

    expect(state.enemy.name).toBe("黃巾弓手");
    expect(state.enemy.maxHealth).toBe(3);
    expect(state.encounteredEnemyIds).toEqual(["yellow-turban-archer"]);
  });

  it("can deterministically select Yellow Turban Brute for stage two", () => {
    const routeState = selectReward(forceReward(defeatFirstEnemy(), "max-health"), "max-health");
    const next = selectRoute(routeState, "official-road", {
      enemyIds: { 2: "yellow-turban-brute" },
    });

    expect(next.stageConfig.name).toBe("山道伏兵");
    expect(next.enemy.name).toBe("黃巾力士");
    expect(next.enemy.maxHealth).toBe(5);
    expect(next.encounteredEnemyIds.at(-1)).toBe("yellow-turban-brute");
  });

  it("heals two health from village supply without exceeding max health", () => {
    const eventState = enterEventPhase(
      {
        ...defeatFirstEnemy(),
        player: { ...defeatFirstEnemy().player, health: 4 },
      },
      "village-supply",
    );

    const next = resolveEventOption(eventState, "rest");

    expect(next.phase).toBe("reward");
    expect(next.currentEvent).toBeUndefined();
    expect(next.player.health).toBe(next.player.maxHealth);
    expect(next.rewardOptions).toHaveLength(3);
    expect(next.log).toContain("荒村補給：回復 2 點體力。");
  });

  it("draws two cards from strategist advice", () => {
    const eventState = enterEventPhase(
      {
        ...defeatFirstEnemy(),
        hand: [],
        deck: createGame().deck,
        discard: [],
      },
      "strategist-advice",
    );

    const next = resolveEventOption(eventState, "listen");

    expect(next.phase).toBe("reward");
    expect(next.hand).toHaveLength(2);
    expect(next.log).toContain("軍師獻策：抽 2 張牌。");
  });

  it("loses one health and gains slash damage from ambush", () => {
    const eventState = enterEventPhase(
      {
        ...defeatFirstEnemy(),
        player: { ...defeatFirstEnemy().player, health: 3 },
      },
      "ambush",
    );

    const next = resolveEventOption(eventState, "break-through");

    expect(next.phase).toBe("reward");
    expect(next.player.health).toBe(2);
    expect(next.playerUpgrades.slashDamageBonus).toBe(1);
    expect(next.log).toContain("伏兵突襲：失去 1 點體力，斬傷害 +1。");
  });

  it("loses from ambush when health reaches zero", () => {
    const eventState = enterEventPhase(
      {
        ...defeatFirstEnemy(),
        player: { ...defeatFirstEnemy().player, health: 1 },
      },
      "ambush",
    );

    const next = resolveEventOption(eventState, "break-through");

    expect(next.status).toBe("lost");
    expect(next.currentEvent).toBeUndefined();
    expect(next.log[0]).toBe("關羽體力歸零，戰敗。");
  });

  it("keeps the original reward flow when no event triggers", () => {
    const state = createGame();
    const slash = state.hand.find((card) => card.name === "斬")!;
    const nearDefeat = {
      ...state,
      enemyHealth: 3,
    };

    const next = playCard(nearDefeat, slash.id, { eventRoll: () => 1 });

    expect(next.phase).toBe("reward");
    expect(next.currentEvent).toBeUndefined();
    expect(next.rewardOptions).toHaveLength(3);
  });

  it("increases max health and heals after choosing max health reward", () => {
    const rewardState = forceReward(defeatFirstEnemy(), "max-health");
    const wounded = {
      ...rewardState,
      player: { ...rewardState.player, health: 3 },
    };

    const next = selectReward(wounded, "max-health");

    expect(next.phase).toBe("route");
    expect(next.player.maxHealth).toBe(6);
    expect(next.player.health).toBe(4);
    expect(next.playerUpgrades.maxHpBonus).toBe(1);
  });

  it("increases slash damage after choosing slash reward", () => {
    const rewarded = chooseRewardAndRoute(defeatFirstEnemy(), "slash-damage", "official-road");
    const slash = createGame().hand.find((card) => card.name === "斬")!;
    const ready = {
      ...rewarded,
      hand: [slash],
      enemyHealth: 8,
      player: { ...rewarded.player, morale: rewarded.player.maxMorale },
      discard: [],
    };

    const next = playCard(ready, slash.id);

    expect(next.enemyHealth).toBe(4);
    expect(next.log[0]).toBe("你使用了斬，造成 4 點傷害。");
  });

  it("draws three cards with manual after choosing strategy mastery", () => {
    const rewarded = chooseRewardAndRoute(defeatFirstEnemy(), "strategy-draw", "official-road");
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
    expect(next.currentDialogue).toMatchObject(getHeroDialogue("zhao-yun", "use_dodge")!);
  });

  it("equips Green Dragon Crescent Blade", () => {
    const equipment = getCard("青龍偃月刀");
    const state = {
      ...createGame(),
      hand: [equipment],
      discard: [],
    };

    const next = playCard(state, equipment.id);

    expect(next.hand).toHaveLength(0);
    expect(next.discard).toHaveLength(0);
    expect(next.player.equippedItems.map((card) => card.name)).toEqual(["青龍偃月刀"]);
    expect(next.log[0]).toBe("裝備成功：青龍偃月刀。");
  });

  it("does not equip duplicate equipment", () => {
    const equipment = getCard("青龍偃月刀");
    const duplicate = { ...equipment, id: "green-dragon-blade-duplicate" };
    const equipped = playCard({ ...createGame(), hand: [equipment], discard: [] }, equipment.id);
    const next = playCard({ ...equipped, hand: [duplicate] }, duplicate.id);

    expect(next.player.equippedItems).toHaveLength(1);
    expect(next.hand).toEqual([duplicate]);
    expect(next.log[0]).toBe("已裝備相同裝備。");
  });

  it("adds Green Dragon Crescent Blade damage to the first slash each turn", () => {
    const equipment = getCard("青龍偃月刀");
    const slash = getCard("斬");
    const equipped = playCard(
      {
        ...createGame("zhao-yun"),
        hand: [equipment],
        discard: [],
      },
      equipment.id,
    );
    const next = playCard(
      {
        ...equipped,
        hand: [slash],
        player: { ...equipped.player, morale: equipped.player.maxMorale },
      },
      slash.id,
    );

    expect(next.enemyHealth).toBe(equipped.enemyHealth - 3);
    expect(next.log[1]).toBe("青龍偃月刀發動，第一次斬額外 +1 傷害。");
  });

  it("stacks Green Dragon Crescent Blade with Guan Yu Wusheng", () => {
    const equipment = getCard("青龍偃月刀");
    const slash = getCard("斬");
    const equipped = playCard({ ...createGame(), hand: [equipment], discard: [] }, equipment.id);
    const next = playCard(
      {
        ...equipped,
        hand: [slash],
        enemyHealth: 8,
        player: { ...equipped.player, morale: equipped.player.maxMorale },
      },
      slash.id,
    );

    expect(next.enemyHealth).toBe(4);
    expect(next.log[0]).toBe("你使用了斬，造成 4 點傷害。");
    expect(next.log).toContain("關羽發動武聖，第一次斬傷害 +1。");
    expect(next.log).toContain("青龍偃月刀發動，第一次斬額外 +1 傷害。");
  });

  it("uses Dilu Horse to automatically dodge the first enemy attack each battle", () => {
    const equipment = getCard("的盧馬");
    const equipped = playCard({ ...createGame(), hand: [equipment], discard: [] }, equipment.id);
    const next = endTurn({ ...equipped, hand: [] });

    expect(next.player.health).toBe(equipped.player.health);
    expect(next.turn).toBe(2);
    expect(next.player.equipmentUsageThisBattle.diluDodged).toBe(true);
    expect(next.log[0]).toContain("的盧馬發動，自動閃避一次攻擊");
  });

  it("resets Dilu Horse after entering the next stage", () => {
    const equipment = getCard("的盧馬");
    const slash = getCard("斬");
    const equipped = playCard({ ...createGame(), hand: [equipment], discard: [] }, equipment.id);
    const defeated = playCard(
      {
        ...equipped,
        hand: [slash],
        enemyHealth: 3,
        player: { ...equipped.player, morale: equipped.player.maxMorale },
      },
      slash.id,
      { eventRoll: () => 1 },
    );
    const nextStage = chooseRewardAndRoute(defeated, "max-health", "official-road");
    const dodged = endTurn({ ...nextStage, hand: [] });

    expect(nextStage.player.equipmentUsageThisBattle.diluDodged).toBe(false);
    expect(dodged.player.health).toBe(nextStage.player.health);
    expect(dodged.player.equipmentUsageThisBattle.diluDodged).toBe(true);
    expect(dodged.log[0]).toContain("的盧馬發動，自動閃避一次攻擊");
  });

  it("draws one extra card on the first manual each turn with Taiping Arts", () => {
    const equipment = getCard("太平要術");
    const manual = getCard("兵書");
    const equipped = playCard({ ...createGame(), hand: [equipment], discard: [] }, equipment.id);
    const next = playCard(
      {
        ...equipped,
        hand: [manual],
        deck: createGame().deck,
        discard: [],
        player: { ...equipped.player, morale: equipped.player.maxMorale },
      },
      manual.id,
    );

    expect(next.hand).toHaveLength(3);
    expect(next.log[0]).toBe("你使用了兵書，抽 3 張牌。");
    expect(next.log[1]).toBe("太平要術發動，兵書額外抽 1 張。");
  });

  it("uses combo slash for one damage without triggering Wusheng", () => {
    const comboSlash = getCard("連斬");
    const state = {
      ...createGame(),
      hand: [comboSlash],
      enemyHealth: createGame().enemy.maxHealth,
      discard: [],
    };
    const next = playCard(state, comboSlash.id);

    expect(next.enemyHealth).toBe(state.enemyHealth - 1);
    expect(next.log[0]).toBe("你使用連斬，造成 1 點傷害。");
    expect(next.log.some((entry) => entry.includes("武聖"))).toBe(false);
  });

  it("draws one card with combo slash when the enemy is already wounded", () => {
    const comboSlash = getCard("連斬");
    const drawCard = getCard("斬");
    const state = {
      ...createGame(),
      hand: [comboSlash],
      deck: [drawCard],
      discard: [],
      enemyHealth: createGame().enemy.maxHealth - 1,
    };
    const next = playCard(state, comboSlash.id);

    expect(next.enemyHealth).toBe(state.enemyHealth - 1);
    expect(next.hand).toEqual([drawCard]);
    expect(next.log).toContain("連斬追擊成功，抽 1 張牌。");
  });

  it("does not trigger Green Dragon Crescent Blade with combo slash", () => {
    const equipment = getCard("青龍偃月刀");
    const comboSlash = getCard("連斬");
    const equipped = playCard(
      {
        ...createGame("zhao-yun"),
        hand: [equipment],
        discard: [],
      },
      equipment.id,
    );
    const next = playCard(
      {
        ...equipped,
        hand: [comboSlash],
        player: { ...equipped.player, morale: equipped.player.maxMorale },
      },
      comboSlash.id,
    );

    expect(next.enemyHealth).toBe(equipped.enemyHealth - 1);
    expect(next.log.some((entry) => entry.includes("青龍偃月刀發動"))).toBe(false);
  });

  it("sets guardActive after using guard", () => {
    const guard = getCard("固守");
    const next = playCard(
      {
        ...createGame(),
        hand: [guard],
        discard: [],
      },
      guard.id,
    );

    expect(next.player.guardActive).toBe(true);
    expect(next.log[0]).toBe("你使用固守，下一次受到傷害 -1。");
  });

  it("reduces the next incoming damage by one with guard and then clears it", () => {
    const guarded = {
      ...createGame(),
      hand: [],
      player: { ...createGame().player, guardActive: true },
    };
    const next = endTurn(guarded);

    expect(next.player.health).toBe(4);
    expect(next.player.guardActive).toBe(false);
    expect(next.log).toContain("固守發動，傷害 -1。");
  });

  it("only consumes guard once against a fierce attack", () => {
    const guarded = {
      ...createGame(),
      hand: [],
      enemy: {
        ...createGame().enemy,
        actions: [{ kind: "fierce" as const, label: "猛攻", text: "造成較高傷害。" }],
      },
      player: { ...createGame().player, guardActive: true },
    };
    const next = endTurn(guarded);

    expect(next.player.health).toBe(3);
    expect(next.player.guardActive).toBe(false);
    expect(next.log.filter((entry) => entry === "固守發動，傷害 -1。")).toHaveLength(1);
  });

  it("uses rally to draw one card and heal one health without exceeding max health", () => {
    const rally = getCard("激勵");
    const drawCard = getCard("斬");
    const wounded = {
      ...createGame(),
      hand: [rally],
      deck: [drawCard],
      discard: [],
      player: { ...createGame().player, health: 4 },
    };
    const next = playCard(wounded, rally.id);

    expect(next.player.health).toBe(5);
    expect(next.hand).toEqual([drawCard]);
    expect(next.log[0]).toBe("你使用激勵，抽 1 張牌並回復 1 點體力。");

    const fullHealth = playCard(
      {
        ...createGame(),
        hand: [rally],
        deck: [drawCard],
        discard: [],
      },
      rally.id,
    );
    expect(fullHealth.player.health).toBe(fullHealth.player.maxHealth);
  });

  it("uses fire attack for one damage against a normal enemy", () => {
    const fireAttack = getCard("火攻");
    const state = {
      ...createGame(),
      hand: [fireAttack],
      enemyCharged: false,
      discard: [],
    };
    const next = playCard(state, fireAttack.id);

    expect(next.enemyHealth).toBe(state.enemyHealth - 1);
    expect(next.log[0]).toBe("你使用火攻，造成 1 點傷害。");
    expect(next.log.some((entry) => entry.includes("武聖"))).toBe(false);
  });

  it("uses fire attack to deal two damage and clear enemy charge", () => {
    const fireAttack = getCard("火攻");
    const state = {
      ...createGame(),
      hand: [fireAttack],
      enemyCharged: true,
      discard: [],
    };
    const next = playCard(state, fireAttack.id);

    expect(next.enemyHealth).toBe(state.enemyHealth - 2);
    expect(next.enemyCharged).toBe(false);
    expect(next.log[0]).toBe("火攻破勢，對蓄力中的敵人造成 2 點傷害，並打斷蓄力。");
  });

  it("does not trigger Wusheng or Green Dragon Crescent Blade with fire attack", () => {
    const equipment = getCard("青龍偃月刀");
    const fireAttack = getCard("火攻");
    const equipped = playCard({ ...createGame(), hand: [equipment], discard: [] }, equipment.id);
    const next = playCard(
      {
        ...equipped,
        hand: [fireAttack],
        player: { ...equipped.player, morale: equipped.player.maxMorale },
      },
      fireAttack.id,
    );

    expect(next.enemyHealth).toBe(equipped.enemyHealth - 1);
    expect(next.log.some((entry) => entry.includes("武聖"))).toBe(false);
    expect(next.log.some((entry) => entry.includes("青龍偃月刀發動"))).toBe(false);
  });

  it("clears guardActive after entering the next stage", () => {
    const routeState = selectReward(
      forceReward(
        {
          ...defeatFirstEnemy(),
          player: { ...defeatFirstEnemy().player, guardActive: true },
        },
        "max-health",
      ),
      "max-health",
    );
    const next = selectRoute(routeState, "official-road");

    expect(next.player.guardActive).toBe(false);
    expect(next.phase).toBe("player");
  });

  it("lets Zhuge Liang choose one observed card and bottom the rest", () => {
    const state = createGame("zhuge-liang");
    const observedCards = state.pendingObservation!.cards;
    const selected = observedCards[1];
    const unselected = [observedCards[0], observedCards[2]];

    const next = selectObservation(state, selected.id);

    expect(next.phase).toBe("player");
    expect(next.pendingObservation).toBeUndefined();
    expect(next.hand[0]).toEqual(selected);
    expect(next.hand).toHaveLength(3);
    expect(next.deck.slice(-2)).toEqual(unselected);
    expect(next.log[0]).toBe("諸葛亮發動觀星，選擇了一張牌加入手牌。");
    expect(next.currentDialogue).toMatchObject(getHeroDialogue("zhuge-liang", "use_strategy")!);
  });

  it("handles Zhuge Liang observation with fewer than three deck cards", () => {
    const initial = createGame("zhuge-liang");
    const ready = selectObservation(initial, initial.pendingObservation!.cards[0].id);
    const onlyCard = createGame().hand[0];
    const next = endTurn({
      ...ready,
      deck: [onlyCard],
      hand: [],
      discard: [],
      enemyActionIndex: 1,
    });

    expect(next.phase).toBe("observe");
    expect(next.pendingObservation?.cards).toHaveLength(1);
    expect(next.pendingObservation?.cards[0]).toEqual(onlyCard);
  });

  it("does not crash Zhuge Liang observation when the deck is empty", () => {
    const initial = createGame("zhuge-liang");
    const ready = selectObservation(initial, initial.pendingObservation!.cards[0].id);
    const next = endTurn({
      ...ready,
      deck: [],
      hand: [],
      discard: [],
      enemyActionIndex: 1,
    });

    expect(next.phase).toBe("player");
    expect(next.pendingObservation).toBeUndefined();
    expect(next.log[0]).toBe("諸葛亮觀星時牌堆無牌，改為正常抽牌。");
  });

  it("enters route selection after choosing a reward", () => {
    const rewarded = selectReward(forceReward(defeatFirstEnemy(), "starting-draw"), "starting-draw");

    expect(rewarded.phase).toBe("route");
    expect(rewarded.availableRoutes.map((route) => route.name)).toEqual([
      "山道",
      "官道",
      "險道",
    ]);
    expect(rewarded.playerUpgrades.startingDrawBonus).toBe(1);
    expect(rewarded.log[0]).toBe("進入路線選擇，決定下一場戰鬥的風險與報酬。");
  });

  it("moves to the next stage after choosing a route", () => {
    const routeState = selectReward(forceReward(defeatFirstEnemy(), "starting-draw"), "starting-draw");
    const next = selectRoute(routeState, "official-road");

    expect(next.phase).toBe("player");
    expect(next.enemyIndex).toBe(1);
    expect(next.stageConfig.name).toBe("山道伏兵");
    expect(next.enemy.name).toBe("黃巾弓手");
    expect(next.enemyHealth).toBe(getEnemiesForStage(2)[0].maxHealth);
    expect(next.playerUpgrades.startingDrawBonus).toBe(1);
    expect(next.hand).toHaveLength(6);
    expect(next.log[0]).toBe("第 2 關｜山道伏兵｜黃巾弓手登場：體力較低，但攻擊較頻繁。");
  });

  it("can deterministically select Xiliang Cavalry for stage five", () => {
    const routeState = prepareRouteStateAtStage(4);
    const next = selectRoute(routeState, "official-road", {
      enemyIds: { 5: "xiliang-cavalry" },
    });

    expect(next.enemy.name).toBe("西涼騎兵");
    expect(next.enemy.maxHealth).toBe(5);
    expect(next.stageConfig.name).toBe("西涼突騎");
    expect(next.encounteredEnemyIds.at(-1)).toBe("xiliang-cavalry");
  });

  it("enters route selection after defeating the second enemy and choosing reward", () => {
    const secondStage = chooseRewardAndRoute(defeatFirstEnemy(), "max-health", "official-road");
    const defeated = defeatCurrentEnemy(secondStage);
    const rewarded = selectReward(forceReward(defeated, "slash-damage"), "slash-damage");

    expect(defeated.phase).toBe("reward");
    expect(rewarded.phase).toBe("route");
    expect(rewarded.enemyIndex).toBe(1);
    expect(rewarded.availableRoutes).toHaveLength(3);
  });

  it("applies mountain path enemy health reduction to the next stage", () => {
    const routeState = selectReward(forceReward(defeatFirstEnemy(), "max-health"), "max-health");
    const next = selectRoute(routeState, "mountain-path");

    expect(next.enemy.name).toBe("黃巾弓手");
    expect(next.enemy.maxHealth).toBe(getEnemiesForStage(2)[0].maxHealth - 1);
    expect(next.enemyHealth).toBe(getEnemiesForStage(2)[0].maxHealth - 1);
    expect(next.log).toContain("你選擇山道，下一關敵人體力 -1。");
  });

  it("keeps official road enemy health unchanged", () => {
    const routeState = selectReward(forceReward(defeatFirstEnemy(), "max-health"), "max-health");
    const next = selectRoute(routeState, "official-road");

    expect(next.enemy.maxHealth).toBe(getEnemiesForStage(2)[0].maxHealth);
    expect(next.enemyHealth).toBe(getEnemiesForStage(2)[0].maxHealth);
    expect(next.log).toContain("你選擇官道，下一關維持正常難度。");
  });

  it("applies dangerous pass enemy health increase to the next stage", () => {
    const routeState = selectReward(forceReward(defeatFirstEnemy(), "max-health"), "max-health");
    const next = selectRoute(routeState, "dangerous-pass");

    expect(next.enemy.maxHealth).toBe(getEnemiesForStage(2)[0].maxHealth + 2);
    expect(next.enemyHealth).toBe(getEnemiesForStage(2)[0].maxHealth + 2);
    expect(next.rewardOptionBonus).toBe(1);
    expect(next.log).toContain("你選擇險道，下一關敵人體力 +2，但戰後獎勵多 1 個選項。");
  });

  it("adds one reward option after clearing dangerous pass", () => {
    const dangerousStage = chooseRewardAndRoute(defeatFirstEnemy(), "max-health", "dangerous-pass");
    const next = defeatCurrentEnemy(dangerousStage);

    expect(next.phase).toBe("reward");
    expect(next.rewardOptions).toHaveLength(4);
    expect(next.rewardOptionBonus).toBe(0);
    expect(next.log).toContain("險道報酬觸發，本次戰後獎勵增加 1 個選項。");
  });

  it("keeps stage seven victory in the reward and route flow before Lu Bu", () => {
    const defeated = defeatStage(7, "zhang-liang", { eventRoll: () => 1 });
    const routeState = selectReward(forceReward(defeated, "max-health"), "max-health");
    const next = selectRoute(routeState, "official-road");

    expect(defeated.phase).toBe("reward");
    expect(routeState.phase).toBe("route");
    expect(next.phase).toBe("player");
    expect(next.stageConfig.name).toBe("虎牢關前");
    expect(next.enemy.name).toBe("呂布");
    expect(next.currentDialogue).toMatchObject(getEnemyIntroDialogue("lu-bu", true)!);
  });

  it("uses a higher event trigger chance on event-heavy stages", () => {
    const eventHeavy = defeatStage(3, "bandit-leader", {
      eventRoll: () => 0.6,
      eventId: "strategist-advice",
    });
    const normal = defeatStage(4, "bandit-leader", { eventRoll: () => 0.6 });

    expect(eventHeavy.phase).toBe("event");
    expect(eventHeavy.currentEvent?.name).toBe("軍師獻策");
    expect(normal.phase).toBe("reward");
  });

  it("caps reward options at the available reward count", () => {
    const state = {
      ...createGame(),
      rewardOptionBonus: 99,
      enemyHealth: 3,
    };
    const slash = state.hand.find((card) => card.name === "斬")!;
    const next = playCard(state, slash.id, { eventRoll: () => 1 });

    expect(next.rewardOptions).toHaveLength(rewardCatalog.length);
  });

  it("runs event to reward to route to next stage flow", () => {
    const state = createGame();
    const slash = state.hand.find((card) => card.name === "斬")!;
    const eventState = playCard(
      { ...state, enemyHealth: 3 },
      slash.id,
      { eventRoll: () => 0, eventId: "strategist-advice" },
    );
    const rewardState = resolveEventOption(eventState, "listen");
    const routeState = selectReward(forceReward(rewardState, "max-health"), "max-health");
    const next = selectRoute(routeState, "mountain-path");

    expect(eventState.phase).toBe("event");
    expect(rewardState.phase).toBe("reward");
    expect(routeState.phase).toBe("route");
    expect(next.phase).toBe("player");
    expect(next.enemy.name).toBe("黃巾弓手");
  });

  it("runs reward to route to next stage flow when no event triggers", () => {
    const rewardState = defeatFirstEnemy();
    const routeState = selectReward(forceReward(rewardState, "max-health"), "max-health");
    const next = selectRoute(routeState, "official-road");

    expect(rewardState.phase).toBe("reward");
    expect(routeState.phase).toBe("route");
    expect(next.phase).toBe("player");
    expect(next.enemy.name).toBe("黃巾弓手");
  });

  it("wins after the eighth enemy is defeated", () => {
    const luBu = selectEnemyForStage(8);
    const state = {
      ...createGame(),
      enemyIndex: 7,
      stageConfig: getStageConfig(8),
      enemy: luBu,
      enemyHealth: 3,
    };
    const slash = state.hand.find((card) => card.name === "斬")!;
    const next = playCard(state, slash.id, { eventRoll: () => 0 });

    expect(next.status).toBe("won");
    expect(next.phase).toBe("player");
    expect(next.currentEvent).toBeUndefined();
    expect(next.log[0]).toBe("你突破虎牢關前的考驗，第一章：黃巾亂起 已完成。");
    expect(next.currentDialogue?.trigger).toBe("game_win");
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
    expect(next.currentDialogue?.trigger).toBe("game_lose");
  });
});

function defeatFirstEnemy(): GameState {
  const state = createGame();
  const slash = state.hand.find((card) => card.name === "斬")!;

  return playCard({ ...state, enemyHealth: 3 }, slash.id, { eventRoll: () => 1 });
}

function defeatCurrentEnemy(state: GameState): GameState {
  const slash = getCard("斬");

  return playCard(
    {
      ...state,
      hand: [slash],
      enemyHealth: 3,
      player: {
        ...state.player,
        morale: state.player.maxMorale,
        slashUsedThisTurn: false,
      },
    },
    slash.id,
    { eventRoll: () => 1 },
  );
}

function defeatStage(
  stage: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
  enemyId: string,
  eventOptions: Parameters<typeof playCard>[2],
): GameState {
  const slash = getCard("斬");
  const enemy = selectEnemyForStage(stage, enemyId);
  const state = {
    ...createGame(),
    enemyIndex: stage - 1,
    stageConfig: getStageConfig(stage),
    enemy,
    enemyHealth: 3,
    hand: [slash],
    player: {
      ...createGame().player,
      morale: createGame().player.maxMorale,
      slashUsedThisTurn: false,
    },
  };

  return playCard(state, slash.id, eventOptions);
}

function prepareRouteStateAtStage(stage: 1 | 2 | 3 | 4 | 5 | 6 | 7): GameState {
  return {
    ...forceReward(defeatStage(stage, getStageConfig(stage).enemyIds[0], { eventRoll: () => 1 }), "max-health"),
    phase: "route",
    availableRoutes: stageRoutes.map((route) => ({ ...route })),
  };
}

function chooseRewardAndRoute(
  state: GameState,
  rewardId: RewardId,
  routeId: StageRouteId,
): GameState {
  return selectRoute(selectReward(forceReward(state, rewardId), rewardId), routeId);
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

function getCard(cardName: string) {
  const card = starterDeck.find((item) => item.name === cardName);
  if (!card) {
    throw new Error(`Missing card ${cardName}`);
  }

  return card;
}

function countCards(cards: typeof starterDeck, cardName: string) {
  return cards.filter((card) => card.name === cardName).length;
}
