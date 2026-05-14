import GameBoard from "@/components/GameBoard";

export default async function GamePage({
  searchParams,
}: {
  searchParams: Promise<{ hero?: string | string[]; mode?: string | string[] }>;
}) {
  const params = await searchParams;
  const heroId = Array.isArray(params.hero) ? params.hero[0] : params.hero;
  const mode = Array.isArray(params.mode) ? params.mode[0] : params.mode;

  return <GameBoard initialHeroId={heroId} initialMode={mode} />;
}
