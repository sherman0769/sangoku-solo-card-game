import { describe, expect, it } from "vitest";
import { TTS_DIALOGUE_MANIFEST, ttsAssetStatuses } from "@/lib/game/ttsManifest";
import {
  canPlayVoice,
  getVoiceAssetByAudioKey,
  getVoiceEnabledStorageKey,
  isVoiceSupported,
  playVoice,
  readVoiceEnabledSetting,
  writeVoiceEnabledSetting,
} from "@/lib/game/voice";

const firstReadyVoiceAssets = [
  ["chapter-1-intro", "/audio/narration/chapter-1-intro.mp3"],
  ["guan-yu-preview", "/audio/voices/guan-yu/guan-yu-preview.mp3"],
  ["guan-yu-intro", "/audio/voices/guan-yu/guan-yu-intro.mp3"],
  ["zhao-yun-preview", "/audio/voices/zhao-yun/zhao-yun-preview.mp3"],
  ["zhao-yun-intro", "/audio/voices/zhao-yun/zhao-yun-intro.mp3"],
  ["zhuge-liang-preview", "/audio/voices/zhuge-liang/zhuge-liang-preview.mp3"],
  ["zhuge-liang-intro", "/audio/voices/zhuge-liang/zhuge-liang-intro.mp3"],
  ["lu-bu-intro", "/audio/voices/lu-bu/lu-bu-intro.mp3"],
] as const;

describe("voice playback framework", () => {
  it("checks voice support safely without browser APIs", () => {
    expect(() => isVoiceSupported()).not.toThrow();
    expect(isVoiceSupported()).toBe(false);
  });

  it("only allows ready voice assets to play", () => {
    firstReadyVoiceAssets.forEach(([audioKey, filePath]) => {
      expect(getVoiceAssetByAudioKey(audioKey)).toMatchObject({
        audioKey,
        filePath,
        status: "ready",
      });
      expect(canPlayVoice(audioKey)).toBe(true);
    });

    expect(canPlayVoice("guan-yu-slash")).toBe(false);
    expect(canPlayVoice("missing-audio-key")).toBe(false);
  });

  it("can find voice assets by audioKey", () => {
    expect(getVoiceAssetByAudioKey("guan-yu-intro")).toMatchObject({
      speakerName: "關羽",
      status: "ready",
    });
    expect(getVoiceAssetByAudioKey("guan-yu-slash")).toMatchObject({
      speakerName: "關羽",
      status: "planned",
    });
    expect(getVoiceAssetByAudioKey("guan-yu-preview")).toMatchObject({
      speakerName: "關羽",
      status: "ready",
    });
  });

  it("plays as a safe no-op in SSR and test environments", () => {
    expect(() => playVoice("guan-yu-intro")).not.toThrow();
    expect(() => playVoice("missing-audio-key")).not.toThrow();
  });

  it("supports voice lifecycle statuses while keeping non-imported assets planned", () => {
    expect(ttsAssetStatuses).toEqual(["planned", "generated", "ready"]);
    expect(TTS_DIALOGUE_MANIFEST.filter((asset) => asset.status === "ready")).toHaveLength(8);
    expect(
      TTS_DIALOGUE_MANIFEST.filter((asset) => !firstReadyVoiceAssets.some(([audioKey]) => audioKey === asset.audioKey))
        .every((asset) => asset.status === "planned"),
    ).toBe(true);
  });

  it("reads and writes voice setting safely without localStorage", () => {
    expect(readVoiceEnabledSetting()).toBe(false);
    expect(() => writeVoiceEnabledSetting(true)).not.toThrow();
    expect(getVoiceEnabledStorageKey()).toBe("sangoku-solo-card-game:voice-enabled");
  });
});
