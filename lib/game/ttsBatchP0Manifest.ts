import {
  CHAPTER_1_TTS_GAP_MANIFEST,
  type TtsGapCategory,
} from "./ttsGapManifest";
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
  status: "planned";
}

export const CHAPTER_1_TTS_P0_BATCH_MANIFEST: TtsBatchP0Item[] = CHAPTER_1_TTS_GAP_MANIFEST
  .filter((gap) => gap.priority === "P0")
  .map((gap, index) => {
    const asset = getTtsAssetByAudioKey(gap.audioKey);

    if (!asset || asset.status !== "planned") {
      throw new Error(`Missing planned P0 TTS asset: ${gap.audioKey}`);
    }

    return {
      index: index + 1,
      category: gap.category,
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
