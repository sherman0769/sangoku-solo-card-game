import type { DialogueLine, DialogueTrigger, EnemyStage, HeroId } from "./types";

const heroPortraits: Record<HeroId, string> = {
  "guan-yu": "/images/heroes/guan-yu.png",
  "zhao-yun": "/images/heroes/zhao-yun.png",
  "zhuge-liang": "/images/heroes/zhuge-liang.png",
};

const enemyPortraits: Record<string, string> = {
  "yellow-turban-soldier": "/images/enemies/yellow-turban-soldier.png",
  "bandit-leader": "/images/enemies/bandit-leader.png",
  "xiliang-cavalry": "/images/enemies/xiliang-cavalry.png",
  "lu-bu": "/images/enemies/lu-bu.png",
};

export const dialogueLines: DialogueLine[] = [
  createHeroDialogue(
    "guan-yu",
    "關羽",
    "hero_preview",
    "吾乃關雲長，願以此刀，斬開亂世。",
    "威嚴、沉穩",
    "guan-yu-preview",
  ),
  createHeroDialogue("guan-yu", "關羽", "hero_intro", "關某在此，何人敢擋？", "威嚴", "guan-yu-intro"),
  createHeroDialogue(
    "guan-yu",
    "關羽",
    "battle_start",
    "賊寇當前，且看關某一刀破陣。",
    "昂揚",
    "guan-yu-battle-start",
  ),
  createHeroDialogue("guan-yu", "關羽", "use_slash", "看刀！", "攻擊", "guan-yu-slash"),
  createHeroDialogue("guan-yu", "關羽", "take_damage", "此傷不足懼。", "堅毅", "guan-yu-damage"),
  createHeroDialogue("guan-yu", "關羽", "low_hp", "此身尚在，義不容退。", "不屈", "guan-yu-low-hp"),
  createHeroDialogue("guan-yu", "關羽", "victory", "賊寇已破，前路仍遠。", "沉穩", "guan-yu-victory"),

  createHeroDialogue(
    "zhao-yun",
    "趙雲",
    "hero_preview",
    "常山趙子龍，聽候差遣。",
    "清亮、堅定",
    "zhao-yun-preview",
  ),
  createHeroDialogue(
    "zhao-yun",
    "趙雲",
    "hero_intro",
    "常山趙子龍，願護此路周全。",
    "從容",
    "zhao-yun-intro",
  ),
  createHeroDialogue(
    "zhao-yun",
    "趙雲",
    "battle_start",
    "敵勢雖眾，吾自往來破之。",
    "果決",
    "zhao-yun-battle-start",
  ),
  createHeroDialogue("zhao-yun", "趙雲", "use_slash", "銀槍所向，破！", "攻擊", "zhao-yun-slash"),
  createHeroDialogue(
    "zhao-yun",
    "趙雲",
    "use_dodge",
    "進退之間，皆有生路。",
    "靈動",
    "zhao-yun-dodge",
  ),
  createHeroDialogue("zhao-yun", "趙雲", "take_damage", "無妨，尚能再戰。", "堅定", "zhao-yun-damage"),
  createHeroDialogue("zhao-yun", "趙雲", "victory", "此戰已定，繼續前行。", "從容", "zhao-yun-victory"),

  createHeroDialogue(
    "zhuge-liang",
    "諸葛亮",
    "hero_preview",
    "既入此局，便當謀定而後動。",
    "沉著、智慧",
    "zhuge-liang-preview",
  ),
  createHeroDialogue(
    "zhuge-liang",
    "諸葛亮",
    "hero_intro",
    "觀天時，察地利，方能制勝。",
    "睿智",
    "zhuge-liang-intro",
  ),
  createHeroDialogue(
    "zhuge-liang",
    "諸葛亮",
    "battle_start",
    "此局未動，勝機已藏。",
    "沉著",
    "zhuge-liang-battle-start",
  ),
  createHeroDialogue(
    "zhuge-liang",
    "諸葛亮",
    "use_strategy",
    "星象已明，勝機在此。",
    "策略",
    "zhuge-liang-strategy",
  ),
  createHeroDialogue(
    "zhuge-liang",
    "諸葛亮",
    "take_damage",
    "兵行險著，仍在算中。",
    "冷靜",
    "zhuge-liang-damage",
  ),
  createHeroDialogue(
    "zhuge-liang",
    "諸葛亮",
    "low_hp",
    "局勢危急，須另尋轉機。",
    "危急",
    "zhuge-liang-low-hp",
  ),
  createHeroDialogue("zhuge-liang", "諸葛亮", "victory", "此局，尚在掌中。", "自信", "zhuge-liang-victory"),

  createEnemyDialogue(
    "yellow-turban-soldier",
    "黃巾兵",
    "enemy_intro",
    "蒼天已死，黃天當立！",
    "狂熱",
    "yellow-turban-soldier-intro",
  ),
  createEnemyDialogue(
    "bandit-leader",
    "山賊頭目",
    "enemy_intro",
    "此山是我開，想過此路，留下性命！",
    "兇狠",
    "bandit-leader-intro",
  ),
  createEnemyDialogue(
    "xiliang-cavalry",
    "西涼騎兵",
    "enemy_intro",
    "西涼鐵騎至，誰敢擋路！",
    "壓迫",
    "xiliang-cavalry-intro",
  ),
  createEnemyDialogue(
    "lu-bu",
    "呂布",
    "boss_intro",
    "吾乃呂布，誰敢與我一戰？",
    "霸氣",
    "lu-bu-intro",
  ),
  createEnemyDialogue(
    "lu-bu",
    "呂布",
    "boss_trait",
    "天下群雄，誰能擋我？",
    "壓迫",
    "lu-bu-unmatched-pressure",
  ),
  createEnemyDialogue(
    "lu-bu",
    "呂布",
    "boss_recovery",
    "這點傷，也想取我性命？",
    "狂傲",
    "lu-bu-warlord-recovery",
  ),

  createNarratorDialogue(
    "chapter-1-intro",
    "chapter_intro",
    "第一章：黃巾亂起。亂世初開，烽煙四起，一名英雄踏上了通往虎牢關的道路。",
    "開場",
    "chapter-1-intro",
  ),
  createNarratorDialogue(
    "stage-1-intro",
    "stage_intro",
    "荒村煙塵未散，黃巾餘黨仍在掠奪糧草。",
    "敘事",
    "narrator-stage-1-intro",
  ),
  createNarratorDialogue(
    "stage-8-intro",
    "stage_intro",
    "虎牢關前，赤兔嘶鳴，真正的考驗終於降臨。",
    "決戰",
    "narrator-stage-8-intro",
  ),
  createNarratorDialogue(
    "game-win",
    "game_win",
    "你突破虎牢關前的考驗，第一章：黃巾亂起，至此落幕。",
    "勝利",
    "narrator-game-win",
  ),
  createNarratorDialogue(
    "game-lose",
    "game_lose",
    "亂世無情，英雄亦有敗時。重整旗鼓，再入戰場。",
    "戰敗",
    "narrator-game-lose",
  ),
];

