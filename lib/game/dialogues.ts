import type { DialogueLine, DialogueTrigger, EnemyStage, HeroId } from "./types";

const heroPortraits: Record<HeroId, string> = {
  "guan-yu": "/images/heroes/guan-yu.png",
  "zhao-yun": "/images/heroes/zhao-yun.png",
  "zhuge-liang": "/images/heroes/zhuge-liang.png",
  "li-shimin-ai-architect": "/images/heroes/li-shimin-ai-architect.png",
};

const enemyPortraits: Record<string, string> = {
  "yellow-turban-soldier": "/images/enemies/yellow-turban-soldier.png",
  "yellow-turban-archer": "/images/enemies/yellow-turban-archer.png",
  "yellow-turban-brute": "/images/enemies/yellow-turban-brute.png",
  "bandit-leader": "/images/enemies/bandit-leader.png",
  "black-mountain-general": "/images/enemies/black-mountain-general.png",
  "xiliang-cavalry": "/images/enemies/xiliang-cavalry.png",
  "zhang-liang": "/images/enemies/zhang-liang.png",
  "zhang-bao": "/images/enemies/zhang-bao.png",
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

  createHeroDialogue(
    "li-shimin-ai-architect",
    "李詩民",
    "hero_preview",
    "我是李詩民，用架構思維，重構這場亂世。",
    "沉穩、自信、教學感",
    "li-shimin-preview",
  ),
  createHeroDialogue(
    "li-shimin-ai-architect",
    "李詩民",
    "hero_intro",
    "問題先拆解，戰局再推演。",
    "沉穩、理性",
    "li-shimin-intro",
  ),
  createHeroDialogue(
    "li-shimin-ai-architect",
    "李詩民",
    "use_strategy",
    "不是硬打，是重構局面。",
    "冷靜、系統化",
    "li-shimin-strategy",
  ),
  createHeroDialogue(
    "li-shimin-ai-architect",
    "李詩民",
    "take_damage",
    "系統有波動，但尚未崩潰。",
    "穩住局勢",
    "li-shimin-damage",
  ),
  createHeroDialogue(
    "li-shimin-ai-architect",
    "李詩民",
    "low_hp",
    "進入高風險狀態，必須重新規劃。",
    "警覺、冷靜",
    "li-shimin-low-hp",
  ),
  createHeroDialogue(
    "li-shimin-ai-architect",
    "李詩民",
    "victory",
    "亂世不是靠蠻力破解，而是靠系統設計。",
    "沉穩、總結感",
    "li-shimin-victory",
  ),

  createEnemyDialogue(
    "yellow-turban-soldier",
    "黃巾兵",
    "enemy_intro",
    "蒼天已死，黃天當立！",
    "狂熱",
    "yellow-turban-soldier-intro",
  ),
  createEnemyDialogue(
    "yellow-turban-archer",
    "黃巾弓手",
    "enemy_intro",
    "賊軍弓手已就位，箭雨將至！",
    "警戒",
    "yellow-turban-archer-intro",
  ),
  createEnemyDialogue(
    "yellow-turban-brute",
    "黃巾力士",
    "enemy_intro",
    "黃巾力士踏地而來，巨力壓陣！",
    "沉重",
    "yellow-turban-brute-intro",
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
    "black-mountain-general",
    "黑山賊將",
    "enemy_intro",
    "黑山賊將據寨而守，休想輕易通過！",
    "沉穩",
    "black-mountain-general-intro",
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
    "zhang-liang",
    "張梁",
    "enemy_intro",
    "人公將軍張梁在此，黃天之威不容爾等侵犯！",
    "狂熱",
    "zhang-liang-intro",
  ),
  createEnemyDialogue(
    "zhang-bao",
    "張寶",
    "enemy_intro",
    "地公將軍張寶施法布陣，妖風已起。",
    "詭譎",
    "zhang-bao-intro",
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
    "yellow-turban-soldier-defeated",
    "enemy_defeated",
    "黃巾餘眾潰散，荒村暫得片刻安寧。",
    "戰後",
    "yellow-turban-soldier-defeated",
  ),
  createNarratorDialogue(
    "yellow-turban-archer-defeated",
    "enemy_defeated",
    "箭雨止息，山道重新露出前路。",
    "戰後",
    "yellow-turban-archer-defeated",
  ),
  createNarratorDialogue(
    "yellow-turban-brute-defeated",
    "enemy_defeated",
    "力士轟然倒地，黃巾軍勢為之一挫。",
    "戰後",
    "yellow-turban-brute-defeated",
  ),
  createNarratorDialogue(
    "bandit-leader-defeated",
    "enemy_defeated",
    "山賊首領敗退，黑山之路終於打開。",
    "戰後",
    "bandit-leader-defeated",
  ),
  createNarratorDialogue(
    "black-mountain-general-defeated",
    "enemy_defeated",
    "黑山賊將敗下陣來，寨中士氣潰散。",
    "戰後",
    "black-mountain-general-defeated",
  ),
  createNarratorDialogue(
    "xiliang-cavalry-defeated",
    "enemy_defeated",
    "鐵騎衝勢已斷，塵煙中只餘殘旗。",
    "戰後",
    "xiliang-cavalry-defeated",
  ),
  createNarratorDialogue(
    "zhang-liang-defeated",
    "enemy_defeated",
    "張梁怒吼未息，黃巾祭壇的火光卻已黯淡。",
    "戰後",
    "zhang-liang-defeated",
  ),
  createNarratorDialogue(
    "zhang-bao-defeated",
    "enemy_defeated",
    "妖風散去，張寶的術法終究難逆天命。",
    "戰後",
    "zhang-bao-defeated",
  ),
  createNarratorDialogue(
    "lu-bu-defeated",
    "enemy_defeated",
    "虎牢關前，戰神退去，第一章至此落幕。",
    "終章",
    "lu-bu-defeated",
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
    "stage-1-intro",
  ),
  createNarratorDialogue(
    "stage-2-intro",
    "stage_intro",
    "山道狹窄，伏兵隱於林間。",
    "伏擊",
    "stage-2-intro",
  ),
  createNarratorDialogue(
    "stage-3-intro",
    "stage_intro",
    "破廟燈火搖曳，敵影在夜色中逼近。",
    "夜戰",
    "stage-3-intro",
  ),
  createNarratorDialogue(
    "stage-4-intro",
    "stage_intro",
    "黑山賊寨盤踞山間，守備森嚴。",
    "壓迫",
    "stage-4-intro",
  ),
  createNarratorDialogue(
    "stage-5-intro",
    "stage_intro",
    "馬蹄聲急，西涼騎兵席捲而來。",
    "急迫",
    "stage-5-intro",
  ),
  createNarratorDialogue(
    "stage-6-intro",
    "stage_intro",
    "古戰場埋藏著舊日兵戈，也藏著未知危機。",
    "荒涼",
    "stage-6-intro",
  ),
  createNarratorDialogue(
    "stage-7-intro",
    "stage_intro",
    "祭壇妖風四起，黃巾殘部正進行詭異儀式。",
    "詭譎",
    "stage-7-intro",
  ),
  createNarratorDialogue(
    "stage-8-intro",
    "stage_intro",
    "虎牢關前，赤兔嘶鳴，真正的考驗終於降臨。",
    "決戰",
    "stage-8-intro",
  ),
  createNarratorDialogue(
    "route-mountain-spring",
    "route_event",
    "山風微涼，清泉洗去一路塵煙。",
    "休整",
    "route-mountain-spring",
  ),
  createNarratorDialogue(
    "route-hermit-guidance",
    "route_event",
    "隱士一語，勝過千軍探報。",
    "指引",
    "route-hermit-guidance",
  ),
  createNarratorDialogue(
    "route-misty-path",
    "route_event",
    "你避開了強敵，也失去了一部分準備時間。",
    "迷霧",
    "route-misty-path",
  ),
  createNarratorDialogue(
    "route-post-station",
    "route_event",
    "官道雖險，仍有殘存秩序可依。",
    "補給",
    "route-post-station",
  ),
  createNarratorDialogue(
    "route-military-dispatch",
    "route_event",
    "知敵先機，勝過一時勇武。",
    "情報",
    "route-military-dispatch",
  ),
  createNarratorDialogue(
    "route-remnant-troops",
    "route_event",
    "亂世之中，殘兵亦可成勢。",
    "支援",
    "route-remnant-troops",
  ),
  createNarratorDialogue(
    "route-cliff-ambush",
    "route_event",
    "險路藏殺機，也藏著更大的機會。",
    "危險",
    "route-cliff-ambush",
  ),
  createNarratorDialogue(
    "route-battlefield-relic",
    "route_event",
    "昔日名將遺物，仍在亂世中閃著寒光。",
    "稀有",
    "route-battlefield-relic",
  ),
  createNarratorDialogue(
    "route-night-raid",
    "route_event",
    "勝負只在一念之間。",
    "豪賭",
    "route-night-raid",
  ),
  createNarratorDialogue(
    "game-win",
    "game_win",
    "你突破虎牢關前的考驗，第一章：黃巾亂起，至此落幕。",
    "勝利",
    "game-win",
  ),
  createNarratorDialogue(
    "game-lose",
    "game_lose",
    "亂世無情，英雄亦有敗時。重整旗鼓，再入戰場。",
    "戰敗",
    "game-lose",
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

export function getEnemyDefeatedDialogue(enemyId: string) {
  return findDialogue(`${enemyId}-defeated`, "enemy_defeated");
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
