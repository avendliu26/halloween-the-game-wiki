import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PoliceRespawnQuickCheck } from "@/components/wiki/police-respawn-quick-check";

const choose = (exit: "Eliminated" | "Escaped", card: "Yes, I received the card" | "No card appeared") => {
  fireEvent.click(screen.getByRole("radio", { name: exit }));
  fireEvent.click(screen.getByRole("radio", { name: card }));
};

describe("PoliceRespawnQuickCheck", () => {
  it("uses semantic radio groups and waits for both answers", () => {
    render(<PoliceRespawnQuickCheck />);

    expect(screen.getByRole("group", { name: "How did active play end?" })).toBeVisible();
    expect(screen.getByRole("group", { name: "Did Police Reinforcements appear?" })).toBeVisible();
    expect(screen.getAllByRole("radio")).toHaveLength(4);
    expect(screen.getByText("Choose one option in each group to get your next action.")).toBeVisible();

    fireEvent.click(screen.getByRole("radio", { name: "Eliminated" }));
    expect(screen.getByText("Choose one option in each group to get your next action.")).toBeVisible();
  });

  it.each([
    ["Eliminated", "Yes, I received the card", "Choose the card, then follow the return prompt", /defeated Civilian may return/i],
    ["Eliminated", "No card appeared", "Stay in spectator play if you want another opportunity", /does not publish card odds or a fixed wait/i],
    ["Escaped", "Yes, I received the card", "Use the offered card, with an eligibility caveat", /does not explicitly confirm that escaped players qualify/i],
    ["Escaped", "No card appeared", "Do not assume an escaped player will receive a card", /no documented next step that can force/i]
  ] as const)("shows bounded guidance for %s / %s", (exit, card, title, evidence) => {
    render(<PoliceRespawnQuickCheck />);
    choose(exit, card);

    const result = screen.getByText(title).closest("div");
    expect(result).not.toBeNull();
    expect(within(result!).getByText("Officially confirmed:")).toBeVisible();
    expect(within(result!).getByText("Community-reported next action:")).toBeVisible();
    expect(within(result!).getByText(evidence)).toBeVisible();
    expect(screen.getByText(/CB-radio route/i)).toBeVisible();
  });

  it("links escaped players to the existing escape and spectator guides", () => {
    render(<PoliceRespawnQuickCheck />);
    choose("Escaped", "No card appeared");

    expect(screen.getByRole("link", { name: "Escape guide" })).toHaveAttribute("href", "/guides/how-to-escape");
    expect(screen.getByRole("link", { name: "Spectator activity guide" })).toHaveAttribute("href", "/guides/how-skill-checks-work");
  });
});
