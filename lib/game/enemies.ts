import type { Enemy } from "./types";

export const enemies: Enemy[] = [
  {
    id: "yellow-turban-captain",
    name: "黃巾兵",
    title: "第一關",
    intro: "第一關｜黃巾兵登場，亂世初起，試試你的刀法。",
    maxHealth: 7,
    attack: 2,
    actions: [
      {
        kind: "attack",
        label: "普通攻擊",
        text: "造成 2 點傷害。",
      },
      {
        kind: "guard",
        label: "防守",
        text: "進入防守狀態，下次受到的傷害 -1。",
      },
      {
        kind: "fierce",
        label: "猛攻",
        text: "造成 3 點傷害。",
      },
    ],
  },
  {
    id: "hua-xiong",
    name: "山賊頭目",
    title: "第二關",
    intro: "第二關｜山賊頭目攔路，敵人開始懂得防守與蓄力。",
    maxHealth: 10,
    attack: 2,
    actions: [
      {
        kind: "fierce",
        label: "猛攻",
        text: "造成 3 點傷害。",
      },
      {
        kind: "charge",
        label: "蓄力",
        text: "下次攻擊傷害 +1。",
      },
      {
        kind: "attack",
        label: "普通攻擊",
        text: "造成 2 點傷害。",
      },
      {
        kind: "guard",
        label: "防守",
        text: "進入防守狀態，下次受到的傷害 -1。",
      },
    ],
  },
  {
    id: "lu-bu",
    name: "呂布",
    title: "第三關",
    intro: "第三關｜呂布現身，真正的考驗開始了。",
    maxHealth: 12,
    attack: 3,
    actions: [
      {
        kind: "charge",
        label: "蓄力",
        text: "下次攻擊傷害 +1。",
      },
      {
        kind: "fierce",
        label: "猛攻",
        text: "造成 4 點傷害。",
      },
      {
        kind: "guard",
        label: "防守",
        text: "進入防守狀態，下次受到的傷害 -1。",
      },
      {
        kind: "attack",
        label: "普通攻擊",
        text: "造成 3 點傷害。",
      },
    ],
  },
];
