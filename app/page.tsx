"use client";

import Link from "next/link";
import { useState } from "react";
import { GameImage } from "@/components/GameImage";
import { heroes } from "@/lib/game/heroes";
import {
  currentFeatureHighlights,
  currentVersionLabel,
  howToSteps,
} from "@/lib/game/showcase";
import { chapterOne } from "@/lib/game/stages";
import { VISUAL_ASSET_MANIFEST } from "@/lib/game/visualAssetManifest";

export default function Home() {
  const [selectedHeroId, setSelectedHeroId] = useState("guan-yu");
  const selectedHero = heroes.find((hero) => hero.id === selectedHeroId) ?? heroes[0];
  const homeHeroImage = VISUAL_ASSET_MANIFEST.find((asset) => asset.id === "home-hero")?.path;

  return (
    <main className="min-h-screen bg-[#140c09] bg-[radial-gradient(circle_at_top_left,rgba(127,29,29,0.36),transparent_35%),linear-gradient(135deg,#1b100b_0%,#2a120d_48%,#090605_100%)] px-6 py-10 text-stone-100">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col justify-center">
        <section className="relative overflow-hidden rounded-2xl border border-amber-700/45 bg-black/35 shadow-[0_24px_70px_rgba(0,0,0,0.42)]">
          <GameImage
            src={homeHeroImage}
            alt="三國單騎傳首頁主視覺"
            className="aspect-[16/9] min-h-[420px] rounded-2xl sm:min-h-[520px]"
            imageClassName="object-cover"
            sizes="(min-width: 1024px) 1152px, 100vw"
            priority
            fallbackType="stage"
            fallbackLabel="首頁主視覺"
            fallbackDescription="未來此處將放入 AI 生成開場主視覺"
            fallbackPrompt={chapterOne.description}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,5,4,0.86),rgba(8,5,4,0.5)_48%,rgba(8,5,4,0.12)),linear-gradient(0deg,rgba(8,5,4,0.72),transparent_52%)]" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-3xl p-6 sm:p-9 lg:p-12">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-amber-300">
                單人卡牌闖關
              </p>
              <h1 className="mt-5 text-5xl font-black tracking-normal text-amber-50 sm:text-7xl">
                《三國單騎傳》
              </h1>
              <p className="mt-5 text-2xl font-bold text-red-100">
                一將入亂世，闖關定天下
              </p>
              <p className="mt-3 text-sm font-black tracking-[0.18em] text-amber-200">
                {chapterOne.name}
              </p>
              <p className="mt-6 max-w-2xl text-base leading-8 text-stone-200 sm:text-lg">
                選擇關羽、趙雲或諸葛亮，以斬、閃、酒、兵書、破甲與戰術卡迎戰第一章 8 關。
                看穿敵人的攻勢，在隨機敵人池、事件、路線選擇與戰後三選一強化中養成流派，
                最後於虎牢關前挑戰 Boss 呂布。
              </p>
              <Link
                href={`/game?hero=${selectedHeroId}`}
                className="mt-7 inline-flex h-12 items-center justify-center rounded-md bg-amber-500 px-6 text-sm font-black text-stone-950 shadow-[0_14px_30px_rgba(245,158,11,0.18)] transition hover:bg-amber-300"
              >
                開始遊戲
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-amber-700/40 bg-black/30 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">
                選擇武將
              </p>
              <h2 className="mt-2 text-2xl font-black text-amber-50">
                {selectedHero.name}｜{selectedHero.title}
              </h2>
            </div>
            <p className="text-sm font-bold text-stone-300">
              體力 {selectedHero.maxHp} / 技能：{selectedHero.skillName} / {selectedHero.role}
            </p>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {heroes.map((hero) => {
              const isSelected = hero.id === selectedHeroId;

              return (
                <button
                  key={hero.id}
                  type="button"
                  onClick={() => setSelectedHeroId(hero.id)}
                  className={`rounded-lg border p-4 text-left transition hover:-translate-y-0.5 ${
                    isSelected
                      ? "border-amber-300 bg-amber-500/15 shadow-[0_12px_28px_rgba(245,158,11,0.16)]"
                      : "border-stone-700 bg-stone-950/50 hover:border-amber-600"
                  }`}
                >
                  <GameImage
                    src={hero.portrait}
                    alt={`${hero.name}立繪`}
                    className="mb-4 aspect-[3/4] rounded-md border border-white/10"
                    imageClassName="object-cover object-top"
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
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-black text-amber-50">怎麼玩？</h2>
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
        </section>

        <section className="mt-10 rounded-xl border border-amber-700/40 bg-black/30 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
          <h2 className="text-3xl font-black text-amber-50">v0.10.2 目前特色</h2>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-stone-300 md:grid-cols-2">
            {currentFeatureHighlights.map((feature) => (
              <li
                key={feature}
                className="rounded-lg border border-stone-700/70 bg-stone-950/45 px-4 py-3"
              >
                {feature}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            ["單人卡牌闖關", "每回合管理士氣與手牌，在攻防之間找出突破口。"],
            ["三選一戰後強化", "擊敗敵人後選擇強化，讓武將逐步形成戰鬥風格。"],
            ["隨機敵人池", "每局遭遇不同挑戰，前兩關不再固定敵人。"],
            ["戰術卡牌", "連斬、固守、激勵、火攻，讓每回合選擇更豐富。"],
            ["隨機事件考驗", "戰鬥之後可能遇到補給、策略或危險事件。"],
            ["路線選擇", "風險越高，報酬越好，下一關也會更凶險。"],
            ["第一章 8 關流程", "從荒村初戰推進到虎牢關前，逐步累積資源與強化。"],
            ["Mini-boss 張梁 / 張寶", "第 7 關黃巾祭壇將遭遇黃巾殘部的強敵。"],
            ["挑戰最終 Boss 呂布", "前七關累積優勢，第八關迎戰真正的亂世猛將。"],
          ].map(([title, text]) => (
            <section
              key={title}
              className="rounded-xl border border-amber-700/40 bg-black/30 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.28)]"
            >
              <h2 className="text-lg font-black text-amber-100">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-stone-300">{text}</p>
            </section>
          ))}
        </div>

        <section className="mt-6 rounded-xl border border-red-900/50 bg-red-950/30 p-5">
          <h2 className="text-lg font-black text-red-100">玩法簡述</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-stone-300">
            使用「斬」造成傷害，「閃」在敵人攻擊時抵消傷害，「酒」強化下一次斬，
            「兵書」補充手牌，「破甲」打開敵人防守；連斬、固守、激勵、火攻提供額外戰術選擇。
            擊敗第 8 關呂布即可完成第一章。
          </p>
        </section>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
          版本：{currentVersionLabel}
        </p>
      </section>
    </main>
  );
}
