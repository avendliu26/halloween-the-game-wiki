import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/wiki/breadcrumbs";
import { gameConfig } from "@/config/game";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { formatDate } from "@/lib/utils/format";

const gameInfoDescription = `Game information and supported platforms for ${gameConfig.name}.`;

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "Game Info",
    description: gameInfoDescription,
    pathname: "/game-info",
    siteUrl: gameConfig.siteUrl,
    image: gameConfig.heroImagePath
  });
}

const optionalFacts = [
  { label: "Developer", value: gameConfig.developer },
  { label: "Publisher", value: gameConfig.publisher },
  { label: "Release date", value: gameConfig.releaseDate ? formatDate(gameConfig.releaseDate) : undefined }
].filter((fact): fact is { label: string; value: string } => Boolean(fact.value));

const officialLinks = [
  { href: gameConfig.officialWebsite, label: "Official website" },
  { href: gameConfig.steamUrl, label: "Steam" },
  { href: gameConfig.discordUrl, label: "Official Discord" },
  { href: gameConfig.youtubeUrl, label: "Official YouTube — Announce Trailer" }
].filter((link): link is { href: string; label: string } => Boolean(link.href));

export default function GameInfoPage() {
  return (
    <article className="game-info-page">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Game Info" }]} />
      <header className="page-header">
        <p className="preview-card__eyebrow">Game information</p>
        <h1>{gameConfig.name}</h1>
        <p>{gameConfig.description}</p>
      </header>
      {gameConfig.content.gameInfoDemoNotice ? (
        <aside className="demo-notice" role="note">
          <h2>{gameConfig.content.gameInfoDemoNotice.title}</h2>
          <p>{gameConfig.content.gameInfoDemoNotice.body}</p>
        </aside>
      ) : null}
      <section aria-labelledby="facts-heading" className="game-info-section">
        <h2 id="facts-heading">Details</h2>
        <dl className="facts-list">
          <div><dt>Platforms</dt><dd>{gameConfig.platforms.join(", ")}</dd></div>
          {optionalFacts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
          <div><dt>Genre</dt><dd>Asymmetrical Horror Action</dd></div>
          <div><dt>Multiplayer</dt><dd>1v4</dd></div>
          <div><dt>Launch maps</dt><dd>4</dd></div>
          <div><dt>Supported languages</dt><dd>10 on Steam; English full audio</dd></div>
          <div><dt>Digital editions</dt><dd>Standard: $39.99 USD; Deluxe: $59.99 USD. Regional pricing may differ.</dd></div>
          <div><dt>Early access</dt><dd>Eligible Digital Deluxe pre-orders: September 4, 2026, at 9 AM Pacific Time.</dd></div>
        </dl>
      </section>
      <section aria-labelledby="requirements-heading" className="game-info-section">
        <h2 id="requirements-heading">PC System Requirements</h2>
        <p>Steam requirements checked September 3, 2026. These are the publisher&apos;s listed specifications, not performance benchmarks from this wiki.</p>
        <dl className="facts-list">
          <div><dt>Operating system</dt><dd>Windows 11 64-bit; DirectX 12</dd></div>
          <div><dt>Minimum</dt><dd>Intel LGA 1200+ / AMD AM4+; 16 GB RAM; GTX 1660+ / RX 590+ / Arc A770+ (1080p at 30 fps)</dd></div>
          <div><dt>Recommended</dt><dd>Intel LGA 1700+ / AMD AM5+; 32 GB RAM; RTX 3000 series / RX 7000 series (4K at 30 fps)</dd></div>
          <div><dt>Storage / network</dt><dd>45 GB available space; SSD/NVME required; broadband Internet connection</dd></div>
        </dl>
        <p>The CPU entries above reproduce Steam&apos;s platform/socket labels; specific processor models are not identified there. Check the <a href={gameConfig.steamUrl}>current Steam listing</a> for updates.</p>
      </section>
      <section aria-labelledby="pending-heading" className="game-info-section">
        <h2 id="pending-heading">Awaiting Verification</h2>
        <p>Official Discord and YouTube links are temporarily hidden pending a direct availability check. The <a href="https://halloweengame.com/news/official-discord-server/">official Discord announcement</a> and <a href={gameConfig.officialWebsite}>game website</a> remain available as verified sources.</p>
        <p>Full crossplay and cross-progression rules, detailed character progression, rewards, controls, and tested escape strategies are awaiting confirmation in this wiki. No redemption-code system is confirmed.</p>
        <p>This independent fan-made website is not an official game resource. Launch dates and prices are based on the <a href="https://halloweengame.com/news/preorder/">official pre-order FAQ</a>; maps are based on the <a href="https://halloweengame.com/news/the-locations-of-halloween-the-game/">official map announcement</a>.</p>
      </section>
      {officialLinks.length > 0 ? (
        <section aria-labelledby="links-heading" className="game-info-section">
          <h2 id="links-heading">Official links</h2>
          <ul className="link-list">
            {officialLinks.map((link) => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
