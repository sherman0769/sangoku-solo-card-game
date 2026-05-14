"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import BattleLog from "@/components/BattleLog";
import CardView from "@/components/CardView";
import { GameImage } from "@/components/GameImage";
import { VisualPlaceholder } from "@/components/VisualPlaceholder";
import { playCardSound } from "@/lib/game/cardSoundManifest";
import { equipmentEffects } from "@/lib/game/cards";
import {
  getBossTraitAlert,
  getBossTraitDescription,
  getBossTraitName,
} from "@/lib/game/bossTraits";
import {
  getEnemyCombatBadges,
  getEnemyDefeatedFeedbackText,
  getHpStatus,
  getPlayerCombatBadges,
} from "@/lib/game/combatStatus";
import {
  isAudioSupported,
  playSound,
  readSoundEnabledSetting,
  writeSoundEnabledSetting,
} from "@/lib/game/audio";
import {
  createBgmPlayer,
  getBgmEnabled,
  getBgmVolume,
  isBgmSupported,
  setBgmEnabled,
  setBgmVolume,
  type BgmPlayer,
} from "@/lib/game/bgm";
import {
  isVoiceSupported,
  playVoice,
  readVoiceEnabledSetting,
  writeVoiceEnabledSetting,
} from "@/lib/game/voice";
import { getSpeakerTypeLabel } from "@/lib/game/dialogues";
import { getEventTypeLabel } from "@/lib/game/events";
import {
  getChoicePhasePrompt,
  getEnemyDefeatedStampLabel,
  getMobileBottomActionHint,
  isChoicePhase,
} from "@/lib/game/mobileBattleUx";
import { getRouteEventTypeLabel } from "@/lib/game/routeEvents";
import {
  createGame,
  endTurn,
  getCurrentEnemyAction,
  playCard,
  resolveRouteEventOption,
  resolveEventOption,
  resolveDefense,
  selectObservation,
  selectReward,
  selectRoute,
} from "@/lib/game/engine";
import { heroes } from "@/lib/game/heroes";
import {
  currentVersionLabel,
  gameLoadingCopy,
  getPhaseHint,
  quickRules,
  routeSelectionCopy,
} from "@/lib/game/showcase";
import { totalStages } from "@/lib/game/stages";
import type { SoundCue } from "@/lib/game/sounds";
import type {
  DialogueLine,
  GameEvent,
  GameState,
  PlayerUpgrades,
  Reward,
  RouteEvent,
  StageRoute,
} from "@/lib/game/types";

interface EventToast {
  id: number;
  text: string;
  tone: "attack" | "guard" | "heal" | "strategy" | "reward" | "danger";
}

interface PanelFeedback {
  id: number;
  target: "player" | "enemy";
  tone: "hit" | "heal" | "boss";
  text: string;
}

interface BossTraitAlertState {
  id: number;
  title: string;
  subtitle: string;
  tone: "pressure" | "recovery";
}

interface DefeatedAlertState {
  id: number;
  text: string;
  boss: boolean;
}

interface StageNotice {
  id: number;
  title: string;
  subtitle: string;
}

export default function GameBoard({ initialHeroId }: { initialHeroId?: string }) {
  const [initialState, setInitialState] = useState<GameState | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;
    setInitialState(createGame(initialHeroId, { enemyRandom: Math.random }));
  }, [initialHeroId]);

  if (!initialState) {
    return <GameBoardLoading />;
  }

  return <GameBoardContent initialHeroId={initialHeroId} initialState={initialState} />;
}

function GameBoardLoading() {
  return (
    <main className="min-h-screen bg-[#140c09] bg-[radial-gradient(circle_at_top_left,rgba(127,29,29,0.34),transparent_34%),linear-gradient(135deg,#1b100b_0%,#2a120d_45%,#090605_100%)] px-4 py-8 text-stone-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center">
        <div className="w-full rounded-2xl border border-amber-700/45 bg-black/35 p-6 text-center shadow-[0_24px_70px_rgba(0,0,0,0.42)] sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">
            三國單騎傳
          </p>
          <h1 className="mt-4 text-3xl font-black text-amber-50 sm:text-4xl">
            {gameLoadingCopy.title}
          </h1>
          <p className="mt-4 text-sm font-bold leading-7 text-stone-300">
            {gameLoadingCopy.description}
          </p>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
            版本：{currentVersionLabel}
          </p>
        </div>
      </section>
    </main>
  );
}

