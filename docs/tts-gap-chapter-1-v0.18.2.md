# 第一章 TTS 缺口清單 v0.18.2

## 1. 文件目的

本文件整理《三國單騎傳》第一章「黃巾亂起」目前尚未導入真實音檔、但值得補齊的 TTS 台詞。v0.18.2 先建立缺口文件與結構化清單；v0.18.3 已導入 P0 批次 MP3；v0.20.1 已導入 9 筆敵人擊敗旁白，剩餘缺口以路線事件與武將戰鬥補充台詞為主。

結構化資料位於 `lib/game/ttsGapManifest.ts` 的 `CHAPTER_1_TTS_GAP_MANIFEST`。後續可依照本文件與 batch 文件繼續生成剩餘 P1 / P2 MP3，放入建議路徑後，再逐筆將 status 改為 `ready`。

## 2. 已完成語音清單

| audioKey | speakerName | text | filePath | status |
|---|---|---|---|---|
| chapter-1-intro | 旁白 | 第一章：黃巾亂起。亂世初開，烽煙四起，一名英雄踏上了通往虎牢關的道路。 | /audio/narration/chapter-1-intro.mp3 | ready |
| guan-yu-preview | 關羽 | 吾乃關雲長，願以此刀，斬開亂世。 | /audio/voices/guan-yu/guan-yu-preview.mp3 | ready |
| zhao-yun-preview | 趙雲 | 常山趙子龍，聽候差遣。 | /audio/voices/zhao-yun/zhao-yun-preview.mp3 | ready |
| zhuge-liang-preview | 諸葛亮 | 既入此局，便當謀定而後動。 | /audio/voices/zhuge-liang/zhuge-liang-preview.mp3 | ready |
| guan-yu-intro | 關羽 | 關某在此，何人敢擋？ | /audio/voices/guan-yu/guan-yu-intro.mp3 | ready |
| zhao-yun-intro | 趙雲 | 常山趙子龍，願護此路周全。 | /audio/voices/zhao-yun/zhao-yun-intro.mp3 | ready |
| zhuge-liang-intro | 諸葛亮 | 觀天時，察地利，方能制勝。 | /audio/voices/zhuge-liang/zhuge-liang-intro.mp3 | ready |
| lu-bu-intro | 呂布 | 吾乃呂布，誰敢與我一戰？ | /audio/voices/lu-bu/lu-bu-intro.mp3 | ready |
| yellow-turban-soldier-defeated | 旁白 | 黃巾餘眾潰散，荒村暫得片刻安寧。 | /audio/voices/enemies/yellow-turban-soldier-defeated.mp3 | ready |
| yellow-turban-archer-defeated | 旁白 | 箭雨止息，山道重新露出前路。 | /audio/voices/enemies/yellow-turban-archer-defeated.mp3 | ready |
| yellow-turban-brute-defeated | 旁白 | 力士轟然倒地，黃巾軍勢為之一挫。 | /audio/voices/enemies/yellow-turban-brute-defeated.mp3 | ready |
| bandit-leader-defeated | 旁白 | 山賊首領敗退，黑山之路終於打開。 | /audio/voices/enemies/bandit-leader-defeated.mp3 | ready |
| black-mountain-general-defeated | 旁白 | 黑山賊將敗下陣來，寨中士氣潰散。 | /audio/voices/enemies/black-mountain-general-defeated.mp3 | ready |
| xiliang-cavalry-defeated | 旁白 | 鐵騎衝勢已斷，塵煙中只餘殘旗。 | /audio/voices/enemies/xiliang-cavalry-defeated.mp3 | ready |
| zhang-liang-defeated | 旁白 | 張梁怒吼未息，黃巾祭壇的火光卻已黯淡。 | /audio/voices/enemies/zhang-liang-defeated.mp3 | ready |
| zhang-bao-defeated | 旁白 | 妖風散去，張寶的術法終究難逆天命。 | /audio/voices/enemies/zhang-bao-defeated.mp3 | ready |
| lu-bu-defeated | 旁白 | 虎牢關前，戰神退去，第一章至此落幕。 | /audio/voices/enemies/lu-bu-defeated.mp3 | ready |

## 3. 尚未完成語音清單

### P0：八關開場旁白（v0.18.3 已導入）

