export type VisualAssetType =
  | "cover"
  | "hero"
  | "enemy"
  | "boss"
  | "stage-background"
  | "route"
  | "route-event";

export interface VisualAssetManifestItem {
  id: string;
  type: VisualAssetType;
  name: string;
  aspectRatio: "16:9" | "3:4" | "9:16";
  path: string;
  usage: string;
  promptZh: string;
  promptEn: string;
  status?: "planned" | "ready";
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
    id: "hero-li-shimin-ai-architect",
    type: "hero",
    name: "李詩民｜AI 架構師",
    aspectRatio: "3:4",
    path: "/images/heroes/li-shimin-ai-architect.png",
    usage: "首頁角色卡、遊戲玩家面板",
    promptZh:
      "東方亂世中的 AI 架構師軍師，身穿深色東方長袍，帶有藍金色資料光紋，手持卷軸或玉簡，背後浮現戰略圖、星盤與資料節點，半寫實三國卡牌風，電影感光影，不要文字，不要 Logo。",
    promptEn:
      "An AI architect strategist in an eastern chaotic war era, wearing a dark eastern robe with blue and gold data-light patterns, holding a scroll or jade slips, strategic maps, astrolabe and data nodes behind him, semi-realistic Three Kingdoms card game style, cinematic lighting, no text, no logo.",
    status: "ready",
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
  {
    id: "route-mountain-path",
    type: "route",
    name: "山道",
    aspectRatio: "9:16",
    path: "/images/routes/mountain-path.png",
    usage: "路線選擇卡：山道",
    promptZh:
      "三國亂世山道路線圖，崎嶇小徑穿過深林與山霧，遠處有清泉微光與隱約軍旗，生存補給感，手機直屏 9:16，東方史詩卡牌風，半寫實，無文字。",
    promptEn:
      "A mountain path route image in the chaotic Three Kingdoms era, rugged trail through deep forest and mist, faint spring glow and distant banners, survival and supply mood, mobile vertical 9:16, eastern epic card game style, semi-realistic, no text.",
  },
  {
    id: "route-official-road",
    type: "route",
    name: "官道",
    aspectRatio: "9:16",
    path: "/images/routes/official-road.png",
    usage: "路線選擇卡：官道",
    promptZh:
      "三國亂世官道路線圖，古代大道延伸遠方，車轍、驛站旗幟與殘存軍令木牌，穩定情報與主線推進感，手機直屏 9:16，東方史詩卡牌風，半寫實，無文字。",
    promptEn:
      "An official road route image in the chaotic Three Kingdoms era, ancient road stretching into the distance, wheel tracks, relay station banners and remnant military order markers, stable intelligence and main-route feeling, mobile vertical 9:16, eastern epic card game style, semi-realistic, no text.",
  },
  {
    id: "route-dangerous-pass",
    type: "route",
    name: "險道",
    aspectRatio: "9:16",
    path: "/images/routes/dangerous-pass.png",
    usage: "路線選擇卡：險道",
    promptZh:
      "三國亂世險道路線圖，絕壁山隘、破碎古戰場遺跡與遠處伏兵火光，危險與奇遇並存，手機直屏 9:16，東方史詩卡牌風，半寫實，電影感光影，無文字。",
    promptEn:
      "A dangerous pass route image in the chaotic Three Kingdoms era, cliffside mountain pass, broken ancient battlefield relics and distant ambush firelight, danger and rare opportunity together, mobile vertical 9:16, eastern epic card game style, semi-realistic, cinematic lighting, no text.",
  },
  {
    id: "route-mountain-spring",
    type: "route-event",
    name: "山泉療傷",
    aspectRatio: "9:16",
    path: "/images/events/route-mountain-spring.png",
    usage: "山道路線事件",
    promptZh:
      "山林深處清泉療傷事件圖，石間泉水發出柔和光芒，武器靠在石邊，旅人短暫休整，三國亂世中的安寧片刻，手機直屏 9:16，東方史詩卡牌風，半寫實，無文字。",
    promptEn:
      "A healing mountain spring route event image, soft glowing water among stones deep in the forest, weapons resting by the rocks, travelers briefly recovering, a calm moment in the Three Kingdoms chaos, mobile vertical 9:16, eastern epic card game style, semi-realistic, no text.",
  },
  {
    id: "route-hermit-guidance",
    type: "route-event",
    name: "隱士指路",
    aspectRatio: "9:16",
    path: "/images/events/route-hermit-guidance.png",
    usage: "山道路線事件",
    promptZh:
      "山中隱士指路事件圖，白髮隱士站在竹林小徑旁指向遠方，地上攤開簡略地圖，霧氣與晨光交錯，三國亂世策略氛圍，手機直屏 9:16，半寫實，無文字。",
    promptEn:
      "A hermit guidance route event image, an old hermit beside a bamboo forest path pointing into the distance, a simple map laid on the ground, mist and morning light crossing, strategic Three Kingdoms atmosphere, mobile vertical 9:16, semi-realistic, no text.",
  },
  {
    id: "route-misty-path",
    type: "route-event",
    name: "迷霧小徑",
    aspectRatio: "9:16",
    path: "/images/events/route-misty-path.png",
    usage: "山道路線事件",
    promptZh:
      "迷霧小徑事件圖，狹窄山徑被濃霧吞沒，前方道路分岔，遠處有模糊敵旗影子，避開強敵但失去方向的感覺，手機直屏 9:16，東方史詩卡牌風，半寫實，無文字。",
    promptEn:
      "A misty trail route event image, a narrow mountain path swallowed by thick fog, forked road ahead, faint enemy banner silhouettes in the distance, feeling of avoiding danger but losing direction, mobile vertical 9:16, eastern epic card game style, semi-realistic, no text.",
  },
  {
    id: "route-post-station",
    type: "route-event",
    name: "驛站補給",
    aspectRatio: "9:16",
    path: "/images/events/route-post-station.png",
    usage: "官道路線事件",
    promptZh:
      "官道驛站補給事件圖，破舊驛站、糧袋、木桶與馬匹韁繩，殘存秩序中的補給點，暖色燈火與戰場遠煙，手機直屏 9:16，東方史詩卡牌風，半寫實，無文字。",
    promptEn:
      "A relay station supply route event image, worn roadside station, grain sacks, barrels and horse reins, a supply point within remaining order, warm lantern light and distant battlefield smoke, mobile vertical 9:16, eastern epic card game style, semi-realistic, no text.",
  },
  {
    id: "route-military-dispatch",
    type: "route-event",
    name: "軍令急報",
    aspectRatio: "9:16",
    path: "/images/events/route-military-dispatch.png",
    usage: "官道路線事件",
    promptZh:
      "軍令急報事件圖，破損竹簡軍令與地圖放在木案上，旁邊有令旗與封泥，燭光照亮敵軍部署線索，三國策略情報氛圍，手機直屏 9:16，半寫實，無文字。",
    promptEn:
      "A military dispatch route event image, damaged bamboo order slips and a map on a wooden table, command flag and seal clay nearby, candlelight revealing enemy deployment clues, Three Kingdoms strategy intelligence mood, mobile vertical 9:16, semi-realistic, no text.",
  },
  {
    id: "route-remnant-troops",
    type: "route-event",
    name: "官軍殘部",
    aspectRatio: "9:16",
    path: "/images/events/route-remnant-troops.png",
    usage: "官道路線事件",
    promptZh:
      "官軍殘部事件圖，幾名疲憊士兵在破旗旁重新整隊，盔甲破舊但眼神堅定，背景是官道與遠處烽煙，支援與重整氣氛，手機直屏 9:16，東方史詩卡牌風，半寫實，無文字。",
    promptEn:
      "A remnant troops route event image, a few exhausted soldiers regrouping beside a torn banner, worn armor but determined eyes, official road and distant smoke in the background, support and recovery mood, mobile vertical 9:16, eastern epic card game style, semi-realistic, no text.",
  },
  {
    id: "route-cliff-ambush",
    type: "route-event",
    name: "絕壁伏擊",
    aspectRatio: "9:16",
    path: "/images/events/route-cliff-ambush.png",
    usage: "險道路線事件",
    promptZh:
      "絕壁伏擊事件圖，兩側高聳峭壁夾住狹路，上方伏兵火把與落石陰影，主角視角即將突圍，危險但不血腥，手機直屏 9:16，東方史詩卡牌風，半寫實，電影感光影，無文字。",
    promptEn:
      "A cliff ambush route event image, towering cliffs squeezing a narrow road, ambusher torches and falling rock shadows above, viewpoint of breaking through danger, tense but non-gory, mobile vertical 9:16, eastern epic card game style, semi-realistic, cinematic lighting, no text.",
  },
  {
    id: "route-battlefield-relic",
    type: "route-event",
    name: "古戰場遺物",
    aspectRatio: "9:16",
    path: "/images/events/route-battlefield-relic.png",
    usage: "險道路線事件",
    promptZh:
      "古戰場遺物事件圖，荒草中露出古老兵器與破碎甲片，微弱金色光芒照亮名將遺物，遠處殘旗與暮色，稀有奇遇感，手機直屏 9:16，東方史詩卡牌風，半寫實，無文字。",
    promptEn:
      "A battlefield relic route event image, ancient weapon and broken armor pieces emerging from wild grass, faint golden light illuminating a legendary relic, torn banners and dusk in the distance, rare discovery mood, mobile vertical 9:16, eastern epic card game style, semi-realistic, no text.",
  },
  {
    id: "route-night-raid",
    type: "route-event",
    name: "夜襲敵營",
    aspectRatio: "9:16",
    path: "/images/events/route-night-raid.png",
    usage: "險道路線事件",
    promptZh:
      "夜襲敵營事件圖，夜色中營寨火光閃爍，遠處巡邏敵兵剪影，前景是壓低身形的突襲隊伍與暗色兵器，緊張豪賭氛圍但不血腥，手機直屏 9:16，東方史詩卡牌風，半寫實，無文字。",
    promptEn:
      "A night raid route event image, enemy camp fires flickering in darkness, patrol silhouettes in the distance, foreground raiding party crouching with dark weapons, tense high-risk mood without gore, mobile vertical 9:16, eastern epic card game style, semi-realistic, no text.",
  },
];
