# 第一章圖片缺口清單 v0.19.0-pre

## 1. 文件目的

本文件整理《三國單騎傳》第一章「黃巾亂起」目前已完成與尚未完成的圖片資產，作為後續 AI 圖像批量生成清單。v0.19.0-pre 只建立文件與結構化 manifest，不新增真實圖片，也不把不存在的圖片標記為 ready。

結構化資料位於 `lib/game/imageGapManifest.ts`：

- `CHAPTER_1_READY_IMAGE_MANIFEST`：已完成圖片。
- `CHAPTER_1_IMAGE_GAP_MANIFEST`：尚未完成圖片缺口。

## 2. 統一美術風格

統一風格：東方史詩卡牌風 × 三國亂世 × 半寫實插畫 × 手機直屏遊戲視覺。

要求：

- 適合手機 9:16 直屏遊戲。
- 三國亂世氛圍。
- 精緻卡牌遊戲質感。
- 電影感光影。
- 不模仿現有影視 / 遊戲 / 動漫 IP。
- 不使用受版權保護角色造型。
- 不要文字、水印、Logo。
- 避免血腥暴力。
- 適合教學展示。

通用 negativePrompt：

```text
文字、Logo、水印、現代武器、科幻裝備、卡通風、血腥畫面、畸形手指、重複人物、受版權保護角色造型
```

## 3. 已完成圖片清單

| id | name | type | path | usage | status |
| --- | --- | --- | --- | --- | --- |
| home-hero | 首頁主視覺 | cover | /images/covers/home-hero.png | 首頁主視覺 | ready |
| hero-guan-yu | 關羽 | hero | /images/heroes/guan-yu.png | 武將選擇、遊戲玩家面板 | ready |
| hero-zhao-yun | 趙雲 | hero | /images/heroes/zhao-yun.png | 武將選擇、遊戲玩家面板 | ready |
| hero-zhuge-liang | 諸葛亮 | hero | /images/heroes/zhuge-liang.png | 武將選擇、遊戲玩家面板 | ready |
| enemy-yellow-turban-soldier | 黃巾兵 | enemy | /images/enemies/yellow-turban-soldier.png | 敵人面板 | ready |
| enemy-bandit-leader | 山賊頭目 | enemy | /images/enemies/bandit-leader.png | 敵人面板 | ready |
| enemy-xiliang-cavalry | 西涼騎兵 | enemy | /images/enemies/xiliang-cavalry.png | 敵人面板 | ready |
| enemy-lu-bu | 呂布 | boss | /images/enemies/lu-bu.png | Boss 敵人面板 | ready |
| stage-abandoned-village | 荒村初戰背景 | stage-background | /images/stages/abandoned-village.png | 第 1 關背景 | ready |
| stage-hulao-gate | 虎牢關前背景 | stage-background | /images/stages/hulao-gate.png | 第 8 關背景 | ready |

## 4. 尚未完成圖片清單

### P0：敵人圖片缺口

| id | name | type | 建議比例 | 建議路徑 | 使用位置 | 優先級 | status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| enemy-yellow-turban-archer | 黃巾弓手 | enemy | 3:4 | public/images/enemies/yellow-turban-archer.png | 敵人面板 | P0 | planned |
| enemy-yellow-turban-brute | 黃巾力士 | enemy | 3:4 | public/images/enemies/yellow-turban-brute.png | 敵人面板 | P0 | planned |
| enemy-black-mountain-general | 黑山賊將 | enemy | 3:4 | public/images/enemies/black-mountain-general.png | 敵人面板 | P0 | planned |
| enemy-zhang-liang | 張梁 | mini-boss | 3:4 | public/images/enemies/zhang-liang.png | 第 7 關 mini-boss | P0 | planned |
| enemy-zhang-bao | 張寶 | mini-boss | 3:4 | public/images/enemies/zhang-bao.png | 第 7 關 mini-boss | P0 | planned |

### P0：關卡背景缺口

