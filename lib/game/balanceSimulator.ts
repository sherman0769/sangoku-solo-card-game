import { createSeededRandom } from "./seededRandom";
import {
  createGame,
  endTurn,
  playCard,
  resolveDefense,
  resolveEventOption,
  selectObservation,
  selectReward,
  selectRoute,
} from "./engine";
import type {
  Card,
  GameState,
  HeroId,
  Reward,
  StageRoute,
} from "./types";

export type BalanceStrategyName = "basic-safe-strategy";

export interface RunSimulationOptions {
  heroId: HeroId;
  seed?: string | number;
  maxTurns?: number;
  strategy?: BalanceStrategyName;
}

export interface ManyRunSimulationOptions {
  heroIds: HeroId[];
  runsPerHero: number;
  seed?: string | number;
  maxTurns?: number;
  strategy?: BalanceStrategyName;
}

export interface RunSimulationResult {
  heroId: HeroId;
  won: boolean;
  finalStage: number;
  turnsTaken: number;
  enemiesEncountered: string[];
  rewardsChosen: string[];
  routesChosen: string[];
  eventsEncountered: string[];
  damageTaken: number;
  cardsPlayed: Record<string, number>;
  defeatReason?: string;
}

export interface HeroBalanceStats {
  heroId: HeroId;
  runs: number;
  wins: number;
  winRate: number;
  averageTurns: number;
  averageFinalStage: number;
  averageDamageTaken: number;
}

export interface BalanceSimulationSummary {
  totalRuns: number;
  perHeroStats: Record<HeroId, HeroBalanceStats>;
  overallWinRate: number;
  averageTurns: number;
  stageDeathDistribution: Record<string, number>;
  enemyEncounterStats: Record<string, number>;
  routeChoiceStats: Record<string, number>;
  results: RunSimulationResult[];
}

const defaultMaxTurns = 320;
const rewardPriority = [
  "slash-damage",
  "max-health",
  "strategy-draw",
  "armor-break-damage",
  "starting-draw",
] as const;

export function simulateRun(options: RunSimulationOptions): RunSimulationResult {
  const random = createSeededRandom(options.seed ?? `${options.heroId}:1`);

  return withSeededMathRandom(random, () => {
    let state = createGame(options.heroId, { enemyRandom: random });
    const maxTurns = options.maxTurns ?? defaultMaxTurns;
    const rewardsChosen: string[] = [];
    const routesChosen: string[] = [];
    const eventsEncountered: string[] = [];
    const cardsPlayed: Record<string, number> = {};
    let damageTaken = 0;
    let steps = 0;

    while (state.status === "playing" && steps < maxTurns) {
      steps += 1;
      const beforeHealth = state.player.health;
      const beforeEnemyIndex = state.enemyIndex;
      const previousState = state;

      if (state.phase === "observe") {
        state = selectObservation(state, chooseObservationCardId(state));
      } else if (state.phase === "event") {
        if (state.currentEvent) {
          eventsEncountered.push(state.currentEvent.name);
          state = resolveEventOption(state, state.currentEvent.options[0]?.id ?? "");
        }
      } else if (state.phase === "reward") {
        const reward = chooseReward(state.rewardOptions);
        if (reward) {
          rewardsChosen.push(reward.name);
          state = selectReward(state, reward.id);
        }
      } else if (state.phase === "route") {
        const route = chooseRoute(state.availableRoutes, state);
        if (route) {
          routesChosen.push(route.name);
          state = selectRoute(state, route.id, { enemyRandom: random });
        }
      } else if (state.phase === "defense") {
        state = resolveDefense(state, shouldUseDefense(state));
      } else {
        const card = chooseCardToPlay(state);

        if (card) {
          state = playCard(state, card.id, {
            eventRoll: random,
            eventId: chooseEventId(random),
          });
          cardsPlayed[card.name] = (cardsPlayed[card.name] ?? 0) + 1;
        } else {
          state = endTurn(state);
        }
      }

      damageTaken += Math.max(0, beforeHealth - state.player.health);

      if (state === previousState && state.enemyIndex === beforeEnemyIndex) {
        state = endTurn(state);
      }
    }

    const timedOut = state.status === "playing";

    return {
      heroId: options.heroId,
      won: state.status === "won",
      finalStage: Math.min(state.enemyIndex + 1, 8),
      turnsTaken: state.turn,
      enemiesEncountered: state.encounteredEnemyIds,
      rewardsChosen,
      routesChosen,
      eventsEncountered,
      damageTaken,
      cardsPlayed,
      defeatReason: timedOut ? `超過 ${maxTurns} 步仍未結束` : getDefeatReason(state),
    };
  });
}

export function simulateManyRuns(options: ManyRunSimulationOptions): BalanceSimulationSummary {
  const results: RunSimulationResult[] = [];

  options.heroIds.forEach((heroId) => {
    for (let index = 0; index < options.runsPerHero; index += 1) {
      results.push(
        simulateRun({
          heroId,
          seed: `${options.seed ?? "balance"}:${heroId}:${index}`,
          maxTurns: options.maxTurns,
          strategy: options.strategy,
        }),
      );
    }
  });

  return summarizeResults(results);
}

