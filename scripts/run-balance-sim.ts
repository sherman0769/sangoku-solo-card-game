import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { generateBalanceReport } from "../lib/game/balanceReport";
import { simulateManyRuns } from "../lib/game/balanceSimulator";

const reportPath = resolve("docs/balance-report-v0.23.0.md");

async function main() {
  const summary = simulateManyRuns({
    heroIds: ["guan-yu", "zhao-yun", "zhuge-liang", "li-shimin-ai-architect"],
    runsPerHero: 50,
    seed: "v0.23.0-balance",
    maxTurns: 360,
    strategy: "basic-safe-strategy",
  });

  const report = generateBalanceReport(summary, {
    title: "# v0.23.0 第四位彩蛋角色平衡報告",
    preAdjustmentSummary: [
      "v0.22.2 以前共有三位武將：關羽、趙雲、諸葛亮。",
      "v0.23.0 新增彩蛋角色李詩民｜AI 架構師，先觀察架構推演對策略牌與路線事件的穩定度影響。",
    ],
    adjustments: [
      "新增第四位可選角色李詩民｜AI 架構師，最大體力 4。",
      "架構推演：每回合第一次使用策略牌時抽 1 張；處理路線事件後，下一場戰鬥第一回合內首次策略牌額外回復 1 點體力。",
      "本次不調整第 1～8 關敵人、Boss 特性、玩家牌組、路線事件、獎勵系統與模擬策略。",
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
    `四位角色勝率差距為 ${formatPercent(gap)}。`,
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