| audioKey | speakerName | text | 建議路徑 | status |
|---|---|---|---|---|
| stage-1-intro | 旁白 | 荒村煙塵未散，黃巾餘黨仍在掠奪糧草。 | /audio/narration/stage-1-intro.mp3 | ready |
| stage-2-intro | 旁白 | 山道狹窄，伏兵隱於林間。 | /audio/narration/stage-2-intro.mp3 | ready |
| stage-3-intro | 旁白 | 破廟燈火搖曳，敵影在夜色中逼近。 | /audio/narration/stage-3-intro.mp3 | ready |
| stage-4-intro | 旁白 | 黑山賊寨盤踞山間，守備森嚴。 | /audio/narration/stage-4-intro.mp3 | ready |
| stage-5-intro | 旁白 | 馬蹄聲急，西涼騎兵席捲而來。 | /audio/narration/stage-5-intro.mp3 | ready |
| stage-6-intro | 旁白 | 古戰場埋藏著舊日兵戈，也藏著未知危機。 | /audio/narration/stage-6-intro.mp3 | ready |
| stage-7-intro | 旁白 | 祭壇妖風四起，黃巾殘部正進行詭異儀式。 | /audio/narration/stage-7-intro.mp3 | ready |
| stage-8-intro | 旁白 | 虎牢關前，赤兔嘶鳴，真正的考驗終於降臨。 | /audio/narration/stage-8-intro.mp3 | ready |

### P0：敵人登場語音（v0.18.3 已導入；呂布登場原本已 ready）

| audioKey | speakerName | text | 建議路徑 | status |
|---|---|---|---|---|
| yellow-turban-soldier-intro | 黃巾兵 | 蒼天已死，黃天當立！ | /audio/voices/enemies/yellow-turban-soldier-intro.mp3 | ready |
| yellow-turban-archer-intro | 黃巾弓手 | 賊軍弓手已就位，箭雨將至！ | /audio/voices/enemies/yellow-turban-archer-intro.mp3 | ready |
| yellow-turban-brute-intro | 黃巾力士 | 黃巾力士踏地而來，巨力壓陣！ | /audio/voices/enemies/yellow-turban-brute-intro.mp3 | ready |
| bandit-leader-intro | 山賊頭目 | 此山是我開，想過此路，留下性命！ | /audio/voices/enemies/bandit-leader-intro.mp3 | ready |
| black-mountain-general-intro | 黑山賊將 | 黑山賊將據寨而守，休想輕易通過！ | /audio/voices/enemies/black-mountain-general-intro.mp3 | ready |
| xiliang-cavalry-intro | 西涼騎兵 | 西涼鐵騎至，誰敢擋路！ | /audio/voices/enemies/xiliang-cavalry-intro.mp3 | ready |
| zhang-liang-intro | 張梁 | 人公將軍張梁在此，黃天之威不容爾等侵犯！ | /audio/voices/enemies/zhang-liang-intro.mp3 | ready |
| zhang-bao-intro | 張寶 | 地公將軍張寶施法布陣，妖風已起。 | /audio/voices/enemies/zhang-bao-intro.mp3 | ready |
| lu-bu-intro | 呂布 | 吾乃呂布，誰敢與我一戰？ | /audio/voices/lu-bu/lu-bu-intro.mp3 | ready |

`lu-bu-intro` 已完成，不列入 `CHAPTER_1_TTS_GAP_MANIFEST`。

### P0：Boss 特性與結果旁白（v0.18.3 已導入）

| audioKey | speakerName | text | 建議路徑 | status |
|---|---|---|---|---|
| lu-bu-unmatched-pressure | 呂布 | 天下群雄，誰能擋我？ | /audio/voices/lu-bu/lu-bu-unmatched-pressure.mp3 | ready |
| lu-bu-warlord-recovery | 呂布 | 這點傷，也想取我性命？ | /audio/voices/lu-bu/lu-bu-warlord-recovery.mp3 | ready |
| game-win | 旁白 | 你突破虎牢關前的考驗，第一章：黃巾亂起，至此落幕。 | /audio/narration/game-win.mp3 | ready |
| game-lose | 旁白 | 亂世無情，英雄亦有敗時。重整旗鼓，再入戰場。 | /audio/narration/game-lose.mp3 | ready |

### P1：敵人被擊敗旁白（v0.20.1 已導入）

