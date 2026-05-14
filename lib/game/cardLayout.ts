export const CARD_VIEW_LAYOUT = {
  imageAspectRatio: "4:3",
  imageVariant: "card",
  descriptionLineClamp: 3,
  cardRootClass: "h-80 md:h-[21rem]",
  mobileCardWrapperClass: "w-40 shrink-0 md:w-auto",
  headerClass: "min-h-[4.5rem] sm:min-h-[4.75rem]",
  imageFrameClass: "border border-white/10 bg-black/20",
  descriptionClass:
    "card-description-clamp mt-auto min-h-[3.75rem] text-xs leading-5 text-stone-200 sm:min-h-[4.5rem] sm:text-sm sm:leading-6",
  fallbackCompact: true,
} as const;
