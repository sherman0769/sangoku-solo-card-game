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
    expect(currentVersionLabel).toBe("v0.9.0 第一章關卡擴充版");
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
