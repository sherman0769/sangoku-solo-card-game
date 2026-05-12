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
  },
  {
    stage: 2,
    name: "山道伏兵",
    type: "normal",
    enemyIds: ["yellow-turban-archer", "yellow-turban-brute"],
    flavorText: "山道狹窄，伏兵隱於林間。",
  },
  {
    stage: 3,
    name: "破廟夜戰",
    type: "event-heavy",
    enemyIds: ["yellow-turban-soldier", "bandit-leader"],
    flavorText: "破廟燈火搖曳，敵影在夜色中逼近。",
  },
  {
    stage: 4,
    name: "黑山賊寨",
    type: "elite",
    enemyIds: ["bandit-leader", "black-mountain-general"],
    flavorText: "黑山賊寨盤踞山間，守備森嚴。",
  },
  {
    stage: 5,
    name: "西涼突騎",
    type: "elite",
    enemyIds: ["xiliang-cavalry", "black-mountain-general"],
    flavorText: "馬蹄聲急，西涼騎兵席捲而來。",
  },
  {
    stage: 6,
    name: "古戰場遺跡",
    type: "event-heavy",
    enemyIds: ["yellow-turban-brute", "xiliang-cavalry"],
    flavorText: "古戰場埋藏著舊日兵戈，也藏著未知危機。",
  },
  {
    stage: 7,
    name: "黃巾祭壇",
    type: "mini-boss",
    enemyIds: ["zhang-liang", "zhang-bao"],
    flavorText: "祭壇妖風四起，黃巾殘部正進行詭異儀式。",
  },
  {
    stage: 8,
    name: "虎牢關前",
    type: "boss",
    enemyIds: ["lu-bu"],
    flavorText: "虎牢關前，赤兔嘶鳴，呂布橫戟而立。",
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
