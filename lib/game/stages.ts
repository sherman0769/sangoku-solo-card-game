import type { Chapter, ChapterStageConfig, EnemyStage } from "./types";

export const chapterOne: Chapter = {
  id: "chapter-1",
  name: "第一章：黃巾亂起",
  description: "亂世初起，黃巾餘亂四起，英雄踏上第一段征途。",
};

export const chapterStages: ChapterStageConfig[] = [
  {
    stage: 1,
    name: "荒村初戰",
    type: "normal",
    enemyIds: ["yellow-turban-soldier", "yellow-turban-archer"],
    flavorText: "荒村煙塵未散，黃巾餘黨正在掠奪糧草。",
    backgroundImage: "/images/stages/abandoned-village.png",
    visualPrompt: "荒廢村莊，黃昏煙塵，遠處有黃巾軍影子，三國亂世氛圍，電影感背景",
  },
  {
    stage: 2,
    name: "山道伏兵",
    type: "normal",
    enemyIds: ["yellow-turban-archer", "yellow-turban-brute"],
    flavorText: "山道狹窄，伏兵隱於林間。",
    backgroundImage: "/images/stages/mountain-ambush.png",
    visualPrompt: "狹窄山道，密林伏兵，霧氣與旗影交錯，緊張的三國戰場背景",
  },
  {
    stage: 3,
    name: "破廟夜戰",
    type: "event-heavy",
    enemyIds: ["yellow-turban-soldier", "bandit-leader"],
    flavorText: "破廟燈火搖曳，敵影在夜色中逼近。",
    backgroundImage: "/images/stages/ruined-temple-night.png",
    visualPrompt: "破敗古廟，夜色火光，殘破神像與逼近敵影，懸疑三國亂世背景",
  },
  {
    stage: 4,
    name: "黑山賊寨",
    type: "elite",
    enemyIds: ["bandit-leader", "black-mountain-general"],
    flavorText: "黑山賊寨盤踞山間，守備森嚴。",
    backgroundImage: "/images/stages/black-mountain-camp.png",
    visualPrompt: "山間賊寨，木柵高牆，黑旗與巡邏火把，壓迫感三國山寨背景",
  },
  {
    stage: 5,
    name: "西涼突騎",
    type: "elite",
    enemyIds: ["xiliang-cavalry", "black-mountain-general"],
    flavorText: "馬蹄聲急，西涼騎兵席捲而來。",
    backgroundImage: "/images/stages/xiliang-charge.png",
    visualPrompt: "荒原塵土飛揚，西涼騎兵衝鋒，鐵騎與長槍形成高速壓迫，電影感背景",
  },
  {
    stage: 6,
    name: "古戰場遺跡",
    type: "event-heavy",
    enemyIds: ["yellow-turban-brute", "xiliang-cavalry"],
    flavorText: "古戰場埋藏著舊日兵戈，也藏著未知危機。",
    backgroundImage: "/images/stages/ancient-battlefield.png",
    visualPrompt: "古戰場遺跡，斷戟殘旗，黃昏荒草與沉重雲層，史詩三國背景",
  },
  {
    stage: 7,
    name: "黃巾祭壇",
    type: "mini-boss",
    enemyIds: ["zhang-liang", "zhang-bao"],
    flavorText: "祭壇妖風四起，黃巾殘部正進行詭異儀式。",
    backgroundImage: "/images/stages/yellow-turban-altar.png",
    visualPrompt: "黃巾祭壇，符咒飄動，妖風與火盆環繞，神秘危險的三國術法背景",
  },
  {
    stage: 8,
    name: "虎牢關前",
    type: "boss",
    enemyIds: ["lu-bu"],
    flavorText: "虎牢關前，赤兔嘶鳴，呂布橫戟而立。",
    backgroundImage: "/images/stages/hulao-gate.png",
    visualPrompt: "虎牢關前，雄關巨門，赤兔馬與方天畫戟剪影，最終決戰史詩背景",
    isFinalBoss: true,
  },
];

export const totalStages = chapterStages.length;

export function getStageConfig(stage: EnemyStage): ChapterStageConfig {
  return chapterStages.find((item) => item.stage === stage) ?? chapterStages[0];
}

export function getStageConfigByIndex(index: number): ChapterStageConfig {
  return chapterStages[index] ?? chapterStages[0];
}

export function getEventChanceForStage(stageConfig: ChapterStageConfig) {
  return stageConfig.type === "event-heavy" ? 0.75 : 0.5;
}
