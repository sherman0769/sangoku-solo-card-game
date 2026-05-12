import Link from "next/link";

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ outcome?: string }>;
}) {
  const { outcome } = await searchParams;
  const isWon = outcome === "won";
  const isLost = outcome === "lost";
  const title = isWon ? "通關成功" : isLost ? "戰敗" : "戰役結果";
  const message = isWon
    ? "關羽單騎破敵，亂世再添一段傳奇。"
    : isLost
      ? "亂世無情，重整旗鼓，再試一次。"
      : "完成一局遊戲後，這裡會顯示勝利或失敗結果。";
  const cta = isLost ? "重新挑戰" : "再戰一局";

  return (
    <main className="min-h-screen bg-[#140c09] bg-[radial-gradient(circle_at_top_left,rgba(127,29,29,0.34),transparent_35%),linear-gradient(135deg,#1b100b_0%,#2a120d_48%,#090605_100%)] px-6 py-12 text-stone-100">
      <section className="mx-auto flex min-h-[80vh] max-w-3xl flex-col justify-center">
        <div className="rounded-xl border border-amber-700/40 bg-black/35 p-6 shadow-[0_22px_60px_rgba(0,0,0,0.38)] sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-300">
            戰役結果
          </p>
          <h1 className="mt-4 text-5xl font-black text-amber-50 sm:text-7xl">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-stone-300">{message}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/game"
              className="inline-flex h-12 items-center justify-center rounded-md bg-amber-500 px-6 text-sm font-black text-stone-950 transition hover:bg-amber-300"
            >
              {cta}
            </Link>
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-md border border-amber-700/60 bg-stone-950/60 px-6 text-sm font-bold text-amber-100 transition hover:border-amber-300 hover:bg-amber-950/60"
            >
              回首頁
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
