// @vitest-environment node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { expect, it } from "vitest";

it("validates production assets through plain Node without a test runner", () => {
  const guard = `import { registerHooks } from 'node:module';
    registerHooks({ resolve(specifier, context, nextResolve) {
      if (/^(vitest|@vitest|vite|jsdom|next|react|@testing-library)([\\/-]|$)/.test(specifier)) {
        throw new Error('Build validation loaded a forbidden runtime: ' + specifier);
      }
      return nextResolve(specifier, context);
    }});`;
  const result = spawnSync(process.execPath, ["--import", `data:text/javascript,${encodeURIComponent(guard)}`, path.resolve("scripts/validate-assets.mjs")], {
    encoding: "utf8"
  });
  expect(result.status, result.stderr).toBe(0);
  expect(result.stdout).toMatch(/Asset validation passed/);
});
