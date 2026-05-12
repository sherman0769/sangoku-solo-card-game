export type VisualPlaceholderType = "hero" | "enemy" | "stage" | "card" | "event" | "route";

interface VisualPlaceholderProps {
  type: VisualPlaceholderType;
  label: string;
  prompt?: string;
  description?: string;
  compact?: boolean;
}

export function VisualPlaceholder({
  type,
  label,
  prompt,
  description,
  compact = false,
}: VisualPlaceholderProps) {
  const style = getVisualPlaceholderStyle(type);

  return (
    <div
      className={`relative overflow-hidden rounded-lg border ${style.frame} ${compact ? "min-h-20 p-3" : "min-h-44 p-4"}`}
    >
      <div className={`absolute inset-0 ${style.background}`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_28%),linear-gradient(135deg,rgba(0,0,0,0.1),rgba(0,0,0,0.46))]" />
      <div className="relative flex min-h-full flex-col justify-between">
        <div>
          <p className={`text-[11px] font-black uppercase tracking-[0.18em] ${style.eyebrow}`}>
            {style.label}
          </p>
          <p className={`${compact ? "mt-1 text-sm" : "mt-2 text-2xl"} font-black text-stone-50`}>
            {label}
          </p>
        </div>
        {compact ? null : (
          <p className="mt-5 text-xs leading-5 text-stone-200">
            {description ?? prompt ?? "未來此處將放入 AI 生成視覺資產"}
          </p>
        )}
      </div>
    </div>
  );
}

export function getVisualPlaceholderStyle(type: VisualPlaceholderType) {
  return visualPlaceholderStyles[type];
}

const visualPlaceholderStyles = {
  hero: {
    label: "角色立繪",
    frame: "border-amber-300/45 bg-stone-950",
    background: "bg-[linear-gradient(135deg,#78350f_0%,#7f1d1d_52%,#1c1917_100%)]",
    eyebrow: "text-amber-100",
  },
  enemy: {
    label: "敵人圖",
    frame: "border-red-300/45 bg-stone-950",
    background: "bg-[linear-gradient(135deg,#450a0a_0%,#7f1d1d_50%,#1c1917_100%)]",
    eyebrow: "text-red-100",
  },
  stage: {
    label: "關卡背景圖",
    frame: "border-sky-300/35 bg-stone-950",
    background: "bg-[linear-gradient(135deg,#0f172a_0%,#713f12_48%,#1c1917_100%)]",
    eyebrow: "text-sky-100",
  },
  card: {
    label: "卡牌插圖",
    frame: "border-white/20 bg-stone-950",
    background: "bg-[linear-gradient(135deg,#292524_0%,#7c2d12_48%,#111827_100%)]",
    eyebrow: "text-stone-100",
  },
  event: {
    label: "事件圖",
    frame: "border-purple-300/40 bg-stone-950",
    background: "bg-[linear-gradient(135deg,#2e1065_0%,#581c87_46%,#1c1917_100%)]",
    eyebrow: "text-purple-100",
  },
  route: {
    label: "路線圖",
    frame: "border-emerald-300/35 bg-stone-950",
    background: "bg-[linear-gradient(135deg,#064e3b_0%,#713f12_48%,#1c1917_100%)]",
    eyebrow: "text-emerald-100",
  },
} satisfies Record<
  VisualPlaceholderType,
  {
    label: string;
    frame: string;
    background: string;
    eyebrow: string;
  }
>;
