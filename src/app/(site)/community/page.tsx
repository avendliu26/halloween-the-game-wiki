import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/wiki/breadcrumbs";
import { gameConfig } from "@/config/game";
import { buildPageMetadata } from "@/lib/seo/metadata";

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "Community",
    description: "Find the official Halloween: The Game Discord community and its announcement. This independent fan wiki is separate from the official server.",
    pathname: "/community",
    siteUrl: gameConfig.siteUrl
  });
}

export default function CommunityPage() {
  return <article className="game-info-page">
    <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/game-info", label: "Game Info" }, { label: "Community" }]} />
    <header className="page-header">
      <p className="preview-card__eyebrow">Community</p>
      <h1>Halloween: The Game Community</h1>
      <p>Connect with other players through the official game community.</p>
    </header>
    <section className="game-info-section" aria-labelledby="official-discord">
      <h2 id="official-discord">Official Discord</h2>
      <p>The official Halloween: The Game website invites players to discuss the game on its Discord server. This fan-made wiki is independently operated and does not manage that server.</p>
      {gameConfig.discordUrl ? <div className="home-hero__actions">
        <a className="button button--primary" href={gameConfig.discordUrl} target="_blank" rel="noopener noreferrer">Join Official Discord</a>
      </div> : null}
      <p>Read the <a className="underline" href="https://halloweengame.com/news/official-discord-server/" target="_blank" rel="noopener noreferrer">official server announcement</a>. Discord may require you to sign in before joining.</p>
    </section>
  </article>;
}
