import { starterDeck } from "./cards";
import {
  getChapterIntroDialogue,
  getEnemyIntroDialogue,
  getGameResultDialogue,
  getHeroDialogue,
  getStageIntroDialogue,
} from "./dialogues";
import { cloneEnemy, selectEnemyForStage } from "./enemies";
import { resolveEvent } from "./events";
import { resolveHero } from "./heroes";
import { selectRouteEventForRoute } from "./routeEvents";
import { resolveStageRoute, stageRoutes } from "./routes";
import {
  chapterOne,
  getStageConfig,
  getStageConfigByIndex,
  totalStages,
} from "./stages";
import type {
  Card,
  DialogueLine,
  Enemy,
  EnemyStage,
  EnemyAction,
  GameEventId,
  GameState,
  Hero,
  PlayerUpgrades,
  Reward,
  RewardId,
  RouteEvent,
  StageRoute,
  StageRouteId,
} from "./types";

const logLimit = 12;
const dialogueHistoryLimit = 8;
const zhugeLiangTurnDraw = 2;

interface EventRollOptions {
  eventRoll?: () => number;
  eventId?: GameEventId;
}

interface EnemySelectionOptions {
  enemyIds?: Partial<Record<EnemyStage, string>>;
  enemyRandom?: () => number;
  equipmentRandom?: () => number;
}

interface RouteEventSelectionOptions {
  routeEventId?: string;
  routeEventRandom?: () => number;
}

const emptyNextBattleModifiers = {
  enemyHpModifier: 0,
  drawModifier: 0,
};

function createStartingPlayer(hero: Hero) {
  return {
    heroId: hero.id,
    name: hero.name,
    title: hero.title,
    skillName: hero.skillName,
    skillText: hero.skillDescription,
    maxHealth: hero.maxHp,
    health: hero.maxHp,
    morale: 3,
    maxMorale: 3,
    guardActive: false,
    slashUsedThisTurn: false,
    wineBonus: 0,
    equippedItems: [],
    equipmentUsageThisTurn: {
      greenDragonBladeSlash: false,
      taipingManual: false,
    },
    equipmentUsageThisBattle: {
      diluDodged: false,
    },
  };
}

const fallbackPlayer = {
  heroId: "guan-yu" as const,
  name: "關羽",
  title: "武聖",
  skillName: "武聖",
  skillText: "每回合第一次使用「斬」時，傷害 +1。",
  maxHealth: 5,
  health: 5,
  morale: 3,
  maxMorale: 3,
  guardActive: false,
  slashUsedThisTurn: false,
  wineBonus: 0,
  equippedItems: [],
  equipmentUsageThisTurn: {
    greenDragonBladeSlash: false,
    taipingManual: false,
  },
  equipmentUsageThisBattle: {
    diluDodged: false,
  },
};

const startingUpgrades: PlayerUpgrades = {
  maxHpBonus: 0,
  startingDrawBonus: 0,
  slashDamageBonus: 0,
  strategyDrawBonus: 0,
  armorBreakDamageBonus: 0,
};

export const rewardCatalog: Reward[] = [
  {
    id: "max-health",
    name: "最大體力 +1",
    text: "武將最大體力 +1，並回復 1 點體力。",
  },
  {
    id: "starting-draw",
    name: "開局多抽 1 張",
    text: "之後每一關開始時多抽 1 張牌。",
  },
  {
    id: "slash-damage",
    name: "強化斬",
    text: "所有斬的基礎傷害 +1。",
  },
  {
    id: "strategy-draw",
    name: "兵書精通",
    text: "兵書改為抽 3 張牌。",
  },
  {
    id: "armor-break-damage",
    name: "破甲精通",
    text: "破甲使用後，本回合下一次斬額外 +1 傷害。",
  },
];

export function createGame(heroId?: string, enemyOptions?: EnemySelectionOptions): GameState {
  const hero = resolveHero(heroId);
  const firstStage = getStageConfig(1);
  const firstEnemy = selectEnemyForStage(
    1,
    enemyOptions?.enemyIds?.[1],
    enemyOptions?.enemyRandom,
  );
  const baseState: GameState = {
    chapter: chapterOne,
    stageConfig: firstStage,
    player: createStartingPlayer(hero),
    playerUpgrades: { ...startingUpgrades },
    enemy: firstEnemy,
    enemyHealth: firstEnemy.maxHealth,
    enemyIndex: 0,
    encounteredEnemyIds: [firstEnemy.id],
    enemyActionIndex: 0,
    enemyGuarding: false,
    enemyCharged: false,
    enemyArmorBroken: false,
    deck: [...starterDeck],
    hand: [],
    discard: [],
    turn: 1,
    phase: "player",
    availableRoutes: [],
    pendingNextBattleModifiers: { ...emptyNextBattleModifiers },
    rewardOptionBonus: 0,
    rewardOptions: [],
    routeEventHistory: [],
    status: "playing",
    log: [firstEnemy.intro, firstStage.flavorText],
    currentDialogue: getHeroDialogue(hero.id, "hero_intro"),
    dialogueHistory: createOpeningDialogueHistory(hero.id, firstStage.stage, firstEnemy),
    lowHpDialogueUsed: false,
  };

  if (hero.id === "zhuge-liang") {
    return startObservation(baseState, zhugeLiangTurnDraw);
  }

  return drawCards(baseState, 5);
}

