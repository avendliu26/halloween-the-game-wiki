import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ResearchArticle } from "./research-article";
import { DesktopNav } from "../navigation/desktop-nav";
import { MobileNav } from "../navigation/mobile-nav";
import { compileGuide, parseGuideSource } from "@/lib/content/guides";

vi.mock("next/navigation", async (importOriginal) => ({
  ...await importOriginal<typeof import("next/navigation")>(), usePathname: () => "/"
}));

describe("shared article improvements", () => {
  it("places a single TOC and existing Related Pages in one sidebar", async () => {
    const { container } = render(await ResearchArticle({ slug: "release-date" }));
    const sidebar = screen.getByRole("complementary", { name: "Page sidebar" });
    expect(within(sidebar).getByRole("heading", { name: "Related Pages" })).toHaveAttribute("id", "related-pages");
    expect(screen.getAllByRole("heading", { name: "Related Pages" })).toHaveLength(1);
    expect(container.querySelector("#related-links #related-pages")).not.toBeNull();
    expect(screen.getAllByText(/on this page/i)).toHaveLength(1);
    expect(within(sidebar).getByRole("heading", { name: "Game Info" })).toBeVisible();
    expect(within(sidebar).getByRole("link", { name: "Official Website" })).toHaveAttribute("rel", "noopener noreferrer");
    for (const link of container.querySelectorAll<HTMLAnchorElement>('.table-of-contents a')) {
      expect(container.querySelector(`[id="${link.hash.slice(1)}"]`)).not.toBeNull();
    }
  });
  it("moves only pure related-link lists and keeps source headings after them", async () => {
    const record = parseGuideSource('---\nslug: test\ntitle: Test\ndescription: Test\nupdatedAt: "2026-09-03"\ntags: []\nrelated: []\n---\n## Overview\nBody\n\n## Related Pages\n- [Platform details](/platforms)\n\n## Sources\nEvidence', "test");
    const compiled = await compileGuide(record, { moveRelatedToSidebar: true });
    expect(compiled.relatedPages).toEqual([{ title: "Platform details", href: "/platforms" }]);
    render(compiled.content);
    expect(screen.queryByRole("heading", { name: "Related Pages" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sources" })).toHaveAttribute("id", "sources");
    expect(screen.getByText("Evidence")).toBeVisible();
  });
  it.each(["editions", "platforms"])("keeps details and adds three %s summary cards", async (slug) => {
    const { container } = render(await ResearchArticle({ slug }));
    expect(container.querySelectorAll('.page-summary-card')).toHaveLength(3);
    expect(screen.getByRole("table")).toBeVisible();
  });
  it.each([
    "- [Platforms](/platforms) plus an important qualification",
    "- [Platforms](/platforms)\n\nKeep this explanation.",
    "- [Official source](https://halloweengame.com/)"
  ])("preserves related sections with content that cannot be safely moved: %s", async (body) => {
    const record = parseGuideSource(`---\nslug: test\ntitle: Test\ndescription: Test\nupdatedAt: "2026-09-03"\ntags: []\nrelated: []\n---\n## Related Pages\n${body}`, "test");
    const compiled = await compileGuide(record, { moveRelatedToSidebar: true });
    expect(compiled.relatedPages).toEqual([]);
    render(compiled.content);
    expect(screen.getByRole("heading", { name: "Related Pages" })).toHaveAttribute("id", "related-pages");
    expect(screen.getByRole("link")).toBeVisible();
  });
});

describe("Steam navigation", () => {
  it("offers a safe external purchase link at the end of desktop navigation", () => {
    render(<DesktopNav />);
    const links = screen.getAllByRole("link");
    const steam = screen.getByRole("link", { name: /buy on steam/i });
    expect(links.at(-1)).toBe(steam);
    expect(steam).toHaveAttribute("href", "https://store.steampowered.com/app/3219630/Halloween_The_Game/");
    expect(steam).toHaveAttribute("target", "_blank");
    expect(steam).toHaveAttribute("rel", "noopener noreferrer");
  });
  it("exposes Steam inside the mobile menu rather than crowding the closed header", () => {
    render(<MobileNav />);
    expect(screen.queryByRole("link", { name: /buy on steam/i })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /open wiki navigation/i }));
    expect(screen.getByRole("link", { name: /buy on steam/i })).toHaveAttribute("target", "_blank");
  });
});
