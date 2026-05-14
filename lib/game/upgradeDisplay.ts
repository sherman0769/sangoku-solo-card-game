import type { GameState, PlayerUpgrades, Reward } from "./types";

export interface UpgradeBadge {
  id: keyof PlayerUpgrades;
  shortLabel: string;
  fullLabel: string;
  value: number;
}

const upgradeDefinitions: Array<{
  id: keyof PlayerUpgrades;
  shortName: string;
  fullName: string;
}> = [
  {
    id: "maxHpBonus",
    shortName: "體力",
    fullName: "最大體力",
  },
  {
    id: "startingDrawBonus",
    shortName: "開局",
    fullName: "每關開始抽牌",
  },
  {
    id: "slashDamageBonus",
    shortName: "斬",
    fullName: "斬傷害",
  },
  {
    id: "strategyDrawBonus",
    shortName: "兵書",
    fullName: "兵書抽牌",
  },
  {
    id: "armorBreakDamageBonus",
    shortName: "破甲",
    fullName: "破甲追加傷害",
  },
];

export function getUpgradeBadges(input: GameState | PlayerUpgrades): UpgradeBadge[] {
  const upgrades = "playerUpgrades" in input ? input.playerUpgrades : input;

  return upgradeDefinitions
    .map((definition) => {
      const value = upgrades[definition.id] ?? 0;

      if (value <= 0) {
        return null;
      }

      return {
        id: definition.id,
        shortLabel: `${definition.shortName}+${value}`,
        fullLabel: `${definition.fullName} +${value}`,
        value,
      };
    })
    .filter((badge): badge is UpgradeBadge => Boolean(badge));
}

export function getUpgradeSummary(input: GameState | PlayerUpgrades) {
  const badges = getUpgradeBadges(input);

  return {
    badges,
    shortLabels: badges.map((badge) => badge.shortLabel),
    fullLabels: badges.map((badge) => badge.fullLabel),
    hasUpgrades: badges.length > 0,
  };
}

export function getRewardFeedbackSubtitle(reward: Pick<Reward, "id" | "name" | "text">) {
  if (reward.id === "max-health") {
    return "最大體力 +1";
  }

  if (reward.id === "starting-draw") {
    return "開局多抽 1 張";
  }

  if (reward.id === "slash-damage") {
    return "斬傷害 +1";
  }

  if (reward.id === "strategy-draw") {
    return "兵書抽牌 +1";
  }

  if (reward.id === "armor-break-damage") {
    return "破甲追加傷害 +1";
  }

  return reward.name || reward.text;
}
