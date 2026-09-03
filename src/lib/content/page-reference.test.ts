import { expect, it } from "vitest";
import { resolveInternalHref } from "./queries";
import { InternalReferenceSchema } from "./types";

it("links homepage questions to fact pages without a guides prefix", () => {
  const reference = InternalReferenceSchema.parse({ kind: "page", slug: "release-date" });
  expect(resolveInternalHref(reference)).toBe("/release-date");
  const anchored = InternalReferenceSchema.parse({ kind: "page", slug: "platforms", anchor: "what-the-cross-platform-badges-confirm" });
  expect(resolveInternalHref(anchored)).toBe("/platforms#what-the-cross-platform-badges-confirm");
});
