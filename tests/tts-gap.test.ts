import { describe, expect, it } from "vitest";
import { CHAPTER_1_TTS_GAP_MANIFEST } from "@/lib/game/ttsGapManifest";
import { getTtsAssetByAudioKey } from "@/lib/game/ttsManifest";

const stageIntroAudioKeys = [
  "stage-1-intro",
  "stage-2-intro",
  "stage-3-intro",
  "stage-4-intro",
  "stage-5-intro",
  "stage-6-intro",
  "stage-7-intro",
  "stage-8-intro",
] as const;

const enemyIntroAudioKeys = [
  "yellow-turban-soldier-intro",
  "yellow-turban-archer-intro",
  "yellow-turban-brute-intro",
  "bandit-leader-intro",
  "black-mountain-general-intro",
  "xiliang-cavalry-intro",
  "zhang-liang-intro",
  "zhang-bao-intro",
  "lu-bu-intro",
] as const;

const enemyDefeatedAudioKeys = [
  "yellow-turban-soldier-defeated",
  "yellow-turban-archer-defeated",
  "yellow-turban-brute-defeated",
  "bandit-leader-defeated",
  "black-mountain-general-defeated",
  "xiliang-cavalry-defeated",
  "zhang-liang-defeated",
  "zhang-bao-defeated",
  "lu-bu-defeated",
] as const;

const routeEventAudioKeys = [
  "route-mountain-spring",
  "route-hermit-guidance",
  "route-misty-path",
  "route-post-station",
  "route-military-dispatch",
  "route-remnant-troops",
  "route-cliff-ambush",
  "route-battlefield-relic",
  "route-night-raid",
] as const;

describe("chapter one TTS gap manifest", () => {
  it("contains planned chapter one TTS gaps", () => {
    expect(CHAPTER_1_TTS_GAP_MANIFEST).toHaveLength(33);
    expect(CHAPTER_1_TTS_GAP_MANIFEST.every((item) => item.status === "planned")).toBe(true);
  });

  it("excludes imported stage one through stage eight intro voices from the remaining gaps", () => {
    stageIntroAudioKeys.forEach((audioKey) => {
      expect(getTtsAssetByAudioKey(audioKey)).toMatchObject({
        audioKey,
        status: "ready",
      });
    });

    expect(CHAPTER_1_TTS_GAP_MANIFEST.map((item) => item.audioKey)).not.toEqual(
      expect.arrayContaining([...stageIntroAudioKeys]),
    );
  });

  it("keeps chapter enemy intro audioKeys in the TTS manifest while excluding ready voices from gaps", () => {
    enemyIntroAudioKeys.forEach((audioKey) => {
      expect(getTtsAssetByAudioKey(audioKey)).toMatchObject({
        audioKey,
        status: "ready",
      });
    });

    expect(CHAPTER_1_TTS_GAP_MANIFEST.map((item) => item.audioKey)).not.toEqual(
      expect.arrayContaining([...enemyIntroAudioKeys]),
    );
  });

  it("includes nine enemy defeated narration gaps", () => {
    expect(CHAPTER_1_TTS_GAP_MANIFEST.map((item) => item.audioKey)).toEqual(
      expect.arrayContaining([...enemyDefeatedAudioKeys]),
    );
  });

  it("includes nine route event narration gaps", () => {
    expect(CHAPTER_1_TTS_GAP_MANIFEST.map((item) => item.audioKey)).toEqual(
      expect.arrayContaining([...routeEventAudioKeys]),
    );
  });

  it("excludes imported game win and game lose narration from the remaining gaps", () => {
    expect(getTtsAssetByAudioKey("game-win")).toMatchObject({
      audioKey: "game-win",
      status: "ready",
    });
    expect(getTtsAssetByAudioKey("game-lose")).toMatchObject({
      audioKey: "game-lose",
      status: "ready",
    });
    expect(CHAPTER_1_TTS_GAP_MANIFEST.map((item) => item.audioKey)).not.toEqual(
      expect.arrayContaining(["game-win", "game-lose"]),
    );
  });

  it("maps every gap audioKey to a planned TTS manifest asset", () => {
    CHAPTER_1_TTS_GAP_MANIFEST.forEach((gap) => {
      expect(getTtsAssetByAudioKey(gap.audioKey)).toMatchObject({
        audioKey: gap.audioKey,
        status: "planned",
      });
    });
  });

  it("excludes already ready preview, intro, and imported P0 audioKeys", () => {
    expect(CHAPTER_1_TTS_GAP_MANIFEST.map((item) => item.audioKey)).not.toEqual(
      expect.arrayContaining([
        "chapter-1-intro",
        "guan-yu-preview",
        "zhao-yun-preview",
        "zhuge-liang-preview",
        "guan-yu-intro",
        "zhao-yun-intro",
        "zhuge-liang-intro",
        "lu-bu-intro",
        ...stageIntroAudioKeys,
        ...enemyIntroAudioKeys,
        "lu-bu-unmatched-pressure",
        "lu-bu-warlord-recovery",
        "game-win",
        "game-lose",
      ]),
    );
  });

  it("keeps the expected priority distribution", () => {
    const countByPriority = CHAPTER_1_TTS_GAP_MANIFEST.reduce<Record<string, number>>((counts, item) => {
      counts[item.priority] = (counts[item.priority] ?? 0) + 1;
      return counts;
    }, {});

    expect(countByPriority).toEqual({
      P1: 18,
      P2: 15,
    });
  });
});
