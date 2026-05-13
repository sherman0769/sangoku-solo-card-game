import {
  getTtsAssetByAudioKey,
  type TtsDialogueAsset,
} from "./ttsManifest";

const voiceEnabledStorageKey = "sangoku-solo-card-game:voice-enabled";

interface VoicePlaybackOptions {
  volume?: number;
}

export function getVoiceAssetByAudioKey(audioKey: string) {
  return getTtsAssetByAudioKey(audioKey);
}

export function canPlayVoice(audioKey: string) {
  const asset = getVoiceAssetByAudioKey(audioKey);
  return asset?.status === "ready";
}

export function isVoiceSupported() {
  return typeof window !== "undefined" && typeof window.Audio === "function";
}

export function playVoice(audioKey: string, options: VoicePlaybackOptions = {}) {
  if (!isVoiceSupported() || !canPlayVoice(audioKey)) {
    return;
  }

  const asset = getVoiceAssetByAudioKey(audioKey);

  if (!asset) {
    return;
  }

  try {
    const audio = new Audio(getPublicAudioPath(asset));
    audio.volume = options.volume ?? 1;
    void audio.play().catch(() => {
      // Voice files are optional; missing or blocked playback must never affect gameplay.
    });
  } catch {
    // Voice playback is a future-facing layer and should fail silently when assets are absent.
  }
}

export function readVoiceEnabledSetting() {
  const storage = getLocalStorage();

  if (!storage) {
    return false;
  }

  return storage.getItem(voiceEnabledStorageKey) === "true";
}

export function writeVoiceEnabledSetting(enabled: boolean) {
  const storage = getLocalStorage();

  if (!storage) {
    return;
  }

  storage.setItem(voiceEnabledStorageKey, enabled ? "true" : "false");
}

export function getVoiceEnabledStorageKey() {
  return voiceEnabledStorageKey;
}

function getPublicAudioPath(asset: TtsDialogueAsset) {
  if (asset.filePath.startsWith("public/")) {
    return `/${asset.filePath.slice("public/".length)}`;
  }

  return asset.filePath;
}

function getLocalStorage() {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}
