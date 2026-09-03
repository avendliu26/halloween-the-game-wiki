import type { Metadata, Viewport } from "next";
import Script from "next/script";
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
  keywords: gameConfig.metadata?.keywords,
  manifest: "/site.webmanifest",
  // favicon.ico is supplied automatically by the App Router file convention.
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  }
};

export const viewport: Viewport = {
  // Hex equivalent of the existing primary hsl(24 95% 52%), shared with the manifest.
  themeColor: "#f96d10"
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
        {/* Keep GA4 global; enhanced measurement handles client-side page views. */}
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-8MR0VLN6L5', {
  allow_google_signals: false,
  allow_ad_personalization_signals: false
});`}
        </Script>
        <Script
          id="ga4-loader"
          src="https://www.googletagmanager.com/gtag/js?id=G-8MR0VLN6L5"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