export function drawCards(state: GameState, count: number): GameState {
  const next = cloneState(state);

  for (let i = 0; i < count; i += 1) {
    if (next.deck.length === 0) {
      next.deck = [...next.discard];
      next.discard = [];
    }

    const card = next.deck.shift();
    if (!card) {
      break;
    }
    next.hand.push(card);
  }

  return next;
}

export function playCard(
  state: GameState,
  cardId: string,
  _eventOptions?: EventRollOptions,
): GameState {
  void _eventOptions;

  if (state.status !== "playing") {
    return state;
  }

  if (state.phase === "defense") {
    return appendLog(state, "敵人正在攻擊，請先選擇使用閃或承受傷害。");
  }

  if (state.phase === "reward") {
    return appendLog(state, "請先選擇通關獎勵，再進入下一關。");
  }

  if (state.phase === "observe") {
    return appendLog(state, "請先完成觀星，選擇一張牌加入手牌。");
  }

  if (state.phase === "event") {
    return appendLog(state, "請先處理事件，再進入戰後獎勵。");
  }

  if (state.phase === "route") {
    return appendLog(state, "請先選擇下一關路線。");
  }

  if (state.phase === "routeEvent") {
    return appendLog(state, "請先處理路線事件，再進入下一關。");
  }

  const next = cloneState(state);
  const cardIndex = next.hand.findIndex((card) => card.id === cardId);
  if (cardIndex === -1) {
    return appendLog(next, "手牌中沒有這張牌。");
  }

  const card = next.hand[cardIndex];
  if (card.kind === "dodge" && next.player.heroId !== "zhao-yun") {
    return appendLog(next, "閃會在敵人攻擊時使用；敵人攻擊時會出現使用閃按鈕。");
  }

  if (card.kind === "equipment" && hasEquipment(next, card.name)) {
    return appendLog(next, "已裝備相同裝備。");
  }

  if (card.cost > next.player.morale) {
    return appendLog(next, `士氣不足，${card.name} 需要 ${card.cost} 點士氣。`);
  }

  next.hand.splice(cardIndex, 1);
  next.player.morale -= card.cost;

  applyCardEffect(next, card);
  applyCardDialogue(next, card);

  if (card.kind !== "equipment") {
    next.discard.push(card);
  }

  if (next.enemyHealth <= 0) {
    return advanceEnemy(next);
  }

  return next;
}

export function endTurn(state: GameState): GameState {
  if (state.status !== "playing") {
    return state;
  }

  if (state.phase === "defense") {
    return appendLog(state, "請先處理敵人的攻擊。");
  }

  if (state.phase === "reward") {
    return appendLog(state, "請先選擇通關獎勵，再進入下一關。");
  }

  if (state.phase === "observe") {
    return appendLog(state, "請先完成觀星，選擇一張牌加入手牌。");
  }

  if (state.phase === "event") {
    return appendLog(state, "請先處理事件，再進入戰後獎勵。");
  }

  if (state.phase === "route") {
    return appendLog(state, "請先選擇下一關路線。");
  }

  if (state.phase === "routeEvent") {
    return appendLog(state, "請先處理路線事件，再進入下一關。");
  }

  const next = cloneState(state);
  const action = getCurrentEnemyAction(next);
  next.enemyActionIndex += 1;

  if (action.kind === "guard") {
    next.enemyGuarding = true;
    return startNextTurn(
      appendLog(next, `${next.enemy.name} 進入防守狀態，下次受到的傷害 -1。`),
    );
  }

  if (action.kind === "charge") {
    next.enemyCharged = true;
    return startNextTurn(
      appendLog(next, `${next.enemy.name} 蓄力，下次攻擊 +1。`),
    );
  }

  const baseDamage = action.kind === "fierce" ? next.enemy.attack + 1 : next.enemy.attack;
  const chargedBonus = next.enemyCharged ? 1 : 0;
  const damage = baseDamage + chargedBonus;
  const damageSegments = action.kind === "fierce" ? [1, Math.max(0, damage - 1)] : [damage];
  next.enemyCharged = false;

  const attackMessage =
    action.kind === "fierce"
      ? `${next.enemy.name} 發動猛攻，準備造成 ${damage} 點傷害。`
      : `${next.enemy.name} 發動普通攻擊，準備造成 ${damage} 點傷害。`;

  if (hasEquipment(next, "的盧馬") && !next.player.equipmentUsageThisBattle.diluDodged) {
    next.player.equipmentUsageThisBattle.diluDodged = true;
    return startNextTurn(
      appendLog(
        next,
        `${attackMessage} 的盧馬發動，自動閃避一次攻擊。`,
      ),
    );
  }

  if (hasDefenseCard(next)) {
    const defenseHint =
      next.player.heroId === "zhao-yun" && !hasDodge(next) && hasSlash(next)
        ? "你手上有斬，可以發動龍膽抵消或承受。"
        : "你手上有閃，可以選擇抵消或承受。";

    return appendLog({
      ...next,
      phase: "defense",
      pendingDefense: {
        enemyName: next.enemy.name,
        actionLabel: action.label,
        damage,
        damageSegments,
      },
    }, `${attackMessage} ${defenseHint}`);
  }

  return finishEnemyDamage(next, damageSegments, (finalDamage) => (
    `${attackMessage} 你沒有可抵消的牌，受到 ${finalDamage} 點傷害。`
  ));
}

