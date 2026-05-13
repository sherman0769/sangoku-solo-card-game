export type VisualAssetType = "cover" | "hero" | "enemy" | "boss" | "stage-background";

export interface VisualAssetManifestItem {
  id: string;
  type: VisualAssetType;
  name: string;
  aspectRatio: "16:9" | "3:4";
  path: string;
  usage: string;
  promptZh: string;
  promptEn: string;
}

export const VISUAL_ASSET_MANIFEST: VisualAssetManifestItem[] = [
  {
    id: "home-hero",
    type: "cover",
    name: "首頁主視覺",
    aspectRatio: "16:9",
    path: "/images/covers/home-hero.png",
    usage: "首頁主視覺",
    promptZh:
      "三國亂世開場主視覺，一名英雄獨自立於烽煙戰場前，遠方黃巾軍旗影與虎牢關剪影，東方史詩卡牌風，半寫實插畫，電影感光影，精緻遊戲概念美術。",
    promptEn:
      "A Three Kingdoms era opening cover image, a lone hero standing before a smoky battlefield, distant Yellow Turban banners and the silhouette of Hulao Gate, eastern epic card game style, semi-realistic illustration, cinematic lighting, polished game concept art.",
  },
  {
    id: "hero-guan-yu",
    type: "hero",
    name: "關羽立繪",
    aspectRatio: "3:4",
    path: "/images/heroes/guan-yu.png",
    usage: "武將選擇、遊戲玩家面板",
    promptZh:
      "三國武將關羽，紅臉長髯，青龍偃月刀，威嚴武聖氣勢，古代戰甲與赤紅披風，東方史詩卡牌風，半寫實角色立繪，電影感光影。",
    promptEn:
      "Guan Yu from the Three Kingdoms, red face, long beard, Green Dragon Crescent Blade, majestic warrior saint presence, ancient armor and crimson cloak, eastern epic card game style, semi-realistic character portrait, cinematic lighting.",
  },
  {
    id: "hero-zhao-yun",
    type: "hero",
    name: "趙雲立繪",
    aspectRatio: "3:4",
    path: "/images/heroes/zhao-yun.png",
    usage: "武將選擇、遊戲玩家面板",
    promptZh:
      "三國武將趙雲，銀甲白袍，手持長槍，英勇靈動，戰場風沙與白色披風，東方史詩卡牌風，半寫實角色立繪，精緻遊戲概念美術。",
    promptEn:
      "Zhao Yun from the Three Kingdoms, silver armor and white robe, holding a spear, agile and heroic, battlefield dust and white cloak, eastern epic card game style, semi-realistic character portrait, polished game concept art.",
  },
  {
    id: "hero-zhuge-liang",
    type: "hero",
    name: "諸葛亮立繪",
    aspectRatio: "3:4",
    path: "/images/heroes/zhuge-liang.png",
    usage: "武將選擇、遊戲玩家面板",
    promptZh:
      "三國軍師諸葛亮，羽扇綸巾，沉著睿智，身後有星象與軍帳燭光，東方史詩卡牌風，半寫實角色立繪，電影感光影。",
    promptEn:
      "Zhuge Liang from the Three Kingdoms, feather fan and scholar headwear, calm and wise, star patterns and a candlelit war tent behind him, eastern epic card game style, semi-realistic character portrait, cinematic lighting.",
  },
  {
    id: "enemy-yellow-turban-soldier",
    type: "enemy",
    name: "黃巾兵",
    aspectRatio: "3:4",
    path: "public/images/enemies/yellow-turban-soldier.webp",
    usage: "敵人面板",
    promptZh:
      "黃巾兵，頭綁黃巾，粗布甲胄，手持短刀與木盾，亂世低階士兵，東方史詩卡牌風，半寫實敵人立繪，戰場煙塵背景。",
    promptEn:
      "A Yellow Turban soldier, yellow headscarf, rough cloth armor, holding a short blade and wooden shield, low-ranking rebel soldier in chaotic wartime, eastern epic card game style, semi-realistic enemy portrait, smoky battlefield background.",
  },
  {
    id: "enemy-bandit-leader",
    type: "enemy",
    name: "山賊頭目",
    aspectRatio: "3:4",
    path: "public/images/enemies/bandit-leader.webp",
    usage: "敵人面板",
    promptZh:
      "山賊頭目，皮甲披風，手持大刀，粗獷狡詐，背後是山寨木柵與火把，三國亂世敵將，東方史詩卡牌風，半寫實立繪。",
    promptEn:
      "A bandit leader, leather armor and cloak, holding a large blade, rugged and cunning, wooden mountain fort and torches behind him, Three Kingdoms chaotic era enemy commander, eastern epic card game style, semi-realistic portrait.",
  },
  {
    id: "enemy-xiliang-cavalry",
    type: "enemy",
    name: "西涼騎兵",
    aspectRatio: "3:4",
    path: "public/images/enemies/xiliang-cavalry.webp",
    usage: "敵人面板",
    promptZh:
      "西涼騎兵，鐵甲騎士，手持長槍，馬蹄踏起沙塵，猛烈衝鋒姿態，三國戰場，東方史詩卡牌風，半寫實敵人立繪。",
    promptEn:
      "A Xiliang cavalry soldier, armored rider holding a long spear, horse hooves kicking up dust, aggressive charging pose, Three Kingdoms battlefield, eastern epic card game style, semi-realistic enemy portrait.",
  },
  {
    id: "enemy-lu-bu",
    type: "boss",
    name: "呂布",
    aspectRatio: "3:4",
    path: "public/images/enemies/lu-bu.webp",
    usage: "Boss 敵人面板",
    promptZh:
      "呂布，方天畫戟，赤兔馬，虎牢關前最終 Boss，無雙猛將氣勢，黑紅戰甲與壓迫感光影，東方史詩卡牌風，半寫實 Boss 立繪。",
    promptEn:
      "Lu Bu, holding a Fangtian halberd, with Red Hare horse, final boss before Hulao Gate, overwhelming unmatched warrior presence, black and crimson armor, dramatic lighting, eastern epic card game style, semi-realistic boss portrait.",
  },
  {
    id: "stage-abandoned-village",
    type: "stage-background",
    name: "荒村初戰背景",
    aspectRatio: "16:9",
    path: "public/images/stages/abandoned-village.webp",
    usage: "第 1 關背景",
    promptZh:
      "荒廢村莊，黃昏煙塵，破屋與糧草車，遠處有黃巾軍影子，三國亂世氛圍，電影感背景，東方史詩卡牌風，半寫實場景概念圖。",
    promptEn:
      "An abandoned village at dusk, smoke and dust, broken houses and grain carts, distant silhouettes of Yellow Turban rebels, Three Kingdoms chaotic era atmosphere, cinematic background, eastern epic card game style, semi-realistic environment concept art.",
  },
  {
    id: "stage-hulao-gate",
    type: "stage-background",
    name: "虎牢關前背景",
    aspectRatio: "16:9",
    path: "public/images/stages/hulao-gate.webp",
    usage: "第 8 關背景",
    promptZh:
      "虎牢關前，巨大城關與戰旗，赤兔馬剪影，遠方塵煙與壓迫感天空，最終決戰氛圍，東方史詩卡牌風，半寫實電影感背景。",
    promptEn:
      "Before Hulao Gate, massive fortress gate and battle banners, silhouette of Red Hare horse, distant dust and oppressive sky, final battle atmosphere, eastern epic card game style, semi-realistic cinematic background.",
  },
];
