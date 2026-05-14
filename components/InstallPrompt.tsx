"use client";

import { useEffect, useState } from "react";
import {
  getExternalBrowserInstruction,
  isLineInAppBrowser,
  lineBrowserNoticeStorageKey,
  shouldShowLineBrowserNotice,
} from "@/lib/game/browserEnvironment";
import {
  getManualInstallInstruction,
  installPromptCopy,
  installPromptStorageKey,
  isMobileUserAgent,
  isStandaloneDisplay,
  shouldShowInstallPrompt,
} from "@/lib/game/installPrompt";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [lineBrowserVisible, setLineBrowserVisible] = useState(false);
  const [manualInstruction, setManualInstruction] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const timer = window.setTimeout(() => {
      const dismissed = window.localStorage.getItem(installPromptStorageKey) === "true";
      const lineDismissed =
        window.localStorage.getItem(lineBrowserNoticeStorageKey) === "true";
      const lineBrowser = isLineInAppBrowser(userAgent);
      const standalone = isStandaloneDisplay({
        displayModeStandalone: window.matchMedia("(display-mode: standalone)").matches,
        navigatorStandalone: Boolean(
          (window.navigator as Navigator & { standalone?: boolean }).standalone,
        ),
      });
      const isMobile =
        isMobileUserAgent(userAgent) || window.matchMedia("(max-width: 768px)").matches;

      setLineBrowserVisible(
        shouldShowLineBrowserNotice({
          dismissed: lineDismissed,
          isLineBrowser: lineBrowser,
          isStandalone: standalone,
        }),
      );
      setVisible(
        !lineBrowser &&
          shouldShowInstallPrompt({
            dismissed,
            isMobile,
            isStandalone: standalone,
          }),
      );
      setManualInstruction(
        lineBrowser
          ? getExternalBrowserInstruction(userAgent)
          : getManualInstallInstruction(userAgent),
      );
    }, 0);

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      if (!isLineInAppBrowser(window.navigator.userAgent)) {
        setVisible(true);
      }
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  async function handleInstall() {
    if (!installEvent) {
      setManualInstruction(manualInstruction ?? installPromptCopy.android);
      return;
    }

    await installEvent.prompt();
    await installEvent.userChoice.catch(() => null);
    window.localStorage.setItem(installPromptStorageKey, "true");
    setVisible(false);
  }

  function handleLater() {
    window.localStorage.setItem(installPromptStorageKey, "true");
    setVisible(false);
  }

  async function handleCopyLink() {
    try {
      await window.navigator.clipboard?.writeText(window.location.href);
      setCopyStatus("連結已複製，請貼到瀏覽器開啟");
    } catch {
      setCopyStatus("請複製網址並貼到 Safari 或 Chrome 開啟");
    }
  }

  function handleDismissLineNotice() {
    window.localStorage.setItem(lineBrowserNoticeStorageKey, "true");
    setLineBrowserVisible(false);
  }

  if (lineBrowserVisible) {
    return (
      <section className="rounded-xl border border-sky-300/45 bg-sky-500/12 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.24)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-200">
              建議用瀏覽器開啟
            </p>
            <p className="mt-1 text-sm font-bold leading-6 text-stone-100">
              你目前可能是在 LINE 內開啟。若要安裝到手機主畫面，請先用 Safari 或 Chrome 瀏覽器開啟本頁。
            </p>
            {manualInstruction ? (
              <p className="mt-2 text-xs font-bold leading-5 text-stone-300">
                {manualInstruction}
              </p>
            ) : null}
            {copyStatus ? (
              <p className="mt-2 text-xs font-black text-emerald-200" aria-live="polite">
                {copyStatus}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="h-10 rounded-md bg-sky-300 px-4 text-sm font-black text-stone-950 transition hover:bg-sky-200"
            >
              複製連結
            </button>
            <button
              type="button"
              onClick={handleDismissLineNotice}
              className="h-10 rounded-md border border-stone-500 bg-stone-950/60 px-4 text-sm font-bold text-stone-100 transition hover:border-stone-200"
            >
              我知道了
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!visible) {
    return null;
  }

  return (
    <section className="rounded-xl border border-amber-300/45 bg-amber-500/12 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.24)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-200">
            {installPromptCopy.title}
          </p>
          <p className="mt-1 text-sm font-bold leading-6 text-stone-100">
            {installPromptCopy.description}
          </p>
          {!installEvent && manualInstruction ? (
            <p className="mt-2 text-xs font-bold leading-5 text-stone-300">
              {manualInstruction}
            </p>
          ) : null}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleInstall}
            className="h-10 rounded-md bg-amber-500 px-4 text-sm font-black text-stone-950 transition hover:bg-amber-300"
          >
            {installPromptCopy.installAction}
          </button>
          <button
            type="button"
            onClick={handleLater}
            className="h-10 rounded-md border border-stone-500 bg-stone-950/60 px-4 text-sm font-bold text-stone-100 transition hover:border-stone-200"
          >
            {installPromptCopy.laterAction}
          </button>
        </div>
      </div>
    </section>
  );
}
