import type { ComponentProps } from "react";

/** Production /images/official stills are all full-frame 1600×900 WebP. */
export function GuideMarkdownImage(props: Readonly<ComponentProps<"img">>) {
  const sized = typeof props.src === "string" && props.src.startsWith("/images/official/") && props.src.endsWith(".webp");
  // The safe-MDX plugin has already restricted Markdown image URLs to local /images paths.
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={props.alt ?? ""} decoding="async" height={sized ? 900 : undefined} loading="lazy" width={sized ? 1600 : undefined} />;
}
