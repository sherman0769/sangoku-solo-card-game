import type { GameEvent, GameEventId, GameEventType } from "./types";

export const gameEvents: GameEvent[] = [
  {
    id: "village-supply",
    name: "荒村補給",
    description: "你在荒村中找到一些糧草，稍作休整後繼續前進。",
    type: "supply",
    options: [
      {
        id: "rest",
        label: "休整",
        description: "回復 2 點體力，不可超過最大體力。",
        effectType: "heal",
      },
    ],
  },
  {
    id: "strategist-advice",
    name: "軍師獻策",
    description: "一名軍師為你指出戰局破綻，讓你重新整理手牌。",
    type: "strategy",
    options: [
      {
        id: "listen",
        label: "聽取建議",
        description: "抽 2 張牌。",
        effectType: "draw",
      },
    ],
  },
  {
    id: "ambush",
    name: "伏兵突襲",
    description: "你遭遇伏兵突襲，雖然受傷，卻也激發了戰意。",
    type: "danger",
    options: [
      {
        id: "break-through",
        label: "突圍",
        description: "失去 1 點體力，並獲得斬傷害 +1 強化。",
        effectType: "ambush-upgrade",
      },
    ],
  },
];

export function resolveEvent(eventId?: string): GameEvent {
  return gameEvents.find((event) => event.id === eventId) ?? gameEvents[0];
}

export function getEventTypeLabel(type: GameEventType) {
  if (type === "supply") {
    return "補給";
  }

  if (type === "strategy") {
    return "策略";
  }

  return "危險";
}

export function isGameEventId(eventId: string): eventId is GameEventId {
  return gameEvents.some((event) => event.id === eventId);
}
