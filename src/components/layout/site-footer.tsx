import { ContentShell } from "@/components/layout/content-shell";
import { gameConfig } from "@/config/game";
import type { GameConfig } from "@/lib/config/schema";
import Link from "next/link";

export function SiteFooter({ config = gameConfig }: Readonly<{ config?: GameConfig }>) {
  const configuredExternalLinks = [
    config.officialWebsite ? { href: config.officialWebsite, label: config.content.footer?.playGame ?? "Official website" } : null,
    config.steamUrl ? { href: config.steamUrl, label: "Steam" } : null,
    config.discordUrl ? { href: config.discordUrl, label: "Official Discord" } : null,
    config.youtubeUrl ? { href: config.youtubeUrl, label: "Official YouTube" } : null
  ].filter((link): link is { href: string; label: string } => link !== null);

  return (
    <footer className="site-footer">
      <ContentShell className="site-footer__content">
        {config.content.footer ? <div className="home-section">
          <h2>{config.content.footer.aboutTitle}</h2>
          <p>{config.content.footer.about}</p>
          <p>{config.content.footer.description}</p>
        </div> : null}
        <p>© {new Date().getFullYear()} {config.wikiName}.</p>
        {config.content.footerDisclaimer ? <p>{config.content.footerDisclaimer}</p> : null}
        {configuredExternalLinks.length ? (
          <ul aria-label="External links">
            {configuredExternalLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} rel="noopener noreferrer" target="_blank">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
        <ul aria-label="Legal links">
          <li><Link href="/privacy-policy">Privacy Policy</Link></li>
          <li><Link href="/terms-of-service">Terms of Service</Link></li>
        </ul>
      </ContentShell>
    </footer>
  );
}
