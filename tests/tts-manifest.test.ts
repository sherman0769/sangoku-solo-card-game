import { describe, expect, it } from "vitest";
import { dialogueLines } from "@/lib/game/dialogues";
import {
  getTtsAssetByAudioKey,
  TTS_DIALOGUE_MANIFEST,
} from "@/lib/game/ttsManifest";

describe("TTS dialogue manifest", () => {
  it("contains planned TTS assets with required fields", () => {
    expect(TTS_DIALOGUE_MANIFEST.length).toBeGreaterThan(0);

    TTS_DIALOGUE_MANIFEST.forEach((asset) => {
      expect(asset.audioKey.length).toBeGreaterThan(0);
      expect(asset.speakerName.length).toBeGreaterThan(0);
      expect(asset.speakerType.length).toBeGreaterThan(0);
      expect(asset.trigger.length).toBeGreaterThan(0);
      expect(asset.text.length).toBeGreaterThan(0);
      expect(asset.filePath.length).toBeGreaterThan(0);
      expect(asset.status).toBe("planned");
    });
  });

  it("includes the required first voice planning set", () => {
    expect(getTtsAssetByAudioKey("guan-yu-intro")).toMatchObject({
      speakerName: "關羽",
      trigger: "hero_intro",
      filePath: "public/audio/voices/guan-yu/guan-yu-intro.mp3",
    });
    expect(getTtsAssetByAudioKey("zhao-yun-dodge")).toMatchObject({
      speakerName: "趙雲",
      trigger: "use_dodge",
    });
    expect(getTtsAssetByAudioKey("zhuge-liang-strategy")).toMatchObject({
      speakerName: "諸葛亮",
      trigger: "use_strategy",
    });
    expect(getTtsAssetByAudioKey("lu-bu-intro")).toMatchObject({
      speakerName: "呂布",
      trigger: "boss_intro",
      filePath: "public/audio/voices/lu-bu/lu-bu-intro.mp3",
    });
    expect(getTtsAssetByAudioKey("narrator-chapter-1-intro")).toMatchObject({
      speakerName: "旁白",
      trigger: "chapter_intro",
      filePath: "public/audio/narration/chapter-1-intro.mp3",
    });
  });

  it("maps every dialogue audioKey to a planned TTS asset", () => {
    dialogueLines.forEach((line) => {
      const audioKey = line.audioKey;
      expect(audioKey).toBeTruthy();

      if (!audioKey) {
        throw new Error(`Dialogue ${line.id} is missing audioKey`);
      }

      expect(getTtsAssetByAudioKey(audioKey)).toMatchObject({
        audioKey,
        text: line.text,
        trigger: line.trigger,
        status: "planned",
      });
    });
  });
});
