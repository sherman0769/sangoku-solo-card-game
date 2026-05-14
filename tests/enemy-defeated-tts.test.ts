import { describe, expect, it } from "vitest";
import { getEnemyDefeatedDialogue } from "@/lib/game/dialogues";
import { getTtsAssetByAudioKey } from "@/lib/game/ttsManifest";
import { canPlayVoice } from "@/lib/game/voice";

const enemyDefeatedVoicePaths = {
  "yellow-turban-soldier-defeated": "/audio/voices/enemies/yellow-turban-soldier-defeated.mp3",
  "yellow-turban-archer-defeated": "/audio/voices/enemies/yellow-turban-archer-defeated.mp3",
  "yellow-turban-brute-defeated": "/audio/voices/enemies/yellow-turban-brute-defeated.mp3",
  "bandit-leader-defeated": "/audio/voices/enemies/bandit-leader-defeated.mp3",
  "black-mountain-general-defeated": "/audio/voices/enemies/black-mountain-general-defeated.mp3",
  "xiliang-cavalry-defeated": "/audio/voices/enemies/xiliang-cavalry-defeated.mp3",
  "zhang-liang-defeated": "/audio/voices/enemies/zhang-liang-defeated.mp3",
  "zhang-bao-defeated": "/audio/voices/enemies/zhang-bao-defeated.mp3",
  "lu-bu-defeated": "/audio/voices/enemies/lu-bu-defeated.mp3",
} as const;

const enemyIdsByAudioKey = {
  "yellow-turban-soldier-defeated": "yellow-turban-soldier",
  "yellow-turban-archer-defeated": "yellow-turban-archer",
  "yellow-turban-brute-defeated": "yellow-turban-brute",
  "bandit-leader-defeated": "bandit-leader",
  "black-mountain-general-defeated": "black-mountain-general",
  "xiliang-cavalry-defeated": "xiliang-cavalry",
  "zhang-liang-defeated": "zhang-liang",
  "zhang-bao-defeated": "zhang-bao",
  "lu-bu-defeated": "lu-bu",
} as const;

describe("enemy defeated TTS import", () => {
  it("marks all enemy defeated audioKeys as ready and playable", () => {
    Object.entries(enemyDefeatedVoicePaths).forEach(([audioKey, filePath]) => {
      expect(getTtsAssetByAudioKey(audioKey)).toMatchObject({
        audioKey,
        filePath,
        status: "ready",
        trigger: "enemy_defeated",
      });
      expect(canPlayVoice(audioKey)).toBe(true);
    });
  });

  it("maps enemy defeated dialogues to the ready audioKeys", () => {
    Object.entries(enemyIdsByAudioKey).forEach(([audioKey, enemyId]) => {
      expect(getEnemyDefeatedDialogue(enemyId)).toMatchObject({
        audioKey,
        trigger: "enemy_defeated",
      });
    });
  });

  it("uses Lu Bu defeated voice for Lu Bu defeated narration", () => {
    expect(getEnemyDefeatedDialogue("lu-bu")).toMatchObject({
      audioKey: "lu-bu-defeated",
      text: "虎牢關前，戰神退去，第一章至此落幕。",
    });
    expect(canPlayVoice("lu-bu-defeated")).toBe(true);
  });

  it("keeps route event TTS planned", () => {
    [
      "route-mountain-spring",
      "route-hermit-guidance",
      "route-misty-path",
      "route-post-station",
      "route-military-dispatch",
      "route-remnant-troops",
      "route-cliff-ambush",
      "route-battlefield-relic",
      "route-night-raid",
    ].forEach((audioKey) => {
      expect(getTtsAssetByAudioKey(audioKey)).toMatchObject({
        audioKey,
        status: "planned",
      });
      expect(canPlayVoice(audioKey)).toBe(false);
    });
  });
});
