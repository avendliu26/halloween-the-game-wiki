import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/wiki/breadcrumbs";
import { gameConfig } from "@/config/game";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Service",
  description: "Terms for using the independent fan-made Halloween: The Game Wiki and its informational content.",
  pathname: "/terms-of-service",
  siteUrl: gameConfig.siteUrl
});

export default function TermsOfServicePage() {
  return <article className="game-info-page">
    <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Terms of Service" }]} />
    <header className="page-header"><h1>Terms of Service</h1><p>Last updated: September 3, 2026</p></header>
    <section className="game-info-section"><h2>Independent fan-made resource</h2><p>{gameConfig.wikiName} provides informational content for players. It is not an official website, official partner, or an approved or owned service of IllFonic or Gun Interactive.</p></section>
    <section className="game-info-section"><h2>Accuracy and availability</h2><p>Game details, release timing, pricing, and platform features can change. Pre-launch pages distinguish confirmed information from details awaiting verification. Check the official game channels and storefronts before relying on purchase or compatibility information.</p><p>We aim to correct errors, but do not guarantee complete, uninterrupted, or error-free content. Nothing here guarantees game performance or particular gameplay outcomes.</p></section>
    <section className="game-info-section"><h2>Intellectual property</h2><p>Halloween, Michael Myers, game names, trademarks, and official materials belong to their respective rights holders. This site does not claim ownership of those rights. Local placeholder graphics are fan-made, clearly labeled, and are not official screenshots or logos.</p></section>
    <section className="game-info-section"><h2>External services and responsible use</h2><p>Linked storefronts and social services have their own terms. This wiki does not sell the game, process payments, manage game accounts, or provide customer support for the game. Do not misuse the website or attempt to disrupt its operation.</p></section>
    <section className="game-info-section"><h2>Changes</h2><p>These terms may be updated as the website changes. Production operator and contact details remain to be configured before public deployment. These terms do not limit rights that cannot be excluded under applicable law.</p></section>
  </article>;
}
