import path from "node:path";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { ImportantNote } from "@/components/wiki/important-note";
import { createGuideHeadingPlugin, createGuideImagePathCollector, createSafeGuideMdxPlugin, createRelatedPagesPlugin, type SidebarLink } from "@/lib/content/guide-mdx";
import { loadGuidesFromDirectory, type GuideRecord } from "./guide-source.ts";

export { GuideFrontmatterSchema, parseGuideSource, validateGuideRecords, loadGuidesFromDirectory } from "./guide-source.ts";
export type { GuideFrontmatter, GuideRecord } from "./guide-source.ts";

const guidesDirectory = path.join(process.cwd(), "src/content/guides");

export type GuideHeading = {
  depth: 2 | 3;
  text: string;
  id: string;
};

export const mdxComponents = { ImportantNote };

const headingExpression = /^(#{2,3})[ \t]+(.+?)(?:[ \t]+#+)?[ \t]*$/;
const openingFenceExpression = /^[ \t]{0,3}(`{3,}|~{3,})/;

type CodeFence = {
  character: "`" | "~";
  length: number;
};

const slugifyHeading = (text: string): string => {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-");

  return slug || "section";
};

const getOpeningFence = (line: string): CodeFence | undefined => {
  const marker = line.match(openingFenceExpression)?.[1];

  if (!marker) {
    return undefined;
  }

  return { character: marker[0] as CodeFence["character"], length: marker.length };
};

const isClosingFence = (line: string, fence: CodeFence): boolean =>
  new RegExp(`^[ \\t]{0,3}${fence.character}{${fence.length},}[ \\t]*$`).test(line);

const allocateHeadingId = (baseId: string, allocatedIds: Set<string>): string => {
  let id = baseId;
  let suffix = 2;

  while (allocatedIds.has(id)) {
    id = `${baseId}-${suffix}`;
    suffix += 1;
  }

  allocatedIds.add(id);
  return id;
};

export const prepareGuideBody = (body: string): { body: string; headings: GuideHeading[] } => {
  const parts = body.split(/(\r?\n)/);
  const allocatedIds = new Set<string>();
  const headings: GuideHeading[] = [];
  let activeFence: CodeFence | undefined;

  for (let index = 0; index < parts.length; index += 2) {
    const line = parts[index];

    if (activeFence) {
      if (isClosingFence(line, activeFence)) {
        activeFence = undefined;
      }
      continue;
    }

    const openingFence = getOpeningFence(line);
    if (openingFence) {
      activeFence = openingFence;
      continue;
    }

    const match = line.match(headingExpression);
    if (!match) {
      continue;
    }

    const depth = match[1].length as GuideHeading["depth"];
    const headingText = match[2].trim();
    const id = allocateHeadingId(slugifyHeading(headingText), allocatedIds);

    headings.push({ depth, text: headingText, id });
    parts[index] = `<h${depth} id="${id}">${headingText}</h${depth}>`;
  }

  return { body: parts.join(""), headings };
};

export const extractHeadings = (body: string): GuideHeading[] => prepareGuideBody(body).headings;

export const getAllGuides = (): GuideRecord[] => loadGuidesFromDirectory(guidesDirectory);

export const getGuide = (slug: string): GuideRecord | undefined =>
  getAllGuides().find((guide) => guide.slug === slug);

export const compileGuide = async (record: GuideRecord, { moveRelatedToSidebar = false } = {}) => {
  const headings: GuideHeading[] = [];
  const imagePaths: string[] = [];
  const relatedPages: SidebarLink[] = [];
  const compiled = await compileMDX({
    source: record.body,
    components: mdxComponents,
    options: {
      blockJS: true,
      mdxOptions: {
        remarkPlugins: [
          remarkGfm,
          createSafeGuideMdxPlugin(record.slug),
          createGuideHeadingPlugin(headings),
          createGuideImagePathCollector(imagePaths),
          ...(moveRelatedToSidebar ? [createRelatedPagesPlugin(relatedPages)] : [])
        ]
      }
    }
  });

  return { ...compiled, headings, imagePaths, relatedPages };
};
