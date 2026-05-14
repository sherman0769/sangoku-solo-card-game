# 《三國單騎傳》v0.24.1 卡牌圖片導入紀錄

## 1. 文件目的

本文件整理 12 張核心卡牌正式插圖的導入狀態，保留原始 AI 圖像提示詞作為生成紀錄。v0.24.1 已完成基礎卡、戰術卡與裝備卡圖片導入，戰鬥中的 CardView 會顯示正式插圖，圖片載入失敗時仍 fallback 到卡牌插圖 placeholder。

結構化資料來源：`lib/game/cardImageGapManifest.ts`

目前卡牌圖片缺口數量為 `0`；12 張卡牌圖片皆為 `status: ready`。

## 2. 統一美術風格

「東方史詩卡牌風 × 三國亂世 × 高辨識度小卡插圖」

生成要求：

- 適合手機小尺寸顯示。
- 每張卡要有清楚主體。
- 不要文字。
- 不要 UI 邊框。
- 不要 Logo。
- 盡量避免人物臉部過小。
- 攻擊卡偏紅金。
- 防禦卡偏藍鐵。
- 回復卡偏綠金。
- 策略卡偏紫金 / 藍金。
- 裝備卡偏黑金。
- 火攻偏紅橘火光。

通用 negative prompt：

```text
文字、Logo、水印、UI 邊框、現代武器、科幻裝備、血腥畫面、畸形手指、重複物件、低清晰度
```

## 3. 卡牌圖片導入總覽

| 類別 | 數量 | 優先級 |
|---|---:|---|
| 基礎卡 | 5 | P0 |
| 戰術卡 | 4 | P1 |
| 裝備卡 | 3 | P1 |
| 合計 | 12 | - |

剩餘缺口：0。

## 4. 已完成清單

| cardId | cardName | cardType | usage | recommendedAspectRatio | suggestedPath | priority | status |
|---|---|---|---|---|---|---|---|
| slash | 斬 | 基礎卡 | 手牌、戰鬥出牌、卡牌說明 | 4:3 | public/images/cards/slash.png | P0 | ready |
| dodge | 閃 | 基礎卡 | 手牌、敵人攻擊回應、卡牌說明 | 4:3 | public/images/cards/dodge.png | P0 | ready |
| wine | 酒 | 基礎卡 | 手牌、回復 / 強化攻擊、卡牌說明 | 4:3 | public/images/cards/wine.png | P0 | ready |
| strategy-scroll | 兵書 | 基礎卡 | 手牌、抽牌策略、卡牌說明 | 4:3 | public/images/cards/strategy-scroll.png | P0 | ready |
| armor-break | 破甲 | 基礎卡 | 手牌、破防攻擊、卡牌說明 | 4:3 | public/images/cards/armor-break.png | P0 | ready |
| combo-slash | 連斬 | 戰術卡 | 手牌、追擊攻擊、卡牌說明 | 4:3 | public/images/cards/combo-slash.png | P1 | ready |
| guard | 固守 | 戰術卡 | 手牌、防守減傷、卡牌說明 | 4:3 | public/images/cards/guard.png | P1 | ready |
| inspire | 激勵 | 戰術卡 | 手牌、回復與補牌、卡牌說明 | 4:3 | public/images/cards/inspire.png | P1 | ready |
| fire-attack | 火攻 | 戰術卡 | 手牌、火攻打斷蓄力、卡牌說明 | 4:3 | public/images/cards/fire-attack.png | P1 | ready |
| green-dragon-blade | 青龍偃月刀 | 裝備卡 | 手牌、裝備展示、玩家 HUD 摘要 | 4:3 | public/images/cards/green-dragon-blade.png | P1 | ready |
| dilu-horse | 的盧馬 | 裝備卡 | 手牌、裝備展示、玩家 HUD 摘要 | 4:3 | public/images/cards/dilu-horse.png | P1 | ready |
| taiping-manual | 太平要術 | 裝備卡 | 手牌、裝備展示、玩家 HUD 摘要 | 4:3 | public/images/cards/taiping-manual.png | P1 | ready |

## 5. 中文與英文提示詞

### 斬

- promptZh：三國亂世卡牌插圖，赤金刀光破空斬向敵陣，煙塵戰場背景，主體清楚，東方史詩卡牌風，半寫實，適合手機小卡顯示，無文字。
- promptEn：Three Kingdoms card illustration, red and gold blade light slashing through a battlefield, smoky war background, clear central subject, eastern epic card style, semi-realistic, readable on small mobile cards, no text.

### 閃

