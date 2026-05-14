"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GameImage } from "@/components/GameImage";
import { InstallPrompt } from "@/components/InstallPrompt";
import { OpeningVideo } from "@/components/OpeningVideo";
import { ShareGameButton } from "@/components/ShareGameButton";
import {
  getSharedBgmPlayer,
  getBgmPlaybackFailureMessage,
  getBgmEnabled,
  getBgmVolume,
  isBgmSupported,
  setBgmEnabled,
  setBgmActivated,
  setBgmPlaybackStateFromResult,
  setBgmVolume,
  shouldAutoResumeStoredBgm,
  type BgmPlayer,
} from "@/lib/game/bgm";
import { playSound } from "@/lib/game/audio";
import { getHeroDialogue } from "@/lib/game/dialogues";
import { heroes } from "@/lib/game/heroes";
import { getOpeningVideoConfig } from "@/lib/game/openingVideo";
import {
  getHeroPreviewAudioKey,
  getHeroStartLabel,
  homeHeroPreviewCopy,
  homeHeroSelectionCopy,
  homeAuthorCopy,
  homeCollapsibleSections,
  currentVersionLabel,
  howToSteps,
} from "@/lib/game/showcase";
import { chapterOne } from "@/lib/game/stages";
import {
  isVoiceSupported,
  playVoice,
  readVoiceEnabledSetting,
  writeVoiceEnabledSetting,
} from "@/lib/game/voice";
import { VISUAL_ASSET_MANIFEST } from "@/lib/game/visualAssetManifest";