export function resolveDefense(state: GameState, useDodge: boolean): GameState {
  if (state.status !== "playing" || state.phase !== "defense" || !state.pendingDefense) {
    return state;
  }

  const pendingDefense = state.pendingDefense;
  const next = cloneState(state);
  const damage = pendingDefense.damage;
  const damageSegments = pendingDefense.damageSegments ?? [damage];

  if (useDodge) {
    const dodgeIndex = next.hand.findIndex((card) => card.kind === "dodge");
    const slashAsDodgeIndex =
      dodgeIndex === -1 && next.player.heroId === "zhao-yun"
        ? next.hand.findIndex((card) => card.kind === "attack")
        : -1;
    const defenseCardIndex = dodgeIndex === -1 ? slashAsDodgeIndex : dodgeIndex;

    if (defenseCardIndex === -1) {
      return finishEnemyDamage(next, damageSegments, (finalDamage) => (
        `你沒有可抵消的牌，受到 ${finalDamage} 點傷害。`
      ));
    }

    const [defenseCard] = next.hand.splice(defenseCardIndex, 1);
    next.discard.push(defenseCard);
    next.phase = "player";
    next.pendingDefense = undefined;

    if (defenseCard.kind === "attack") {
      return startNextTurn(
        appendLog(
          setDialogue(next, getHeroDialogue(next.player.heroId, "use_dodge")),
          `趙雲發動龍膽，將斬當作閃使用，抵消 ${damage} 點傷害。`,
        ),
      );
    }

    return startNextTurn(
      appendLog(
        setDialogue(next, getHeroDialogue(next.player.heroId, "use_dodge")),
        `你使用了閃，抵消 ${damage} 點傷害。`,
      ),
    );
  }

  return finishEnemyDamage(next, damageSegments, (finalDamage) => (
    `你選擇承受攻擊，受到 ${finalDamage} 點傷害。`
  ));
}

export function getCurrentEnemyAction(state: GameState): EnemyAction {
  return state.enemy.actions[state.enemyActionIndex % state.enemy.actions.length];
}

export function selectObservation(state: GameState, cardId: string): GameState {
  if (
    state.status !== "playing" ||
    state.phase !== "observe" ||
    !state.pendingObservation
  ) {
    return state;
  }

  const next = cloneState(state);
  const pendingObservation = next.pendingObservation;

  if (!pendingObservation) {
    return next;
  }

  const selectedIndex = pendingObservation.cards.findIndex((card) => card.id === cardId);

  if (selectedIndex === -1) {
    return appendLog(next, "觀星中沒有這張牌。");
  }

  const [selectedCard] = pendingObservation.cards.splice(selectedIndex, 1);
  next.hand.push(selectedCard);
  next.deck.push(...pendingObservation.cards);
  const drawCount = pendingObservation.drawCount;
  next.phase = "player";
  next.pendingObservation = undefined;
  next.log = [
    "諸葛亮發動觀星，選擇了一張牌加入手牌。",
    ...next.log,
  ].slice(0, logLimit);
  setDialogue(next, getHeroDialogue(next.player.heroId, "use_strategy"));

  return drawCards(next, drawCount);
}

export function selectReward(state: GameState, rewardId: RewardId): GameState {
  if (state.status !== "playing" || state.phase !== "reward") {
    return state;
  }

  const reward = state.rewardOptions.find((option) => option.id === rewardId);
  if (!reward) {
    return appendLog(state, "這個獎勵目前不能選擇。");
  }

  const next = applyReward(cloneState(state), reward);

  return {
    ...next,
    phase: "route",
    pendingDefense: undefined,
    currentEvent: undefined,
    currentRouteEvent: undefined,
    rewardOptions: [],
    availableRoutes: stageRoutes.map((route) => ({ ...route })),
    log: [
      "進入路線選擇，決定下一場戰鬥的風險與報酬。",
      `獲得獎勵：${reward.name}。${reward.text}`,
      ...next.log,
    ].slice(0, logLimit),
  };
}

export function selectRoute(
  state: GameState,
  routeId: StageRouteId,
  routeEventOptions?: RouteEventSelectionOptions,
): GameState {
  if (state.status !== "playing" || state.phase !== "route") {
    return state;
  }

  const route = state.availableRoutes.find((item) => item.id === routeId) ?? resolveStageRoute(routeId);
  const nextEnemyIndex = state.enemyIndex + 1;

  if (nextEnemyIndex >= totalStages) {
    return appendLog(state, "已無下一關可選擇路線。");
  }

  const routeEvent = selectRouteEventForRoute(
    route.id,
    routeEventOptions?.routeEventId,
    routeEventOptions?.routeEventRandom,
  );

  return setDialogue(
    {
      ...cloneState(state),
      discard: [...state.discard, ...state.hand],
      hand: [],
      availableRoutes: [],
      selectedRoute: route,
      phase: "routeEvent",
      pendingDefense: undefined,
      currentEvent: undefined,
      currentRouteEvent: routeEvent,
      log: [
        `遭遇路線事件：${routeEvent.name}。`,
        `你選擇了${route.name}。`,
        ...state.log,
      ].slice(0, logLimit),
    },
    createRouteNarratorDialogue(routeEvent),
  );
}

