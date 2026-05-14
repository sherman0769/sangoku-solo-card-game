export type ImageAssetStatus = "ready" | "planned";

export type ImageGapPriority = "P0" | "P1" | "P2";

export type ImageGapAssetType =
  | "enemy"
  | "mini-boss"
  | "stage-background"
  | "route"
  | "route-event";

export type ReadyImageAssetType = "cover" | "hero" | "enemy" | "boss" | "stage-background";

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

const sharedNegativePrompt =
  "文字、Logo、水印、現代武器、科幻裝備、卡通風、血腥畫面、畸形手指、重複人物、受版權保護角色造型";

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
];

export const CHAPTER_1_IMAGE_GAP_MANIFEST: ImageGapAsset[] = [
  {
    id: "enemy-yellow-turban-archer",
    name: "黃巾弓手",
    type: "enemy",
    priority: "P0",
    aspectRatio: "3:4",
    path: "public/images/enemies/yellow-turban-archer.png",
    usage: "敵人面板",
    promptZh:
      "三國亂世中的黃巾弓手，身穿破舊黃布甲，手持長弓，站在煙塵戰場邊緣，背後有殘破黃巾旗幟，東方史詩卡牌風，半寫實，電影感光影，無文字",
    promptEn:
      "A Yellow Turban archer in the chaotic Three Kingdoms era, wearing worn yellow cloth armor, holding a longbow at the edge of a smoky battlefield, torn Yellow Turban banners behind, eastern epic card game style, semi-realistic, cinematic lighting, no text.",
    negativePrompt: sharedNegativePrompt,
    status: "planned",
  },
  {
    id: "enemy-yellow-turban-brute",
    name: "黃巾力士",
    type: "enemy",
    priority: "P0",
    aspectRatio: "3:4",
    path: "public/images/enemies/yellow-turban-brute.png",
    usage: "敵人面板",
    promptZh:
      "黃巾力士，高大壯碩的亂軍戰士，粗布甲與黃巾符布，雙手握著沉重木槌，踏在泥濘戰場上，東方史詩卡牌風，半寫實，壓迫感光影，無文字",
    promptEn:
      "A Yellow Turban brute, a massive rebel warrior with rough cloth armor and yellow talisman cloth, gripping a heavy wooden maul with both hands on a muddy battlefield, eastern epic card game style, semi-realistic, imposing cinematic lighting, no text.",
    negativePrompt: sharedNegativePrompt,
    status: "planned",
  },
  {
    id: "enemy-black-mountain-general",
    name: "黑山賊將",
    type: "enemy",
    priority: "P0",
    aspectRatio: "3:4",
    path: "public/images/enemies/black-mountain-general.png",
    usage: "敵人面板",
    promptZh:
      "黑山賊將，深色皮甲與鐵片護肩，手持大刀與盾牌，身後是山寨木柵與黑旗，沉穩兇悍的賊將氣勢，東方史詩卡牌風，半寫實，無文字",
    promptEn:
      "A Black Mountain bandit general in dark leather armor with iron shoulder plates, holding a broad blade and shield, wooden mountain fort and black banners behind, calm but fierce commander presence, eastern epic card game style, semi-realistic, no text.",
    negativePrompt: sharedNegativePrompt,
    status: "planned",
  },
  {
    id: "enemy-zhang-liang",
    name: "張梁",
    type: "mini-boss",
    priority: "P0",
    aspectRatio: "3:4",
    path: "public/images/enemies/zhang-liang.png",
    usage: "第 7 關 mini-boss",
    promptZh:
      "張梁，黃巾軍人公將軍，黃巾戰甲與符咒披帶，手持長兵器站在祭壇火光前，狂熱威壓，三國亂世 mini-boss 立繪，東方史詩卡牌風，半寫實，無文字",
    promptEn:
      "Zhang Liang, a Yellow Turban general, wearing yellow rebel armor with talisman sashes, holding a polearm before altar flames, fanatical and intimidating mini-boss portrait in the Three Kingdoms chaos, eastern epic card game style, semi-realistic, no text.",
    negativePrompt: sharedNegativePrompt,
    status: "planned",
  },
  {
    id: "enemy-zhang-bao",
    name: "張寶",
    type: "mini-boss",
    priority: "P0",
    aspectRatio: "3:4",
    path: "public/images/enemies/zhang-bao.png",
    usage: "第 7 關 mini-boss",
    promptZh:
      "張寶，黃巾軍地公將軍，術士將領造型，手持法杖與符紙，身後妖風與祭壇火盆，詭譎沉著，三國亂世 mini-boss 立繪，東方史詩卡牌風，半寫實，無文字",
    promptEn:
      "Zhang Bao, a Yellow Turban sorcerer general, holding a ritual staff and talisman papers, eerie wind and altar braziers behind him, mysterious and composed mini-boss portrait in the Three Kingdoms chaos, eastern epic card game style, semi-realistic, no text.",
    negativePrompt: sharedNegativePrompt,
    status: "planned",
  },
  {
    id: "stage-mountain-ambush",
    name: "山道伏兵",
    type: "stage-background",
    priority: "P0",
    aspectRatio: "9:16 或 16:9",
    path: "public/images/stages/mountain-ambush.png",
    usage: "第 2 關背景",
    promptZh:
      "狹窄山道伏兵場景，兩側密林與霧氣，遠處黃巾旗影若隱若現，地面有車轍與落葉，緊張伏擊氛圍，東方史詩卡牌風，半寫實場景，電影感光影，無文字",
    promptEn:
      "A narrow mountain road ambush scene, dense forest and mist on both sides, faint Yellow Turban banners in the distance, wheel tracks and fallen leaves on the ground, tense ambush atmosphere, eastern epic card game style, semi-realistic environment, cinematic lighting, no text.",
    negativePrompt: sharedNegativePrompt,
    status: "planned",
  },
  {
    id: "stage-ruined-temple-night",
    name: "破廟夜戰",
    type: "stage-background",
    priority: "P0",
    aspectRatio: "9:16 或 16:9",
    path: "public/images/stages/ruined-temple-night.png",
    usage: "第 3 關背景",
    promptZh:
      "破敗古廟夜戰背景，殘破神像、斷裂樑柱與搖曳火光，門外敵影逼近，夜色壓迫而不血腥，東方史詩卡牌風，半寫實，電影感光影，無文字",
    promptEn:
      "A ruined ancient temple at night for a battle scene, broken statues, cracked beams and flickering firelight, enemy silhouettes approaching outside, oppressive but non-gory atmosphere, eastern epic card game style, semi-realistic, cinematic lighting, no text.",
    negativePrompt: sharedNegativePrompt,
    status: "planned",
  },
  {
    id: "stage-black-mountain-camp",
    name: "黑山賊寨",
    type: "stage-background",
    priority: "P0",
    aspectRatio: "9:16 或 16:9",
    path: "public/images/stages/black-mountain-camp.png",
    usage: "第 4 關背景",
    promptZh:
      "黑山賊寨背景，山間木柵高牆、黑旗、巡邏火把與簡陋哨塔，遠處山霧壓低天空，賊寨守備森嚴，東方史詩卡牌風，半寫實場景，無文字",
    promptEn:
      "A Black Mountain bandit camp background, wooden palisades in the mountains, black banners, patrol torches and rough watchtowers, mountain mist under a heavy sky, heavily guarded bandit stronghold, eastern epic card game style, semi-realistic environment, no text.",
    negativePrompt: sharedNegativePrompt,
    status: "planned",
  },
  {
    id: "stage-xiliang-charge",
    name: "西涼突騎",
    type: "stage-background",
    priority: "P0",
    aspectRatio: "9:16 或 16:9",
    path: "public/images/stages/xiliang-charge.png",
    usage: "第 5 關背景",
    promptZh:
      "西涼突騎戰場背景，荒原塵土飛揚，遠方鐵騎隊形衝鋒，長槍與旌旗形成壓迫線條，三國亂世戰場，東方史詩卡牌風，半寫實，電影感，無文字",
    promptEn:
      "A Xiliang cavalry charge battlefield background, dust rising across a wasteland, distant armored riders charging in formation, spears and banners creating strong pressure lines, Three Kingdoms chaotic battlefield, eastern epic card game style, semi-realistic, cinematic, no text.",
    negativePrompt: sharedNegativePrompt,
    status: "planned",
  },
  {
    id: "stage-ancient-battlefield",
    name: "古戰場遺跡",
    type: "stage-background",
    priority: "P0",
    aspectRatio: "9:16 或 16:9",
    path: "public/images/stages/ancient-battlefield.png",
    usage: "第 6 關背景",
    promptZh:
      "古戰場遺跡背景，斷戟殘旗、荒草、破碎戰車與黃昏雲層，地面散落舊甲片，史詩荒涼感，東方史詩卡牌風，半寫實場景，電影感光影，無文字",
    promptEn:
      "An ancient battlefield ruin background, broken halberds, torn banners, wild grass, shattered war carts and dusk clouds, old armor fragments scattered on the ground, epic desolate mood, eastern epic card game style, semi-realistic environment, cinematic lighting, no text.",
    negativePrompt: sharedNegativePrompt,
    status: "planned",
  },
  {
    id: "stage-yellow-turban-altar",
    name: "黃巾祭壇",
    type: "stage-background",
    priority: "P0",
    aspectRatio: "9:16 或 16:9",
    path: "public/images/stages/yellow-turban-altar.png",
    usage: "第 7 關背景",
    promptZh:
      "黃巾祭壇背景，符咒飄動、火盆環繞、破舊黃巾旗與詭異雲光，祭壇中央留出戰鬥空間，神秘危險但不恐怖血腥，東方史詩卡牌風，半寫實，無文字",
    promptEn:
      "A Yellow Turban altar background, talismans fluttering, braziers around the altar, worn yellow banners and eerie cloud light, clear central space for battle composition, mysterious and dangerous without gore, eastern epic card game style, semi-realistic, no text.",
    negativePrompt: sharedNegativePrompt,
    status: "planned",
  },
  {
    id: "route-mountain-path",
    name: "山道",
    type: "route",
    priority: "P1",
    aspectRatio: "9:16",
    path: "public/images/routes/mountain-path.png",
    usage: "路線選擇卡：山道",
    promptZh:
      "三國亂世山道路線圖，崎嶇小徑穿過深林與山霧，遠處有清泉微光與隱約軍旗，生存補給感，手機直屏 9:16，東方史詩卡牌風，半寫實，無文字",
    promptEn:
      "A mountain path route image in the chaotic Three Kingdoms era, rugged trail through deep forest and mist, faint spring glow and distant banners, survival and supply mood, mobile vertical 9:16, eastern epic card game style, semi-realistic, no text.",
    negativePrompt: sharedNegativePrompt,
    status: "planned",
  },
  {
    id: "route-official-road",
    name: "官道",
    type: "route",
    priority: "P1",
    aspectRatio: "9:16",
    path: "public/images/routes/official-road.png",
    usage: "路線選擇卡：官道",
    promptZh:
      "三國亂世官道路線圖，古代大道延伸遠方，車轍、驛站旗幟與殘存軍令木牌，穩定情報與主線推進感，手機直屏 9:16，東方史詩卡牌風，半寫實，無文字",
    promptEn:
      "An official road route image in the chaotic Three Kingdoms era, ancient road stretching into the distance, wheel tracks, relay station banners and remnant military order markers, stable intelligence and main-route feeling, mobile vertical 9:16, eastern epic card game style, semi-realistic, no text.",
    negativePrompt: sharedNegativePrompt,
    status: "planned",
  },
  {
    id: "route-dangerous-pass",
    name: "險道",
    type: "route",
    priority: "P1",
    aspectRatio: "9:16",
    path: "public/images/routes/dangerous-pass.png",
    usage: "路線選擇卡：險道",
    promptZh:
      "三國亂世險道路線圖，絕壁山隘、破碎古戰場遺跡與遠處伏兵火光，危險與奇遇並存，手機直屏 9:16，東方史詩卡牌風，半寫實，電影感光影，無文字",
    promptEn:
      "A dangerous pass route image in the chaotic Three Kingdoms era, cliffside mountain pass, broken ancient battlefield relics and distant ambush firelight, danger and rare opportunity together, mobile vertical 9:16, eastern epic card game style, semi-realistic, cinematic lighting, no text.",
    negativePrompt: sharedNegativePrompt,
    status: "planned",
  },
  {
    id: "route-mountain-spring",
    name: "山泉療傷",
    type: "route-event",
    priority: "P2",
    aspectRatio: "9:16",
    path: "public/images/events/route-mountain-spring.png",
    usage: "山道路線事件",
    promptZh:
      "山林深處清泉療傷事件圖，石間泉水發出柔和光芒，武器靠在石邊，旅人短暫休整，三國亂世中的安寧片刻，手機直屏 9:16，東方史詩卡牌風，半寫實，無文字",
    promptEn:
      "A healing mountain spring route event image, soft glowing water among stones deep in the forest, weapons resting by the rocks, travelers briefly recovering, a calm moment in the Three Kingdoms chaos, mobile vertical 9:16, eastern epic card game style, semi-realistic, no text.",
    negativePrompt: sharedNegativePrompt,
    status: "planned",
  },
  {
    id: "route-hermit-guidance",
    name: "隱士指路",
    type: "route-event",
    priority: "P2",
    aspectRatio: "9:16",
    path: "public/images/events/route-hermit-guidance.png",
    usage: "山道路線事件",
    promptZh:
      "山中隱士指路事件圖，白髮隱士站在竹林小徑旁指向遠方，地上攤開簡略地圖，霧氣與晨光交錯，三國亂世策略氛圍，手機直屏 9:16，半寫實，無文字",
    promptEn:
      "A hermit guidance route event image, an old hermit beside a bamboo forest path pointing into the distance, a simple map laid on the ground, mist and morning light crossing, strategic Three Kingdoms atmosphere, mobile vertical 9:16, semi-realistic, no text.",
    negativePrompt: sharedNegativePrompt,
    status: "planned",
  },
  {
    id: "route-misty-path",
    name: "迷霧小徑",
    type: "route-event",
    priority: "P2",
    aspectRatio: "9:16",
    path: "public/images/events/route-misty-path.png",
    usage: "山道路線事件",
    promptZh:
      "迷霧小徑事件圖，狹窄山徑被濃霧吞沒，前方道路分岔，遠處有模糊敵旗影子，避開強敵但失去方向的感覺，手機直屏 9:16，東方史詩卡牌風，半寫實，無文字",
    promptEn:
      "A misty trail route event image, a narrow mountain path swallowed by thick fog, forked road ahead, faint enemy banner silhouettes in the distance, feeling of avoiding danger but losing direction, mobile vertical 9:16, eastern epic card game style, semi-realistic, no text.",
    negativePrompt: sharedNegativePrompt,
    status: "planned",
  },
  {
    id: "route-post-station",
    name: "驛站補給",
    type: "route-event",
    priority: "P2",
    aspectRatio: "9:16",
    path: "public/images/events/route-post-station.png",
    usage: "官道路線事件",
    promptZh:
      "官道驛站補給事件圖，破舊驛站、糧袋、木桶與馬匹韁繩，殘存秩序中的補給點，暖色燈火與戰場遠煙，手機直屏 9:16，東方史詩卡牌風，半寫實，無文字",
    promptEn:
      "A relay station supply route event image, worn roadside station, grain sacks, barrels and horse reins, a supply point within remaining order, warm lantern light and distant battlefield smoke, mobile vertical 9:16, eastern epic card game style, semi-realistic, no text.",
    negativePrompt: sharedNegativePrompt,
    status: "planned",
  },
  {
    id: "route-military-dispatch",
    name: "軍令急報",
    type: "route-event",
    priority: "P2",
    aspectRatio: "9:16",
    path: "public/images/events/route-military-dispatch.png",
    usage: "官道路線事件",
    promptZh:
      "軍令急報事件圖，破損竹簡軍令與地圖放在木案上，旁邊有令旗與封泥，燭光照亮敵軍部署線索，三國策略情報氛圍，手機直屏 9:16，半寫實，無文字",
    promptEn:
      "A military dispatch route event image, damaged bamboo order slips and a map on a wooden table, command flag and seal clay nearby, candlelight revealing enemy deployment clues, Three Kingdoms strategy intelligence mood, mobile vertical 9:16, semi-realistic, no text.",
    negativePrompt: sharedNegativePrompt,
    status: "planned",
  },
  {
    id: "route-remnant-troops",
    name: "官軍殘部",
    type: "route-event",
    priority: "P2",
    aspectRatio: "9:16",
    path: "public/images/events/route-remnant-troops.png",
    usage: "官道路線事件",
    promptZh:
      "官軍殘部事件圖，幾名疲憊士兵在破旗旁重新整隊，盔甲破舊但眼神堅定，背景是官道與遠處烽煙，支援與重整氣氛，手機直屏 9:16，東方史詩卡牌風，半寫實，無文字",
    promptEn:
      "A remnant troops route event image, a few exhausted soldiers regrouping beside a torn banner, worn armor but determined eyes, official road and distant smoke in the background, support and recovery mood, mobile vertical 9:16, eastern epic card game style, semi-realistic, no text.",
    negativePrompt: sharedNegativePrompt,
    status: "planned",
  },
  {
    id: "route-cliff-ambush",
    name: "絕壁伏擊",
    type: "route-event",
    priority: "P2",
    aspectRatio: "9:16",
    path: "public/images/events/route-cliff-ambush.png",
    usage: "險道路線事件",
    promptZh:
      "絕壁伏擊事件圖，兩側高聳峭壁夾住狹路，上方伏兵火把與落石陰影，主角視角即將突圍，危險但不血腥，手機直屏 9:16，東方史詩卡牌風，半寫實，電影感光影，無文字",
    promptEn:
      "A cliff ambush route event image, towering cliffs squeezing a narrow road, ambusher torches and falling rock shadows above, viewpoint of breaking through danger, tense but non-gory, mobile vertical 9:16, eastern epic card game style, semi-realistic, cinematic lighting, no text.",
    negativePrompt: sharedNegativePrompt,
    status: "planned",
  },
  {
    id: "route-battlefield-relic",
    name: "古戰場遺物",
    type: "route-event",
    priority: "P2",
    aspectRatio: "9:16",
    path: "public/images/events/route-battlefield-relic.png",
    usage: "險道路線事件",
    promptZh:
      "古戰場遺物事件圖，荒草中露出古老兵器與破碎甲片，微弱金色光芒照亮名將遺物，遠處殘旗與暮色，稀有奇遇感，手機直屏 9:16，東方史詩卡牌風，半寫實，無文字",
    promptEn:
      "A battlefield relic route event image, ancient weapon and broken armor pieces emerging from wild grass, faint golden light illuminating a legendary relic, torn banners and dusk in the distance, rare discovery mood, mobile vertical 9:16, eastern epic card game style, semi-realistic, no text.",
    negativePrompt: sharedNegativePrompt,
    status: "planned",
  },
  {
    id: "route-night-raid",
    name: "夜襲敵營",
    type: "route-event",
    priority: "P2",
    aspectRatio: "9:16",
    path: "public/images/events/route-night-raid.png",
    usage: "險道路線事件",
    promptZh:
      "夜襲敵營事件圖，夜色中營寨火光閃爍，遠處巡邏敵兵剪影，前景是壓低身形的突襲隊伍與暗色兵器，緊張豪賭氛圍但不血腥，手機直屏 9:16，東方史詩卡牌風，半寫實，無文字",
    promptEn:
      "A night raid route event image, enemy camp fires flickering in darkness, patrol silhouettes in the distance, foreground raiding party crouching with dark weapons, tense high-risk mood without gore, mobile vertical 9:16, eastern epic card game style, semi-realistic, no text.",
    negativePrompt: sharedNegativePrompt,
    status: "planned",
  },
];
