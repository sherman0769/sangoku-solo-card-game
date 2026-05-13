import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { generateBalanceReport } from "../lib/game/balanceReport";
import { simulateManyRuns } from "../lib/game/balanceSimulator";

const reportPath = resolve("docs/balance-report-v0.15.2.md");

async function main() {
  const summary = simulateManyRuns({
    heroIds: ["guan-yu", "zhao-yun", "zhuge-liang"],
    runsPerHero: 50,
    seed: "v0.15.2-balance",
    maxTurns: 360,
    strategy: "basic-safe-strategy",
  });

  const report = generateBalanceReport(summary, {
    title: "# v0.15.2 後期難度微調報告",
    preAdjustmentSummary: [
      "v0.15.1 共模擬 150 局：關羽 100%、趙雲 100%、諸葛亮 94%，整體勝率 98%。",
      "死亡最多集中於第 3 關 2 次，第 8 關 1 次；第 2～3 關不再加壓。",
    ],
    adjustments: [
      "張梁最大體力 9 → 10。",
      "張寶最大體力 8 → 9。",
      "呂布最大體力維持 14，actionDeck 增加 1 張猛攻。",
      "未調整三位武將、玩家牌組、第 1～6 關敵人、獎勵、路線或事件。",
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
    `第 7～8 關死亡合計 ${getLateStageDeaths(summary)} 次，可和 v0.15.1 的第 8 關 1 次比較。`,
    summary.overallWinRate > 0.8
      ? "整體勝率仍偏高，本輪只提高第 7～8 關壓力，避免同步強化第 1～6 關。"
      : "整體勝率已下降到較可觀察區間，本輪微調達到提高後期壓力的初步目的。",
  ];
}

function formatPercent(value: number) {
  return `${Math.round(value * 1000) / 10}%`;
}

function getLateStageDeaths(summary: ReturnType<typeof simulateManyRuns>) {
  return (summary.stageDeathDistribution["第 7 關"] ?? 0) + (summary.stageDeathDistribution["第 8 關"] ?? 0);
}
