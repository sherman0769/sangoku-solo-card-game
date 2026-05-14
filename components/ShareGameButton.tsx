"use client";

import { useState } from "react";
import { shareGame, type ShareResult } from "@/lib/game/share";

const statusCopy: Record<ShareResult, string> = {
  native: "分享視窗已開啟",
  clipboard: "連結已複製",
  unsupported: "請複製網址分享",
};

export function ShareGameButton({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const [status, setStatus] = useState<string | null>(null);

  async function handleShare() {
    try {
      const result = await shareGame();
      setStatus(statusCopy[result]);
    } catch {
      setStatus("分享取消或暫時無法使用");
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleShare}
        className={`inline-flex h-11 items-center justify-center gap-2 rounded-md border border-amber-300/60 bg-amber-500/15 px-4 text-sm font-black text-amber-50 transition hover:border-amber-100 hover:bg-amber-500/25 ${
          compact ? "w-full" : ""
        }`}
      >
        <ShareIcon />
        分享遊戲
      </button>
      {status ? (
        <p className="mt-2 text-xs font-bold text-emerald-200" aria-live="polite">
          {status}
        </p>
      ) : null}
    </div>
  );
}

function ShareIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
    </svg>
  );
}
