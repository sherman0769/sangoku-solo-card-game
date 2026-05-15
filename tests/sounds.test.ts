import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
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

  it("enables sound after successful home BGM activation without enabling voice", () => {
    const homePageSource = readFileSync(join(process.cwd(), "app", "page.tsx"), "utf-8");

    expect(homePageSource).toContain("if (played)");
    expect(homePageSource).toContain("writeSoundEnabledSetting(true)");
    expect(homePageSource).not.toContain("writeVoiceEnabledSetting(true)");
  });

  it("keeps game sound, voice, and BGM controls independent", () => {
    const gameBoardSource = readFileSync(
      join(process.cwd(), "components", "GameBoard.tsx"),
      "utf-8",
    );

    expect(gameBoardSource).toContain("setSoundEnabled(readSoundEnabledSetting())");
    expect(gameBoardSource).toContain("writeSoundEnabledSetting(nextEnabled)");
    expect(gameBoardSource).toContain("writeVoiceEnabledSetting(nextEnabled)");
    expect(gameBoardSource).toContain("setBgmPlaybackStateFromResult(played)");
  });
});
