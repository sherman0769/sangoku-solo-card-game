import type { Enemy, EnemyAction, EnemyStage } from "./types";

const actionTemplates = {
  attack2: { kind: "attack", label: "普通攻擊", text: "造成 2 點傷害。" },
  attack3: { kind: "attack", label: "普通攻擊", text: "造成 3 點傷害。" },
  fierce3: { kind: "fierce", label: "猛攻", text: "造成 3 點傷害。" },
  fierce4: { kind: "fierce", label: "猛攻", text: "造成 4 點傷害。" },
  guard: { kind: "guard", label: "防守", text: "進入防守狀態，下次受到的傷害 -1。" },
  charge: { kind: "charge", label: "蓄力", text: "下次攻擊傷害 +1。" },
} satisfies Record<string, EnemyAction>;

function createEnemy(enemy: Omit<Enemy, "title" | "intro" | "maxHealth" | "actions">): Enemy {
  const title = getStageTitle(enemy.stage);

  return {
    ...enemy,
    title,
    intro: getEnemyIntro(title, enemy.name, enemy.description),
    maxHealth: enemy.maxHp,
    actions: enemy.actionDeck.map((action) => ({ ...action })),
  };
}

export const enemyPool: Enemy[] = [
  createEnemy({
    id: "yellow-turban-soldier",
    name: "黃巾兵",
    stage: 1,
    type: "soldier",
    maxHp: 4,
    description: "基礎敵人，行動單純，適合熱身。",
    traits: ["基礎"],
    attack: 2,
    actionDeck: [
      actionTemplates.attack2,
      actionTemplates.guard,
      actionTemplates.attack2,
      actionTemplates.attack2,
    ],
  }),
  createEnemy({
    id: "yellow-turban-archer",
    name: "黃巾弓手",
    stage: 1,
    type: "soldier",
    maxHp: 3,
    description: "體力較低，但攻擊較頻繁。",
    traits: ["攻擊頻繁"],
    attack: 2,
    actionDeck: [
      actionTemplates.attack2,
      actionTemplates.attack2,
      actionTemplates.fierce3,
      actionTemplates.charge,
    ],
  }),
  createEnemy({
    id: "yellow-turban-brute",
    name: "黃巾力士",
    stage: 1,
    type: "soldier",
    maxHp: 5,
    description: "體力較高，但行動較笨重。",
    traits: ["體力較高"],
    attack: 2,
    actionDeck: [
      actionTemplates.attack2,
      actionTemplates.guard,
      actionTemplates.guard,
      actionTemplates.charge,
    ],
  }),
  createEnemy({
    id: "bandit-leader",
    name: "山賊頭目",
    stage: 2,
    type: "elite",
    maxHp: 6,
    description: "均衡型敵人，懂得攻擊、防守與蓄力。",
    traits: ["均衡"],
    attack: 2,
    actionDeck: [
      actionTemplates.attack2,
      actionTemplates.guard,
      actionTemplates.charge,
      actionTemplates.attack2,
    ],
  }),
  createEnemy({
    id: "black-mountain-general",
    name: "黑山賊將",
    stage: 2,
    type: "elite",
    maxHp: 7,
    description: "擅長防守，會拖慢戰鬥節奏。",
    traits: ["擅長防守"],
    attack: 2,
    actionDeck: [
      actionTemplates.guard,
      actionTemplates.guard,
      actionTemplates.attack2,
      actionTemplates.charge,
    ],
  }),
  createEnemy({
    id: "xiliang-cavalry",
    name: "西涼騎兵",
    stage: 2,
    type: "elite",
    maxHp: 5,
    description: "攻勢猛烈，容易連續造成壓力。",
    traits: ["猛攻壓制"],
    attack: 2,
    actionDeck: [
      actionTemplates.attack2,
      actionTemplates.fierce3,
      actionTemplates.fierce3,
      actionTemplates.charge,
    ],
  }),
  createEnemy({
    id: "lu-bu",
    name: "呂布",
    stage: 3,
    type: "boss",
    maxHp: 10,
    description: "最終 Boss，真正的考驗開始。",
    traits: ["Boss", "猛攻", "蓄力爆發"],
    attack: 3,
    actionDeck: [
      actionTemplates.attack3,
      actionTemplates.fierce4,
      actionTemplates.charge,
      actionTemplates.guard,
    ],
  }),
];

export const firstStageEnemyPool = enemyPool.filter((enemy) => enemy.stage === 1);
export const secondStageEnemyPool = enemyPool.filter((enemy) => enemy.stage === 2);
export const bossEnemy = enemyPool.find((enemy) => enemy.id === "lu-bu")!;

export const enemies: Enemy[] = [
  firstStageEnemyPool[0],
  secondStageEnemyPool[0],
  bossEnemy,
];

export function getEnemiesForStage(stage: EnemyStage): Enemy[] {
  return enemyPool.filter((enemy) => enemy.stage === stage);
}

export function selectEnemyForStage(
  stage: EnemyStage,
  enemyId?: string,
  random: () => number = () => 0,
): Enemy {
  if (stage === 3) {
    return cloneEnemy(bossEnemy);
  }

  const pool = getEnemiesForStage(stage);
  const selected =
    pool.find((enemy) => enemy.id === enemyId) ??
    pool[Math.floor(random() * pool.length)] ??
    pool[0];

  return cloneEnemy(selected);
}

export function cloneEnemy(enemy: Enemy): Enemy {
  return {
    ...enemy,
    traits: [...enemy.traits],
    actionDeck: enemy.actionDeck.map((action) => ({ ...action })),
    actions: enemy.actions.map((action) => ({ ...action })),
  };
}

function getStageTitle(stage: EnemyStage) {
  if (stage === 1) {
    return "第一關";
  }

  if (stage === 2) {
    return "第二關";
  }

  return "第三關";
}

function getEnemyIntro(title: string, enemyName: string, description: string) {
  if (enemyName === "呂布") {
    return `${title}｜呂布現身：${description}`;
  }

  return `${title}｜${enemyName}登場：${description}`;
}
