# 《三國單騎傳》v0.24.0 完整體驗 QA 修正計畫

## 1. 本版 QA 目標

本版依據 `docs/project-review-v0.24.0-pre.md` 的階段性評估，將下一階段工作從「整體建議」整理為可執行 QA 任務。目標是讓第一章更適合外部玩家試玩，但不大改玩法、不新增第二章、不大幅調整平衡數值，也不導入新一批卡牌圖。

本版重點：

- 確認首頁仍是遊戲入口，不恢復版本特色或修改記錄。
- 確認手機戰鬥 UX、聲音控制、PWA / 分享 / 安裝的 QA 重點。
- 正式補上「卡牌圖片尚未完成」這個圖像缺口。
- 新增卡牌圖片缺口文件與 manifest，供下一階段批量生成。
- 保留 audit 與資源體積風險追蹤，不做破壞性自動修復。

## 2. P0 / P1 / P2 任務整理

| 優先級 | 任務 | 來源問題 | 本版處理方式 | 狀態 |
|---|---|---|---|---|
| P0 | 建立外部試玩 QA 任務清單 | 缺少真機 QA 清單 | 新增本文件，整理首頁、手機、聲音、PWA、工程 QA | 已處理 |
| P0 | 建立資源體積追蹤 | 圖片、影片、MP3 體積偏大 | 本版記錄風險；下一版建議 asset size report | 暫緩 |
| P0 | 普通模式勝率偏高 | balance 整體勝率 98.5% | 本版不調數值；建議後續以普通 / 挑戰模式處理 | 暫緩 |
| P0 | 卡牌圖片缺口 | 第一章角色、敵人、場景已補齊，但卡牌圖仍未補完 | 新增 `docs/card-image-gap-v0.24.0.md` 與 `CARD_IMAGE_GAP_MANIFEST` | 已處理 |
| P1 | 手機 HUD 資訊密度 | 狀態、裝備、Boss badge 同時出現可能擁擠 | 本版列入 QA 清單；不重構 UI | 暫緩 |
| P1 | 聲音混音基準 | BGM 可能蓋過 TTS，缺少一鍵靜音 | 本版列為下一階段聲音 QA；不新增總開關 | 暫緩 |
| P1 | PWA / LINE 真機驗證 | PWA 安裝流程跨平台差異大 | 本版列出檢查點；保留現有提示 | 暫緩 |
| P1 | 路線分佈偏斜 | 模擬中山道幾乎不被選 | 本版不改 AI 策略或路線數值；後續平衡處理 | 暫緩 |
| P1 | visual manifest 狀態分散 | status 欄位表達不一致 | 本版不重構；後續工程整理處理 | 暫緩 |
| P1 | npm audit moderate | Next 依賴 PostCSS 警告 | 記錄並禁止 force fix；等待上游修補 | 持續追蹤 |
| P2 | 對外展示素材 | 缺少作品介紹頁與社群素材 | 後續對外發表線處理 | 暫緩 |
| P2 | 無障礙檢查 | 尚未系統掃描鍵盤與 aria | 後續 QA 擴充 | 暫緩 |
| P2 | 第二章 / 更多卡牌 | 內容拓展尚未開始 | 等第一章 QA 完成後再做 | 暫緩 |

## 3. 本版實際處理項目

| 類別 | 實際處理 |
|---|---|
| QA 計畫 | 新增 `docs/qa-fix-plan-v0.24.0.md`，將 v0.24.0-pre 建議整理為任務表。 |
| 卡牌圖缺口 | 新增 `docs/card-image-gap-v0.24.0.md`，列出 12 張卡牌圖缺口、路徑、風格與提示詞。 |
| 結構化資料 | 新增 `lib/game/cardImageGapManifest.ts`，匯出 `CARD_IMAGE_GAP_MANIFEST`，全部 `planned`。 |
| 首頁文案 | 小幅更新首頁選角文案，補上「第一章已完成文、圖、聲、影整合，後續將補齊卡牌插圖與挑戰模式。」 |
| README | 更新版本為 v0.24.0，記錄 QA 修正與卡牌圖缺口整理。 |
| 測試 | 新增卡牌圖缺口與 QA 文件測試，確認首頁未恢復版本特色區。 |

## 4. 首頁完整體驗 QA

| 檢查項目 | 現況 | 本版處理 |
|---|---|---|
| 玩家是否一眼知道這是什麼遊戲 | 首頁仍有「選擇武將，闖過 8 關，挑戰呂布」與選角區 | 保留 |
| 主流程是否清楚 | `觀看開場動畫 → 選擇武將 → 開始遊戲` 已由 `homeMainFlowSteps` 管理 | 保留 |
| 分享 / 安裝 / LINE 提醒是否干擾 | 目前是非阻擋式卡片與按鈕，不在主出牌區 | 保留，後續真機 QA |
| BGM 控制是否清楚 | 顯示 BGM 開關、音量與啟動提示 | 保留 |
| 李詩民標示是否自然 | 作者標示與彩蛋角色同時存在，但文案已自然化 | 保留 |
| 是否出現版本特色 / 修改記錄 | 首頁測試已確認不包含「查看目前版本特色」「修改記錄」 | 保留測試 |
| 首頁是否過長 | 目前主要長度來自安裝提示、BGM、選角與教學收合 | 不重構，只小幅文案更新 |

