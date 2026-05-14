import { BGM_TRACKS, type BgmTrack } from "./bgmManifest";

const bgmEnabledStorageKey = "sangoku-solo-card-game:bgm-enabled";
const bgmVolumeStorageKey = "sangoku-solo-card-game:bgm-volume";
const defaultBgmVolume = 0.35;

export interface BgmPlaybackOptions {
  volume?: number;
  loop?: boolean;
}

export interface BgmPlayer {
  play: (trackId: string, options?: BgmPlaybackOptions) => void;
  pause: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  getCurrentTrackId: () => string | null;
}

export function getBgmTrack(trackId: string): BgmTrack | undefined {
  return BGM_TRACKS.find((track) => track.id === trackId);
}

export function canPlayBgm(trackId: string) {
  return getBgmTrack(trackId)?.status === "ready";
}

export function isBgmSupported() {
  return typeof window !== "undefined" && typeof window.Audio === "function";
}

export function createBgmPlayer(): BgmPlayer {
  let audio: HTMLAudioElement | null = null;
  let currentTrackId: string | null = null;
  let currentVolume = defaultBgmVolume;

  function ensureAudio(track: BgmTrack) {
    if (!isBgmSupported()) {
      return null;
    }

    if (!audio || currentTrackId !== track.id) {
      if (audio) {
        try {
          audio.pause();
        } catch {
          // no-op: playback failures should never break gameplay.
        }
      }

      audio = new window.Audio(track.filePath);
      currentTrackId = track.id;
    }

    return audio;
  }

  return {
    play(trackId, options = {}) {
      const track = getBgmTrack(trackId);

      if (!track || !canPlayBgm(trackId)) {
        return;
      }

      try {
        const nextAudio = ensureAudio(track);

        if (!nextAudio) {
          return;
        }

        currentVolume = clampBgmVolume(options.volume ?? currentVolume);
        nextAudio.loop = options.loop ?? track.loop;
        nextAudio.volume = currentVolume;
        void nextAudio.play().catch(() => {
          // Browser autoplay rules or missing codecs should degrade silently.
        });
      } catch {
        // no-op
      }
    },
    pause() {
      try {
        audio?.pause();
      } catch {
        // no-op
      }
    },
    stop() {
      try {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      } catch {
        // no-op
      } finally {
        audio = null;
        currentTrackId = null;
      }
    },
    setVolume(volume) {
      currentVolume = clampBgmVolume(volume);

      try {
        if (audio) {
          audio.volume = currentVolume;
        }
      } catch {
        // no-op
      }
    },
    getCurrentTrackId() {
      return currentTrackId;
    },
  };
}

export function playBgm(trackId: string, options: BgmPlaybackOptions = {}) {
  const player = createBgmPlayer();
  player.play(trackId, options);
  return player;
}

export function getBgmEnabled() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(bgmEnabledStorageKey) === "true";
}

export function setBgmEnabled(enabled: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(bgmEnabledStorageKey, String(enabled));
}

export function getBgmVolume() {
  if (typeof window === "undefined") {
    return defaultBgmVolume;
  }

  const storedVolume = Number(window.localStorage.getItem(bgmVolumeStorageKey));

  if (!Number.isFinite(storedVolume)) {
    return defaultBgmVolume;
  }

  return clampBgmVolume(storedVolume);
}

export function setBgmVolume(volume: number) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(bgmVolumeStorageKey, String(clampBgmVolume(volume)));
}

export function getBgmEnabledStorageKey() {
  return bgmEnabledStorageKey;
}

export function getBgmVolumeStorageKey() {
  return bgmVolumeStorageKey;
}

export function getDefaultBgmVolume() {
  return defaultBgmVolume;
}

function clampBgmVolume(volume: number) {
  if (!Number.isFinite(volume)) {
    return defaultBgmVolume;
  }

  return Math.min(1, Math.max(0, volume));
}
