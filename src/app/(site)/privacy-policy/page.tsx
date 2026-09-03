import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/wiki/breadcrumbs";
import { gameConfig } from "@/config/game";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: "How this independent fan-made Halloween: The Game Wiki handles information and external links.",
  pathname: "/privacy-policy",
  siteUrl: gameConfig.siteUrl
});

export default function PrivacyPolicyPage() {
  return <article className="game-info-page">
    <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Privacy Policy" }]} />
    <header className="page-header"><h1>Privacy Policy</h1><p>Last updated: September 3, 2026</p></header>
    <section className="game-info-section"><h2>About this website</h2><p>{gameConfig.wikiName} is an independent fan-made website. It is not operated by, affiliated with, or endorsed by IllFonic, Gun Interactive, or the Halloween rights holders.</p></section>
    <section className="game-info-section"><h2>Information and storage</h2><p>This website has no accounts, comments, contact forms, or advertising. We use Google Analytics 4 to understand visits and improve the wiki. It collects information such as pages viewed, referring websites, and browser and device details, and may use cookies to distinguish visits. We do not intentionally send names, email addresses, or other directly identifying information to Google Analytics. Google signals and advertising personalization are disabled in our analytics configuration.</p><p>Learn more in <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Google&apos;s explanation of data use on partner sites</a>. You can restrict cookies in your browser or use the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics opt-out browser add-on</a>.</p><p>When the website is hosted, the hosting provider may process technical request information such as IP addresses, browser details, and request times to deliver and protect the service. Provider-specific retention and privacy details will be added when production hosting is configured.</p></section>
    <section className="game-info-section"><h2>External websites</h2><p>Official game, Steam, Discord, and YouTube links open services operated by third parties. Their own privacy policies apply when you visit them. Videos are linked, not embedded or rehosted.</p></section>
    <section className="game-info-section"><h2>Updates and contact</h2><p>This policy will be reviewed before adding hosting-specific disclosures or any data-collection features. A dedicated privacy contact has not yet been configured; it must be provided before a production launch. Do not send private information through public project discussions.</p></section>
  </article>;
}
