"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { gameConfig } from "@/config/game";
import type { GameConfig, NavigationItem } from "@/lib/config/schema";

const matchesRoute = (pathname: string, href: string): boolean =>
  pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

const isCurrentRoute = (pathname: string, item: NavigationItem): boolean =>
  matchesRoute(pathname, item.href) || Boolean(item.children?.some((child) => matchesRoute(pathname, child.href)));

export function DesktopNav({ config = gameConfig }: Readonly<{ config?: GameConfig }>) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation" className="desktop-nav">
      <ul>
        {config.navigation.map((item) => {
          const active = isCurrentRoute(pathname, item);

          if (item.children) {
            return (
              <li key={item.id}>
                <details className="desktop-nav__database">
                  <summary aria-current={active ? "page" : undefined}>{item.label}</summary>
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
      </ul>
    </nav>
  );
}
