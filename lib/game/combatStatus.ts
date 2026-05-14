import type { GameState } from "./types";
import { getChallengeCounterBadge } from "./challengeCounter";

export type HpStatus = "healthy" | "wounded" | "critical" | "defeated";

export function getHpStatus(currentHp: number, maxHp: number): HpStatus {
  if (currentHp <= 0) {
    return "defeated";
  }

  const percent = maxHp > 0 ? currentHp / maxHp : 0;

  if (percent <= 0.25) {
    return "critical";
  }

  if (percent <= 0.5) {
    return "wounded";
  }

  return "healthy";
}

export function getPlayerCombatBadges(state: GameState) {
  const hpStatus = getHpStatus(state.player.health, state.player.maxHealth);

  return [
    hpStatus === "critical" ? "瀕死" : null,
    hpStatus === "wounded" || hpStatus === "critical" ? "重傷" : null,
    state.player.guardActive ? "固守中" : null,
    state.enemyArmorBroken ? "破甲中" : null,
    state.player.heroId === "guan-yu" && state.player.slashUsedThisTurn ? "武聖已用" : null,
    state.player.heroId === "guan-yu" && !state.player.slashUsedThisTurn ? "武聖待發" : null,
    state.player.heroId === "zhao-yun" ? "龍膽可用" : null,
    state.player.heroId === "zhuge-liang" && state.phase === "observe" ? "觀星" : null,
    state.player.heroId === "li-shimin-ai-architect" &&
    !state.player.architectureInferenceUsedThisTurn
      ? "架構待推演"
      : null,
    state.player.heroId === "li-shimin-ai-architect" && state.routeEventRecentlyProcessed
      ? "路線資訊"
      : null,
    state.player.wineBonus > 0 ? `酒勢 +${state.player.wineBonus}` : null,
    state.phase === "defense" ? "等待防禦" : null,
  ].filter((badge): badge is string => Boolean(badge));
}

export function getEnemyCombatBadges(state: GameState, nextActionLabel?: string) {
  const hpStatus = getHpStatus(state.enemyHealth, state.enemy.maxHealth);
  const isBoss = state.enemy.type === "boss" || state.enemy.bossTraits.length > 0;

  return [
    hpStatus === "critical" ? "重傷" : null,
    hpStatus === "wounded" ? "受創" : null,
    state.enemyGuarding ? "防守中" : null,
    state.enemyCharged ? "蓄力中" : null,
    getChallengeCounterBadge(state) ?? null,
    isBoss ? "Boss" : null,
    state.bossTraitUsage["unmatched-pressure"] ? "無雙已觸發" : null,
    state.bossTraitUsage["warlord-recovery"] ? "回血已觸發" : null,
    state.phase === "defense" ? "攻擊中" : null,
    state.phase === "reward" ? "戰後整備" : null,
    state.phase === "route" ? "等待選路" : null,
    state.phase === "event" ? "事件中" : null,
    state.phase === "observe" ? "等待觀星" : null,
    nextActionLabel && state.phase !== "reward" && state.phase !== "route"
      ? `預告：${nextActionLabel}`
      : null,
  ].filter((badge): badge is string => Boolean(badge));
}

export function getEnemyDefeatedFeedbackText(enemyName?: string) {
  return enemyName ? `${enemyName}敗退！` : "敵將敗退！";
}

export function getEnemyDefeatedLogText(enemyName?: string) {
  return `敵將敗退：${enemyName ?? "敵將"}`;
}
