import { describe, expect, it } from "vitest";
import { CHAPTER_1_TTS_P0_BATCH_MANIFEST } from "@/lib/game/ttsBatchP0Manifest";
import { CHAPTER_1_TTS_GAP_MANIFEST } from "@/lib/game/ttsGapManifest";
import { getTtsAssetByAudioKey } from "@/lib/game/ttsManifest";
import { canPlayVoice } from "@/lib/game/voice";

const p0ReadyVoicePaths = {
  "stage-1-intro": "/audio/narration/stage-1-intro.mp3",
  "stage-2-intro": "/audio/narration/stage-2-intro.mp3",
  "stage-3-intro": "/audio/narration/stage-3-intro.mp3",
  "stage-4-intro": "/audio/narration/stage-4-intro.mp3",
  "stage-5-intro": "/audio/narration/stage-5-intro.mp3",
  "stage-6-intro": "/audio/narration/stage-6-intro.mp3",
  "stage-7-intro": "/audio/narration/stage-7-intro.mp3",
  "stage-8-intro": "/audio/narration/stage-8-intro.mp3",
  "yellow-turban-soldier-intro": "/audio/voices/enemies/yellow-turban-soldier-intro.mp3",
  "yellow-turban-archer-intro": "/audio/voices/enemies/yellow-turban-archer-intro.mp3",
  "yellow-turban-brute-intro": "/audio/voices/enemies/yellow-turban-brute-intro.mp3",
  "bandit-leader-intro": "/audio/voices/enemies/bandit-leader-intro.mp3",
  "black-mountain-general-intro": "/audio/voices/enemies/black-mountain-general-intro.mp3",
  "xiliang-cavalry-intro": "/audio/voices/enemies/xiliang-cavalry-intro.mp3",
  "zhang-liang-intro": "/audio/voices/enemies/zhang-liang-intro.mp3",
  "zhang-bao-intro": "/audio/voices/enemies/zhang-bao-intro.mp3",
  "lu-bu-unmatched-pressure": "/audio/voices/lu-bu/lu-bu-unmatched-pressure.mp3",
  "lu-bu-warlord-recovery": "/audio/voices/lu-bu/lu-bu-warlord-recovery.mp3",
  "game-win": "/audio/narration/game-win.mp3",
  "game-lose": "/audio/narration/game-lose.mp3",
} as const;

const existingReadyVoiceKeys = [
  "chapter-1-intro",
  "guan-yu-preview",
  "zhao-yun-preview",
  "zhuge-liang-preview",
  "guan-yu-intro",
  "zhao-yun-intro",
  "zhuge-liang-intro",
  "lu-bu-intro",
] as const;

describe("chapter one P0 TTS voice import", () => {
  it("marks all imported P0 audioKeys as ready with playable public paths", () => {
    Object.entries(p0ReadyVoicePaths).forEach(([audioKey, filePath]) => {
      expect(getTtsAssetByAudioKey(audioKey)).toMatchObject({
        audioKey,
        filePath,
        status: "ready",
      });
      expect(canPlayVoice(audioKey)).toBe(true);
    });
  });

  it("keeps the P0 batch manifest aligned with ready assets", () => {
    expect(CHAPTER_1_TTS_P0_BATCH_MANIFEST).toHaveLength(20);
    expect(CHAPTER_1_TTS_P0_BATCH_MANIFEST.map((item) => item.audioKey)).toEqual(
      Object.keys(p0ReadyVoicePaths),
    );
    expect(CHAPTER_1_TTS_P0_BATCH_MANIFEST.every((item) => item.status === "ready")).toBe(true);
  });

  it("keeps P1 and P2 gaps planned", () => {
    expect(CHAPTER_1_TTS_GAP_MANIFEST).toHaveLength(33);
    expect(CHAPTER_1_TTS_GAP_MANIFEST.every((item) => item.status === "planned")).toBe(true);
    expect(CHAPTER_1_TTS_GAP_MANIFEST.every((item) => item.priority === "P1" || item.priority === "P2")).toBe(true);
    CHAPTER_1_TTS_GAP_MANIFEST.forEach((gap) => {
      expect(getTtsAssetByAudioKey(gap.audioKey)).toMatchObject({
        audioKey: gap.audioKey,
        status: "planned",
      });
      expect(canPlayVoice(gap.audioKey)).toBe(false);
    });
  });

  it("keeps existing preview and hero intro voices ready", () => {
    existingReadyVoiceKeys.forEach((audioKey) => {
      expect(getTtsAssetByAudioKey(audioKey)).toMatchObject({
        audioKey,
        status: "ready",
      });
      expect(canPlayVoice(audioKey)).toBe(true);
    });
  });
});
