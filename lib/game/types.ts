export type CardKind = "attack" | "dodge" | "wine" | "draw" | "pierce" | "equipment";

export type EnemyActionKind = "attack" | "fierce" | "guard" | "charge";

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
}

export interface Card {
  id: string;
  name: string;
  kind: CardKind;
  cost: number;
  value: number;
  text: string;
}

export interface Enemy {
  id: string;
  name: string;
  title: string;
  intro: string;
  maxHealth: number;
  attack: number;
  actions: EnemyAction[];
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
  player: PlayerState;
  playerUpgrades: PlayerUpgrades;
  enemy: Enemy;
  enemyHealth: number;
  enemyIndex: number;
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
