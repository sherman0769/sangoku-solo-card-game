import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { generateBalanceReport } from "../lib/game/balanceReport";
import { simulateManyRuns } from "../lib/game/balanceSimulator";

const reportPath = resolve("docs/balance-report-v0.16.1.md");

async function main() {
  const summary = simulateManyRuns({
    heroIds: ["guan-yu", "zhao-yun", "zhuge-liang"],
    runsPerHero: 50,
    seed: "v0.16.1-balance",
    maxTurns: 360,
    strategy: "basic-safe-strategy",
  });

  const report = generateBalanceReport(summary, {
    title: "# v0.16.1 險道風險再平衡報告",
    preAdjustmentSummary: [
      "v0.16.0 共模擬 150 局：關羽 100%、趙雲 100%、諸葛亮 100%，整體勝率 100%。",
      "basic-safe-strategy 大多選擇險道，絕壁伏擊、古戰場遺物與夜襲敵營出現次數偏高。",
    ],
    adjustments: [
      "絕壁伏擊從失去 1 HP 調整為失去 2 HP，並保留下一次戰後獎勵 +1 選項。",
      "古戰場遺物新增失去 1 HP 代價，仍保留取得未裝備裝備或抽 2 張牌的收益。",
      "夜襲敵營成功門檻從 HP >= 4 提高為 HP >= 5，成功時仍獲得斬傷害 +1。",
      "未調整山道、官道、三位武將、玩家牌組、敵人池與第 1～8 關流程。",
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
    summary.overallWinRate > 0.8
      ? "整體勝率仍偏高，需觀察路線事件是否提供過多收益。"
      : "整體勝率已下降到較可觀察區間，可繼續觀察各路線事件的收益與死亡關聯。",
  ];
}

function formatPercent(value: number) {
  return `${Math.round(value * 1000) / 10}%`;
}

function getTotalRouteEvents(summary: ReturnType<typeof simulateManyRuns>) {
  return Object.values(summary.routeEventStats).reduce((total, count) => total + count, 0);
}
