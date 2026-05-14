import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  getManualInstallInstruction,
  isStandaloneDisplay,
  shouldShowInstallPrompt,
} from "@/lib/game/installPrompt";
import { canUseNativeShare, getSharePayload, shareGame } from "@/lib/game/share";

const manifestPath = join(process.cwd(), "public", "manifest.webmanifest");
const readmePath = join(process.cwd(), "README.md");

describe("PWA manifest and sharing", () => {
  it("defines a valid install manifest", () => {
    expect(existsSync(manifestPath)).toBe(true);

    const manifest = JSON.parse(readFileSync(manifestPath, "utf-8")) as {
      name: string;
      description: string;
      display: string;
      orientation: string;
      icons: Array<{ src: string; sizes: string; purpose?: string }>;
    };

    expect(manifest.name).toContain("三國單騎傳");
    expect(manifest.description).toContain("李詩民");
    expect(manifest.display).toBe("standalone");
    expect(manifest.orientation).toBe("portrait");
    expect(manifest.icons.some((icon) => icon.sizes === "192x192")).toBe(true);
    expect(manifest.icons.some((icon) => icon.sizes === "512x512")).toBe(true);
    expect(manifest.icons.some((icon) => icon.purpose === "maskable")).toBe(true);
  });

  it("documents the current PWA release in README", () => {
    const readme = readFileSync(readmePath, "utf-8");

    expect(readme).toContain("v0.24.0 完整體驗 QA 修正版");
    expect(readme).toContain("AI 協作開發：李詩民");
  });

  it("ships PWA icons referenced by the manifest", () => {
    expect(existsSync(join(process.cwd(), "public", "icons", "icon-192.png"))).toBe(true);
    expect(existsSync(join(process.cwd(), "public", "icons", "icon-512.png"))).toBe(true);
    expect(existsSync(join(process.cwd(), "public", "icons", "icon-maskable-512.png"))).toBe(
      true,
    );
  });

  it("builds share payload copy with author attribution", () => {
    const payload = getSharePayload("https://example.com");

    expect(payload.title).toBe("三國單騎傳");
    expect(payload.text).toContain("李詩民");
    expect(payload.url).toBe("https://example.com");
  });

  it("falls back to clipboard when native share is unavailable", async () => {
    let copiedText = "";
    const result = await shareGame({
      navigatorLike: {
        clipboard: {
          writeText: async (text) => {
            copiedText = text;
          },
        },
      },
      origin: "https://example.com",
    });

    expect(canUseNativeShare(null)).toBe(false);
    expect(result).toBe("clipboard");
    expect(copiedText).toBe("https://example.com");
  });

  it("does not show install prompt in standalone mode", () => {
    expect(
      shouldShowInstallPrompt({
        dismissed: false,
        isMobile: true,
        isStandalone: isStandaloneDisplay({ displayModeStandalone: true }),
      }),
    ).toBe(false);
  });

  it("describes manual install instructions for iPhone and Android", () => {
    expect(getManualInstallInstruction("iPhone Safari")).toContain("加入主畫面");
    expect(getManualInstallInstruction("Android Chrome")).toContain("安裝 App");
  });
});
