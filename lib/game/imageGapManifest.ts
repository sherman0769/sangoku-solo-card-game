export type ImageAssetStatus = "ready" | "planned";

export type ImageGapPriority = "P0" | "P1" | "P2";

export type ImageGapAssetType =
  | "enemy"
  | "mini-boss"
  | "stage-background"
  | "route"
  | "route-event";

export type ReadyImageAssetType =
  | "cover"
  | "hero"
  | "enemy"
  | "mini-boss"
  | "boss"
  | "route"
  | "route-event"
  | "stage-background";

export interface ReadyImageAsset {
  id: string;
  name: string;
  type: ReadyImageAssetType;
  path: string;
  usage: string;
  status: Extract<ImageAssetStatus, "ready">;
}

export interface ImageGapAsset {
  id: string;
  name: string;
  type: ImageGapAssetType;
  priority: ImageGapPriority;
  aspectRatio: "3:4" | "9:16" | "9:16 或 16:9";
  path: string;
  usage: string;
  promptZh: string;
  promptEn: string;
  negativePrompt: string;
  status: Extract<ImageAssetStatus, "planned">;
}

export const CHAPTER_1_READY_IMAGE_MANIFEST: ReadyImageAsset[] = [
  {
    id: "home-hero",
    name: "首頁主視覺",
    type: "cover",
    path: "/images/covers/home-hero.png",
    usage: "首頁主視覺",
    status: "ready",
  },
  {
    id: "hero-guan-yu",
    name: "關羽",
    type: "hero",
    path: "/images/heroes/guan-yu.png",
    usage: "武將選擇、遊戲玩家面板",
    status: "ready",
  },
  {
    id: "hero-zhao-yun",
    name: "趙雲",
    type: "hero",
    path: "/images/heroes/zhao-yun.png",
    usage: "武將選擇、遊戲玩家面板",
    status: "ready",
  },
  {
    id: "hero-zhuge-liang",
    name: "諸葛亮",
    type: "hero",
    path: "/images/heroes/zhuge-liang.png",
    usage: "武將選擇、遊戲玩家面板",
    status: "ready",
  },
  {
    id: "enemy-yellow-turban-soldier",
    name: "黃巾兵",
    type: "enemy",
    path: "/images/enemies/yellow-turban-soldier.png",
    usage: "敵人面板",
    status: "ready",
  },
  {
    id: "enemy-bandit-leader",
    name: "山賊頭目",
    type: "enemy",
    path: "/images/enemies/bandit-leader.png",
    usage: "敵人面板",
    status: "ready",
  },
  {
    id: "enemy-xiliang-cavalry",
    name: "西涼騎兵",
    type: "enemy",
    path: "/images/enemies/xiliang-cavalry.png",
    usage: "敵人面板",
    status: "ready",
  },
  {
    id: "enemy-lu-bu",
    name: "呂布",
    type: "boss",
    path: "/images/enemies/lu-bu.png",
    usage: "Boss 敵人面板",
    status: "ready",
  },
  {
    id: "stage-abandoned-village",
    name: "荒村初戰背景",
    type: "stage-background",
    path: "/images/stages/abandoned-village.png",
    usage: "第 1 關背景",
    status: "ready",
  },
  {
    id: "stage-hulao-gate",
    name: "虎牢關前背景",
    type: "stage-background",
    path: "/images/stages/hulao-gate.png",
    usage: "第 8 關背景",
    status: "ready",
  },
  {
    id: "enemy-yellow-turban-archer",
    name: "黃巾弓手",
    type: "enemy",
    path: "/images/enemies/yellow-turban-archer.png",
    usage: "敵人面板",
    status: "ready",
  },
  {
    id: "enemy-yellow-turban-brute",
    name: "黃巾力士",
    type: "enemy",
    path: "/images/enemies/yellow-turban-brute.png",
    usage: "敵人面板",
    status: "ready",
  },
  {
    id: "enemy-black-mountain-general",
    name: "黑山賊將",
    type: "enemy",
    path: "/images/enemies/black-mountain-general.png",
    usage: "敵人面板",
    status: "ready",
  },
  {
    id: "enemy-zhang-liang",
    name: "張梁",
    type: "mini-boss",
    path: "/images/enemies/zhang-liang.png",
    usage: "第 7 關 mini-boss",
    status: "ready",
  },
  {
    id: "enemy-zhang-bao",
    name: "張寶",
    type: "mini-boss",
    path: "/images/enemies/zhang-bao.png",
    usage: "第 7 關 mini-boss",
    status: "ready",
  },
  {
    id: "stage-mountain-ambush",
    name: "山道伏兵",
    type: "stage-background",
    path: "/images/stages/mountain-ambush.png",
    usage: "第 2 關背景",
    status: "ready",
  },
  {
    id: "stage-ruined-temple-night",
    name: "破廟夜戰",
    type: "stage-background",
    path: "/images/stages/ruined-temple-night.png",
    usage: "第 3 關背景",
    status: "ready",
  },
  {
    id: "stage-black-mountain-camp",
    name: "黑山賊寨",
    type: "stage-background",
    path: "/images/stages/black-mountain-camp.png",
    usage: "第 4 關背景",
    status: "ready",
  },
  {
    id: "stage-xiliang-charge",
    name: "西涼突騎",
    type: "stage-background",
    path: "/images/stages/xiliang-charge.png",
    usage: "第 5 關背景",
    status: "ready",
  },
  {
    id: "stage-ancient-battlefield",
    name: "古戰場遺跡",
    type: "stage-background",
    path: "/images/stages/ancient-battlefield.png",
    usage: "第 6 關背景",
    status: "ready",
  },
  {
    id: "stage-yellow-turban-altar",
    name: "黃巾祭壇",
    type: "stage-background",
    path: "/images/stages/yellow-turban-altar.png",
    usage: "第 7 關背景",
    status: "ready",
  },
  {
    id: "route-mountain-path",
    name: "山道",
    type: "route",
    path: "/images/routes/mountain-path.png",
    usage: "路線選擇卡：山道",
    status: "ready",
  },
  {
    id: "route-official-road",
    name: "官道",
    type: "route",
    path: "/images/routes/official-road.png",
    usage: "路線選擇卡：官道",
    status: "ready",
  },
  {
    id: "route-dangerous-pass",
    name: "險道",
    type: "route",
    path: "/images/routes/dangerous-pass.png",
    usage: "路線選擇卡：險道",
    status: "ready",
  },
  {
    id: "route-mountain-spring",
    name: "山泉療傷",
    type: "route-event",
    path: "/images/events/route-mountain-spring.png",
    usage: "山道路線事件",
    status: "ready",
  },
  {
    id: "route-hermit-guidance",
    name: "隱士指路",
    type: "route-event",
    path: "/images/events/route-hermit-guidance.png",
    usage: "山道路線事件",
    status: "ready",
  },
  {
    id: "route-misty-path",
    name: "迷霧小徑",
    type: "route-event",
    path: "/images/events/route-misty-path.png",
    usage: "山道路線事件",
    status: "ready",
  },
  {
    id: "route-post-station",
    name: "驛站補給",
    type: "route-event",
    path: "/images/events/route-post-station.png",
    usage: "官道路線事件",
    status: "ready",
  },
  {
    id: "route-military-dispatch",
    name: "軍令急報",
    type: "route-event",
    path: "/images/events/route-military-dispatch.png",
    usage: "官道路線事件",
    status: "ready",
  },
  {
    id: "route-remnant-troops",
    name: "官軍殘部",
    type: "route-event",
    path: "/images/events/route-remnant-troops.png",
    usage: "官道路線事件",
    status: "ready",
  },
  {
    id: "route-cliff-ambush",
    name: "絕壁伏擊",
    type: "route-event",
    path: "/images/events/route-cliff-ambush.png",
    usage: "險道路線事件",
    status: "ready",
  },
  {
    id: "route-battlefield-relic",
    name: "古戰場遺物",
    type: "route-event",
    path: "/images/events/route-battlefield-relic.png",
    usage: "險道路線事件",
    status: "ready",
  },
  {
    id: "route-night-raid",
    name: "夜襲敵營",
    type: "route-event",
    path: "/images/events/route-night-raid.png",
    usage: "險道路線事件",
    status: "ready",
  },
];

export const CHAPTER_1_IMAGE_GAP_MANIFEST: ImageGapAsset[] = [];
