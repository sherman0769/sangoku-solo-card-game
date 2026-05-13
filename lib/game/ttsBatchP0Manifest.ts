import { type TtsGapCategory } from "./ttsGapManifest";
import {
  getTtsAssetByAudioKey,
  type TtsDialogueAsset,
} from "./ttsManifest";

export interface TtsBatchP0Item {
  index: number;
  category: TtsGapCategory;
  priority: "P0";
  audioKey: string;
  fileName: string;
  speakerName: string;
  speakerType: TtsDialogueAsset["speakerType"];
  trigger: TtsDialogueAsset["trigger"];
  text: string;
  tone: string;
  suggestedVoice: string;
  suggestedSpeed: string;
  filePath: string;
  usage: string;
  status: "ready";
}

const chapterOneP0BatchTargets: Array<{
  audioKey: string;
  category: TtsGapCategory;
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
  ].map((audioKey) => ({
    audioKey,
    category: "enemy_intro" as const,
  })),
  ...[
    "lu-bu-unmatched-pressure",
    "lu-bu-warlord-recovery",
  ].map((audioKey) => ({
    audioKey,
    category: "boss_trait" as const,
  })),
  ...["game-win", "game-lose"].map((audioKey) => ({
    audioKey,
    category: "game_result" as const,
  })),
];

export const CHAPTER_1_TTS_P0_BATCH_MANIFEST: TtsBatchP0Item[] = chapterOneP0BatchTargets
  .map((target, index) => {
    const asset = getTtsAssetByAudioKey(target.audioKey);

    if (!asset || asset.status !== "ready") {
      throw new Error(`Missing ready P0 TTS asset: ${target.audioKey}`);
    }

    return {
      index: index + 1,
      category: target.category,
      priority: "P0",
      audioKey: asset.audioKey,
      fileName: getFileName(asset.filePath),
      speakerName: asset.speakerName,
      speakerType: asset.speakerType,
      trigger: asset.trigger,
      text: asset.text,
      tone: asset.tone,
      suggestedVoice: asset.suggestedVoice,
      suggestedSpeed: asset.suggestedSpeed,
      filePath: asset.filePath,
      usage: asset.usage,
      status: asset.status,
    };
  });

function getFileName(filePath: string) {
  return filePath.split("/").at(-1) ?? filePath;
}
