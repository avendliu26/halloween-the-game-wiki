import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { ContentShell } from "@/components/layout/content-shell";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { gameConfig } from "@/config/game";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: gameConfig.metadata?.title ?? gameConfig.wikiName,
    template: `%s | ${gameConfig.wikiName}`
  },
  description: gameConfig.metadata?.description ?? gameConfig.description,
  keywords: gameConfig.metadata?.keywords
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  const themeStyle = {
    "--color-background": gameConfig.theme.background,
    "--color-surface": gameConfig.theme.surface,
    "--color-surface-raised": gameConfig.theme.surfaceRaised,
    "--color-text": gameConfig.theme.text,
    "--color-text-muted": gameConfig.theme.textMuted,
    "--color-primary": gameConfig.theme.primary,
    "--color-primary-contrast": gameConfig.theme.primaryContrast,
    "--color-secondary": gameConfig.theme.secondary,
    "--color-border": gameConfig.theme.border
  } as CSSProperties;

  return (
    <html lang={gameConfig.locale} style={themeStyle}>
      <body>
        <SiteHeader />
        <main className="site-main">
          <ContentShell>{children}</ContentShell>
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
