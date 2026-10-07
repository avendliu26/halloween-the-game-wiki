import path from "node:path";
import { loadGuidesFromDirectory } from "@/lib/content/guides";

// Fact pages share the existing validated Markdown compiler, not the Guides index.
export const standalonePages = [
  { slug: "perks", pathname: "/perks", type: "Perks" },
  { slug: "challenges", pathname: "/challenges", type: "Challenges" },
  { slug: "challenges-prologue", pathname: "/challenges/prologue", type: "Challenges" },
  { slug: "challenges-chapter-1", pathname: "/challenges/chapter-1", type: "Challenges" },
  { slug: "challenges-chapter-2", pathname: "/challenges/chapter-2", type: "Challenges" },
  { slug: "challenges-chapter-3", pathname: "/challenges/chapter-3", type: "Challenges" },
  { slug: "challenges-chapter-4", pathname: "/challenges/chapter-4", type: "Challenges" },
  { slug: "challenges-chapter-5", pathname: "/challenges/chapter-5", type: "Challenges" },
  { slug: "crossplay", pathname: "/crossplay", type: "Guide" },
  { slug: "release-date", pathname: "/release-date", type: "Release" },
  { slug: "editions", pathname: "/editions", type: "Edition" },
  { slug: "physical-editions", pathname: "/physical-editions", type: "Edition" },
  { slug: "platforms", pathname: "/platforms", type: "Platform" },
  { slug: "system-requirements", pathname: "/system-requirements", type: "Platform" },
  { slug: "patch-1-1-0", pathname: "/updates/patch-1-1-0", type: "Update" },
  { slug: "october-27-2026", pathname: "/updates/october-27-2026", type: "Update" }
] as const;

export const getResearchPages = () =>
  loadGuidesFromDirectory(path.join(process.cwd(), "src/content/pages"));

export const getResearchPage = (slug: string) =>
  getResearchPages().find((page) => page.slug === slug);
