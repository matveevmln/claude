"use client";

import { useEffect, useRef } from "react";

export function VideoPlayer({
  videoUrl,
  title,
  lessonId,
  initialPositionSec = 0,
}: {
  videoUrl: string | null;
  title: string;
  lessonId?: string;
  initialPositionSec?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastSentRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !lessonId) return;

    function handleLoadedMetadata() {
      if (video && initialPositionSec > 0 && initialPositionSec < video.duration - 5) {
        video.currentTime = initialPositionSec;
      }
    }

    function reportPosition() {
      if (!video) return;
      const pos = Math.floor(video.currentTime);
      if (Math.abs(pos - lastSentRef.current) < 5) return;
      lastSentRef.current = pos;
      fetch(`/api/account/lessons/${lessonId}/position`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ positionSec: pos }),
        keepalive: true,
      }).catch(() => {});
    }

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", reportPosition);
    video.addEventListener("pause", reportPosition);
    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", reportPosition);
      video.removeEventListener("pause", reportPosition);
    };
  }, [lessonId, initialPositionSec]);

  if (videoUrl) {
    return (
      <video ref={videoRef} controls className="aspect-video w-full rounded-3xl bg-choco" src={videoUrl}>
        Ваш браузер не поддерживает воспроизведение видео.
      </video>
    );
  }

  return (
    <div
      role="img"
      aria-label={`Видео урока «${title}» — будет доступно после загрузки`}
      className="relative flex aspect-video w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl border border-beige-line/70 bg-noise-card"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_18%,rgba(255,255,255,0.75),transparent_55%)]" />
      <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/80 text-2xl text-berry-deep shadow-lg">
        ▶
      </span>
      <p className="relative max-w-xs text-center text-xs text-choco-soft/70">
        Видео появится здесь после загрузки съёмочных материалов
      </p>
    </div>
  );
}