| id | name | type | 建議比例 | 建議路徑 | 使用位置 | 優先級 | status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| stage-mountain-ambush | 山道伏兵 | stage-background | 9:16 或 16:9 | public/images/stages/mountain-ambush.png | 第 2 關背景 | P0 | planned |
| stage-ruined-temple-night | 破廟夜戰 | stage-background | 9:16 或 16:9 | public/images/stages/ruined-temple-night.png | 第 3 關背景 | P0 | planned |
| stage-black-mountain-camp | 黑山賊寨 | stage-background | 9:16 或 16:9 | public/images/stages/black-mountain-camp.png | 第 4 關背景 | P0 | planned |
| stage-xiliang-charge | 西涼突騎 | stage-background | 9:16 或 16:9 | public/images/stages/xiliang-charge.png | 第 5 關背景 | P0 | planned |
| stage-ancient-battlefield | 古戰場遺跡 | stage-background | 9:16 或 16:9 | public/images/stages/ancient-battlefield.png | 第 6 關背景 | P0 | planned |
| stage-yellow-turban-altar | 黃巾祭壇 | stage-background | 9:16 或 16:9 | public/images/stages/yellow-turban-altar.png | 第 7 關背景 | P0 | planned |

荒村初戰與虎牢關前已完成，不列為缺口。

### P1：路線圖片缺口

| id | name | type | 建議比例 | 建議路徑 | 使用位置 | 優先級 | status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| route-mountain-path | 山道 | route | 9:16 | public/images/routes/mountain-path.png | 路線選擇卡：山道 | P1 | planned |
| route-official-road | 官道 | route | 9:16 | public/images/routes/official-road.png | 路線選擇卡：官道 | P1 | planned |
| route-dangerous-pass | 險道 | route | 9:16 | public/images/routes/dangerous-pass.png | 路線選擇卡：險道 | P1 | planned |

### P2：路線事件圖片缺口

| id | name | type | 建議比例 | 建議路徑 | 使用位置 | 優先級 | status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| route-mountain-spring | 山泉療傷 | route-event | 9:16 | public/images/events/route-mountain-spring.png | 山道路線事件 | P2 | planned |
| route-hermit-guidance | 隱士指路 | route-event | 9:16 | public/images/events/route-hermit-guidance.png | 山道路線事件 | P2 | planned |
| route-misty-path | 迷霧小徑 | route-event | 9:16 | public/images/events/route-misty-path.png | 山道路線事件 | P2 | planned |
| route-post-station | 驛站補給 | route-event | 9:16 | public/images/events/route-post-station.png | 官道路線事件 | P2 | planned |
| route-military-dispatch | 軍令急報 | route-event | 9:16 | public/images/events/route-military-dispatch.png | 官道路線事件 | P2 | planned |
| route-remnant-troops | 官軍殘部 | route-event | 9:16 | public/images/events/route-remnant-troops.png | 官道路線事件 | P2 | planned |
| route-cliff-ambush | 絕壁伏擊 | route-event | 9:16 | public/images/events/route-cliff-ambush.png | 險道路線事件 | P2 | planned |
| route-battlefield-relic | 古戰場遺物 | route-event | 9:16 | public/images/events/route-battlefield-relic.png | 險道路線事件 | P2 | planned |
| route-night-raid | 夜襲敵營 | route-event | 9:16 | public/images/events/route-night-raid.png | 險道路線事件 | P2 | planned |

## 5. 生成優先級

- P0：先補齊敵人與關卡背景。這些會直接影響第一章戰鬥辨識與關卡沉浸感，共 11 筆。
- P1：補齊三條路線選擇圖，強化路線風格差異，共 3 筆。
- P2：補齊 9 個路線事件圖，用於後續事件展示強化。

`CHAPTER_1_IMAGE_GAP_MANIFEST` 目前共有 23 筆：P0 11 筆、P1 3 筆、P2 9 筆。

## 6. 建議比例

- 敵人與 mini-boss：3:4，適合敵人面板與卡牌式立繪。
- 關卡背景：9:16 或 16:9。若要優先服務手機直屏，可先產 9:16；若要沿用現有關卡背景容器，可產 16:9。
- 路線與路線事件：9:16，適合手機直屏與未來事件卡展示。

## 7. 建議檔案路徑

- 敵人與 mini-boss：`public/images/enemies/{id-without-enemy-prefix}.png`
- 關卡背景：`public/images/stages/{stage-key}.png`
- 路線圖片：`public/images/routes/{route-key}.png`
- 路線事件：`public/images/events/{route-event-key}.png`

導入遊戲 UI 時，public path 需使用 `/images/...`；本文件的建議路徑使用 repo 內實際存放位置。

## 8. 中文提示詞

