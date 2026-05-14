import Link from "next/link";
import { ShareGameButton } from "@/components/ShareGameButton";
import { getGameResultDialogue } from "@/lib/game/dialogues";
import {
  getGameModeName,
  getResultModeOutcomeLabel,
  resolveGameMode,
} from "@/lib/game/gameModes";

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ outcome?: string; mode?: string }>;
}) {
  const { outcome, mode } = await searchParams;
  const resolvedMode = resolveGameMode(mode);
  const isWon = outcome === "won";
  const isLost = outcome === "lost";
  const resultDialogue = isWon ? getGameResultDialogue("won") : isLost ? getGameResultDialogue("lost") : undefined;
  const title = isWon || isLost
    ? getResultModeOutcomeLabel(outcome, resolvedMode.id)
    : "戰役結果";
  const message = isWon
    ? (resultDialogue?.text ?? "你突破虎牢關前的考驗，第一章：黃巾亂起 已完成。")
    : isLost
      ? (resultDialogue?.text ?? "亂世無情，重整旗鼓，再試一次。")
      : "完成一局遊戲後，這裡會顯示勝利或失敗結果。";
  const cta = isLost ? "重新挑戰" : "再戰一局";

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#140c09] bg-[radial-gradient(circle_at_top_left,rgba(127,29,29,0.34),transparent_35%),linear-gradient(135deg,#1b100b_0%,#2a120d_48%,#090605_100%)] px-4 py-10 text-stone-100 sm:px-6 sm:py-12">
      <section className="mx-auto flex min-h-[80vh] max-w-[calc(100vw-2rem)] flex-col justify-center sm:max-w-3xl">
        <div className="rounded-xl border border-amber-700/40 bg-black/35 p-5 shadow-[0_22px_60px_rgba(0,0,0,0.38)] sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-300">
            戰役結果
          </p>
          <p className="mt-3 inline-flex rounded-full border border-amber-300/45 bg-amber-500/12 px-3 py-1 text-sm font-black text-amber-100">
            本局模式：{getGameModeName(resolvedMode.id)}
          </p>
          <h1 className="mt-4 text-4xl font-black text-amber-50 sm:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-[300px] break-words text-base leading-8 text-stone-300 [overflow-wrap:anywhere] sm:max-w-none sm:text-lg">
            {message}
          </p>
          <p className="mt-4 text-sm font-bold leading-6 text-amber-100">
            喜歡這個 AI 協作遊戲作品，也可以分享給朋友體驗。
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={`/game?mode=${resolvedMode.id}`}
              className="inline-flex h-12 items-center justify-center rounded-md bg-amber-500 px-6 text-sm font-black text-stone-950 transition hover:bg-amber-300"
            >
              {cta}
            </Link>
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-md border border-amber-700/60 bg-stone-950/60 px-6 text-sm font-bold text-amber-100 transition hover:border-amber-300 hover:bg-amber-950/60"
            >
              返回首頁
            </Link>
            <ShareGameButton />
          </div>
        </div>
      </section>
    </main>
  );
}
