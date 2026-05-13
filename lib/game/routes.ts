import type { StageRoute, StageRouteId } from "./types";

export const stageRoutes: StageRoute[] = [
  {
    id: "mountain-path",
    name: "山道",
    description: "安全、補給、探索與保命。適合需要休整或保守推進時選擇。",
    riskLevel: "低",
    enemyHpModifier: 0,
    rewardOptionBonus: 0,
    flavorText: "山路崎嶇，林霧深重，常能避開鋒芒，也可能遇見隱藏補給。",
    image: "route-mountain-path",
    visualPrompt: "崎嶇山道，霧中小徑與散亂敵軍旗影，低風險路線選擇圖",
  },
  {
    id: "official-road",
    name: "官道",
    description: "主線、情報、穩定與平均。適合穩定推進第一章主線。",
    riskLevel: "中",
    enemyHpModifier: 0,
    rewardOptionBonus: 0,
    flavorText: "旌旗隱現，前路未明，一切照常推進。",
    image: "route-official-road",
    visualPrompt: "古代官道延伸遠方，旌旗與車轍清晰，風險均衡的三國行軍路線圖",
  },
  {
    id: "dangerous-pass",
    name: "險道",
    description: "高風險、稀有獎勵、強敵與賭一把。適合狀態良好時換取更大報酬。",
    riskLevel: "高",
    enemyHpModifier: 0,
    rewardOptionBonus: 0,
    flavorText: "險道伏兵眾多，但亂世機遇也藏於危局之中。",
    image: "route-dangerous-pass",
    visualPrompt: "險峻山隘，伏兵火光與高崖壓迫，高風險高報酬路線選擇圖",
  },
];

export function resolveStageRoute(routeId: StageRouteId): StageRoute {
  return stageRoutes.find((route) => route.id === routeId) ?? stageRoutes[1];
}