function GameBoardContent({
  initialHeroId,
  initialState,
}: {
  initialHeroId?: string;
  initialState: GameState;
}) {
  const router = useRouter();
  const [state, setState] = useState(initialState);
  const [eventToast, setEventToast] = useState<EventToast | null>(null);
  const [panelFeedback, setPanelFeedback] = useState<PanelFeedback | null>(null);
  const [bossTraitAlert, setBossTraitAlert] = useState<BossTraitAlertState | null>(null);
  const [defeatedAlert, setDefeatedAlert] = useState<DefeatedAlertState | null>(null);
  const [stageNotice, setStageNotice] = useState<StageNotice | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [audioSupported, setAudioSupported] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [bgmEnabled, setBattleBgmEnabled] = useState(false);
  const [bgmSupported, setBattleBgmSupported] = useState(false);
  const [bgmVolume, setBattleBgmVolume] = useState(0.35);
  const eventTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bossTraitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const defeatedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const outcomeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastVoiceKeyRef = useRef<string | null>(null);
  const bgmPlayerRef = useRef<BgmPlayer | null>(null);
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
  const playerStatuses = getPlayerCombatBadges(state);
  const enemyStatuses = getEnemyCombatBadges(state, nextEnemyAction.label);
  const enemyBossTraitDetails = state.enemy.bossTraits.map(
    (traitId) => `Boss 特性｜${getBossTraitName(traitId)}：${getBossTraitDescription(traitId)}`,
  );
  const upgradeLabels = getUpgradeLabels(state.playerUpgrades);
  const equippedLabels = getEquippedLabels(state.player.equippedItems);
  const phaseHint = getPhaseHint(state.phase);
  const currentHero = heroes.find((hero) => hero.id === state.player.heroId) ?? heroes[0];
  const stageBackgroundSrc = state.stageConfig.backgroundImage.startsWith("/")
    ? state.stageConfig.backgroundImage
    : undefined;
  const activeBgmTrackId = state.enemy.id === "lu-bu" ? "boss-theme" : "battle-theme";
  const enemyDefeated = state.enemyHealth <= 0 || state.status === "won";
  const enemyDefeatedStamp = getEnemyDefeatedStampLabel(state.enemy.type === "boss");
  const choicePhasePrompt = getChoicePhasePrompt(state.phase);
  const mobileBottomActionHint = getMobileBottomActionHint(state.phase);
  const showMobileHand = state.phase === "player";
  const showMobileChoiceHint = isChoicePhase(state.phase);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAudioSupported(isAudioSupported());
      setSoundEnabled(readSoundEnabledSetting());
      setVoiceSupported(isVoiceSupported());
      setVoiceEnabled(readVoiceEnabledSetting());
      setBattleBgmSupported(isBgmSupported());
      setBattleBgmEnabled(getBgmEnabled());
      setBattleBgmVolume(getBgmVolume());
      bgmPlayerRef.current = createBgmPlayer();
    }, 0);

    return () => {
      window.clearTimeout(timer);
      bgmPlayerRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    const player = bgmPlayerRef.current ?? createBgmPlayer();
    bgmPlayerRef.current = player;
    player.setVolume(bgmVolume);

    if (!bgmEnabled) {
      player.stop();
      return;
    }

    player.play(activeBgmTrackId, { volume: bgmVolume });
  }, [activeBgmTrackId, bgmEnabled, bgmVolume]);

  useEffect(() => {
    const audioKey = state.currentDialogue?.audioKey;

    if (!voiceEnabled || !audioKey) {
      return;
    }

    const voiceKey = `${state.currentDialogue?.id}:${audioKey}`;

    if (lastVoiceKeyRef.current === voiceKey) {
      return;
    }

    lastVoiceKeyRef.current = voiceKey;
    playVoice(audioKey);
  }, [state.currentDialogue, voiceEnabled]);

  useEffect(() => {
    if (state.status === "won" || state.status === "lost") {
      if (outcomeTimerRef.current) {
        clearTimeout(outcomeTimerRef.current);
      }

      outcomeTimerRef.current = setTimeout(() => {
        router.push(`/result?outcome=${state.status}`);
      }, 1450);
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
    panelTimerRef.current = setTimeout(() => setPanelFeedback(null), tone === "boss" ? 980 : 760);
  }

  function showDefeatedAlert(enemyName: string, boss = false) {
    if (defeatedTimerRef.current) {
      clearTimeout(defeatedTimerRef.current);
    }

    setDefeatedAlert({
      id: nextFeedbackId(),
      text: getEnemyDefeatedFeedbackText(enemyName),
      boss,
    });
    defeatedTimerRef.current = setTimeout(() => setDefeatedAlert(null), boss ? 1750 : 1350);
  }

  function showBossTraitAlert(alert: BossTraitAlertState) {
    if (bossTraitTimerRef.current) {
      clearTimeout(bossTraitTimerRef.current);
    }

    setBossTraitAlert(alert);
    bossTraitTimerRef.current = setTimeout(() => setBossTraitAlert(null), 1500);
  }

  function emitSound(cue: SoundCue) {
    if (soundEnabled) {
      playSound(cue);
    }
  }

  function emitOutcomeSound(next: ReturnType<typeof createGame>) {
    if (next.status === "won") {
      emitSound("victory");
    }

    if (next.status === "lost") {
      emitSound("defeat");
    }
  }

  function emitBossTraitPresentation(
    previous: ReturnType<typeof createGame>,
    next: ReturnType<typeof createGame>,
  ) {
    const newTraitIds = next.bossTraitHistory.slice(previous.bossTraitHistory.length);

    newTraitIds.forEach((traitId) => {
      const alert = getBossTraitAlert(traitId);
      showBossTraitAlert({
        id: nextFeedbackId(),
        title: alert.title,
        subtitle: alert.subtitle,
        tone: traitId === "warlord-recovery" ? "recovery" : "pressure",
      });
      showPanelFeedback(
        "enemy",
        traitId === "warlord-recovery" ? "heal" : "boss",
        alert.feedbackText,
      );
      emitSound(alert.soundCue);
    });
  }

  function toggleSound() {
    const nextEnabled = !soundEnabled;
    setSoundEnabled(nextEnabled);
    writeSoundEnabledSetting(nextEnabled);

    if (nextEnabled) {
      playSound("reward");
    }
  }

  function toggleVoice() {
    const nextEnabled = !voiceEnabled;
    setVoiceEnabled(nextEnabled);
    writeVoiceEnabledSetting(nextEnabled);
  }

  function toggleBattleBgm() {
    const nextEnabled = !bgmEnabled;
    setBattleBgmEnabled(nextEnabled);
    setBgmEnabled(nextEnabled);
  }

  function handleBattleBgmVolumeChange(volume: number) {
    setBattleBgmVolume(volume);
    setBgmVolume(volume);
  }

  useEffect(() => {
    if (stageTimerRef.current) {
      clearTimeout(stageTimerRef.current);
    }

    feedbackIdRef.current += 1;
    setStageNotice({
      id: feedbackIdRef.current,
      title: `第 ${state.stageConfig.stage} 關｜${state.stageConfig.name}`,
      subtitle: getStageEntranceText(state.enemy.name),
    });
    stageTimerRef.current = setTimeout(() => setStageNotice(null), 1200);
  }, [state.enemy.name, state.stageConfig.name, state.stageConfig.stage]);

  useEffect(() => {
    return () => {
      if (eventTimerRef.current) {
        clearTimeout(eventTimerRef.current);
      }
      if (panelTimerRef.current) {
        clearTimeout(panelTimerRef.current);
      }
      if (bossTraitTimerRef.current) {
        clearTimeout(bossTraitTimerRef.current);
      }
      if (defeatedTimerRef.current) {
        clearTimeout(defeatedTimerRef.current);
      }
      if (outcomeTimerRef.current) {
        clearTimeout(outcomeTimerRef.current);
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
      playCardSound(card.id, { enabled: soundEnabled });

      if (next.enemyHealth < beforeEnemyHealth) {
        const enemyHpStatus = getHpStatus(next.enemyHealth, state.enemy.maxHealth);
        showPanelFeedback(
          "enemy",
          "hit",
          enemyHpStatus === "critical" ? "敵人重傷！" : "造成傷害",
        );
        emitSound("hit");
      }

      if (beforeEnemyHealth > 0 && next.enemyHealth <= 0) {
        showDefeatedAlert(state.enemy.name, state.enemy.type === "boss");
        showEventToast(getEnemyDefeatedFeedbackText(state.enemy.name), "reward");
        emitSound("victory");
      }

      if (next.player.health > beforePlayerHealth) {
        showPanelFeedback("player", "heal", "回復體力");
        emitSound("heal");
      }

      if (next.phase === "event") {
        emitSound("event");
      }
    }

    emitBossTraitPresentation(state, next);
    emitOutcomeSound(next);
    setState(next);
  }

  function handleEndTurn() {
    const beforePlayerHealth = state.player.health;
    const next = endTurn(state);

    if (next.player.health < beforePlayerHealth) {
      const text = next.player.health === 1 ? "瀕死！" : "受到傷害";
      showEventToast(text, "danger");
      showPanelFeedback("player", "hit", text);
      emitSound("hit");
    }

    if (state.phase !== "event" && next.phase === "event") {
      emitSound("event");
    }

    emitBossTraitPresentation(state, next);
    emitOutcomeSound(next);
    setState(next);
  }

  function handleResolveDefense(useDodge: boolean) {
    const beforePlayerHealth = state.player.health;
    const next = resolveDefense(state, useDodge);

    if (useDodge && next !== state) {
      showEventToast("🛡 閃避！", "guard");
      emitSound("dodge");
    }

    if (next.player.health < beforePlayerHealth) {
      const text = next.player.health === 1 ? "瀕死！" : "受到傷害";
      showEventToast(text, "danger");
      showPanelFeedback("player", "hit", text);
      emitSound("hit");
    }

    emitBossTraitPresentation(state, next);
    emitOutcomeSound(next);
    setState(next);
  }

  function handleSelectObservation(cardId: string) {
    const next = selectObservation(state, cardId);

    if (next !== state) {
      showEventToast("觀星入手！", "strategy");
      emitSound("draw");
    }

    setState(next);
  }

  function handleSelectReward(reward: Reward) {
    const beforePlayerHealth = state.player.health;
    const next = selectReward(state, reward.id);

    if (next !== state) {
      showEventToast(`獲得強化：${reward.name}`, "reward");
      emitSound("reward");

      if (next.player.health > beforePlayerHealth) {
        showPanelFeedback("player", "heal", "回復體力");
        emitSound("heal");
      }
    }

    setState(next);
  }

  function handleSelectRoute(route: StageRoute) {
    const next = selectRoute(state, route.id, { routeEventRandom: Math.random });

    if (next !== state) {
      showEventToast(`選擇路線：${route.name}`, route.id === "dangerous-pass" ? "danger" : "reward");
      emitSound("route");
    }

    setState(next);
  }

  function handleResolveRouteEvent(optionId: string) {
    const beforePlayerHealth = state.player.health;
    const beforeHandCount = state.hand.length;
    const beforeEquipmentCount = state.player.equippedItems.length;
    const eventName = state.currentRouteEvent?.name ?? "路線事件";
    const next = resolveRouteEventOption(state, optionId, {
      enemyRandom: Math.random,
      equipmentRandom: Math.random,
    });

    if (next !== state) {
      showEventToast(`${eventName}完成`, getRouteToastTone(state.selectedRoute?.id));
      emitSound("event");

      if (next.player.health > beforePlayerHealth) {
        showPanelFeedback("player", "heal", "回復體力");
        emitSound("heal");
      }

      if (next.player.health < beforePlayerHealth) {
        const text = next.player.health === 1 ? "瀕死！" : "受到傷害";
        showPanelFeedback("player", "hit", text);
        emitSound("hit");
      }

      if (next.hand.length > beforeHandCount) {
        showEventToast("📜 抽牌！", "strategy");
        emitSound("draw");
      }

      if (next.player.equippedItems.length > beforeEquipmentCount) {
        showEventToast("獲得裝備！", "reward");
        emitSound("reward");
      }

      if (next.enemy.id === "lu-bu") {
        emitSound("boss");
      }
    }

    emitOutcomeSound(next);
    setState(next);
  }

  function handleResolveEvent(optionId: string) {
    const beforePlayerHealth = state.player.health;
    const beforeHandCount = state.hand.length;
    const eventName = state.currentEvent?.name ?? "事件";
    const next = resolveEventOption(state, optionId);

    if (next !== state) {
      showEventToast(`${eventName}完成`, eventName === "伏兵突襲" ? "danger" : "strategy");
      emitSound("event");

      if (next.player.health > beforePlayerHealth) {
        showPanelFeedback("player", "heal", "回復體力");
        emitSound("heal");
      }

      if (next.player.health < beforePlayerHealth) {
        const text = next.player.health === 1 ? "瀕死！" : "受到傷害";
        showPanelFeedback("player", "hit", text);
        emitSound("hit");
      }

      if (next.hand.length > beforeHandCount) {
        showEventToast("📜 抽牌！", "strategy");
        emitSound("draw");
      }
    }

    emitOutcomeSound(next);
    setState(next);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#140c09] bg-[radial-gradient(circle_at_top_left,rgba(127,29,29,0.34),transparent_34%),linear-gradient(135deg,#1b100b_0%,#2a120d_45%,#090605_100%)] px-4 pb-[360px] pt-4 text-stone-100 sm:px-6 sm:py-5 lg:px-8">
      {eventToast ? <EventToastView key={eventToast.id} toast={eventToast} /> : null}
      <div className="mx-auto min-w-0 max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-3rem)] lg:max-w-7xl">
        <header className="rounded-xl border border-amber-700/40 bg-black/30 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur sm:flex sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="break-words text-xs font-bold uppercase leading-5 tracking-[0.18em] text-amber-300 sm:tracking-[0.22em]">
              {state.chapter.name} · 第 {state.enemyIndex + 1} 關 / {totalStages} ·
              第 {state.turn} 回合
            </p>
            <h1 className="mt-2 text-2xl font-black tracking-normal text-amber-50 sm:text-4xl">
              三國單騎傳
            </h1>
            <p className="mt-2 break-words text-sm leading-6 text-stone-300">
              <span className="sm:hidden">
                第 {state.stageConfig.stage} 關｜{state.stageConfig.name}
              </span>
              <span className="hidden sm:inline">
              第 {state.stageConfig.stage} 關｜{state.stageConfig.name}：{state.stageConfig.flavorText}
              </span>
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 sm:mt-0">
            <div className="hidden md:block">
              <SoundToggle
                enabled={soundEnabled}
                audioSupported={audioSupported}
                onToggle={toggleSound}
              />
            </div>
            <div className="hidden md:block">
              <VoiceToggle
                enabled={voiceEnabled}
                voiceSupported={voiceSupported}
                onToggle={toggleVoice}
              />
            </div>
            <div className="hidden md:block">
              <BgmToggle
                enabled={bgmEnabled}
                bgmSupported={bgmSupported}
                volume={bgmVolume}
                onToggle={toggleBattleBgm}
                onVolumeChange={handleBattleBgmVolumeChange}
              />
            </div>
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
            className="animate-fade-in mt-5 hidden rounded-xl border border-amber-300/50 bg-amber-950/45 p-4 text-center shadow-[0_18px_45px_rgba(0,0,0,0.35)] md:block"
          >
            <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-200">
              {stageNotice.title}
            </p>
            <h2 className="mt-1 text-2xl font-black text-amber-50">
              {stageNotice.subtitle}
            </h2>
          </section>
        ) : null}

            <MobileBattleHud
              enemyName={state.enemy.name}
              enemyType={getEnemyTypeLabel(state.enemy.type)}
              enemyHealth={`${state.enemyHealth}/${state.enemy.maxHealth}`}
              enemyStatuses={enemyStatuses}
              enemyPortrait={state.enemy.portrait.startsWith("/") ? state.enemy.portrait : undefined}
              enemyPrompt={state.enemy.visualPrompt}
              enemyFeedback={panelFeedback?.target === "enemy" ? panelFeedback : undefined}
              enemyDefeated={enemyDefeated}
              enemyDefeatedStamp={enemyDefeatedStamp}
              playerName={state.player.name}
              playerHealth={`${state.player.health}/${state.player.maxHealth}`}
              playerStatuses={playerStatuses}
              playerPortrait={currentHero.portrait}
              playerPrompt={currentHero.visualPrompt}
              playerFeedback={panelFeedback?.target === "player" ? panelFeedback : undefined}
            />

            <section className="mt-5 hidden rounded-xl border border-amber-400/45 bg-amber-950/30 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.28)] md:block">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-200">
            提示
          </p>
          <p className="mt-2 max-w-[300px] break-words text-sm leading-6 text-stone-100 sm:max-w-none">
            {phaseHint}
          </p>
        </section>

        <DialoguePanel dialogue={state.currentDialogue} />
        <BossTraitAlertOverlay alert={bossTraitAlert} />
        <DefeatedAlertOverlay alert={defeatedAlert} />

        {stageBackgroundSrc ? (
          <section className="relative mt-5 hidden overflow-hidden rounded-xl border border-sky-300/30 bg-stone-950/55 shadow-[0_18px_45px_rgba(0,0,0,0.28)] sm:block">
            <GameImage
              src={stageBackgroundSrc}
              alt={`${state.stageConfig.name}關卡背景`}
              variant="background"
              objectPosition={getStageObjectPosition(state.stageConfig.stage)}
              className="min-h-44 max-h-[360px] rounded-xl sm:min-h-56"
              imageClassName="object-cover"
              sizes="(min-width: 1024px) 896px, 100vw"
              fallbackType="stage"
              fallbackLabel={state.stageConfig.name}
              fallbackPrompt={state.stageConfig.visualPrompt}
              fallbackDescription="關卡背景圖 placeholder"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,5,4,0.9),rgba(8,5,4,0.58)_54%,rgba(8,5,4,0.22)),linear-gradient(0deg,rgba(8,5,4,0.84),rgba(8,5,4,0.16)_58%)]" />
            <div className="absolute inset-0 flex items-end">
              <div className="p-5 sm:p-6">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-100">
                  {state.chapter.name}
                </p>
                <h2 className="mt-2 text-2xl font-black text-amber-50">
                  第 {state.stageConfig.stage} 關｜{state.stageConfig.name}
                </h2>
                <p className="mt-3 max-w-[300px] text-sm leading-6 text-stone-200 sm:max-w-2xl">
                  {state.stageConfig.flavorText}
                </p>
              </div>
            </div>
          </section>
        ) : (
          <section className="mt-5 hidden gap-4 rounded-xl border border-sky-300/30 bg-stone-950/55 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.28)] sm:grid lg:grid-cols-[360px_minmax(0,1fr)]">
            <VisualPlaceholder
              type="stage"
              label={state.stageConfig.name}
              prompt={state.stageConfig.visualPrompt}
              description="關卡背景圖 placeholder"
            />
            <div className="self-center">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-100">
                {state.chapter.name}
              </p>
              <h2 className="mt-2 text-2xl font-black text-amber-50">
                第 {state.stageConfig.stage} 關｜{state.stageConfig.name}
              </h2>
              <p className="mt-3 text-sm leading-6 text-stone-300">
                {state.stageConfig.flavorText}
              </p>
            </div>
          </section>
        )}

        <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            <div className="hidden gap-5 md:grid md:grid-cols-2">
              <CombatantPanel
                tone="player"
                eyebrow="武將"
                title={state.player.name}
                badge={state.player.title}
                health={`♥ ${state.player.health} / ${state.player.maxHealth}`}
                percent={playerPercent}
                visualSrc={currentHero.portrait}
                visualType="hero"
                visualLabel={state.player.name}
                visualPrompt={currentHero.visualPrompt}
                visualObjectPosition={getHeroObjectPosition(state.player.heroId)}
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
                eyebrow={`第 ${state.stageConfig.stage} 關｜${state.stageConfig.name}`}
                title={state.enemy.name}
                badge={state.enemy.id === "lu-bu" ? "Boss" : "敵將"}
                health={`♥ ${state.enemyHealth} / ${state.enemy.maxHealth}`}
                percent={enemyPercent}
                visualSrc={state.enemy.portrait.startsWith("/") ? state.enemy.portrait : undefined}
                visualType="enemy"
                visualLabel={state.enemy.name}
                visualPrompt={state.enemy.visualPrompt}
                visualObjectPosition={getEnemyObjectPosition(state.enemy.id)}
                visualEmphasis={state.enemy.type === "boss"}
                defeated={enemyDefeated}
                defeatedStamp={enemyDefeatedStamp}
                details={[
                  `類型：${getEnemyTypeLabel(state.enemy.type)}`,
                  `特性：${state.enemy.traits.join("、")}`,
                  ...enemyBossTraitDetails,
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
              <section className="selectable-card-glow rounded-xl border border-purple-300/60 bg-purple-950/55 p-5 text-purple-50 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
                <ChoicePhaseHeader eyebrow="諸葛亮技能" title={choicePhasePrompt ?? "請選擇觀星牌"} />
                <h2 className="mt-2 text-2xl font-black">觀星</h2>
                <p className="mt-2 text-sm leading-6 text-purple-100">
                  選擇一張牌加入手牌，其餘放回牌堆底。選完後會再抽
                  {state.pendingObservation.drawCount} 張牌。
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {state.pendingObservation.cards.map((card) => (
                    <div key={card.id} className="selectable-card-glow choice-pulse rounded-lg">
                      <CardView
                        card={card}
                        onPlay={handleSelectObservation}
                      />
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {state.phase === "event" && state.currentEvent ? (
              <section className={`selectable-card-glow rounded-xl border p-5 shadow-[0_18px_45px_rgba(0,0,0,0.35)] ${getEventFrameClass(state.currentEvent.type)}`}>
                <ChoicePhaseHeader eyebrow="事件" title={choicePhasePrompt ?? "請處理事件"} />
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
                <div className="mt-5">
                  <VisualPlaceholder
                    type="event"
                    label={state.currentEvent.name}
                    prompt={state.currentEvent.visualPrompt}
                    description="事件圖 placeholder"
                  />
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
              <section className="hidden rounded-xl border border-red-500/60 bg-red-950/70 p-5 text-red-50 shadow-[0_18px_45px_rgba(0,0,0,0.35)] md:block">
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
              <section className="selectable-card-glow rounded-xl border border-purple-300/60 bg-purple-950/50 p-5 text-purple-50 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
                <ChoicePhaseHeader eyebrow="戰後獎勵" title={choicePhasePrompt ?? "請選擇一項戰後獎勵"} />
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
              <section className="selectable-card-glow rounded-xl border border-amber-300/60 bg-stone-950/70 p-5 text-stone-50 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
                <ChoicePhaseHeader eyebrow={routeSelectionCopy.title} title={choicePhasePrompt ?? "請選擇路線"} />
                <h2 className="mt-2 text-2xl font-black">選擇路線風格</h2>
                <p className="mt-2 text-sm leading-6 text-stone-300">
                  {routeSelectionCopy.description}
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

            {state.phase === "routeEvent" && state.currentRouteEvent && state.selectedRoute ? (
              <section className={`selectable-card-glow rounded-xl border p-5 shadow-[0_18px_45px_rgba(0,0,0,0.35)] ${getRouteEventFrameClass(state.selectedRoute.id)}`}>
                <ChoicePhaseHeader eyebrow="路線事件" title={choicePhasePrompt ?? "請處理路線事件"} />
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-black text-stone-200">
                      目前路線：{state.selectedRoute.name}
                    </p>
                    <p className="mt-1 text-sm font-bold text-amber-100">
                      路線風格：{state.selectedRoute.theme}｜{state.selectedRoute.focus}
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-stone-50">
                      {state.currentRouteEvent.name}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-stone-200">
                      {state.currentRouteEvent.description}
                    </p>
                    <p className="mt-3 rounded-md border border-white/15 bg-black/20 px-3 py-2 text-sm font-bold leading-6 text-stone-100">
                      {state.currentRouteEvent.flavorText}
                    </p>
                  </div>
                  <span className="inline-flex w-fit rounded-full border border-amber-200/50 bg-black/25 px-3 py-1 text-xs font-black text-amber-100">
                    {getRouteEventTypeLabel(state.currentRouteEvent.type)}
                  </span>
                </div>
                <div className="mt-5">
                  <GameImage
                    src={
                      state.currentRouteEvent.image.startsWith("/")
                        ? state.currentRouteEvent.image
                        : undefined
                    }
                    alt={`${state.currentRouteEvent.name}事件圖`}
                    variant="vertical"
                    className="mx-auto max-h-[220px] w-full max-w-[190px] rounded-md border border-white/10 sm:max-h-[420px] sm:max-w-[260px]"
                    imageClassName="object-cover"
                    sizes="(min-width: 768px) 260px, 75vw"
                    fallbackType="event"
                    fallbackLabel={state.currentRouteEvent.name}
                    fallbackPrompt={state.selectedRoute.visualPrompt}
                    fallbackDescription="路線事件圖 placeholder"
                  />
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {state.currentRouteEvent.options.map((option) => (
                    <RouteEventOptionCard
                      key={option.id}
                      routeId={state.selectedRoute!.id}
                      optionId={option.id}
                      label={option.label}
                      description={option.description}
                      eventType={state.currentRouteEvent!.type}
                      onChoose={handleResolveRouteEvent}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            <section className="bottom-action-safe-area fixed inset-x-0 bottom-0 z-40 border-t border-amber-700/50 bg-stone-950/95 p-3 shadow-[0_-18px_45px_rgba(0,0,0,0.45)] backdrop-blur md:static md:rounded-xl md:border md:border-amber-700/40 md:bg-black/25 md:p-4 md:shadow-[0_18px_45px_rgba(0,0,0,0.3)] md:backdrop-blur-none">
              <div className="mx-auto max-w-7xl md:mx-0 md:max-w-none">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-black text-amber-50 sm:text-xl">
                      {showMobileChoiceHint ? "目前選擇" : "手牌"}
                    </h2>
                    <p className="text-xs font-bold text-stone-400 md:hidden">
                      {state.phase === "player"
                        ? `士氣 ${state.player.morale}/${state.player.maxMorale}`
                        : mobileBottomActionHint}
                    </p>
                  </div>
                  {state.phase === "defense" && state.pendingDefense ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleResolveDefense(true)}
                        className="h-10 rounded-md bg-sky-600 px-4 text-sm font-black text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        {getDefenseButtonLabel(state)}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResolveDefense(false)}
                        className="h-10 rounded-md border border-red-300/70 px-4 text-sm font-black text-red-50 transition hover:bg-red-800"
                      >
                        承受傷害
                      </button>
                    </div>
                  ) : showMobileChoiceHint ? (
                    <span className="hidden rounded-md border border-amber-300/50 bg-amber-500/15 px-4 py-2 text-sm font-black text-amber-50 md:inline-flex">
                      {choicePhasePrompt}
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={state.status !== "playing" || state.phase !== "player"}
                      onClick={handleEndTurn}
                      className="h-10 rounded-md bg-amber-500 px-5 text-sm font-black text-stone-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-stone-700 disabled:text-stone-400 sm:h-11"
                    >
                      結束回合
                    </button>
                  )}
                </div>
                {showMobileChoiceHint ? (
                  <p className="choice-pulse mt-3 rounded-md border border-amber-300/55 bg-amber-500/15 px-3 py-2 text-sm font-black text-amber-50 md:hidden">
                    請選擇一項繼續
                  </p>
                ) : null}
                <div className={`${showMobileHand ? "mt-3 flex" : "hidden md:grid"} -mx-3 gap-3 overflow-x-auto px-3 pb-2 md:mx-0 md:mt-4 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-3`}>
                  {state.hand.map((card) => (
                    <div key={card.id} className="w-40 shrink-0 md:w-auto">
                      <CardView
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
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="space-y-5 lg:hidden">
              <BattleLog entries={state.log} />
              <MobileStatusSettings
                audioSupported={audioSupported}
                battleLines={[
                  `章節：${state.chapter.name}`,
                  `關卡：${state.stageConfig.name}`,
                  `牌庫 ${state.deck.length} 張 / 棄牌 ${state.discard.length} 張`,
                  state.selectedRoute ? `目前路線：${state.selectedRoute.name}` : null,
                  state.rewardOptionBonus > 0
                    ? `下一次戰後獎勵 +${state.rewardOptionBonus} 個選項`
                    : null,
                ]}
                equippedLabels={equippedLabels}
                onToggleSound={toggleSound}
                onToggleVoice={toggleVoice}
                onToggleBgm={toggleBattleBgm}
                onBgmVolumeChange={handleBattleBgmVolumeChange}
                quickRulesList={quickRules}
                soundEnabled={soundEnabled}
                upgradeLabels={upgradeLabels}
                voiceEnabled={voiceEnabled}
                voiceSupported={voiceSupported}
                bgmEnabled={bgmEnabled}
                bgmSupported={bgmSupported}
                bgmVolume={bgmVolume}
              />
            </div>
          </div>

          <div className="hidden space-y-5 lg:block">
            <BattleLog entries={state.log} />
            <InfoPanel title="快速規則">
              <ul className="space-y-2 text-sm leading-6 text-stone-200">
                {quickRules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </InfoPanel>
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
              <p>
                目前第 {state.enemyIndex + 1} 關，共 {totalStages} 關
              </p>
              <p className="mt-2">章節：{state.chapter.name}</p>
              <p className="mt-2">關卡：{state.stageConfig.name}</p>
              <p className="mt-2">關卡敘事：{state.stageConfig.flavorText}</p>
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
          版本：{currentVersionLabel}
        </footer>
      </div>
    </main>
  );
}

function DialoguePanel({ dialogue }: { dialogue?: DialogueLine }) {
  const speakerTypeLabel = dialogue ? getSpeakerTypeLabel(dialogue.speakerType) : "旁白";

  return (
    <section className="mt-3 rounded-xl border border-amber-300/45 bg-stone-950/70 p-3 shadow-[0_18px_45px_rgba(0,0,0,0.28)] sm:mt-5 sm:p-4">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-amber-300/50 bg-amber-500/15 text-lg font-black text-amber-100 sm:flex">
          {dialogue?.speakerName.slice(0, 1) ?? "旁"}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-amber-300/45 bg-black/30 px-3 py-1 text-xs font-black text-amber-100">
              {speakerTypeLabel}
            </span>
            <h2 className="text-sm font-black text-amber-50">
              {dialogue?.speakerName ?? "戰場旁白"}
            </h2>
            {dialogue?.tone ? (
              <span className="text-xs font-bold text-stone-400">{dialogue.tone}</span>
            ) : null}
          </div>
          <p className="mt-2 break-words text-sm font-bold leading-6 text-stone-100 sm:mt-3 sm:text-base sm:leading-7">
            {dialogue?.text ?? "戰場寂靜，等待下一步行動。"}
          </p>
        </div>
      </div>
    </section>
  );
}

function MobileBattleHud({
  enemyName,
  enemyType,
  enemyHealth,
  enemyStatuses,
  enemyPortrait,
  enemyPrompt,
  enemyFeedback,
  enemyDefeated,
  enemyDefeatedStamp,
  playerName,
  playerHealth,
  playerStatuses,
  playerPortrait,
  playerPrompt,
  playerFeedback,
}: {
  enemyName: string;
  enemyType: string;
  enemyHealth: string;
  enemyStatuses: string[];
  enemyPortrait?: string;
  enemyPrompt?: string;
  enemyFeedback?: PanelFeedback;
  enemyDefeated: boolean;
  enemyDefeatedStamp: string;
  playerName: string;
  playerHealth: string;
  playerStatuses: string[];
  playerPortrait?: string;
  playerPrompt?: string;
  playerFeedback?: PanelFeedback;
}) {
  return (
    <section className="mt-5 grid gap-3 md:hidden">
      <MobileHudRow
        tone="enemy"
        eyebrow={`敵人｜${enemyType}`}
        title={enemyName}
        health={enemyHealth}
        statuses={enemyStatuses}
        portrait={enemyPortrait}
        visualLabel={enemyName}
        visualPrompt={enemyPrompt}
        feedback={enemyFeedback}
        defeated={enemyDefeated}
        defeatedStamp={enemyDefeatedStamp}
      />
      <MobileHudRow
        tone="player"
        eyebrow="武將"
        title={playerName}
        health={playerHealth}
        statuses={playerStatuses}
        portrait={playerPortrait}
        visualLabel={playerName}
        visualPrompt={playerPrompt}
        feedback={playerFeedback}
      />
    </section>
  );
}

function BossTraitAlertOverlay({ alert }: { alert: BossTraitAlertState | null }) {
  if (!alert) {
    return null;
  }

  const toneClass =
    alert.tone === "recovery"
      ? "border-amber-200/75 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.34),rgba(127,29,29,0.72)_52%,rgba(8,5,4,0.92))] text-amber-50 shadow-[0_0_60px_rgba(251,191,36,0.28)]"
      : "border-red-200/75 bg-[radial-gradient(circle_at_center,rgba(248,113,113,0.32),rgba(127,29,29,0.76)_52%,rgba(8,5,4,0.94))] text-red-50 shadow-[0_0_60px_rgba(248,113,113,0.3)]";

  return (
    <div
      key={alert.id}
      className="pointer-events-none fixed inset-x-4 top-[31vh] z-40 flex justify-center sm:top-[38vh]"
      aria-live="polite"
    >
      <div className={`animate-boss-alert-pop min-w-[250px] max-w-[90vw] rounded-xl border px-6 py-5 text-center ${toneClass}`}>
        <p className="animate-boss-alert-pulse text-3xl font-black tracking-[0.08em] sm:text-5xl">
          {alert.title}
        </p>
        <p className="mt-3 text-sm font-black text-stone-100 sm:text-base">
          {alert.subtitle}
        </p>
      </div>
    </div>
  );
}

function DefeatedAlertOverlay({ alert }: { alert: DefeatedAlertState | null }) {
  if (!alert) {
    return null;
  }

  const toneClass = alert.boss
    ? "border-red-200/80 bg-[radial-gradient(circle_at_center,rgba(248,113,113,0.34),rgba(69,10,10,0.88)_56%,rgba(8,5,4,0.95))] text-red-50 shadow-[0_0_64px_rgba(248,113,113,0.34)]"
    : "border-amber-200/75 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.32),rgba(120,53,15,0.78)_56%,rgba(8,5,4,0.94))] text-amber-50 shadow-[0_0_56px_rgba(251,191,36,0.26)]";

  return (
    <div
      key={alert.id}
      className="pointer-events-none fixed inset-x-4 top-[32vh] z-40 flex justify-center"
      aria-live="polite"
    >
      <div className={`animate-defeated-pop min-w-[240px] max-w-[90vw] rounded-xl border px-6 py-5 text-center ${toneClass}`}>
        <p className="text-3xl font-black tracking-[0.08em] sm:text-5xl">{alert.text}</p>
        <p className="mt-3 text-sm font-bold text-stone-100">戰場局勢已定</p>
      </div>
    </div>
  );
}

function MobileHudRow({
  tone,
  eyebrow,
  title,
  health,
  statuses,
  portrait,
  visualLabel,
  visualPrompt,
  feedback,
  defeated = false,
  defeatedStamp,
}: {
  tone: "enemy" | "player";
  eyebrow: string;
  title: string;
  health: string;
  statuses: string[];
  portrait?: string;
  visualLabel: string;
  visualPrompt?: string;
  feedback?: PanelFeedback;
  defeated?: boolean;
  defeatedStamp?: string;
}) {
  const toneClass =
    tone === "enemy"
      ? "border-red-400/45 bg-red-950/40"
      : "border-emerald-400/45 bg-emerald-950/35";
  const hpClass = tone === "enemy" ? "text-red-100" : "text-emerald-100";

  const feedbackClass =
    feedback?.tone === "heal"
      ? "animate-pulse-heal"
      : feedback?.tone === "boss"
        ? "animate-boss-panel-flash animate-shake-hit"
        : feedback
          ? "animate-damage-flash animate-shake-hit"
          : "";

  const defeatedClass = defeated ? "opacity-75" : "";
  const visualDefeatedClass = defeated ? "defeated-grayscale" : "";

  return (
    <div className={`relative rounded-xl border p-3 shadow-[0_14px_34px_rgba(0,0,0,0.28)] ${toneClass} ${feedbackClass} ${defeatedClass}`}>
      {feedback ? (
        <span
          key={feedback.id}
          className="absolute right-3 top-3 rounded-full border border-red-200/70 bg-red-500/25 px-2 py-0.5 text-[11px] font-black text-red-50"
        >
          {feedback.text}
        </span>
      ) : null}
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <GameImage
            src={portrait}
            alt={`${visualLabel}立繪`}
            variant="portrait"
            objectPosition="50% 22%"
            className={`h-16 w-14 rounded-md border border-white/10 sm:h-20 sm:w-16 ${visualDefeatedClass}`}
            imageClassName="object-cover"
            sizes="64px"
            fallbackType={tone === "enemy" ? "enemy" : "hero"}
            fallbackLabel={visualLabel}
            fallbackPrompt={visualPrompt}
            fallbackCompact
          />
          {defeated && defeatedStamp ? (
            <span className="defeated-stamp absolute inset-x-1 top-1/2 -translate-y-1/2 text-center text-xs font-black tracking-[0.14em] text-red-50">
              {defeatedStamp}
            </span>
          ) : null}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-amber-200">
            {eyebrow}
          </p>
          <h2 className="mt-1 truncate text-xl font-black text-stone-50">{title}</h2>
        </div>
        <p className={`ml-auto shrink-0 text-lg font-black ${hpClass}`}>♥ {health}</p>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {statuses.map((status) => (
          <span
            key={status}
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${getStatusBadgeClass(status)}`}
          >
            {status}
          </span>
        ))}
      </div>
    </div>
  );
}

function MobileStatusSettings({
  audioSupported,
  battleLines,
  bgmEnabled,
  bgmSupported,
  bgmVolume,
  equippedLabels,
  onBgmVolumeChange,
  onToggleBgm,
  onToggleSound,
  onToggleVoice,
  quickRulesList,
  soundEnabled,
  upgradeLabels,
  voiceEnabled,
  voiceSupported,
}: {
  audioSupported: boolean;
  battleLines: Array<string | null>;
  bgmEnabled: boolean;
  bgmSupported: boolean;
  bgmVolume: number;
  equippedLabels: string[];
  onBgmVolumeChange: (volume: number) => void;
  onToggleBgm: () => void;
  onToggleSound: () => void;
  onToggleVoice: () => void;
  quickRulesList: readonly string[];
  soundEnabled: boolean;
  upgradeLabels: string[];
  voiceEnabled: boolean;
  voiceSupported: boolean;
}) {
  return (
    <details className="rounded-lg border border-amber-700/40 bg-stone-950/80 p-4 text-stone-100 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
      <summary className="cursor-pointer text-sm font-black uppercase tracking-[0.16em] text-amber-200">
        狀態與設定
      </summary>
      <div className="mt-4 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <SoundToggle
            enabled={soundEnabled}
            audioSupported={audioSupported}
            onToggle={onToggleSound}
          />
          <VoiceToggle
            enabled={voiceEnabled}
            voiceSupported={voiceSupported}
            onToggle={onToggleVoice}
          />
          <BgmToggle
            enabled={bgmEnabled}
            bgmSupported={bgmSupported}
            volume={bgmVolume}
            onToggle={onToggleBgm}
            onVolumeChange={onBgmVolumeChange}
          />
        </div>
        <MobileInfoBlock title="目前強化">
          {upgradeLabels.length > 0 ? (
            <ul className="space-y-2">
              {upgradeLabels.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          ) : (
            <p>尚未獲得強化</p>
          )}
        </MobileInfoBlock>
        <MobileInfoBlock title="已裝備">
          {equippedLabels.length > 0 ? (
            <ul className="space-y-2">
              {equippedLabels.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          ) : (
            <p>尚未裝備</p>
          )}
        </MobileInfoBlock>
        <MobileInfoBlock title="快速規則">
          <ul className="space-y-2">
            {quickRulesList.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </MobileInfoBlock>
        <MobileInfoBlock title="戰局">
          <ul className="space-y-2">
            {battleLines.filter((line): line is string => Boolean(line)).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </MobileInfoBlock>
      </div>
    </details>
  );
}

function MobileInfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-stone-700/70 bg-black/25 p-3 text-sm leading-6 text-stone-200">
      <h3 className="text-xs font-black uppercase tracking-[0.14em] text-amber-100">{title}</h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function SoundToggle({
  enabled,
  audioSupported,
  onToggle,
}: {
  enabled: boolean;
  audioSupported: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="min-w-[150px] rounded-md border border-amber-600/50 bg-stone-950/60 px-3 py-2">
      <button
        type="button"
        onClick={onToggle}
        className={`h-9 w-full rounded-md px-3 text-sm font-black transition ${
          enabled
            ? "bg-amber-400 text-stone-950 hover:bg-amber-300"
            : "border border-stone-600 bg-stone-950/70 text-stone-100 hover:border-amber-400"
        }`}
      >
        音效：{enabled ? "開" : "關"}
      </button>
      <p className="mt-1 text-[11px] leading-4 text-stone-400">
        {audioSupported
          ? "音效需手動開啟，避免瀏覽器自動播放限制。"
          : "此瀏覽器不支援 Web Audio。"}
      </p>
    </div>
  );
}

function VoiceToggle({
  enabled,
  voiceSupported,
  onToggle,
}: {
  enabled: boolean;
  voiceSupported: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="min-w-[180px] rounded-md border border-purple-500/50 bg-stone-950/60 px-3 py-2">
      <button
        type="button"
        onClick={onToggle}
        className={`h-9 w-full rounded-md px-3 text-sm font-black transition ${
          enabled
            ? "bg-purple-300 text-stone-950 hover:bg-purple-200"
            : "border border-stone-600 bg-stone-950/70 text-stone-100 hover:border-purple-300"
        }`}
      >
        語音：{enabled ? "開" : "關"}
      </button>
      <p className="mt-1 text-[11px] leading-4 text-stone-400">
        {voiceSupported
          ? "已導入部分角色語音；開啟語音後，部分登場台詞會播放。"
          : "此瀏覽器不支援語音播放。"}
      </p>
    </div>
  );
}

function BgmToggle({
  bgmSupported,
  enabled,
  onToggle,
  onVolumeChange,
  volume,
}: {
  bgmSupported: boolean;
  enabled: boolean;
  onToggle: () => void;
  onVolumeChange: (volume: number) => void;
  volume: number;
}) {
  return (
    <div className="min-w-[190px] rounded-md border border-emerald-500/50 bg-stone-950/60 px-3 py-2">
      <button
        type="button"
        onClick={onToggle}
        className={`h-9 w-full rounded-md px-3 text-sm font-black transition ${
          enabled
            ? "bg-emerald-300 text-stone-950 hover:bg-emerald-200"
            : "border border-stone-600 bg-stone-950/70 text-stone-100 hover:border-emerald-300"
        }`}
      >
        BGM：{enabled ? "開" : "關"}
      </button>
      <label className="mt-2 block text-[11px] font-bold leading-4 text-stone-300">
        音量 {Math.round(volume * 100)}%
        <input
          aria-label="戰鬥 BGM 音量"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(event) => onVolumeChange(Number(event.target.value))}
          className="mt-1 block w-full accent-emerald-300"
        />
      </label>
      <p className="mt-1 text-[11px] leading-4 text-stone-400">
        {bgmSupported
          ? "背景音樂獨立控制，Boss 戰會自動切換。"
          : "此瀏覽器不支援背景音樂播放。"}
      </p>
    </div>
  );
}

function CombatantPanel({
  tone,
  eyebrow,
  title,
  badge,
  health,
  percent,
  visualSrc,
  visualType,
  visualLabel,
  visualPrompt,
  visualObjectPosition = "50% 24%",
  visualEmphasis = false,
  defeated = false,
  defeatedStamp,
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
  visualSrc?: string;
  visualType: "hero" | "enemy";
  visualLabel: string;
  visualPrompt?: string;
  visualObjectPosition?: string;
  visualEmphasis?: boolean;
  defeated?: boolean;
  defeatedStamp?: string;
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
  const visualFrameClass = visualEmphasis
    ? "rounded-md border border-red-200/70 shadow-[0_0_34px_rgba(248,113,113,0.24)] ring-2 ring-red-500/30"
    : "rounded-md border border-white/10";
  const criticalClass = statuses.some((status) => status === "瀕死" || status === "重傷")
    ? "animate-critical-pulse"
    : "";
  const defeatedClass = defeated ? "opacity-75" : "";
  const visualDefeatedClass = defeated ? "defeated-grayscale" : "";

  const feedbackClass =
    feedback?.tone === "heal"
      ? "animate-pulse-heal"
      : feedback?.tone === "boss"
        ? "animate-boss-panel-flash animate-shake-hit"
        : feedback
          ? "animate-shake-hit animate-damage-flash animate-pulse-hit"
          : "";

  return (
    <section className={`relative rounded-xl border p-5 shadow-[0_18px_45px_rgba(0,0,0,0.35)] ${frameClass} ${feedbackClass} ${criticalClass} ${defeatedClass}`}>
      {feedback ? (
        <div
          key={feedback.id}
          className={`pointer-events-none absolute right-4 top-4 rounded-full border px-3 py-1 text-xs font-black ${
            feedback.tone === "heal"
              ? "border-emerald-200/70 bg-emerald-500/25 text-emerald-50"
              : feedback.tone === "boss"
                ? "border-amber-200/80 bg-red-500/35 text-amber-50"
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
      <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(120px,38%)_1fr] sm:items-start">
        <div className="relative mx-auto w-full max-w-[230px] sm:max-w-none">
          <GameImage
            src={visualSrc}
            alt={`${visualLabel}立繪`}
            variant="portrait"
            objectPosition={visualObjectPosition}
            className={`max-h-[300px] w-full sm:max-h-[320px] ${visualFrameClass} ${visualDefeatedClass}`}
            imageClassName="object-cover"
            sizes="(min-width: 1024px) 180px, (min-width: 768px) 38vw, 230px"
            fallbackType={visualType}
            fallbackLabel={visualLabel}
            fallbackPrompt={visualPrompt}
            fallbackCompact
          />
          {defeated && defeatedStamp ? (
            <span className="defeated-stamp absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 text-2xl font-black tracking-[0.16em] text-red-50">
              {defeatedStamp}
            </span>
          ) : null}
        </div>
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-4">
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
                className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusBadgeClass(status)}`}
              >
                {status}
              </span>
            ))}
          </div>
        </div>
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

function getHeroObjectPosition(heroId: string) {
  if (heroId === "guan-yu") {
    return "50% 18%";
  }

  if (heroId === "zhuge-liang") {
    return "50% 16%";
  }

  return "50% 24%";
}

function getEnemyObjectPosition(enemyId: string) {
  if (enemyId === "lu-bu") {
    return "50% 16%";
  }

  if (enemyId === "xiliang-cavalry") {
    return "50% 30%";
  }

  return "50% 22%";
}

function getStageObjectPosition(stage: number) {
  if (stage === 8) {
    return "50% 46%";
  }

  return "50% 50%";
}

function ChoicePhaseHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="choice-pulse rounded-lg border border-amber-200/45 bg-amber-500/12 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-2xl font-black text-amber-50">{title}</h2>
    </div>
  );
}

function RewardCard({ reward, onChoose }: { reward: Reward; onChoose: () => void }) {
  return (
    <button
      type="button"
      onClick={onChoose}
      className="selectable-card-glow choice-pulse min-h-44 rounded-lg border border-amber-200/70 bg-stone-950/80 p-4 text-left shadow-[0_16px_34px_rgba(0,0,0,0.34)] transition hover:-translate-y-1 hover:border-amber-100 hover:bg-purple-900/60 active:scale-[0.98]"
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
      className={`selectable-card-glow choice-pulse min-h-36 rounded-lg border p-4 text-left shadow-[0_16px_34px_rgba(0,0,0,0.34)] transition hover:-translate-y-1 active:scale-[0.98] ${getEventButtonClass(event.type)}`}
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
  return (
    <button
      type="button"
      onClick={onChoose}
      className={`selectable-card-glow choice-pulse min-h-56 rounded-lg border p-4 text-left shadow-[0_16px_34px_rgba(0,0,0,0.34)] transition hover:-translate-y-1 active:scale-[0.98] ${getRouteButtonClass(route.id)}`}
    >
      <GameImage
        src={route.image.startsWith("/") ? route.image : undefined}
        alt={`${route.name}路線圖`}
        variant="card"
        className="max-h-32 rounded-md border border-white/10 sm:max-h-36"
        imageClassName="object-cover"
        sizes="(min-width: 768px) 280px, 100vw"
        fallbackType="route"
        fallbackLabel={route.name}
        fallbackPrompt={route.visualPrompt}
        fallbackCompact
      />
      <span className="mt-4 inline-flex rounded-full border border-white/25 bg-black/25 px-3 py-1 text-xs font-black text-stone-100">
        {route.theme}
      </span>
      <span className="mt-4 block text-2xl font-black text-stone-50">{route.name}</span>
      <span className="mt-3 block text-sm leading-6 text-stone-200">
        主要方向：{route.focus}
      </span>
      <span className="mt-1 block text-sm leading-6 text-stone-200">
        適合情境：{route.playStyle}
      </span>
      <span className="mt-1 block text-sm leading-6 text-stone-200">
        選擇後會觸發專屬路線事件。
      </span>
      <span className="mt-4 block text-sm leading-6 text-stone-300">{route.description}</span>
      <span className="mt-3 block text-xs leading-5 text-stone-400">{route.flavorText}</span>
    </button>
  );
}

function RouteEventOptionCard({
  routeId,
  optionId,
  label,
  description,
  eventType,
  onChoose,
}: {
  routeId: StageRoute["id"];
  optionId: string;
  label: string;
  description: string;
  eventType: RouteEvent["type"];
  onChoose: (optionId: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChoose(optionId)}
      className={`selectable-card-glow choice-pulse min-h-36 rounded-lg border p-4 text-left shadow-[0_16px_34px_rgba(0,0,0,0.34)] transition hover:-translate-y-1 active:scale-[0.98] ${getRouteEventButtonClass(routeId)}`}
    >
      <span className="rounded-full border border-white/25 bg-black/25 px-3 py-1 text-xs font-black text-stone-100">
        遭遇事件｜{getRouteEventTypeLabel(eventType)}
      </span>
      <span className="mt-4 block text-xl font-black text-stone-50">{label}</span>
      <span className="mt-3 block text-sm leading-6 text-stone-200">{description}</span>
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

function getStatusBadgeClass(status: string) {
  if (status === "瀕死" || status === "重傷") {
    return "animate-status-badge-pulse border-red-200/70 bg-red-500/25 text-red-50";
  }

  if (status === "受創" || status === "受到傷害") {
    return "border-orange-200/60 bg-orange-500/20 text-orange-50";
  }

  if (status === "固守中" || status === "防守中") {
    return "border-sky-200/60 bg-sky-500/18 text-sky-50";
  }

  if (status === "蓄力中" || status === "Boss" || status.includes("觸發")) {
    return "border-amber-200/70 bg-amber-500/20 text-amber-50";
  }

  if (status === "破甲中" || status === "武聖已用" || status === "觀星") {
    return "border-purple-200/60 bg-purple-500/18 text-purple-50";
  }

  return "border-amber-300/30 bg-black/25 text-amber-100";
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

function getRouteEventFrameClass(routeId: StageRoute["id"]) {
  if (routeId === "mountain-path") {
    return "border-emerald-300/50 bg-emerald-950/65 text-emerald-50";
  }

  if (routeId === "official-road") {
    return "border-amber-300/50 bg-amber-950/60 text-amber-50";
  }

  return "border-red-300/60 bg-red-950/75 text-red-50";
}

function getRouteEventButtonClass(routeId: StageRoute["id"]) {
  if (routeId === "mountain-path") {
    return "border-emerald-300/50 bg-emerald-950/85 hover:border-emerald-100 hover:bg-emerald-900/70";
  }

  if (routeId === "official-road") {
    return "border-amber-300/50 bg-amber-950/80 hover:border-amber-100 hover:bg-amber-900/70";
  }

  return "border-red-300/60 bg-red-950/85 hover:border-red-100 hover:bg-red-900/75";
}

function getRouteToastTone(routeId?: StageRoute["id"]): EventToast["tone"] {
  if (routeId === "dangerous-pass") {
    return "danger";
  }

  if (routeId === "official-road") {
    return "strategy";
  }

  return "reward";
}
