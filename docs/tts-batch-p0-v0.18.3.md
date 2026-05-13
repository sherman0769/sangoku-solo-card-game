# 第一章 P0 TTS 批量生成清單 v0.18.3-pre

## 文件目的

本文件提供《三國單騎傳》第一章「黃巾亂起」P0 語音的批量生成清單，方便使用 TTS 工具逐一生成 MP3。資料來源為 `CHAPTER_1_TTS_GAP_MANIFEST` 中 priority 為 `P0` 且 status 仍為 `planned` 的項目。

本版不新增真實音檔，不把任何 planned 音檔改為 ready。對應 JSON manifest 位於 [`docs/tts-batch-p0-v0.18.3.json`](tts-batch-p0-v0.18.3.json)，程式端資料位於 `lib/game/ttsBatchP0Manifest.ts` 的 `CHAPTER_1_TTS_P0_BATCH_MANIFEST`。

## 生成總則

- 語言：繁體中文
- 語速：中慢速
- 情緒：三國史詩、沉穩、戲劇感，但不要過度吶喊
- 音量：每個檔案盡量一致
- 音檔格式：MP3
- 建議取樣：44.1kHz 或 48kHz
- 不要加入背景音樂
- 不要加入環境音
- 不要加入額外台詞
- 不要在音檔開頭或結尾留下太長空白
- 每個音檔只包含該 audioKey 對應的一句台詞

## P0 語音列表

