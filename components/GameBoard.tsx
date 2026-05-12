"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import BattleLog from "@/components/BattleLog";
import CardView from "@/components/CardView";
import { equipmentEffects } from "@/lib/game/cards";
import { getEventTypeLabel } from "@/lib/game/events";
import {
  createGame,
  endTurn,
  getCurrentEnemyAction,
  playCard,
  resolveEventOption,
  resolveDefense,
  selectObservation,
  selectReward,
  selectRoute,
} from "@/lib/game/engine";
import type { GameEvent, PlayerUpgrades, Reward, StageRoute } from "@/lib/game/types";

interface EventToast {
  id: number;
  text: string;
  tone: "attack" | "guard" | "heal" | "strategy" | "reward" | "danger";
}

interface PanelFeedback {
  id: number;
  target: "player" | "enemy";
  tone: "hit" | "heal";
  text: string;
}

interface StageNotice {
  id: number;
  title: string;
  subtitle: string;
}

export default function GameBoard({ initialHeroId }: { initialHeroId?: string }) {
  const router = useRouter();
  const [state, setState] = useState(() => createGame(initialHeroId, { enemyRandom: Math.random }));
  const [eventToast, setEventToast] = useState<EventToast | null>(null);
  const [panelFeedback, setPanelFeedback] = useState<PanelFeedback | null>(null);
  const [stageNotice, setStageNotice] = useState<StageNotice | null>(null);
  const eventTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackIdRef = useRef(0);
  const enemyPercent = useMemo(
    () => Math.max(0, Math.round((state.enemyHealth / state.enemy.maxHealth) * 100)),
    [state.enemy.maxHealth, state.enemyHealth],
  );
  const playerPercent = Math.max(
    0,
    Math.round((state.player.health / state.player.maxHealth) * 100),
  );
  const nextEnemyAction = getCurrentEnemyAction(state);
  const playerStatuses = getPlayerStatuses({
    heroId: state.player.heroId,
    slashUsedThisTurn: state.player.slashUsedThisTurn,
    guardActive: state.player.guardActive,
    wineBonus: state.player.wineBonus,
    enemyArmorBroken: state.enemyArmorBroken,
    phase: state.phase,
  });
  const enemyStatuses = getEnemyStatuses({
    guarding: state.enemyGuarding,
    charged: state.enemyCharged,
    phase: state.phase,
    nextAction: nextEnemyAction.label,
  });
  const upgradeLabels = getUpgradeLabels(state.playerUpgrades);
  const equippedLabels = getEquippedLabels(state.player.equippedItems);

  useEffect(() => {
    if (state.status === "won" || state.status === "lost") {
      router.push(`/result?outcome=${state.status}`);
    }
  }, [router, state.status]);

  function nextFeedbackId() {
    feedbackIdRef.current += 1;
    return feedbackIdRef.current;
  }

  function showEventToast(text: string, tone: EventToast["tone"]) {
    if (eventTimerRef.current) {
      clearTimeout(eventTimerRef.current);
    }

    setEventToast({ id: nextFeedbackId(), text, tone });
    eventTimerRef.current = setTimeout(() => setEventToast(null), 1000);
  }

  function showPanelFeedback(
    target: PanelFeedback["target"],
    tone: PanelFeedback["tone"],
    text: string,
  ) {
    if (panelTimerRef.current) {
      clearTimeout(panelTimerRef.current);
    }

    setPanelFeedback({ id: nextFeedbackId(), target, tone, text });
    panelTimerRef.current = setTimeout(() => setPanelFeedback(null), 760);
  }

  useEffect(() => {
    if (stageTimerRef.current) {
      clearTimeout(stageTimerRef.current);
    }

    feedbackIdRef.current += 1;
    setStageNotice({
      id: feedbackIdRef.current,
      title: state.enemy.title,
      subtitle: getStageEntranceText(state.enemy.name),
    });
    stageTimerRef.current = setTimeout(() => setStageNotice(null), 1200);
  }, [state.enemy.name, state.enemy.title]);

  useEffect(() => {
    return () => {
      if (eventTimerRef.current) {
        clearTimeout(eventTimerRef.current);
      }
      if (panelTimerRef.current) {
        clearTimeout(panelTimerRef.current);
      }
      if (stageTimerRef.current) {
        clearTimeout(stageTimerRef.current);
      }
    };
  }, []);

  function handlePlayCard(cardId: string) {
    const card = state.hand.find((item) => item.id === cardId);
    const beforeEnemyHealth = state.enemyHealth;
    const beforePlayerHealth = state.player.health;
    const next = playCard(state, cardId);

    if (next !== state && card && state.phase === "player") {
      const toast = getCardToast(card.name, state.player.heroId);
      showEventToast(toast.text, toast.tone);

      if (next.enemyHealth < beforeEnemyHealth) {
        showPanelFeedback("enemy", "hit", "受到傷害");
      }

      if (next.player.health > beforePlayerHealth) {
        showPanelFeedback("player", "heal", "回復體力");
      }
    }

    setState(next);
  }

  function handleEndTurn() {
    const beforePlayerHealth = state.player.health;
    const next = endTurn(state);

    if (next.player.health < beforePlayerHealth) {
      showEventToast("☠ 受到傷害！", "danger");
      showPanelFeedback("player", "hit", "受到傷害");
    }

    setState(next);
  }

  function handleResolveDefense(useDodge: boolean) {
    const beforePlayerHealth = state.player.health;
    const next = resolveDefense(state, useDodge);

    if (useDodge && next !== state) {
      showEventToast("🛡 閃避！", "guard");
    }

    if (next.player.health < beforePlayerHealth) {
      showEventToast("☠ 受到傷害！", "danger");
      showPanelFeedback("player", "hit", "受到傷害");
    }

    setState(next);
  }

  function handleSelectObservation(cardId: string) {
    const next = selectObservation(state, cardId);

    if (next !== state) {
      showEventToast("觀星入手！", "strategy");
    }

    setState(next);
  }

  function handleSelectReward(reward: Reward) {
    const beforePlayerHealth = state.player.health;
    const next = selectReward(state, reward.id);

    if (next !== state) {
      showEventToast(`獲得強化：${reward.name}`, "reward");

      if (next.player.health > beforePlayerHealth) {
        showPanelFeedback("player", "heal", "回復體力");
      }
    }

    setState(next);
  }

  function handleSelectRoute(route: StageRoute) {
    const next = selectRoute(state, route.id, { enemyRandom: Math.random });

    if (next !== state) {
      showEventToast(`選擇路線：${route.name}`, route.id === "dangerous-pass" ? "danger" : "reward");
    }

    setState(next);
  }

  function handleResolveEvent(optionId: string) {
    const beforePlayerHealth = state.player.health;
    const beforeHandCount = state.hand.length;
    const eventName = state.currentEvent?.name ?? "事件";
    const next = resolveEventOption(state, optionId);

    if (next !== state) {
      showEventToast(`${eventName}完成`, eventName === "伏兵突襲" ? "danger" : "strategy");

      if (next.player.health > beforePlayerHealth) {
        showPanelFeedback("player", "heal", "回復體力");
      }

      if (next.player.health < beforePlayerHealth) {
        showPanelFeedback("player", "hit", "受到傷害");
      }

      if (next.hand.length > beforeHandCount) {
        showEventToast("📜 抽牌！", "strategy");
      }
    }

    setState(next);
  }

  return (
    <main className="min-h-screen bg-[#140c09] bg-[radial-gradient(circle_at_top_left,rgba(127,29,29,0.34),transparent_34%),linear-gradient(135deg,#1b100b_0%,#2a120d_45%,#090605_100%)] px-4 py-5 text-stone-100 sm:px-6 lg:px-8">
      {eventToast ? <EventToastView key={eventToast.id} toast={eventToast} /> : null}
      <div className="mx-auto max-w-7xl">
        <header className="rounded-xl border border-amber-700/40 bg-black/30 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur sm:flex sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">
              第 {state.enemyIndex + 1} 關 / 3 · 第 {state.turn} 回合
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-normal text-amber-50 sm:text-4xl">
              三國單騎傳
            </h1>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 sm:mt-0">
            <button
              type="button"
              onClick={() => setState(createGame(initialHeroId, { enemyRandom: Math.random }))}
              className="h-10 rounded-md border border-amber-600/60 bg-stone-950/70 px-4 text-sm font-bold text-amber-100 transition hover:border-amber-300 hover:bg-amber-950/70"
            >
              重新開始
            </button>
            <Link
              href="/"
              className="inline-flex h-10 items-center rounded-md border border-stone-600 bg-stone-950/70 px-4 text-sm font-bold text-stone-100 transition hover:border-stone-300 hover:bg-stone-800"
            >
              首頁
            </Link>
          </div>
        </header>

        {stageNotice ? (
          <section
            key={stageNotice.id}
            className="animate-fade-in mt-5 rounded-xl border border-amber-300/50 bg-amber-950/45 p-4 text-center shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
          >
            <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-200">
              {stageNotice.title}
            </p>
            <h2 className="mt-1 text-2xl font-black text-amber-50">
              {stageNotice.subtitle}
            </h2>
          </section>
        ) : null}

        <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <CombatantPanel
                tone="player"
                eyebrow="武將"
                title={state.player.name}
                badge={state.player.title}
                health={`♥ ${state.player.health} / ${state.player.maxHealth}`}
                percent={playerPercent}
                details={[
                  `稱號：${state.player.title}`,
                  `士氣 ${state.player.morale}/${state.player.maxMorale}`,
                  `技能：${state.player.skillName}`,
                  state.player.skillText,
                ]}
                statuses={playerStatuses}
                feedback={
                  panelFeedback?.target === "player" ? panelFeedback : undefined
                }
              />
              <CombatantPanel
                tone="enemy"
                eyebrow={state.enemy.title}
                title={state.enemy.name}
                badge={state.enemy.id === "lu-bu" ? "Boss" : "敵將"}
                health={`♥ ${state.enemyHealth} / ${state.enemy.maxHealth}`}
                percent={enemyPercent}
                details={[
                  `類型：${getEnemyTypeLabel(state.enemy.type)}`,
                  `特性：${state.enemy.traits.join("、")}`,
                  state.enemy.description,
                  `下一步：${nextEnemyAction.label}`,
                  nextEnemyAction.text,
                ]}
                statuses={enemyStatuses}
                feedback={
                  panelFeedback?.target === "enemy" ? panelFeedback : undefined
                }
              />
            </div>

            {state.phase === "observe" && state.pendingObservation ? (
              <section className="rounded-xl border border-purple-400/50 bg-purple-950/55 p-5 text-purple-50 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
                  諸葛亮技能
                </p>
                <h2 className="mt-2 text-2xl font-black">觀星</h2>
                <p className="mt-2 text-sm leading-6 text-purple-100">
                  選擇一張牌加入手牌，其餘放回牌堆底。選完後會再抽
                  {state.pendingObservation.drawCount} 張牌。
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {state.pendingObservation.cards.map((card) => (
                    <CardView
                      key={card.id}
                      card={card}
                      onPlay={handleSelectObservation}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {state.phase === "event" && state.currentEvent ? (
              <section className={`rounded-xl border p-5 shadow-[0_18px_45px_rgba(0,0,0,0.35)] ${getEventFrameClass(state.currentEvent.type)}`}>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
                  事件
                </p>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-stone-50">
                      {state.currentEvent.name}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-stone-200">
                      {state.currentEvent.description}
                    </p>
                  </div>
                  <span className="inline-flex w-fit rounded-full border border-amber-200/50 bg-black/25 px-3 py-1 text-xs font-black text-amber-100">
                    {getEventTypeLabel(state.currentEvent.type)}
                  </span>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {state.currentEvent.options.map((option) => (
                    <EventOptionCard
                      key={option.id}
                      event={state.currentEvent!}
                      optionId={option.id}
                      label={option.label}
                      description={option.description}
                      onChoose={handleResolveEvent}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {state.phase === "defense" && state.pendingDefense ? (
              <section className="rounded-xl border border-red-500/60 bg-red-950/70 p-5 text-red-50 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
                <h2 className="text-lg font-black">危險：敵人攻擊中</h2>
                <p className="mt-2 text-sm leading-6 text-red-100">
                  {state.pendingDefense.enemyName} 使用
                  {state.pendingDefense.actionLabel}，將造成
                  {state.pendingDefense.damage} 點傷害。你可以使用閃抵消，
                  或選擇承受傷害。
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleResolveDefense(true)}
                    className="h-11 rounded-md bg-sky-600 px-5 text-sm font-black text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {getDefenseButtonLabel(state)}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleResolveDefense(false)}
                    className="h-11 rounded-md border border-red-300/70 px-5 text-sm font-black text-red-50 transition hover:bg-red-800"
                  >
                    承受傷害
                  </button>
                </div>
              </section>
            ) : null}

            {state.phase === "reward" ? (
              <section className="rounded-xl border border-purple-400/50 bg-purple-950/50 p-5 text-purple-50 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
                  戰後獎勵
                </p>
                <h2 className="mt-2 text-2xl font-black">選擇一項強化</h2>
                <p className="mt-2 text-sm leading-6 text-purple-100">
                  選擇一項強化，繼續下一場戰鬥。
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {state.rewardOptions.map((reward) => (
                    <RewardCard
                      key={reward.id}
                      reward={reward}
                      onChoose={() => handleSelectReward(reward)}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {state.phase === "route" ? (
              <section className="rounded-xl border border-amber-400/50 bg-stone-950/70 p-5 text-stone-50 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
                  選擇路線
                </p>
                <h2 className="mt-2 text-2xl font-black">決定下一場戰鬥的風險與報酬</h2>
                <p className="mt-2 text-sm leading-6 text-stone-300">
                  高風險路線會讓敵人更強，但也可能帶來更好的戰後選項。
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {state.availableRoutes.map((route) => (
                    <RouteCard
                      key={route.id}
                      route={route}
                      onChoose={() => handleSelectRoute(route)}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            <section className="rounded-xl border border-amber-700/40 bg-black/25 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.3)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-black text-amber-50">手牌</h2>
                <button
                  type="button"
                  disabled={state.status !== "playing" || state.phase !== "player"}
                  onClick={handleEndTurn}
                  className="h-11 rounded-md bg-amber-500 px-5 text-sm font-black text-stone-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-stone-700 disabled:text-stone-400"
                >
                  結束回合
                </button>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {state.hand.map((card) => (
                  <CardView
                    key={card.id}
                    card={card}
                    disabled={
                      state.status !== "playing" ||
                      state.phase !== "player" ||
                      (card.kind === "dodge" && state.player.heroId !== "zhao-yun") ||
                      (card.kind === "equipment" &&
                        state.player.equippedItems.some((item) => item.name === card.name)) ||
                      card.cost > state.player.morale
                    }
                    onPlay={handlePlayCard}
                  />
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-5">
            <BattleLog entries={state.log} />
            <InfoPanel title="目前強化">
              {upgradeLabels.length > 0 ? (
                <ul className="space-y-2 text-sm text-amber-50">
                  {upgradeLabels.map((label) => (
                    <li key={label}>{label}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-stone-300">尚未獲得強化</p>
              )}
            </InfoPanel>
            <InfoPanel title="已裝備">
              {equippedLabels.length > 0 ? (
                <ul className="space-y-2 text-sm text-amber-50">
                  {equippedLabels.map((label) => (
                    <li key={label}>{label}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-stone-300">尚未裝備</p>
              )}
            </InfoPanel>
            <InfoPanel title="戰局">
              <p>目前第 {state.enemyIndex + 1} 關，共 3 關</p>
              <p className="mt-2">
                牌庫 {state.deck.length} 張 / 棄牌 {state.discard.length} 張
              </p>
              {state.selectedRoute ? (
                <p className="mt-2">目前路線：{state.selectedRoute.name}</p>
              ) : null}
              {state.rewardOptionBonus > 0 ? (
                <p className="mt-2 text-amber-100">
                  下一次戰後獎勵 +{state.rewardOptionBonus} 個選項
                </p>
              ) : null}
            </InfoPanel>
          </div>
        </section>
        <footer className="mt-8 pb-2 text-center text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
          版本：v0.8.0 戰術卡測試版
        </footer>
      </div>
    </main>
  );
}

function CombatantPanel({
  tone,
  eyebrow,
  title,
  badge,
  health,
  percent,
  details,
  statuses,
  feedback,
}: {
  tone: "player" | "enemy";
  eyebrow: string;
  title: string;
  badge: string;
  health: string;
  percent: number;
  details: string[];
  statuses: string[];
  feedback?: PanelFeedback;
}) {
  const isPlayer = tone === "player";
  const frameClass = isPlayer
    ? "border-emerald-400/50 bg-emerald-950/35"
    : "border-red-500/50 bg-red-950/35";
  const barClass = isPlayer ? "bg-emerald-400" : "bg-red-500";
  const badgeClass = isPlayer
    ? "border-emerald-300/50 bg-emerald-500/15 text-emerald-100"
    : "border-red-300/50 bg-red-500/15 text-red-100";

  const feedbackClass =
    feedback?.tone === "heal"
      ? "animate-pulse-heal"
      : feedback
        ? "animate-shake-hit animate-pulse-hit"
        : "";

  return (
    <section className={`relative rounded-xl border p-5 shadow-[0_18px_45px_rgba(0,0,0,0.35)] ${frameClass} ${feedbackClass}`}>
      {feedback ? (
        <div
          key={feedback.id}
          className={`pointer-events-none absolute right-4 top-4 rounded-full border px-3 py-1 text-xs font-black ${
            feedback.tone === "heal"
              ? "border-emerald-200/70 bg-emerald-500/25 text-emerald-50"
              : "border-red-200/70 bg-red-500/25 text-red-50"
          }`}
        >
          {feedback.text}
        </div>
      ) : null}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-black text-stone-50">{title}</h2>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-black ${badgeClass}`}>
          {badge}
        </span>
      </div>
      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-lg font-black text-stone-50">{health}</p>
        <p className="text-xs font-bold text-stone-300">體力</p>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-black/40">
        <div className={`h-full ${barClass}`} style={{ width: `${percent}%` }} />
      </div>
      <ul className="mt-5 space-y-2 text-sm leading-6 text-stone-200">
        {details.map((detail) => (
          <li key={detail}>{detail}</li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        {statuses.map((status) => (
          <span
            key={status}
            className="rounded-full border border-amber-300/30 bg-black/25 px-3 py-1 text-xs font-bold text-amber-100"
          >
            {status}
          </span>
        ))}
      </div>
    </section>
  );
}

function EventToastView({ toast }: { toast: EventToast }) {
  const toneClass = {
    attack: "border-red-300/70 bg-red-950/90 text-red-50",
    guard: "border-sky-300/70 bg-sky-950/90 text-sky-50",
    heal: "border-emerald-300/70 bg-emerald-950/90 text-emerald-50",
    strategy: "border-purple-300/70 bg-purple-950/90 text-purple-50",
    reward: "border-amber-300/70 bg-amber-950/90 text-amber-50",
    danger: "border-red-200/80 bg-red-900/95 text-red-50",
  }[toast.tone];

  return (
    <div className="pointer-events-none fixed left-1/2 top-24 z-50 w-[min(92vw,360px)] -translate-x-1/2">
      <div
        className={`animate-float-up rounded-xl border px-5 py-3 text-center text-xl font-black shadow-[0_18px_45px_rgba(0,0,0,0.45)] ${toneClass}`}
      >
        {toast.text}
      </div>
    </div>
  );
}

function RewardCard({ reward, onChoose }: { reward: Reward; onChoose: () => void }) {
  return (
    <button
      type="button"
      onClick={onChoose}
      className="min-h-44 rounded-lg border border-amber-300/50 bg-stone-950/80 p-4 text-left shadow-[0_16px_34px_rgba(0,0,0,0.34)] transition hover:-translate-y-1 hover:border-amber-200 hover:bg-purple-900/60"
    >
      <span className="rounded-full border border-purple-300/40 bg-purple-500/15 px-3 py-1 text-xs font-black text-purple-100">
        {getRewardStyleHint(reward.id)}
      </span>
      <span className="mt-4 block text-xl font-black text-amber-50">
        {reward.name}
      </span>
      <span className="mt-3 block text-sm leading-6 text-stone-200">{reward.text}</span>
    </button>
  );
}

function EventOptionCard({
  event,
  optionId,
  label,
  description,
  onChoose,
}: {
  event: GameEvent;
  optionId: string;
  label: string;
  description: string;
  onChoose: (optionId: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChoose(optionId)}
      className={`min-h-36 rounded-lg border p-4 text-left shadow-[0_16px_34px_rgba(0,0,0,0.34)] transition hover:-translate-y-1 ${getEventButtonClass(event.type)}`}
    >
      <span className="rounded-full border border-white/25 bg-black/25 px-3 py-1 text-xs font-black text-stone-100">
        {getEventTypeLabel(event.type)}
      </span>
      <span className="mt-4 block text-xl font-black text-stone-50">{label}</span>
      <span className="mt-3 block text-sm leading-6 text-stone-200">{description}</span>
    </button>
  );
}

function RouteCard({ route, onChoose }: { route: StageRoute; onChoose: () => void }) {
  const rewardText =
    route.rewardOptionBonus > 0
      ? `戰後獎勵 +${route.rewardOptionBonus} 個選項`
      : "戰後獎勵維持 3 選 1";

  return (
    <button
      type="button"
      onClick={onChoose}
      className={`min-h-56 rounded-lg border p-4 text-left shadow-[0_16px_34px_rgba(0,0,0,0.34)] transition hover:-translate-y-1 ${getRouteButtonClass(route.id)}`}
    >
      <span className="rounded-full border border-white/25 bg-black/25 px-3 py-1 text-xs font-black text-stone-100">
        風險：{route.riskLevel}
      </span>
      <span className="mt-4 block text-2xl font-black text-stone-50">{route.name}</span>
      <span className="mt-3 block text-sm leading-6 text-stone-200">
        敵人體力 {formatModifier(route.enemyHpModifier)}
      </span>
      <span className="mt-1 block text-sm leading-6 text-stone-200">{rewardText}</span>
      <span className="mt-4 block text-sm leading-6 text-stone-300">{route.description}</span>
      <span className="mt-3 block text-xs leading-5 text-stone-400">{route.flavorText}</span>
    </button>
  );
}

function InfoPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-amber-700/40 bg-stone-950/80 p-4 text-sm text-stone-200 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
      <h2 className="font-black uppercase tracking-[0.16em] text-amber-200">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function getPlayerStatuses({
  heroId,
  slashUsedThisTurn,
  guardActive,
  wineBonus,
  enemyArmorBroken,
  phase,
}: {
  heroId: string;
  slashUsedThisTurn: boolean;
  guardActive: boolean;
  wineBonus: number;
  enemyArmorBroken: boolean;
  phase: string;
}) {
  const skillStatus = getSkillStatus(heroId, slashUsedThisTurn, phase);

  return [
    skillStatus,
    guardActive ? "固守中：下一次受到傷害 -1" : null,
    wineBonus > 0 ? `酒勢 +${wineBonus}` : null,
    enemyArmorBroken ? "破甲中" : null,
    phase === "defense" ? "等待防禦" : null,
  ].filter((status): status is string => Boolean(status));
}

function getSkillStatus(heroId: string, slashUsedThisTurn: boolean, phase: string) {
  if (heroId === "guan-yu") {
    return slashUsedThisTurn ? "已使用武聖" : "武聖待發";
  }

  if (heroId === "zhao-yun") {
    return "龍膽可用";
  }

  return phase === "observe" ? "觀星中" : "觀星已定";
}

function getEnemyStatuses({
  guarding,
  charged,
  phase,
  nextAction,
}: {
  guarding: boolean;
  charged: boolean;
  phase: string;
  nextAction: string;
}) {
  if (phase === "reward") {
    return ["戰後整備"];
  }

  if (phase === "route") {
    return ["等待選路"];
  }

  if (phase === "event") {
    return ["事件中"];
  }

  if (phase === "observe") {
    return ["等待觀星", `預告：${nextAction}`];
  }

  return [
    guarding ? "防守" : null,
    charged ? "蓄力" : null,
    phase === "defense" ? "攻擊中" : null,
    !guarding && !charged && phase === "player" ? "普通" : null,
    `預告：${nextAction}`,
  ].filter((status): status is string => Boolean(status));
}

function getUpgradeLabels(upgrades: PlayerUpgrades) {
  return [
    upgrades.maxHpBonus > 0 ? `最大體力 +${upgrades.maxHpBonus}` : null,
    upgrades.startingDrawBonus > 0
      ? `每關開始抽牌 +${upgrades.startingDrawBonus}`
      : null,
    upgrades.slashDamageBonus > 0 ? `斬傷害 +${upgrades.slashDamageBonus}` : null,
    upgrades.strategyDrawBonus > 0
      ? `兵書抽牌 +${upgrades.strategyDrawBonus}`
      : null,
    upgrades.armorBreakDamageBonus > 0
      ? `破甲後斬傷害額外 +${upgrades.armorBreakDamageBonus}`
      : null,
  ].filter((label): label is string => Boolean(label));
}

function getRewardStyleHint(rewardId: Reward["id"]) {
  if (rewardId === "max-health") {
    return "續航流";
  }

  if (rewardId === "starting-draw" || rewardId === "strategy-draw") {
    return "策略流";
  }

  return "攻擊流";
}

function getCardToast(cardName: string, heroId: string): Pick<EventToast, "text" | "tone"> {
  if (cardName === "青龍偃月刀" || cardName === "的盧馬" || cardName === "太平要術") {
    return { text: `裝備：${cardName}`, tone: "reward" };
  }

  if (cardName === "閃" && heroId === "zhao-yun") {
    return { text: "⚔ 龍膽！", tone: "attack" };
  }

  if (cardName === "斬") {
    return { text: "⚔ 斬！", tone: "attack" };
  }

  if (cardName === "酒") {
    return { text: "🍶 回復！", tone: "heal" };
  }

  if (cardName === "兵書") {
    return { text: "📜 抽牌！", tone: "strategy" };
  }

  if (cardName === "破甲") {
    return { text: "破甲！", tone: "attack" };
  }

  if (cardName === "連斬") {
    return { text: "⚔ 連斬！", tone: "attack" };
  }

  if (cardName === "固守") {
    return { text: "固守！", tone: "guard" };
  }

  if (cardName === "激勵") {
    return { text: "激勵！", tone: "heal" };
  }

  if (cardName === "火攻") {
    return { text: "火攻！", tone: "attack" };
  }

  return { text: "🛡 閃避！", tone: "guard" };
}

function getEquippedLabels(equippedItems: ReturnType<typeof createGame>["player"]["equippedItems"]) {
  return equippedItems.map((item) => {
    if (item.name === "青龍偃月刀") {
      return `青龍偃月刀：${equipmentEffects.greenDragonBlade}`;
    }

    if (item.name === "的盧馬") {
      return `的盧馬：${equipmentEffects.diluHorse}`;
    }

    return `太平要術：${equipmentEffects.taipingManual}`;
  });
}

function getDefenseButtonLabel(state: ReturnType<typeof createGame>) {
  const hasDodge = state.hand.some((card) => card.kind === "dodge");
  const hasSlash = state.hand.some((card) => card.kind === "attack");

  if (!hasDodge && hasSlash && state.player.heroId === "zhao-yun") {
    return "以斬作閃";
  }

  return "使用閃";
}

function getStageEntranceText(enemyName: string) {
  return enemyName === "呂布" ? "呂布現身" : `${enemyName}登場`;
}

function getEnemyTypeLabel(type: ReturnType<typeof createGame>["enemy"]["type"]) {
  if (type === "soldier") {
    return "小兵";
  }

  if (type === "elite") {
    return "精英";
  }

  return "Boss";
}

function getEventFrameClass(type: GameEvent["type"]) {
  if (type === "supply") {
    return "border-emerald-400/50 bg-emerald-950/55 text-emerald-50";
  }

  if (type === "strategy") {
    return "border-purple-400/50 bg-purple-950/55 text-purple-50";
  }

  return "border-red-400/60 bg-red-950/65 text-red-50";
}

function getEventButtonClass(type: GameEvent["type"]) {
  if (type === "supply") {
    return "border-emerald-300/50 bg-emerald-950/80 hover:border-emerald-100 hover:bg-emerald-900/70";
  }

  if (type === "strategy") {
    return "border-purple-300/50 bg-purple-950/80 hover:border-purple-100 hover:bg-purple-900/70";
  }

  return "border-red-300/60 bg-red-950/85 hover:border-red-100 hover:bg-red-900/75";
}

function getRouteButtonClass(routeId: StageRoute["id"]) {
  if (routeId === "mountain-path") {
    return "border-emerald-300/50 bg-emerald-950/80 hover:border-emerald-100 hover:bg-emerald-900/70";
  }

  if (routeId === "official-road") {
    return "border-amber-300/50 bg-amber-950/70 hover:border-amber-100 hover:bg-amber-900/60";
  }

  return "border-red-300/60 bg-red-950/85 hover:border-red-100 hover:bg-purple-950/80";
}

function formatModifier(value: number) {
  if (value > 0) {
    return `+${value}`;
  }

  return `${value}`;
}
