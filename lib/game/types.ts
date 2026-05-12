export type CardKind =
  | "attack"
  | "dodge"
  | "wine"
  | "draw"
  | "pierce"
  | "equipment"
  | "combo"
  | "guard"
  | "rally"
  | "fire";

export type EnemyActionKind = "attack" | "fierce" | "guard" | "charge";

export type EnemyStage = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type EnemyType = "soldier" | "elite" | "boss";

export type ChapterStageType = "normal" | "event-heavy" | "elite" | "mini-boss" | "boss";

export type GamePhase = "player" | "defense" | "reward" | "observe" | "event" | "route";

export type GameStatus = "playing" | "won" | "lost";

export type RewardId =
  | "max-health"
  | "starting-draw"
  | "slash-damage"
  | "strategy-draw"
  | "armor-break-damage";

export type HeroId = "guan-yu" | "zhao-yun" | "zhuge-liang";

export type GameEventId = "village-supply" | "strategist-advice" | "ambush";

export type GameEventType = "supply" | "strategy" | "danger";

export type EventEffectType = "heal" | "draw" | "ambush-upgrade";

export type StageRouteId = "mountain-path" | "official-road" | "dangerous-pass";

export type RouteRiskLevel = "低" | "中" | "高";

export interface Hero {
  id: HeroId;
  name: string;
  title: string;
  maxHp: number;
  skillName: string;
  skillDescription: string;
  role: string;
  portrait: string;
  avatar: string;
  visualPrompt: string;
}

export interface Card {
  id: string;
  name: string;
  kind: CardKind;
  cost: number;
  value: number;
  text: string;
  illustration: string;
  visualPrompt: string;
}

export interface Enemy {
  id: string;
  name: string;
  stage: EnemyStage;
  type: EnemyType;
  title: string;
  intro: string;
  maxHp: number;
  maxHealth: number;
  description: string;
  traits: string[];
  attack: number;
  portrait: string;
  visualPrompt: string;
  actionDeck: EnemyAction[];
  actions: EnemyAction[];
}

export interface Chapter {
  id: string;
  name: string;
  description: string;
}

export interface ChapterStageConfig {
  stage: EnemyStage;
  name: string;
  type: ChapterStageType;
  enemyIds: string[];
  flavorText: string;
  backgroundImage: string;
  visualPrompt: string;
  isFinalBoss?: boolean;
}

export interface EnemyAction {
  kind: EnemyActionKind;
  label: string;
  text: string;
}

export interface PendingDefense {
  enemyName: string;
  actionLabel: string;
  damage: number;
  damageSegments?: number[];
}

export interface PendingObservation {
  cards: Card[];
  drawCount: number;
}

export interface EventOption {
  id: string;
  label: string;
  description: string;
  effectType: EventEffectType;
}

export interface GameEvent {
  id: GameEventId;
  name: string;
  description: string;
  type: GameEventType;
  image: string;
  visualPrompt: string;
  options: EventOption[];
}

export interface StageRoute {
  id: StageRouteId;
  name: string;
  description: string;
  riskLevel: RouteRiskLevel;
  enemyHpModifier: number;
  rewardOptionBonus: number;
  flavorText: string;
  image: string;
  visualPrompt: string;
}

export interface PlayerState {
  heroId: HeroId;
  name: string;
  title: string;
  skillName: string;
  skillText: string;
  maxHealth: number;
  health: number;
  morale: number;
  maxMorale: number;
  guardActive: boolean;
  slashUsedThisTurn: boolean;
  wineBonus: number;
  equippedItems: Card[];
  equipmentUsageThisTurn: {
    greenDragonBladeSlash: boolean;
    taipingManual: boolean;
  };
  equipmentUsageThisBattle: {
    diluDodged: boolean;
  };
}

export interface PlayerUpgrades {
  maxHpBonus: number;
  startingDrawBonus: number;
  slashDamageBonus: number;
  strategyDrawBonus: number;
  armorBreakDamageBonus: number;
}

export interface Reward {
  id: RewardId;
  name: string;
  text: string;
}

export interface GameState {
  chapter: Chapter;
  stageConfig: ChapterStageConfig;
  player: PlayerState;
  playerUpgrades: PlayerUpgrades;
  enemy: Enemy;
  enemyHealth: number;
  enemyIndex: number;
  encounteredEnemyIds: string[];
  enemyActionIndex: number;
  enemyGuarding: boolean;
  enemyCharged: boolean;
  enemyArmorBroken: boolean;
  deck: Card[];
  hand: Card[];
  discard: Card[];
  turn: number;
  phase: GamePhase;
  pendingDefense?: PendingDefense;
  pendingObservation?: PendingObservation;
  currentEvent?: GameEvent;
  availableRoutes: StageRoute[];
  selectedRoute?: StageRoute;
  rewardOptionBonus: number;
  rewardOptions: Reward[];
  status: GameStatus;
  log: string[];
}
