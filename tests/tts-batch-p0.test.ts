import { describe, expect, it } from "vitest";
import ttsBatchP0Json from "@/docs/tts-batch-p0-v0.18.3.json";
import { CHAPTER_1_TTS_P0_BATCH_MANIFEST } from "@/lib/game/ttsBatchP0Manifest";
import { getTtsAssetByAudioKey } from "@/lib/game/ttsManifest";

const expectedStageIntroAudioKeys = [
  "stage-1-intro",
  "stage-2-intro",
  "stage-3-intro",
  "stage-4-intro",
  "stage-5-intro",
  "stage-6-intro",
  "stage-7-intro",
  "stage-8-intro",
] as const;

const expectedEnemyIntroAudioKeys = [
  "yellow-turban-soldier-intro",
  "yellow-turban-archer-intro",
  "yellow-turban-brute-intro",
  "bandit-leader-intro",
  "black-mountain-general-intro",
  "xiliang-cavalry-intro",
  "zhang-liang-intro",
  "zhang-bao-intro",
] as const;

const expectedBossAndResultAudioKeys = [
  "lu-bu-unmatched-pressure",
  "lu-bu-warlord-recovery",
  "game-win",
  "game-lose",
] as const;

describe("chapter one P0 TTS batch manifest", () => {
  it("exports exactly the imported ready P0 batch items", () => {
    expect(CHAPTER_1_TTS_P0_BATCH_MANIFEST).toHaveLength(20);
    expect(CHAPTER_1_TTS_P0_BATCH_MANIFEST.every((item) => item.priority === "P0")).toBe(true);
    expect(CHAPTER_1_TTS_P0_BATCH_MANIFEST.every((item) => item.status === "ready")).toBe(true);
  });

  it("contains stage intros, enemy intros, boss traits, and result narration", () => {
    expect(CHAPTER_1_TTS_P0_BATCH_MANIFEST.map((item) => item.audioKey)).toEqual([
      ...expectedStageIntroAudioKeys,
      ...expectedEnemyIntroAudioKeys,
      ...expectedBossAndResultAudioKeys,
    ]);
  });

  it("keeps non-batch ready audioKeys out of the batch", () => {
    expect(CHAPTER_1_TTS_P0_BATCH_MANIFEST.map((item) => item.audioKey)).not.toEqual(
      expect.arrayContaining([
        "chapter-1-intro",
        "guan-yu-preview",
        "zhao-yun-preview",
        "zhuge-liang-preview",
        "guan-yu-intro",
        "zhao-yun-intro",
        "zhuge-liang-intro",
        "lu-bu-intro",
      ]),
    );
  });

  it("preserves detailed fields from the TTS dialogue manifest", () => {
    CHAPTER_1_TTS_P0_BATCH_MANIFEST.forEach((item, index) => {
      const ttsAsset = getTtsAssetByAudioKey(item.audioKey);

      expect(item.index).toBe(index + 1);
      expect(item.fileName).toBe(`${item.audioKey}.mp3`);
      expect(item.filePath.endsWith(`/${item.fileName}`)).toBe(true);
      expect(ttsAsset).toMatchObject({
        audioKey: item.audioKey,
        speakerName: item.speakerName,
        speakerType: item.speakerType,
        trigger: item.trigger,
        text: item.text,
        tone: item.tone,
        suggestedVoice: item.suggestedVoice,
        suggestedSpeed: item.suggestedSpeed,
        filePath: item.filePath,
        usage: item.usage,
        status: "ready",
      });
    });
  });

  it("provides a JSON manifest matching the TypeScript export", () => {
    expect(ttsBatchP0Json).toMatchObject({
      version: "v0.18.3",
      title: "第一章 P0 TTS 導入版",
      language: "繁體中文",
      format: "mp3",
      status: "ready",
      count: 20,
    });
    expect(ttsBatchP0Json.items).toEqual(CHAPTER_1_TTS_P0_BATCH_MANIFEST);
  });
});
