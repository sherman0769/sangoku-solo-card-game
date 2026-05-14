import { describe, expect, it } from "vitest";
import { getSoundEnabledStorageKey } from "@/lib/game/audio";
import {
  canPlayBgm,
  createBgmPlayer,
  getBgmActivationEnabled,
  getBgmEnabled,
  getBgmEnabledStorageKey,
  getBgmTrack,
  getBgmVolume,
  getBgmVolumeStorageKey,
  getBgmPlaybackFailureMessage,
  getDefaultBgmVolume,
  setBgmEnabled,
  setBgmVolume,
} from "@/lib/game/bgm";
import { BGM_TRACKS } from "@/lib/game/bgmManifest";
import { getVoiceEnabledStorageKey } from "@/lib/game/voice";

describe("BGM manifest and playback helpers", () => {
  it("defines the three ready BGM tracks", () => {
    expect(BGM_TRACKS.map((track) => track.id)).toEqual([
      "home-theme",
      "battle-theme",
      "boss-theme",
    ]);

    for (const track of BGM_TRACKS) {
      expect(track.displayName).toBeTruthy();
      expect(track.filePath).toMatch(/^\/audio\/bgm\/.+\.mp3$/);
      expect(track.usage).toBeTruthy();
      expect(track.loop).toBe(true);
      expect(track.status).toBe("ready");
    }
  });

  it("allows playback only for ready tracks", () => {
    expect(canPlayBgm("home-theme")).toBe(true);
    expect(canPlayBgm("battle-theme")).toBe(true);
    expect(canPlayBgm("boss-theme")).toBe(true);
    expect(canPlayBgm("missing-theme")).toBe(false);
    expect(getBgmTrack("missing-theme")).toBeUndefined();
  });

  it("keeps localStorage helpers SSR safe in tests", () => {
    expect(() => setBgmEnabled(true)).not.toThrow();
    expect(() => setBgmVolume(0.8)).not.toThrow();
    expect(getBgmEnabled()).toBe(false);
    expect(getBgmVolume()).toBe(0.35);
    expect(getDefaultBgmVolume()).toBe(0.35);
  });

  it("creates a no-op player safely without browser Audio", async () => {
    const player = createBgmPlayer();

    await expect(player.play("home-theme")).resolves.toBe(false);
    expect(() => player.setVolume(0.5)).not.toThrow();
    expect(() => player.pause()).not.toThrow();
    expect(() => player.stop()).not.toThrow();
    expect(player.getCurrentTrackId()).toBeNull();
  });

  it("treats BGM as enabled only after successful playback", () => {
    expect(getBgmActivationEnabled(false)).toBe(false);
    expect(getBgmActivationEnabled(true)).toBe(true);
    expect(getBgmPlaybackFailureMessage()).toContain("請點擊開啟 BGM");
  });

  it("keeps BGM settings separate from sound and voice settings", () => {
    expect(getBgmEnabledStorageKey()).not.toBe(getSoundEnabledStorageKey());
    expect(getBgmEnabledStorageKey()).not.toBe(getVoiceEnabledStorageKey());
    expect(getBgmVolumeStorageKey()).not.toBe(getSoundEnabledStorageKey());
    expect(getBgmVolumeStorageKey()).not.toBe(getVoiceEnabledStorageKey());
  });
});
