import type { Hero, HeroId } from "./types";

export const heroes: Hero[] = [
  {
    id: "guan-yu",
    name: "關羽",
    title: "武聖",
    maxHp: 5,
    skillName: "武聖",
    skillDescription: "每回合第一次使用「斬」時，傷害 +1。",
  },
  {
    id: "zhao-yun",
    name: "趙雲",
    title: "常山趙子龍",
    maxHp: 4,
    skillName: "龍膽",
    skillDescription: "你可以將「閃」當作「斬」使用，也可以將「斬」當作「閃」使用。",
  },
];

export function resolveHero(heroId?: string): Hero {
  return heroes.find((hero) => hero.id === heroId) ?? heroes[0];
}

export function isHeroId(heroId: string): heroId is HeroId {
  return heroes.some((hero) => hero.id === heroId);
}
