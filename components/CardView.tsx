import type { Card } from "@/lib/game/types";
import { CARD_VIEW_LAYOUT } from "@/lib/game/cardLayout";
import { GameImage } from "./GameImage";

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
  const style = getCardStyle(card);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onPlay?.(card.id)}
      className={`relative flex ${CARD_VIEW_LAYOUT.cardRootClass} flex-col overflow-hidden rounded-lg border p-3 text-left shadow-[0_16px_30px_rgba(0,0,0,0.28)] transition duration-200 enabled:cursor-pointer enabled:hover:-translate-y-1 enabled:hover:shadow-[0_22px_44px_rgba(0,0,0,0.42)] enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:grayscale disabled:opacity-40 disabled:hover:translate-y-0 sm:p-4 ${style.card}`}
    >
      <span className={`absolute inset-x-0 top-0 h-1 ${style.bar}`} />
      <div className={CARD_VIEW_LAYOUT.headerClass}>
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-lg font-black leading-6 text-stone-50 sm:text-xl">{card.name}</h3>
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-black sm:h-9 sm:w-9 ${style.cost}`}>
            {card.cost}
          </span>
        </div>
        <p className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${style.badge}`}>
          {style.label}
        </p>
      </div>
      <div className="mt-3 shrink-0 sm:mt-4">
        <GameImage
          src={card.image}
          alt={`${card.name}卡牌插圖`}
          variant={CARD_VIEW_LAYOUT.imageVariant}
          className={CARD_VIEW_LAYOUT.imageFrameClass}
          imageClassName="object-cover"
          sizes="(min-width: 768px) 220px, 160px"
          fallbackType="card"
          fallbackLabel={card.name}
          fallbackPrompt={card.visualPrompt}
          fallbackCompact={CARD_VIEW_LAYOUT.fallbackCompact}
        />
      </div>
      <p className={CARD_VIEW_LAYOUT.descriptionClass}>
        {card.text}
      </p>
    </button>
  );
}

function getCardStyle(card: Card) {
  if (card.kind === "equipment") {
    return {
      label: "裝備",
      card: "border-amber-400/80 bg-stone-950/95 hover:border-amber-200",
      bar: "bg-amber-300",
      badge: "border-amber-300/60 bg-amber-400/15 text-amber-100",
      cost: "border-amber-200/80 bg-amber-500 text-stone-950",
    };
  }

  if (card.name === "斬") {
    return {
      label: "攻擊",
      card: "border-red-500/70 bg-red-950/90 hover:border-red-300",
      bar: "bg-red-400",
      badge: "border-red-300/50 bg-red-500/15 text-red-100",
      cost: "border-red-300/70 bg-red-500 text-white",
    };
  }

  if (card.name === "閃") {
    return {
      label: "防禦",
      card: "border-sky-500/70 bg-sky-950/90 hover:border-sky-300",
      bar: "bg-sky-300",
      badge: "border-sky-300/50 bg-sky-500/15 text-sky-100",
      cost: "border-sky-200/70 bg-sky-600 text-white",
    };
  }

  if (card.name === "酒") {
    return {
      label: "回復",
      card: "border-emerald-500/70 bg-emerald-950/90 hover:border-emerald-300",
      bar: "bg-emerald-300",
      badge: "border-emerald-300/50 bg-emerald-500/15 text-emerald-100",
      cost: "border-emerald-200/70 bg-emerald-600 text-white",
    };
  }

  if (card.name === "兵書") {
    return {
      label: "策略",
      card: "border-purple-500/70 bg-purple-950/90 hover:border-purple-300",
      bar: "bg-purple-300",
      badge: "border-purple-300/50 bg-purple-500/15 text-purple-100",
      cost: "border-purple-200/70 bg-purple-600 text-white",
    };
  }

  if (card.name === "連斬") {
    return {
      label: "攻擊",
      card: "border-rose-500/70 bg-rose-950/90 hover:border-rose-300",
      bar: "bg-rose-300",
      badge: "border-rose-300/50 bg-rose-500/15 text-rose-100",
      cost: "border-rose-200/70 bg-rose-600 text-white",
    };
  }

  if (card.name === "固守") {
    return {
      label: "防禦",
      card: "border-cyan-500/70 bg-cyan-950/90 hover:border-cyan-300",
      bar: "bg-cyan-300",
      badge: "border-cyan-300/50 bg-cyan-500/15 text-cyan-100",
      cost: "border-cyan-200/70 bg-cyan-600 text-white",
    };
  }

  if (card.name === "激勵") {
    return {
      label: "策略",
      card: "border-lime-500/70 bg-emerald-950/90 hover:border-lime-300",
      bar: "bg-lime-300",
      badge: "border-lime-300/50 bg-lime-500/15 text-lime-100",
      cost: "border-lime-200/70 bg-lime-600 text-white",
    };
  }

  if (card.name === "火攻") {
    return {
      label: "策略 / 攻擊",
      card: "border-orange-500/80 bg-red-950/90 hover:border-orange-300",
      bar: "bg-orange-300",
      badge: "border-orange-300/50 bg-orange-500/15 text-orange-100",
      cost: "border-orange-200/70 bg-orange-600 text-white",
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
