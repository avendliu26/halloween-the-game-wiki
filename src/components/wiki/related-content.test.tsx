import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RelatedContent } from "@/components/wiki/related-content";

describe("RelatedContent", () => {
  it("uses a page-specific heading when one is supplied", () => {
    render(
      <RelatedContent
        heading="Related Guides"
        related={[{ kind: "guide", slug: "field-notes", title: "Field Notes", summary: "Start safely.", href: "/guides/field-notes", image: undefined }]}
      />
    );

    expect(screen.getByRole("heading", { level: 2, name: "Related Guides" })).toBeVisible();
  });
});
