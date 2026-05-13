import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { generateBalanceReport } from "../lib/game/balanceReport";
import { simulateManyRuns } from "../lib/game/balanceSimulator";

const reportPath = resolve("docs/balance-report-v0.16.0.md");

async function main() {
  const summary = simulateManyRuns({
    heroIds: ["guan-yu", "zhao-yun", "zhuge-liang"],
    runsPerHero: 50,
    seed: "v0.16.0-balance",
    maxTurns: 360,
    strategy: "basic-safe-strategy",
  });

  const report = generateBalanceReport(summary, {
    title: "# v0.16.0 路線劇情事件平衡報告",
    preAdjustmentSummary: [
      "v0.15.2 共模擬 150 局：關羽 100%、趙雲 100%、諸葛亮 98%，整體勝率 99.3%。",
      "死亡最多集中於第 3 關 1 次，第 7～8 關死亡沒有增加。",
    ],
    adjustments: [
      "路線流程調整為戰後獎勵 → 路線選擇 → 路線事件 → 下一關。",
      "新增山道、官道、險道各 3 個專屬路線事件。",
      "山道 / 官道 / 險道不再固定套用敵人 HP 或獎勵選項修正，改由路線事件決定。",
      "未調整三位武將、玩家牌組、裝備、戰術卡、第 1～8 關敵人數值。",
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
