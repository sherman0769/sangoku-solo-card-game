export type SoundCue =
  | "card-play"
  | "slash"
  | "dodge"
  | "hit"
  | "heal"
  | "draw"
  | "reward"
  | "event"
  | "route"
  | "boss"
  | "victory"
  | "defeat";

export type SoundCueCategory = "card" | "combat" | "recovery" | "progress" | "result";

export interface SoundCueConfig {
  displayName: string;
  category: SoundCueCategory;
  description: string;
}

export const SOUND_CUES = {
  "card-play": {
    displayName: "出牌",
    category: "card",
    description: "使用任何卡牌時的短提示音。",
  },
  slash: {
    displayName: "攻擊",
    category: "combat",
    description: "斬、連斬、火攻等攻擊行為。",
  },
  dodge: {
    displayName: "閃避",
    category: "combat",
    description: "使用閃或趙雲龍膽抵消攻擊。",
  },
  hit: {
    displayName: "受傷",
    category: "combat",
    description: "玩家或敵人受到傷害。",
  },
  heal: {
    displayName: "回復",
    category: "recovery",
    description: "酒、激勵或補給等回血效果。",
  },
  draw: {
    displayName: "抽牌",
    category: "card",
    description: "兵書、觀星或其他抽牌效果。",
  },
  reward: {
    displayName: "獎勵",
    category: "progress",
    description: "選擇戰後強化或獲得裝備回饋。",
  },
  event: {
    displayName: "事件",
    category: "progress",
    description: "事件出現或事件選項結算。",
  },
  route: {
    displayName: "路線",
    category: "progress",
    description: "選擇下一關路線。",
  },
  boss: {
    displayName: "Boss 登場",
    category: "combat",
    description: "呂布等 Boss 登場時的低沉提示音。",
  },
  victory: {
    displayName: "勝利",
    category: "result",
    description: "通關成功或重要勝利回饋。",
  },
  defeat: {
    displayName: "戰敗",
    category: "result",
    description: "戰敗時的下降提示音。",
  },
} satisfies Record<SoundCue, SoundCueConfig>;

export const allSoundCues = Object.keys(SOUND_CUES) as SoundCue[];
