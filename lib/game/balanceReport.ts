import type { BalanceSimulationSummary, HeroBalanceStats } from "./balanceSimulator";

const heroNames: Record<string, string> = {
  "guan-yu": "關羽",
  "zhao-yun": "趙雲",
  "zhuge-liang": "諸葛亮",
};

export function generateBalanceReport(summary: BalanceSimulationSummary) {
  const lines = [
    "# v0.15.0 戰鬥平衡分析報告",
    "",
    "## 模擬設定",
    "",
    `- 模擬總局數：${summary.totalRuns}`,
    "- 策略：basic-safe-strategy",
    "- 隨機：seeded random，可重現",
    "- 說明：本報告用於開發分析，不代表最終難度調整結論。",
    "",
    "## 各武將統計",
    "",
    "| 武將 | 局數 | 勝率 | 平均回合數 | 平均最終關卡 | 平均受傷 |",
    "| --- | ---: | ---: | ---: | ---: | ---: |",
    ...Object.values(summary.perHeroStats).map(formatHeroRow),
    "",
    "## 整體統計",
    "",
    `- 整體勝率：${formatPercent(summary.overallWinRate)}`,
    `- 平均回合數：${formatNumber(summary.averageTurns)}`,
    "",
    "## 死亡關卡分佈",
    "",
    formatDistribution(summary.stageDeathDistribution, "目前沒有死亡紀錄。"),
    "",
    "## 常見遭遇敵人",
    "",
    formatDistribution(summary.enemyEncounterStats, "目前沒有敵人遭遇紀錄。"),
    "",
    "## 路線選擇分佈",
    "",
    formatDistribution(summary.routeChoiceStats, "目前沒有路線選擇紀錄。"),
    "",
    "## 初步觀察",
    "",
    ...createObservations(summary),
    "",
    "## 建議調整方向",
    "",
    ...createSuggestions(summary),
    "",
  ];

  return lines.join("\n");
}

function formatHeroRow(stats: HeroBalanceStats) {
  return [
    heroNames[stats.heroId] ?? stats.heroId,
    stats.runs,
    formatPercent(stats.winRate),
    formatNumber(stats.averageTurns),
    formatNumber(stats.averageFinalStage),
    formatNumber(stats.averageDamageTaken),
  ].join(" | ").replace(/^/, "| ").concat(" |");
}

function formatDistribution(distribution: Record<string, number>, emptyText: string) {
  const entries = Object.entries(distribution).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    return `- ${emptyText}`;
  }

  return entries.map(([label, count]) => `- ${label}：${count}`).join("\n");
}

function createObservations(summary: BalanceSimulationSummary) {
  const weakestHero = Object.values(summary.perHeroStats)
    .sort((a, b) => a.winRate - b.winRate)[0];
  const hardestStage = Object.entries(summary.stageDeathDistribution)
    .sort((a, b) => b[1] - a[1])[0];
  const mostCommonRoute = Object.entries(summary.routeChoiceStats)
    .sort((a, b) => b[1] - a[1])[0];

  return [
    `- 目前整體勝率為 ${formatPercent(summary.overallWinRate)}，可作為後續數值調整基準。`,
    weakestHero
      ? `- 勝率最低武將為 ${heroNames[weakestHero.heroId] ?? weakestHero.heroId}（${formatPercent(weakestHero.winRate)}）。`
      : "- 尚無足夠武將資料判斷勝率差異。",
    hardestStage
      ? `- 死亡最多集中在 ${hardestStage[0]}（${hardestStage[1]} 次）。`
      : "- 本次模擬沒有死亡關卡分佈，可能代表策略或數值偏容易。",
    mostCommonRoute
      ? `- basic-safe-strategy 最常選擇 ${mostCommonRoute[0]}（${mostCommonRoute[1]} 次）。`
      : "- 本次模擬沒有路線選擇資料。",
  ];
}

function createSuggestions(summary: BalanceSimulationSummary) {
  const suggestions = [
    "- 先用更高局數重跑模擬，確認勝率是否穩定。",
    "- 若某武將勝率顯著低於其他武將，再檢查其初始手牌、技能觸發頻率與續航能力。",
    "- 若死亡集中於單一關卡，優先檢查該關敵人池與行動牌組。",
  ];

  if (summary.overallWinRate < 0.35) {
    suggestions.push("- 整體勝率偏低，可考慮提高補給、降低前中期敵人傷害，或增加防禦牌價值。");
  } else if (summary.overallWinRate > 0.8) {
    suggestions.push("- 整體勝率偏高，可考慮提高第 7～8 關壓力，或降低高報酬路線收益。");
  } else {
    suggestions.push("- 整體勝率落在可觀察區間，建議先比較各武將差距而非立即大幅調數值。");
  }

  return suggestions;
}

function formatPercent(value: number) {
  return `${Math.round(value * 1000) / 10}%`;
}

function formatNumber(value: number) {
  return (Math.round(value * 10) / 10).toFixed(1);
}
