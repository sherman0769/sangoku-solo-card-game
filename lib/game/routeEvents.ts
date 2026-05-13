import type { RouteEvent, RouteEventType, StageRouteId } from "./types";

export const routeEvents: RouteEvent[] = [
  {
    id: "mountain-spring",
    routeId: "mountain-path",
    name: "山泉療傷",
    description: "你在山林深處發現一處清泉，眾人得以稍作休整。",
    type: "supply",
    flavorText: "山風微涼，清泉洗去一路塵煙。",
    options: [
      {
        id: "rest-at-spring",
        label: "取水休整",
        description: "回復 2 點體力，不超過最大體力。",
        effectType: "heal",
        riskLevel: "低",
      },
    ],
  },
  {
    id: "hermit-guidance",
    routeId: "mountain-path",
    name: "隱士指路",
    description: "一名山中隱士指出前方敵軍動向。",
    type: "strategy",
    flavorText: "隱士一語，勝過千軍探報。",
    options: [
      {
        id: "listen-to-hermit",
        label: "聽取指點",
        description: "下一關開始時額外抽 1 張牌。",
        effectType: "next-draw-bonus",
        riskLevel: "低",
      },
    ],
  },
  {
    id: "foggy-trail",
    routeId: "mountain-path",
    name: "迷霧小徑",
    description: "山中霧氣瀰漫，你繞開了主路，卻也迷失了方向。",
    type: "risk",
    flavorText: "你避開了強敵，也失去了一部分準備時間。",
    options: [
      {
        id: "cross-fog",
        label: "穿越迷霧",
        description: "下一關敵人 HP -1，但玩家下一關開始少抽 1 張牌。",
        effectType: "mist-path",
        riskLevel: "中",
      },
    ],
  },
  {
    id: "relay-station",
    routeId: "official-road",
    name: "驛站補給",
    description: "你在官道驛站取得糧草與情報。",
    type: "supply",
    flavorText: "官道雖險，仍有殘存秩序可依。",
    options: [
      {
        id: "prepare-party",
        label: "整備隊伍",
        description: "抽 1 張牌並回復 1 點體力。",
        effectType: "draw-heal",
        riskLevel: "低",
      },
    ],
  },
  {
    id: "urgent-orders",
    routeId: "official-road",
    name: "軍令急報",
    description: "一封殘破軍令揭露了前方敵人的部署。",
    type: "intel",
    flavorText: "知敵先機，勝過一時勇武。",
    options: [
      {
        id: "study-orders",
        label: "研讀軍令",
        description: "下一關敵人 HP 不變，但下一關第一回合玩家額外抽 1 張牌。",
        effectType: "next-draw-bonus",
        riskLevel: "低",
      },
    ],
  },
  {
    id: "remnant-troops",
    routeId: "official-road",
    name: "官軍殘部",
    description: "一支潰散官軍願意協助你一程。",
    type: "support",
    flavorText: "亂世之中，殘兵亦可成勢。",
    options: [
      {
        id: "recruit-remnants",
        label: "收編殘部",
        description: "獲得斬傷害 +1 強化。",
        effectType: "slash-upgrade",
        riskLevel: "中",
      },
    ],
  },
  {
    id: "cliff-ambush",
    routeId: "dangerous-pass",
    name: "絕壁伏擊",
    description: "你在絕壁之間遭遇伏兵，血戰突圍。",
    type: "danger",
    flavorText: "險路藏殺機，也藏著更大的機會。",
    options: [
      {
        id: "force-breakthrough",
        label: "強行突破",
        description: "失去 2 點體力，下一次戰後獎勵 +1 選項。",
        effectType: "reward-bonus-damage",
        riskLevel: "高",
      },
    ],
  },
  {
    id: "battlefield-relic",
    routeId: "dangerous-pass",
    name: "古戰場遺物",
    description: "你在古戰場殘骸中發現一件仍可使用的裝備。",
    type: "rare",
    flavorText: "昔日名將遺物，仍在亂世中閃著寒光。",
    options: [
      {
        id: "search-relic",
        label: "搜尋遺物",
        description: "失去 1 點體力，隨機獲得一件尚未裝備的裝備；若都已裝備，改為抽 2 張牌。",
        effectType: "equipment-or-draw",
        riskLevel: "中",
      },
    ],
  },
  {
    id: "night-raid",
    routeId: "dangerous-pass",
    name: "夜襲敵營",
    description: "你決定趁夜突襲敵營，勝則士氣大振，敗則傷亡慘重。",
    type: "gamble",
    flavorText: "勝負只在一念之間。",
    options: [
      {
        id: "launch-night-raid",
        label: "發動夜襲",
        description: "若目前 HP 大於等於 5，獲得斬傷害 +1；否則失去 1 點體力並抽 1 張牌。",
        effectType: "night-raid",
        riskLevel: "高",
      },
    ],
  },
];

export function getRouteEventsForRoute(routeId: StageRouteId) {
  return routeEvents.filter((event) => event.routeId === routeId);
}

export function resolveRouteEvent(eventId?: string) {
  return routeEvents.find((event) => event.id === eventId) ?? routeEvents[0];
}

export function selectRouteEventForRoute(
  routeId: StageRouteId,
  eventId?: string,
  random: () => number = Math.random,
) {
  const routePool = getRouteEventsForRoute(routeId);
  const forcedEvent = eventId ? routePool.find((event) => event.id === eventId) : undefined;

  if (forcedEvent) {
    return forcedEvent;
  }

  const totalWeight = routePool.reduce((total, event) => total + (event.weight ?? 1), 0);
  let roll = random() * totalWeight;

  for (const event of routePool) {
    roll -= event.weight ?? 1;

    if (roll <= 0) {
      return event;
    }
  }

  return routePool[0];
}

export function getRouteEventTypeLabel(type: RouteEventType) {
  if (type === "supply") {
    return "補給";
  }

  if (type === "strategy") {
    return "策略";
  }

  if (type === "intel") {
    return "情報";
  }

  if (type === "support") {
    return "支援";
  }

  if (type === "rare") {
    return "稀有";
  }

  if (type === "gamble") {
    return "豪賭";
  }

  if (type === "risk") {
    return "風險";
  }

  return "危險";
}
