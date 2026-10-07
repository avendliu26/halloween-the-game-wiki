try {
  // Node's native TypeScript stripping is supported by package.json engines.
  const { validateAssets } = await import("../src/lib/content/validate-assets.ts");
  const { checkedImages, checkedDocuments } = await validateAssets();
  console.log(`Asset validation passed: ${checkedImages} image references, ${checkedDocuments} MDX documents.`);
} catch (error) {
  console.error(`Asset validation failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
