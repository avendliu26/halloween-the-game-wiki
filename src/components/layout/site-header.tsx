import Link from "next/link";
import Image from "next/image";
import { ContentShell } from "@/components/layout/content-shell";
import { DesktopNav } from "@/components/navigation/desktop-nav";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { gameConfig } from "@/config/game";

export function SiteHeader() {
  return (
    <header className="site-header">
      <ContentShell className="site-header__content">
        <Link aria-label={`${gameConfig.wikiName} home`} className="site-header__brand" href="/">
          <Image alt="" height={40} priority src={gameConfig.logoPath} width={40} />
          <span>{gameConfig.wikiName}</span>
        </Link>
        <DesktopNav />
        <MobileNav />
      </ContentShell>
    </header>
  );
}