export function resolveRouteEventOption(
  state: GameState,
  optionId: string,
  enemyOptions?: EnemySelectionOptions,
): GameState {
  if (
    state.status !== "playing" ||
    state.phase !== "routeEvent" ||
    !state.currentRouteEvent ||
    !state.selectedRoute
  ) {
    return state;
  }

  const event = state.currentRouteEvent;
  const option = event.options.find((item) => item.id === optionId);

  if (!option) {
    return appendLog(state, "這個路線事件選項目前不能選擇。");
  }

  const next = cloneState(state);
  const effectMessages = applyRouteEventEffect(next, event, enemyOptions?.equipmentRandom);

  if (next.player.health <= 0) {
    return {
      ...setDialogue(next, getGameResultDialogue("lost")),
      status: "lost",
      phase: "player",
      currentRouteEvent: undefined,
      routeEventHistory: [...next.routeEventHistory, event.id],
      log: [
        `${next.player.name}體力歸零，戰敗。`,
        ...effectMessages,
        `你選擇了「${option.label}」。`,
        ...next.log,
      ].slice(0, logLimit),
    };
  }

  return startNextStage(
    {
      ...next,
      enemyIndex: next.enemyIndex + 1,
      currentRouteEvent: undefined,
      routeEventHistory: [...next.routeEventHistory, event.id],
      log: [
        ...effectMessages,
        `你選擇了「${option.label}」。`,
        `路線事件：${event.name}。${event.flavorText}`,
        ...next.log,
      ].slice(0, logLimit),
    },
    enemyOptions,
  );
}

export function enterEventPhase(
  state: GameState,
  eventId?: GameEventId,
): GameState {
  const event = resolveEvent(eventId);

  return appendLog(
    {
      ...cloneState(state),
      phase: "event",
      pendingDefense: undefined,
      pendingObservation: undefined,
      currentEvent: event,
      currentRouteEvent: undefined,
      rewardOptions: [],
    },
    `事件出現：${event.name}。`,
  );
}

export function resolveEventOption(state: GameState, optionId: string): GameState {
  if (state.status !== "playing" || state.phase !== "event" || !state.currentEvent) {
    return state;
  }

  const event = state.currentEvent;
  const option = event.options.find((item) => item.id === optionId);

  if (!option) {
    return appendLog(state, "這個事件選項目前不能選擇。");
  }

  const next = cloneState(state);
  let effectMessage = "";

  if (event.id === "village-supply") {
    next.player.health = Math.min(next.player.maxHealth, next.player.health + 2);
    effectMessage = "荒村補給：回復 2 點體力。";
  }

  if (event.id === "strategist-advice") {
    const drawn = drawCards(next, 2);
    next.deck = drawn.deck;
    next.hand = drawn.hand;
    next.discard = drawn.discard;
    effectMessage = "軍師獻策：抽 2 張牌。";
  }

  if (event.id === "ambush") {
    next.player.health = Math.max(0, next.player.health - 1);

    if (next.player.health <= 0) {
      return {
        ...setDialogue(next, getGameResultDialogue("lost")),
        status: "lost",
        phase: "player",
        currentEvent: undefined,
        log: [
          `${next.player.name}體力歸零，戰敗。`,
          "伏兵突襲：失去 1 點體力。",
          `你選擇了「${option.label}」。`,
          ...next.log,
        ].slice(0, logLimit),
      };
    }

    next.playerUpgrades.slashDamageBonus += 1;
    effectMessage = "伏兵突襲：失去 1 點體力，斬傷害 +1。";
  }

  return {
    ...next,
    currentEvent: undefined,
    currentRouteEvent: undefined,
    ...createRewardPhaseFields(next.rewardOptionBonus),
    log: createRewardLog(next.rewardOptionBonus, [
      "事件結束，進入戰後獎勵。",
      effectMessage,
      `你選擇了「${option.label}」。`,
      ...next.log,
    ]),
  };
}

function applyCardEffect(state: GameState, card: Card) {
  if (card.kind === "equipment") {
    state.player.equippedItems.push(card);
    state.log = [`裝備成功：${card.name}。`, ...state.log].slice(0, logLimit);
    return;
  }

  if (card.kind === "attack") {
    applySlashEffect(state, card.value, "你使用了斬");
    return;
  }

  if (card.kind === "dodge" && state.player.heroId === "zhao-yun") {
    applySlashEffect(state, 1, "趙雲發動龍膽，將閃當作斬使用");
    return;
  }

  if (card.kind === "wine") {
    state.player.wineBonus += card.value;
    state.player.health = Math.min(state.player.maxHealth, state.player.health + 1);
    state.log = [
      "你使用了酒，恢復 1 點體力，下一張斬傷害 +1。",
      ...state.log,
    ].slice(0, logLimit);
    return;
  }

  if (card.kind === "draw") {
    const notes: string[] = [];
    let drawCount = card.value + state.playerUpgrades.strategyDrawBonus;

    if (hasEquipment(state, "太平要術") && !state.player.equipmentUsageThisTurn.taipingManual) {
      drawCount += 1;
      state.player.equipmentUsageThisTurn.taipingManual = true;
      notes.push("太平要術發動，兵書額外抽 1 張。");
    }

    const drawn = drawCards(state, drawCount);
    state.deck = drawn.deck;
    state.hand = drawn.hand;
    state.discard = drawn.discard;
    state.log = [`你使用了兵書，抽 ${drawCount} 張牌。`, ...notes, ...state.log].slice(
      0,
      logLimit,
    );
    return;
  }

  if (card.kind === "combo") {
    const wasEnemyWounded = state.enemyHealth < state.enemy.maxHealth;
    const damage = card.value;
    const notes: string[] = [];
    state.enemyHealth = Math.max(0, state.enemyHealth - damage);

    if (wasEnemyWounded) {
      const drawn = drawCards(state, 1);
      state.deck = drawn.deck;
      state.hand = drawn.hand;
      state.discard = drawn.discard;
      notes.push("連斬追擊成功，抽 1 張牌。");
    }

    state.log = [`你使用連斬，造成 ${damage} 點傷害。`, ...notes, ...state.log].slice(
      0,
      logLimit,
    );
    return;
  }

  if (card.kind === "guard") {
    state.player.guardActive = true;
    state.log = ["你使用固守，下一次受到傷害 -1。", ...state.log].slice(0, logLimit);
    return;
  }

  if (card.kind === "rally") {
    const drawn = drawCards(state, 1);
    state.deck = drawn.deck;
    state.hand = drawn.hand;
    state.discard = drawn.discard;
    state.player.health = Math.min(state.player.maxHealth, state.player.health + 1);
    state.log = ["你使用激勵，抽 1 張牌並回復 1 點體力。", ...state.log].slice(
      0,
      logLimit,
    );
    return;
  }

  if (card.kind === "fire") {
    if (state.enemyCharged) {
      state.enemyCharged = false;
      state.enemyHealth = Math.max(0, state.enemyHealth - 2);
      state.log = [
        "火攻破勢，對蓄力中的敵人造成 2 點傷害，並打斷蓄力。",
        ...state.log,
      ].slice(0, logLimit);
      return;
    }

    state.enemyHealth = Math.max(0, state.enemyHealth - card.value);
    state.log = [`你使用火攻，造成 ${card.value} 點傷害。`, ...state.log].slice(
      0,
      logLimit,
    );
    return;
  }

  if (card.kind === "pierce") {
    state.enemyGuarding = false;
    state.enemyArmorBroken = true;
    state.enemyHealth = Math.max(0, state.enemyHealth - card.value);
    const bonusText =
      state.playerUpgrades.armorBreakDamageBonus > 0
        ? `本回合下一次斬傷害 +${1 + state.playerUpgrades.armorBreakDamageBonus}`
        : "下一次斬傷害 +1";
    state.log = [`你使用了破甲，造成 ${card.value} 點傷害，${bonusText}。`, ...state.log].slice(
      0,
      logLimit,
    );
  }
}

