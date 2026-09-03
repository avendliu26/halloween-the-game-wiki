import { LocalImagePathSchema } from "@/lib/validation/common";
import type { GuideHeading } from "@/lib/content/guides";

type MdxNode = {
  type: string;
  name?: string | null;
  url?: string;
  identifier?: string;
  depth?: number;
  value?: unknown;
  attributes?: MdxNode[];
  children?: MdxNode[];
  data?: {
    hProperties?: Record<string, unknown>;
    [key: string]: unknown;
  };
};

const walk = (node: MdxNode, visit: (node: MdxNode) => void): void => {
  visit(node);
  node.children?.forEach((child) => walk(child, visit));
};

const unsafe = (slug: string, detail: string): never => {
  throw new Error(`Unsafe MDX in guide "${slug}": ${detail}`);
};

const validateLocalImage = (slug: string, url: string | undefined): void => {
  if (!url || !LocalImagePathSchema.safeParse(url).success) {
    unsafe(slug, `Markdown images must use a local /images/... path (received "${url ?? "missing"}")`);
  }
};

type ResolvedMarkdownImageUrls = {
  direct: (string | undefined)[];
  referenced: (string | undefined)[];
};

const resolveMarkdownImageUrls = (tree: MdxNode): ResolvedMarkdownImageUrls => {
  const direct: (string | undefined)[] = [];
  const imageReferences: string[] = [];
  const definitions = new Map<string, string | undefined>();

  walk(tree, (node) => {
    if (node.type === "image") {
      direct.push(node.url);
    }

    if (node.type === "imageReference" && node.identifier) {
      imageReferences.push(node.identifier.toLowerCase());
    }

    if (node.type === "definition" && node.identifier && !definitions.has(node.identifier.toLowerCase())) {
      definitions.set(node.identifier.toLowerCase(), node.url);
    }
  });

  return { direct, referenced: imageReferences.map((identifier) => definitions.get(identifier)) };
};

export const createSafeGuideMdxPlugin = (slug: string) => () => (tree: MdxNode): void => {
  walk(tree, (node) => {
    if (node.type === "html") {
      unsafe(slug, "raw HTML is not supported");
    }

    if (node.type === "mdxjsEsm") {
      unsafe(slug, "ESM imports and exports are not supported");
    }

    if (node.type === "mdxFlowExpression" || node.type === "mdxTextExpression") {
      unsafe(slug, "JavaScript expressions are not supported");
    }

    if (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") {
      if (node.name !== "ImportantNote") {
        unsafe(slug, `only the ImportantNote MDX component is allowed (received "${node.name ?? "fragment"}")`);
      }

      for (const attribute of node.attributes ?? []) {
        if (attribute.type !== "mdxJsxAttribute" || (typeof attribute.value === "object" && attribute.value !== null)) {
          unsafe(slug, "ImportantNote attributes must use literal values");
        }
      }
    }

  });

  const imageUrls = resolveMarkdownImageUrls(tree);
  imageUrls.direct.forEach((url) => validateLocalImage(slug, url));
  imageUrls.referenced.forEach((url) => validateLocalImage(slug, url));
};

export const createGuideImagePathCollector = (imagePaths: string[]) => () => (tree: MdxNode): void => {
  const imageUrls = resolveMarkdownImageUrls(tree);
  imagePaths.push(
    ...imageUrls.direct.filter((url): url is string => typeof url === "string"),
    ...imageUrls.referenced.filter((url): url is string => typeof url === "string")
  );
};

const textContent = (node: MdxNode): string => {
  if (typeof node.value === "string") {
    return node.value;
  }

  return node.children?.map(textContent).join("") ?? "";
};

const slugifyHeading = (text: string): string => {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-");

  return slug || "section";
};

export const createGuideHeadingPlugin = (headings: GuideHeading[]) => () => (tree: MdxNode): void => {
  const allocatedIds = new Set<string>();

  walk(tree, (node) => {
    if (node.type !== "heading" || (node.depth !== 2 && node.depth !== 3)) {
      return;
    }

    const text = textContent(node).trim();
    const baseId = slugifyHeading(text);
    let id = baseId;
    let suffix = 2;

    while (allocatedIds.has(id)) {
      id = `${baseId}-${suffix}`;
      suffix += 1;
    }

    allocatedIds.add(id);
    node.data ??= {};
    node.data.hProperties = { ...node.data.hProperties, id };
    headings.push({ depth: node.depth, text, id });
  });
};
