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
    portrait: "hero-guan-yu-portrait",
    avatar: "hero-guan-yu-avatar",
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
    portrait: "hero-zhao-yun-portrait",
    avatar: "hero-zhao-yun-avatar",
    visualPrompt: "三國武將趙雲，銀甲白袍，長槍策馬，英勇靈動，東方史詩卡牌風格",
  },
  {
    id: "zhuge-liang",
    name: "諸葛亮",
    title: "臥龍",
    maxHp: 3,
    skillName: "觀星",
    skillDescription: "每回合開始時，查看牌堆頂 3 張，選 1 張加入手牌，其餘放回牌堆底。",
    role: "策略控牌",
    portrait: "hero-zhuge-liang-portrait",
    avatar: "hero-zhuge-liang-avatar",
    visualPrompt: "三國軍師諸葛亮，羽扇綸巾，星象與軍帳，沉著睿智，東方史詩卡牌風格",
  },
];

export function resolveHero(heroId?: string): Hero {
  return heroes.find((hero) => hero.id === heroId) ?? heroes[0];
}

export function isHeroId(heroId: string): heroId is HeroId {
  return heroes.some((hero) => hero.id === heroId);
}