function advanceEnemy(state: GameState): GameState {
  const nextEnemyIndex = state.enemyIndex + 1;

  if (nextEnemyIndex >= totalStages) {
    return appendLog(
      {
        ...setDialogue(state, getGameResultDialogue("won")),
        status: "won",
        enemyHealth: 0,
        phase: "player",
        availableRoutes: [],
      },
      "你突破虎牢關前的考驗，第一章：黃巾亂起 已完成。",
    );
  }

  return {
    ...setDialogue(state, getHeroDialogue(state.player.heroId, "victory")),
    enemyActionIndex: 0,
    enemyGuarding: false,
    enemyCharged: false,
    enemyArmorBroken: false,
    pendingDefense: undefined,
    currentEvent: undefined,
    currentRouteEvent: undefined,
    availableRoutes: [],
    ...createRewardPhaseFields(state.rewardOptionBonus),
    player: {
      ...state.player,
      morale: state.player.maxMorale,
      guardActive: false,
      slashUsedThisTurn: false,
      wineBonus: 0,
      equipmentUsageThisTurn: createTurnEquipmentUsage(),
    },
    log: createRewardLog(state.rewardOptionBonus, [
      `擊敗${state.enemy.name}，選擇一項通關獎勵。`,
      ...state.log,
    ]),
  };
}

function finishEnemyDamage(
  state: GameState,
  damage: number | number[],
  message: string | ((finalDamage: number) => string),
): GameState {
  const next = cloneState(state);
  const damageSegments = Array.isArray(damage) ? damage : [damage];
  let finalDamage = 0;
  const notes: string[] = [];

  damageSegments.forEach((segmentDamage) => {
    let nextSegmentDamage = segmentDamage;

    if (next.player.guardActive) {
      nextSegmentDamage = Math.max(0, nextSegmentDamage - 1);
      next.player.guardActive = false;
      notes.push("固守發動，傷害 -1。");
    }

    finalDamage += nextSegmentDamage;
  });

  next.player.health = Math.max(0, next.player.health - finalDamage);
  next.phase = "player";
  next.pendingDefense = undefined;
  next.log = [
    typeof message === "function" ? message(finalDamage) : message,
    ...notes,
    ...next.log,
  ].slice(0, logLimit);

  if (next.player.health <= 0) {
    return appendLog(
      { ...setDialogue(next, getGameResultDialogue("lost")), status: "lost" },
      `${next.player.name}體力歸零，戰敗。`,
    );
  }

  if (finalDamage > 0) {
    if (next.player.health <= 2 && !next.lowHpDialogueUsed) {
      next.lowHpDialogueUsed = true;
      setDialogue(next, getHeroDialogue(next.player.heroId, "low_hp"));
    } else {
      setDialogue(next, getHeroDialogue(next.player.heroId, "take_damage"));
    }
  }

  return startNextTurn(next);
}

function startNextTurn(state: GameState): GameState {
  const next = cloneState(state);
  next.discard.push(...next.hand);
  next.hand = [];
  next.turn += 1;
  next.phase = "player";
  next.pendingDefense = undefined;
  next.player.morale = next.player.maxMorale;
  next.player.guardActive = false;
  next.player.slashUsedThisTurn = false;
  next.player.wineBonus = 0;
  next.player.equipmentUsageThisTurn = createTurnEquipmentUsage();
  next.enemyArmorBroken = false;

  if (next.player.heroId === "zhuge-liang") {
    return startObservation(next, zhugeLiangTurnDraw);
  }

  return drawCards(next, 5);
}

