import { createSeededRandom } from "./seededRandom";
import { getBossTraitName } from "./bossTraits";
import {
  createGame,
  endTurn,
  playCard,
  resolveDefense,
  resolveEventOption,
  resolveRouteEventOption,
  selectObservation,
  selectReward,
  selectRoute,
} from "./engine";
import { resolveHero } from "./heroes";
import type {
  Card,
  BossTraitId,
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
  routeDecisionContexts: string[];
  eventsEncountered: string[];
  routeEventsEncountered: string[];
  bossTraitTriggers: string[];
  enemyHealTriggers: number;
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
  routeDecisionStats: Record<string, number>;
  routeEventStats: Record<string, number>;
  routeEventDeathStats: Record<string, number>;
  bossTraitStats: Record<string, number>;
  enemyHealTriggerCount: number;
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
    const routeDecisionContexts: string[] = [];
    const eventsEncountered: string[] = [];
    const routeEventsEncountered: string[] = [];
    const cardsPlayed: Record<string, number> = {};
    let damageTaken = 0;
    let enemyHealTriggers = 0;
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
      } else if (state.phase === "routeEvent") {
        if (state.currentRouteEvent) {
          routeEventsEncountered.push(state.currentRouteEvent.name);
          state = resolveRouteEventOption(
            state,
            state.currentRouteEvent.options[0]?.id ?? "",
            {
              enemyRandom: random,
              equipmentRandom: random,
            },
          );
        }
      } else if (state.phase === "reward") {
        const reward = chooseReward(state.rewardOptions);
        if (reward) {
          rewardsChosen.push(reward.name);
          state = selectReward(state, reward.id);
        }
      } else if (state.phase === "route") {
        const route = chooseBasicSafeRoute(state.availableRoutes, state);
        if (route) {
          routesChosen.push(route.name);
          routeDecisionContexts.push(`${getRouteDecisionBand(state)}｜${route.name}`);
          state = selectRoute(state, route.id, { routeEventRandom: random });
        }
      } else if (state.phase === "defense") {
        state = resolveDefense(state, shouldUseDefense(state));
      } else {
        const card = chooseCardToPlay(state);

        if (card) {
          state = playCard(state, card.id);
          cardsPlayed[card.name] = (cardsPlayed[card.name] ?? 0) + 1;
        } else {
          state = endTurn(state);
        }
      }

      damageTaken += Math.max(0, beforeHealth - state.player.health);
      enemyHealTriggers += countNewEnemyHealLogs(previousState, state);

      if (state === previousState && state.enemyIndex === beforeEnemyIndex) {
        const beforeFallback = state;
        state = endTurn(state);
        enemyHealTriggers += countNewEnemyHealLogs(beforeFallback, state);
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
      routeDecisionContexts,
      eventsEncountered,
      routeEventsEncountered,
      bossTraitTriggers: state.bossTraitHistory,
      enemyHealTriggers,
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
  const routeDecisionStats: Record<string, number> = {};
  const routeEventStats: Record<string, number> = {};
  const routeEventDeathStats: Record<string, number> = {};
  const bossTraitStats: Record<string, number> = {};
  let enemyHealTriggerCount = 0;

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

    result.routeDecisionContexts.forEach((context) => {
      routeDecisionStats[context] = (routeDecisionStats[context] ?? 0) + 1;
    });

    result.routeEventsEncountered.forEach((eventName) => {
      routeEventStats[eventName] = (routeEventStats[eventName] ?? 0) + 1;
    });

    result.bossTraitTriggers.forEach((traitId) => {
      const traitName = getBossTraitName(traitId as BossTraitId);
      bossTraitStats[traitName] = (bossTraitStats[traitName] ?? 0) + 1;
    });

    enemyHealTriggerCount += result.enemyHealTriggers;

    if (!result.won) {
      const lastRouteEvent = result.routeEventsEncountered.at(-1);

      if (lastRouteEvent) {
        routeEventDeathStats[lastRouteEvent] = (routeEventDeathStats[lastRouteEvent] ?? 0) + 1;
      }
    }
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
    routeDecisionStats,
    routeEventStats,
    routeEventDeathStats,
    bossTraitStats,
    enemyHealTriggerCount,
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

export function chooseBasicSafeRoute(routes: StageRoute[], state: GameState) {
  const hasEquipment = state.player.equippedItems.length > 0;
  const hasSlashBonus = state.playerUpgrades.slashDamageBonus > 0;
  const hasMaxHealthBonus = state.player.maxHealth > resolveHero(state.player.heroId).maxHp;
  const isStableEnoughForDangerousRoute =
    state.player.health >= 5 && (hasEquipment || hasSlashBonus || hasMaxHealthBonus);

  if (state.player.health <= 2) {
    return routes.find((route) => route.id === "mountain-path") ?? routes[0];
  }

  if (state.player.health <= 4) {
    return routes.find((route) => route.id === "official-road") ?? routes[0];
  }

  if (isStableEnoughForDangerousRoute) {
    return routes.find((route) => route.id === "dangerous-pass") ?? routes[0];
  }

  return routes.find((route) => route.id === "official-road") ?? routes[0];
}

function getRouteDecisionBand(state: GameState) {
  if (state.player.health <= 2) {
    return "低血量";
  }

  if (state.player.health <= 4) {
    return "中等血量";
  }

  return "高血量";
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

function getDefeatReason(state: GameState) {
  if (state.status === "lost") {
    return state.log[0] ?? "體力歸零";
  }

  return undefined;
}

function countNewEnemyHealLogs(previousState: GameState, nextState: GameState) {
  if (nextState.log === previousState.log) {
    return 0;
  }

  const previousLog = new Set(previousState.log);
  return nextState.log.filter((entry) => !previousLog.has(entry) && entry.includes("敵人回復")).length;
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
