import { describe, expect, it } from "vitest";
import {
  currentFeatureHighlights,
  currentVersionLabel,
  getPhaseHint,
  howToSteps,
  quickRules,
} from "@/lib/game/showcase";

describe("showcase and onboarding copy", () => {
  it("includes homepage how-to and current feature copy", () => {
    expect(currentVersionLabel).toBe("v0.12.3 第一批 TTS 語音導入版");
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
      "視覺資產 placeholder：角色、敵人、關卡、事件、路線與卡牌",
    );
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
      "選擇下一條路線。風險越高，下一戰越難，但可能獲得更好報酬。",
    );
    expect(getPhaseHint("observe")).toBe(
      "諸葛亮發動觀星，選擇一張你最需要的牌加入手牌。",
    );
  });

  it("includes quick rules for the game page", () => {
    expect(quickRules).toContain("每回合開始會抽牌。");
    expect(quickRules).toContain("第 8 關擊敗呂布即可通關。");
  });
});
