import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  CARD_IMAGE_GAP_MANIFEST,
  CARD_IMAGE_READY_MANIFEST,
} from "@/lib/game/cardImageGapManifest";

const qaPlanPath = join(process.cwd(), "docs", "qa-fix-plan-v0.24.0.md");
const cardImageGapPath = join(process.cwd(), "docs", "card-image-gap-v0.24.0.md");
const readmePath = join(process.cwd(), "README.md");

describe("card image manifests", () => {
  it("adds the QA plan and card image gap documents", () => {
    expect(existsSync(qaPlanPath)).toBe(true);
    expect(existsSync(cardImageGapPath)).toBe(true);
  });

  it("moves imported card images from gap to ready", () => {
    expect(CARD_IMAGE_GAP_MANIFEST).toHaveLength(0);
    expect(CARD_IMAGE_READY_MANIFEST).toHaveLength(12);
    expect(CARD_IMAGE_READY_MANIFEST.every((item) => item.status === "ready")).toBe(true);
    expect(CARD_IMAGE_READY_MANIFEST.every((item) => item.promptZh.length > 0)).toBe(true);
    expect(CARD_IMAGE_READY_MANIFEST.every((item) => item.promptEn.length > 0)).toBe(true);
    expect(CARD_IMAGE_READY_MANIFEST.every((item) => item.negativePrompt.length > 0)).toBe(true);
  });

  it("contains all basic, tactic, and equipment card ready images", () => {
    const names = CARD_IMAGE_READY_MANIFEST.map((item) => item.name);

    expect(names).toEqual([
      "斬",
      "閃",
      "酒",
      "兵書",
      "破甲",
      "連斬",
      "固守",
      "激勵",
      "火攻",
      "青龍偃月刀",
      "的盧馬",
      "太平要術",
    ]);
    expect(CARD_IMAGE_READY_MANIFEST.filter((item) => item.type === "basic")).toHaveLength(5);
    expect(CARD_IMAGE_READY_MANIFEST.filter((item) => item.type === "tactic")).toHaveLength(4);
    expect(CARD_IMAGE_READY_MANIFEST.filter((item) => item.type === "equipment")).toHaveLength(3);
  });

  it("documents QA scope and card image import completion", () => {
    const qaPlan = readFileSync(qaPlanPath, "utf-8");
    const cardImageGap = readFileSync(cardImageGapPath, "utf-8");

    expect(qaPlan).toContain("P0 / P1 / P2");
    expect(qaPlan).toContain("本版實際處理項目");
    expect(qaPlan).toContain("本版暫緩項目");
    expect(qaPlan).toContain("卡牌圖片缺口");
    expect(cardImageGap).toContain("東方史詩卡牌風");
    expect(cardImageGap).toContain("剩餘缺口：0");
    expect(cardImageGap).toContain("status: ready");
  });

  it("updates README through v0.26.0 without restoring homepage changelog sections", () => {
    const readme = readFileSync(readmePath, "utf-8");
    const homePageSource = readFileSync(join(process.cwd(), "app", "page.tsx"), "utf-8");

    expect(readme).toContain("v0.24.1 卡牌圖片導入版");
    expect(readme).toContain("v0.24.1：導入 12 張卡牌圖片");
    expect(readme).toContain("v0.24.2 卡牌尺寸一致化修正版");
    expect(readme).toContain("v0.24.2：修正手牌卡牌尺寸不一致問題");
    expect(readme).toContain("v0.24.3 卡牌寬度與 BGM 延續修正版");
    expect(readme).toContain("v0.24.3：修正卡牌寬度與 BGM 跨頁延續");
    expect(readme).toContain("v0.24.4 BGM 跨頁延續實機修正版");
    expect(readme).toContain("v0.24.4：修復 BGM 跨頁延續狀態");
    expect(readme).toContain("v0.26.0 挑戰模式版");
    expect(readme).toContain("v0.26.0：新增挑戰模式");
    expect(homePageSource).not.toContain("查看目前版本特色");
  });
});
