import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/wiki/breadcrumbs";
import { ResponsiveAdsterraTop } from "@/components/ads/adsterra-banner";
import { gameConfig } from "@/config/game";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { formatDate } from "@/lib/utils/format";

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "Game Info",
    description: "Halloween: The Game information hub: find release dates, editions, platforms, PC specifications and official links for the Haddonfield horror game.",
    pathname: "/game-info", siteUrl: gameConfig.siteUrl, image: gameConfig.heroImagePath
  });
}

const topics = [
  ["/updates/patch-1-1-0", "Patch notes and updates", "Patch 1.1.0 performance, stability and balance changes, plus the post-launch update history."],
  ["/updates/october-27-2026", "October 27 update", "The scheduled free Tower Farm map, Michael skins, Michelle and Eugene DLC, costumes, fixes and QoL."],
  ["/release-date", "Release dates", "September 8 digital release, historical Early Access and the later disc release."],
  ["/editions", "Digital editions and price", "Standard versus Deluxe, exclusive characters and historical pre-order bonuses."],
  ["/physical-editions", "Physical copies", "Standard and Limited Collector's disc packages and their contents."],
  ["/platforms", "Platforms", "PS5, Xbox Series X|S and PC stores, subscriptions and regional caveats."],
  ["/system-requirements", "PC requirements", "Published minimum and recommended specifications, with CPU-label limitations."],
  ["/guides/how-to-play", "How to play", "Civilian rescue objectives, Michael's systems and singleplayer."],
  ["/characters", "Characters", "Standard and Deluxe roster, player roles and NPC residents."],
  ["/locations", "Maps", "Four launch neighborhoods, plus the free Tower Farm map arriving October 27."],
  ["/community", "Community", "Find the official Discord server and its announcement."]
];

export default function GameInfoPage() {
  return <article className="game-info-page">
    <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Game Info" }]} />
    <header className="page-header">
      <p className="preview-card__eyebrow">Game information</p>
      <h1>Halloween: The Game Information</h1>
      <p>{gameConfig.description}</p>
    </header>
    <ResponsiveAdsterraTop />
    <section aria-labelledby="facts-heading" className="game-info-section">
      <h2 id="facts-heading">At a glance</h2>
      <dl className="facts-list">
        <div><dt>Developer</dt><dd>{gameConfig.developer}</dd></div>
        <div><dt>Publisher</dt><dd>{gameConfig.publisher}</dd></div>
        <div><dt>Digital release</dt><dd>{formatDate(gameConfig.releaseDate!)} in supported regions</dd></div>
        <div><dt>Setting</dt><dd>Haddonfield, Halloween night in 1978</dd></div>
        <div><dt>Modes</dt><dd>1v4 multiplayer and a Michael Myers singleplayer story</dd></div>
      </dl>
      <p>The <a href="https://halloweengame.com/news/halloween-the-game-out-now/">official launch announcement</a> confirms the release. Current update: <Link href="/updates/patch-1-1-0">Patch 1.1.0, October 6</Link>. An <Link href="/updates/october-27-2026">October 27 update</Link> is scheduled to add the free <Link href="/locations/tower-farm">Tower Farm</Link> map and new DLC. Reviewed October 6, 2026.</p>
    </section>
    <section aria-labelledby="topics-heading" className="game-info-section">
      <h2 id="topics-heading">Find the specific answer</h2>
      <ul className="link-list">{topics.map(([href, title, summary]) => <li key={href}><Link href={href}>{title}</Link><p>{summary}</p></li>)}</ul>
    </section>
    <section aria-labelledby="limits-heading" className="game-info-section">
      <h2 id="limits-heading">Evidence and remaining gaps</h2>
      <p>Crossplay connects PS5, Xbox Series X|S and PC. The official launch patch corrected party-follow matchmaking; cross-save is a separate, unconfirmed feature. See <Link href="/crossplay">crossplay support</Link> or <Link href="/platforms">hardware and store availability</Link>.</p>
      <p>Exact cooldowns, hidden combat formulas and fixed escape-item spawn routes remain outside our verified evidence. Official patch facts and dated community observations are kept separate throughout this independent fan-made wiki.</p>
    </section>
    <section aria-labelledby="links-heading" className="game-info-section">
      <h2 id="links-heading">Official links</h2>
      <ul className="link-list">
        <li><a href={gameConfig.officialWebsite}>Official game website</a></li>
        <li><a href={gameConfig.steamUrl}>Steam store page</a></li>
        <li><a href="https://halloweengame.com/news/official-discord-server/">Official Discord announcement</a></li>
        <li><a href="https://halloweengame.com/news/halloween-gameplay-release-date-trailer/">Official gameplay trailer announcement</a></li>
      </ul>
    </section>
  </article>;
}
