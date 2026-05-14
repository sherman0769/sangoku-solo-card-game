import { dialogueLines } from "./dialogues";
import type { DialogueLine } from "./types";

export type TtsAssetStatus = "planned" | "generated" | "ready";

export const ttsAssetStatuses = ["planned", "generated", "ready"] as const;

const readyVoiceFilePaths: Record<string, string> = {
  "chapter-1-intro": "/audio/narration/chapter-1-intro.mp3",
  "guan-yu-preview": "/audio/voices/guan-yu/guan-yu-preview.mp3",
  "guan-yu-intro": "/audio/voices/guan-yu/guan-yu-intro.mp3",
  "zhao-yun-preview": "/audio/voices/zhao-yun/zhao-yun-preview.mp3",
  "zhao-yun-intro": "/audio/voices/zhao-yun/zhao-yun-intro.mp3",
  "zhuge-liang-preview": "/audio/voices/zhuge-liang/zhuge-liang-preview.mp3",
  "zhuge-liang-intro": "/audio/voices/zhuge-liang/zhuge-liang-intro.mp3",
  "li-shimin-preview": "/audio/voices/li-shimin/li-shimin-preview.mp3",
  "li-shimin-intro": "/audio/voices/li-shimin/li-shimin-intro.mp3",
  "lu-bu-intro": "/audio/voices/lu-bu/lu-bu-intro.mp3",
  "stage-1-intro": "/audio/narration/stage-1-intro.mp3",
  "stage-2-intro": "/audio/narration/stage-2-intro.mp3",
  "stage-3-intro": "/audio/narration/stage-3-intro.mp3",
  "stage-4-intro": "/audio/narration/stage-4-intro.mp3",
  "stage-5-intro": "/audio/narration/stage-5-intro.mp3",
  "stage-6-intro": "/audio/narration/stage-6-intro.mp3",
  "stage-7-intro": "/audio/narration/stage-7-intro.mp3",
  "stage-8-intro": "/audio/narration/stage-8-intro.mp3",
  "game-win": "/audio/narration/game-win.mp3",
  "game-lose": "/audio/narration/game-lose.mp3",
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
  "yellow-turban-soldier-defeated": "/audio/voices/enemies/yellow-turban-soldier-defeated.mp3",
  "yellow-turban-archer-defeated": "/audio/voices/enemies/yellow-turban-archer-defeated.mp3",
  "yellow-turban-brute-defeated": "/audio/voices/enemies/yellow-turban-brute-defeated.mp3",
  "bandit-leader-defeated": "/audio/voices/enemies/bandit-leader-defeated.mp3",
  "black-mountain-general-defeated": "/audio/voices/enemies/black-mountain-general-defeated.mp3",
  "xiliang-cavalry-defeated": "/audio/voices/enemies/xiliang-cavalry-defeated.mp3",
  "zhang-liang-defeated": "/audio/voices/enemies/zhang-liang-defeated.mp3",
  "zhang-bao-defeated": "/audio/voices/enemies/zhang-bao-defeated.mp3",
  "lu-bu-defeated": "/audio/voices/enemies/lu-bu-defeated.mp3",
  "route-mountain-spring": "/audio/voices/route-events/route-mountain-spring.mp3",
  "route-hermit-guidance": "/audio/voices/route-events/route-hermit-guidance.mp3",
  "route-misty-path": "/audio/voices/route-events/route-misty-path.mp3",
  "route-post-station": "/audio/voices/route-events/route-post-station.mp3",
  "route-military-dispatch": "/audio/voices/route-events/route-military-dispatch.mp3",
  "route-remnant-troops": "/audio/voices/route-events/route-remnant-troops.mp3",
  "route-cliff-ambush": "/audio/voices/route-events/route-cliff-ambush.mp3",
  "route-battlefield-relic": "/audio/voices/route-events/route-battlefield-relic.mp3",
  "route-night-raid": "/audio/voices/route-events/route-night-raid.mp3",
};

export interface TtsDialogueAsset {
  audioKey: string;
  speakerId: string;
  speakerName: string;
  speakerType: DialogueLine["speakerType"];
  trigger: DialogueLine["trigger"];
  text: string;
  tone: string;
  suggestedVoice: string;
  suggestedSpeed: string;
  filePath: string;
  usage: string;
  status: TtsAssetStatus;
}

