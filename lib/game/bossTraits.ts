import type { BossTraitId } from "./types";

export const bossTraitCatalog: Record<
  BossTraitId,
  {
    name: string;
    shortName: string;
    description: string;
  }
> = {
  "unmatched-pressure": {
    name: "無雙壓迫",
    shortName: "無雙",
    description: "第一次猛攻第二段傷害 +1",
  },
  "warlord-recovery": {
    name: "戰神回血",
    shortName: "回血",
    description: "首次降到半血以下時回復 3 點體力",
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