| audioKey | speakerName | text | 建議路徑 | status |
|---|---|---|---|---|
| yellow-turban-soldier-defeated | 旁白 | 黃巾餘眾潰散，荒村暫得片刻安寧。 | /audio/voices/enemies/yellow-turban-soldier-defeated.mp3 | ready |
| yellow-turban-archer-defeated | 旁白 | 箭雨止息，山道重新露出前路。 | /audio/voices/enemies/yellow-turban-archer-defeated.mp3 | ready |
| yellow-turban-brute-defeated | 旁白 | 力士轟然倒地，黃巾軍勢為之一挫。 | /audio/voices/enemies/yellow-turban-brute-defeated.mp3 | ready |
| bandit-leader-defeated | 旁白 | 山賊首領敗退，黑山之路終於打開。 | /audio/voices/enemies/bandit-leader-defeated.mp3 | ready |
| black-mountain-general-defeated | 旁白 | 黑山賊將敗下陣來，寨中士氣潰散。 | /audio/voices/enemies/black-mountain-general-defeated.mp3 | ready |
| xiliang-cavalry-defeated | 旁白 | 鐵騎衝勢已斷，塵煙中只餘殘旗。 | /audio/voices/enemies/xiliang-cavalry-defeated.mp3 | ready |
| zhang-liang-defeated | 旁白 | 張梁怒吼未息，黃巾祭壇的火光卻已黯淡。 | /audio/voices/enemies/zhang-liang-defeated.mp3 | ready |
| zhang-bao-defeated | 旁白 | 妖風散去，張寶的術法終究難逆天命。 | /audio/voices/enemies/zhang-bao-defeated.mp3 | ready |
| lu-bu-defeated | 旁白 | 虎牢關前，戰神退去，第一章至此落幕。 | /audio/voices/enemies/lu-bu-defeated.mp3 | ready |

### P1：路線事件旁白

| audioKey | speakerName | text | 建議路徑 | status |
|---|---|---|---|---|
| route-mountain-spring | 旁白 | 山風微涼，清泉洗去一路塵煙。 | public/audio/narration/route-mountain-spring.mp3 | planned |
| route-hermit-guidance | 旁白 | 隱士一語，勝過千軍探報。 | public/audio/narration/route-hermit-guidance.mp3 | planned |
| route-misty-path | 旁白 | 你避開了強敵，也失去了一部分準備時間。 | public/audio/narration/route-misty-path.mp3 | planned |
| route-post-station | 旁白 | 官道雖險，仍有殘存秩序可依。 | public/audio/narration/route-post-station.mp3 | planned |
| route-military-dispatch | 旁白 | 知敵先機，勝過一時勇武。 | public/audio/narration/route-military-dispatch.mp3 | planned |
| route-remnant-troops | 旁白 | 亂世之中，殘兵亦可成勢。 | public/audio/narration/route-remnant-troops.mp3 | planned |
| route-cliff-ambush | 旁白 | 險路藏殺機，也藏著更大的機會。 | public/audio/narration/route-cliff-ambush.mp3 | planned |
| route-battlefield-relic | 旁白 | 昔日名將遺物，仍在亂世中閃著寒光。 | public/audio/narration/route-battlefield-relic.mp3 | planned |
| route-night-raid | 旁白 | 勝負只在一念之間。 | public/audio/narration/route-night-raid.mp3 | planned |

### P2：武將戰鬥補充台詞

| audioKey | speakerName | text | 建議路徑 | status |
|---|---|---|---|---|
| guan-yu-battle-start | 關羽 | 賊寇當前，且看關某一刀破陣。 | public/audio/voices/guan-yu/guan-yu-battle-start.mp3 | planned |
| guan-yu-slash | 關羽 | 看刀！ | public/audio/voices/guan-yu/guan-yu-slash.mp3 | planned |
| guan-yu-damage | 關羽 | 此傷不足懼。 | public/audio/voices/guan-yu/guan-yu-damage.mp3 | planned |
| guan-yu-low-hp | 關羽 | 此身尚在，義不容退。 | public/audio/voices/guan-yu/guan-yu-low-hp.mp3 | planned |
| guan-yu-victory | 關羽 | 賊寇已破，前路仍遠。 | public/audio/voices/guan-yu/guan-yu-victory.mp3 | planned |
| zhao-yun-battle-start | 趙雲 | 敵勢雖眾，吾自往來破之。 | public/audio/voices/zhao-yun/zhao-yun-battle-start.mp3 | planned |
| zhao-yun-slash | 趙雲 | 銀槍所向，破！ | public/audio/voices/zhao-yun/zhao-yun-slash.mp3 | planned |
| zhao-yun-dodge | 趙雲 | 進退之間，皆有生路。 | public/audio/voices/zhao-yun/zhao-yun-dodge.mp3 | planned |
| zhao-yun-damage | 趙雲 | 無妨，尚能再戰。 | public/audio/voices/zhao-yun/zhao-yun-damage.mp3 | planned |
| zhao-yun-victory | 趙雲 | 此戰已定，繼續前行。 | public/audio/voices/zhao-yun/zhao-yun-victory.mp3 | planned |
| zhuge-liang-battle-start | 諸葛亮 | 此局未動，勝機已藏。 | public/audio/voices/zhuge-liang/zhuge-liang-battle-start.mp3 | planned |
| zhuge-liang-strategy | 諸葛亮 | 星象已明，勝機在此。 | public/audio/voices/zhuge-liang/zhuge-liang-strategy.mp3 | planned |
| zhuge-liang-damage | 諸葛亮 | 兵行險著，仍在算中。 | public/audio/voices/zhuge-liang/zhuge-liang-damage.mp3 | planned |
| zhuge-liang-low-hp | 諸葛亮 | 局勢危急，須另尋轉機。 | public/audio/voices/zhuge-liang/zhuge-liang-low-hp.mp3 | planned |
| zhuge-liang-victory | 諸葛亮 | 此局，尚在掌中。 | public/audio/voices/zhuge-liang/zhuge-liang-victory.mp3 | planned |

