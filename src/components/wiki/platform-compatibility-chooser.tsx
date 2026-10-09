"use client";

import { useId, useState } from "react";

type PlatformId =
  | "ps5"
  | "ps4"
  | "xbox-series"
  | "xbox-one"
  | "windows"
  | "macos"
  | "switch";

type PlatformResult = Readonly<{
  label: string;
  status: "available" | "not-listed";
  evidence: string;
  purchaseLinks?: ReadonlyArray<Readonly<{ href: string; label: string }>>;
  subscription?: string;
  entitlement?: string;
}>;

const OFFICIAL_PLATFORM_ANNOUNCEMENT =
  "https://halloweengame.com/news/the-locations-of-halloween-the-game/";

const supportedCrossplay =
  "Crossplay connects PS5, Xbox Series X|S, and Windows PC players. Crossplay does not confirm cross-progression, cross-save, or shared purchases between platforms.";

const platformResults: Record<PlatformId, PlatformResult> = {
  ps5: {
    label: "PlayStation 5",
    status: "available",
    evidence:
      "The official platform list and PlayStation Store list a native PS5 version. The PlayStation listing also identifies one-player offline play.",
    purchaseLinks: [
      {
        href: "https://store.playstation.com/en-us/concept/10014718/",
        label: "View on PlayStation Store"
      }
    ],
    subscription:
      "PS Plus is required for online play. That multiplayer requirement is separate from buying the game and does not say the game is included with PS Plus."
  },
  ps4: {
    label: "PlayStation 4",
    status: "not-listed",
    evidence:
      "No official native PS4 version is listed. The current official platform list names PS5, Xbox Series X|S, and Windows PC; this is a statement about the versions listed now, not future availability or remote-play options."
  },
  "xbox-series": {
    label: "Xbox Series X|S",
    status: "available",
    evidence:
      "The official platform list and Xbox Store explicitly list Xbox Series X|S support.",
    purchaseLinks: [
      {
        href: "https://www.xbox.com/en-US/games/store/halloween-the-game/9nl5n20r06dv",
        label: "View on Xbox Store"
      }
    ],
    subscription:
      "Console online multiplayer requires a qualifying Game Pass subscription, sold separately. That requirement does not say the game itself is included in Game Pass.",
    entitlement:
      "The Xbox listing does not establish that an Xbox console purchase grants a Windows PC copy."
  },
  "xbox-one": {
    label: "Xbox One",
    status: "not-listed",
    evidence:
      "No official native Xbox One version is listed. The current official platform list names Xbox Series X|S, not Xbox One; this is a statement about the versions listed now, not future availability or remote-play options."
  },
  windows: {
    label: "Windows PC",
    status: "available",
    evidence:
      "The official platform list names Windows PC, with supported purchase options on Steam and Epic Games Store.",
    purchaseLinks: [
      {
        href: "https://store.steampowered.com/app/3219630/Halloween_The_Game/",
        label: "View on Steam"
      },
      {
        href: "https://store.epicgames.com/p/halloween-f3e2dd?lang=en-US",
        label: "View on Epic Games Store"
      }
    ],
    entitlement:
      "PC and console purchases are separate unless a store explicitly states otherwise; no Xbox-to-PC entitlement is confirmed here."
  },
  macos: {
    label: "macOS",
    status: "not-listed",
    evidence:
      "No official native macOS version is listed. The official PC listings name Windows; this is a statement about the versions listed now, not future availability or streaming options."
  },
  switch: {
    label: "Nintendo Switch",
    status: "not-listed",
    evidence:
      "No official native Nintendo Switch version is listed. The current official platform list does not include Switch; this is not a prediction about a future release."
  }
};

const platformOptions = Object.entries(platformResults) as Array<[PlatformId, PlatformResult]>;

export function PlatformCompatibilityChooser() {
  const instanceId = useId();
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId | "">("");
  const result = selectedPlatform ? platformResults[selectedPlatform] : undefined;
  const titleId = `${instanceId}-title`;
  const helperId = `${instanceId}-helper`;

  return (
    <section aria-labelledby={titleId} className="platform-compatibility">
      <header className="platform-compatibility__header">
        <p className="platform-compatibility__eyebrow">Device checker</p>
        <h2 id={titleId}>Can I play Halloween: The Game on my device?</h2>
        <p id={helperId}>
          Choose a device for the currently documented native version, official purchase links, and
          online-play requirements.
        </p>
      </header>

      <fieldset aria-describedby={helperId} className="platform-compatibility__options">
        <legend>Choose your platform</legend>
        <div className="platform-compatibility__option-grid">
          {platformOptions.map(([platformId, platform]) => (
            <label key={platformId}>
              <input
                checked={selectedPlatform === platformId}
                name={`${instanceId}-platform`}
                onChange={() => setSelectedPlatform(platformId)}
                type="radio"
                value={platformId}
              />
              <span>{platform.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div
        aria-atomic="true"
        aria-live="polite"
        className="platform-compatibility__result"
        role="status"
      >
        {result ? (
          <>
            <div className="platform-compatibility__status-line">
              <p className={`platform-compatibility__badge platform-compatibility__badge--${result.status}`}>
                {result.status === "available" ? "Available" : "No official native version listed"}
              </p>
              <h3>{result.label}</h3>
            </div>
            <p>{result.evidence}</p>

            {result.purchaseLinks ? (
              <nav aria-label={`Official ${result.label} purchase options`}>
                {result.purchaseLinks.map((link) => (
                  <a href={link.href} key={link.href} rel="noopener noreferrer" target="_blank">
                    {link.label}
                  </a>
                ))}
              </nav>
            ) : (
              <a
                className="platform-compatibility__source"
                href={OFFICIAL_PLATFORM_ANNOUNCEMENT}
                rel="noopener noreferrer"
                target="_blank"
              >
                Review the official platform list
              </a>
            )}

            {result.subscription ? (
              <p><strong>Online multiplayer:</strong> {result.subscription}</p>
            ) : null}
            {result.entitlement ? (
              <p><strong>Purchase scope:</strong> {result.entitlement}</p>
            ) : null}
            {result.status === "available" ? (
              <p><strong>Crossplay, not cross-progression:</strong> {supportedCrossplay}</p>
            ) : null}
          </>
        ) : (
          <p>Select one of the seven devices above to see its current official status.</p>
        )}
      </div>

      <p className="platform-compatibility__footnote">
        Store links use US-facing listings. Availability, prices, and subscription terms can vary by
        account region.
      </p>
    </section>
  );
}
