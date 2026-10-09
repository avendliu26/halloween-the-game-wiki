"use client";

import { useId, useState } from "react";

type ExitState = "eliminated" | "escaped";
type CardState = "card" | "no-card";

type Result = Readonly<{
  title: string;
  official: string;
  reported: string;
  links: ReadonlyArray<Readonly<{ href: string; label: string }>>;
}>;

const results: Record<`${ExitState}-${CardState}`, Result> = {
  "eliminated-card": {
    title: "Choose the card, then follow the return prompt",
    official: "IllFonic confirms that a defeated Civilian may return as a Sheriff's Deputy or Dr. Loomis, but does not publish the Deputy selection rules.",
    reported: "Select Police Reinforcements and follow the interface prompt. The card is the community-reported Deputy route; receiving or selecting it does not guarantee that the return will complete.",
    links: [
      { href: "/guides/how-skill-checks-work", label: "Spectator activity guide" },
      { href: "/guides/how-to-play", label: "Deputy role basics" }
    ]
  },
  "eliminated-no-card": {
    title: "Stay in spectator play if you want another opportunity",
    official: "IllFonic confirms that defeated Civilians can support teammates and may return, but does not publish card odds or a fixed wait.",
    reported: "Keep using the spectator activities the current interface offers and check later reward choices. More attempts do not prove that the card chance rises or that a return will eventually happen.",
    links: [{ href: "/guides/how-skill-checks-work", label: "Spectator activity guide" }]
  },
  "escaped-card": {
    title: "Use the offered card, with an eligibility caveat",
    official: "IllFonic's overview confirms returns after Civilian defeat; it does not explicitly confirm that escaped players qualify for the Deputy route.",
    reported: "Guides and players report that escaped spectators can select Police Reinforcements. Follow the interface prompt if you want to try, but the offer does not establish an officially documented rule or guarantee a completed return.",
    links: [
      { href: "/guides/how-to-escape", label: "Escape guide" },
      { href: "/guides/how-skill-checks-work", label: "Spectator activity guide" }
    ]
  },
  "escaped-no-card": {
    title: "Do not assume an escaped player will receive a card",
    official: "Escape eligibility for a Deputy return is not explicitly confirmed by IllFonic, and no card odds or fixed timer are published.",
    reported: "If you want to try the community-reported route, remain in the match and use only the spectator options shown to you. No card means there is no documented next step that can force a Deputy return.",
    links: [
      { href: "/guides/how-to-escape", label: "Escape guide" },
      { href: "/guides/how-skill-checks-work", label: "Spectator activity guide" }
    ]
  }
};

export function PoliceRespawnQuickCheck() {
  const instanceId = useId();
  const [exitState, setExitState] = useState<ExitState | "">("");
  const [cardState, setCardState] = useState<CardState | "">("");
  const result = exitState && cardState ? results[`${exitState}-${cardState}`] : undefined;
  const titleId = `${instanceId}-title`;

  return (
    <section aria-labelledby={titleId} className="police-respawn-check">
      <div className="police-respawn-check__header">
        <p className="police-respawn-check__eyebrow">Match-state helper</p>
        <h3 id={titleId}>Police Respawn Quick Check</h3>
        <p>Select what happened in your match to see the evidence-labeled next action.</p>
      </div>

      <div className="police-respawn-check__questions">
        <fieldset>
          <legend>How did active play end?</legend>
          <label>
            <input
              checked={exitState === "eliminated"}
              name={`${instanceId}-exit`}
              onChange={() => setExitState("eliminated")}
              type="radio"
            />
            Eliminated
          </label>
          <label>
            <input
              checked={exitState === "escaped"}
              name={`${instanceId}-exit`}
              onChange={() => setExitState("escaped")}
              type="radio"
            />
            Escaped
          </label>
        </fieldset>

        <fieldset>
          <legend>Did Police Reinforcements appear?</legend>
          <label>
            <input
              checked={cardState === "card"}
              name={`${instanceId}-card`}
              onChange={() => setCardState("card")}
              type="radio"
            />
            Yes, I received the card
          </label>
          <label>
            <input
              checked={cardState === "no-card"}
              name={`${instanceId}-card`}
              onChange={() => setCardState("no-card")}
              type="radio"
            />
            No card appeared
          </label>
        </fieldset>
      </div>

      <div aria-atomic="true" aria-live="polite" className="police-respawn-check__result">
        {result ? (
          <>
            <h4>{result.title}</h4>
            <p><strong>Officially confirmed:</strong> {result.official}</p>
            <p><strong>Community-reported next action:</strong> {result.reported}</p>
            <nav aria-label="Relevant guides">
              {result.links.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}
            </nav>
          </>
        ) : (
          <p>Choose one option in each group to get your next action.</p>
        )}
      </div>

      <p className="police-respawn-check__warning">
        Dr. Loomis uses a separate community-reported CB-radio route. Radio conditions are not requirements or a timer for a Sheriff’s Deputy return.
      </p>
    </section>
  );
}
