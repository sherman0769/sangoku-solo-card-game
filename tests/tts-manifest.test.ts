import { describe, expect, it } from "vitest";
import { dialogueLines } from "@/lib/game/dialogues";
import {
  getTtsAssetByAudioKey,
  TTS_DIALOGUE_MANIFEST,
} from "@/lib/game/ttsManifest";

describe("TTS dialogue manifest", () => {
  it("contains TTS assets with required fields", () => {
    expect(TTS_DIALOGUE_MANIFEST.length).toBeGreaterThan(0);

    TTS_DIALOGUE_MANIFEST.forEach((asset) => {
      expect(asset.audioKey.length).toBeGreaterThan(0);
      expect(asset.speakerName.length).toBeGreaterThan(0);
      expect(asset.speakerType.length).toBeGreaterThan(0);
      expect(asset.trigger.length).toBeGreaterThan(0);
      expect(asset.text.length).toBeGreaterThan(0);
      expect(asset.filePath.length).toBeGreaterThan(0);
      expect(["planned", "generated", "ready"]).toContain(asset.status);
    });
  });

  it("includes the required first voice planning set", () => {
    expect(getTtsAssetByAudioKey("guan-yu-intro")).toMatchObject({
      speakerName: "關羽",
      trigger: "hero_intro",
      filePath: "/audio/voices/guan-yu/guan-yu-intro.mp3",
      status: "ready",
    });
    expect(getTtsAssetByAudioKey("zhao-yun-dodge")).toMatchObject({
      speakerName: "趙雲",
      trigger: "use_dodge",
      status: "planned",
    });
    expect(getTtsAssetByAudioKey("zhuge-liang-strategy")).toMatchObject({
      speakerName: "諸葛亮",
      trigger: "use_strategy",
      status: "planned",
    });
    expect(getTtsAssetByAudioKey("lu-bu-intro")).toMatchObject({
      speakerName: "呂布",
      trigger: "boss_intro",
      filePath: "/audio/voices/lu-bu/lu-bu-intro.mp3",
      status: "ready",
    });
    expect(getTtsAssetByAudioKey("chapter-1-intro")).toMatchObject({
      speakerName: "旁白",
      trigger: "chapter_intro",
      filePath: "/audio/narration/chapter-1-intro.mp3",
      status: "ready",
    });
  });

  it("includes planned homepage hero preview voice assets", () => {
    expect(getTtsAssetByAudioKey("guan-yu-preview")).toMatchObject({
      speakerName: "關羽",
      trigger: "hero_preview",
      text: "吾乃關雲長，願以此刀，斬開亂世。",
      filePath: "/audio/voices/guan-yu/guan-yu-preview.mp3",
      usage: "首頁武將選擇試聽，不同於遊戲內登場台詞",
      status: "planned",
    });
    expect(getTtsAssetByAudioKey("zhao-yun-preview")).toMatchObject({
      speakerName: "趙雲",
      trigger: "hero_preview",
      text: "常山趙子龍，聽候差遣。",
      filePath: "/audio/voices/zhao-yun/zhao-yun-preview.mp3",
      usage: "首頁武將選擇試聽，不同於遊戲內登場台詞",
      status: "planned",
    });
    expect(getTtsAssetByAudioKey("zhuge-liang-preview")).toMatchObject({
      speakerName: "諸葛亮",
      trigger: "hero_preview",
      text: "既入此局，便當謀定而後動。",
      filePath: "/audio/voices/zhuge-liang/zhuge-liang-preview.mp3",
      usage: "首頁武將選擇試聽，不同於遊戲內登場台詞",
      status: "planned",
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
      });
    });
  });
});
