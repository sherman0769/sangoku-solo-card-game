import type { GameState } from "./types";

export function isChallengeCounterEnabled(state: Pick<GameState, "mode" | "stageConfig">) {
  return state.mode === "challenge" && state.stageConfig.stage >= 5 && state.stageConfig.stage <= 8;
}

export function getChallengeCounterDamage(
  state: Pick<GameState, "enemy" | "bossTraitUsage">,
) {
  if (state.enemy.id === "lu-bu" && state.bossTraitUsage["unmatched-pressure"]) {
    return 2;
  }

  return 1;
}

export function getChallengeCounterLogMessage(
  state: Pick<GameState, "enemy" | "bossTraitUsage">,
  damage = getChallengeCounterDamage(state),
) {
  if (state.enemy.id === "lu-bu" && state.bossTraitUsage["unmatched-pressure"]) {
    return `呂布以無雙之勢反擊，造成 ${damage} 點傷害。`;
  }

  if (state.enemy.id === "lu-bu") {
    return `呂布警戒反擊，造成 ${damage} 點傷害。`;
  }

  return `敵人警戒反擊，造成 ${damage} 點傷害。`;
}

export function getChallengeCounterDefeatLogMessage(
  state: Pick<GameState, "enemy" | "bossTraitUsage">,
  damage = getChallengeCounterDamage(state),
) {
  return `${getChallengeCounterLogMessage(state, damage)}你倒在反擊之下。`;
}

export function getChallengeCounterBadge(state: Pick<
  GameState,
  "enemy" | "enemyDamagedThisTurn" | "enemyCounteredThisTurn" | "bossTraitUsage" | "mode" | "stageConfig"
>) {
  if (!isChallengeCounterEnabled(state)) {
    return undefined;
  }

  if (state.enemyCounteredThisTurn) {
    if (state.enemy.id === "lu-bu") {
      return state.bossTraitUsage["unmatched-pressure"] ? "無雙反擊" : "戰神反擊";
    }

    return "已反擊";
  }

  if (state.enemyDamagedThisTurn) {
    return "警戒";
  }

  return undefined;
}
