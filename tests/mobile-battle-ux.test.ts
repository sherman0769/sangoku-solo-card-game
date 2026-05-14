import { describe, expect, it } from "vitest";
import {
  getChoicePhasePrompt,
  getEnemyDefeatedStampLabel,
  getMobileBottomActionHint,
  isChoicePhase,
} from "@/lib/game/mobileBattleUx";

describe("mobile battle UX helpers", () => {
  it("generates defeated stamps for normal enemies and bosses", () => {
    expect(getEnemyDefeatedStampLabel(false)).toBe("敗退");
    expect(getEnemyDefeatedStampLabel(true)).toBe("敗");
  });

  it("describes choice phase prompts", () => {
    expect(getChoicePhasePrompt("reward")).toBe("請選擇一項戰後獎勵");
    expect(getChoicePhasePrompt("routeEvent")).toBe("請處理路線事件");
    expect(getChoicePhasePrompt("observe")).toBe("請選擇觀星牌");
  });

  it("identifies phases that need a selection reminder", () => {
    expect(isChoicePhase("reward")).toBe(true);
    expect(isChoicePhase("event")).toBe(true);
    expect(isChoicePhase("route")).toBe(true);
    expect(isChoicePhase("routeEvent")).toBe(true);
    expect(isChoicePhase("observe")).toBe(true);
    expect(isChoicePhase("player")).toBe(false);
    expect(isChoicePhase("defense")).toBe(false);
  });

  it("provides bottom action hints for mobile combat", () => {
    expect(getMobileBottomActionHint("player")).toBe("選擇手牌或結束回合");
    expect(getMobileBottomActionHint("defense")).toBe("請選擇防禦方式");
    expect(getMobileBottomActionHint("routeEvent")).toBe("請選擇一項繼續");
  });
});
