"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gameConfig } from "@/config/game";
import type { GameConfig, NavigationItem } from "@/lib/config/schema";

const matchesRoute = (pathname: string, href: string): boolean =>
  pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

const isCurrentRoute = (pathname: string, item: NavigationItem): boolean =>
  matchesRoute(pathname, item.href) || Boolean(item.children?.some((child) => matchesRoute(pathname, child.href)));

export function DesktopNav({ config = gameConfig }: Readonly<{ config?: GameConfig }>) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        const trigger = navRef.current?.querySelector<HTMLElement>("details[open] > summary");
        setOpenMenu(null);
        trigger?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOutside, true);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside, true);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <nav aria-label="Primary navigation" className="desktop-nav" ref={navRef} onClick={(event) => {
      if (event.target instanceof Element && event.target.closest("a")) setOpenMenu(null);
    }}>
      <ul>
        {config.navigation.map((item) => {
          const active = isCurrentRoute(pathname, item);

          if (item.children) {
            return (
              <li key={item.id}>
                <details className="desktop-nav__database" open={openMenu === item.id}>
                  <summary aria-current={active ? "page" : undefined} onClick={(event) => {
                    // Keep native details toggling from competing with the shared state.
                    event.preventDefault();
                    setOpenMenu((current) => current === item.id ? null : item.id);
                  }}>{item.label}</summary>
                  <div className="desktop-nav__panel">
                    <ul aria-label={`${item.label} categories`}>
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <Link aria-current={matchesRoute(pathname, child.href) ? "page" : undefined} href={child.href}>
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              </li>
            );
          }

          return (
            <li key={item.id}>
              <Link aria-current={active ? "page" : undefined} href={item.href}>
                {item.label}
              </Link>
            </li>
          );
        })}
        {config.steamUrl ? <li className="desktop-nav__steam"><a className="steam-cta" href={config.steamUrl} target="_blank" rel="noopener noreferrer">Buy on Steam <span aria-hidden="true">↗</span></a></li> : null}
      </ul>
    </nav>
  );
}
