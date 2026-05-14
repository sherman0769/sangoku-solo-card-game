import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CARD_VIEW_LAYOUT } from "@/lib/game/cardLayout";

describe("card view layout", () => {
  it("keeps hand cards on fixed dimensions", () => {
    expect(CARD_VIEW_LAYOUT.cardRootClass).toContain("h-80");
    expect(CARD_VIEW_LAYOUT.cardRootClass).toContain("md:h-[21rem]");
    expect(CARD_VIEW_LAYOUT.mobileCardWrapperClass).toContain("w-40");
    expect(CARD_VIEW_LAYOUT.mobileCardWrapperClass).toContain("shrink-0");
  });

  it("uses the 4:3 card image frame with compact fallback", () => {
    expect(CARD_VIEW_LAYOUT.imageAspectRatio).toBe("4:3");
    expect(CARD_VIEW_LAYOUT.imageVariant).toBe("card");
    expect(CARD_VIEW_LAYOUT.imageFrameClass).toContain("border");
    expect(CARD_VIEW_LAYOUT.fallbackCompact).toBe(true);
  });

  it("clamps description text so long effects do not resize cards", () => {
    expect(CARD_VIEW_LAYOUT.descriptionLineClamp).toBe(3);
    expect(CARD_VIEW_LAYOUT.descriptionClass).toContain("card-description-clamp");
    expect(CARD_VIEW_LAYOUT.descriptionClass).toContain("min-h-[3.75rem]");
    expect(CARD_VIEW_LAYOUT.descriptionClass).toContain("mt-auto");
  });

  it("wires CardView and mobile hand row to the shared layout config", () => {
    const cardViewSource = readFileSync(join(process.cwd(), "components", "CardView.tsx"), "utf-8");
    const gameBoardSource = readFileSync(join(process.cwd(), "components", "GameBoard.tsx"), "utf-8");
    const cssSource = readFileSync(join(process.cwd(), "app", "globals.css"), "utf-8");

    expect(cardViewSource).toContain("CARD_VIEW_LAYOUT.cardRootClass");
    expect(cardViewSource).toContain("CARD_VIEW_LAYOUT.descriptionClass");
    expect(cardViewSource).toContain("CARD_VIEW_LAYOUT.imageVariant");
    expect(gameBoardSource).toContain("CARD_VIEW_LAYOUT.mobileCardWrapperClass");
    expect(cssSource).toContain(".card-description-clamp");
    expect(cssSource).toContain("-webkit-line-clamp: 3");
  });
});
