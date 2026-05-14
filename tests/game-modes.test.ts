import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  CHALLENGE_MODE,
  GAME_MODES,
  NORMAL_MODE,
  createGameStartHref,
  getGameModeBadge,
  getResultModeOutcomeLabel,
  resolveGameMode,
} from "@/lib/game/gameModes";

describe("game modes", () => {
  it("defines normal and challenge modes", () => {
    expect(GAME_MODES.map((mode) => mode.id)).toEqual(["normal", "challenge"]);
    expect(NORMAL_MODE.name).toBe("普通模式");
    expect(CHALLENGE_MODE.name).toBe("挑戰模式");
    expect(CHALLENGE_MODE.description).toContain("警戒反擊");
  });

  it("falls unknown modes back to normal", () => {
    expect(resolveGameMode("unknown").id).toBe("normal");
    expect(resolveGameMode(undefined).id).toBe("normal");
  });

  it("builds start URLs with challenge mode when selected", () => {
    expect(createGameStartHref("guan-yu", "challenge")).toBe(
      "/game?hero=guan-yu&mode=challenge",
    );
    expect(createGameStartHref("guan-yu", "normal")).toBe("/game?hero=guan-yu");
  });

  it("provides mode badges and result labels", () => {
    expect(getGameModeBadge("normal")).toBe("普通");
    expect(getGameModeBadge("challenge")).toBe("挑戰");
    expect(getResultModeOutcomeLabel("won", "challenge")).toBe("挑戰模式通關");
    expect(getResultModeOutcomeLabel("lost", "normal")).toBe("普通模式戰敗");
  });

  it("keeps README and home page aligned with v0.26.1 mode copy", () => {
    const readme = readFileSync(join(process.cwd(), "README.md"), "utf-8");
    const homePage = readFileSync(join(process.cwd(), "app", "page.tsx"), "utf-8");

    expect(readme).toContain("v0.26.1");
    expect(readme).toContain("警戒反擊");
    expect(homePage).toContain("選擇模式");
    expect(homePage).toContain("連續攻擊需要承擔代價");
    expect(homePage).not.toContain("查看目前版本特色");
  });
});
