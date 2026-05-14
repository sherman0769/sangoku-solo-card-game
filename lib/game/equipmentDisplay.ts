import type { Card } from "./types";

export interface EquippedItemBadge {
  id: string;
  fullLabel: string;
  shortLabel: string;
  effectLabel: string;
}

const equipmentBadgeDefinitions: Record<string, EquippedItemBadge> = {
  青龍偃月刀: {
    id: "green-dragon-blade",
    fullLabel: "青龍偃月刀：每回合首次斬 +1",
    shortLabel: "青龍｜斬+1",
    effectLabel: "斬+1",
  },
  的盧馬: {
    id: "dilu-horse",
    fullLabel: "的盧馬：每場首次受攻擊自動閃避",
    shortLabel: "的盧｜首閃",
    effectLabel: "首閃",
  },
  太平要術: {
    id: "taiping-manual",
    fullLabel: "太平要術：每回合首次兵書額外抽 1 張",
    shortLabel: "太平｜兵書+1",
    effectLabel: "兵書+1",
  },
};

export const secondaryBattleActionCopy = {
  title: "更多操作",
  restart: "重新開始本局",
  home: "返回首頁",
} as const;

export const mobilePrimaryBattleActionLabels = [
  "手牌",
  "結束回合",
  "使用閃",
  "以斬作閃",
  "承受傷害",
  "請選擇一項繼續",
] as const;

export function getEquippedItemBadges(
  equippedItems: readonly Pick<Card, "name">[],
): EquippedItemBadge[] {
  return equippedItems
    .map((item) => equipmentBadgeDefinitions[item.name])
    .filter((badge): badge is EquippedItemBadge => Boolean(badge));
}

export function getEquippedItemFullLabels(
  equippedItems: readonly Pick<Card, "name">[],
): string[] {
  const badges = getEquippedItemBadges(equippedItems);

  if (badges.length === 0) {
    return ["尚未裝備"];
  }

  return badges.map((badge) => badge.fullLabel);
}

export function getEquippedItemShortLabels(
  equippedItems: readonly Pick<Card, "name">[],
): string[] {
  return getEquippedItemBadges(equippedItems).map((badge) => badge.shortLabel);
}
