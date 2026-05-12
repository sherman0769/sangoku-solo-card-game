import { starterDeck } from "./cards";
import { enemies } from "./enemies";
import type {
  Card,
  EnemyAction,
  GameState,
  PlayerUpgrades,
  Reward,
  RewardId,
} from "./types";

const logLimit = 12;

const startingPlayer = {
  name: "關羽",
  title: "單騎武將",
  skillName: "武聖",
  skillText: "每回合第一次使用斬時，該次傷害 +1。",
  maxHealth: 10,
  health: 10,
  morale: 3,
  maxMorale: 3,
  slashUsedThisTurn: false,
  wineBonus: 0,
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
    text: "關羽最大體力 +1，並回復 1 點體力。",
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

export function createGame(): GameState {
  const baseState: GameState = {
    player: { ...startingPlayer },
    playerUpgrades: { ...startingUpgrades },
    enemy: enemies[0],
    enemyHealth: enemies[0].maxHealth,
    enemyIndex: 0,
    enemyActionIndex: 0,
    enemyGuarding: false,
    enemyCharged: false,
    enemyArmorBroken: false,
    deck: [...starterDeck],
    hand: [],
    discard: [],
    turn: 1,
    phase: "player",
    rewardOptions: [],
    status: "playing",
    log: [enemies[0].intro],
  };

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

export function playCard(state: GameState, cardId: string): GameState {
  if (state.status !== "playing") {
    return state;
  }

  if (state.phase === "defense") {
    return appendLog(state, "敵人正在攻擊，請先選擇使用閃或承受傷害。");
  }

  if (state.phase === "reward") {
    return appendLog(state, "請先選擇通關獎勵，再進入下一關。");
  }

  const next = cloneState(state);
  const cardIndex = next.hand.findIndex((card) => card.id === cardId);
  if (cardIndex === -1) {
    return appendLog(next, "手牌中沒有這張牌。");
  }

  const card = next.hand[cardIndex];
  if (card.kind === "dodge") {
    return appendLog(next, "閃會在敵人攻擊時使用；敵人攻擊時會出現使用閃按鈕。");
  }

  if (card.cost > next.player.morale) {
    return appendLog(next, `士氣不足，${card.name} 需要 ${card.cost} 點士氣。`);
  }

  next.hand.splice(cardIndex, 1);
  next.player.morale -= card.cost;

  applyCardEffect(next, card);
  next.discard.push(card);

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
  next.enemyCharged = false;

  const attackMessage =
    action.kind === "fierce"
      ? `${next.enemy.name} 發動猛攻，準備造成 ${damage} 點傷害。`
      : `${next.enemy.name} 發動普通攻擊，準備造成 ${damage} 點傷害。`;

  if (hasDodge(next)) {
    return appendLog({
      ...next,
      phase: "defense",
      pendingDefense: {
        enemyName: next.enemy.name,
        actionLabel: action.label,
        damage,
      },
    }, `${attackMessage} 你手上有閃，可以選擇抵消或承受。`);
  }

  return finishEnemyDamage(
    appendLog(next, `${attackMessage} 你沒有閃，受到 ${damage} 點傷害。`),
    damage,
  );
}

export function resolveDefense(state: GameState, useDodge: boolean): GameState {
  if (state.status !== "playing" || state.phase !== "defense" || !state.pendingDefense) {
    return state;
  }

  const pendingDefense = state.pendingDefense;
  const next = cloneState(state);
  const damage = pendingDefense.damage;

  if (useDodge) {
    const dodgeIndex = next.hand.findIndex((card) => card.kind === "dodge");
    if (dodgeIndex === -1) {
      return finishEnemyDamage(
        appendLog(next, `你沒有閃可用，受到 ${damage} 點傷害。`),
        damage,
      );
    }

    const [dodge] = next.hand.splice(dodgeIndex, 1);
    next.discard.push(dodge);
    next.phase = "player";
    next.pendingDefense = undefined;

    return startNextTurn(
      appendLog(next, `你使用了閃，抵消 ${damage} 點傷害。`),
    );
  }

  return finishEnemyDamage(
    appendLog(next, `你選擇承受攻擊，受到 ${damage} 點傷害。`),
    damage,
  );
}

export function getCurrentEnemyAction(state: GameState): EnemyAction {
  return state.enemy.actions[state.enemyActionIndex % state.enemy.actions.length];
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
  const nextEnemyIndex = next.enemyIndex + 1;

  return startNextStage(
    {
      ...next,
      enemyIndex: nextEnemyIndex,
      enemy: enemies[nextEnemyIndex],
      enemyHealth: enemies[nextEnemyIndex].maxHealth,
      rewardOptions: [],
      phase: "player",
      pendingDefense: undefined,
    },
    reward,
  );
}

function applyCardEffect(state: GameState, card: Card) {
  if (card.kind === "attack") {
    let damage =
      card.value + (card.name === "斬" ? state.playerUpgrades.slashDamageBonus : 0);
    const notes: string[] = [];

    if (!state.player.slashUsedThisTurn) {
      damage += 1;
      state.player.slashUsedThisTurn = true;
      notes.push("關羽發動武聖，第一次斬傷害 +1");
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
      `你使用了斬，造成 ${damage} 點傷害。`,
      ...notes.map((note) => `${note}。`),
      ...state.log,
    ].slice(0, logLimit);
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
    const drawCount = card.value + state.playerUpgrades.strategyDrawBonus;
    const drawn = drawCards(state, drawCount);
    state.deck = drawn.deck;
    state.hand = drawn.hand;
    state.discard = drawn.discard;
    state.log = [`你使用了兵書，抽 ${drawCount} 張牌。`, ...state.log].slice(0, logLimit);
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

  if (nextEnemyIndex >= enemies.length) {
    return appendLog(
      { ...state, status: "won", enemyHealth: 0, phase: "player" },
      "三關敵人全數擊敗，關羽單騎突圍成功。",
    );
  }

  return appendLog(
    {
      ...state,
      enemyActionIndex: 0,
      enemyGuarding: false,
      enemyCharged: false,
      enemyArmorBroken: false,
      phase: "reward",
      pendingDefense: undefined,
      rewardOptions: pickRewardOptions(),
      player: {
        ...state.player,
        morale: state.player.maxMorale,
        slashUsedThisTurn: false,
        wineBonus: 0,
      },
    },
    `擊敗${state.enemy.name}，選擇一項通關獎勵。`,
  );
}

function finishEnemyDamage(state: GameState, damage: number): GameState {
  const next = cloneState(state);
  next.player.health = Math.max(0, next.player.health - damage);
  next.phase = "player";
  next.pendingDefense = undefined;

  if (next.player.health <= 0) {
    return appendLog({ ...next, status: "lost" }, "關羽體力歸零，戰敗。");
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
  next.player.slashUsedThisTurn = false;
  next.player.wineBonus = 0;
  next.enemyArmorBroken = false;

  return drawCards(next, 5);
}

function startNextStage(state: GameState, reward: Reward): GameState {
  const next = cloneState(state);
  next.enemyActionIndex = 0;
  next.enemyGuarding = false;
  next.enemyCharged = false;
  next.enemyArmorBroken = false;
  next.discard.push(...next.hand);
  next.hand = [];
  next.turn += 1;
  next.player.morale = next.player.maxMorale;
  next.player.slashUsedThisTurn = false;
  next.player.wineBonus = 0;

  return drawCards(
    {
      ...next,
      log: [
        next.enemy.intro,
        `獲得獎勵：${reward.name}。${reward.text}`,
        ...next.log,
      ].slice(0, logLimit),
    },
    5 + next.playerUpgrades.startingDrawBonus,
  );
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

function pickRewardOptions(): Reward[] {
  return [...rewardCatalog].sort(() => Math.random() - 0.5).slice(0, 3);
}

function hasDodge(state: GameState): boolean {
  return state.hand.some((card) => card.kind === "dodge");
}

function cloneState(state: GameState): GameState {
  return {
    ...state,
    player: { ...state.player },
    playerUpgrades: { ...state.playerUpgrades },
    enemy: {
      ...state.enemy,
      actions: state.enemy.actions.map((action) => ({ ...action })),
    },
    deck: [...state.deck],
    hand: [...state.hand],
    discard: [...state.discard],
    pendingDefense: state.pendingDefense ? { ...state.pendingDefense } : undefined,
    rewardOptions: state.rewardOptions.map((reward) => ({ ...reward })),
    log: [...state.log],
  };
}

function appendLog(state: GameState, message: string): GameState {
  return {
    ...state,
    log: [message, ...state.log].slice(0, logLimit),
  };
}
