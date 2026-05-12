import GameBoard from "@/components/GameBoard";

export default async function GamePage({
  searchParams,
}: {
  searchParams: Promise<{ hero?: string | string[] }>;
}) {
  const params = await searchParams;
  const heroId = Array.isArray(params.hero) ? params.hero[0] : params.hero;

  return <GameBoard initialHeroId={heroId} />;
}
