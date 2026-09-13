import { describe, expect, it } from "vitest";
import nextConfig from "../../next.config";

describe("legacy SEO redirects", () => {
  it("permanently redirects the historical English crossplay URL to its canonical page", async () => {
    const redirects = await nextConfig.redirects?.();

    expect(redirects).toContainEqual({
      source: "/en/modes/halloween-the-game-crossplay",
      destination: "/crossplay",
      statusCode: 301
    });
  });
});
