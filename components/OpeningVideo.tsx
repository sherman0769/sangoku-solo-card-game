"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { OpeningVideoConfig } from "@/lib/game/openingVideo";

interface OpeningVideoProps {
  config: OpeningVideoConfig;
  startHref: string;
}

type PlaybackState = "idle" | "playing" | "ended";

export function OpeningVideo({ config, startHref }: OpeningVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState>("idle");
  const [hasVideoError, setHasVideoError] = useState(false);
  const [isMutedFallback, setIsMutedFallback] = useState(false);

  const canShowVideo = config.status === "ready" && !hasVideoError;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => {
      playFromStart();
    }, 0);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  function openModal() {
    setHasVideoError(false);
    setIsMutedFallback(false);
    setPlaybackState("playing");
    setIsOpen(true);
  }

  function closeModal() {
    videoRef.current?.pause();
    setIsOpen(false);
    setPlaybackState("idle");
  }

  function playFromStart() {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.currentTime = 0;
    setPlaybackState("playing");
    video.muted = false;
    setIsMutedFallback(false);

    void video.play().catch(() => {
      video.muted = true;
      setIsMutedFallback(true);
      void video.play().catch(() => {
        setPlaybackState("idle");
      });
    });
  }

  function handleEnded() {
    setPlaybackState("ended");
  }

  function handleVideoError() {
    setHasVideoError(true);
    setPlaybackState("idle");
  }

  return (
    <section id="opening-video" className="mt-6 scroll-mt-6 rounded-xl border border-purple-500/35 bg-black/35 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.3)] sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-200">
            開場動畫
          </p>
          <h2 className="mt-2 text-2xl font-black text-amber-50">{config.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-300">
            觀看第一章：黃巾亂起 的 20 秒直式開場動畫。可先觀看開場動畫，接著選擇武將開始第一章。
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={openModal}
            className="inline-flex h-11 items-center justify-center rounded-md border border-purple-200/70 bg-purple-300 px-5 text-sm font-black text-stone-950 transition hover:bg-purple-200"
          >
            觀看開場動畫
          </button>
        </div>
      </div>

      {isOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={config.title}
          className="fixed inset-0 z-50 flex flex-col bg-black/95 p-4 text-stone-100 sm:p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-200">
                開場動畫播放中
              </p>
              <h2 className="mt-1 text-xl font-black text-amber-50">{config.title}</h2>
            </div>
            <button
              type="button"
              onClick={closeModal}
              className="h-10 rounded-md border border-stone-500 bg-stone-950/80 px-4 text-sm font-black text-stone-100 transition hover:border-stone-200 hover:bg-stone-800"
            >
              關閉
            </button>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center py-4">
            <div className="w-full max-w-[min(92vw,46vh)] sm:max-w-[360px]">
              {canShowVideo ? (
                <div className="overflow-hidden rounded-2xl border border-amber-300/35 bg-stone-950 shadow-[0_22px_55px_rgba(0,0,0,0.55)]">
                  <video
                    ref={videoRef}
                    src={config.src}
                    className="aspect-[9/16] max-h-[calc(100vh-190px)] w-full bg-black object-cover"
                    controls
                    muted={isMutedFallback}
                    playsInline
                    preload="metadata"
                    onEnded={handleEnded}
                    onError={handleVideoError}
                  >
                    <track kind="captions" />
                  </video>
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
          </div>

          <div className="mx-auto w-full max-w-xl">
            <p className="text-center text-sm leading-6 text-stone-300">
              可點右上角關閉，或點下方略過動畫。
            </p>
            {isMutedFallback ? (
              <p className="mt-2 rounded-md border border-amber-300/35 bg-amber-500/10 px-3 py-2 text-center text-xs font-bold text-amber-100">
                瀏覽器已阻擋自動開聲音，請點擊影片控制列開啟聲音。
              </p>
            ) : null}
            {playbackState === "ended" ? (
              <p className="mt-2 rounded-md border border-emerald-300/35 bg-emerald-500/10 px-3 py-2 text-center text-sm font-bold text-emerald-100">
                開場動畫播放完畢
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link
                href={startHref}
                className="inline-flex h-11 items-center justify-center rounded-md border border-amber-100/70 bg-amber-500 px-5 text-sm font-black text-stone-950 transition hover:bg-amber-300"
              >
                {playbackState === "ended" ? "開始遊戲" : "略過動畫，開始遊戲"}
              </Link>
            {canShowVideo ? (
              <button
                type="button"
                title="播放開場動畫"
                onClick={playFromStart}
                className="inline-flex h-11 items-center justify-center rounded-md border border-purple-300/60 bg-purple-950/70 px-5 text-sm font-black text-purple-50 transition hover:border-purple-100 hover:bg-purple-900"
              >
                重新播放
              </button>
            ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
