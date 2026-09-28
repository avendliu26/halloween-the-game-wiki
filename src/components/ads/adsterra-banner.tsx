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

  // The existing sandbox gives srcdoc an opaque origin. Observe from inside it;
  // do not weaken the sandbox or rely on the outer iframe's load event.
  const monitor = `(() => {
    let state = 'loading';
    let expired = false;
    let graceTimer;
    const report = (next) => {
      if (state === 'filled' || state === next) return;
      state = next;
      window.parent.postMessage({type:'adsterra-slot-status',state:next}, 'https://${productionHostname}');
      if (next === 'filled') window.clearTimeout(graceTimer);
    };
    const substantial = (element) => {
      const style = window.getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && box.width > 8 && box.height > 8;
    };
    const inspect = (root) => {
      let pending = false;
      for (const element of root.querySelectorAll('iframe,img,video,canvas,svg,a,div,span')) {
        if (!substantial(element)) continue;
        if (element.tagName === 'IFRAME') {
          // A sized remote frame can be loading or cross-origin. Even its load
          // event cannot prove fill: preserve it rather than risk an impression.
          try {
            const hasSource = element.srcdoc.trim() || (element.getAttribute('src') || '').trim().replace(/^about:blank$/, '');
            const inner = element.contentDocument;
            if (inner && inner.body) {
              const result = inspect(inner.body);
              if (result === 'filled') return result;
              pending = pending || Boolean(hasSource) || result === 'pending' || inner.readyState !== 'complete';
            } else if (hasSource) {
              pending = true;
            }
          } catch { pending = true; }
        } else if (element.tagName === 'IMG') {
          if (element.complete && element.naturalWidth > 8 && element.naturalHeight > 8) return 'filled';
          if (!element.complete && element.getAttribute('src')) pending = true;
        } else if (element.tagName === 'VIDEO') {
          if (element.readyState >= 2) return 'filled';
          pending = true;
        } else {
          const background = window.getComputedStyle(element).backgroundImage;
          const hasText = Array.from(element.childNodes).some(node => node.nodeType === 3 && node.textContent.trim());
          if (element.tagName === 'CANVAS' || element.tagName === 'svg' || hasText || (background && background !== 'none')) return 'filled';
        }
      }
      return pending ? 'pending' : 'empty';
    };
    const check = () => {
      if (state === 'filled' || !document.body) return;
      const result = inspect(document.body);
      if (result === 'filled') report('filled');
      else if (result === 'pending') report('loading');
      else if (expired) report('failed');
    };
    const onResource = (event) => {
      if (event.target.tagName === 'SCRIPT' && event.target.getAttribute('src') === ${JSON.stringify(invokeUrl)}) {
        if (event.type === 'error') expired = true;
        else graceTimer = window.setTimeout(() => { expired = true; check(); }, 60000);
      }
      check();
    };
    document.addEventListener('load', onResource, true);
    document.addEventListener('error', onResource, true);
    document.addEventListener('loadeddata', check, true);
    new window.MutationObserver(check).observe(document.documentElement, {childList:true,subtree:true,attributes:true,characterData:true});
  })();`;

  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;overflow:hidden;background:#110e0d}body{display:flex;justify-content:center;min-height:100vh}</style></head><body><script>${monitor}</script><script>window.atOptions=${JSON.stringify({ key: config.key, format: "iframe", height: config.height, width: config.width, params: {} })};</script><script src="${invokeUrl}"></script></body></html>`;
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
    container.dataset.adsterraState = "loading";
    container.style.minHeight = `${config.height}px`;
    const onMessage = (event: MessageEvent) => {
      if (event.source !== iframe.contentWindow || event.origin !== "null" || event.data?.type !== "adsterra-slot-status") return;
      const state: unknown = event.data.state;
      if (state !== "filled" && state !== "failed" && state !== "loading") return;
      if (container.dataset.adsterraState === "filled") return;
      container.dataset.adsterraState = state;
      container.style.minHeight = state === "failed" ? "0px" : `${config.height}px`;
    };
    window.addEventListener("message", onMessage);
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

    return () => {
      window.removeEventListener("message", onMessage);
      iframe.remove();
    };
  }, [active, config.height, config.width, size]);

  return (
    <div
      ref={containerRef}
      aria-label="Advertisement"
      className={`adsterra-banner adsterra-banner--${size}`}
      data-adsterra-enabled="true"
      data-adsterra-state="loading"
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
