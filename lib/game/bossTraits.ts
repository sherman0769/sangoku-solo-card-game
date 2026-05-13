import type { SoundCue } from "./sounds";
import type { BossTraitId } from "./types";

export const bossTraitCatalog: Record<
  BossTraitId,
  {
    name: string;
    shortName: string;
    description: string;
    alertTitle: string;
    alertSubtitle: string;
    feedbackText: string;
    logMarker: string;
    soundCue: SoundCue;
  }
> = {
  "unmatched-pressure": {
    name: "無雙壓迫",
    shortName: "無雙",
    description: "第一次猛攻第二段傷害 +1",
    alertTitle: "無雙壓迫！",
    alertSubtitle: "呂布猛攻第二段傷害 +1",
    feedbackText: "無雙！",
    logMarker: "👹",
    soundCue: "boss",
  },
  "warlord-recovery": {
    name: "戰神回血",
    shortName: "回血",
    description: "首次降到半血以下時回復 3 點體力",
    alertTitle: "戰神回血！",
    alertSubtitle: "呂布回復 3 點體力",
    feedbackText: "+3",
    logMarker: "🩸",
    soundCue: "boss",
  },
};

export function getBossTraitName(traitId: BossTraitId) {
  return bossTraitCatalog[traitId].name;
}

export function getBossTraitShortName(traitId: BossTraitId) {
  return bossTraitCatalog[traitId].shortName;
}

export function getBossTraitDescription(traitId: BossTraitId) {
  return bossTraitCatalog[traitId].description;
}

export function getBossTraitAlert(traitId: BossTraitId) {
  return {
    traitId,
    title: bossTraitCatalog[traitId].alertTitle,
    subtitle: bossTraitCatalog[traitId].alertSubtitle,
    feedbackText: bossTraitCatalog[traitId].feedbackText,
    soundCue: bossTraitCatalog[traitId].soundCue,
  };
}

export function getBossTraitLogMessage(traitId: BossTraitId, enemyName: string) {
  if (traitId === "unmatched-pressure") {
    return `${bossTraitCatalog[traitId].logMarker} ${enemyName}發動無雙壓迫，猛攻第二段傷害 +1！`;
  }

  return `${bossTraitCatalog[traitId].logMarker} ${enemyName}發動戰神回血，回復 3 點體力！`;
}

export function getBossTraitHudLabels(
  bossTraits: BossTraitId[],
  bossTraitUsage: Partial<Record<BossTraitId, boolean>>,
) {
  if (bossTraits.length === 0) {
    return [];
  }

  const summary = `Boss 特性：${bossTraits.map(getBossTraitShortName).join("、")}`;
  const triggered = bossTraits
    .filter((traitId) => bossTraitUsage[traitId])
    .map((traitId) => `${getBossTraitShortName(traitId)}已觸發`);

  return [summary, ...triggered];
}
