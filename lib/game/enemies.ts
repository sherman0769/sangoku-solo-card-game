import type { Enemy, EnemyAction, EnemyStage } from "./types";
import { getStageConfig } from "./stages";

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
  const stageConfig = getStageConfig(enemy.stage);

  return {
    ...enemy,
    title,
    intro: getEnemyIntro(title, stageConfig.name, enemy.name, enemy.description),
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
    portrait: "/images/enemies/yellow-turban-soldier.png",
    visualPrompt: "黃巾兵，頭綁黃巾，粗布甲胄與短刀，低階亂軍士兵，三國卡牌敵人立繪",
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
    portrait: "enemy-yellow-turban-archer",
    visualPrompt: "黃巾弓手，黃巾頭帶，彎弓搭箭，敏捷危險的遠程敵人，三國卡牌敵人立繪",
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
    portrait: "enemy-yellow-turban-brute",
    visualPrompt: "黃巾力士，高大壯漢，粗重兵器與黃巾符布，笨重壓迫的三國敵人立繪",
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
    portrait: "/images/enemies/bandit-leader.png",
    visualPrompt: "山賊頭目，皮甲披風，手持大刀，狡詐粗獷的山寨首領，三國卡牌敵人立繪",
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
    portrait: "enemy-black-mountain-general",
    visualPrompt: "黑山賊將，黑旗背後，重甲與盾牌，防守沉穩的精英賊將，三國卡牌敵人立繪",
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
    portrait: "/images/enemies/xiliang-cavalry.png",
    visualPrompt: "西涼騎兵，鐵騎衝鋒，長槍與沙塵，猛烈壓制的三國騎兵敵人立繪",
    actionDeck: [
      actionTemplates.attack2,
      actionTemplates.fierce3,
      actionTemplates.fierce3,
      actionTemplates.charge,
    ],
  }),
  createEnemy({
    id: "zhang-liang",
    name: "張梁",
    stage: 7,
    type: "elite",
    maxHp: 9,
    description: "黃巾三公將軍之一，攻勢猛烈，擅長蓄力後爆發。",
    traits: ["黃巾將領", "蓄力爆發", "猛攻"],
    attack: 3,
    portrait: "enemy-zhang-liang",
    visualPrompt: "張梁，黃巾將領，戰甲與黃巾符咒，蓄力爆發的猛烈攻勢，東方史詩卡牌立繪",
    actionDeck: [
      actionTemplates.attack3,
      actionTemplates.fierce4,
      actionTemplates.charge,
      actionTemplates.charge,
    ],
  }),
  createEnemy({
    id: "zhang-bao",
    name: "張寶",
    stage: 7,
    type: "elite",
    maxHp: 8,
    description: "擅用妖術迷惑敵軍，防守與蓄力能力較強。",
    traits: ["黃巾將領", "妖術", "防守"],
    attack: 2,
    portrait: "enemy-zhang-bao",
    visualPrompt: "張寶，黃巾術士將領，符紙法杖與詭異光芒，妖術防守型敵人，三國卡牌立繪",
    actionDeck: [
      actionTemplates.guard,
      actionTemplates.charge,
      actionTemplates.attack2,
      actionTemplates.guard,
    ],
  }),
  createEnemy({
    id: "lu-bu",
    name: "呂布",
    stage: 8,
    type: "boss",
    maxHp: 14,
    description: "虎牢關前的最終考驗，擁有高壓攻勢與蓄力爆發。",
    traits: ["Boss", "無雙", "猛攻", "蓄力爆發"],
    attack: 3,
    portrait: "/images/enemies/lu-bu.png",
    visualPrompt: "呂布，方天畫戟，赤兔馬，虎牢關前無雙猛將，壓倒性氣勢，東方史詩卡牌 Boss 立繪",
    actionDeck: [
      actionTemplates.attack3,
      actionTemplates.fierce4,
      actionTemplates.charge,
      actionTemplates.guard,
    ],
  }),
];

export const firstStageEnemyPool = getEnemiesForStage(1);
export const secondStageEnemyPool = getEnemiesForStage(2);
export const bossEnemy = enemyPool.find((enemy) => enemy.id === "lu-bu")!;

export const enemies: Enemy[] = [
  ...enemyPool,
];

export function getEnemiesForStage(stage: EnemyStage): Enemy[] {
  const stageConfig = getStageConfig(stage);

  return stageConfig.enemyIds
    .map((enemyId) => enemyPool.find((enemy) => enemy.id === enemyId))
    .filter((enemy): enemy is Enemy => Boolean(enemy));
}

export function selectEnemyForStage(
  stage: EnemyStage,
  enemyId?: string,
  random: () => number = () => 0,
): Enemy {
  const pool = getEnemiesForStage(stage);
  const stageConfig = getStageConfig(stage);
  const selected =
    stageConfig.isFinalBoss
      ? pool[0]
      : (pool.find((enemy) => enemy.id === enemyId) ??
        pool[Math.floor(random() * pool.length)] ??
        pool[0]);

  return cloneEnemyForStage(selected, stage);
}

export function cloneEnemy(enemy: Enemy): Enemy {
  return {
    ...enemy,
    traits: [...enemy.traits],
    actionDeck: enemy.actionDeck.map((action) => ({ ...action })),
    actions: enemy.actions.map((action) => ({ ...action })),
  };
}

function cloneEnemyForStage(enemy: Enemy, stage: EnemyStage): Enemy {
  const next = cloneEnemy(enemy);
  const stageConfig = getStageConfig(stage);
  next.stage = stage;
  next.title = getStageTitle(stage);
  next.intro = getEnemyIntro(next.title, stageConfig.name, next.name, next.description);

  return next;
}

function getStageTitle(stage: EnemyStage) {
  return `第 ${stage} 關`;
}

function getEnemyIntro(title: string, stageName: string, enemyName: string, description: string) {
  if (enemyName === "呂布") {
    return `${title}｜${stageName}｜呂布現身：${description}`;
  }

  return `${title}｜${stageName}｜${enemyName}登場：${description}`;
}