| id | promptZh |
| --- | --- |
| enemy-yellow-turban-archer | 三國亂世中的黃巾弓手，身穿破舊黃布甲，手持長弓，站在煙塵戰場邊緣，背後有殘破黃巾旗幟，東方史詩卡牌風，半寫實，電影感光影，無文字 |
| enemy-yellow-turban-brute | 黃巾力士，高大壯碩的亂軍戰士，粗布甲與黃巾符布，雙手握著沉重木槌，踏在泥濘戰場上，東方史詩卡牌風，半寫實，壓迫感光影，無文字 |
| enemy-black-mountain-general | 黑山賊將，深色皮甲與鐵片護肩，手持大刀與盾牌，身後是山寨木柵與黑旗，沉穩兇悍的賊將氣勢，東方史詩卡牌風，半寫實，無文字 |
| enemy-zhang-liang | 張梁，黃巾軍人公將軍，黃巾戰甲與符咒披帶，手持長兵器站在祭壇火光前，狂熱威壓，三國亂世 mini-boss 立繪，東方史詩卡牌風，半寫實，無文字 |
| enemy-zhang-bao | 張寶，黃巾軍地公將軍，術士將領造型，手持法杖與符紙，身後妖風與祭壇火盆，詭譎沉著，三國亂世 mini-boss 立繪，東方史詩卡牌風，半寫實，無文字 |
| stage-mountain-ambush | 狹窄山道伏兵場景，兩側密林與霧氣，遠處黃巾旗影若隱若現，地面有車轍與落葉，緊張伏擊氛圍，東方史詩卡牌風，半寫實場景，電影感光影，無文字 |
| stage-ruined-temple-night | 破敗古廟夜戰背景，殘破神像、斷裂樑柱與搖曳火光，門外敵影逼近，夜色壓迫而不血腥，東方史詩卡牌風，半寫實，電影感光影，無文字 |
| stage-black-mountain-camp | 黑山賊寨背景，山間木柵高牆、黑旗、巡邏火把與簡陋哨塔，遠處山霧壓低天空，賊寨守備森嚴，東方史詩卡牌風，半寫實場景，無文字 |
| stage-xiliang-charge | 西涼突騎戰場背景，荒原塵土飛揚，遠方鐵騎隊形衝鋒，長槍與旌旗形成壓迫線條，三國亂世戰場，東方史詩卡牌風，半寫實，電影感，無文字 |
| stage-ancient-battlefield | 古戰場遺跡背景，斷戟殘旗、荒草、破碎戰車與黃昏雲層，地面散落舊甲片，史詩荒涼感，東方史詩卡牌風，半寫實場景，電影感光影，無文字 |
| stage-yellow-turban-altar | 黃巾祭壇背景，符咒飄動、火盆環繞、破舊黃巾旗與詭異雲光，祭壇中央留出戰鬥空間，神秘危險但不恐怖血腥，東方史詩卡牌風，半寫實，無文字 |
| route-mountain-path | 三國亂世山道路線圖，崎嶇小徑穿過深林與山霧，遠處有清泉微光與隱約軍旗，生存補給感，手機直屏 9:16，東方史詩卡牌風，半寫實，無文字 |
| route-official-road | 三國亂世官道路線圖，古代大道延伸遠方，車轍、驛站旗幟與殘存軍令木牌，穩定情報與主線推進感，手機直屏 9:16，東方史詩卡牌風，半寫實，無文字 |
| route-dangerous-pass | 三國亂世險道路線圖，絕壁山隘、破碎古戰場遺跡與遠處伏兵火光，危險與奇遇並存，手機直屏 9:16，東方史詩卡牌風，半寫實，電影感光影，無文字 |
| route-mountain-spring | 山林深處清泉療傷事件圖，石間泉水發出柔和光芒，武器靠在石邊，旅人短暫休整，三國亂世中的安寧片刻，手機直屏 9:16，東方史詩卡牌風，半寫實，無文字 |
| route-hermit-guidance | 山中隱士指路事件圖，白髮隱士站在竹林小徑旁指向遠方，地上攤開簡略地圖，霧氣與晨光交錯，三國亂世策略氛圍，手機直屏 9:16，半寫實，無文字 |
| route-misty-path | 迷霧小徑事件圖，狹窄山徑被濃霧吞沒，前方道路分岔，遠處有模糊敵旗影子，避開強敵但失去方向的感覺，手機直屏 9:16，東方史詩卡牌風，半寫實，無文字 |
| route-post-station | 官道驛站補給事件圖，破舊驛站、糧袋、木桶與馬匹韁繩，殘存秩序中的補給點，暖色燈火與戰場遠煙，手機直屏 9:16，東方史詩卡牌風，半寫實，無文字 |
| route-military-dispatch | 軍令急報事件圖，破損竹簡軍令與地圖放在木案上，旁邊有令旗與封泥，燭光照亮敵軍部署線索，三國策略情報氛圍，手機直屏 9:16，半寫實，無文字 |
| route-remnant-troops | 官軍殘部事件圖，幾名疲憊士兵在破旗旁重新整隊，盔甲破舊但眼神堅定，背景是官道與遠處烽煙，支援與重整氣氛，手機直屏 9:16，東方史詩卡牌風，半寫實，無文字 |
| route-cliff-ambush | 絕壁伏擊事件圖，兩側高聳峭壁夾住狹路，上方伏兵火把與落石陰影，主角視角即將突圍，危險但不血腥，手機直屏 9:16，東方史詩卡牌風，半寫實，電影感光影，無文字 |
| route-battlefield-relic | 古戰場遺物事件圖，荒草中露出古老兵器與破碎甲片，微弱金色光芒照亮名將遺物，遠處殘旗與暮色，稀有奇遇感，手機直屏 9:16，東方史詩卡牌風，半寫實，無文字 |
| route-night-raid | 夜襲敵營事件圖，夜色中營寨火光閃爍，遠處巡邏敵兵剪影，前景是壓低身形的突襲隊伍與暗色兵器，緊張豪賭氛圍但不血腥，手機直屏 9:16，東方史詩卡牌風，半寫實，無文字 |

