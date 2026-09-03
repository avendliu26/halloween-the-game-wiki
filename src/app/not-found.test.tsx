import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import NotFound from "./not-found";
import { categoryDefinitions } from "@/config/categories";

it("only links to supported entry points from the recovery page", () => {
  render(<NotFound />);
  const supported = ["/", "/guides", "/game-info", ...categoryDefinitions.map((category) => `/${category.slug}`)];
  for (const link of screen.getAllByRole("link")) {
    expect(supported).toContain(link.getAttribute("href"));
  }
});
