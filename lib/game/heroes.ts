import type { Hero, HeroId } from "./types";

export const heroes: Hero[] = [
  {
    id: "guan-yu",
    name: "關羽",
    title: "武聖",
    maxHp: 5,
    skillName: "武聖",
    skillDescription: "每回合第一次使用「斬」時，傷害 +1。",
    role: "攻擊爆發",
    portrait: "/images/heroes/guan-yu.png",
    avatar: "/images/heroes/guan-yu.png",
    visualPrompt: "三國武將關羽，青龍偃月刀，紅臉長髯，威嚴武聖氣勢，東方史詩卡牌風格",
  },
  {
    id: "zhao-yun",
    name: "趙雲",
    title: "常山趙子龍",
    maxHp: 4,
    skillName: "龍膽",
    skillDescription: "你可以將「閃」當作「斬」使用，也可以將「斬」當作「閃」使用。",
    role: "攻防靈活",
    portrait: "/images/heroes/zhao-yun.png",
    avatar: "/images/heroes/zhao-yun.png",
    visualPrompt: "三國武將趙雲，銀甲白袍，長槍策馬，英勇靈動，東方史詩卡牌風格",
  },
  {
    id: "zhuge-liang",
    name: "諸葛亮",
    title: "臥龍",
    maxHp: 4,
    skillName: "觀星",
    skillDescription: "每回合開始時，查看牌堆頂 3 張，選 1 張加入手牌，其餘放回牌堆底。",
    role: "策略控牌",
    portrait: "/images/heroes/zhuge-liang.png",
    avatar: "/images/heroes/zhuge-liang.png",
    visualPrompt: "三國軍師諸葛亮，羽扇綸巾，星象與軍帳，沉著睿智，東方史詩卡牌風格",
  },
  {
    id: "li-shimin-ai-architect",
    name: "李詩民",
    title: "AI 架構師",
    maxHp: 4,
    skillName: "架構推演",
    skillDescription:
      "每回合第一次使用策略牌時，抽 1 張牌；處理路線事件後，下一場戰鬥第一回合內首次策略牌額外回復 1 點體力。",
    role: "系統調度",
    portrait: "/images/heroes/li-shimin-ai-architect.png",
    avatar: "/images/heroes/li-shimin-ai-architect.png",
    placeholderKey: "hero-li-shimin-ai-architect",
    visualPrompt:
      "東方亂世中的 AI 架構師軍師，身穿深色東方長袍，帶有藍金色資料光紋，手持卷軸或玉簡，背後浮現戰略圖、星盤與資料節點，半寫實三國卡牌風，電影感光影，不要文字，不要 Logo",
  },
];

export function resolveHero(heroId?: string): Hero {
  return heroes.find((hero) => hero.id === heroId) ?? heroes[0];
}

export function isHeroId(heroId: string): heroId is HeroId {
  return heroes.some((hero) => hero.id === heroId);
}