## 4. 生成優先級

- P0：v0.18.3 已導入八關開場旁白、敵人登場、呂布 Boss 特性、通關與戰敗旁白；不再列入 `CHAPTER_1_TTS_GAP_MANIFEST` 缺口。
- P1：v0.20.1 已導入敵人被擊敗旁白；剩餘需補齊路線事件旁白，強化路線選擇的敘事回饋。
- P2：補齊武將戰鬥補充台詞，提升出牌、受傷、低血量與勝利時的角色感。

v0.20.1 後，`CHAPTER_1_TTS_GAP_MANIFEST` 目前共有 24 筆：P1 9 筆、P2 15 筆。P0 20 筆與敵人擊敗旁白 9 筆已導入並改為 `ready`。

## 5. 建議聲線

- 旁白：成熟、穩定、史詩敘事；適合八關開場、敵人擊敗、路線事件與勝敗結果。
- 關羽：低沉、厚實、威嚴；適合攻擊、受傷與勝利台詞。
- 趙雲：年輕、清亮、堅定；適合攻防切換、閃避與勝利台詞。
- 諸葛亮：沉著、智慧、溫和；適合觀星、策略與冷靜判斷。
- 呂布：低沉、強勢、壓迫感；適合 Boss 特性與戰場威壓。
- 一般敵人：粗獷、緊張、戰場感；黃巾敵人偏狂熱，山賊偏兇狠，西涼騎兵偏壓迫。

## 6. 建議檔案路徑

- 旁白與事件：`public/audio/narration/{audioKey}.mp3`
- 關羽：`public/audio/voices/guan-yu/{audioKey}.mp3`
- 趙雲：`public/audio/voices/zhao-yun/{audioKey}.mp3`
- 諸葛亮：`public/audio/voices/zhuge-liang/{audioKey}.mp3`
- 呂布：`public/audio/voices/lu-bu/{audioKey}.mp3`
- 一般敵人：`public/audio/voices/enemies/{audioKey}.mp3`

若檔案導入後要讓瀏覽器播放，TTS manifest 中 ready 項目的 public path 需使用 `/audio/...`。

## 7. 批量生成檢查表

- [x] 已從 `CHAPTER_1_TTS_GAP_MANIFEST` 匯出 P0 清單並於 v0.18.3 導入。
- [ ] 依 speakerName 與 suggestedVoice 分批生成 MP3。
- [ ] 確認檔名完全等於 `audioKey.mp3`。
- [x] 已將 P1 敵人擊敗旁白放入 `public/audio/voices/enemies`，並於 v0.20.1 導入。
- [ ] 繼續將 P1 路線事件旁白放入 `public/audio/narration`。
- [ ] 將武將語音放入各自的 `public/audio/voices/{hero}` 資料夾。
- [x] 已將 P0 一般敵人登場語音放入 `public/audio/voices/enemies`。
- [x] 已將 P0 呂布 Boss 特性語音放入 `public/audio/voices/lu-bu`。
- [ ] P1 路線事件與 P2 武將補充語音實際檔案存在後，才把對應 audioKey 加入 ready 清單。
- [ ] 執行 `npm run lint`、`npm test`、`npm run build`。
- [ ] 到首頁與遊戲流程抽查語音開關不會影響音效、卡牌音效、開場動畫與 Boss 特性。
