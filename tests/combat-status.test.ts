import { describe, expect, it } from "vitest";
import {
  getEnemyCombatBadges,
  getEnemyDefeatedFeedbackText,
  getEnemyDefeatedLogText,
  getHpStatus,
  getPlayerCombatBadges,
} from "@/lib/game/combatStatus";
import { createGame } from "@/lib/game/engine";
import { selectEnemyForStage } from "@/lib/game/enemies";

describe("combat status helpers", () => {
  it("classifies full HP as healthy", () => {
    expect(getHpStatus(10, 10)).toBe("healthy");
  });

  it("classifies half HP or below as wounded", () => {
    expect(getHpStatus(5, 10)).toBe("wounded");
  });

  it("classifies 25 percent HP or below as critical", () => {
    expect(getHpStatus(2, 10)).toBe("critical");
  });

  it("classifies zero HP as defeated", () => {
    expect(getHpStatus(0, 10)).toBe("defeated");
  });

  it("includes dying and wounded badges when player HP is 1", () => {
    const state = {
      ...createGame("guan-yu"),
      player: {
        ...createGame("guan-yu").player,
        health: 1,
      },
    };

    expect(getPlayerCombatBadges(state)).toEqual(expect.arrayContaining(["瀕死", "重傷"]));
  });

  it("includes guard badge while player guard is active", () => {
    const base = createGame("guan-yu");
    const state = {
      ...base,
      player: {
        ...base.player,
        guardActive: true,
      },
    };

    expect(getPlayerCombatBadges(state)).toContain("固守中");
  });

  it("includes wounded badge when enemy is at half HP", () => {
    const base = createGame("guan-yu");
    const state = {
      ...base,
      enemyHealth: Math.floor(base.enemy.maxHealth / 2),
    };

    expect(getEnemyCombatBadges(state)).toContain("受創");
  });

  it("includes charge badge when enemy is charged", () => {
    const state = {
      ...createGame("guan-yu"),
      enemyCharged: true,
    };

    expect(getEnemyCombatBadges(state)).toContain("蓄力中");
  });

  it("includes Lu Bu unmatched pressure trigger badge", () => {
    const luBu = selectEnemyForStage(8, "lu-bu");
    const state = {
      ...createGame("guan-yu"),
      enemy: luBu,
      enemyHealth: luBu.maxHealth,
      bossTraitUsage: { "unmatched-pressure": true },
    };

    expect(getEnemyCombatBadges(state)).toEqual(
      expect.arrayContaining(["Boss", "無雙已觸發"]),
    );
  });

  it("includes Lu Bu recovery trigger badge", () => {
    const luBu = selectEnemyForStage(8, "lu-bu");
    const state = {
      ...createGame("guan-yu"),
      enemy: luBu,
      enemyHealth: luBu.maxHealth,
      bossTraitUsage: { "warlord-recovery": true },
    };

    expect(getEnemyCombatBadges(state)).toEqual(
      expect.arrayContaining(["Boss", "回血已觸發"]),
    );
  });

  it("generates enemy defeated feedback copy", () => {
    expect(getEnemyDefeatedFeedbackText("黃巾弓手")).toBe("黃巾弓手敗退！");
    expect(getEnemyDefeatedLogText("黃巾弓手")).toBe("敵將敗退：黃巾弓手");
  });
});