function startNextStage(
  state: GameState,
  enemyOptions?: EnemySelectionOptions,
): GameState {
  const next = cloneState(state);
  const stage = (next.enemyIndex + 1) as EnemyStage;
  const stageConfig = getStageConfig(stage);
  const baseEnemy = selectEnemyForStage(
    stage,
    enemyOptions?.enemyIds?.[stage],
    enemyOptions?.enemyRandom,
  );
  const nextEnemy = applyNextBattleModifiersToEnemy(
    baseEnemy,
    next.pendingNextBattleModifiers.enemyHpModifier,
  );
  const drawModifier = next.pendingNextBattleModifiers.drawModifier;
  next.enemyActionIndex = 0;
  next.enemyGuarding = false;
  next.enemyCharged = false;
  next.enemyArmorBroken = false;
  next.enemy = nextEnemy;
  next.stageConfig = stageConfig;
  next.enemyHealth = nextEnemy.maxHealth;
  next.encounteredEnemyIds = [...next.encounteredEnemyIds, nextEnemy.id];
  next.turn += 1;
  next.phase = "player";
  next.player.morale = next.player.maxMorale;
  next.player.guardActive = false;
  next.player.slashUsedThisTurn = false;
  next.player.wineBonus = 0;
  next.player.equipmentUsageThisTurn = createTurnEquipmentUsage();
  next.player.equipmentUsageThisBattle = createBattleEquipmentUsage();
  next.lowHpDialogueUsed = false;
  next.pendingNextBattleModifiers = { ...emptyNextBattleModifiers };

  const stagedState = {
    ...next,
    log: [
      next.enemy.intro,
      `下一關開始：${stageConfig.name}。${stageConfig.flavorText}`,
      getRouteLogMessage(next.selectedRoute, drawModifier, baseEnemy.maxHealth, nextEnemy.maxHealth),
      ...next.log,
    ].slice(0, logLimit),
  };
  setStageStartDialogue(stagedState);

  if (next.player.heroId === "zhuge-liang") {
    return startObservation(
      stagedState,
      Math.max(0, zhugeLiangTurnDraw + next.playerUpgrades.startingDrawBonus + drawModifier),
    );
  }

  return drawCards(stagedState, Math.max(0, 5 + next.playerUpgrades.startingDrawBonus + drawModifier));
}

function applyCardDialogue(state: GameState, card: Card) {
  if (
    card.kind === "attack" ||
    (card.kind === "dodge" && state.player.heroId === "zhao-yun")
  ) {
    setDialogue(state, getHeroDialogue(state.player.heroId, "use_slash"));
    return;
  }

  if (
    state.player.heroId === "zhuge-liang" &&
    ["draw", "pierce", "rally", "fire"].includes(card.kind)
  ) {
    setDialogue(state, getHeroDialogue(state.player.heroId, "use_strategy"));
  }
}

function applyReward(state: GameState, reward: Reward): GameState {
  if (reward.id === "max-health") {
    state.playerUpgrades.maxHpBonus += 1;
    state.player.maxHealth += 1;
    state.player.health = Math.min(state.player.maxHealth, state.player.health + 1);
    return state;
  }

  if (reward.id === "starting-draw") {
    state.playerUpgrades.startingDrawBonus += 1;
    return state;
  }

  if (reward.id === "slash-damage") {
    state.playerUpgrades.slashDamageBonus += 1;
    return state;
  }

  if (reward.id === "strategy-draw") {
    state.playerUpgrades.strategyDrawBonus += 1;
    return state;
  }

  state.playerUpgrades.armorBreakDamageBonus += 1;
  return state;
}

function applyRouteEventEffect(
  state: GameState,
  event: RouteEvent,
  random: () => number = Math.random,
) {
  if (event.id === "mountain-spring") {
    state.player.health = Math.min(state.player.maxHealth, state.player.health + 2);
    return ["事件效果：回復 2 點體力。"];
  }

  if (event.id === "hermit-guidance" || event.id === "urgent-orders") {
    state.pendingNextBattleModifiers.drawModifier += 1;
    return ["下一關效果：額外抽 1 張牌。"];
  }

  if (event.id === "foggy-trail") {
    state.pendingNextBattleModifiers.enemyHpModifier -= 1;
    state.pendingNextBattleModifiers.drawModifier -= 1;
    return ["下一關效果：敵人 HP -1，玩家少抽 1 張牌。"];
  }

  if (event.id === "relay-station") {
    const drawn = drawCards(state, 1);
    state.deck = drawn.deck;
    state.hand = drawn.hand;
    state.discard = drawn.discard;
    state.player.health = Math.min(state.player.maxHealth, state.player.health + 1);
    return ["事件效果：抽 1 張牌並回復 1 點體力。"];
  }

  if (event.id === "remnant-troops") {
    state.playerUpgrades.slashDamageBonus += 1;
    return ["事件效果：收編官軍殘部，斬傷害 +1。"];
  }

  if (event.id === "cliff-ambush") {
    state.player.health = Math.max(0, state.player.health - 1);
    state.rewardOptionBonus += 1;
    return ["事件效果：失去 1 點體力。", "下一次戰後獎勵 +1 個選項。"];
  }

  if (event.id === "battlefield-relic") {
    const equipment = pickUnequippedEquipment(state, random);

    if (equipment) {
      state.player.equippedItems.push(equipment);
      return [`事件效果：獲得裝備「${equipment.name}」。`];
    }

    const drawn = drawCards(state, 2);
    state.deck = drawn.deck;
    state.hand = drawn.hand;
    state.discard = drawn.discard;
    return ["事件效果：裝備已齊，改為抽 2 張牌。"];
  }

  if (event.id === "night-raid") {
    if (state.player.health >= 4) {
      state.playerUpgrades.slashDamageBonus += 1;
      return ["事件效果：夜襲成功，斬傷害 +1。"];
    }

    state.player.health = Math.max(0, state.player.health - 1);
    const drawn = drawCards(state, 1);
    state.deck = drawn.deck;
    state.hand = drawn.hand;
    state.discard = drawn.discard;
    return ["事件效果：夜襲失利，失去 1 點體力並抽 1 張牌。"];
  }

  return ["事件效果：穩定前進，無額外修正。"];
}

