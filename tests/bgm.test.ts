import { describe, expect, it, vi } from "vitest";
import { getSoundEnabledStorageKey } from "@/lib/game/audio";
import {
  canPlayBgm,
  createBgmPlayer,
  getBgmActivated,
  getBgmActivatedStorageKey,
  getBgmActivationEnabled,
  getBgmEnabled,
  getBgmEnabledStorageKey,
  getBgmNeedsResume,
  getBgmNeedsResumeStorageKey,
  getBgmPersistedPlaybackState,
  getBgmResumeRequiredMessage,
  getBgmResumeIntent,
  getGameBgmTrackId,
  getBgmTrack,
  getBgmVolume,
  getBgmVolumeStorageKey,
  getBgmPlaybackFailureMessage,
  getDefaultBgmVolume,
  getSharedBgmPlayer,
  markBgmNeedsResume,
  pauseBgmForPageHide,
  registerBgmLifecycleHandlers,
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
    expect(() => registerBgmLifecycleHandlers()).not.toThrow();
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
        needsResume: false,
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
        needsResume: false,
        shouldResume: false,
      });
    });
  });

  it("marks page-hidden BGM as needing user resume without clearing preferences", () => {
    withMockWindowStorage(() => {
      setBgmEnabled(true);
      setBgmActivated(true);
      const player = createMockBgmPlayer();

      pauseBgmForPageHide(player);

      expect(player.pause).toHaveBeenCalledTimes(1);
      expect(player.stop).not.toHaveBeenCalled();
      expect(getBgmEnabled()).toBe(true);
      expect(getBgmActivated()).toBe(true);
      expect(getBgmNeedsResume()).toBe(true);
      expect(getBgmResumeIntent()).toMatchObject({
        enabled: true,
        activated: true,
        needsResume: true,
        shouldResume: false,
      });
      expect(getBgmResumeRequiredMessage()).toBe("音樂已暫停，請點擊開啟 BGM。");
    });
  });

  it("registers lifecycle handlers for visibilitychange and pagehide", () => {
    withMockBrowserLifecycle(() => {
      setBgmEnabled(true);
      setBgmActivated(true);
      const player = createMockBgmPlayer();
      const onPauseForPageHide = vi.fn();
      const onVisibleAfterPageHide = vi.fn();
      const unregister = registerBgmLifecycleHandlers({
        player,
        onPauseForPageHide,
        onVisibleAfterPageHide,
      });

      setDocumentVisibilityState("hidden");
      dispatchDocumentEvent("visibilitychange");

      expect(player.pause).toHaveBeenCalledTimes(1);
      expect(onPauseForPageHide).toHaveBeenCalledTimes(1);
      expect(getBgmNeedsResume()).toBe(true);

      setDocumentVisibilityState("visible");
      dispatchDocumentEvent("visibilitychange");

      expect(onVisibleAfterPageHide).toHaveBeenCalledTimes(1);

      dispatchWindowEvent("pagehide");

      expect(player.stop).toHaveBeenCalledTimes(1);
      expect(onPauseForPageHide).toHaveBeenCalledTimes(2);

      unregister();
      dispatchWindowEvent("pagehide");

      expect(player.stop).toHaveBeenCalledTimes(1);
    });
  });

  it("does not mark hidden pages for resume when BGM was never active", () => {
    withMockBrowserLifecycle(() => {
      const player = createMockBgmPlayer(null);
      const onPauseForPageHide = vi.fn();

      registerBgmLifecycleHandlers({
        player,
        onPauseForPageHide,
      });

      setDocumentVisibilityState("hidden");
      dispatchDocumentEvent("visibilitychange");

      expect(player.pause).toHaveBeenCalledTimes(1);
      expect(onPauseForPageHide).not.toHaveBeenCalled();
      expect(getBgmNeedsResume()).toBe(false);
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
    expect(getBgmNeedsResumeStorageKey()).not.toBe(getSoundEnabledStorageKey());
    expect(getBgmNeedsResumeStorageKey()).not.toBe(getVoiceEnabledStorageKey());
  });
});

function createMockBgmPlayer(currentTrackId: string | null = "home-theme") {
  return {
    play: vi.fn(async () => true),
    pause: vi.fn(),
    stop: vi.fn(),
    setVolume: vi.fn(),
    getCurrentTrackId: vi.fn(() => currentTrackId),
  };
}

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

    markBgmNeedsResume(false);
  }
}

function withMockBrowserLifecycle(assertions: () => void) {
  const storage = new Map<string, string>();
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const previousDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  const windowListeners = new Map<string, Set<() => void>>();
  const documentListeners = new Map<string, Set<() => void>>();
  let visibilityState = "visible";
  const windowLike = {
    localStorage: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
    },
    addEventListener: (eventName: string, listener: () => void) => {
      const listeners = windowListeners.get(eventName) ?? new Set<() => void>();
      listeners.add(listener);
      windowListeners.set(eventName, listeners);
    },
    removeEventListener: (eventName: string, listener: () => void) => {
      windowListeners.get(eventName)?.delete(listener);
    },
  };
  const documentLike = {
    get visibilityState() {
      return visibilityState;
    },
    addEventListener: (eventName: string, listener: () => void) => {
      const listeners = documentListeners.get(eventName) ?? new Set<() => void>();
      listeners.add(listener);
      documentListeners.set(eventName, listeners);
    },
    removeEventListener: (eventName: string, listener: () => void) => {
      documentListeners.get(eventName)?.delete(listener);
    },
  };

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: windowLike,
  });
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: documentLike,
  });
  Object.defineProperty(globalThis, "__setBgmTestVisibilityState", {
    configurable: true,
    value: (nextVisibilityState: string) => {
      visibilityState = nextVisibilityState;
    },
  });
  Object.defineProperty(globalThis, "__dispatchBgmTestDocumentEvent", {
    configurable: true,
    value: (eventName: string) => {
      documentListeners.get(eventName)?.forEach((listener) => listener());
    },
  });
  Object.defineProperty(globalThis, "__dispatchBgmTestWindowEvent", {
    configurable: true,
    value: (eventName: string) => {
      windowListeners.get(eventName)?.forEach((listener) => listener());
    },
  });

  try {
    assertions();
  } finally {
    if (previousWindow) {
      Object.defineProperty(globalThis, "window", previousWindow);
    } else {
      Reflect.deleteProperty(globalThis, "window");
    }

    if (previousDocument) {
      Object.defineProperty(globalThis, "document", previousDocument);
    } else {
      Reflect.deleteProperty(globalThis, "document");
    }

    Reflect.deleteProperty(globalThis, "__setBgmTestVisibilityState");
    Reflect.deleteProperty(globalThis, "__dispatchBgmTestDocumentEvent");
    Reflect.deleteProperty(globalThis, "__dispatchBgmTestWindowEvent");
    markBgmNeedsResume(false);
  }
}

function setDocumentVisibilityState(visibilityState: "visible" | "hidden") {
  (globalThis as { __setBgmTestVisibilityState: (value: string) => void })
    .__setBgmTestVisibilityState(visibilityState);
}

function dispatchDocumentEvent(eventName: string) {
  (globalThis as { __dispatchBgmTestDocumentEvent: (value: string) => void })
    .__dispatchBgmTestDocumentEvent(eventName);
}

function dispatchWindowEvent(eventName: string) {
  (globalThis as { __dispatchBgmTestWindowEvent: (value: string) => void })
    .__dispatchBgmTestWindowEvent(eventName);
}
