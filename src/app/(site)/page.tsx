import { gameConfig } from "@/config/game";
import { buildHomePageMetadata, HomePageContent } from "@/components/home/home-page";

export function generateMetadata() {
  return buildHomePageMetadata(gameConfig);
}

export default function HomePage() {
  return <HomePageContent config={gameConfig} />;
}
