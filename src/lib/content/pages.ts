import path from "node:path";
import { loadGuidesFromDirectory } from "@/lib/content/guides";

// Fact pages share the existing validated Markdown compiler, not the Guides index.
export const standalonePages = [
  { slug: "release-date", pathname: "/release-date", type: "Release" },
  { slug: "editions", pathname: "/editions", type: "Edition" },
  { slug: "physical-editions", pathname: "/physical-editions", type: "Edition" },
  { slug: "platforms", pathname: "/platforms", type: "Platform" },
  { slug: "system-requirements", pathname: "/system-requirements", type: "Platform" }
] as const;

export const getResearchPages = () =>
  loadGuidesFromDirectory(path.join(process.cwd(), "src/content/pages"));

export const getResearchPage = (slug: string) =>
  getResearchPages().find((page) => page.slug === slug);