## 9. 英文提示詞

| id | promptEn |
| --- | --- |
| enemy-yellow-turban-archer | A Yellow Turban archer in the chaotic Three Kingdoms era, wearing worn yellow cloth armor, holding a longbow at the edge of a smoky battlefield, torn Yellow Turban banners behind, eastern epic card game style, semi-realistic, cinematic lighting, no text. |
| enemy-yellow-turban-brute | A Yellow Turban brute, a massive rebel warrior with rough cloth armor and yellow talisman cloth, gripping a heavy wooden maul with both hands on a muddy battlefield, eastern epic card game style, semi-realistic, imposing cinematic lighting, no text. |
| enemy-black-mountain-general | A Black Mountain bandit general in dark leather armor with iron shoulder plates, holding a broad blade and shield, wooden mountain fort and black banners behind, calm but fierce commander presence, eastern epic card game style, semi-realistic, no text. |
| enemy-zhang-liang | Zhang Liang, a Yellow Turban general, wearing yellow rebel armor with talisman sashes, holding a polearm before altar flames, fanatical and intimidating mini-boss portrait in the Three Kingdoms chaos, eastern epic card game style, semi-realistic, no text. |
| enemy-zhang-bao | Zhang Bao, a Yellow Turban sorcerer general, holding a ritual staff and talisman papers, eerie wind and altar braziers behind him, mysterious and composed mini-boss portrait in the Three Kingdoms chaos, eastern epic card game style, semi-realistic, no text. |
| stage-mountain-ambush | A narrow mountain road ambush scene, dense forest and mist on both sides, faint Yellow Turban banners in the distance, wheel tracks and fallen leaves on the ground, tense ambush atmosphere, eastern epic card game style, semi-realistic environment, cinematic lighting, no text. |
| stage-ruined-temple-night | A ruined ancient temple at night for a battle scene, broken statues, cracked beams and flickering firelight, enemy silhouettes approaching outside, oppressive but non-gory atmosphere, eastern epic card game style, semi-realistic, cinematic lighting, no text. |
| stage-black-mountain-camp | A Black Mountain bandit camp background, wooden palisades in the mountains, black banners, patrol torches and rough watchtowers, mountain mist under a heavy sky, heavily guarded bandit stronghold, eastern epic card game style, semi-realistic environment, no text. |
| stage-xiliang-charge | A Xiliang cavalry charge battlefield background, dust rising across a wasteland, distant armored riders charging in formation, spears and banners creating strong pressure lines, Three Kingdoms chaotic battlefield, eastern epic card game style, semi-realistic, cinematic, no text. |
| stage-ancient-battlefield | An ancient battlefield ruin background, broken halberds, torn banners, wild grass, shattered war carts and dusk clouds, old armor fragments scattered on the ground, epic desolate mood, eastern epic card game style, semi-realistic environment, cinematic lighting, no text. |
| stage-yellow-turban-altar | A Yellow Turban altar background, talismans fluttering, braziers around the altar, worn yellow banners and eerie cloud light, clear central space for battle composition, mysterious and dangerous without gore, eastern epic card game style, semi-realistic, no text. |
| route-mountain-path | A mountain path route image in the chaotic Three Kingdoms era, rugged trail through deep forest and mist, faint spring glow and distant banners, survival and supply mood, mobile vertical 9:16, eastern epic card game style, semi-realistic, no text. |
| route-official-road | An official road route image in the chaotic Three Kingdoms era, ancient road stretching into the distance, wheel tracks, relay station banners and remnant military order markers, stable intelligence and main-route feeling, mobile vertical 9:16, eastern epic card game style, semi-realistic, no text. |
| route-dangerous-pass | A dangerous pass route image in the chaotic Three Kingdoms era, cliffside mountain pass, broken ancient battlefield relics and distant ambush firelight, danger and rare opportunity together, mobile vertical 9:16, eastern epic card game style, semi-realistic, cinematic lighting, no text. |
| route-mountain-spring | A healing mountain spring route event image, soft glowing water among stones deep in the forest, weapons resting by the rocks, travelers briefly recovering, a calm moment in the Three Kingdoms chaos, mobile vertical 9:16, eastern epic card game style, semi-realistic, no text. |
| route-hermit-guidance | A hermit guidance route event image, an old hermit beside a bamboo forest path pointing into the distance, a simple map laid on the ground, mist and morning light crossing, strategic Three Kingdoms atmosphere, mobile vertical 9:16, semi-realistic, no text. |
| route-misty-path | A misty trail route event image, a narrow mountain path swallowed by thick fog, forked road ahead, faint enemy banner silhouettes in the distance, feeling of avoiding danger but losing direction, mobile vertical 9:16, eastern epic card game style, semi-realistic, no text. |
| route-post-station | A relay station supply route event image, worn roadside station, grain sacks, barrels and horse reins, a supply point within remaining order, warm lantern light and distant battlefield smoke, mobile vertical 9:16, eastern epic card game style, semi-realistic, no text. |
| route-military-dispatch | A military dispatch route event image, damaged bamboo order slips and a map on a wooden table, command flag and seal clay nearby, candlelight revealing enemy deployment clues, Three Kingdoms strategy intelligence mood, mobile vertical 9:16, semi-realistic, no text. |
| route-remnant-troops | A remnant troops route event image, a few exhausted soldiers regrouping beside a torn banner, worn armor but determined eyes, official road and distant smoke in the background, support and recovery mood, mobile vertical 9:16, eastern epic card game style, semi-realistic, no text. |
| route-cliff-ambush | A cliff ambush route event image, towering cliffs squeezing a narrow road, ambusher torches and falling rock shadows above, viewpoint of breaking through danger, tense but non-gory, mobile vertical 9:16, eastern epic card game style, semi-realistic, cinematic lighting, no text. |
| route-battlefield-relic | A battlefield relic route event image, ancient weapon and broken armor pieces emerging from wild grass, faint golden light illuminating a legendary relic, torn banners and dusk in the distance, rare discovery mood, mobile vertical 9:16, eastern epic card game style, semi-realistic, no text. |
| route-night-raid | A night raid route event image, enemy camp fires flickering in darkness, patrol silhouettes in the distance, foreground raiding party crouching with dark weapons, tense high-risk mood without gore, mobile vertical 9:16, eastern epic card game style, semi-realistic, no text. |

## 10. 批量生成檢查表

- [ ] 先生成 P0：5 張敵人 / mini-boss 立繪與 6 張關卡背景。
- [ ] 確認所有圖都沒有文字、水印、Logo。
- [ ] 確認所有圖都沒有模仿現有影視 / 遊戲 / 動漫 IP。
- [ ] 確認所有圖都不使用受版權保護角色造型。
- [ ] 確認所有圖避免血腥暴力，適合教學展示。
- [ ] 確認敵人與 mini-boss 為 3:4，關卡背景可用 9:16 或 16:9。
- [ ] 檔名與建議路徑完全一致。
- [ ] 放入 `public/images` 後，再逐筆更新遊戲資料路徑，不要一次改動無檔案項目。
- [ ] 導入時確認 fallback 仍可在圖片缺失或載入失敗時正常顯示。