function pickUnequippedEquipment(state: GameState, random: () => number) {
  const equippedNames = new Set(state.player.equippedItems.map((item) => item.name));
  const candidates = starterDeck.filter(
    (card) => card.kind === "equipment" && !equippedNames.has(card.name),
  );

  if (candidates.length === 0) {
    return undefined;
  }

  return { ...candidates[Math.floor(random() * candidates.length)] };
}

function pickRewardOptions(count = 3): Reward[] {
  return [...rewardCatalog]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(count, rewardCatalog.length));
}

function applySlashEffect(state: GameState, baseValue: number, actionText: string) {
  let damage = baseValue + state.playerUpgrades.slashDamageBonus;
  const notes: string[] = [];
  const isFirstSlashThisTurn = !state.player.slashUsedThisTurn;

  if (isFirstSlashThisTurn) {
    state.player.slashUsedThisTurn = true;
  }

  if (state.player.heroId === "guan-yu" && isFirstSlashThisTurn) {
    damage += 1;
    notes.push("關羽發動武聖，第一次斬傷害 +1");
  }

  if (
    hasEquipment(state, "青龍偃月刀") &&
    isFirstSlashThisTurn &&
    !state.player.equipmentUsageThisTurn.greenDragonBladeSlash
  ) {
    damage += 1;
    state.player.equipmentUsageThisTurn.greenDragonBladeSlash = true;
    notes.push("青龍偃月刀發動，第一次斬額外 +1 傷害");
  }

  if (state.player.wineBonus > 0) {
    damage += state.player.wineBonus;
    notes.push(`酒勢加成，斬傷害 +${state.player.wineBonus}`);
    state.player.wineBonus = 0;
  }

  if (state.enemyArmorBroken) {
    const armorBreakBonus = 1 + state.playerUpgrades.armorBreakDamageBonus;
    damage += armorBreakBonus;
    state.enemyArmorBroken = false;
    notes.push(`破甲生效，斬傷害 +${armorBreakBonus}`);
  }

  if (state.enemyGuarding) {
    damage = Math.max(0, damage - 1);
    state.enemyGuarding = false;
    notes.push("敵人防守抵消 1 點傷害");
  }

  state.enemyHealth = Math.max(0, state.enemyHealth - damage);
  state.log = [
    `${actionText}，造成 ${damage} 點傷害。`,
    ...notes.map((note) => `${note}。`),
    ...state.log,
  ].slice(0, logLimit);
}

function hasDodge(state: GameState): boolean {
  return state.hand.some((card) => card.kind === "dodge");
}

function hasSlash(state: GameState): boolean {
  return state.hand.some((card) => card.kind === "attack");
}

function hasDefenseCard(state: GameState): boolean {
  return hasDodge(state) || (state.player.heroId === "zhao-yun" && hasSlash(state));
}

function hasEquipment(state: GameState, equipmentName: string): boolean {
  return state.player.equippedItems.some((item) => item.name === equipmentName);
}

function createTurnEquipmentUsage() {
  return {
    greenDragonBladeSlash: false,
    taipingManual: false,
  };
}

function createBattleEquipmentUsage() {
  return {
    diluDodged: false,
  };
}

function startObservation(state: GameState, drawCount: number): GameState {
  const next = cloneState(state);
  const cards = next.deck.splice(0, 3);

  if (cards.length === 0) {
    return drawCards(
      appendLog(
        { ...next, phase: "player", pendingObservation: undefined },
        "諸葛亮觀星時牌堆無牌，改為正常抽牌。",
      ),
      drawCount,
    );
  }

  return {
    ...next,
    phase: "observe",
    pendingObservation: {
      cards,
      drawCount,
    },
  };
}

