import { describe, expect, it } from "vitest";
import {
  getSoundEnabledStorageKey,
  isAudioSupported,
  playSound,
  readSoundEnabledSetting,
  writeSoundEnabledSetting,
} from "@/lib/game/audio";
import { allSoundCues, SOUND_CUES } from "@/lib/game/sounds";
import type { SoundCue } from "@/lib/game/sounds";

const requiredCues: SoundCue[] = [
  "card-play",
  "slash",
  "dodge",
  "hit",
  "heal",
  "draw",
  "reward",
  "event",
  "route",
  "boss",
  "victory",
  "defeat",
];

describe("sound cue system", () => {
  it("defines all required sound cues with display metadata", () => {
    expect(allSoundCues).toEqual(requiredCues);

    requiredCues.forEach((cue) => {
      expect(SOUND_CUES[cue].displayName.length).toBeGreaterThan(0);
      expect(SOUND_CUES[cue].category.length).toBeGreaterThan(0);
      expect(SOUND_CUES[cue].description.length).toBeGreaterThan(0);
    });
  });

  it("checks audio support safely without browser APIs", () => {
    expect(() => isAudioSupported()).not.toThrow();
    expect(isAudioSupported()).toBe(false);
  });

  it("plays as a safe no-op when AudioContext is unavailable", () => {
    expect(() => playSound("slash")).not.toThrow();
    expect(() => playSound("victory")).not.toThrow();
  });

  it("reads and writes sound setting safely without localStorage", () => {
    expect(readSoundEnabledSetting()).toBe(false);
    expect(() => writeSoundEnabledSetting(true)).not.toThrow();
    expect(getSoundEnabledStorageKey()).toBe("sangoku-solo-card-game:sound-enabled");
  });
});
