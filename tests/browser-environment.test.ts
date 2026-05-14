import { describe, expect, it } from "vitest";
import {
  getExternalBrowserInstruction,
  isAndroid,
  isIOS,
  isLineInAppBrowser,
  shouldShowLineBrowserNotice,
} from "@/lib/game/browserEnvironment";

const iphoneLineUserAgent =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Line/13.0 Mobile/15E148";

const androidLineUserAgent =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/124.0 Mobile Safari/537.36 LINE/14.0";

describe("browser environment helpers", () => {
  it("detects LINE in-app browser user agents", () => {
    expect(isLineInAppBrowser(iphoneLineUserAgent)).toBe(true);
    expect(isLineInAppBrowser(androidLineUserAgent)).toBe(true);
    expect(isLineInAppBrowser("Mozilla/5.0 Safari/605.1.15")).toBe(false);
  });

  it("detects iOS and Android platforms", () => {
    expect(isIOS(iphoneLineUserAgent)).toBe(true);
    expect(isAndroid(iphoneLineUserAgent)).toBe(false);
    expect(isAndroid(androidLineUserAgent)).toBe(true);
    expect(isIOS(androidLineUserAgent)).toBe(false);
  });

  it("returns Safari guidance for iPhone LINE browser", () => {
    expect(getExternalBrowserInstruction(iphoneLineUserAgent)).toContain("在 Safari 中開啟");
    expect(getExternalBrowserInstruction(iphoneLineUserAgent)).toContain("加入主畫面");
  });

  it("returns Chrome guidance for Android LINE browser", () => {
    expect(getExternalBrowserInstruction(androidLineUserAgent)).toContain("在 Chrome 中開啟");
    expect(getExternalBrowserInstruction(androidLineUserAgent)).toContain("安裝 App");
  });

  it("does not show LINE notice in standalone mode", () => {
    expect(
      shouldShowLineBrowserNotice({
        dismissed: false,
        isLineBrowser: true,
        isStandalone: true,
      }),
    ).toBe(false);
  });
});
