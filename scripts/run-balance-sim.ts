import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { generateBalanceReport } from "../lib/game/balanceReport";
import { simulateManyRuns } from "../lib/game/balanceSimulator";

const reportPath = resolve("docs/balance-report-v0.16.2.md");

async function main() {
  const summary = simulateManyRuns({
    heroIds: ["guan-yu", "zhao-yun", "zhuge-liang"],
    runsPerHero: 50,
    seed: "v0.16.2-balance",
    maxTurns: 360,
    strategy: "basic-safe-strategy",
  });

  const report = generateBalanceReport(summary, {
    title: "# v0.16.2 路線風格平衡報告",
    preAdjustmentSummary: [
      "v0.16.1 共模擬 150 局：關羽 100%、趙雲 100%、諸葛亮 98%，整體勝率 99.3%。",
      "險道選擇降至 886 次，但仍是 basic-safe-strategy 最常選擇的路線。",
    ],
    adjustments: [
      "三條路線改為玩法風格：山道偏生存補給探索、官道偏主線情報穩定、險道偏奇遇稀有代價。",
      "RouteChoice 資料改用 theme、focus、playStyle，不再以 riskLevel 或固定敵人 HP 修正作為 UI 核心。",
      "山泉療傷在玩家 HP <= 2 時額外抽 1 張牌，提高低血量時山道吸引力。",
      "basic-safe-strategy 改為 HP <= 2 選山道、HP 3～4 選官道、HP >= 5 且狀態好才選險道。",
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
    `低血量選山道 ${summary.routeDecisionStats["低血量｜山道"] ?? 0} 次；中等血量選官道 ${summary.routeDecisionStats["中等血量｜官道"] ?? 0} 次；高血量狀態好選險道 ${summary.routeDecisionStats["高血量｜險道"] ?? 0} 次。`,
    summary.overallWinRate > 0.8
      ? "整體勝率仍偏高，需觀察路線風格是否需要進一步削弱收益或提高後期壓力。"
      : "整體勝率已下降到較可觀察區間，可繼續觀察各路線事件的收益與死亡關聯。",
  ];
}

function formatPercent(value: number) {
  return `${Math.round(value * 1000) / 10}%`;
}

function getTotalRouteEvents(summary: ReturnType<typeof simulateManyRuns>) {
  return Object.values(summary.routeEventStats).reduce((total, count) => total + count, 0);
}
