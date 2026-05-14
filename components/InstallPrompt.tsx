"use client";

import { useEffect, useState } from "react";
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
  const [manualInstruction, setManualInstruction] = useState<string | null>(null);

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const timer = window.setTimeout(() => {
      const dismissed = window.localStorage.getItem(installPromptStorageKey) === "true";
      const standalone = isStandaloneDisplay({
        displayModeStandalone: window.matchMedia("(display-mode: standalone)").matches,
        navigatorStandalone: Boolean(
          (window.navigator as Navigator & { standalone?: boolean }).standalone,
        ),
      });
      const isMobile =
        isMobileUserAgent(userAgent) || window.matchMedia("(max-width: 768px)").matches;

      setVisible(
        shouldShowInstallPrompt({
          dismissed,
          isMobile,
          isStandalone: standalone,
        }),
      );
      setManualInstruction(getManualInstallInstruction(userAgent));
    }, 0);

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setVisible(true);
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
