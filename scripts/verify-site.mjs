import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

const base = new URL(process.argv[2] ?? "http://127.0.0.1:3105");
const expectedSite = process.env.NEXT_PUBLIC_SITE_URL;
const pending = ["/"];
const pages = new Map();
const anchors = [];
const assets = new Set();
const forbidden = /Gravenwake|Ashen(?: Blade)?|drowned kingdom|flooded realm|\bDemo\b|game\.example|example\.com/i;

while (pending.length) {
  const path = pending.shift();
  if (pages.has(path)) continue;
  assert.ok(pages.size < 40, "Unexpected expansion beyond phase-one scope");
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, path);
  const html = await response.text();
  const doc = new JSDOM(html).window.document;
  pages.set(path, doc);
  const visible = doc.body.cloneNode(true);
  visible.querySelectorAll("script, style").forEach((el) => el.remove());
  assert.equal(forbidden.test(visible.textContent), false, `Brand residue at ${path}`);
  assert.equal(/\bundefined\b/.test(visible.textContent), false, `Missing data leaked at ${path}`);
  assert.equal(doc.querySelectorAll("h1").length, 1, `One h1: ${path}`);
  assert.ok(doc.title.includes("Halloween: The Game"), `Title: ${path}`);
  assert.ok(doc.querySelector('meta[name="description"]')?.content, `Description: ${path}`);
  assert.ok(doc.querySelector('meta[property="og:title"]')?.content, `Open Graph: ${path}`);
  const canonical = doc.querySelector('link[rel="canonical"]')?.href;
  if (expectedSite) {
    assert.equal(canonical, new URL(path, expectedSite).href);
    assert.equal(doc.querySelector('meta[property="og:url"]')?.content, canonical);
  } else {
    assert.equal(canonical, undefined, `No invented canonical: ${path}`);
    assert.equal(doc.querySelector('meta[property="og:url"]'), null);
  }
  for (const script of doc.querySelectorAll('script[type="application/ld+json"]')) {
    const data = JSON.parse(script.textContent);
    assert.equal(data["@context"], "https://schema.org");
    assert.equal(forbidden.test(script.textContent), false);
  }
  for (const image of doc.querySelectorAll("img")) {
    assert.ok(image.hasAttribute("alt"), `Image alt attribute: ${path}`);
    assert.ok(image.alt || image.closest("a[aria-label]"), `Image accessible label: ${path}`);
    assets.add(new URL(image.src, base).href);
  }
  for (const link of doc.querySelectorAll("a[href]")) {
    const url = new URL(link.getAttribute("href"), new URL(path, base));
    if (url.origin !== base.origin) continue;
    if (!pages.has(url.pathname)) pending.push(url.pathname);
    if (url.hash) anchors.push({ path: url.pathname, id: decodeURIComponent(url.hash.slice(1)) });
  }
}

for (const { path, id } of anchors) assert.ok(pages.get(path)?.getElementById(id), `Broken anchor: ${path}#${id}`);
for (const asset of assets) {
  const response = await fetch(asset);
  assert.equal(response.status, 200, asset);
  assert.ok(response.headers.get("content-type")?.startsWith("image/"), asset);
}
for (const path of ["/weapons", "/bosses", "/skills", "/items", "/quests", "/codes", "/missing-page"]) {
  assert.equal((await fetch(new URL(path, base))).status, 404, path);
}
const home = pages.get("/");
assert.equal(home.title, "Halloween: The Game Wiki — Release Date, Crossplay & Guides");
assert.ok(home.title.length <= 60);
const descriptionLength = home.querySelector('meta[name="description"]').content.length;
assert.ok(descriptionLength >= 140 && descriptionLength <= 160);
assert.ok(home.querySelector('meta[name="keywords"]').content.length <= 100);
assert.equal(JSON.parse(home.querySelector('script[type="application/ld+json"]').textContent).name, "Halloween: The Game");
const robotsResponse = await fetch(new URL("/robots.txt", base));
assert.equal(robotsResponse.status, 200);
const robots = await robotsResponse.text();
const sitemapResponse = await fetch(new URL("/sitemap.xml", base));
assert.equal(sitemapResponse.status, 200);
const sitemap = await sitemapResponse.text();
if (expectedSite) {
  assert.ok(robots.includes(new URL("/sitemap.xml", expectedSite).href));
  const xml = new JSDOM(sitemap, { contentType: "text/xml" }).window.document;
  const urls = [...xml.querySelectorAll("loc")].map((el) => el.textContent);
  for (const path of pages.keys()) assert.ok(urls.includes(new URL(path, expectedSite).href), path);
} else {
  assert.equal(robots.includes("Sitemap:"), false);
  assert.equal(sitemap.includes("<loc>"), false);
}
console.log(JSON.stringify({
  pages: [...pages.keys()].sort(), pageCount: pages.size,
  checkedAnchors: anchors.length, checkedImages: assets.size,
  hiddenAndUnknownRoutes: "404", metadata: "passed", jsonLd: "passed",
  canonicalMode: expectedSite ? "configured origin" : "intentionally omitted",
  sitemapAndRobots: "passed", productionResidue: "none",
  homeTitleLength: home.title.length, homeDescriptionLength: descriptionLength
}, null, 2));
