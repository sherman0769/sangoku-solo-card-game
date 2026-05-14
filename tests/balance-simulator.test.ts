import { describe, expect, it } from "vitest";
import { generateBalanceReport } from "@/lib/game/balanceReport";
import { chooseBasicSafeRoute, simulateManyRuns, simulateRun } from "@/lib/game/balanceSimulator";
import { createGame } from "@/lib/game/engine";
import { stageRoutes } from "@/lib/game/routes";
import { createSeededRandom } from "@/lib/game/seededRandom";

describe("battle balance simulator", () => {
  it("creates reproducible seeded random sequences", () => {
    const first = createSeededRandom("same-seed");
    const second = createSeededRandom("same-seed");

    expect([first(), first(), first()]).toEqual([second(), second(), second()]);
  });

  it("simulates one Guan Yu run with required result fields", () => {
    const result = simulateRun({
      heroId: "guan-yu",
      seed: "guan-yu-test",
      maxTurns: 180,
      strategy: "basic-safe-strategy",
    });

    expect(result.heroId).toBe("guan-yu");
    expect(result.mode).toBe("normal");
    expect(typeof result.won).toBe("boolean");
    expect(result.finalStage).toBeGreaterThanOrEqual(1);
    expect(result.turnsTaken).toBeGreaterThan(0);
    expect(result.enemiesEncountered.length).toBeGreaterThan(0);
    expect(Array.isArray(result.routeEventsEncountered)).toBe(true);
    expect(Array.isArray(result.bossTraitTriggers)).toBe(true);
    expect(result.enemyHealTriggers).toBeGreaterThanOrEqual(0);
  });

  it("summarizes multiple runs for all heroes", () => {
    const summary = simulateManyRuns({
      heroIds: ["guan-yu", "zhao-yun", "zhuge-liang", "li-shimin-ai-architect"],
      runsPerHero: 2,
      seed: "summary-test",
      maxTurns: 180,
      strategy: "basic-safe-strategy",
    });

    expect(summary.totalRuns).toBe(8);
    expect(summary.perModeStats.normal?.totalRuns).toBe(8);
    expect(Object.keys(summary.perHeroStats)).toEqual([
      "guan-yu",
      "zhao-yun",
      "zhuge-liang",
      "li-shimin-ai-architect",
    ]);
    expect(summary.overallWinRate).toBeGreaterThanOrEqual(0);
    expect(summary.averageTurns).toBeGreaterThan(0);
    expect(summary.routeEventStats).toBeDefined();
    expect(summary.routeDecisionStats).toBeDefined();
    expect(summary.bossTraitStats).toBeDefined();
    expect(summary.enemyHealTriggerCount).toBeGreaterThanOrEqual(0);
  });

  it("generates a Traditional Chinese Markdown report", () => {
    const summary = simulateManyRuns({
      heroIds: ["guan-yu", "zhao-yun", "zhuge-liang", "li-shimin-ai-architect"],
      runsPerHero: 2,
      seed: "report-test",
      maxTurns: 180,
      strategy: "basic-safe-strategy",
    });
    const report = generateBalanceReport(summary);

    expect(report).toContain("# v0.15.0 戰鬥平衡分析報告");
    expect(report).toContain("各武將統計");
    expect(report).toContain("建議調整方向");
  });

  it("generates the v0.17.1 boss presentation balance report sections", () => {
    const summary = simulateManyRuns({
      heroIds: ["guan-yu", "zhao-yun", "zhuge-liang", "li-shimin-ai-architect"],
      runsPerHero: 2,
      seed: "report-v0171-test",
      maxTurns: 180,
      strategy: "basic-safe-strategy",
    });
    const report = generateBalanceReport(summary, {
      title: "# v0.17.1 Boss 戰體驗強化平衡報告",
      preAdjustmentSummary: ["v0.17.0 整體勝率 96.7%。"],
      adjustments: ["Boss 特性觸發呈現強化。"],
      goalAssessment: ["本輪觀察 Boss 特性觸發分佈。"],
    });

    expect(report).toContain("# v0.17.1 Boss 戰體驗強化平衡報告");
    expect(report).toContain("調整前摘要");
    expect(report).toContain("調整內容");
    expect(report).toContain("路線風格決策分佈");
    expect(report).toContain("路線事件分佈");
    expect(report).toContain("Boss 特性觸發次數");
    expect(report).toContain("敵人回血觸發次數");
    expect(report).toContain("是否達到平衡目標");
  });

  it("tracks enemy heal triggers for v0.25.0 balance reports", () => {
    const summary = simulateManyRuns({
      heroIds: ["guan-yu"],
      runsPerHero: 2,
      seed: "enemy-heal-report-test",
      maxTurns: 240,
      strategy: "basic-safe-strategy",
    });
    const report = generateBalanceReport(summary, {
      title: "# v0.25.0 強化回饋與敵人行動升級平衡報告",
      adjustments: ["張寶新增回復行動。"],
    });

    expect(summary.enemyHealTriggerCount).toBeGreaterThanOrEqual(0);
    expect(report).toContain("敵人回血");
    expect(report).toContain("v0.25.0");
  });

  it("supports normal and challenge mode balance comparisons", () => {
    const summary = simulateManyRuns({
      heroIds: ["guan-yu", "zhao-yun"],
      runsPerHero: 1,
      modes: ["normal", "challenge"],
      seed: "mode-balance-test",
      maxTurns: 200,
      strategy: "basic-safe-strategy",
    });
    const report = generateBalanceReport(summary, {
      title: "# v0.26.0 挑戰模式平衡報告",
    });

    expect(summary.totalRuns).toBe(4);
    expect(summary.perModeStats.normal?.totalRuns).toBe(2);
    expect(summary.perModeStats.challenge?.totalRuns).toBe(2);
    expect(summary.results.some((result) => result.mode === "challenge")).toBe(true);
    expect(report).toContain("模式比較");
    expect(report).toContain("普通模式");
    expect(report).toContain("挑戰模式");
  });

  it("chooses routes by health and state for basic-safe-strategy", () => {
    const lowHealthState = {
      ...createGame("guan-yu"),
      player: { ...createGame("guan-yu").player, health: 2 },
    };
    const mediumHealthState = {
      ...createGame("guan-yu"),
      player: { ...createGame("guan-yu").player, health: 4 },
    };
    const healthyButPlainState = {
      ...createGame("guan-yu"),
      player: { ...createGame("guan-yu").player, health: 5 },
    };
    const healthyUpgradedState = {
      ...createGame("guan-yu"),
      player: { ...createGame("guan-yu").player, health: 5 },
      playerUpgrades: { ...createGame("guan-yu").playerUpgrades, slashDamageBonus: 1 },
    };

    expect(chooseBasicSafeRoute(stageRoutes, lowHealthState).id).toBe("mountain-path");
    expect(chooseBasicSafeRoute(stageRoutes, mediumHealthState).id).toBe("official-road");
    expect(chooseBasicSafeRoute(stageRoutes, healthyButPlainState).id).toBe("official-road");
    expect(chooseBasicSafeRoute(stageRoutes, healthyUpgradedState).id).toBe("dangerous-pass");
  });

  it("uses maxTurns to prevent endless simulations", () => {
    const result = simulateRun({
      heroId: "zhuge-liang",
      seed: "tiny-max-turns",
      maxTurns: 1,
      strategy: "basic-safe-strategy",
    });

    expect(result.won).toBe(false);
    expect(result.defeatReason).toContain("超過 1 步仍未結束");
  });
});
