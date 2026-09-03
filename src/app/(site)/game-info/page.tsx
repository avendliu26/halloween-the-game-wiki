import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/wiki/breadcrumbs";
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
  ["/release-date", "Release dates", "Digital launch, Deluxe early access and the later disc release."],
  ["/editions", "Digital editions and price", "Standard versus Deluxe, exclusive characters and pre-order bonuses."],
  ["/physical-editions", "Physical copies", "Standard and Limited Collector's disc packages and their contents."],
  ["/platforms", "Platforms", "PS5, Xbox Series X|S and PC stores, subscriptions and regional caveats."],
  ["/system-requirements", "PC requirements", "Published minimum and recommended specifications, with CPU-label limitations."],
  ["/guides/how-to-play", "How to play", "Civilian rescue objectives, Michael's systems and singleplayer."],
  ["/characters", "Characters", "Standard and Deluxe roster, player roles and NPC residents."],
  ["/locations", "Maps", "Four launch neighborhoods and confirmed landmarks."],
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
    <section aria-labelledby="facts-heading" className="game-info-section">
      <h2 id="facts-heading">At a glance</h2>
      <dl className="facts-list">
        <div><dt>Developer</dt><dd>{gameConfig.developer}</dd></div>
        <div><dt>Publisher</dt><dd>{gameConfig.publisher}</dd></div>
        <div><dt>Announced digital launch</dt><dd>{formatDate(gameConfig.releaseDate!)} in supported regions</dd></div>
        <div><dt>Setting</dt><dd>Haddonfield, Halloween night in 1978</dd></div>
        <div><dt>Modes</dt><dd>1v4 multiplayer and a Michael Myers singleplayer story</dd></div>
      </dl>
      <p>Based on the <a href="https://halloweengame.com/news/multiplayer-gameplay-overview/">official multiplayer overview</a>, <a href="https://halloweengame.com/news/unleash-hell-upon-haddonfield/">singleplayer reveal</a> and <a href={gameConfig.steamUrl}>Steam listing</a>, checked September 3, 2026.</p>
    </section>
    <section aria-labelledby="topics-heading" className="game-info-section">
      <h2 id="topics-heading">Find the specific answer</h2>
      <ul className="link-list">{topics.map(([href, title, summary]) => <li key={href}><Link href={href}>{title}</Link><p>{summary}</p></li>)}</ul>
    </section>
    <section aria-labelledby="limits-heading" className="game-info-section">
      <h2 id="limits-heading">Evidence and remaining gaps</h2>
      <p>Xbox and Epic list cross-platform functionality, but the reviewed sources do not establish the full platform pairing and cross-progression rules. The <Link href="/platforms">platform page</Link> explains the scope and regional exceptions.</p>
      <p>Numerical character builds, tested escape routes and a detailed Alexis profile remain outside our verified evidence. This independent fan-made wiki does not present prerelease source descriptions as hands-on results.</p>
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
