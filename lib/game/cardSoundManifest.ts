import { playSound } from "./audio";
import type { SoundCue } from "./sounds";
import type { Card } from "./types";

export type CardSoundStatus = "planned" | "ready";

export type CardSoundKey =
  | "card-play"
  | "attack-card"
  | "defense-card"
  | "heal-card"
  | "strategy-card"
  | "equipment-card"
  | "fire-card";

export interface CardSoundAsset {
  displayName: string;
  filePath: string;
  fallbackCue: SoundCue;
  status: CardSoundStatus;
}

export const CARD_SOUND_MANIFEST: Record<CardSoundKey, CardSoundAsset> = {
  "card-play": {
    displayName: "通用出牌",
    filePath: "/audio/sfx/cards/card-play.mp3",
    fallbackCue: "card-play",
    status: "planned",
  },
  "attack-card": {
    displayName: "攻擊卡音效",
    filePath: "/audio/sfx/cards/attack-card.mp3",
    fallbackCue: "slash",
    status: "planned",
  },
  "defense-card": {
    displayName: "防禦卡音效",
    filePath: "/audio/sfx/cards/defense-card.mp3",
    fallbackCue: "dodge",
    status: "planned",
  },
  "heal-card": {
    displayName: "回復卡音效",
    filePath: "/audio/sfx/cards/heal-card.mp3",
    fallbackCue: "heal",
    status: "planned",
  },
  "strategy-card": {
    displayName: "策略卡音效",
    filePath: "/audio/sfx/cards/strategy-card.mp3",
    fallbackCue: "draw",
    status: "planned",
  },
  "equipment-card": {
    displayName: "裝備卡音效",
    filePath: "/audio/sfx/cards/equipment-card.mp3",
    fallbackCue: "reward",
    status: "planned",
  },
  "fire-card": {
    displayName: "火攻音效",
    filePath: "/audio/sfx/cards/fire-card.mp3",
    fallbackCue: "slash",
    status: "planned",
  },
};

export const allCardSoundKeys = Object.keys(CARD_SOUND_MANIFEST) as CardSoundKey[];

export function getCardSoundKey(card: Pick<Card, "id" | "kind" | "name">): CardSoundKey {
  return getCardSoundKeyByCardId(card.id);
}

export function getCardSoundKeyByCardId(cardId: string): CardSoundKey {
  const normalizedCardId = cardId.replace(/-\d+$/, "");

  if (normalizedCardId === "slash" || normalizedCardId === "combo-slash") {
    return "attack-card";
  }

  if (normalizedCardId === "dodge" || normalizedCardId === "guard") {
    return "defense-card";
  }

  if (normalizedCardId === "wine") {
    return "heal-card";
  }

  if (normalizedCardId === "manual" || normalizedCardId === "rally") {
    return "strategy-card";
  }

  if (normalizedCardId === "pierce") {
    return "attack-card";
  }

  if (normalizedCardId === "fire-attack") {
    return "fire-card";
  }

  if (
    normalizedCardId === "green-dragon-blade" ||
    normalizedCardId === "dilu-horse" ||
    normalizedCardId === "taiping-manual"
  ) {
    return "equipment-card";
  }

  return "card-play";
}

export function getCardSoundAssetByCardId(cardId: string) {
  return CARD_SOUND_MANIFEST[getCardSoundKeyByCardId(cardId)];
}

export function playCardSound(cardId: string, options: { enabled?: boolean } = {}) {
  if (!options.enabled) {
    return;
  }

  const asset = getCardSoundAssetByCardId(cardId);

  if (asset.status !== "ready") {
    playSound(asset.fallbackCue);
    return;
  }

  if (typeof window === "undefined" || typeof Audio === "undefined") {
    return;
  }

  try {
    const audio = new Audio(asset.filePath);
    void audio.play().catch(() => {
      playSound(asset.fallbackCue);
    });
  } catch {
    playSound(asset.fallbackCue);
  }
}
