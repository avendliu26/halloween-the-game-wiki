import { z } from "zod";

export const SlugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase kebab-case letters and numbers");

export const IsoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use ISO YYYY-MM-DD")
  .refine((value) => {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    );
  }, "Use a valid calendar date in ISO YYYY-MM-DD format");

export const LocalImagePathSchema = z
  .string()
  .startsWith("/images/", "Use a local path below /images/")
  .refine((value) => value.length > "/images/".length, "Image path must name a file")
  .refine((value) => !value.includes(".."), "Image path cannot contain ..")
  .refine((value) => {
    try {
      return !decodeURIComponent(value).includes("..");
    } catch {
      return false;
    }
  }, "Image path cannot contain encoded traversal")
  .refine((value) => !value.includes("://"), "Image path cannot contain a URL scheme")
  .refine((value) => !/[?#\\]/.test(value), "Image path cannot contain a query, fragment, or backslash");

export const HttpUrlSchema = z.string().superRefine((value, context) => {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    context.addIssue({ code: "custom", message: "Use a valid absolute HTTP(S) URL" });
    return;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    context.addIssue({ code: "custom", message: "Only HTTP(S) URLs are supported" });
  }

  if (url.username || url.password) {
    context.addIssue({ code: "custom", message: "URLs cannot include credentials" });
  }
});
