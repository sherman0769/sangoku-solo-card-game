import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getGameImageRenderMode, getGameImageVariantClass } from "@/components/GameImage";
import {
  CARD_IMAGE_GAP_MANIFEST,
  CARD_IMAGE_READY_MANIFEST,
} from "@/lib/game/cardImageGapManifest";
import { starterDeck } from "@/lib/game/cards";
import { VISUAL_ASSET_MANIFEST } from "@/lib/game/visualAssetManifest";

const expectedCardImages = [
  ["斬", "/images/cards/slash.png"],
  ["閃", "/images/cards/dodge.png"],
  ["酒", "/images/cards/wine.png"],
  ["兵書", "/images/cards/strategy-scroll.png"],
  ["破甲", "/images/cards/armor-break.png"],
  ["連斬", "/images/cards/combo-slash.png"],
  ["固守", "/images/cards/guard.png"],
  ["激勵", "/images/cards/inspire.png"],
  ["火攻", "/images/cards/fire-attack.png"],
  ["青龍偃月刀", "/images/cards/green-dragon-blade.png"],
  ["的盧馬", "/images/cards/dilu-horse.png"],
  ["太平要術", "/images/cards/taiping-manual.png"],
] as const;

describe("card illustrations", () => {
  it("adds image paths to all imported card types", () => {
    for (const [name, image] of expectedCardImages) {
      expect(getCardByName(name)?.image).toBe(image);
    }
  });

  it("keeps the card image gap manifest empty and ready manifest complete", () => {
    expect(CARD_IMAGE_GAP_MANIFEST).toHaveLength(0);
    expect(CARD_IMAGE_READY_MANIFEST).toHaveLength(12);

    for (const [, path] of expectedCardImages) {
      expect(CARD_IMAGE_READY_MANIFEST).toContainEqual(
        expect.objectContaining({
          path,
          aspectRatio: "4:3",
          status: "ready",
        }),
      );
    }
  });

  it("adds all card illustrations to the visual asset manifest", () => {
    const cardAssets = VISUAL_ASSET_MANIFEST.filter((asset) => asset.type === "card");

    expect(cardAssets).toHaveLength(12);
    for (const [, path] of expectedCardImages) {
      expect(cardAssets).toContainEqual(
        expect.objectContaining({
          path,
          aspectRatio: "4:3",
          status: "ready",
        }),
      );
    }
  });

  it("uses the shared card image ratio and keeps fallback mode available", () => {
    expect(getGameImageVariantClass("card")).toContain("aspect-[4/3]");
    expect(getGameImageRenderMode("/images/cards/slash.png")).toBe("image");
    expect(getGameImageRenderMode("/images/cards/slash.png", true)).toBe("fallback");
  });

  it("renders CardView with GameImage while preserving homepage simplification", () => {
    const cardViewSource = readFileSync(join(process.cwd(), "components", "CardView.tsx"), "utf-8");
    const homePageSource = readFileSync(join(process.cwd(), "app", "page.tsx"), "utf-8");

    expect(cardViewSource).toContain("GameImage");
    expect(cardViewSource).toContain('variant="card"');
    expect(cardViewSource).toContain("fallbackType=\"card\"");
    expect(homePageSource).not.toContain("查看目前版本特色");
  });
});

function getCardByName(name: string) {
  return starterDeck.find((card) => card.name === name);
}
