import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import * as assetValidation from "@/lib/validation/assets";

const fixturePublic = path.resolve("src/test/fixtures/public");
const assertLocalImageExists = (assetValidation as typeof assetValidation & {
  assertLocalImageExists?: (imagePath: string, source: string, publicDirectory?: string) => void;
}).assertLocalImageExists;

const temporaryDirectories: string[] = [];

const createFixturePublicDirectory = (): string => {
  const directory = mkdtempSync(path.join(tmpdir(), "arpg-wiki-assets-"));
  temporaryDirectories.push(directory);
  mkdirSync(path.join(directory, "images", "directory.svg"), { recursive: true });
  writeFileSync(path.join(directory, "outside.svg"), "fixture");
  symlinkSync(path.join(directory, "outside.svg"), path.join(directory, "images", "escaped.svg"));
  return directory;
};

afterEach(() => {
  temporaryDirectories.splice(0).forEach((directory) => rmSync(directory, { force: true, recursive: true }));
});

describe("assertLocalImageExists", () => {
  it("names the source and missing local path", () => {
    expect(() => assertLocalImageExists?.("/images/missing.webp", "weapons/test-item", fixturePublic))
      .toThrow(/weapons\/test-item.*missing.webp/);
  });

  it("accepts a regular file below public/images", () => {
    expect(() => assertLocalImageExists?.("/images/present.svg", "weapons/test-item", fixturePublic)).not.toThrow();
  });

  it("rejects a directory masquerading as an image", () => {
    const publicDirectory = createFixturePublicDirectory();
    expect(() => assertLocalImageExists?.("/images/directory.svg", "weapons/test-item", publicDirectory)).toThrow(/regular file/i);
  });

  it("rejects traversal paths before resolving them", () => {
    expect(() => assertLocalImageExists?.("/images/../outside.svg", "weapons/test-item", fixturePublic)).toThrow(/weapons\/test-item.*outside.svg/i);
  });

  it("rejects symlinks that escape public/images", () => {
    const publicDirectory = createFixturePublicDirectory();
    expect(() => assertLocalImageExists?.("/images/escaped.svg", "weapons/test-item", publicDirectory)).toThrow(/escape/i);
  });
});
