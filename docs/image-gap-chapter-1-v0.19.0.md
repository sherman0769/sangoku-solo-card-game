# 第一章圖片缺口清單 v0.19.0

## 1. 文件目的

本文件整理《三國單騎傳》第一章「黃巾亂起」目前已完成與尚未完成的圖片資產，作為後續 AI 圖像批量生成與導入清單。

v0.19.1 已導入三條路線圖片：山道、官道、險道。第一章所有敵人圖、8 個關卡背景圖與三條路線圖已補齊。剩餘缺口只包含 9 張路線事件圖片。

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
| enemy-yellow-turban-archer | 黃巾弓手 | enemy | /images/enemies/yellow-turban-archer.png | 敵人面板 | ready |
| enemy-yellow-turban-brute | 黃巾力士 | enemy | /images/enemies/yellow-turban-brute.png | 敵人面板 | ready |
| enemy-bandit-leader | 山賊頭目 | enemy | /images/enemies/bandit-leader.png | 敵人面板 | ready |
| enemy-black-mountain-general | 黑山賊將 | enemy | /images/enemies/black-mountain-general.png | 敵人面板 | ready |
| enemy-xiliang-cavalry | 西涼騎兵 | enemy | /images/enemies/xiliang-cavalry.png | 敵人面板 | ready |
| enemy-zhang-liang | 張梁 | mini-boss | /images/enemies/zhang-liang.png | 第 7 關 mini-boss | ready |
| enemy-zhang-bao | 張寶 | mini-boss | /images/enemies/zhang-bao.png | 第 7 關 mini-boss | ready |
| enemy-lu-bu | 呂布 | boss | /images/enemies/lu-bu.png | Boss 敵人面板 | ready |
| stage-abandoned-village | 荒村初戰背景 | stage-background | /images/stages/abandoned-village.png | 第 1 關背景 | ready |
| stage-mountain-ambush | 山道伏兵 | stage-background | /images/stages/mountain-ambush.png | 第 2 關背景 | ready |
| stage-ruined-temple-night | 破廟夜戰 | stage-background | /images/stages/ruined-temple-night.png | 第 3 關背景 | ready |
| stage-black-mountain-camp | 黑山賊寨 | stage-background | /images/stages/black-mountain-camp.png | 第 4 關背景 | ready |
| stage-xiliang-charge | 西涼突騎 | stage-background | /images/stages/xiliang-charge.png | 第 5 關背景 | ready |
| stage-ancient-battlefield | 古戰場遺跡 | stage-background | /images/stages/ancient-battlefield.png | 第 6 關背景 | ready |
| stage-yellow-turban-altar | 黃巾祭壇 | stage-background | /images/stages/yellow-turban-altar.png | 第 7 關背景 | ready |
| stage-hulao-gate | 虎牢關前背景 | stage-background | /images/stages/hulao-gate.png | 第 8 關背景 | ready |
| route-mountain-path | 山道 | route | /images/routes/mountain-path.png | 路線選擇卡：山道 | ready |
| route-official-road | 官道 | route | /images/routes/official-road.png | 路線選擇卡：官道 | ready |
| route-dangerous-pass | 險道 | route | /images/routes/dangerous-pass.png | 路線選擇卡：險道 | ready |

## 4. 尚未完成圖片清單

P0 敵人圖片、P0 關卡背景與 P1 路線圖片已完成。剩餘缺口只保留 P2 路線事件圖片。

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

- P0：已完成，包含 5 張敵人 / mini-boss 立繪與 6 張關卡背景。
- P1：已完成，包含山道、官道、險道三條路線選擇圖。
- P2：補齊 9 個路線事件圖，用於後續事件展示強化。

`CHAPTER_1_IMAGE_GAP_MANIFEST` 目前共有 9 筆：P2 9 筆。

## 6. 建議比例

- 已完成路線圖片：9:16，路線選擇卡會以固定高度裁切呈現。
- 路線事件：9:16，適合手機直屏與未來事件卡展示。
- 已完成敵人與 mini-boss：3:4。
- 已完成關卡背景：以目前 UI 容器顯示為主，保留 fallback 防護。

## 7. 建議檔案路徑

- 路線事件：`public/images/events/{route-event-key}.png`

導入遊戲 UI 時，public path 需使用 `/images/...`；本文件的建議路徑使用 repo 內實際存放位置。

## 8. 中文提示詞

| id | promptZh |
| --- | --- |
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

- [x] P0 敵人 / mini-boss 立繪已導入。
- [x] P0 關卡背景已導入。
- [x] P1 路線圖片已導入。
- [ ] 生成 P2：9 張路線事件圖片。
- [ ] 確認所有圖都沒有文字、水印、Logo。
- [ ] 確認所有圖都沒有模仿現有影視 / 遊戲 / 動漫 IP。
- [ ] 確認所有圖都不使用受版權保護角色造型。
- [ ] 確認所有圖避免血腥暴力，適合教學展示。
- [ ] 檔名與建議路徑完全一致。
- [ ] 導入時確認 fallback 仍可在圖片缺失或載入失敗時正常顯示。
