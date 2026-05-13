import {
  getTtsAssetByAudioKey,
  type TtsAssetStatus,
} from "./ttsManifest";

export type TtsGapPriority = "P0" | "P1" | "P2";

export type TtsGapCategory =
  | "stage_intro"
  | "enemy_intro"
  | "boss_trait"
  | "game_result"
  | "enemy_defeated"
  | "route_event"
  | "hero_combat";

export interface TtsGapItem {
  audioKey: string;
  category: TtsGapCategory;
  priority: TtsGapPriority;
  speakerName: string;
  text: string;
  filePath: string;
  suggestedVoice: string;
  status: Extract<TtsAssetStatus, "planned">;
}

const chapterOneGapTargets: Array<{
  audioKey: string;
  category: TtsGapCategory;
  priority: TtsGapPriority;
}> = [
  ...[
    "stage-1-intro",
    "stage-2-intro",
    "stage-3-intro",
    "stage-4-intro",
    "stage-5-intro",
    "stage-6-intro",
    "stage-7-intro",
    "stage-8-intro",
  ].map((audioKey) => ({
    audioKey,
    category: "stage_intro" as const,
    priority: "P0" as const,
  })),
  ...[
    "yellow-turban-soldier-intro",
    "yellow-turban-archer-intro",
    "yellow-turban-brute-intro",
    "bandit-leader-intro",
    "black-mountain-general-intro",
    "xiliang-cavalry-intro",
    "zhang-liang-intro",
    "zhang-bao-intro",
    "lu-bu-intro",
  ].map((audioKey) => ({
    audioKey,
    category: "enemy_intro" as const,
    priority: "P0" as const,
  })),
  ...[
    "lu-bu-unmatched-pressure",
    "lu-bu-warlord-recovery",
  ].map((audioKey) => ({
    audioKey,
    category: "boss_trait" as const,
    priority: "P0" as const,
  })),
  ...["game-win", "game-lose"].map((audioKey) => ({
    audioKey,
    category: "game_result" as const,
    priority: "P0" as const,
  })),
  ...[
    "yellow-turban-soldier-defeated",
    "yellow-turban-archer-defeated",
    "yellow-turban-brute-defeated",
    "bandit-leader-defeated",
    "black-mountain-general-defeated",
    "xiliang-cavalry-defeated",
    "zhang-liang-defeated",
    "zhang-bao-defeated",
    "lu-bu-defeated",
  ].map((audioKey) => ({
    audioKey,
    category: "enemy_defeated" as const,
    priority: "P1" as const,
  })),
  ...[
    "route-mountain-spring",
    "route-hermit-guidance",
    "route-misty-path",
    "route-post-station",
    "route-military-dispatch",
    "route-remnant-troops",
    "route-cliff-ambush",
    "route-battlefield-relic",
    "route-night-raid",
  ].map((audioKey) => ({
    audioKey,
    category: "route_event" as const,
    priority: "P1" as const,
  })),
  ...[
    "guan-yu-battle-start",
    "guan-yu-slash",
    "guan-yu-damage",
    "guan-yu-low-hp",
    "guan-yu-victory",
    "zhao-yun-battle-start",
    "zhao-yun-slash",
    "zhao-yun-dodge",
    "zhao-yun-damage",
    "zhao-yun-victory",
    "zhuge-liang-battle-start",
    "zhuge-liang-strategy",
    "zhuge-liang-damage",
    "zhuge-liang-low-hp",
    "zhuge-liang-victory",
  ].map((audioKey) => ({
    audioKey,
    category: "hero_combat" as const,
    priority: "P2" as const,
  })),
];

export const CHAPTER_1_TTS_GAP_MANIFEST: TtsGapItem[] = chapterOneGapTargets
  .map((target) => {
    const asset = getTtsAssetByAudioKey(target.audioKey);

    if (!asset || asset.status !== "planned") {
      return undefined;
    }

    return {
      audioKey: asset.audioKey,
      category: target.category,
      priority: target.priority,
      speakerName: asset.speakerName,
      text: asset.text,
      filePath: asset.filePath,
      suggestedVoice: asset.suggestedVoice,
      status: asset.status,
    };
  })
  .filter((item): item is TtsGapItem => Boolean(item));
