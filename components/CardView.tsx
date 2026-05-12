import type { Card } from "@/lib/game/types";

interface CardViewProps {
  card: Card;
  disabled?: boolean;
  onPlay?: (cardId: string) => void;
}

export default function CardView({
  card,
  disabled = false,
  onPlay,
}: CardViewProps) {
  const style = getCardStyle(card.name);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onPlay?.(card.id)}
      className={`relative flex min-h-48 flex-col justify-between overflow-hidden rounded-lg border p-4 text-left shadow-[0_16px_30px_rgba(0,0,0,0.28)] transition duration-200 enabled:cursor-pointer enabled:hover:-translate-y-1 enabled:hover:shadow-[0_22px_44px_rgba(0,0,0,0.42)] enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:grayscale disabled:opacity-40 disabled:hover:translate-y-0 ${style.card}`}
    >
      <span className={`absolute inset-x-0 top-0 h-1 ${style.bar}`} />
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-black leading-6 text-stone-50">{card.name}</h3>
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-black ${style.cost}`}>
            {card.cost}
          </span>
        </div>
        <p className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${style.badge}`}>
          {style.label}
        </p>
      </div>
      <p className="mt-6 text-sm leading-6 text-stone-200">
        {card.text}
      </p>
    </button>
  );
}

function getCardStyle(cardName: string) {
  if (cardName === "斬") {
    return {
      label: "攻擊",
      card: "border-red-500/70 bg-red-950/90 hover:border-red-300",
      bar: "bg-red-400",
      badge: "border-red-300/50 bg-red-500/15 text-red-100",
      cost: "border-red-300/70 bg-red-500 text-white",
    };
  }

  if (cardName === "閃") {
    return {
      label: "防禦",
      card: "border-sky-500/70 bg-sky-950/90 hover:border-sky-300",
      bar: "bg-sky-300",
      badge: "border-sky-300/50 bg-sky-500/15 text-sky-100",
      cost: "border-sky-200/70 bg-sky-600 text-white",
    };
  }

  if (cardName === "酒") {
    return {
      label: "回復",
      card: "border-emerald-500/70 bg-emerald-950/90 hover:border-emerald-300",
      bar: "bg-emerald-300",
      badge: "border-emerald-300/50 bg-emerald-500/15 text-emerald-100",
      cost: "border-emerald-200/70 bg-emerald-600 text-white",
    };
  }

  if (cardName === "兵書") {
    return {
      label: "策略",
      card: "border-purple-500/70 bg-purple-950/90 hover:border-purple-300",
      bar: "bg-purple-300",
      badge: "border-purple-300/50 bg-purple-500/15 text-purple-100",
      cost: "border-purple-200/70 bg-purple-600 text-white",
    };
  }

  return {
    label: "破防",
    card: "border-orange-500/70 bg-orange-950/90 hover:border-orange-300",
    bar: "bg-orange-300",
    badge: "border-orange-300/50 bg-orange-500/15 text-orange-100",
    cost: "border-orange-200/70 bg-orange-600 text-white",
  };
}
