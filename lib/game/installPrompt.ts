export const installPromptStorageKey = "sangoku-install-prompt-dismissed";

export const installPromptCopy = {
  title: "安裝到主畫面",
  description: "安裝到主畫面，體驗更像手機遊戲。",
  installAction: "安裝",
  laterAction: "稍後",
  ios: "iPhone Safari：點分享按鈕 → 加入主畫面。",
  android: "Android Chrome：點右上角選單 → 安裝 App 或加入主畫面。",
} as const;

export function isMobileUserAgent(userAgent: string) {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent);
}

export function isStandaloneDisplay({
  displayModeStandalone = false,
  navigatorStandalone = false,
}: {
  displayModeStandalone?: boolean;
  navigatorStandalone?: boolean;
}) {
  return displayModeStandalone || navigatorStandalone;
}

export function shouldShowInstallPrompt({
  dismissed,
  isMobile,
  isStandalone,
}: {
  dismissed: boolean;
  isMobile: boolean;
  isStandalone: boolean;
}) {
  return isMobile && !dismissed && !isStandalone;
}

export function getManualInstallInstruction(userAgent: string) {
  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return installPromptCopy.ios;
  }

  return installPromptCopy.android;
}
