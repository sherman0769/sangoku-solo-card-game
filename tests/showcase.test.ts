import { describe, expect, it } from "vitest";
import {
  currentFeatureHighlights,
  currentVersionLabel,
  getPhaseHint,
  getHeroIntroAudioKey,
  getHeroPreviewAudioKey,
  getHeroStartLabel,
  gameLoadingCopy,
  homeCollapsibleSections,
  homeHeroPreviewCopy,
  homeHeroSelectionCopy,
  homeMainFlowSteps,
  homeOpeningVideoEntry,
  howToSteps,
  mobileGameplaySections,
  openingVideoModalActions,
  quickRules,
  routeSelectionCopy,
} from "@/lib/game/showcase";
import { canPlayVoice } from "@/lib/game/voice";

describe("showcase and onboarding copy", () => {
  it("includes homepage how-to and current feature copy", () => {
    expect(currentVersionLabel).toBe("v0.19.2 路線事件圖片導入版");
    expect(howToSteps.map((step) => step.title)).toEqual([
      "選擇武將",
      "進入戰鬥",
      "擊敗敵人",
      "遇見事件",
      "選擇獎勵",
      "選擇路線",
    ]);
    expect(currentFeatureHighlights).toContain("31 張玩家牌組");
    expect(currentFeatureHighlights).toContain("第一章 8 關流程");
    expect(currentFeatureHighlights).toContain("戰術卡：連斬、固守、激勵、火攻");
    expect(currentFeatureHighlights).toContain("第一批 AI 圖像：首頁主視覺、關羽、趙雲、諸葛亮");
    expect(currentFeatureHighlights).toContain("第二批敵人圖像：黃巾兵、山賊頭目、西涼騎兵、呂布");
    expect(currentFeatureHighlights).toContain("第一批關卡背景：荒村初戰、虎牢關前");
    expect(currentFeatureHighlights).toContain(
      "視覺呈現優化：首頁、武將、敵人、Boss 與關卡背景手機版顯示",
    );
    expect(currentFeatureHighlights).toContain(
      "人物台詞系統：武將台詞、敵人登場、章節旁白與勝敗旁白",
    );
    expect(currentFeatureHighlights).toContain(
      "第一版音效系統：Web Audio API 提示音、手動開關與本機設定保存",
    );
    expect(currentFeatureHighlights).toContain(
      "TTS 配音素材規劃：為角色語音與開場旁白做準備",
    );
    expect(currentFeatureHighlights).toContain(
      "語音播放框架：已建立 audioKey 對應與未來 TTS 音檔播放機制",
    );
    expect(currentFeatureHighlights).toContain(
      "第一批 TTS 語音：章節開場、三位武將登場與呂布登場",
    );
    expect(currentFeatureHighlights).toContain(
      "首頁武將試聽語音：選角時可聽到專屬語音，與進入遊戲後登場語音分離。",
    );
    expect(currentFeatureHighlights).toContain(
      "第一章 TTS 補完規劃：已整理八關旁白、敵人登場、擊敗語音與路線事件語音清單。",
    );
    expect(currentFeatureHighlights).toContain(
      "第一章 P0 語音已導入：八關旁白、敵人登場、Boss 特性與勝敗語音陸續完成。",
    );
    expect(currentFeatureHighlights).toContain(
      "第一章圖片資產已補齊：敵人、關卡背景、路線與路線事件皆有正式圖像。",
    );
    expect(currentFeatureHighlights).toContain(
      "開頭動畫：以 AI 圖像、影片與音樂製作第一章開場",
    );
    expect(currentFeatureHighlights).toContain(
      "手機遊玩優化：戰鬥 HUD、底部手牌操作區、紀錄與設定收合",
    );
    expect(currentFeatureHighlights).toContain(
      "首頁互動修正：武將試聽台詞、開場動畫入口上移、教學與特色收合",
    );
    expect(currentFeatureHighlights).toContain(
      "開場動畫體驗：一次點擊全螢幕播放、可略過、可關閉、可重播",
    );
    expect(currentFeatureHighlights).toContain(
      "首頁主流程：觀看開場動畫 → 選擇武將 → 開始遊戲",
    );
    expect(currentFeatureHighlights).toContain(
      "卡牌音效系統：不同類型卡牌可對應不同音效",
    );
    expect(currentFeatureHighlights).toContain(
      "真實卡牌音效：斬、連斬、防禦、回復、策略、裝備、火攻 MP3 已導入",
    );
    expect(currentFeatureHighlights).toContain(
      "戰鬥平衡分析：使用模擬工具分析武將勝率與關卡難度",
    );
    expect(currentFeatureHighlights).toContain(
      "第一輪平衡微調：諸葛亮 HP 提升至 4、呂布 HP 提升至 14，並保留第 2～3 關敵人數值",
    );
    expect(currentFeatureHighlights).toContain(
      "後期難度微調：張梁、張寶與呂布猛攻比例小幅提高，未調整第 1～6 關敵人",
    );
    expect(currentFeatureHighlights).toContain(
      "路線劇情事件：山道、官道、險道擁有不同遭遇與資源方向",
    );
    expect(currentFeatureHighlights).toContain(
      "險道風險再平衡：提高絕壁伏擊、古戰場遺物與夜襲敵營代價",
    );
    expect(currentFeatureHighlights).toContain(
      "路線風格選擇：山道、官道、險道不再只是難度差異，而是不同劇情與資源方向",
    );
    expect(currentFeatureHighlights).toContain(
      "Boss 特性系統：呂布具備無雙壓迫與戰神回血，最終戰更具壓迫感",
    );
    expect(currentFeatureHighlights).toContain(
      "Boss 戰演出強化：呂布發動無雙壓迫與戰神回血時，會有更明顯的畫面提示",
    );
    expect(currentFeatureHighlights).toContain(
      "Hydration 修正：/game 隨機戰局初始化改為 client mounted 後執行",
    );
    expect(currentFeatureHighlights).toContain(
      "視覺資產 placeholder：角色、敵人、關卡、事件、路線與卡牌",
    );
  });

  it("defines deterministic loading copy for client-only game initialization", () => {
    expect(gameLoadingCopy).toEqual({
      title: "戰局準備中……",
      description: "正在生成本局敵人與初始手牌。",
    });
  });

  it("describes the corrected homepage start flow", () => {
    expect(homeMainFlowSteps).toEqual(["觀看開場動畫", "選擇武將", "開始遊戲"]);
    expect(homeHeroSelectionCopy).toBe("先選擇你的武將，再開始遊戲。");
    expect(homeHeroPreviewCopy).toBe("開啟角色語音後，點選武將可試聽專屬選角語音。");
    expect(homeOpeningVideoEntry).toMatchObject({
      title: "開場動畫",
      description: "觀看第一章：黃巾亂起 的 20 秒直式開場動畫",
      primaryAction: "觀看開場動畫",
    });
    expect(Object.values(homeOpeningVideoEntry).join(" ")).not.toContain("略過動畫，直接開始");
    expect(getHeroStartLabel("關羽")).toBe("以關羽開始遊戲");
  });

  it("keeps opening video modal start actions", () => {
    expect(openingVideoModalActions).toContain("略過動畫，開始遊戲");
    expect(openingVideoModalActions).toContain("開始遊戲");
    expect(openingVideoModalActions).toContain("重新播放");
  });

  it("maps game phases to tutorial hints", () => {
    expect(getPhaseHint("player")).toBe(
      "先觀察敵人狀態，再決定使用攻擊、防禦、回復或策略卡。準備好了就按結束回合。",
    );
    expect(getPhaseHint("defense")).toBe(
      "敵人正在攻擊，你可以使用閃或相關技能抵消，也可以選擇承受傷害。",
    );
    expect(getPhaseHint("reward")).toBe("選擇一項戰後強化，它會影響後續整局戰鬥。");
    expect(getPhaseHint("event")).toBe("事件會帶來補給、策略或風險，請選擇你的處理方式。");
    expect(getPhaseHint("route")).toBe(
      "選擇下一條路線。山道偏生存補給，官道偏情報穩定，險道偏奇遇與代價。",
    );
    expect(getPhaseHint("routeEvent")).toBe(
      "處理路線事件。不同路線會帶來補給、情報、支援或稀有奇遇。",
    );
    expect(getPhaseHint("observe")).toBe(
      "諸葛亮發動觀星，選擇一張你最需要的牌加入手牌。",
    );
  });

  it("describes route selection as a playstyle choice", () => {
    expect(routeSelectionCopy).toEqual({
      title: "選擇路線",
      description: "三條路線代表不同遭遇與資源方向，敵人難度不再直接由路線決定。",
    });
    expect(routeSelectionCopy.description).not.toContain("敵人 HP");
  });

  it("includes quick rules for the game page", () => {
    expect(quickRules).toContain("每回合開始會抽牌。");
    expect(quickRules).toContain("第 8 關擊敗呂布即可通關。");
  });

  it("describes mobile gameplay sections", () => {
    expect(mobileGameplaySections).toEqual([
      "手機戰鬥 HUD",
      "底部手牌操作區",
      "戰鬥紀錄收合",
      "狀態與設定收合",
      "事件 / 獎勵 / 路線選擇優化",
    ]);
  });

  it("describes collapsible homepage sections", () => {
    expect(homeCollapsibleSections.map((section) => section.id)).toEqual(["how-to", "features"]);
    expect(homeCollapsibleSections.map((section) => section.title)).toEqual([
      "怎麼玩？展開教學",
      "查看目前版本特色",
    ]);
  });

  it("maps homepage hero selection to ready preview audio instead of intro audio", () => {
    expect(getHeroPreviewAudioKey("guan-yu")).toBe("guan-yu-preview");
    expect(getHeroPreviewAudioKey("zhao-yun")).toBe("zhao-yun-preview");
    expect(getHeroPreviewAudioKey("zhuge-liang")).toBe("zhuge-liang-preview");
    expect(getHeroPreviewAudioKey("guan-yu")).not.toBe("guan-yu-intro");
    expect(getHeroPreviewAudioKey("zhao-yun")).not.toBe("zhao-yun-intro");
    expect(getHeroPreviewAudioKey("zhuge-liang")).not.toBe("zhuge-liang-intro");
    expect(canPlayVoice("guan-yu-preview")).toBe(true);
    expect(canPlayVoice("zhao-yun-preview")).toBe(true);
    expect(canPlayVoice("zhuge-liang-preview")).toBe(true);
  });

  it("keeps game intro audio keys ready for entering the game", () => {
    expect(getHeroIntroAudioKey("guan-yu")).toBe("guan-yu-intro");
    expect(getHeroIntroAudioKey("zhao-yun")).toBe("zhao-yun-intro");
    expect(getHeroIntroAudioKey("zhuge-liang")).toBe("zhuge-liang-intro");
    expect(canPlayVoice("guan-yu-intro")).toBe(true);
    expect(canPlayVoice("zhao-yun-intro")).toBe(true);
    expect(canPlayVoice("zhuge-liang-intro")).toBe(true);
  });
});
