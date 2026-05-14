export const productionUrl = "https://sangoku-solo-card-game.vercel.app";

export const gameShareCopy = {
  title: "三國單騎傳",
  text: "李詩民 AI 協作開發的三國單人卡牌 Roguelike 遊戲",
} as const;

export type ShareResult = "native" | "clipboard" | "unsupported";

interface NavigatorShareLike {
  share?: (data: ShareData) => Promise<void>;
  clipboard?: {
    writeText?: (text: string) => Promise<void>;
  };
}

export function getShareUrl(origin?: string) {
  return origin || productionUrl;
}

export function getSharePayload(origin?: string): ShareData {
  return {
    title: gameShareCopy.title,
    text: gameShareCopy.text,
    url: getShareUrl(origin),
  };
}

export function canUseNativeShare(
  navigatorLike?: NavigatorShareLike | null,
): navigatorLike is NavigatorShareLike & { share: (data: ShareData) => Promise<void> } {
  return typeof navigatorLike?.share === "function";
}

export async function shareGame({
  navigatorLike,
  origin,
}: {
  navigatorLike?: NavigatorShareLike | null;
  origin?: string;
} = {}): Promise<ShareResult> {
  const fallbackNavigator =
    typeof navigator !== "undefined" ? (navigator as NavigatorShareLike) : undefined;
  const activeNavigator = navigatorLike ?? fallbackNavigator;
  const payload = getSharePayload(origin ?? getBrowserOrigin());

  if (canUseNativeShare(activeNavigator)) {
    await activeNavigator.share(payload);
    return "native";
  }

  if (typeof activeNavigator?.clipboard?.writeText === "function") {
    await activeNavigator.clipboard.writeText(payload.url ?? productionUrl);
    return "clipboard";
  }

  return "unsupported";
}

function getBrowserOrigin() {
  if (typeof window === "undefined") {
    return productionUrl;
  }

  return window.location.origin;
}
