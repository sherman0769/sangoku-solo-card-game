export type CardImageStatus = "planned" | "ready";

export type CardImagePriority = "P0" | "P1";

export type CardImageType = "basic" | "tactic" | "equipment";

export interface CardImageAsset {
  cardId: string;
  name: string;
  type: CardImageType;
  priority: CardImagePriority;
  aspectRatio: "4:3";
  path: string;
  promptZh: string;
  promptEn: string;
  negativePrompt: string;
  status: CardImageStatus;
}

const negativePrompt = "文字、Logo、水印、UI 邊框、現代武器、科幻裝備、血腥畫面、畸形手指、重複物件、低清晰度";

export const CARD_IMAGE_READY_MANIFEST: CardImageAsset[] = [
  {
    cardId: "slash",
    name: "斬",
    type: "basic",
    priority: "P0",
    aspectRatio: "4:3",
    path: "/images/cards/slash.png",
    promptZh: "三國亂世卡牌插圖，赤金刀光破空斬向敵陣，煙塵戰場背景，主體清楚，東方史詩卡牌風，半寫實，適合手機小卡顯示，無文字。",
    promptEn: "Three Kingdoms card illustration, red and gold blade light slashing through a battlefield, smoky war background, clear central subject, eastern epic card style, semi-realistic, readable on small mobile cards, no text.",
    negativePrompt,
    status: "ready",
  },
  {
    cardId: "dodge",
    name: "閃",
    type: "basic",
    priority: "P0",
    aspectRatio: "4:3",
    path: "/images/cards/dodge.png",
    promptZh: "三國武者側身閃避箭矢與刀光，藍鐵色速度殘影，防禦卡牌意象，主體明確，東方史詩卡牌風，半寫實，無文字。",
    promptEn: "A Three Kingdoms warrior evading arrows and blade light, blue steel motion trails, defensive card imagery, clear central subject, eastern epic card style, semi-realistic, no text.",
    negativePrompt,
    status: "ready",
  },
  {
    cardId: "wine",
    name: "酒",
    type: "basic",
    priority: "P0",
    aspectRatio: "4:3",
    path: "/images/cards/wine.png",
    promptZh: "古代戰場中的酒壺與碗，綠金暖光象徵恢復與士氣，背景有模糊戰旗，主體清楚，三國卡牌插圖，半寫實，無文字。",
    promptEn: "An ancient wine jar and cup on a battlefield, green and gold warm light symbolizing recovery and morale, blurred banners in the background, clear subject, Three Kingdoms card illustration, semi-realistic, no text.",
    negativePrompt,
    status: "ready",
  },
  {
    cardId: "strategy-scroll",
    name: "兵書",
    type: "basic",
    priority: "P0",
    aspectRatio: "4:3",
    path: "/images/cards/strategy-scroll.png",
    promptZh: "竹簡兵書攤開，紫金與藍金策略光紋浮現，燭光軍帳背景，主體清楚，東方史詩卡牌風，半寫實，無文字。",
    promptEn: "Open bamboo strategy scrolls with purple-gold and blue-gold tactical light patterns, candlelit war tent background, clear subject, eastern epic card style, semi-realistic, no text.",
    negativePrompt,
    status: "ready",
  },
  {
    cardId: "armor-break",
    name: "破甲",
    type: "basic",
    priority: "P0",
    aspectRatio: "4:3",
    path: "/images/cards/armor-break.png",
    promptZh: "鋒刃擊碎古代甲片，紅金衝擊火花與破防氣勢，主體清楚，高辨識度小卡插圖，東方史詩卡牌風，半寫實，無文字。",
    promptEn: "A sharp blade shattering ancient armor plates, red-gold impact sparks and armor-breaking force, clear subject, high-readability small card illustration, eastern epic card style, semi-realistic, no text.",
    negativePrompt,
    status: "ready",
  },
  {
    cardId: "combo-slash",
    name: "連斬",
    type: "tactic",
    priority: "P1",
    aspectRatio: "4:3",
    path: "/images/cards/combo-slash.png",
    promptZh: "連續三道赤金刀光追擊敵陣，速度線與戰場煙塵，攻擊節奏強烈，主體清楚，三國戰術卡牌插圖，半寫實，無文字。",
    promptEn: "Three consecutive red-gold blade arcs pursuing enemies through battlefield dust, strong attack rhythm and speed lines, clear subject, Three Kingdoms tactic card illustration, semi-realistic, no text.",
    negativePrompt,
    status: "ready",
  },
  {
    cardId: "guard",
    name: "固守",
    type: "tactic",
    priority: "P1",
    aspectRatio: "4:3",
    path: "/images/cards/guard.png",
    promptZh: "古代盾陣固守，藍鐵色防護光幕與沉穩陣勢，主體清楚，防禦戰術卡牌插圖，東方史詩風，半寫實，無文字。",
    promptEn: "Ancient shield formation holding the line, blue steel protective aura and steady formation, clear subject, defensive tactic card illustration, eastern epic style, semi-realistic, no text.",
    negativePrompt,
    status: "ready",
  },
  {
    cardId: "inspire",
    name: "激勵",
    type: "tactic",
    priority: "P1",
    aspectRatio: "4:3",
    path: "/images/cards/inspire.png",
    promptZh: "戰旗高舉，綠金光芒鼓舞士氣，遠方士兵剪影振奮，主體清楚，三國戰術卡牌插圖，半寫實，無文字。",
    promptEn: "A raised war banner with green-gold morale light, distant soldier silhouettes inspired, clear subject, Three Kingdoms tactic card illustration, semi-realistic, no text.",
    negativePrompt,
    status: "ready",
  },
  {
    cardId: "fire-attack",
    name: "火攻",
    type: "tactic",
    priority: "P1",
    aspectRatio: "4:3",
    path: "/images/cards/fire-attack.png",
    promptZh: "紅橘火光席捲敵陣，火焰照亮戰場旗影，主體清楚，火攻戰術卡牌插圖，東方史詩卡牌風，半寫實，無文字。",
    promptEn: "Red-orange flames sweeping through an enemy formation, firelight illuminating battlefield banners, clear subject, fire tactic card illustration, eastern epic card style, semi-realistic, no text.",
    negativePrompt,
    status: "ready",
  },
  {
    cardId: "green-dragon-blade",
    name: "青龍偃月刀",
    type: "equipment",
    priority: "P1",
    aspectRatio: "4:3",
    path: "/images/cards/green-dragon-blade.png",
    promptZh: "青龍偃月刀斜插於黑金戰場石地，青金龍影盤旋，裝備卡牌主體清楚，東方史詩卡牌風，半寫實，無文字。",
    promptEn: "Green Dragon Crescent Blade planted in dark gold battlefield stones, teal-gold dragon aura curling around it, clear equipment card subject, eastern epic card style, semi-realistic, no text.",
    negativePrompt,
    status: "ready",
  },
  {
    cardId: "dilu-horse",
    name: "的盧馬",
    type: "equipment",
    priority: "P1",
    aspectRatio: "4:3",
    path: "/images/cards/dilu-horse.png",
    promptZh: "白色的盧馬踏煙奔馳，黑金戰場背景與藍鐵守護光，主體清楚，裝備卡牌插圖，東方史詩風，半寫實，無文字。",
    promptEn: "A white Dilu horse galloping through smoke, dark gold battlefield background with blue steel protective light, clear subject, equipment card illustration, eastern epic style, semi-realistic, no text.",
    negativePrompt,
    status: "ready",
  },
  {
    cardId: "taiping-manual",
    name: "太平要術",
    type: "equipment",
    priority: "P1",
    aspectRatio: "4:3",
    path: "/images/cards/taiping-manual.png",
    promptZh: "古老道術卷軸懸浮，黑金底色與紫金符籙光芒，主體清楚，策略裝備卡牌插圖，東方史詩風，半寫實，無文字。",
    promptEn: "An ancient Taoist manual floating, dark gold background with purple-gold talisman light, clear subject, strategy equipment card illustration, eastern epic style, semi-realistic, no text.",
    negativePrompt,
    status: "ready",
  },
];

export const CARD_IMAGE_GAP_MANIFEST: CardImageAsset[] = [];
