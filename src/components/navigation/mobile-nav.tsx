"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { gameConfig } from "@/config/game";
import type { GameConfig } from "@/lib/config/schema";

export function MobileNav({ config = gameConfig }: Readonly<{ config?: GameConfig }>) {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <div className="mobile-nav">
      <button
        aria-controls="mobile-wiki-navigation"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close wiki navigation" : "Open wiki navigation"}
        className="mobile-nav__trigger"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <span aria-hidden="true">{isOpen ? "×" : "☰"}</span>
      </button>
      {isOpen ? (
        <nav aria-label="Mobile navigation" className="mobile-nav__panel" id="mobile-wiki-navigation">
          <ul>
            {config.navigation.map((item) =>
              item.children ? (
                <li key={item.id}>
                  <details>
                    <summary>{item.label}</summary>
                    <ul>
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <Link href={child.href} onClick={close}>
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ) : (
                <li key={item.id}>
                  <Link href={item.href} onClick={close}>
                    {item.label}
                  </Link>
                </li>
              )
            )}
            {config.steamUrl ? <li><a className="steam-cta" href={config.steamUrl} target="_blank" rel="noopener noreferrer" onClick={close}>Buy on Steam <span aria-hidden="true">↗</span></a></li> : null}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
