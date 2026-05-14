import type { BalanceSimulationSummary, HeroBalanceStats } from "./balanceSimulator";

const heroNames: Record<string, string> = {
  "guan-yu": "關羽",
  "zhao-yun": "趙雲",
  "zhuge-liang": "諸葛亮",
  "li-shimin-ai-architect": "李詩民",
};

export interface BalanceReportOptions {
  title?: string;
  preAdjustmentSummary?: readonly string[];
  adjustments?: readonly string[];
  goalAssessment?: readonly string[];
}

export function generateBalanceReport(
  summary: BalanceSimulationSummary,
  options: BalanceReportOptions = {},
) {
  const lines = [
    options.title ?? "# v0.15.0 戰鬥平衡分析報告",
    "",
    ...formatOptionalSection("調整前摘要", options.preAdjustmentSummary),
    ...formatOptionalSection("調整內容", options.adjustments),
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
    "## 路線風格決策分佈",
    "",
    formatDistribution(summary.routeDecisionStats, "目前沒有路線決策紀錄。"),
    "",
    "## 路線事件分佈",
    "",
    formatDistribution(summary.routeEventStats, "目前沒有路線事件紀錄。"),
    "",
    "## 路線事件死亡關聯",
    "",
    formatDistribution(summary.routeEventDeathStats, "目前沒有路線事件後死亡紀錄。"),
    "",
    "## Boss 特性觸發次數",
    "",
    formatDistribution(summary.bossTraitStats, "目前沒有 Boss 特性觸發紀錄。"),
    "",
    "## 初步觀察",
    "",
    ...createObservations(summary),
    "",
    "## 建議調整方向",
    "",
    ...createSuggestions(summary),
    "",
    ...formatOptionalSection("是否達到平衡目標", options.goalAssessment),
  ];

  return lines.join("\n");
}

function formatOptionalSection(title: string, items?: readonly string[]) {
  if (!items?.length) {
    return [];
  }

  return [`## ${title}`, "", ...items.map((item) => `- ${item}`), ""];
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
  const lowHealthMountainPicks = summary.routeDecisionStats["低血量｜山道"] ?? 0;
  const mediumHealthOfficialPicks = summary.routeDecisionStats["中等血量｜官道"] ?? 0;
  const highHealthDangerousPicks = summary.routeDecisionStats["高血量｜險道"] ?? 0;
  const mostCommonRouteEvent = Object.entries(summary.routeEventStats)
    .sort((a, b) => b[1] - a[1])[0];
  const stageEightDeaths = summary.stageDeathDistribution["第 8 關"] ?? 0;
  const unmatchedPressureCount = summary.bossTraitStats["無雙壓迫"] ?? 0;
  const warlordRecoveryCount = summary.bossTraitStats["戰神回血"] ?? 0;

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
    `- 低血量時選擇山道 ${lowHealthMountainPicks} 次，反映山道是否能承擔生存補給定位。`,
    `- 中等血量時選擇官道 ${mediumHealthOfficialPicks} 次，反映官道是否成為穩定推進選擇。`,
    `- 高血量且狀態良好時選擇險道 ${highHealthDangerousPicks} 次，反映險道是否保有奇遇吸引力但不再無腦選。`,
    mostCommonRouteEvent
      ? `- 最常遭遇的路線事件為 ${mostCommonRouteEvent[0]}（${mostCommonRouteEvent[1]} 次）。`
      : "- 本次模擬沒有路線事件資料。",
    `- 第 8 關死亡 ${stageEightDeaths} 次，可觀察呂布 Boss 特性是否提高最終戰壓力。`,
    `- 呂布無雙壓迫觸發 ${unmatchedPressureCount} 次，戰神回血觸發 ${warlordRecoveryCount} 次。`,
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
