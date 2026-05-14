import type { GamePhase } from "./types";

export function getEnemyDefeatedStampLabel(isBoss: boolean) {
  return isBoss ? "敗" : "敗退";
}

export function getChoicePhasePrompt(phase: GamePhase) {
  const prompts: Partial<Record<GamePhase, string>> = {
    reward: "請選擇一項戰後獎勵",
    event: "請處理事件",
    route: "請選擇路線",
    routeEvent: "請處理路線事件",
    observe: "請選擇觀星牌",
  };

  return prompts[phase] ?? null;
}

export function isChoicePhase(phase: GamePhase) {
  return getChoicePhasePrompt(phase) !== null;
}

export function getMobileBottomActionHint(phase: GamePhase) {
  if (isChoicePhase(phase)) {
    return "請選擇一項繼續";
  }

  if (phase === "defense") {
    return "請選擇防禦方式";
  }

  return "選擇手牌或結束回合";
}
