import { describe, expect, it } from "vitest";
import { generateBalanceReport } from "@/lib/game/balanceReport";
import { simulateManyRuns, simulateRun } from "@/lib/game/balanceSimulator";
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
    expect(typeof result.won).toBe("boolean");
    expect(result.finalStage).toBeGreaterThanOrEqual(1);
    expect(result.turnsTaken).toBeGreaterThan(0);
    expect(result.enemiesEncountered.length).toBeGreaterThan(0);
    expect(Array.isArray(result.routeEventsEncountered)).toBe(true);
  });

  it("summarizes multiple runs for all heroes", () => {
    const summary = simulateManyRuns({
      heroIds: ["guan-yu", "zhao-yun", "zhuge-liang"],
      runsPerHero: 2,
      seed: "summary-test",
      maxTurns: 180,
      strategy: "basic-safe-strategy",
    });

    expect(summary.totalRuns).toBe(6);
    expect(Object.keys(summary.perHeroStats)).toEqual([
      "guan-yu",
      "zhao-yun",
      "zhuge-liang",
    ]);
    expect(summary.overallWinRate).toBeGreaterThanOrEqual(0);
    expect(summary.averageTurns).toBeGreaterThan(0);
    expect(summary.routeEventStats).toBeDefined();
  });

  it("generates a Traditional Chinese Markdown report", () => {
    const summary = simulateManyRuns({
      heroIds: ["guan-yu", "zhao-yun", "zhuge-liang"],
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

  it("generates the v0.16.0 route event report sections", () => {
    const summary = simulateManyRuns({
      heroIds: ["guan-yu", "zhao-yun", "zhuge-liang"],
      runsPerHero: 2,
      seed: "report-v0160-test",
      maxTurns: 180,
      strategy: "basic-safe-strategy",
    });
    const report = generateBalanceReport(summary, {
      title: "# v0.16.0 路線劇情事件平衡報告",
      preAdjustmentSummary: ["v0.15.2 整體勝率 99.3%。"],
      adjustments: ["新增 9 個路線事件。"],
      goalAssessment: ["本輪觀察路線事件分佈。"],
    });

    expect(report).toContain("# v0.16.0 路線劇情事件平衡報告");
    expect(report).toContain("調整前摘要");
    expect(report).toContain("調整內容");
    expect(report).toContain("路線事件分佈");
    expect(report).toContain("是否達到平衡目標");
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
