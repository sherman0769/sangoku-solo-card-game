import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const reviewPath = join(process.cwd(), "docs", "project-review-v0.24.0-pre.md");
const readmePath = join(process.cwd(), "README.md");

describe("v0.24.0-pre project review", () => {
  it("adds the staged project review report", () => {
    expect(existsSync(reviewPath)).toBe(true);
  });

  it("covers the required review sections", () => {
    const report = readFileSync(reviewPath, "utf-8");

    expect(report).toContain("評估摘要");
    expect(report).toContain("優化建議清單");
    expect(report).toContain("下一階段建議路線");
    expect(report).toContain("建議的下一個版本");
    expect(report).toContain("玩家第一印象");
    expect(report).toContain("手機 UX");
    expect(report).toContain("戰鬥節奏");
    expect(report).toContain("平衡");
    expect(report).toContain("文、圖、聲、影完整度");
    expect(report).toContain("PWA / 分享 / 安裝體驗");
    expect(report).toContain("工程穩定性");
  });

  it("documents concrete prioritized recommendations", () => {
    const report = readFileSync(reviewPath, "utf-8");
    const recommendationRows = report
      .split("\n")
      .filter((line) => /^\| \d+ \| P[0-2] \|/.test(line));

    expect(recommendationRows.length).toBeGreaterThanOrEqual(15);
    expect(report).toContain("P0 3 條、P1 9 條、P2 6 條");
    expect(report).toContain("v0.24.0｜完整體驗 QA 修正版");
  });

  it("updates README with the v0.24.0-pre history entry", () => {
    const readme = readFileSync(readmePath, "utf-8");

    expect(readme).toContain("v0.24.0-pre 整體體驗評估與優化建議版");
    expect(readme).toContain("v0.24.0-pre：建立整體遊戲階段性評估報告");
    expect(readme).toContain("docs/project-review-v0.24.0-pre.md");
  });
});
