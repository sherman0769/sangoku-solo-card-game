"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { OpeningVideoConfig } from "@/lib/game/openingVideo";

interface OpeningVideoProps {
  config: OpeningVideoConfig;
  startHref: string;
}

type PlaybackState = "idle" | "playing" | "ended";

export function OpeningVideo({ config, startHref }: OpeningVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState>("idle");
  const [hasVideoError, setHasVideoError] = useState(false);

  const canShowVideo = config.status === "ready" && !hasVideoError;

  function playFromStart() {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.currentTime = 0;
    setPlaybackState("playing");
    void video.play().catch(() => {
      setHasVideoError(true);
      setPlaybackState("idle");
    });
  }

  function handleEnded() {
    setPlaybackState("ended");
  }

  function handleVideoError() {
    setHasVideoError(true);
    setPlaybackState("idle");
  }

  if (!expanded) {
    return (
      <section id="opening-video" className="mt-6 scroll-mt-6 rounded-xl border border-purple-500/35 bg-black/35 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.3)] sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-200">
              開場動畫
            </p>
            <h2 className="mt-2 text-2xl font-black text-amber-50">{config.title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-300">
              20 秒直式開場，呈現第一章：黃巾亂起 的開場氣氛。
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="inline-flex h-11 items-center justify-center rounded-md border border-purple-200/70 bg-purple-300 px-5 text-sm font-black text-stone-950 transition hover:bg-purple-200"
            >
              觀看開場動畫
            </button>
            <Link
              href={startHref}
              className="inline-flex h-11 items-center justify-center rounded-md border border-amber-100/70 bg-amber-500 px-5 text-sm font-black text-stone-950 transition hover:bg-amber-300"
            >
              略過動畫，直接開始
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="opening-video" className="mt-8 scroll-mt-6 rounded-xl border border-purple-500/35 bg-black/35 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.3)]">
      <div className="grid gap-5 lg:grid-cols-[minmax(260px,360px)_1fr] lg:items-center">
        <div className="mx-auto w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[360px]">
          {canShowVideo ? (
            <div className="relative overflow-hidden rounded-2xl border border-amber-300/35 bg-stone-950 shadow-[0_22px_55px_rgba(0,0,0,0.38)]">
              <video
                ref={videoRef}
                src={config.src}
                className="aspect-[9/16] w-full bg-black object-cover"
                controls={playbackState !== "idle"}
                muted
                playsInline
                preload="metadata"
                onEnded={handleEnded}
                onError={handleVideoError}
              >
                <track kind="captions" />
              </video>
              {playbackState === "idle" ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[linear-gradient(180deg,rgba(8,5,4,0.24),rgba(8,5,4,0.82))] p-5 text-center">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-100">
                    9:16 開場動畫
                  </p>
                  <h3 className="mt-3 text-2xl font-black text-amber-50">{config.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-stone-200">
                    {config.durationSeconds} 秒，預設靜音，可用播放器控制開聲。
                  </p>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex aspect-[9/16] flex-col items-center justify-center rounded-2xl border border-purple-300/35 bg-purple-950/35 p-5 text-center shadow-[0_22px_55px_rgba(0,0,0,0.38)]">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-100">
                開場動畫
              </p>
              <h3 className="mt-3 text-2xl font-black text-amber-50">暫時無法播放</h3>
              <p className="mt-3 text-sm leading-6 text-stone-200">
                開場動畫暫時無法播放，仍可直接開始遊戲。
              </p>
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-200">
            開場動畫
          </p>
          <h2 className="mt-2 text-3xl font-black text-amber-50">{config.title}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300">
            以 AI 生成首幀圖、影片與配樂製作，呈現第一章：黃巾亂起 的開場氣氛。
          </p>
          <p className="mt-3 text-sm leading-7 text-stone-400">{config.description}</p>

          {playbackState === "ended" ? (
            <p className="mt-4 rounded-lg border border-emerald-300/35 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-100">
              開場動畫播放完畢
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-3">
            {canShowVideo ? (
              <button
                type="button"
                title="播放開場動畫"
                onClick={playFromStart}
                className="inline-flex h-11 items-center justify-center rounded-md border border-purple-200/70 bg-purple-300 px-5 text-sm font-black text-stone-950 transition hover:bg-purple-200"
              >
                {playbackState === "ended" ? "重新播放" : "觀看開場動畫"}
              </button>
            ) : null}
            <Link
              href={startHref}
              className="inline-flex h-11 items-center justify-center rounded-md border border-amber-100/70 bg-amber-500 px-5 text-sm font-black text-stone-950 transition hover:bg-amber-300"
            >
              {playbackState === "ended" ? "開始遊戲" : "略過動畫，直接開始"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
