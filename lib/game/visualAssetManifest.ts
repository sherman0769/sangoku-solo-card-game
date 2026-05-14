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
    path: "/images/enemies/yellow-turban-soldier.png",
    usage: "敵人面板",
    promptZh:
      "黃巾兵，頭綁黃巾，粗布甲胄，手持短刀與木盾，亂世低階士兵，東方史詩卡牌風，半寫實敵人立繪，戰場煙塵背景。",
    promptEn:
      "A Yellow Turban soldier, yellow headscarf, rough cloth armor, holding a short blade and wooden shield, low-ranking rebel soldier in chaotic wartime, eastern epic card game style, semi-realistic enemy portrait, smoky battlefield background.",
  },
  {
    id: "enemy-yellow-turban-archer",
    type: "enemy",
    name: "黃巾弓手",
    aspectRatio: "3:4",
    path: "/images/enemies/yellow-turban-archer.png",
    usage: "敵人面板",
    promptZh:
      "三國亂世中的黃巾弓手，身穿破舊黃布甲，手持長弓，站在煙塵戰場邊緣，背後有殘破黃巾旗幟，東方史詩卡牌風，半寫實，電影感光影，無文字。",
    promptEn:
      "A Yellow Turban archer in the chaotic Three Kingdoms era, wearing worn yellow cloth armor, holding a longbow at the edge of a smoky battlefield, torn Yellow Turban banners behind, eastern epic card game style, semi-realistic, cinematic lighting, no text.",
  },
  {
    id: "enemy-yellow-turban-brute",
    type: "enemy",
    name: "黃巾力士",
    aspectRatio: "3:4",
    path: "/images/enemies/yellow-turban-brute.png",
    usage: "敵人面板",
    promptZh:
      "黃巾力士，高大壯碩的亂軍戰士，粗布甲與黃巾符布，雙手握著沉重木槌，踏在泥濘戰場上，東方史詩卡牌風，半寫實，壓迫感光影，無文字。",
    promptEn:
      "A Yellow Turban brute, a massive rebel warrior with rough cloth armor and yellow talisman cloth, gripping a heavy wooden maul with both hands on a muddy battlefield, eastern epic card game style, semi-realistic, imposing cinematic lighting, no text.",
  },
  {
    id: "enemy-bandit-leader",
    type: "enemy",
    name: "山賊頭目",
    aspectRatio: "3:4",
    path: "/images/enemies/bandit-leader.png",
    usage: "敵人面板",
    promptZh:
      "山賊頭目，皮甲披風，手持大刀，粗獷狡詐，背後是山寨木柵與火把，三國亂世敵將，東方史詩卡牌風，半寫實立繪。",
    promptEn:
      "A bandit leader, leather armor and cloak, holding a large blade, rugged and cunning, wooden mountain fort and torches behind him, Three Kingdoms chaotic era enemy commander, eastern epic card game style, semi-realistic portrait.",
  },
  {
    id: "enemy-black-mountain-general",
    type: "enemy",
    name: "黑山賊將",
    aspectRatio: "3:4",
    path: "/images/enemies/black-mountain-general.png",
    usage: "敵人面板",
    promptZh:
      "黑山賊將，深色皮甲與鐵片護肩，手持大刀與盾牌，身後是山寨木柵與黑旗，沉穩兇悍的賊將氣勢，東方史詩卡牌風，半寫實，無文字。",
    promptEn:
      "A Black Mountain bandit general in dark leather armor with iron shoulder plates, holding a broad blade and shield, wooden mountain fort and black banners behind, calm but fierce commander presence, eastern epic card game style, semi-realistic, no text.",
  },
  {
    id: "enemy-xiliang-cavalry",
    type: "enemy",
    name: "西涼騎兵",
    aspectRatio: "3:4",
    path: "/images/enemies/xiliang-cavalry.png",
    usage: "敵人面板",
    promptZh:
      "西涼騎兵，鐵甲騎士，手持長槍，馬蹄踏起沙塵，猛烈衝鋒姿態，三國戰場，東方史詩卡牌風，半寫實敵人立繪。",
    promptEn:
      "A Xiliang cavalry soldier, armored rider holding a long spear, horse hooves kicking up dust, aggressive charging pose, Three Kingdoms battlefield, eastern epic card game style, semi-realistic enemy portrait.",
  },
  {
    id: "enemy-zhang-liang",
    type: "enemy",
    name: "張梁",
    aspectRatio: "3:4",
    path: "/images/enemies/zhang-liang.png",
    usage: "第 7 關 mini-boss",
    promptZh:
      "張梁，黃巾軍人公將軍，黃巾戰甲與符咒披帶，手持長兵器站在祭壇火光前，狂熱威壓，三國亂世 mini-boss 立繪，東方史詩卡牌風，半寫實，無文字。",
    promptEn:
      "Zhang Liang, a Yellow Turban general, wearing yellow rebel armor with talisman sashes, holding a polearm before altar flames, fanatical and intimidating mini-boss portrait in the Three Kingdoms chaos, eastern epic card game style, semi-realistic, no text.",
  },
  {
    id: "enemy-zhang-bao",
    type: "enemy",
    name: "張寶",
    aspectRatio: "3:4",
    path: "/images/enemies/zhang-bao.png",
    usage: "第 7 關 mini-boss",
    promptZh:
      "張寶，黃巾軍地公將軍，術士將領造型，手持法杖與符紙，身後妖風與祭壇火盆，詭譎沉著，三國亂世 mini-boss 立繪，東方史詩卡牌風，半寫實，無文字。",
    promptEn:
      "Zhang Bao, a Yellow Turban sorcerer general, holding a ritual staff and talisman papers, eerie wind and altar braziers behind him, mysterious and composed mini-boss portrait in the Three Kingdoms chaos, eastern epic card game style, semi-realistic, no text.",
  },
  {
    id: "enemy-lu-bu",
    type: "boss",
    name: "呂布",
    aspectRatio: "3:4",
    path: "/images/enemies/lu-bu.png",
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
    path: "/images/stages/abandoned-village.png",
    usage: "第 1 關背景",
    promptZh:
      "荒廢村莊，黃昏煙塵，破屋與糧草車，遠處有黃巾軍影子，三國亂世氛圍，電影感背景，東方史詩卡牌風，半寫實場景概念圖。",
    promptEn:
      "An abandoned village at dusk, smoke and dust, broken houses and grain carts, distant silhouettes of Yellow Turban rebels, Three Kingdoms chaotic era atmosphere, cinematic background, eastern epic card game style, semi-realistic environment concept art.",
  },
  {
    id: "stage-mountain-ambush",
    type: "stage-background",
    name: "山道伏兵",
    aspectRatio: "16:9",
    path: "/images/stages/mountain-ambush.png",
    usage: "第 2 關背景",
    promptZh:
      "狹窄山道伏兵場景，兩側密林與霧氣，遠處黃巾旗影若隱若現，地面有車轍與落葉，緊張伏擊氛圍，東方史詩卡牌風，半寫實場景，電影感光影，無文字。",
    promptEn:
      "A narrow mountain road ambush scene, dense forest and mist on both sides, faint Yellow Turban banners in the distance, wheel tracks and fallen leaves on the ground, tense ambush atmosphere, eastern epic card game style, semi-realistic environment, cinematic lighting, no text.",
  },
  {
    id: "stage-ruined-temple-night",
    type: "stage-background",
    name: "破廟夜戰",
    aspectRatio: "16:9",
    path: "/images/stages/ruined-temple-night.png",
    usage: "第 3 關背景",
    promptZh:
      "破敗古廟夜戰背景，殘破神像、斷裂樑柱與搖曳火光，門外敵影逼近，夜色壓迫而不血腥，東方史詩卡牌風，半寫實，電影感光影，無文字。",
    promptEn:
      "A ruined ancient temple at night for a battle scene, broken statues, cracked beams and flickering firelight, enemy silhouettes approaching outside, oppressive but non-gory atmosphere, eastern epic card game style, semi-realistic, cinematic lighting, no text.",
  },
  {
    id: "stage-black-mountain-camp",
    type: "stage-background",
    name: "黑山賊寨",
    aspectRatio: "16:9",
    path: "/images/stages/black-mountain-camp.png",
    usage: "第 4 關背景",
    promptZh:
      "黑山賊寨背景，山間木柵高牆、黑旗、巡邏火把與簡陋哨塔，遠處山霧壓低天空，賊寨守備森嚴，東方史詩卡牌風，半寫實場景，無文字。",
    promptEn:
      "A Black Mountain bandit camp background, wooden palisades in the mountains, black banners, patrol torches and rough watchtowers, mountain mist under a heavy sky, heavily guarded bandit stronghold, eastern epic card game style, semi-realistic environment, no text.",
  },
  {
    id: "stage-xiliang-charge",
    type: "stage-background",
    name: "西涼突騎",
    aspectRatio: "16:9",
    path: "/images/stages/xiliang-charge.png",
    usage: "第 5 關背景",
    promptZh:
      "西涼突騎戰場背景，荒原塵土飛揚，遠方鐵騎隊形衝鋒，長槍與旌旗形成壓迫線條，三國亂世戰場，東方史詩卡牌風，半寫實，電影感，無文字。",
    promptEn:
      "A Xiliang cavalry charge battlefield background, dust rising across a wasteland, distant armored riders charging in formation, spears and banners creating strong pressure lines, Three Kingdoms chaotic battlefield, eastern epic card game style, semi-realistic, cinematic, no text.",
  },
  {
    id: "stage-ancient-battlefield",
    type: "stage-background",
    name: "古戰場遺跡",
    aspectRatio: "16:9",
    path: "/images/stages/ancient-battlefield.png",
    usage: "第 6 關背景",
    promptZh:
      "古戰場遺跡背景，斷戟殘旗、荒草、破碎戰車與黃昏雲層，地面散落舊甲片，史詩荒涼感，東方史詩卡牌風，半寫實場景，電影感光影，無文字。",
    promptEn:
      "An ancient battlefield ruin background, broken halberds, torn banners, wild grass, shattered war carts and dusk clouds, old armor fragments scattered on the ground, epic desolate mood, eastern epic card game style, semi-realistic environment, cinematic lighting, no text.",
  },
  {
    id: "stage-yellow-turban-altar",
    type: "stage-background",
    name: "黃巾祭壇",
    aspectRatio: "16:9",
    path: "/images/stages/yellow-turban-altar.png",
    usage: "第 7 關背景",
    promptZh:
      "黃巾祭壇背景，符咒飄動、火盆環繞、破舊黃巾旗與詭異雲光，祭壇中央留出戰鬥空間，神秘危險但不恐怖血腥，東方史詩卡牌風，半寫實，無文字。",
    promptEn:
      "A Yellow Turban altar background, talismans fluttering, braziers around the altar, worn yellow banners and eerie cloud light, clear central space for battle composition, mysterious and dangerous without gore, eastern epic card game style, semi-realistic, no text.",
  },
  {
    id: "stage-hulao-gate",
    type: "stage-background",
    name: "虎牢關前背景",
    aspectRatio: "16:9",
    path: "/images/stages/hulao-gate.png",
    usage: "第 8 關背景",
    promptZh:
      "虎牢關前，巨大城關與戰旗，赤兔馬剪影，遠方塵煙與壓迫感天空，最終決戰氛圍，東方史詩卡牌風，半寫實電影感背景。",
    promptEn:
      "Before Hulao Gate, massive fortress gate and battle banners, silhouette of Red Hare horse, distant dust and oppressive sky, final battle atmosphere, eastern epic card game style, semi-realistic cinematic background.",
  },
];