- promptZh：三國武者側身閃避箭矢與刀光，藍鐵色速度殘影，防禦卡牌意象，主體明確，東方史詩卡牌風，半寫實，無文字。
- promptEn：A Three Kingdoms warrior evading arrows and blade light, blue steel motion trails, defensive card imagery, clear central subject, eastern epic card style, semi-realistic, no text.

### 酒

- promptZh：古代戰場中的酒壺與碗，綠金暖光象徵恢復與士氣，背景有模糊戰旗，主體清楚，三國卡牌插圖，半寫實，無文字。
- promptEn：An ancient wine jar and cup on a battlefield, green and gold warm light symbolizing recovery and morale, blurred banners in the background, clear subject, Three Kingdoms card illustration, semi-realistic, no text.

### 兵書

- promptZh：竹簡兵書攤開，紫金與藍金策略光紋浮現，燭光軍帳背景，主體清楚，東方史詩卡牌風，半寫實，無文字。
- promptEn：Open bamboo strategy scrolls with purple-gold and blue-gold tactical light patterns, candlelit war tent background, clear subject, eastern epic card style, semi-realistic, no text.

### 破甲

- promptZh：鋒刃擊碎古代甲片，紅金衝擊火花與破防氣勢，主體清楚，高辨識度小卡插圖，東方史詩卡牌風，半寫實，無文字。
- promptEn：A sharp blade shattering ancient armor plates, red-gold impact sparks and armor-breaking force, clear subject, high-readability small card illustration, eastern epic card style, semi-realistic, no text.

### 連斬

- promptZh：連續三道赤金刀光追擊敵陣，速度線與戰場煙塵，攻擊節奏強烈，主體清楚，三國戰術卡牌插圖，半寫實，無文字。
- promptEn：Three consecutive red-gold blade arcs pursuing enemies through battlefield dust, strong attack rhythm and speed lines, clear subject, Three Kingdoms tactic card illustration, semi-realistic, no text.

### 固守

- promptZh：古代盾陣固守，藍鐵色防護光幕與沉穩陣勢，主體清楚，防禦戰術卡牌插圖，東方史詩風，半寫實，無文字。
- promptEn：Ancient shield formation holding the line, blue steel protective aura and steady formation, clear subject, defensive tactic card illustration, eastern epic style, semi-realistic, no text.

### 激勵

- promptZh：戰旗高舉，綠金光芒鼓舞士氣，遠方士兵剪影振奮，主體清楚，三國戰術卡牌插圖，半寫實，無文字。
- promptEn：A raised war banner with green-gold morale light, distant soldier silhouettes inspired, clear subject, Three Kingdoms tactic card illustration, semi-realistic, no text.

### 火攻

- promptZh：紅橘火光席捲敵陣，火焰照亮戰場旗影，主體清楚，火攻戰術卡牌插圖，東方史詩卡牌風，半寫實，無文字。
- promptEn：Red-orange flames sweeping through an enemy formation, firelight illuminating battlefield banners, clear subject, fire tactic card illustration, eastern epic card style, semi-realistic, no text.

### 青龍偃月刀

- promptZh：青龍偃月刀斜插於黑金戰場石地，青金龍影盤旋，裝備卡牌主體清楚，東方史詩卡牌風，半寫實，無文字。
- promptEn：Green Dragon Crescent Blade planted in dark gold battlefield stones, teal-gold dragon aura curling around it, clear equipment card subject, eastern epic card style, semi-realistic, no text.

### 的盧馬

- promptZh：白色的盧馬踏煙奔馳，黑金戰場背景與藍鐵守護光，主體清楚，裝備卡牌插圖，東方史詩風，半寫實，無文字。
- promptEn：A white Dilu horse galloping through smoke, dark gold battlefield background with blue steel protective light, clear subject, equipment card illustration, eastern epic style, semi-realistic, no text.

### 太平要術

- promptZh：古老道術卷軸懸浮，黑金底色與紫金符籙光芒，主體清楚，策略裝備卡牌插圖，東方史詩風，半寫實，無文字。
- promptEn：An ancient Taoist manual floating, dark gold background with purple-gold talisman light, clear subject, strategy equipment card illustration, eastern epic style, semi-realistic, no text.

## 6. 導入檢查表

- [x] 依照本文件生成 12 張卡牌圖片。
- [x] 檔案放入 `public/images/cards/`。
- [x] 新增 `CARD_IMAGE_READY_MANIFEST` 並更新 `VISUAL_ASSET_MANIFEST`。
- [x] 確認 CardView 可以顯示正式卡牌插圖。
- [x] 若圖片載入失敗，仍保留 fallback。
- [x] 手機版以 4:3 卡牌圖片比例控制高度。
- [x] 新增測試確認 12 張卡牌圖片為 ready，且缺口歸零。
