import { afterEach, describe, expect, it, vi } from "vitest";

const productionOrigin = "https://halloween-thegame.wiki";
const publishedPaths = [
  "/", "/guides", "/characters", "/locations", "/game-info", "/community",
  "/release-date", "/editions", "/physical-editions", "/platforms", "/system-requirements",
  "/guides/beginner-guide", "/guides/how-to-play",
  "/characters/michael-myers", "/characters/civilians",
  "/locations/east-haddonfield", "/locations/haddonfield-heights",
  "/locations/orange-grove-estates", "/locations/haddonfield-town-center",
  "/privacy-policy", "/terms-of-service"
];

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("production sitemap and robots", () => {
  it.each([undefined, "", "   ", productionOrigin])(
    "publishes all current pages even when NEXT_PUBLIC_SITE_URL is %s",
    async (siteUrl) => {
      vi.stubEnv("NEXT_PUBLIC_SITE_URL", siteUrl);
      vi.resetModules();
      const { default: sitemap } = await import("./sitemap");
      const { default: robots } = await import("./robots");
      const urls = sitemap().map((entry) => entry.url);

      expect(urls.length).toBeGreaterThan(0);
      expect(urls).toEqual(expect.arrayContaining(publishedPaths.map((pathname) => productionOrigin + pathname)));
      expect(new Set(urls).size).toBe(urls.length);
      for (const url of urls) {
        const parsed = new URL(url);
        expect(parsed.origin).toBe(productionOrigin);
        expect(parsed.search).toBe("");
        expect(parsed.hash).toBe("");
        expect(parsed.pathname).not.toMatch(/^\/(?:api|admin|_next|_not-found|_global-error|404|images|weapons|bosses|skills|items|quests|maps|michael-myers)(?:\/|$)/);
        expect(parsed.pathname).not.toMatch(/\.[a-z0-9]+$/i);
      }
      expect(robots()).toMatchObject({
        rules: { userAgent: "*", allow: "/" },
        sitemap: "https://halloween-thegame.wiki/sitemap.xml"
      });
    }
  );
});
