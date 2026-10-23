import Link from "next/link";
import type { ReactNode } from "react";
import { gameConfig } from "@/config/game";
import type { GuideHeading } from "@/lib/content/guides";
import type { SidebarLink } from "@/lib/content/guide-mdx";
import { formatDate } from "@/lib/utils/format";
import { TableOfContents } from "./table-of-contents";

type SidebarProps = Readonly<{
  headings?: readonly GuideHeading[];
  related?: readonly SidebarLink[];
  relatedHeading?: string;
  details?: ReactNode;
}>;

export function PageSidebar({ headings = [], related = [], relatedHeading = "Related Pages", details }: SidebarProps) {
  const facts = [
    { label: "Release Date", value: gameConfig.releaseDate ? formatDate(gameConfig.releaseDate) : undefined },
    { label: "Platforms", value: gameConfig.platforms?.join(", ") },
    { label: "Developer", value: gameConfig.developer },
    { label: "Genre", value: gameConfig.content?.homepage.aboutGame?.stats.find((fact) => fact.label === "Genre")?.value }
  ].filter((fact) => fact.value);
  const links = [...new Map(related.map((link) => [link.href, link])).values()];
  const officialLinks = [
    { title: "Official Website", href: gameConfig.officialWebsite },
    { title: "Steam", href: gameConfig.steamUrl }
  ].filter((link): link is { title: string; href: string } => Boolean(link.href));

  return <aside aria-label="Page sidebar" className="page-sidebar">
    <TableOfContents headings={headings} />
    <div className="page-sidebar__modules">
      {links.length ? <section className="sidebar-panel" id="related-links" aria-labelledby="related-pages">
        <h2 id="related-pages">{relatedHeading}</h2>
        <ul>{links.map((link) => <li key={link.href}><Link href={link.href}>{link.title}</Link></li>)}</ul>
      </section> : null}
      {details}
      {facts.length ? <section className="sidebar-panel" aria-labelledby="sidebar-game-info">
        <h2 id="sidebar-game-info">Game Info</h2>
        <dl>{facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
        <Link href="/game-info">Game overview</Link>
      </section> : null}
      {officialLinks.length ? <section className="sidebar-panel" aria-labelledby="sidebar-official-links">
        <h2 id="sidebar-official-links">Official Links</h2>
        <ul>{officialLinks.map((link) => <li key={link.href}><a href={link.href} target="_blank" rel="noopener noreferrer">{link.title}</a></li>)}</ul>
      </section> : null}
    </div>
  </aside>;
}

export function WikiPageLayout({ children, ...sidebar }: SidebarProps & { children: ReactNode }) {
  return <div className="wiki-page-layout">
    <PageSidebar {...sidebar} />
    <div className="wiki-page-layout__main">{children}</div>
  </div>;
}
