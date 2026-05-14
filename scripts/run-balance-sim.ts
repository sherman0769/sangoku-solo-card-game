import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { generateBalanceReport } from "../lib/game/balanceReport";
import { simulateManyRuns } from "../lib/game/balanceSimulator";

const reportPath = resolve("docs/balance-report-v0.25.0.md");

async function main() {
  const summary = simulateManyRuns({
    heroIds: ["guan-yu", "zhao-yun", "zhuge-liang", "li-shimin-ai-architect"],
    runsPerHero: 50,
    seed: "v0.25.0-balance",
    maxTurns: 360,
    strategy: "basic-safe-strategy",
  });

  const report = generateBalanceReport(summary, {
    title: "# v0.25.0 強化回饋與敵人行動升級平衡報告",
    preAdjustmentSummary: [
      "v0.24.4 已完成首頁到遊戲頁 BGM 延續、卡牌圖與手機戰鬥 UX 基礎修正。",
      "本次以小幅方式提高後期敵人耐久，並讓張寶新增回復行動，觀察第 7～8 關節奏是否更穩定。",
    ],
    adjustments: [
      "第 5～7 關敵人 clone 進場時最大體力 +1，第 8 關 Boss 呂布最大體力 +2。",
      "張寶 actionDeck 新增一張回復行動：非滿血時回復 2 點體力，滿血時改為防守。",
      "本次不調整第 1～4 關、玩家牌組、獎勵數值與路線事件收益。",
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
    `敵人回血行動觸發 ${summary.enemyHealTriggerCount} 次。`,
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
