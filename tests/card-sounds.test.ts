import { describe, expect, it } from "vitest";
import {
  allCardSoundKeys,
  CARD_SOUND_MANIFEST,
  getCardSoundKeyByCardId,
  playCardSound,
} from "@/lib/game/cardSoundManifest";

describe("card sound manifest", () => {
  it("defines all planned card sound assets with metadata", () => {
    expect(allCardSoundKeys).toEqual([
      "card-play",
      "attack-card",
      "defense-card",
      "heal-card",
      "strategy-card",
      "equipment-card",
      "fire-card",
    ]);

    allCardSoundKeys.forEach((key) => {
      const asset = CARD_SOUND_MANIFEST[key];

      expect(asset.displayName.length).toBeGreaterThan(0);
      expect(asset.filePath).toMatch(/^\/audio\/sfx\/cards\/.+\.mp3$/);
      expect(asset.fallbackCue.length).toBeGreaterThan(0);
      expect(asset.status).toBe("planned");
    });
  });

  it("maps card ids to card sound keys", () => {
    expect(getCardSoundKeyByCardId("slash-1")).toBe("attack-card");
    expect(getCardSoundKeyByCardId("slash")).toBe("attack-card");
    expect(getCardSoundKeyByCardId("combo-slash-1")).toBe("attack-card");
    expect(getCardSoundKeyByCardId("combo-slash")).toBe("attack-card");
    expect(getCardSoundKeyByCardId("dodge-1")).toBe("defense-card");
    expect(getCardSoundKeyByCardId("guard-1")).toBe("defense-card");
    expect(getCardSoundKeyByCardId("guard")).toBe("defense-card");
    expect(getCardSoundKeyByCardId("wine-1")).toBe("heal-card");
    expect(getCardSoundKeyByCardId("manual-1")).toBe("strategy-card");
    expect(getCardSoundKeyByCardId("rally-1")).toBe("strategy-card");
    expect(getCardSoundKeyByCardId("pierce-1")).toBe("attack-card");
    expect(getCardSoundKeyByCardId("fire-attack-1")).toBe("fire-card");
    expect(getCardSoundKeyByCardId("fire-attack")).toBe("fire-card");
    expect(getCardSoundKeyByCardId("green-dragon-blade-1")).toBe("equipment-card");
    expect(getCardSoundKeyByCardId("dilu-horse-1")).toBe("equipment-card");
    expect(getCardSoundKeyByCardId("taiping-manual-1")).toBe("equipment-card");
    expect(getCardSoundKeyByCardId("unknown-card")).toBe("card-play");
  });

  it("plays card sounds as a safe no-op in SSR or test environments", () => {
    expect(() => playCardSound("slash-1", { enabled: false })).not.toThrow();
    expect(() => playCardSound("slash-1", { enabled: true })).not.toThrow();
    expect(() => playCardSound("unknown-card", { enabled: true })).not.toThrow();
  });
});
