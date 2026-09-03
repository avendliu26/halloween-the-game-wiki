import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { countContentWords } from "./audit-word-count.mjs";

const base = new URL(process.argv[2] ?? "http://127.0.0.1:3106");
const intents = JSON.parse(readFileSync(new URL("../research/intent-map.json", import.meta.url), "utf8"));
const rows = [];
for (const intent of intents) {
  const response = await fetch(new URL(intent.pathname, base));
  if (intent.status !== "PUBLISHED") {
    assert.equal(response.status, 404, `Unpublished intent leaked: ${intent.pathname}`);
    rows.push({ ...intent, wordCount: 0, sourceCount: intent.sourceUrls.length });
    continue;
  }
  assert.equal(response.status, 200, intent.pathname);
  const doc = new JSDOM(await response.text()).window.document;
  assert.equal(doc.title, intent.title, `SEO title: ${intent.pathname}`);
  assert.equal(doc.querySelector("h1").textContent, intent.title);
  assert.ok(doc.title.length >= 40 && doc.title.length <= 60);
  const descriptionLength = doc.querySelector('meta[name="description"]').content.length;
  assert.ok(descriptionLength >= 140 && descriptionLength <= 160, `Description length: ${intent.pathname}`);
  const body = doc.querySelector(".guide-article-page__body");
  assert.ok(body, intent.pathname);
  body.querySelectorAll(".related-content").forEach((element) => element.remove());
  const firstParagraph = body.querySelector("p").textContent;
  assert.equal(/^(Welcome|In this article|If you.re wondering)/i.test(firstParagraph), false);
  const links = new Set([...body.querySelectorAll("a[href]")].map((element) => element.getAttribute("href")));
  for (const url of intent.sourceUrls) assert.ok(links.has(url), `Missing source citation: ${intent.pathname} ${url}`);
  rows.push({ ...intent, wordCount: countContentWords(body), sourceCount: intent.sourceUrls.length, titleLength: doc.title.length, descriptionLength });
}
console.log(JSON.stringify(rows, null, 2));
