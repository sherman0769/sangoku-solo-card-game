import type { StageRoute, StageRouteId } from "./types";

export const stageRoutes: StageRoute[] = [
  {
    id: "mountain-path",
    name: "山道",
    description: "繞行山道，敵軍較弱，但收穫有限。",
    riskLevel: "低",
    enemyHpModifier: -1,
    rewardOptionBonus: 0,
    flavorText: "山路崎嶇，敵軍散亂，適合穩健前進。",
  },
  {
    id: "official-road",
    name: "官道",
    description: "沿官道前進，風險與收穫都較平均。",
    riskLevel: "中",
    enemyHpModifier: 0,
    rewardOptionBonus: 0,
    flavorText: "旌旗隱現，前路未明，一切照常推進。",
  },
  {
    id: "dangerous-pass",
    name: "險道",
    description: "強行通過險道，敵人更強，但戰後可多一個獎勵選項。",
    riskLevel: "高",
    enemyHpModifier: 2,
    rewardOptionBonus: 1,
    flavorText: "險道伏兵眾多，但亂世機遇也藏於危局之中。",
  },
];

export function resolveStageRoute(routeId: StageRouteId): StageRoute {
  return stageRoutes.find((route) => route.id === routeId) ?? stageRoutes[1];
}
