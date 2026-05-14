import type { GamePhase } from "./types";

export const currentVersionLabel = "v0.24.0 完整體驗 QA 修正版";

export const gameLoadingCopy = {
  title: "戰局準備中……",
  description: "正在生成本局敵人與初始手牌。",
} as const;

export const homeMainFlowSteps = [
  "觀看開場動畫",
  "選擇武將",
  "開始遊戲",
] as const;

export const homeOpeningVideoEntry = {
  title: "開場動畫",
  description: "觀看第一章：黃巾亂起 的 20 秒直式開場動畫",
  primaryAction: "觀看開場動畫",
} as const;

export const homeHeroSelectionCopy =
  "選擇一位角色，踏入第一章：黃巾之亂。第一章已完成文、圖、聲、影整合，後續將補齊卡牌插圖與挑戰模式。";

export const homeHeroPreviewCopy = "開啟角色語音後，點選武將可試聽專屬選角語音。";

export const homeAuthorCopy =
  "本作品由李詩民以 AI 協作流程打造，整合文、圖、聲、影與互動遊戲開發。";

export const routeSelectionCopy = {
  title: "選擇路線",
  description: "三條路線代表不同遭遇與資源方向，敵人難度不再直接由路線決定。",
} as const;

export const openingVideoModalActions = [
  "略過動畫，開始遊戲",
  "開始遊戲",
  "重新播放",
] as const;

export const howToSteps = [
  {
    title: "選擇武將",
    text: "關羽、趙雲、諸葛亮與彩蛋角色李詩民，各有不同玩法。",
  },
  {
    title: "進入戰鬥",
    text: "使用手牌攻擊、防守、回血或發動策略。",
  },
  {
    title: "擊敗敵人",
    text: "第一章共有 8 關，最後在虎牢關前挑戰呂布。",
  },
  {
    title: "遇見事件",
    text: "戰鬥後可能觸發補給、策略或危險事件。",
  },
  {
    title: "選擇獎勵",
    text: "戰後三選一強化，提升後續戰鬥能力。",
  },
  {
    title: "選擇路線",
    text: "山道、官道、險道代表不同劇情與資源方向，而不是固定難度倍率。",
  },
] as const;

export const mobileGameplaySections = [
  "手機戰鬥 HUD",
  "底部手牌操作區",
  "戰鬥紀錄收合",
  "狀態與設定收合",
  "事件 / 獎勵 / 路線選擇優化",
] as const;

export const homeCollapsibleSections = [
  {
    id: "how-to",
    title: "怎麼玩？展開教學",
  },
] as const;

export const heroIntroAudioKeys = {
  "guan-yu": "guan-yu-intro",
  "zhao-yun": "zhao-yun-intro",
  "zhuge-liang": "zhuge-liang-intro",
  "li-shimin-ai-architect": "li-shimin-intro",
} as const;

export const heroPreviewAudioKeys = {
  "guan-yu": "guan-yu-preview",
  "zhao-yun": "zhao-yun-preview",
  "zhuge-liang": "zhuge-liang-preview",
  "li-shimin-ai-architect": "li-shimin-preview",
} as const;

export function getHeroIntroAudioKey(heroId: string) {
  return heroIntroAudioKeys[heroId as keyof typeof heroIntroAudioKeys];
}

export function getHeroPreviewAudioKey(heroId: string) {
  return heroPreviewAudioKeys[heroId as keyof typeof heroPreviewAudioKeys];
}

export function getHeroStartLabel(heroName: string) {
  return `以${heroName}開始遊戲`;
}

export const quickRules = [
  "每回合開始會抽牌。",
  "使用卡牌後，可能造成傷害、回血、抽牌或改變狀態。",
  "按「結束回合」後，敵人會行動。",
  "擊敗敵人後，可能遇到事件，再選擇戰後獎勵。",
  "選擇路線後，進入下一關。",
  "第 8 關擊敗呂布即可通關。",
] as const;

export function getPhaseHint(phase: GamePhase) {
  if (phase === "defense") {
    return "敵人正在攻擊，你可以使用閃或相關技能抵消，也可以選擇承受傷害。";
  }

  if (phase === "reward") {
    return "選擇一項戰後強化，它會影響後續整局戰鬥。";
  }

  if (phase === "event") {
    return "事件會帶來補給、策略或風險，請選擇你的處理方式。";
  }

  if (phase === "route") {
    return "選擇下一條路線。山道偏生存補給，官道偏情報穩定，險道偏奇遇與代價。";
  }

  if (phase === "routeEvent") {
    return "處理路線事件。不同路線會帶來補給、情報、支援或稀有奇遇。";
  }

  if (phase === "observe") {
    return "諸葛亮發動觀星，選擇一張你最需要的牌加入手牌。";
  }

  return "先觀察敵人狀態，再決定使用攻擊、防禦、回復或策略卡。準備好了就按結束回合。";
}
