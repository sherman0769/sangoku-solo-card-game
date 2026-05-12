import type { GameEvent, GameEventId, GameEventType } from "./types";

export const gameEvents: GameEvent[] = [
  {
    id: "village-supply",
    name: "荒村補給",
    description: "你在荒村中找到一些糧草，稍作休整後繼續前進。",
    type: "supply",
    image: "event-village-supply",
    visualPrompt: "荒村糧倉與簡陋補給，殘破木屋中透出暖光，亂世旅途休整場景",
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
    image: "event-strategist-advice",
    visualPrompt: "軍帳內攤開地圖與竹簡，軍師指點戰局，燭光策略氛圍，三國卡牌事件圖",
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
    image: "event-ambush",
    visualPrompt: "林間伏兵突然衝出，箭矢與塵土交錯，危險緊迫的三國事件插圖",
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
