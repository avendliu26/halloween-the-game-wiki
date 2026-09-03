import { realpathSync, statSync } from "node:fs";
import path from "node:path";
import { LocalImagePathSchema } from "@/lib/validation/common";

const pathIsInside = (candidate: string, directory: string): boolean => {
  const relative = path.relative(directory, candidate);
  return relative !== "" && !relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative);
};

export const assertLocalImageExists = (
  imagePath: string,
  source: string,
  publicDirectory = path.join(process.cwd(), "public")
): void => {
  if (!LocalImagePathSchema.safeParse(imagePath).success) {
    throw new Error(`Invalid local image for ${source}: ${imagePath}`);
  }

  const imageDirectory = path.resolve(publicDirectory, "images");
  const targetPath = path.resolve(publicDirectory, `.${imagePath}`);

  if (!pathIsInside(targetPath, imageDirectory)) {
    throw new Error(`Invalid local image for ${source}: ${imagePath} escapes public/images`);
  }

  let resolvedImageDirectory: string;
  let resolvedTargetPath: string;
  try {
    resolvedImageDirectory = realpathSync(imageDirectory);
    resolvedTargetPath = realpathSync(targetPath);
  } catch {
    throw new Error(`Missing local image for ${source}: ${imagePath}`);
  }

  if (!pathIsInside(resolvedTargetPath, resolvedImageDirectory)) {
    throw new Error(`Invalid local image for ${source}: ${imagePath} escapes public/images`);
  }

  if (!statSync(resolvedTargetPath).isFile()) {
    throw new Error(`Invalid local image for ${source}: ${imagePath} must resolve to a regular file`);
  }
};
