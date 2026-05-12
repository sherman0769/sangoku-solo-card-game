interface BattleLogProps {
  entries: string[];
}

export default function BattleLog({ entries }: BattleLogProps) {
  const recentEntries = entries.slice(0, 8);

  return (
    <aside className="rounded-lg border border-amber-700/40 bg-stone-950/80 p-4 text-stone-100 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
      <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-amber-200">
        戰鬥紀錄
      </h2>
      <ol className="mt-4 space-y-3 text-sm leading-6">
        {recentEntries.map((entry, index) => (
          <li
            key={`${entry}-${index}`}
            className="flex gap-3 border-t border-amber-900/50 pt-3 first:border-t-0 first:pt-0"
          >
            <span className="shrink-0 text-base" aria-hidden="true">
              {getLogMarker(entry)}
            </span>
            <span>{entry}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}

function getLogMarker(entry: string) {
  if (
    entry.includes("路線") ||
    entry.includes("山道") ||
    entry.includes("官道") ||
    entry.includes("險道")
  ) {
    return entry.includes("險道") ? "☠" : "⚔";
  }

  if (
    entry.includes("事件") ||
    entry.includes("荒村補給") ||
    entry.includes("軍師獻策") ||
    entry.includes("伏兵突襲")
  ) {
    if (entry.includes("伏兵突襲")) {
      return "☠";
    }

    if (entry.includes("軍師獻策")) {
      return "📜";
    }

    return "🎁";
  }

  if (entry.includes("獎勵") || entry.includes("強化")) {
    return "🎁";
  }

  if (
    entry.includes("裝備") ||
    entry.includes("青龍偃月刀") ||
    entry.includes("的盧馬") ||
    entry.includes("太平要術")
  ) {
    return "🎁";
  }

  if (entry.includes("防守") || entry.includes("閃") || entry.includes("抵消")) {
    return "🛡";
  }

  if (entry.includes("固守")) {
    return "🛡";
  }

  if (entry.includes("酒") || entry.includes("恢復") || entry.includes("回復")) {
    return "🍶";
  }

  if (entry.includes("激勵")) {
    return "🍶";
  }

  if (entry.includes("兵書") || entry.includes("觀星") || entry.includes("抽")) {
    return "📜";
  }

  if (entry.includes("戰敗") || entry.includes("受到") || entry.includes("危險")) {
    return "☠";
  }

  return "⚔";
}