| 編號 | audioKey | speakerName | speakerType | trigger | text | tone | suggestedVoice | suggestedSpeed | filePath | usage | status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | stage-1-intro | 旁白 | narrator | stage_intro | 荒村煙塵未散，黃巾餘黨仍在掠奪糧草。 | 敘事 | 旁白：成熟、穩定、史詩敘事 | 中慢速 | public/audio/narration/stage-1-intro.mp3 | 指定關卡開場旁白 | planned |
| 2 | stage-2-intro | 旁白 | narrator | stage_intro | 山道狹窄，伏兵隱於林間。 | 伏擊 | 旁白：成熟、穩定、史詩敘事 | 中慢速 | public/audio/narration/stage-2-intro.mp3 | 指定關卡開場旁白 | planned |
| 3 | stage-3-intro | 旁白 | narrator | stage_intro | 破廟燈火搖曳，敵影在夜色中逼近。 | 夜戰 | 旁白：成熟、穩定、史詩敘事 | 中慢速 | public/audio/narration/stage-3-intro.mp3 | 指定關卡開場旁白 | planned |
| 4 | stage-4-intro | 旁白 | narrator | stage_intro | 黑山賊寨盤踞山間，守備森嚴。 | 壓迫 | 旁白：成熟、穩定、史詩敘事 | 中慢速 | public/audio/narration/stage-4-intro.mp3 | 指定關卡開場旁白 | planned |
| 5 | stage-5-intro | 旁白 | narrator | stage_intro | 馬蹄聲急，西涼騎兵席捲而來。 | 急迫 | 旁白：成熟、穩定、史詩敘事 | 中慢速 | public/audio/narration/stage-5-intro.mp3 | 指定關卡開場旁白 | planned |
| 6 | stage-6-intro | 旁白 | narrator | stage_intro | 古戰場埋藏著舊日兵戈，也藏著未知危機。 | 荒涼 | 旁白：成熟、穩定、史詩敘事 | 中慢速 | public/audio/narration/stage-6-intro.mp3 | 指定關卡開場旁白 | planned |
| 7 | stage-7-intro | 旁白 | narrator | stage_intro | 祭壇妖風四起，黃巾殘部正進行詭異儀式。 | 詭譎 | 旁白：成熟、穩定、史詩敘事 | 中慢速 | public/audio/narration/stage-7-intro.mp3 | 指定關卡開場旁白 | planned |
| 8 | stage-8-intro | 旁白 | narrator | stage_intro | 虎牢關前，赤兔嘶鳴，真正的考驗終於降臨。 | 決戰 | 旁白：成熟、穩定、史詩敘事 | 中慢速 | public/audio/narration/stage-8-intro.mp3 | 指定關卡開場旁白 | planned |
| 9 | yellow-turban-soldier-intro | 黃巾兵 | enemy | enemy_intro | 蒼天已死，黃天當立！ | 狂熱 | 敵人：粗獷、緊張、戰場感 | 中慢速 | public/audio/voices/enemies/yellow-turban-soldier-intro.mp3 | 一般敵人登場時播放 | planned |
| 10 | yellow-turban-archer-intro | 黃巾弓手 | enemy | enemy_intro | 賊軍弓手已就位，箭雨將至！ | 警戒 | 敵人：粗獷、緊張、戰場感 | 中慢速 | public/audio/voices/enemies/yellow-turban-archer-intro.mp3 | 一般敵人登場時播放 | planned |
| 11 | yellow-turban-brute-intro | 黃巾力士 | enemy | enemy_intro | 黃巾力士踏地而來，巨力壓陣！ | 沉重 | 敵人：粗獷、緊張、戰場感 | 中慢速 | public/audio/voices/enemies/yellow-turban-brute-intro.mp3 | 一般敵人登場時播放 | planned |
| 12 | bandit-leader-intro | 山賊頭目 | enemy | enemy_intro | 此山是我開，想過此路，留下性命！ | 兇狠 | 敵人：粗獷、緊張、戰場感 | 中慢速 | public/audio/voices/enemies/bandit-leader-intro.mp3 | 一般敵人登場時播放 | planned |
| 13 | black-mountain-general-intro | 黑山賊將 | enemy | enemy_intro | 黑山賊將據寨而守，休想輕易通過！ | 沉穩 | 敵人：粗獷、緊張、戰場感 | 中慢速 | public/audio/voices/enemies/black-mountain-general-intro.mp3 | 一般敵人登場時播放 | planned |
| 14 | xiliang-cavalry-intro | 西涼騎兵 | enemy | enemy_intro | 西涼鐵騎至，誰敢擋路！ | 壓迫 | 敵人：粗獷、緊張、戰場感 | 中慢速 | public/audio/voices/enemies/xiliang-cavalry-intro.mp3 | 一般敵人登場時播放 | planned |
| 15 | zhang-liang-intro | 張梁 | enemy | enemy_intro | 人公將軍張梁在此，黃天之威不容爾等侵犯！ | 狂熱 | 敵人：粗獷、緊張、戰場感 | 中慢速 | public/audio/voices/enemies/zhang-liang-intro.mp3 | 一般敵人登場時播放 | planned |
| 16 | zhang-bao-intro | 張寶 | enemy | enemy_intro | 地公將軍張寶施法布陣，妖風已起。 | 詭譎 | 敵人：粗獷、緊張、戰場感 | 中慢速 | public/audio/voices/enemies/zhang-bao-intro.mp3 | 一般敵人登場時播放 | planned |
| 17 | lu-bu-unmatched-pressure | 呂布 | enemy | boss_trait | 天下群雄，誰能擋我？ | 壓迫 | 呂布：低沉、強勢、壓迫感 | 中慢速 | public/audio/voices/lu-bu/lu-bu-unmatched-pressure.mp3 | Boss 特性觸發時播放 | planned |
| 18 | lu-bu-warlord-recovery | 呂布 | enemy | boss_recovery | 這點傷，也想取我性命？ | 狂傲 | 呂布：低沉、強勢、壓迫感 | 中慢速 | public/audio/voices/lu-bu/lu-bu-warlord-recovery.mp3 | Boss 回血特性觸發時播放 | planned |
| 19 | game-win | 旁白 | narrator | game_win | 你突破虎牢關前的考驗，第一章：黃巾亂起，至此落幕。 | 勝利 | 旁白：成熟、穩定、史詩敘事 | 中慢速 | public/audio/narration/game-win.mp3 | 通關結果頁旁白 | planned |
| 20 | game-lose | 旁白 | narrator | game_lose | 亂世無情，英雄亦有敗時。重整旗鼓，再入戰場。 | 戰敗 | 旁白：成熟、穩定、史詩敘事 | 中慢速 | public/audio/narration/game-lose.mp3 | 戰敗結果頁旁白 | planned |

