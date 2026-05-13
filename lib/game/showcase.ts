import type { GamePhase } from "./types";

export const currentVersionLabel = "v0.15.1 第一輪平衡微調版";

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

export const homeHeroSelectionCopy = "先選擇你的武將，再開始遊戲。";

export const openingVideoModalActions = [
  "略過動畫，開始遊戲",
  "開始遊戲",
  "重新播放",
] as const;

export const howToSteps = [
  {
    title: "選擇武將",
    text: "關羽、趙雲、諸葛亮，各有不同玩法。",
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
    text: "山道較安全，險道更危險但報酬更高。",
  },
] as const;

export const currentFeatureHighlights = [
  "三位可選武將：關羽、趙雲、諸葛亮",
  "第一章 8 關流程",
  "31 張玩家牌組",
  "戰術卡：連斬、固守、激勵、火攻",
  "裝備系統：青龍偃月刀、的盧馬、太平要術",
  "第一批 AI 圖像：首頁主視覺、關羽、趙雲、諸葛亮",
  "第二批敵人圖像：黃巾兵、山賊頭目、西涼騎兵、呂布",
  "第一批關卡背景：荒村初戰、虎牢關前",
  "視覺呈現優化：首頁、武將、敵人、Boss 與關卡背景手機版顯示",
  "人物台詞系統：武將台詞、敵人登場、章節旁白與勝敗旁白",
  "第一版音效系統：Web Audio API 提示音、手動開關與本機設定保存",
  "TTS 配音素材規劃：為角色語音與開場旁白做準備",
  "語音播放框架：已建立 audioKey 對應與未來 TTS 音檔播放機制",
  "第一批 TTS 語音：章節開場、三位武將登場與呂布登場",
  "開頭動畫：以 AI 圖像、影片與音樂製作第一章開場",
  "手機遊玩優化：戰鬥 HUD、底部手牌操作區、紀錄與設定收合",
  "首頁互動修正：武將試聽登場語音、開場動畫入口上移、教學與特色收合",
  "開場動畫體驗：一次點擊全螢幕播放、可略過、可關閉、可重播",
  "首頁主流程：觀看開場動畫 → 選擇武將 → 開始遊戲",
  "卡牌音效系統：不同類型卡牌可對應不同音效",
  "真實卡牌音效：斬、連斬、防禦、回復、策略、裝備、火攻 MP3 已導入",
  "戰鬥平衡分析：使用模擬工具分析武將勝率與關卡難度",
  "第一輪平衡微調：諸葛亮 HP 提升至 4、呂布 HP 提升至 14，並保留第 2～3 關敵人數值",
  "Hydration 修正：/game 隨機戰局初始化改為 client mounted 後執行",
  "視覺資產 placeholder：角色、敵人、關卡、事件、路線與卡牌",
  "Mini-boss 張梁 / 張寶",
  "隨機事件與路線選擇",
  "第 1～7 關依關卡敵人池隨機，第 8 關挑戰呂布",
  "可完整通關、失敗重來",
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
  {
    id: "features",
    title: "查看目前版本特色",
  },
] as const;

export const heroIntroAudioKeys = {
  "guan-yu": "guan-yu-intro",
  "zhao-yun": "zhao-yun-intro",
  "zhuge-liang": "zhuge-liang-intro",
} as const;

export function getHeroIntroAudioKey(heroId: string) {
  return heroIntroAudioKeys[heroId as keyof typeof heroIntroAudioKeys];
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
    return "選擇下一條路線。風險越高，下一戰越難，但可能獲得更好報酬。";
  }

  if (phase === "observe") {
    return "諸葛亮發動觀星，選擇一張你最需要的牌加入手牌。";
  }

  return "先觀察敵人狀態，再決定使用攻擊、防禦、回復或策略卡。準備好了就按結束回合。";
}
