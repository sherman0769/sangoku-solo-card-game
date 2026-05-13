# TTS 配音素材清單 v1

## 文件目的

本文件用於將《三國單騎傳》目前的人物台詞、旁白與結果頁文案整理成可交給 TTS 工具使用的生成素材。此版本只做配音規劃與路徑整理，不加入真實音檔、不播放語音，也不串接外部 TTS API。

## 聲音風格總則

- 整體風格：三國史詩、沉穩、戲劇感，但不誇張。
- 適合遊戲教學展示。
- 發音清楚，語速中等。
- 避免過度吶喊，避免刺耳。
- 可用於未來角色語音與開頭動畫旁白。
- 優先使用繁體中文語音。

## 角色聲線設定

### 關羽

- 聲線：低沉、厚實、威嚴。
- 語氣：忠義、穩重、武將壓迫感。
- 語速：中慢速。
- 適合用途：攻擊、登場、勝利。

### 趙雲

- 聲線：年輕、清亮、堅定。
- 語氣：英勇、靈活、正氣。
- 語速：中速。
- 適合用途：攻防切換、閃避、勝利。

### 諸葛亮

- 聲線：沉著、智慧、溫和。
- 語氣：冷靜、謀略、掌控局勢。
- 語速：中慢速。
- 適合用途：觀星、策略、旁白式台詞。

### 呂布

- 聲線：低沉、強勢、壓迫感。
- 語氣：霸氣、狂傲、戰場威壓。
- 語速：中慢速。
- 適合用途：Boss 登場。

### 旁白

- 聲線：成熟、穩定、史詩敘事。
- 語氣：沉穩、電影預告感。
- 語速：中慢速。
- 適合用途：章節開場、關卡開場、通關、戰敗。

## 第一批 TTS 素材表

