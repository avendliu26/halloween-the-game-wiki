"use client";

import { useEffect, useRef, useState } from "react";

export const adsterraBannerConfig = {
  "728x90": {
    key: "bdf6453086827d9b072bf382a560dab5",
    width: 728,
    height: 90
  },
  "300x250": {
    key: "aa4fc7d693f25332cf75e2bb9980809d",
    width: 300,
    height: 250
  },
  "320x50": {
    key: "004f3509d8c4048f86d20e1eb0fb5555",
    width: 320,
    height: 50
  }
} as const;

export type AdsterraBannerSize = keyof typeof adsterraBannerConfig;

const productionHostname = "halloween-thegame.wiki";

export const isProductionAdHost = (hostname: string): boolean => hostname === productionHostname;

const buildFrameDocument = (size: AdsterraBannerSize): string => {
  const config = adsterraBannerConfig[size];
  const invokeUrl = `https://www.highrevenueformat.com/${config.key}/invoke.js`;

  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}body{display:flex;justify-content:center;min-height:100vh}</style></head><body><script>window.atOptions=${JSON.stringify({ key: config.key, format: "iframe", height: config.height, width: config.width, params: {} })};</script><script src="${invokeUrl}"></script></body></html>`;
};

type AdsterraBannerProps = Readonly<{
  size: AdsterraBannerSize;
  active?: boolean;
}>;

export function AdsterraBanner({ size, active = true }: AdsterraBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const config = adsterraBannerConfig[size];

  useEffect(() => {
    const container = containerRef.current;
    const eligible = isProductionAdHost(window.location.hostname);
    if (container) container.dataset.adsterraEnabled = eligible ? "true" : "false";

    if (!container || !eligible || !active || container.querySelector("iframe")) {
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.title = "Advertisement";
    iframe.width = String(config.width);
    iframe.height = String(config.height);
    iframe.loading = "lazy";
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.setAttribute("aria-label", "Advertisement");
    iframe.style.display = "block";
    iframe.style.width = "100%";
    iframe.style.maxWidth = `${config.width}px`;
    iframe.style.height = `${config.height}px`;
    iframe.style.border = "0";
    iframe.srcdoc = buildFrameDocument(size);
    container.appendChild(iframe);

    return () => iframe.remove();
  }, [active, config.height, config.width, size]);

  return (
    <div
      ref={containerRef}
      aria-label="Advertisement"
      className={`adsterra-banner adsterra-banner--${size}`}
      data-adsterra-enabled="true"
      data-adsterra-size={size}
      style={{ minHeight: `${config.height}px` }}
    />
  );
}

export function ResponsiveAdsterraTop() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mediaQuery = window.matchMedia("(max-width: 47.999rem)");
    const update = () => setIsMobile(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return (
    <div className="adsterra-responsive-top" aria-label="Advertisement">
      <div className="adsterra-responsive-top__desktop">
        <AdsterraBanner active={isMobile === false} size="728x90" />
      </div>
      <div className="adsterra-responsive-top__mobile">
        <AdsterraBanner active={isMobile === true} size="320x50" />
      </div>
    </div>
  );
}
