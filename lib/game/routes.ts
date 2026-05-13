import type { StageRoute, StageRouteId } from "./types";

export const stageRoutes: StageRoute[] = [
  {
    id: "mountain-path",
    name: "山道",
    description: "山路隱蔽，適合休整、探索與保存實力。",
    theme: "生存",
    focus: "補給與探索",
    playStyle: "適合血量偏低或想穩定整理資源時選擇。",
    flavorText: "山路崎嶇，林霧深重，清泉與小徑常藏在枝葉之間。",
    image: "route-mountain-path",
    visualPrompt: "崎嶇山道，霧中小徑與山泉，三國亂世中的生存補給路線選擇圖",
  },
  {
    id: "official-road",
    name: "官道",
    description: "官道雖有敵蹤，但情報與支援較完整，適合穩定推進。",
    theme: "主線",
    focus: "情報與穩定",
    playStyle: "適合想穩定推進與取得戰術優勢時選擇。",
    flavorText: "旌旗隱現，車轍仍在，殘存軍令與支援可循。",
    image: "route-official-road",
    visualPrompt: "古代官道延伸遠方，旌旗與車轍清晰，情報穩定的三國行軍路線圖",
  },
  {
    id: "dangerous-pass",
    name: "險道",
    description: "險道不一定更難，但更容易遇到突發狀況與稀有機會。",
    theme: "奇遇",
    focus: "稀有收益與代價",
    playStyle: "適合想賭特殊收益與劇情變化時選擇。",
    flavorText: "絕壁與古戰場相連，危局之中也可能藏著名將遺物。",
    image: "route-dangerous-pass",
    visualPrompt: "險峻山隘，古戰場殘光與伏兵火光，奇遇與代價並存的三國路線選擇圖",
  },
];

export function resolveStageRoute(routeId: StageRouteId): StageRoute {
  return stageRoutes.find((route) => route.id === routeId) ?? stageRoutes[1];
}
