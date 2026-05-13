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

describe("voice playback framework", () => {
  it("checks voice support safely without browser APIs", () => {
    expect(() => isVoiceSupported()).not.toThrow();
    expect(isVoiceSupported()).toBe(false);
  });

  it("does not allow planned or missing voice assets to play", () => {
    expect(canPlayVoice("guan-yu-intro")).toBe(false);
    expect(canPlayVoice("missing-audio-key")).toBe(false);
  });

  it("can find planned voice assets by audioKey", () => {
    expect(getVoiceAssetByAudioKey("guan-yu-intro")).toMatchObject({
      speakerName: "關羽",
      status: "planned",
    });
  });

  it("plays as a safe no-op in SSR and test environments", () => {
    expect(() => playVoice("guan-yu-intro")).not.toThrow();
    expect(() => playVoice("missing-audio-key")).not.toThrow();
  });

  it("supports the voice asset lifecycle statuses while keeping current assets planned", () => {
    expect(ttsAssetStatuses).toEqual(["planned", "generated", "ready"]);
    expect(TTS_DIALOGUE_MANIFEST.every((asset) => asset.status === "planned")).toBe(true);
  });

  it("reads and writes voice setting safely without localStorage", () => {
    expect(readVoiceEnabledSetting()).toBe(false);
    expect(() => writeVoiceEnabledSetting(true)).not.toThrow();
    expect(getVoiceEnabledStorageKey()).toBe("sangoku-solo-card-game:voice-enabled");
  });
});
