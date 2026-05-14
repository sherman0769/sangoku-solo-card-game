import { describe, expect, it } from "vitest";
import { getSoundEnabledStorageKey } from "@/lib/game/audio";
import {
  canPlayBgm,
  createBgmPlayer,
  getBgmActivated,
  getBgmActivatedStorageKey,
  getBgmActivationEnabled,
  getBgmEnabled,
  getBgmEnabledStorageKey,
  getBgmPersistedPlaybackState,
  getBgmResumeIntent,
  getGameBgmTrackId,
  getBgmTrack,
  getBgmVolume,
  getBgmVolumeStorageKey,
  getBgmPlaybackFailureMessage,
  getDefaultBgmVolume,
  getSharedBgmPlayer,
  resetSharedBgmPlayerForTests,
  setBgmActivated,
  setBgmEnabled,
  setBgmPlaybackStateFromResult,
  setBgmVolume,
  shouldAutoResumeBgm,
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
    expect(() => setBgmActivated(true)).not.toThrow();
    expect(() => setBgmVolume(0.8)).not.toThrow();
    expect(getBgmEnabled()).toBe(false);
    expect(getBgmActivated()).toBe(false);
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
    expect(getBgmPersistedPlaybackState(false)).toEqual({
      enabled: false,
      activated: false,
    });
    expect(getBgmPersistedPlaybackState(true)).toEqual({
      enabled: true,
      activated: true,
    });
    expect(setBgmPlaybackStateFromResult(false)).toEqual({
      enabled: false,
      activated: false,
    });
    expect(getBgmPlaybackFailureMessage()).toContain("請點擊開啟 BGM");
  });

  it("resumes game BGM only after a successful prior activation", () => {
    expect(shouldAutoResumeBgm(true, true)).toBe(true);
    expect(shouldAutoResumeBgm(true, false)).toBe(false);
    expect(shouldAutoResumeBgm(false, true)).toBe(false);
    expect(shouldAutoResumeBgm(false, false)).toBe(false);
    expect(getGameBgmTrackId("yellow-turban-soldier")).toBe("battle-theme");
    expect(getGameBgmTrackId("lu-bu")).toBe("boss-theme");
    expect(getGameBgmTrackId({ enemy: { id: "zhang-bao", type: "mini-boss" }, stage: 7 })).toBe(
      "battle-theme",
    );
    expect(getGameBgmTrackId({ enemy: { id: "zhang-bao", type: "boss" }, stage: 7 })).toBe(
      "boss-theme",
    );
    expect(getGameBgmTrackId({ enemy: { id: "yellow-turban-soldier" }, stageConfig: { stage: 8 } })).toBe(
      "boss-theme",
    );
  });

  it("persists enabled and activated state after successful BGM playback", () => {
    withMockWindowStorage(() => {
      const successState = setBgmPlaybackStateFromResult(true);

      expect(successState).toEqual({
        enabled: true,
        activated: true,
      });
      expect(getBgmEnabled()).toBe(true);
      expect(getBgmActivated()).toBe(true);
      expect(getBgmResumeIntent()).toMatchObject({
        enabled: true,
        activated: true,
        volume: 0.35,
        shouldResume: true,
      });

      const failedState = setBgmPlaybackStateFromResult(false);

      expect(failedState).toEqual({
        enabled: false,
        activated: false,
      });
      expect(getBgmEnabled()).toBe(false);
      expect(getBgmActivated()).toBe(false);
      expect(getBgmResumeIntent()).toMatchObject({
        enabled: false,
        activated: false,
        volume: 0.35,
        shouldResume: false,
      });
    });
  });

  it("uses a shared player so home activation can continue into the game page", () => {
    resetSharedBgmPlayerForTests();
    const homePlayer = getSharedBgmPlayer();
    const gamePlayer = getSharedBgmPlayer();

    expect(gamePlayer).toBe(homePlayer);
    resetSharedBgmPlayerForTests();
  });

  it("keeps BGM settings separate from sound and voice settings", () => {
    expect(getBgmEnabledStorageKey()).not.toBe(getSoundEnabledStorageKey());
    expect(getBgmEnabledStorageKey()).not.toBe(getVoiceEnabledStorageKey());
    expect(getBgmActivatedStorageKey()).not.toBe(getSoundEnabledStorageKey());
    expect(getBgmActivatedStorageKey()).not.toBe(getVoiceEnabledStorageKey());
    expect(getBgmVolumeStorageKey()).not.toBe(getSoundEnabledStorageKey());
    expect(getBgmVolumeStorageKey()).not.toBe(getVoiceEnabledStorageKey());
  });
});

function withMockWindowStorage(assertions: () => void) {
  const storage = new Map<string, string>();
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const windowLike = {
    localStorage: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
    },
  };

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: windowLike,
  });

  try {
    assertions();
  } finally {
    if (previousWindow) {
      Object.defineProperty(globalThis, "window", previousWindow);
    } else {
      Reflect.deleteProperty(globalThis, "window");
    }
  }
}
