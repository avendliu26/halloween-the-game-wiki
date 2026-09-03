import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TableOfContents } from "@/components/wiki/table-of-contents";
import { extractHeadings } from "@/lib/content/guides";

describe("guide table of contents", () => {
  it("extracts stable H2 and H3 anchors", () => {
    expect(extractHeadings("## First Route\n### Spend Resolve")).toEqual([
      { depth: 2, text: "First Route", id: "first-route" },
      { depth: 3, text: "Spend Resolve", id: "spend-resolve" }
    ]);
  });

  it("suffixes repeated heading anchors in document order", () => {
    expect(extractHeadings("## First Route\n### First Route\n## First Route")).toEqual([
      { depth: 2, text: "First Route", id: "first-route" },
      { depth: 3, text: "First Route", id: "first-route-2" },
      { depth: 2, text: "First Route", id: "first-route-3" }
    ]);
  });

  it("allocates a unique ID when a suffixed heading collides with an emitted ID", () => {
    expect(extractHeadings("## First Route\n## First Route\n## First Route-2")).toEqual([
      { depth: 2, text: "First Route", id: "first-route" },
      { depth: 2, text: "First Route", id: "first-route-2" },
      { depth: 2, text: "First Route-2", id: "first-route-2-2" }
    ]);
  });

  it("ignores headings inside backtick and tilde fenced code blocks", () => {
    const body = "```md\n## Backtick example\n```\n\n~~~~md\n### Tilde example\n~~~~\n\n## Live heading";

    expect(extractHeadings(body)).toEqual([
      { depth: 2, text: "Live heading", id: "live-heading" }
    ]);
  });

  it("renders semantic anchor navigation", () => {
    render(<TableOfContents headings={[{ depth: 2, text: "First Route", id: "first-route" }]} />);

    expect(screen.getByRole("link", { name: "First Route" })).toHaveAttribute("href", "#first-route");
    expect(screen.getAllByText(/on this page/i)).toHaveLength(1);
  });
});