| audioKey | speakerName | speakerType | trigger | text | tone | suggestedVoice | suggestedSpeed | suggestedFilePath | usage |
|---|---|---|---|---|---|---|---|---|---|
| guan-yu-intro | 關羽 | hero | hero_intro | 關某在此，何人敢擋？ | 威嚴 | 關羽：低沉、厚實、威嚴 | 中慢速 | public/audio/voices/guan-yu/guan-yu-intro.mp3 | 選擇武將並建立遊戲時播放 |
| guan-yu-battle-start | 關羽 | hero | battle_start | 賊寇當前，且看關某一刀破陣。 | 昂揚 | 關羽：低沉、厚實、威嚴 | 中慢速 | public/audio/voices/guan-yu/guan-yu-battle-start.mp3 | 每場戰鬥開始時播放 |
| guan-yu-slash | 關羽 | hero | use_slash | 看刀！ | 攻擊 | 關羽：低沉、厚實、威嚴 | 中慢速 | public/audio/voices/guan-yu/guan-yu-slash.mp3 | 使用斬或攻擊行為時播放 |
| guan-yu-damage | 關羽 | hero | take_damage | 此傷不足懼。 | 堅毅 | 關羽：低沉、厚實、威嚴 | 中慢速 | public/audio/voices/guan-yu/guan-yu-damage.mp3 | 玩家受到傷害時播放 |
| guan-yu-low-hp | 關羽 | hero | low_hp | 此身尚在，義不容退。 | 不屈 | 關羽：低沉、厚實、威嚴 | 中慢速 | public/audio/voices/guan-yu/guan-yu-low-hp.mp3 | 每場戰鬥首次低血量時播放 |
| guan-yu-victory | 關羽 | hero | victory | 賊寇已破，前路仍遠。 | 沉穩 | 關羽：低沉、厚實、威嚴 | 中慢速 | public/audio/voices/guan-yu/guan-yu-victory.mp3 | 擊敗敵人後播放 |
| zhao-yun-intro | 趙雲 | hero | hero_intro | 常山趙子龍，願護此路周全。 | 從容 | 趙雲：年輕、清亮、堅定 | 中速 | public/audio/voices/zhao-yun/zhao-yun-intro.mp3 | 選擇武將並建立遊戲時播放 |
| zhao-yun-battle-start | 趙雲 | hero | battle_start | 敵勢雖眾，吾自往來破之。 | 果決 | 趙雲：年輕、清亮、堅定 | 中速 | public/audio/voices/zhao-yun/zhao-yun-battle-start.mp3 | 每場戰鬥開始時播放 |
| zhao-yun-slash | 趙雲 | hero | use_slash | 銀槍所向，破！ | 攻擊 | 趙雲：年輕、清亮、堅定 | 中速 | public/audio/voices/zhao-yun/zhao-yun-slash.mp3 | 使用斬或攻擊行為時播放 |
| zhao-yun-dodge | 趙雲 | hero | use_dodge | 進退之間，皆有生路。 | 靈動 | 趙雲：年輕、清亮、堅定 | 中速 | public/audio/voices/zhao-yun/zhao-yun-dodge.mp3 | 使用閃或龍膽防禦時播放 |
| zhao-yun-damage | 趙雲 | hero | take_damage | 無妨，尚能再戰。 | 堅定 | 趙雲：年輕、清亮、堅定 | 中速 | public/audio/voices/zhao-yun/zhao-yun-damage.mp3 | 玩家受到傷害時播放 |
| zhao-yun-victory | 趙雲 | hero | victory | 此戰已定，繼續前行。 | 從容 | 趙雲：年輕、清亮、堅定 | 中速 | public/audio/voices/zhao-yun/zhao-yun-victory.mp3 | 擊敗敵人後播放 |
| zhuge-liang-intro | 諸葛亮 | hero | hero_intro | 觀天時，察地利，方能制勝。 | 睿智 | 諸葛亮：沉著、智慧、溫和 | 中慢速 | public/audio/voices/zhuge-liang/zhuge-liang-intro.mp3 | 選擇武將並建立遊戲時播放 |
| zhuge-liang-battle-start | 諸葛亮 | hero | battle_start | 此局未動，勝機已藏。 | 沉著 | 諸葛亮：沉著、智慧、溫和 | 中慢速 | public/audio/voices/zhuge-liang/zhuge-liang-battle-start.mp3 | 每場戰鬥開始時播放 |
| zhuge-liang-strategy | 諸葛亮 | hero | use_strategy | 星象已明，勝機在此。 | 策略 | 諸葛亮：沉著、智慧、溫和 | 中慢速 | public/audio/voices/zhuge-liang/zhuge-liang-strategy.mp3 | 觀星或策略行為時播放 |
| zhuge-liang-damage | 諸葛亮 | hero | take_damage | 兵行險著，仍在算中。 | 冷靜 | 諸葛亮：沉著、智慧、溫和 | 中慢速 | public/audio/voices/zhuge-liang/zhuge-liang-damage.mp3 | 玩家受到傷害時播放 |
| zhuge-liang-low-hp | 諸葛亮 | hero | low_hp | 局勢危急，須另尋轉機。 | 危急 | 諸葛亮：沉著、智慧、溫和 | 中慢速 | public/audio/voices/zhuge-liang/zhuge-liang-low-hp.mp3 | 每場戰鬥首次低血量時播放 |
| zhuge-liang-victory | 諸葛亮 | hero | victory | 此局，尚在掌中。 | 自信 | 諸葛亮：沉著、智慧、溫和 | 中慢速 | public/audio/voices/zhuge-liang/zhuge-liang-victory.mp3 | 擊敗敵人後播放 |
| yellow-turban-soldier-intro | 黃巾兵 | enemy | enemy_intro | 蒼天已死，黃天當立！ | 狂熱 | 敵人：粗獷、緊張、戰場感 | 中慢速 | public/audio/voices/enemies/yellow-turban-soldier-intro.mp3 | 一般敵人登場時播放 |
| bandit-leader-intro | 山賊頭目 | enemy | enemy_intro | 此山是我開，想過此路，留下性命！ | 兇狠 | 敵人：粗獷、緊張、戰場感 | 中慢速 | public/audio/voices/enemies/bandit-leader-intro.mp3 | 一般敵人登場時播放 |
| xiliang-cavalry-intro | 西涼騎兵 | enemy | enemy_intro | 西涼鐵騎至，誰敢擋路！ | 壓迫 | 敵人：粗獷、緊張、戰場感 | 中慢速 | public/audio/voices/enemies/xiliang-cavalry-intro.mp3 | 一般敵人登場時播放 |
| lu-bu-intro | 呂布 | enemy | boss_intro | 吾乃呂布，誰敢與我一戰？ | 霸氣 | 呂布：低沉、強勢、壓迫感 | 中慢速 | public/audio/voices/lu-bu/lu-bu-intro.mp3 | Boss 登場時播放 |
| narrator-chapter-1-intro | 旁白 | narrator | chapter_intro | 第一章：黃巾亂起。亂世初開，烽煙四起，一名英雄踏上了通往虎牢關的道路。 | 開場 | 旁白：成熟、穩定、史詩敘事 | 中慢速 | public/audio/narration/chapter-1-intro.mp3 | 章節開場或開頭動畫旁白 |
| narrator-stage-1-intro | 旁白 | narrator | stage_intro | 荒村煙塵未散，黃巾餘黨仍在掠奪糧草。 | 敘事 | 旁白：成熟、穩定、史詩敘事 | 中慢速 | public/audio/narration/stage-1-intro.mp3 | 指定關卡開場旁白 |
| narrator-stage-8-intro | 旁白 | narrator | stage_intro | 虎牢關前，赤兔嘶鳴，真正的考驗終於降臨。 | 決戰 | 旁白：成熟、穩定、史詩敘事 | 中慢速 | public/audio/narration/stage-8-intro.mp3 | 指定關卡開場旁白 |
| narrator-game-win | 旁白 | narrator | game_win | 你突破虎牢關前的考驗，第一章：黃巾亂起，至此落幕。 | 勝利 | 旁白：成熟、穩定、史詩敘事 | 中慢速 | public/audio/narration/game-win.mp3 | 通關結果頁旁白 |
| narrator-game-lose | 旁白 | narrator | game_lose | 亂世無情，英雄亦有敗時。重整旗鼓，再入戰場。 | 戰敗 | 旁白：成熟、穩定、史詩敘事 | 中慢速 | public/audio/narration/game-lose.mp3 | 戰敗結果頁旁白 |

## 輸出規則

- 目前所有素材狀態皆為 `planned`。
- 生成後音檔建議使用 MP3，放入上表的 `suggestedFilePath`。
- 不要在音檔中加入背景音樂、Logo 音、水印或額外口白。
- 角色語音應保留清楚斷句，避免過度戲劇化。
- 旁白可比角色語音更具電影感，但仍需適合教學展示。
