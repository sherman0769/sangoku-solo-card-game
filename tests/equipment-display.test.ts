import { describe, expect, it } from "vitest";
import {
  getEquippedItemBadges,
  getEquippedItemFullLabels,
  getEquippedItemShortLabels,
  mobilePrimaryBattleActionLabels,
  secondaryBattleActionCopy,
} from "@/lib/game/equipmentDisplay";

describe("equipment display helpers", () => {
  it("shows green dragon blade as slash damage equipment", () => {
    const labels = getEquippedItemShortLabels([{ name: "青龍偃月刀" }]);

    expect(labels).toContain("青龍｜斬+1");
    expect(labels.join(" ")).toContain("斬+1");
    expect(getEquippedItemBadges([{ name: "青龍偃月刀" }])[0]).toMatchObject({
      effectLabel: "斬+1",
    });
  });

  it("shows dilu horse as first attack dodge equipment", () => {
    const labels = getEquippedItemShortLabels([{ name: "的盧馬" }]);

    expect(labels).toContain("的盧｜首閃");
    expect(labels.join(" ")).toContain("首閃");
  });

  it("shows taiping manual as strategy draw equipment", () => {
    const labels = getEquippedItemShortLabels([{ name: "太平要術" }]);

    expect(labels).toContain("太平｜兵書+1");
    expect(labels.join(" ")).toContain("兵書+1");
  });

  it("returns a clear empty equipment label for full displays", () => {
    expect(getEquippedItemFullLabels([])).toEqual(["尚未裝備"]);
    expect(getEquippedItemShortLabels([])).toEqual([]);
  });

  it("keeps mobile HUD equipment badges available", () => {
    const labels = getEquippedItemShortLabels([
      { name: "青龍偃月刀" },
      { name: "的盧馬" },
      { name: "太平要術" },
    ]);

    expect(labels).toEqual(["青龍｜斬+1", "的盧｜首閃", "太平｜兵書+1"]);
  });

  it("defines secondary action copy away from the primary battle controls", () => {
    expect(secondaryBattleActionCopy.restart).toBe("重新開始本局");
    expect(secondaryBattleActionCopy.home).toBe("返回首頁");
  });

  it("keeps home and restart out of primary mobile action labels", () => {
    const primaryActionCopy = mobilePrimaryBattleActionLabels.join(" ");

    expect(primaryActionCopy).not.toContain("首頁");
    expect(primaryActionCopy).not.toContain("重新開始");
  });
});
