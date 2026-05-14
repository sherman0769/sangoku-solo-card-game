export type GameModeId = "normal" | "challenge";

export interface GameMode {
  id: GameModeId;
  name: string;
  description: string;
  recommendedFor: string;
}

export const NORMAL_MODE: GameMode = {
  id: "normal",
  name: "普通模式",
  description: "適合第一次體驗，重視劇情、聲音、圖像與完整通關流程。",
  recommendedFor: "初次遊玩 / 教學展示",
};

export const CHALLENGE_MODE: GameMode = {
  id: "challenge",
  name: "挑戰模式",
  description: "中後期敵人會警戒反擊，連續攻擊需要承擔代價。",
  recommendedFor: "熟悉規則後挑戰",
};

export const GAME_MODES = [NORMAL_MODE, CHALLENGE_MODE] as const;

export function resolveGameMode(mode?: string | null): GameMode {
  return GAME_MODES.find((item) => item.id === mode) ?? NORMAL_MODE;
}

export function isChallengeMode(mode?: string | null) {
  return resolveGameMode(mode).id === "challenge";
}

export function getGameModeName(mode?: string | null) {
  return resolveGameMode(mode).name;
}

export function getGameModeBadge(mode?: string | null) {
  return isChallengeMode(mode) ? "挑戰" : "普通";
}

export function createGameStartHref(heroId: string, mode: GameModeId = "normal") {
  const params = new URLSearchParams({ hero: heroId });

  if (mode !== "normal") {
    params.set("mode", mode);
  }

  return `/game?${params.toString()}`;
}

export function getResultModeOutcomeLabel(outcome: string | undefined, mode?: string | null) {
  const modeName = getGameModeName(mode);

  if (outcome === "won") {
    return `${modeName}通關`;
  }

  if (outcome === "lost") {
    return `${modeName}戰敗`;
  }

  return "戰役結果";
}
