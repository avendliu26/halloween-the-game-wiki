"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gameConfig } from "@/config/game";
import type { GameConfig } from "@/lib/config/schema";

export function MobileNav({ config = gameConfig }: Readonly<{ config?: GameConfig }>) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDetailsElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const matchesRoute = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  const close = () => {
    if (menuRef.current) menuRef.current.open = false;
  };

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menuRef.current?.open) {
        close();
        triggerRef.current?.focus();
      }
    };
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) close();
    };

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, []);

  return (
    <details className="mobile-nav" ref={menuRef}>
      <summary
        aria-controls="mobile-wiki-navigation"
        aria-label="Wiki navigation"
        className="mobile-nav__trigger"
        ref={triggerRef}
        role="button"
      >
        <span className="mobile-nav__icon" aria-hidden="true">☰</span>
        <span>Menu</span>
      </summary>
        <nav aria-label="Mobile navigation" className="mobile-nav__panel" id="mobile-wiki-navigation">
          {config.name === "Halloween: The Game" ? <Link className="mobile-nav__start" href="/guides/how-to-play" onClick={close}>
            <small>NEW TO HADDONFIELD?</small>
            <strong>Start your first match <span aria-hidden="true">↗</span></strong>
          </Link> : null}
          <ul>
            {config.navigation.map((item) =>
              item.children ? (
                <li key={item.id}>
                  <details open={item.children.some((child) => matchesRoute(child.href))}>
                    <summary>{item.label}</summary>
                    <ul>
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <Link aria-current={matchesRoute(child.href) ? "page" : undefined} href={child.href} onClick={close}>
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ) : (
                <li key={item.id}>
                  <Link aria-current={matchesRoute(item.href) ? "page" : undefined} href={item.href} onClick={close}>
                    {item.label}
                  </Link>
                </li>
              )
            )}
            {config.steamUrl ? <li><a className="steam-cta" href={config.steamUrl} target="_blank" rel="noopener noreferrer" onClick={close}>Buy on Steam <span aria-hidden="true">↗</span></a></li> : null}
          </ul>
        </nav>
    </details>
  );
}