export function summarizeResults(results: RunSimulationResult[]): BalanceSimulationSummary {
  const totalRuns = results.length;
  const wins = results.filter((result) => result.won).length;
  const stageDeathDistribution: Record<string, number> = {};
  const enemyEncounterStats: Record<string, number> = {};
  const routeChoiceStats: Record<string, number> = {};

  results.forEach((result) => {
    if (!result.won) {
      const stageKey = `第 ${result.finalStage} 關`;
      stageDeathDistribution[stageKey] = (stageDeathDistribution[stageKey] ?? 0) + 1;
    }

    result.enemiesEncountered.forEach((enemyId) => {
      enemyEncounterStats[enemyId] = (enemyEncounterStats[enemyId] ?? 0) + 1;
    });

    result.routesChosen.forEach((routeName) => {
      routeChoiceStats[routeName] = (routeChoiceStats[routeName] ?? 0) + 1;
    });
  });

  const heroIds = [...new Set(results.map((result) => result.heroId))] as HeroId[];
  const perHeroStats = heroIds.reduce<Record<HeroId, HeroBalanceStats>>((stats, heroId) => {
    const heroResults = results.filter((result) => result.heroId === heroId);
    const heroWins = heroResults.filter((result) => result.won).length;

    stats[heroId] = {
      heroId,
      runs: heroResults.length,
      wins: heroWins,
      winRate: safeRatio(heroWins, heroResults.length),
      averageTurns: average(heroResults.map((result) => result.turnsTaken)),
      averageFinalStage: average(heroResults.map((result) => result.finalStage)),
      averageDamageTaken: average(heroResults.map((result) => result.damageTaken)),
    };

    return stats;
  }, {} as Record<HeroId, HeroBalanceStats>);

  return {
    totalRuns,
    perHeroStats,
    overallWinRate: safeRatio(wins, totalRuns),
    averageTurns: average(results.map((result) => result.turnsTaken)),
    stageDeathDistribution,
    enemyEncounterStats,
    routeChoiceStats,
    results,
  };
}

function chooseObservationCardId(state: GameState) {
  const cards = state.pendingObservation?.cards ?? [];
  return (
    cards.find((card) => ["attack", "fire", "draw", "rally"].includes(card.kind))?.id ??
    cards[0]?.id ??
    ""
  );
}

function chooseReward(rewards: Reward[]) {
  return (
    rewardPriority
      .map((rewardId) => rewards.find((reward) => reward.id === rewardId))
      .find((reward): reward is Reward => Boolean(reward)) ??
    rewards[0]
  );
}

function chooseRoute(routes: StageRoute[], state: GameState) {
  const healthRatio = state.player.health / state.player.maxHealth;
  const preferredId =
    healthRatio > 0.7
      ? "dangerous-pass"
      : healthRatio < 0.4
        ? "mountain-path"
        : "official-road";

  return routes.find((route) => route.id === preferredId) ?? routes[0];
}

function shouldUseDefense(state: GameState) {
  return state.hand.some((card) => card.kind === "dodge") ||
    (state.player.heroId === "zhao-yun" && state.hand.some((card) => card.kind === "attack"));
}

function chooseCardToPlay(state: GameState): Card | undefined {
  const playable = state.hand.filter((card) => canPlayCard(state, card));
  const isWounded = state.player.health < state.player.maxHealth;

  return (
    (isWounded && playable.find((card) => card.kind === "wine")) ||
    (isWounded && playable.find((card) => card.kind === "rally")) ||
    (state.enemyCharged && playable.find((card) => card.kind === "fire")) ||
    playable.find((card) => card.kind === "equipment" && !hasEquipment(state, card.name)) ||
    playable.find((card) => card.kind === "pierce") ||
    playable.find((card) => card.kind === "attack") ||
    playable.find((card) => card.kind === "combo") ||
    playable.find((card) => card.kind === "fire") ||
    playable.find((card) => card.kind === "draw") ||
    playable.find((card) => card.kind === "guard")
  );
}

function canPlayCard(state: GameState, card: Card) {
  if (card.cost > state.player.morale) {
    return false;
  }

  if (card.kind === "dodge" && state.player.heroId !== "zhao-yun") {
    return false;
  }

  if (card.kind === "equipment" && hasEquipment(state, card.name)) {
    return false;
  }

  return true;
}

function hasEquipment(state: GameState, equipmentName: string) {
  return state.player.equippedItems.some((item) => item.name === equipmentName);
}

function chooseEventId(random: () => number) {
  const eventIds = ["village-supply", "strategist-advice", "ambush"] as const;
  return eventIds[Math.floor(random() * eventIds.length)];
}

function getDefeatReason(state: GameState) {
  if (state.status === "lost") {
    return state.log[0] ?? "體力歸零";
  }

  return undefined;
}

function withSeededMathRandom<T>(random: () => number, action: () => T) {
  const originalRandom = Math.random;
  Math.random = random;

  try {
    return action();
  } finally {
    Math.random = originalRandom;
  }
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
}

function safeRatio(value: number, total: number) {
  return total === 0 ? 0 : value / total;
}
