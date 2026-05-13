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

export type BossTraitId = "unmatched-pressure" | "warlord-recovery";

export type ChapterStageType = "normal" | "event-heavy" | "elite" | "mini-boss" | "boss";

export type GamePhase =
  | "player"
  | "defense"
  | "reward"
  | "observe"
  | "event"
  | "route"
  | "routeEvent";

export type GameStatus = "playing" | "won" | "lost";

export type DialogueSpeakerType = "hero" | "enemy" | "narrator" | "system";

export type DialogueTrigger =
  | "hero_preview"
  | "hero_intro"
  | "battle_start"
  | "use_slash"
  | "use_dodge"
  | "use_strategy"
  | "take_damage"
  | "low_hp"
  | "victory"
  | "enemy_intro"
  | "boss_intro"
  | "boss_trait"
  | "boss_recovery"
  | "chapter_intro"
  | "stage_intro"
  | "game_win"
  | "game_lose";

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

export type RouteEventType =
  | "supply"
  | "strategy"
  | "risk"
  | "intel"
  | "support"
  | "danger"
  | "rare"
  | "gamble";

export type RouteEventEffectType =
  | "heal"
  | "next-draw-bonus"
  | "mist-path"
  | "draw-heal"
  | "slash-upgrade"
  | "reward-bonus-damage"
  | "equipment-or-draw"
  | "night-raid";

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
  bossTraits: BossTraitId[];
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
  theme: string;
  focus: string;
  playStyle: string;
  flavorText: string;
  image: string;
  visualPrompt: string;
}

export interface RouteEventOption {
  id: string;
  label: string;
  description: string;
  effectType: RouteEventEffectType;
}

export interface RouteEvent {
  id: string;
  routeId: StageRouteId;
  name: string;
  description: string;
  type: RouteEventType;
  options: RouteEventOption[];
  flavorText: string;
  weight?: number;
}

export interface DialogueLine {
  id: string;
  speakerId: string;
  speakerName: string;
  speakerType: DialogueSpeakerType;
  trigger: DialogueTrigger;
  text: string;
  tone: string;
  audioKey?: string;
  portrait?: string;
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
  bossTraitUsage: Partial<Record<BossTraitId, boolean>>;
  bossTraitHistory: BossTraitId[];
  deck: Card[];
  hand: Card[];
  discard: Card[];
  turn: number;
  phase: GamePhase;
  pendingDefense?: PendingDefense;
  pendingObservation?: PendingObservation;
  currentEvent?: GameEvent;
  currentRouteEvent?: RouteEvent;
  availableRoutes: StageRoute[];
  selectedRoute?: StageRoute;
  pendingNextBattleModifiers: {
    enemyHpModifier: number;
    drawModifier: number;
  };
  rewardOptionBonus: number;
  rewardOptions: Reward[];
  routeEventHistory: string[];
  status: GameStatus;
  log: string[];
  currentDialogue?: DialogueLine;
  dialogueHistory: DialogueLine[];
  lowHpDialogueUsed: boolean;
}
