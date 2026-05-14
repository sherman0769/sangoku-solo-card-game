"use client";

import Image from "next/image";
import { useState } from "react";
import { VisualPlaceholder, type VisualPlaceholderType } from "./VisualPlaceholder";

export type GameImageVariant = "cover" | "portrait" | "card" | "background" | "vertical";

interface GameImageProps {
  src?: string;
  alt: string;
  variant?: GameImageVariant;
  objectPosition?: string;
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
  variant,
  objectPosition = "50% 50%",
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
  const variantClass = variant ? getGameImageVariantClass(variant) : "";

  return (
    <div className={`relative overflow-hidden rounded-lg ${variantClass} ${className}`}>
      {mode === "image" ? (
        <Image
          src={src!}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={imageClassName}
          style={getGameImageObjectPositionStyle(objectPosition)}
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

export function getGameImageVariantClass(variant: GameImageVariant) {
  return gameImageVariantClasses[variant];
}

export function getGameImageObjectPositionStyle(objectPosition: string) {
  return { objectPosition };
}

const gameImageVariantClasses = {
  cover: "aspect-[16/9]",
  portrait: "aspect-[3/4]",
  card: "aspect-[4/3]",
  background: "aspect-[16/9]",
  vertical: "aspect-[9/16]",
} satisfies Record<GameImageVariant, string>;