function cloneState(state: GameState): GameState {
  const fallbackStageConfig = getStageConfigByIndex(state.enemyIndex ?? 0);

  return {
    ...state,
    chapter: { ...(state.chapter ?? chapterOne) },
    stageConfig: {
      ...(state.stageConfig ?? fallbackStageConfig),
      enemyIds: [...(state.stageConfig?.enemyIds ?? fallbackStageConfig.enemyIds)],
    },
    player: {
      ...fallbackPlayer,
      ...state.player,
      equippedItems: [...(state.player.equippedItems ?? [])],
      equipmentUsageThisTurn: {
        ...fallbackPlayer.equipmentUsageThisTurn,
        ...(state.player.equipmentUsageThisTurn ?? {}),
      },
      equipmentUsageThisBattle: {
        ...fallbackPlayer.equipmentUsageThisBattle,
        ...(state.player.equipmentUsageThisBattle ?? {}),
      },
    },
    playerUpgrades: { ...state.playerUpgrades },
    enemy: {
      ...cloneEnemy(state.enemy),
    },
    encounteredEnemyIds: [...(state.encounteredEnemyIds ?? [])],
    deck: [...state.deck],
    hand: [...state.hand],
    discard: [...state.discard],
    pendingDefense: state.pendingDefense ? { ...state.pendingDefense } : undefined,
    pendingObservation: state.pendingObservation
      ? {
          cards: [...state.pendingObservation.cards],
          drawCount: state.pendingObservation.drawCount,
        }
      : undefined,
    currentEvent: state.currentEvent
      ? {
          ...state.currentEvent,
          options: state.currentEvent.options.map((option) => ({ ...option })),
        }
      : undefined,
    currentRouteEvent: state.currentRouteEvent
      ? {
          ...state.currentRouteEvent,
          options: state.currentRouteEvent.options.map((option) => ({ ...option })),
        }
      : undefined,
    availableRoutes: state.availableRoutes.map((route) => ({ ...route })),
    selectedRoute: state.selectedRoute ? { ...state.selectedRoute } : undefined,
    pendingNextBattleModifiers: {
      ...emptyNextBattleModifiers,
      ...(state.pendingNextBattleModifiers ?? {}),
    },
    rewardOptionBonus: state.rewardOptionBonus ?? 0,
    rewardOptions: state.rewardOptions.map((reward) => ({ ...reward })),
    routeEventHistory: [...(state.routeEventHistory ?? [])],
    log: [...state.log],
    currentDialogue: state.currentDialogue ? cloneDialogue(state.currentDialogue) : undefined,
    dialogueHistory: (state.dialogueHistory ?? []).map((line) => cloneDialogue(line)),
    lowHpDialogueUsed: state.lowHpDialogueUsed ?? false,
  };
}

function appendLog(state: GameState, message: string): GameState {
  return {
    ...state,
    log: [message, ...state.log].slice(0, logLimit),
  };
}

function createRewardPhaseFields(rewardOptionBonus: number) {
  return {
    phase: "reward" as const,
    rewardOptions: pickRewardOptions(3 + rewardOptionBonus),
    rewardOptionBonus: 0,
  };
}

function createRewardLog(rewardOptionBonus: number, entries: string[]) {
  const bonusLog =
    rewardOptionBonus > 0 ? ["路線事件報酬觸發，本次戰後獎勵增加 1 個選項。"] : [];

  return [...entries.slice(0, 1), ...bonusLog, ...entries.slice(1)].slice(0, logLimit);
}

function applyNextBattleModifiersToEnemy(enemy: Enemy, enemyHpModifier: number): Enemy {
  const maxHealth = Math.max(1, enemy.maxHealth + enemyHpModifier);

  return {
    ...enemy,
    maxHp: maxHealth,
    maxHealth,
    traits: [...enemy.traits],
    actionDeck: enemy.actionDeck.map((action) => ({ ...action })),
    actions: enemy.actions.map((action) => ({ ...action })),
  };
}

function getRouteLogMessage(
  route: StageRoute | undefined,
  drawModifier: number,
  baseEnemyMaxHealth: number,
  nextEnemyMaxHealth: number,
) {
  const routeName = route?.name ?? "路線";
  const notes = [`${routeName}事件已結算，進入下一關。`];

  if (nextEnemyMaxHealth !== baseEnemyMaxHealth) {
    notes.push(`敵人 HP 修正 ${formatSigned(nextEnemyMaxHealth - baseEnemyMaxHealth)}。`);
  }

  if (drawModifier !== 0) {
    notes.push(`開局抽牌 ${formatSigned(drawModifier)}。`);
  }

  return notes.join(" ");
}

function formatSigned(value: number) {
  return value > 0 ? `+${value}` : `${value}`;
}

function createRouteNarratorDialogue(event: RouteEvent): DialogueLine {
  return {
    id: `route-event-${event.id}`,
    speakerId: "narrator",
    speakerName: "戰場旁白",
    speakerType: "narrator",
    trigger: "stage_intro",
    text: event.flavorText,
    tone: "路線事件",
  };
}

function createOpeningDialogueHistory(heroId: string, stage: EnemyStage, enemy: Enemy) {
  return [
    getHeroDialogue(heroId, "hero_intro"),
    getHeroDialogue(heroId, "battle_start"),
    getEnemyIntroDialogue(enemy.id, enemy.type === "boss"),
    getStageIntroDialogue(stage),
    getChapterIntroDialogue(),
  ].filter((line): line is DialogueLine => Boolean(line));
}

function setStageStartDialogue(state: GameState) {
  const lines = [
    getStageIntroDialogue(state.stageConfig.stage),
    getHeroDialogue(state.player.heroId, "battle_start"),
    getEnemyIntroDialogue(state.enemy.id, state.enemy.type === "boss"),
  ].filter((line): line is DialogueLine => Boolean(line));

  if (lines.length === 0) {
    return state;
  }

  state.dialogueHistory = [
    ...lines.map((line) => cloneDialogue(line)).reverse(),
    ...state.dialogueHistory,
  ].slice(0, dialogueHistoryLimit);
  state.currentDialogue = cloneDialogue(lines.at(-1)!);

  return state;
}

function setDialogue(state: GameState, dialogue?: DialogueLine) {
  if (!dialogue) {
    return state;
  }

  state.currentDialogue = cloneDialogue(dialogue);
  state.dialogueHistory = [
    cloneDialogue(dialogue),
    ...(state.dialogueHistory ?? []),
  ].slice(0, dialogueHistoryLimit);

  return state;
}

function cloneDialogue(dialogue: DialogueLine): DialogueLine {
  return { ...dialogue };
}
