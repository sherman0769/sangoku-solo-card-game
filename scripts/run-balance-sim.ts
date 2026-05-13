import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { generateBalanceReport } from "../lib/game/balanceReport";
import { simulateManyRuns } from "../lib/game/balanceSimulator";

const reportPath = resolve("docs/balance-report-v0.17.0.md");

async function main() {
  const summary = simulateManyRuns({
    heroIds: ["guan-yu", "zhao-yun", "zhuge-liang"],
    runsPerHero: 50,
    seed: "v0.17.0-balance",
    maxTurns: 360,
    strategy: "basic-safe-strategy",
  });

  const report = generateBalanceReport(summary, {
    title: "# v0.17.0 Boss 特性系統平衡報告",
    preAdjustmentSummary: [
      "v0.16.2 共模擬 150 局：關羽 100%、趙雲 100%、諸葛亮 100%，整體勝率 100%。",
      "路線已改為風格選擇，但第一章尾王壓力仍不足。",
    ],
    adjustments: [
      "呂布新增 Boss 特性：無雙壓迫，第一次猛攻第二段傷害 +1。",
      "呂布新增 Boss 特性：戰神回血，首次降到半血以下時回復 3 點體力。",
      "本次不調整第 1～7 關敵人、三位武將、玩家牌組、路線事件與獎勵系統。",
    ],
    goalAssessment: createGoalAssessment(summary),
  });

  await mkdir(dirname(reportPath), { recursive: true });
  await writeFile(reportPath, report, "utf-8");

  console.log(report);
  console.log(`\n報告已輸出：${reportPath}`);
}

void main();

function createGoalAssessment(summary: ReturnType<typeof simulateManyRuns>) {
  const winRates = Object.values(summary.perHeroStats).map((stats) => stats.winRate);
  const highestWinRate = Math.max(...winRates);
  const lowestWinRate = Math.min(...winRates);
  const gap = highestWinRate - lowestWinRate;

  return [
    `調整後整體勝率為 ${formatPercent(summary.overallWinRate)}。`,
    `三位武將勝率差距為 ${formatPercent(gap)}。`,
    `路線事件共觸發 ${getTotalRouteEvents(summary)} 次。`,
    `Boss 特性觸發統計：${formatBossTraitStats(summary)}。`,
    `低血量選山道 ${summary.routeDecisionStats["低血量｜山道"] ?? 0} 次；中等血量選官道 ${summary.routeDecisionStats["中等血量｜官道"] ?? 0} 次；高血量狀態好選險道 ${summary.routeDecisionStats["高血量｜險道"] ?? 0} 次。`,
    summary.overallWinRate > 0.8
      ? "整體勝率仍偏高，需觀察呂布 Boss 特性是否需要再加強或加入第二階段行動。"
      : "整體勝率已下降到較可觀察區間，可繼續觀察第 8 關死亡與 Boss 特性觸發頻率。",
  ];
}

function formatPercent(value: number) {
  return `${Math.round(value * 1000) / 10}%`;
}

function getTotalRouteEvents(summary: ReturnType<typeof simulateManyRuns>) {
  return Object.values(summary.routeEventStats).reduce((total, count) => total + count, 0);
}

function formatBossTraitStats(summary: ReturnType<typeof simulateManyRuns>) {
  const entries = Object.entries(summary.bossTraitStats);

  if (entries.length === 0) {
    return "未觸發";
  }

  return entries.map(([name, count]) => `${name} ${count} 次`).join("、");
}
