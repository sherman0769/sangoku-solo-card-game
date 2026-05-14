"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GameImage } from "@/components/GameImage";
import { OpeningVideo } from "@/components/OpeningVideo";
import { playSound } from "@/lib/game/audio";
import { getHeroDialogue } from "@/lib/game/dialogues";
import { heroes } from "@/lib/game/heroes";
import { getOpeningVideoConfig } from "@/lib/game/openingVideo";
import {
  getHeroPreviewAudioKey,
  getHeroStartLabel,
  homeHeroPreviewCopy,
  homeHeroSelectionCopy,
  homeCollapsibleSections,
  currentFeatureHighlights,
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
    }, 0);

    return () => window.clearTimeout(timer);
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

  return (
    <main className="min-h-screen bg-[#140c09] bg-[radial-gradient(circle_at_top_left,rgba(127,29,29,0.36),transparent_35%),linear-gradient(135deg,#1b100b_0%,#2a120d_48%,#090605_100%)] px-4 py-6 text-stone-100 sm:px-6 sm:py-10">
      <section className="mx-auto max-w-6xl">
        <OpeningVideo config={openingVideo} startHref={selectedHeroStartHref} />

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
                選擇關羽、趙雲或諸葛亮，以斬、閃、酒、兵書、破甲與戰術卡迎戰第一章 8 關。
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
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
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
                    src={hero.portrait}
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

        <details className="mt-5 rounded-xl border border-amber-700/40 bg-black/30 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
          <summary className="cursor-pointer text-2xl font-black text-amber-50">
            {homeCollapsibleSections[1].title}
          </summary>
          <h2 className="sr-only">v0.19.0 目前特色</h2>
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
        </details>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            ["單人卡牌闖關", "每回合管理士氣與手牌，在攻防之間找出突破口。"],
            ["三選一戰後強化", "擊敗敵人後選擇強化，讓武將逐步形成戰鬥風格。"],
            ["隨機敵人池", "每局遭遇不同挑戰，前兩關不再固定敵人。"],
            ["戰術卡牌", "連斬、固守、激勵、火攻，讓每回合選擇更豐富。"],
            ["隨機事件考驗", "戰鬥之後可能遇到補給、策略或危險事件。"],
            ["路線選擇", "山道、官道、險道代表不同劇情與資源方向，不再只是難度差異。"],
            ["第一章 8 關流程", "從荒村初戰推進到虎牢關前，逐步累積資源與強化。"],
            ["Mini-boss 張梁 / 張寶", "第 7 關黃巾祭壇將遭遇黃巾殘部的強敵。"],
            ["挑戰最終 Boss 呂布", "前七關累積優勢，第八關迎戰真正的亂世猛將。"],
            ["視覺呈現優化", "首頁、武將、敵人、Boss 與關卡背景已調整為更適合手機與展示。"],
            ["人物台詞系統", "武將、敵人、旁白與勝敗結果會以文字台詞呈現。"],
            ["音效系統測試版", "使用 Web Audio API 生成提示音，預設關閉，可在遊戲頁手動開啟。"],
            ["TTS 配音規劃", "已建立配音素材清單，為角色語音與開場旁白做準備。"],
            ["語音播放框架", "已建立 audioKey 對應與未來 TTS 音檔播放機制。"],
            ["第一批 TTS 語音", "章節開場、三位武將登場與呂布登場語音已可在語音開啟後播放。"],
            ["首頁武將試聽語音", "選角時可聽到專屬語音，與進入遊戲後登場語音分離。"],
            ["第一章 TTS 補完規劃", "已整理八關旁白、敵人登場、擊敗語音與路線事件語音清單。"],
            ["第一章 P0 語音已導入", "八關旁白、敵人登場、Boss 特性與勝敗語音陸續完成。"],
            ["第一章 P0 圖片已導入", "敵人圖與八關背景圖補齊，路線與事件圖片將陸續補完。"],
            ["開頭動畫", "以 AI 圖像、影片與音樂製作第一章開場，可觀看或略過後開始遊戲。"],
            ["手機遊玩優化", "戰鬥 HUD、底部手牌操作區、紀錄與狀態設定收合，降低直屏滑動負擔。"],
            ["首頁主流程", "首頁改為觀看開場動畫、選擇武將、開始遊戲，避免選角前直接進入遊戲。"],
            ["卡牌音效系統", "不同類型卡牌已可對應不同音效，正式音檔尚未導入時會 fallback 到提示音。"],
            ["真實卡牌音效", "斬、連斬、防禦、回復、策略、裝備、火攻 7 類 MP3 已導入。"],
            ["戰鬥平衡分析", "使用模擬工具分析武將勝率、死亡關卡、敵人遭遇與路線選擇。"],
            ["第一輪平衡微調", "諸葛亮 HP 提升至 4、呂布 HP 提升至 14，且未提高第 2～3 關敵人壓力。"],
            ["後期難度微調", "張梁、張寶與呂布猛攻比例小幅提高，第一章後段更有挑戰。"],
            ["路線劇情事件", "山道、官道、險道擁有不同遭遇與資源方向，選路不再只是固定數值。"],
            ["險道風險再平衡", "絕壁伏擊、古戰場遺物與夜襲敵營代價提高，保留高報酬但更危險。"],
            ["路線風格平衡", "山道偏生存補給，官道偏情報穩定，險道偏奇遇代價。"],
            ["Boss 特性系統", "呂布具備無雙壓迫與戰神回血，最終戰更具壓迫感。"],
            ["Boss 戰演出強化", "呂布發動無雙壓迫與戰神回血時，會有更明顯的畫面提示。"],
            ["Hydration 修正", "/game 隨機敵人與初始手牌改為 client mounted 後生成，避免初始畫面不一致。"],
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

function getHeroObjectPosition(heroId: string) {
  if (heroId === "guan-yu") {
    return "50% 18%";
  }

  if (heroId === "zhuge-liang") {
    return "50% 16%";
  }

  return "50% 24%";
}
