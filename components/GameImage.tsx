"use client";

import Image from "next/image";
import { useState } from "react";
import { VisualPlaceholder, type VisualPlaceholderType } from "./VisualPlaceholder";

interface GameImageProps {
  src?: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  fallbackType: VisualPlaceholderType;
  fallbackLabel: string;
  fallbackPrompt?: string;
  fallbackDescription?: string;
  fallbackCompact?: boolean;
}

export function GameImage({
  src,
  alt,
  className = "",
  imageClassName = "object-cover",
  sizes = "100vw",
  priority = false,
  fallbackType,
  fallbackLabel,
  fallbackPrompt,
  fallbackDescription,
  fallbackCompact = false,
}: GameImageProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const mode = getGameImageRenderMode(src, imageFailed);

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {mode === "image" ? (
        <Image
          src={src!}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={imageClassName}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <VisualPlaceholder
          type={fallbackType}
          label={fallbackLabel}
          prompt={fallbackPrompt}
          description={fallbackDescription}
          compact={fallbackCompact}
        />
      )}
    </div>
  );
}

export function getGameImageRenderMode(src?: string, imageFailed = false) {
  return src && !imageFailed ? "image" : "fallback";
}