export const TTS_DIALOGUE_MANIFEST: TtsDialogueAsset[] = dialogueLines.map((line) => {
  const audioKey = line.audioKey ?? line.id;

  return {
    audioKey,
    speakerId: line.speakerId,
    speakerName: line.speakerName,
    speakerType: line.speakerType,
    trigger: line.trigger,
    text: line.text,
    tone: line.tone,
    suggestedVoice: getSuggestedVoice(line),
    suggestedSpeed: getSuggestedSpeed(line),
    filePath: getSuggestedFilePath(line, audioKey),
    usage: getUsage(line),
    status: getTtsAssetStatus(audioKey),
  };
});

export function getTtsAssetByAudioKey(audioKey: string) {
  return TTS_DIALOGUE_MANIFEST.find((asset) => asset.audioKey === audioKey);
}

function getSuggestedVoice(line: DialogueLine) {
  if (line.speakerId === "guan-yu") {
    return "關羽：低沉、厚實、威嚴";
  }

  if (line.speakerId === "zhao-yun") {
    return "趙雲：年輕、清亮、堅定";
  }

  if (line.speakerId === "zhuge-liang") {
    return "諸葛亮：沉著、智慧、溫和";
  }

  if (line.speakerId === "li-shimin-ai-architect") {
    return "李詩民：沉穩、自信、理性、具教學感";
  }

  if (line.speakerId === "lu-bu") {
    return "呂布：低沉、強勢、壓迫感";
  }

  if (line.speakerType === "narrator") {
    return "旁白：成熟、穩定、史詩敘事";
  }

  return "敵人：粗獷、緊張、戰場感";
}

function getSuggestedSpeed(line: DialogueLine) {
  if (line.speakerId === "zhao-yun") {
    return "中速";
  }

  return "中慢速";
}

function getSuggestedFilePath(line: DialogueLine, audioKey: string) {
  const readyFilePath = readyVoiceFilePaths[audioKey];

  if (readyFilePath) {
    return readyFilePath;
  }

  if (line.speakerId === "guan-yu") {
    return `public/audio/voices/guan-yu/${audioKey}.mp3`;
  }

  if (line.speakerId === "zhao-yun") {
    return `public/audio/voices/zhao-yun/${audioKey}.mp3`;
  }

  if (line.speakerId === "zhuge-liang") {
    return `public/audio/voices/zhuge-liang/${audioKey}.mp3`;
  }

  if (line.speakerId === "li-shimin-ai-architect") {
    return `public/audio/voices/li-shimin/${audioKey}.mp3`;
  }

  if (line.speakerId === "lu-bu") {
    return `public/audio/voices/lu-bu/${audioKey}.mp3`;
  }

  if (line.speakerType === "narrator") {
    return `public/audio/narration/${audioKey.replace(/^narrator-/, "")}.mp3`;
  }

  return `public/audio/voices/enemies/${audioKey}.mp3`;
}

function getTtsAssetStatus(audioKey: string): TtsAssetStatus {
  return readyVoiceFilePaths[audioKey] ? "ready" : "planned";
}

function getUsage(line: DialogueLine) {
  const usageByTrigger: Record<DialogueLine["trigger"], string> = {
    hero_preview: "首頁武將選擇試聽語音，不同於遊戲內登場台詞",
    hero_intro: "選擇武將並建立遊戲時播放",
    battle_start: "每場戰鬥開始時播放",
    use_slash: "使用斬或攻擊行為時播放",
    use_dodge: "使用閃或龍膽防禦時播放",
    use_strategy: "觀星或策略行為時播放",
    take_damage: "玩家受到傷害時播放",
    low_hp: "每場戰鬥首次低血量時播放",
    victory: "擊敗敵人後播放",
    enemy_intro: "一般敵人登場時播放",
    enemy_defeated: "敵人被擊敗後播放",
    boss_intro: "Boss 登場時播放",
    boss_trait: "Boss 特性觸發時播放",
    boss_recovery: "Boss 回血特性觸發時播放",
    chapter_intro: "章節開場或開頭動畫旁白",
    stage_intro: "指定關卡開場旁白",
    route_event: "路線事件旁白",
    game_win: "通關結果頁旁白",
    game_lose: "戰敗結果頁旁白",
  };

  return usageByTrigger[line.trigger];
}
