import { expect, it } from "vitest";
import { countContentWords } from "../../../scripts/audit-word-count.mjs";

it("separates table cells and block text in rendered word counts", () => {
  const article = document.createElement("article");
  article.innerHTML = "<table><tr><th>CPU model</th><th>Memory</th></tr><tr><td>Intel LGA 1200+</td><td>16 GB</td></tr></table><p>Use <a>SSD storage</a> now.</p>";
  expect(countContentWords(article)).toBe(12);
});

it("preserves words split by inline emphasis and handles empty content", () => {
  const article = document.createElement("article");
  article.innerHTML = "<p>pre-<em>order</em> now</p>";
  expect(countContentWords(article)).toBe(2);
  article.innerHTML = "";
  expect(countContentWords(article)).toBe(0);
});