## 可複製給 TTS 工具的逐條清單

```text
[stage-1-intro]
檔名：stage-1-intro.mp3
聲音：旁白：成熟、穩定、史詩敘事
語氣：敘事
語速：中慢速
台詞：荒村煙塵未散，黃巾餘黨仍在掠奪糧草。
輸出路徑：public/audio/narration/stage-1-intro.mp3

[stage-2-intro]
檔名：stage-2-intro.mp3
聲音：旁白：成熟、穩定、史詩敘事
語氣：伏擊
語速：中慢速
台詞：山道狹窄，伏兵隱於林間。
輸出路徑：public/audio/narration/stage-2-intro.mp3

[stage-3-intro]
檔名：stage-3-intro.mp3
聲音：旁白：成熟、穩定、史詩敘事
語氣：夜戰
語速：中慢速
台詞：破廟燈火搖曳，敵影在夜色中逼近。
輸出路徑：public/audio/narration/stage-3-intro.mp3

[stage-4-intro]
檔名：stage-4-intro.mp3
聲音：旁白：成熟、穩定、史詩敘事
語氣：壓迫
語速：中慢速
台詞：黑山賊寨盤踞山間，守備森嚴。
輸出路徑：public/audio/narration/stage-4-intro.mp3

[stage-5-intro]
檔名：stage-5-intro.mp3
聲音：旁白：成熟、穩定、史詩敘事
語氣：急迫
語速：中慢速
台詞：馬蹄聲急，西涼騎兵席捲而來。
輸出路徑：public/audio/narration/stage-5-intro.mp3

[stage-6-intro]
檔名：stage-6-intro.mp3
聲音：旁白：成熟、穩定、史詩敘事
語氣：荒涼
語速：中慢速
台詞：古戰場埋藏著舊日兵戈，也藏著未知危機。
輸出路徑：public/audio/narration/stage-6-intro.mp3

[stage-7-intro]
檔名：stage-7-intro.mp3
聲音：旁白：成熟、穩定、史詩敘事
語氣：詭譎
語速：中慢速
台詞：祭壇妖風四起，黃巾殘部正進行詭異儀式。
輸出路徑：public/audio/narration/stage-7-intro.mp3

[stage-8-intro]
檔名：stage-8-intro.mp3
聲音：旁白：成熟、穩定、史詩敘事
語氣：決戰
語速：中慢速
台詞：虎牢關前，赤兔嘶鳴，真正的考驗終於降臨。
輸出路徑：public/audio/narration/stage-8-intro.mp3

[yellow-turban-soldier-intro]
檔名：yellow-turban-soldier-intro.mp3
聲音：敵人：粗獷、緊張、戰場感
語氣：狂熱
語速：中慢速
台詞：蒼天已死，黃天當立！
輸出路徑：public/audio/voices/enemies/yellow-turban-soldier-intro.mp3

[yellow-turban-archer-intro]
檔名：yellow-turban-archer-intro.mp3
聲音：敵人：粗獷、緊張、戰場感
語氣：警戒
語速：中慢速
台詞：賊軍弓手已就位，箭雨將至！
輸出路徑：public/audio/voices/enemies/yellow-turban-archer-intro.mp3

[yellow-turban-brute-intro]
檔名：yellow-turban-brute-intro.mp3
聲音：敵人：粗獷、緊張、戰場感
語氣：沉重
語速：中慢速
台詞：黃巾力士踏地而來，巨力壓陣！
輸出路徑：public/audio/voices/enemies/yellow-turban-brute-intro.mp3

[bandit-leader-intro]
檔名：bandit-leader-intro.mp3
聲音：敵人：粗獷、緊張、戰場感
語氣：兇狠
語速：中慢速
台詞：此山是我開，想過此路，留下性命！
輸出路徑：public/audio/voices/enemies/bandit-leader-intro.mp3

[black-mountain-general-intro]
檔名：black-mountain-general-intro.mp3
聲音：敵人：粗獷、緊張、戰場感
語氣：沉穩
語速：中慢速
台詞：黑山賊將據寨而守，休想輕易通過！
輸出路徑：public/audio/voices/enemies/black-mountain-general-intro.mp3

[xiliang-cavalry-intro]
檔名：xiliang-cavalry-intro.mp3
聲音：敵人：粗獷、緊張、戰場感
語氣：壓迫
語速：中慢速
台詞：西涼鐵騎至，誰敢擋路！
輸出路徑：public/audio/voices/enemies/xiliang-cavalry-intro.mp3

[zhang-liang-intro]
檔名：zhang-liang-intro.mp3
聲音：敵人：粗獷、緊張、戰場感
語氣：狂熱
語速：中慢速
台詞：人公將軍張梁在此，黃天之威不容爾等侵犯！
輸出路徑：public/audio/voices/enemies/zhang-liang-intro.mp3

[zhang-bao-intro]
檔名：zhang-bao-intro.mp3
聲音：敵人：粗獷、緊張、戰場感
語氣：詭譎
語速：中慢速
台詞：地公將軍張寶施法布陣，妖風已起。
輸出路徑：public/audio/voices/enemies/zhang-bao-intro.mp3

[lu-bu-unmatched-pressure]
檔名：lu-bu-unmatched-pressure.mp3
聲音：呂布：低沉、強勢、壓迫感
語氣：壓迫
語速：中慢速
台詞：天下群雄，誰能擋我？
輸出路徑：public/audio/voices/lu-bu/lu-bu-unmatched-pressure.mp3

[lu-bu-warlord-recovery]
檔名：lu-bu-warlord-recovery.mp3
聲音：呂布：低沉、強勢、壓迫感
語氣：狂傲
語速：中慢速
台詞：這點傷，也想取我性命？
輸出路徑：public/audio/voices/lu-bu/lu-bu-warlord-recovery.mp3

[game-win]
檔名：game-win.mp3
聲音：旁白：成熟、穩定、史詩敘事
語氣：勝利
語速：中慢速
台詞：你突破虎牢關前的考驗，第一章：黃巾亂起，至此落幕。
輸出路徑：public/audio/narration/game-win.mp3

[game-lose]
檔名：game-lose.mp3
聲音：旁白：成熟、穩定、史詩敘事
語氣：戰敗
語速：中慢速
台詞：亂世無情，英雄亦有敗時。重整旗鼓，再入戰場。
輸出路徑：public/audio/narration/game-lose.mp3
```

