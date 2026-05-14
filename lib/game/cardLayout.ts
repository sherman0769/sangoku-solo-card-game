export const CARD_VIEW_LAYOUT = {
  imageAspectRatio: "4:3",
  imageVariant: "card",
  descriptionLineClamp: 3,
  mobileWidthClass: "w-40 min-w-[10rem] max-w-[10rem]",
  desktopWidthClass: "sm:w-44 sm:min-w-[11rem] sm:max-w-[11rem] md:w-full md:min-w-0 md:max-w-none",
  preventShrinkClass: "shrink-0",
  baseCardClass:
    "w-40 min-w-[10rem] max-w-[10rem] sm:w-44 sm:min-w-[11rem] sm:max-w-[11rem] md:w-full md:min-w-0 md:max-w-none shrink-0",
  cardRootClass:
    "h-80 w-40 min-w-[10rem] max-w-[10rem] shrink-0 sm:w-44 sm:min-w-[11rem] sm:max-w-[11rem] md:h-[21rem] md:w-full md:min-w-0 md:max-w-none",
  mobileCardWrapperClass:
    "w-40 min-w-[10rem] max-w-[10rem] shrink-0 sm:w-44 sm:min-w-[11rem] sm:max-w-[11rem] md:w-auto md:min-w-0 md:max-w-none",
  headerClass: "min-h-[4.5rem] sm:min-h-[4.75rem]",
  imageFrameClass: "border border-white/10 bg-black/20",
  descriptionClass:
    "card-description-clamp mt-auto min-h-[3.75rem] text-xs leading-5 text-stone-200 sm:min-h-[4.5rem] sm:text-sm sm:leading-6",
  fallbackCompact: true,
} as const;
