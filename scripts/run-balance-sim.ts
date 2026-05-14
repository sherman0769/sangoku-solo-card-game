import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { generateBalanceReport } from "../lib/game/balanceReport";
import { simulateManyRuns } from "../lib/game/balanceSimulator";

const reportPath = resolve("docs/balance-report-v0.26.1.md");

async function main() {
  const summary = simulateManyRuns({
    heroIds: ["guan-yu", "zhao-yun", "zhuge-liang", "li-shimin-ai-architect"],
    runsPerHero: 50,
    modes: ["normal", "challenge"],
    seed: "v0.26.1-balance",
    maxTurns: 360,
    strategy: "basic-safe-strategy",
  });

  const report = generateBalanceReport(summary, {
    title: "# v0.26.1 敵方反制與行動節奏平衡報告",
    preAdjustmentSummary: [
      "v0.25.0 普通模式整體勝率仍偏高，保留作為劇情與展示體驗。",
      "v0.26.0 挑戰模式勝率仍接近普通模式，本次不再單純加厚血量，改從行動經濟加入反制壓力。",
    ],
    adjustments: [
      "普通模式維持 v0.25.0 後期耐久規則：第 5～7 關 +1，第 8 關 Boss +2。",
      "挑戰模式在普通模式基礎上額外加壓：第 1～7 關 +1，第 8 關 Boss 再 +1。",
      "挑戰模式敵人 actionDeck 追加攻擊或猛攻；張寶額外追加一張回復；呂布額外追加一張猛攻。",
      "挑戰模式呂布戰神回血由 3 點提高為 4 點。",
      "挑戰模式第 5～8 關新增警戒反擊：同回合第一次受傷進入警戒，第二次受傷時反擊 1 點，每回合最多一次。",
      "挑戰模式呂布若已觸發無雙壓迫，警戒反擊傷害提高為 2 點。",
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
  const normal = summary.perModeStats.normal;
  const challenge = summary.perModeStats.challenge;
  const challengeDrop = normal && challenge
    ? normal.overallWinRate - challenge.overallWinRate
    : 0;

  return [
    `普通模式整體勝率為 ${normal ? formatPercent(normal.overallWinRate) : "未模擬"}。`,
    `挑戰模式整體勝率為 ${challenge ? formatPercent(challenge.overallWinRate) : "未模擬"}。`,
    `挑戰模式相對普通模式勝率下降 ${formatPercent(challengeDrop)}。`,
    `四位角色勝率差距為 ${formatPercent(gap)}。`,
    `路線事件共觸發 ${getTotalRouteEvents(summary)} 次。`,
    `Boss 特性觸發統計：${formatBossTraitStats(summary)}。`,
    `敵人回血行動觸發 ${summary.enemyHealTriggerCount} 次。`,
    `警戒觸發 ${summary.counterAlertTriggerCount} 次；反擊觸發 ${summary.counterAttackTriggerCount} 次；因反擊戰敗 ${summary.counterDefeatCount} 次。`,
    `低血量選山道 ${summary.routeDecisionStats["低血量｜山道"] ?? 0} 次；中等血量選官道 ${summary.routeDecisionStats["中等血量｜官道"] ?? 0} 次；高血量狀態好選險道 ${summary.routeDecisionStats["高血量｜險道"] ?? 0} 次。`,
    challenge && normal && challenge.overallWinRate < normal.overallWinRate
      ? "挑戰模式已使勝率低於普通模式，可繼續觀察是否落在理想挑戰區間。"
      : "挑戰模式尚未明顯拉低勝率，下一輪可優先檢查敵人行動權重與 Boss 壓迫。",
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
