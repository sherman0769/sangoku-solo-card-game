export const lineBrowserNoticeStorageKey = "sangoku-line-browser-notice-dismissed";

export function isLineInAppBrowser(userAgent = "") {
  return /\bLine\b|LINE/i.test(userAgent);
}

export function isIOS(userAgent = "") {
  return /iPhone|iPad|iPod/i.test(userAgent);
}

export function isAndroid(userAgent = "") {
  return /Android/i.test(userAgent);
}

export function getExternalBrowserInstruction(userAgent = "") {
  if (isIOS(userAgent)) {
    return "iPhone：點右上角或下方分享選單，選擇「在 Safari 中開啟」，再使用「加入主畫面」。";
  }

  if (isAndroid(userAgent)) {
    return "Android：點右上角選單，選擇「在 Chrome 中開啟」，再點「安裝 App」或「加入主畫面」。";
  }

  return "請先用 Safari 或 Chrome 瀏覽器開啟本頁，再使用加入主畫面或安裝 App。";
}

export function shouldShowLineBrowserNotice({
  dismissed,
  isLineBrowser,
  isStandalone,
}: {
  dismissed: boolean;
  isLineBrowser: boolean;
  isStandalone: boolean;
}) {
  return isLineBrowser && !dismissed && !isStandalone;
}
