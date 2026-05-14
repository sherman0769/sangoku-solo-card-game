import { describe, expect, it } from "vitest";
import { CHAPTER_1_TTS_P0_BATCH_MANIFEST } from "@/lib/game/ttsBatchP0Manifest";
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

const existingReadyVoiceAssets = [
  ["chapter-1-intro", "/audio/narration/chapter-1-intro.mp3"],
  ["guan-yu-preview", "/audio/voices/guan-yu/guan-yu-preview.mp3"],
  ["guan-yu-intro", "/audio/voices/guan-yu/guan-yu-intro.mp3"],
  ["zhao-yun-preview", "/audio/voices/zhao-yun/zhao-yun-preview.mp3"],
  ["zhao-yun-intro", "/audio/voices/zhao-yun/zhao-yun-intro.mp3"],
  ["zhuge-liang-preview", "/audio/voices/zhuge-liang/zhuge-liang-preview.mp3"],
  ["zhuge-liang-intro", "/audio/voices/zhuge-liang/zhuge-liang-intro.mp3"],
  ["li-shimin-preview", "/audio/voices/li-shimin/li-shimin-preview.mp3"],
  ["li-shimin-intro", "/audio/voices/li-shimin/li-shimin-intro.mp3"],
  ["lu-bu-intro", "/audio/voices/lu-bu/lu-bu-intro.mp3"],
] as const;

const readyVoiceAssets = [
  ...existingReadyVoiceAssets,
  ...CHAPTER_1_TTS_P0_BATCH_MANIFEST.map((asset) => [asset.audioKey, asset.filePath] as const),
  ["yellow-turban-soldier-defeated", "/audio/voices/enemies/yellow-turban-soldier-defeated.mp3"],
  ["yellow-turban-archer-defeated", "/audio/voices/enemies/yellow-turban-archer-defeated.mp3"],
  ["yellow-turban-brute-defeated", "/audio/voices/enemies/yellow-turban-brute-defeated.mp3"],
  ["bandit-leader-defeated", "/audio/voices/enemies/bandit-leader-defeated.mp3"],
  ["black-mountain-general-defeated", "/audio/voices/enemies/black-mountain-general-defeated.mp3"],
  ["xiliang-cavalry-defeated", "/audio/voices/enemies/xiliang-cavalry-defeated.mp3"],
  ["zhang-liang-defeated", "/audio/voices/enemies/zhang-liang-defeated.mp3"],
  ["zhang-bao-defeated", "/audio/voices/enemies/zhang-bao-defeated.mp3"],
  ["lu-bu-defeated", "/audio/voices/enemies/lu-bu-defeated.mp3"],
  ["route-mountain-spring", "/audio/voices/route-events/route-mountain-spring.mp3"],
  ["route-hermit-guidance", "/audio/voices/route-events/route-hermit-guidance.mp3"],
  ["route-misty-path", "/audio/voices/route-events/route-misty-path.mp3"],
  ["route-post-station", "/audio/voices/route-events/route-post-station.mp3"],
  ["route-military-dispatch", "/audio/voices/route-events/route-military-dispatch.mp3"],
  ["route-remnant-troops", "/audio/voices/route-events/route-remnant-troops.mp3"],
  ["route-cliff-ambush", "/audio/voices/route-events/route-cliff-ambush.mp3"],
  ["route-battlefield-relic", "/audio/voices/route-events/route-battlefield-relic.mp3"],
  ["route-night-raid", "/audio/voices/route-events/route-night-raid.mp3"],
] as const;

describe("voice playback framework", () => {
  it("checks voice support safely without browser APIs", () => {
    expect(() => isVoiceSupported()).not.toThrow();
    expect(isVoiceSupported()).toBe(false);
  });

  it("only allows ready voice assets to play", () => {
    readyVoiceAssets.forEach(([audioKey, filePath]) => {
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
    expect(getVoiceAssetByAudioKey("li-shimin-preview")).toMatchObject({
      speakerName: "李詩民",
      status: "ready",
    });
    expect(getVoiceAssetByAudioKey("li-shimin-strategy")).toMatchObject({
      speakerName: "李詩民",
      status: "planned",
    });
  });

  it("plays as a safe no-op in SSR and test environments", () => {
    expect(() => playVoice("guan-yu-intro")).not.toThrow();
    expect(() => playVoice("missing-audio-key")).not.toThrow();
  });

  it("supports voice lifecycle statuses while keeping non-imported assets planned", () => {
    expect(ttsAssetStatuses).toEqual(["planned", "generated", "ready"]);
    expect(TTS_DIALOGUE_MANIFEST.filter((asset) => asset.status === "ready")).toHaveLength(48);
    expect(
      TTS_DIALOGUE_MANIFEST.filter((asset) => !readyVoiceAssets.some(([audioKey]) => audioKey === asset.audioKey))
        .every((asset) => asset.status === "planned"),
    ).toBe(true);
  });

  it("reads and writes voice setting safely without localStorage", () => {
    expect(readVoiceEnabledSetting()).toBe(false);
    expect(() => writeVoiceEnabledSetting(true)).not.toThrow();
    expect(getVoiceEnabledStorageKey()).toBe("sangoku-solo-card-game:voice-enabled");
  });
});
