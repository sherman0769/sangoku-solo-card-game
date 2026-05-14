# 第一章圖片缺口清單 v0.19.2

## 1. 文件目的

本文件整理《三國單騎傳》第一章「黃巾亂起」圖片資產完成狀態。v0.19.2 已導入九張路線事件圖片，第一章圖片缺口歸零。

結構化資料位於 `lib/game/imageGapManifest.ts`：

- `CHAPTER_1_READY_IMAGE_MANIFEST`：已完成圖片。
- `CHAPTER_1_IMAGE_GAP_MANIFEST`：尚未完成圖片缺口，目前為 0 筆。

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
| route-mountain-spring | 山泉療傷 | route-event | /images/events/route-mountain-spring.png | 山道路線事件 | ready |
| route-hermit-guidance | 隱士指路 | route-event | /images/events/route-hermit-guidance.png | 山道路線事件 | ready |
| route-misty-path | 迷霧小徑 | route-event | /images/events/route-misty-path.png | 山道路線事件 | ready |
| route-post-station | 驛站補給 | route-event | /images/events/route-post-station.png | 官道路線事件 | ready |
| route-military-dispatch | 軍令急報 | route-event | /images/events/route-military-dispatch.png | 官道路線事件 | ready |
| route-remnant-troops | 官軍殘部 | route-event | /images/events/route-remnant-troops.png | 官道路線事件 | ready |
| route-cliff-ambush | 絕壁伏擊 | route-event | /images/events/route-cliff-ambush.png | 險道路線事件 | ready |
| route-battlefield-relic | 古戰場遺物 | route-event | /images/events/route-battlefield-relic.png | 險道路線事件 | ready |
| route-night-raid | 夜襲敵營 | route-event | /images/events/route-night-raid.png | 險道路線事件 | ready |

## 4. 尚未完成圖片清單

第一章圖片缺口目前為 0 筆。武將、敵人、8 關背景、三條路線與九個路線事件皆已有正式圖像。

## 5. 生成優先級

- P0：已完成，包含敵人 / mini-boss 立繪與關卡背景。
- P1：已完成，包含山道、官道、險道三條路線選擇圖。
- P2：已完成，包含 9 個路線事件圖。

`CHAPTER_1_IMAGE_GAP_MANIFEST` 目前共有 0 筆。

## 6. 建議比例

- 武將、敵人與 mini-boss：3:4。
- 關卡背景：16:9。
- 路線圖片與路線事件：9:16，UI 會以固定高度裁切呈現並保留 fallback。

## 7. 建議檔案路徑

- 首頁主視覺：`public/images/covers/home-hero.png`
- 武將：`public/images/heroes/{hero-key}.png`
- 敵人：`public/images/enemies/{enemy-key}.png`
- 關卡背景：`public/images/stages/{stage-key}.png`
- 路線：`public/images/routes/{route-key}.png`
- 路線事件：`public/images/events/{route-event-key}.png`

導入遊戲 UI 時，public path 使用 `/images/...`。

## 8. 中文提示詞

第一章圖片資產已補齊，本節保留作為後續重生成或風格統一時的提示詞參考。新增或重生成圖片時，請沿用第 2 節的統一美術風格與 negativePrompt。

## 9. 英文提示詞

All Chapter 1 image assets are now complete. Keep the unified art direction in section 2 for future regeneration or style matching.

## 10. 批量生成檢查表

- [x] P0 敵人 / mini-boss 立繪已導入。
- [x] P0 關卡背景已導入。
- [x] P1 路線圖片已導入。
- [x] P2 路線事件圖片已導入。
- [x] 第一章圖片缺口歸零。
- [x] 武將、敵人、8 關背景、三條路線與九個路線事件皆有正式圖像。
- [x] 導入時確認 fallback 仍可在圖片缺失或載入失敗時正常顯示。
