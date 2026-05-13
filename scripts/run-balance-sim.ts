import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { generateBalanceReport } from "../lib/game/balanceReport";
import { simulateManyRuns } from "../lib/game/balanceSimulator";

const reportPath = resolve("docs/balance-report-v0.15.1.md");

async function main() {
  const summary = simulateManyRuns({
    heroIds: ["guan-yu", "zhao-yun", "zhuge-liang"],
    runsPerHero: 50,
    seed: "v0.15.1-balance",
    maxTurns: 360,
    strategy: "basic-safe-strategy",
  });

  const report = generateBalanceReport(summary, {
    title: "# v0.15.1 第一輪平衡微調報告",
    preAdjustmentSummary: [
      "v0.15.0 共模擬 150 局：關羽 100%、趙雲 100%、諸葛亮 78%，整體勝率 92.7%。",
      "死亡最多集中於第 2 關與第 3 關，各 5 次，早期關卡已具壓力。",
    ],
    adjustments: [
      "諸葛亮最大體力 3 → 4，補強 8 關流程中的前中期容錯。",
      "呂布最大體力 12 → 14，小幅提高最終 Boss 耐久。",
      "未調整關羽、趙雲、玩家牌組、第 2～3 關敵人、獎勵、路線或事件。",
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
    gap <= 0.15
      ? "三位武將勝率已初步接近，後續可用更高局數驗證。"
      : "三位武將勝率仍有明顯落差，後續應繼續觀察最低勝率武將或高勝率武將。",
    summary.overallWinRate > 0.8
      ? "整體勝率仍偏高，本輪只先提高最終 Boss 耐久，避免同步強化第 2～3 關。"
      : "整體勝率已下降到較可觀察區間，本輪微調達到降低後期壓力不足的初步目的。",
  ];
}

function formatPercent(value: number) {
  return `${Math.round(value * 1000) / 10}%`;
}
