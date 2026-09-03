import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Viewport } from "next";
import { describe, expect, it } from "vitest";
import * as layout from "@/app/layout";

describe("site icons", () => {
  it("advertises local browser and Apple icons plus the web manifest", () => {
    expect(layout.metadata).toMatchObject({
      manifest: "/site.webmanifest",
      icons: {
        icon: [
          { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
          { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
        ],
        apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
      }
    });
  });

  it.each([
    ["favicon-16x16.png", 16], ["favicon-32x32.png", 32],
    ["apple-touch-icon.png", 180], ["android-chrome-192x192.png", 192],
    ["android-chrome-512x512.png", 512]
  ] as const)("ships %s with its advertised dimensions", (name, size) => {
    const filename = path.resolve("public", name);
    expect(existsSync(filename)).toBe(true);
    const png = readFileSync(filename);
    expect(png.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([size, size]);
  });

  it("provides an ICO through the App Router file convention without a public duplicate", () => {
    expect(existsSync("src/app/favicon.ico")).toBe(true);
    expect(existsSync("public/favicon.ico")).toBe(false);
    const ico = readFileSync("src/app/favicon.ico");
    expect(ico.readUInt16LE(2)).toBe(1);
    expect(ico.readUInt16LE(4)).toBeGreaterThan(0);
  });

  it("uses Halloween branding, install icons and matching dark/orange browser colors", () => {
    expect(existsSync("public/site.webmanifest")).toBe(true);
    const manifest = JSON.parse(readFileSync("public/site.webmanifest", "utf8"));
    expect(manifest).toMatchObject({
      name: "Halloween: The Game Wiki", short_name: "Halloween Wiki",
      start_url: "/", display: "standalone",
      theme_color: "#f96d10", background_color: "#110f0d",
      icons: [
        { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
      ]
    });
    const viewport = (layout as typeof layout & { viewport?: Viewport }).viewport;
    expect(viewport?.themeColor).toBe(manifest.theme_color);
  });
});