export function getHeroDialogue(heroId: string, trigger: DialogueTrigger) {
  return findDialogue(heroId, trigger);
}

export function getEnemyIntroDialogue(enemyId: string, isBoss = false) {
  return findDialogue(enemyId, isBoss ? "boss_intro" : "enemy_intro");
}

export function getBossTraitDialogue(enemyId: string) {
  return findDialogue(enemyId, "boss_trait");
}

export function getBossRecoveryDialogue(enemyId: string) {
  return findDialogue(enemyId, "boss_recovery");
}

export function getChapterIntroDialogue() {
  return findDialogue("chapter-1-intro", "chapter_intro");
}

export function getStageIntroDialogue(stage: EnemyStage) {
  return findDialogue(`stage-${stage}-intro`, "stage_intro");
}

export function getGameResultDialogue(outcome: "won" | "lost") {
  return findDialogue(outcome === "won" ? "game-win" : "game-lose", outcome === "won" ? "game_win" : "game_lose");
}

export function getSpeakerTypeLabel(speakerType: DialogueLine["speakerType"]) {
  if (speakerType === "hero") {
    return "武將";
  }

  if (speakerType === "enemy") {
    return "敵人";
  }

  if (speakerType === "narrator") {
    return "旁白";
  }

  return "系統";
}

function findDialogue(speakerId: string, trigger: DialogueTrigger) {
  return dialogueLines.find((line) => line.speakerId === speakerId && line.trigger === trigger);
}

function createHeroDialogue(
  speakerId: HeroId,
  speakerName: string,
  trigger: DialogueTrigger,
  text: string,
  tone: string,
  audioKey: string,
): DialogueLine {
  return {
    id: `${speakerId}-${trigger}`,
    speakerId,
    speakerName,
    speakerType: "hero",
    trigger,
    text,
    tone,
    audioKey,
    portrait: heroPortraits[speakerId],
  };
}

function createEnemyDialogue(
  speakerId: string,
  speakerName: string,
  trigger: DialogueTrigger,
  text: string,
  tone: string,
  audioKey: string,
): DialogueLine {
  return {
    id: `${speakerId}-${trigger}`,
    speakerId,
    speakerName,
    speakerType: "enemy",
    trigger,
    text,
    tone,
    audioKey,
    portrait: enemyPortraits[speakerId],
  };
}

function createNarratorDialogue(
  speakerId: string,
  trigger: DialogueTrigger,
  text: string,
  tone: string,
  audioKey: string,
): DialogueLine {
  return {
    id: `${speakerId}-${trigger}`,
    speakerId,
    speakerName: "旁白",
    speakerType: "narrator",
    trigger,
    text,
    tone,
    audioKey,
  };
}
