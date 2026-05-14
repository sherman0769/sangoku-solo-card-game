import { describe, expect, it } from "vitest";
import {
  getRewardFeedbackSubtitle,
  getUpgradeBadges,
  getUpgradeSummary,
} from "@/lib/game/upgradeDisplay";

describe("upgrade display helpers", () => {
  it("shows slash damage upgrades as short HUD badges", () => {
    const badges = getUpgradeBadges({
      maxHpBonus: 0,
      startingDrawBonus: 0,
      slashDamageBonus: 1,
      strategyDrawBonus: 0,
      armorBreakDamageBonus: 0,
    });

    expect(badges.map((badge) => badge.shortLabel)).toContain("斬+1");
  });

  it("shows max health upgrades as short HUD badges", () => {
    const summary = getUpgradeSummary({
      maxHpBonus: 1,
      startingDrawBonus: 0,
      slashDamageBonus: 0,
      strategyDrawBonus: 0,
      armorBreakDamageBonus: 0,
    });

    expect(summary.shortLabels).toContain("體力+1");
    expect(summary.fullLabels).toContain("最大體力 +1");
  });

  it("shows strategy draw upgrades as short HUD badges", () => {
    const summary = getUpgradeSummary({
      maxHpBonus: 0,
      startingDrawBonus: 0,
      slashDamageBonus: 0,
      strategyDrawBonus: 1,
      armorBreakDamageBonus: 0,
    });

    expect(summary.shortLabels).toContain("兵書+1");
  });

  it("returns an empty list when there are no upgrades", () => {
    const summary = getUpgradeSummary({
      maxHpBonus: 0,
      startingDrawBonus: 0,
      slashDamageBonus: 0,
      strategyDrawBonus: 0,
      armorBreakDamageBonus: 0,
    });

    expect(summary.hasUpgrades).toBe(false);
    expect(summary.shortLabels).toEqual([]);
  });

  it("provides concise reward feedback subtitles", () => {
    expect(getRewardFeedbackSubtitle({ id: "slash-damage", name: "強化斬", text: "" })).toBe(
      "斬傷害 +1",
    );
    expect(getRewardFeedbackSubtitle({ id: "max-health", name: "最大體力 +1", text: "" })).toBe(
      "最大體力 +1",
    );
  });
});
