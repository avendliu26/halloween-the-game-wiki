import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { locationVisuals, officialVideos } from "./media";

describe("official media registry", () => {
  it("uses only known YouTube IDs and local WebP posters", () => {
    expect(Object.keys(officialVideos)).toHaveLength(8);
    for (const video of Object.values(officialVideos)) {
      expect(video.id).toMatch(/^[A-Za-z0-9_-]{11}$/);
      expect(video.poster).toMatch(/^\/images\/.+\.webp$/);
      expect(fs.existsSync(path.join(process.cwd(), "public", video.poster))).toBe(true);
      expect(video.posterAlt.length).toBeGreaterThan(12);
    }
  });

  it("assigns one official video and one local still to each of four maps", () => {
    expect(Object.keys(locationVisuals)).toEqual([
      "east-haddonfield", "haddonfield-heights", "orange-grove-estates", "haddonfield-town-center"
    ]);
    for (const visual of Object.values(locationVisuals)) {
      expect(fs.existsSync(path.join(process.cwd(), "public", visual.image))).toBe(true);
      expect(officialVideos[visual.video]).toBeDefined();
    }
  });

  it("contains only the selected 22 optimized production originals", () => {
    const files = fs.readdirSync(path.join(process.cwd(), "public/images/official"));
    expect(files).toHaveLength(22);
    expect(files.every((file) => file.endsWith(".webp"))).toBe(true);
  });
});