## 5. 手機戰鬥體驗 QA

本版不重構 `GameBoard`，但整理下一輪真機檢查項目：

- 底部手牌區是否遮住 reward / routeEvent 按鈕。
- `player` phase 是否能在不大量滑動下看到手牌與「結束回合」。
- `defense` phase 是否能在底部操作區看到「使用閃」「承受傷害」「以斬作閃」。
- 敵我 HUD 在低血量、裝備三件、Boss 狀態同時存在時是否過密。
- 敵人敗退灰階與 stamp 在手機小螢幕是否清楚。
- reward / event / route / routeEvent / observation 是否都有明確「請選擇」提示。
- 狀態與設定是否容易找到，但不靠近高頻出牌按鈕造成誤觸。
- iPhone Safari / Android Chrome / PWA standalone 的 bottom safe area 是否足夠。

## 6. 聲音體驗 QA

| 檢查項目 | 現況 | 後續建議 |
|---|---|---|
| BGM 假開啟 | 已修正為播放成功後才顯示開啟 | 持續保留測試 |
| 音效 / 語音 / BGM 分開控制 | 三套 helper 與 localStorage key 分離 | 保留 |
| BGM 是否蓋過 TTS | 尚未有 ducking | v0.24.2 建議建立混音基準 |
| 開場動畫與首頁 BGM 混音 | 開場動畫播放時會避免與首頁 BGM 混音 | 真機確認 |
| 連續語音過多 | 敵人擊敗、路線事件、Boss 特性皆可能觸發 | 建議後續加入語音排隊或節流策略 |
| 一鍵靜音 | 尚未實作 | 建議下一階段評估「聲音總開關」 |

## 7. PWA / 分享 / 安裝 QA

| 檢查項目 | 現況 | 後續建議 |
|---|---|---|
| manifest.webmanifest | 已存在並由 metadata 指向 | 以 production URL 檢查 |
| icons | 192、512、maskable icon 已存在 | 真機安裝後確認桌面圖示 |
| LINE 內建瀏覽器提醒 | 已有 LINE 偵測、教學與複製連結 | iOS / Android LINE 實測 |
| Safari / Chrome 安裝提示 | InstallPrompt 保留一般瀏覽器流程 | 真機確認 beforeinstallprompt |
| standalone 模式 | helper 應避免顯示安裝提示 | PWA standalone 實測 |
| 分享按鈕 | 首頁、遊戲更多操作、結果頁皆有入口 | 確認 iOS share sheet 與 clipboard fallback |
| 結果頁分享文案 | 已自然引導分享 | 後續可加入換角色再戰 CTA |

## 8. 卡牌圖片缺口

本版正式將卡牌圖片列入圖像補完範圍。缺口共 12 筆：

- 基礎卡 5 張：斬、閃、酒、兵書、破甲。
- 戰術卡 4 張：連斬、固守、激勵、火攻。
- 裝備卡 3 張：青龍偃月刀、的盧馬、太平要術。

狀態：

- `CARD_IMAGE_GAP_MANIFEST` 全部為 `planned`。
- 本版不新增 `public/images/cards/*.png`。
- 後續可依 `docs/card-image-gap-v0.24.0.md` 批量生成，再建立 ready manifest 與 UI 導入。

## 9. 工程與資源 QA

目前已知風險：

- 資源體積：v0.24.0-pre 評估時統計 PNG 約 86.76 MB、MP4 約 24.16 MB、MP3 約 12.95 MB。下一版建議新增 asset size report。
- `npm audit`：目前有 2 個 moderate，來源為 Next 依賴的 PostCSS；`npm audit fix --force` 會安裝 Next 9.3.3，屬 breaking change，不應自動修。
- SSR / hydration：目前 BGM、語音、PWA、LINE 偵測皆有 SSR safe helper；仍需避免新增 browser API 到 Server Component module scope。
- manifest 分散：TTS、visual、image gap、BGM、card sound、card image gap 各自維護，後續可建立 manifest consistency test。
- 未使用資源：尚未有 dead asset scan；待 asset size report 一併處理。

## 10. 本版暫緩項目

- 不新增挑戰模式。
- 不調整呂布、張梁、張寶或路線事件數值。
- 不導入卡牌圖。
- 不新增一鍵靜音。
- 不壓縮既有圖片 / 影片。
- 不重構 visual manifest。
- 不執行 `npm audit fix --force`。
- 不新增第二章。

## 11. 下一階段建議

建議下一個實作版本優先順序：

1. `v0.24.1｜資源體積與真機 QA 版`：新增 asset size report、列出最大圖像 / 影片、建立 iOS / Android / LINE 真機 QA checklist。
2. `v0.24.2｜聲音混音與總開關版`：建立 BGM / TTS / SFX 混音基準、一鍵靜音、語音節流。
3. `v0.24.3-pre｜卡牌圖片生成準備版`：依本版缺口清單匯出批量生成文件。
4. `v0.25.0｜普通 / 挑戰模式版`：在不破壞普通試玩體驗的前提下增加挑戰深度。