## 檔案命名規則

- 檔名固定使用 `audioKey.mp3`。
- 不加入版本號、流水號、角色名中文或 TTS 工具名稱。
- 若 TTS 工具輸出暫存檔，導入專案前需改回本文件指定檔名。

## 輸出路徑規則

- 關卡、通關與戰敗旁白輸出到 `public/audio/narration/`。
- 一般敵人登場語音輸出到 `public/audio/voices/enemies/`。
- 呂布 Boss 特性語音輸出到 `public/audio/voices/lu-bu/`。
- 放入檔案後，下一版再逐筆檢查實際存在的 MP3，確認無誤後才可把對應 status 改為 `ready`。

## 生成完成後的檢查表

- [ ] 20 筆 P0 語音皆已生成 MP3。
- [ ] 每個檔案只包含指定 audioKey 的一句台詞。
- [ ] 檔名與 `filePath` 完全一致。
- [ ] 音量彼此接近，無明顯爆音或過小音量。
- [ ] 開頭與結尾沒有過長空白。
- [ ] 沒有背景音樂、環境音或額外台詞。
- [ ] 已確認 `lu-bu-intro` 維持既有 ready，不重複生成在本批 P0 清單內。
- [ ] 導入 MP3 前後都不影響既有 ready 語音、音效、卡牌音效、開場動畫與 Boss 特性。
- [ ] 導入後再更新 `TTS_DIALOGUE_MANIFEST` status，且只把實際存在並通過檢查的音檔改為 `ready`。