export default function Home() {
  const [selectedHeroId, setSelectedHeroId] = useState("guan-yu");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [bgmEnabled, setHomeBgmEnabled] = useState(false);
  const [bgmSupported, setHomeBgmSupported] = useState(false);
  const [bgmVolume, setHomeBgmVolume] = useState(0.35);
  const [bgmPlaybackMessage, setHomeBgmPlaybackMessage] = useState<string | null>(null);
  const homeBgmPlayerRef = useRef<BgmPlayer | null>(null);
  const shouldResumeBgmAfterVideoRef = useRef(false);
  const selectedHero = heroes.find((hero) => hero.id === selectedHeroId) ?? heroes[0];
  const homeHeroImage = VISUAL_ASSET_MANIFEST.find((asset) => asset.id === "home-hero")?.path;
  const openingVideo = getOpeningVideoConfig();
  const selectedHeroStartHref = `/game?hero=${selectedHeroId}`;
  const selectedHeroStartLabel = getHeroStartLabel(selectedHero.name);
  const selectedHeroPreviewDialogue = getHeroDialogue(selectedHero.id, "hero_preview");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVoiceSupported(isVoiceSupported());
      setVoiceEnabled(readVoiceEnabledSetting());
      setHomeBgmSupported(isBgmSupported());
      setHomeBgmEnabled(false);
      setHomeBgmPlaybackMessage(
        getBgmEnabled() ? "點擊開啟 BGM，以啟用首頁主題音樂。" : null,
      );
      setHomeBgmVolume(getBgmVolume());
      homeBgmPlayerRef.current = getSharedBgmPlayer();
    }, 0);

    return () => {
      window.clearTimeout(timer);

      if (!shouldAutoResumeStoredBgm()) {
        homeBgmPlayerRef.current?.stop();
      }
    };
  }, []);

  function handleSelectHero(heroId: string) {
    setSelectedHeroId(heroId);
    playSound("reward");

    if (voiceEnabled) {
      const audioKey = getHeroPreviewAudioKey(heroId);

      if (audioKey) {
        playVoice(audioKey);
      }
    }
  }

  function toggleVoicePreview() {
    const nextEnabled = !voiceEnabled;
    setVoiceEnabled(nextEnabled);
    writeVoiceEnabledSetting(nextEnabled);
  }

  async function toggleHomeBgm() {
    const player = homeBgmPlayerRef.current ?? getSharedBgmPlayer();
    homeBgmPlayerRef.current = player;

    if (bgmEnabled) {
      setHomeBgmEnabled(false);
      setBgmEnabled(false);
      setBgmActivated(false);
      setHomeBgmPlaybackMessage(null);
      shouldResumeBgmAfterVideoRef.current = false;
      player.stop();
      return;
    }

    const played = await player.play("home-theme", { volume: bgmVolume });
    setHomeBgmEnabled(played);
    setBgmPlaybackStateFromResult(played);
    setHomeBgmPlaybackMessage(played ? null : getBgmPlaybackFailureMessage());
  }

  function handleHomeBgmVolumeChange(volume: number) {
    setHomeBgmVolume(volume);
    setBgmVolume(volume);
    homeBgmPlayerRef.current?.setVolume(volume);
  }

  function pauseHomeBgmForOpeningVideo() {
    shouldResumeBgmAfterVideoRef.current = bgmEnabled;

    if (bgmEnabled) {
      homeBgmPlayerRef.current?.pause();
    }
  }

  function resumeHomeBgmAfterOpeningVideo() {
    if (bgmEnabled && shouldResumeBgmAfterVideoRef.current) {
      void homeBgmPlayerRef.current?.play("home-theme", { volume: bgmVolume }).then((played) => {
        if (!played) {
          setHomeBgmEnabled(false);
          setBgmPlaybackStateFromResult(false);
          setHomeBgmPlaybackMessage(getBgmPlaybackFailureMessage());
        }
      });
    }

    shouldResumeBgmAfterVideoRef.current = false;
  }

  return (
    <main className="min-h-screen bg-[#140c09] bg-[radial-gradient(circle_at_top_left,rgba(127,29,29,0.36),transparent_35%),linear-gradient(135deg,#1b100b_0%,#2a120d_48%,#090605_100%)] px-4 py-6 text-stone-100 sm:px-6 sm:py-10">
      <section className="mx-auto max-w-6xl">
        <OpeningVideo
          config={openingVideo}
          onModalClose={resumeHomeBgmAfterOpeningVideo}
          onModalOpen={pauseHomeBgmForOpeningVideo}
          startHref={selectedHeroStartHref}
        />

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-stretch">
          <InstallPrompt />
          <section className="rounded-xl border border-amber-700/40 bg-black/30 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.24)]">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">
              AI 協作開發
            </p>
            <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-stone-200">
              {homeAuthorCopy}
            </p>
            <ShareGameButton className="mt-3" />
          </section>
        </div>

        <section className="mt-4 rounded-xl border border-emerald-500/35 bg-emerald-950/20 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.24)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-200">
                背景音樂
              </p>
              <p className="mt-1 text-sm font-bold text-stone-200">
                首頁主題音樂｜BGM：{bgmEnabled ? "開" : "關"}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:min-w-[280px]">
              <button
                type="button"
                onClick={toggleHomeBgm}
                className={`h-10 rounded-md px-4 text-sm font-black transition ${
                  bgmEnabled
                    ? "bg-emerald-300 text-stone-950 hover:bg-emerald-200"
                    : "border border-emerald-300/50 bg-stone-950/70 text-emerald-50 hover:border-emerald-100"
                }`}
              >
                {bgmEnabled ? "關閉 BGM" : "開啟 BGM"}
              </button>
              <label className="text-xs font-bold text-stone-300">
                音量 {Math.round(bgmVolume * 100)}%
                <input
                  aria-label="首頁 BGM 音量"
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={bgmVolume}
                  onChange={(event) => handleHomeBgmVolumeChange(Number(event.target.value))}
                  className="mt-2 block w-full accent-emerald-300"
                />
              </label>
              {!bgmSupported ? (
                <p className="text-xs font-bold text-stone-400">
                  此瀏覽器不支援背景音樂播放。
                </p>
              ) : null}
              {bgmPlaybackMessage ? (
                <p className="text-xs font-bold text-amber-100">{bgmPlaybackMessage}</p>
              ) : null}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-2xl border border-amber-700/45 bg-black/35 shadow-[0_24px_70px_rgba(0,0,0,0.42)]">
          <GameImage
            src={homeHeroImage}
            alt="三國單騎傳首頁主視覺"
            variant="cover"
            objectPosition="50% 46%"
            className="min-h-[260px] max-h-[560px] rounded-2xl sm:min-h-[430px] lg:min-h-[500px]"
            imageClassName="object-cover"
            sizes="(min-width: 1024px) 1152px, 100vw"
            priority
            fallbackType="stage"
            fallbackLabel="首頁主視覺"
            fallbackDescription="未來此處將放入 AI 生成開場主視覺"
            fallbackPrompt={chapterOne.description}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,5,4,0.94),rgba(8,5,4,0.62)_52%,rgba(8,5,4,0.22)),linear-gradient(0deg,rgba(8,5,4,0.84),rgba(8,5,4,0.18)_56%)]" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-3xl p-5 sm:p-9 lg:p-12">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-amber-300">
                單人卡牌闖關
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-normal text-amber-50 sm:mt-4 sm:text-6xl lg:text-7xl">
                《三國單騎傳》
              </h1>
              <p className="mt-4 text-xl font-bold text-red-100 sm:text-2xl">
                一將入亂世，闖關定天下
              </p>
              <p className="mt-3 text-sm font-black tracking-[0.18em] text-amber-200">
                {chapterOne.name}
              </p>
              <p className="mt-4 max-w-xl text-sm leading-7 text-stone-200 sm:hidden">
                選擇武將，闖過 8 關，挑戰呂布。
              </p>
              <p className="mt-5 hidden max-w-2xl text-sm leading-7 text-stone-200 sm:block sm:text-base sm:leading-8">
                選擇關羽、趙雲、諸葛亮或彩蛋角色李詩民，以斬、閃、酒、兵書、破甲與戰術卡迎戰第一章 8 關。
                看穿敵人的攻勢，在隨機敵人池、事件、路線選擇與戰後三選一強化中養成流派，
                最後於虎牢關前挑戰 Boss 呂布。
              </p>
              <a
                href="#hero-select"
                className="mt-6 inline-flex h-12 items-center justify-center rounded-md border border-amber-100/70 bg-amber-500 px-6 text-sm font-black text-stone-950 shadow-[0_14px_34px_rgba(245,158,11,0.28)] ring-2 ring-amber-400/20 transition hover:bg-amber-300"
              >
                先選擇武將
              </a>
            </div>
          </div>
        </section>

        <section id="hero-select" className="mt-8 scroll-mt-6 rounded-xl border border-amber-700/40 bg-black/30 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">
                選擇武將
              </p>
              <h2 className="mt-2 text-2xl font-black text-amber-50">
                {selectedHero.name}｜{selectedHero.title}
              </h2>
              <p className="mt-2 text-sm font-bold leading-6 text-stone-300">
                {homeHeroSelectionCopy}
              </p>
            </div>
            <p className="text-sm font-bold text-stone-300">
              體力 {selectedHero.maxHp} / 技能：{selectedHero.skillName} / {selectedHero.role}
            </p>
          </div>
          <p className="mt-3 inline-flex rounded-full border border-amber-300/40 bg-amber-500/12 px-3 py-1 text-sm font-black text-amber-100">
            目前選擇：{selectedHero.name}
          </p>
          {selectedHeroPreviewDialogue ? (
            <div className="mt-3 rounded-lg border border-amber-300/35 bg-amber-500/10 px-4 py-3">
              <p className="text-xs font-black tracking-[0.16em] text-amber-200">
                首頁試聽台詞
              </p>
              <p className="mt-2 text-base font-bold leading-7 text-amber-50">
                「{selectedHeroPreviewDialogue.text}」
              </p>
            </div>
          ) : null}
          <div className="mt-4 flex flex-col gap-3 rounded-lg border border-purple-500/30 bg-purple-950/25 p-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold leading-6 text-purple-100">
              {homeHeroPreviewCopy}
            </p>
            <button
              type="button"
              onClick={toggleVoicePreview}
              className={`h-10 rounded-md px-4 text-sm font-black transition ${
                voiceEnabled
                  ? "bg-purple-300 text-stone-950 hover:bg-purple-200"
                  : "border border-purple-300/50 bg-stone-950/70 text-purple-50 hover:border-purple-100"
              }`}
            >
              角色語音：{voiceEnabled ? "開" : "關"}
            </button>
            {!voiceSupported ? (
              <p className="text-xs font-bold text-stone-400">此瀏覽器不支援語音播放。</p>
            ) : null}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {heroes.map((hero) => {
              const isSelected = hero.id === selectedHeroId;
              const heroImagePosition = getHeroObjectPosition(hero.id);

              return (
                <button
                  key={hero.id}
                  type="button"
                  onClick={() => handleSelectHero(hero.id)}
                  className={`rounded-lg border p-4 text-left transition hover:-translate-y-0.5 ${
                    isSelected
                      ? "border-amber-200 bg-amber-500/18 shadow-[0_0_0_2px_rgba(252,211,77,0.2),0_14px_34px_rgba(245,158,11,0.2)]"
                      : "border-stone-700 bg-stone-950/50 hover:border-amber-600"
                  }`}
                >
                  <GameImage
                    src={hero.portrait || undefined}
                    alt={`${hero.name}立繪`}
                    variant="portrait"
                    objectPosition={heroImagePosition}
                    className="mx-auto mb-4 max-h-[220px] w-full rounded-md border border-white/10 sm:max-h-[340px]"
                    imageClassName="object-cover"
                    sizes="(min-width: 1024px) 320px, 100vw"
                    fallbackType="hero"
                    fallbackLabel={hero.name}
                    fallbackPrompt={hero.visualPrompt}
                    fallbackCompact
                  />
                  <span className="text-xl font-black text-stone-50">
                    {hero.name}
                  </span>
                  <span className="ml-2 rounded-full border border-amber-300/40 px-2 py-0.5 text-xs font-bold text-amber-100">
                    {hero.title}
                  </span>
                  <span className="mt-3 block text-sm leading-6 text-stone-300">
                    體力 {hero.maxHp}｜技能：{hero.skillName}
                  </span>
                  <span className="mt-2 inline-flex rounded-full border border-purple-300/40 bg-purple-500/15 px-3 py-1 text-xs font-black text-purple-100">
                    {hero.role}
                  </span>
                  <span className="mt-3 block text-sm leading-6 text-stone-300">
                    {hero.skillDescription}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href={selectedHeroStartHref}
              className="inline-flex h-12 items-center justify-center rounded-md border border-amber-100/70 bg-amber-500 px-6 text-sm font-black text-stone-950 shadow-[0_14px_34px_rgba(245,158,11,0.22)] transition hover:bg-amber-300"
            >
              {selectedHeroStartLabel}
            </Link>
            <ShareGameButton />
          </div>
        </section>

        <details className="mt-8 rounded-xl border border-amber-700/40 bg-black/30 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
          <summary className="cursor-pointer text-2xl font-black text-amber-50">
            {homeCollapsibleSections[0].title}
          </summary>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {howToSteps.map((step, index) => (
              <section
                key={step.title}
                className="rounded-xl border border-amber-700/40 bg-black/30 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.28)]"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-amber-300/60 bg-amber-500/15 text-sm font-black text-amber-100">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-lg font-black text-amber-100">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-300">{step.text}</p>
              </section>
            ))}
          </div>
        </details>

        <section className="mt-6 rounded-xl border border-red-900/50 bg-red-950/30 p-5">
          <h2 className="text-lg font-black text-red-100">玩法簡述</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-stone-300">
            使用「斬」造成傷害，「閃」在敵人攻擊時抵消傷害，「酒」強化下一次斬，
            「兵書」補充手牌，「破甲」打開敵人防守；連斬、固守、激勵、火攻提供額外戰術選擇。
            擊敗第 8 關呂布即可完成第一章。
          </p>
        </section>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
          AI 協作開發｜李詩民 · 版本：{currentVersionLabel}
        </p>
      </section>
    </main>
  );
}

function getHeroObjectPosition(heroId: string) {
  if (heroId === "guan-yu") {
    return "50% 18%";
  }

  if (heroId === "zhuge-liang") {
    return "50% 16%";
  }

  if (heroId === "li-shimin-ai-architect") {
    return "50% 20%";
  }

  return "50% 24%";
}
