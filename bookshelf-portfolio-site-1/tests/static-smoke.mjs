import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

const sectionIds = [
  "about",
  "experience",
  "projects",
  "research",
  "skills",
  "education",
  "resume",
  "hobbies",
  "contact"
];

const requiredFiles = [
  "index.html",
  "src/styles/main.css",
  "src/scripts/content.js",
  "src/scripts/app.js",
  "assets/images/pixel-wood.png",
  "assets/images/pixel-wood.webp",
  "assets/icons/plant.svg",
  "assets/icons/candle.svg",
  "assets/icons/teacup.svg",
  "assets/icons/globe.svg",
  "assets/icons/quill.svg",
  "assets/icons/favicon.svg"
];

for (const relativePath of requiredFiles) {
  const absolutePath = path.join(root, relativePath);
  assert.ok(fs.existsSync(absolutePath), `Missing ${relativePath}`);
  assert.ok(fs.statSync(absolutePath).size > 0, `Empty ${relativePath}`);
}

const html = read("index.html");
const css = read("src/styles/main.css");
const contentSource = read("src/scripts/content.js");
const appSource = read("src/scripts/app.js");

for (const id of [
  "main-content",
  "catalog-toggle",
  "catalog-menu",
  "bookshelf",
  "book-dialog",
  "dialog-close",
  "dialog-title",
  "dialog-subtitle",
  "page-left",
  "page-right"
]) {
  assert.match(html, new RegExp(`id=["']${id}["']`), `Missing #${id}`);
}

assert.equal((css.match(/{/g) || []).length, (css.match(/}/g) || []).length, "Unbalanced CSS braces");
assert.match(css, /pixel-wood\.webp/, "Optimized wood texture is not consumed by CSS");
assert.match(css, /prefers-reduced-motion/, "Reduced-motion styles are missing");
assert.match(css, /forced-colors/, "Forced-color styles are missing");

const context = vm.createContext({ window: {} });
new vm.Script(contentSource, { filename: "content.js" }).runInContext(context);
const content = context.window.PORTFOLIO_CONTENT;
assert.deepEqual(Object.keys(content), sectionIds, "Portfolio content keys or order changed");

for (const id of sectionIds) {
  for (const field of ["title", "subtitle", "leftHtml", "rightHtml"]) {
    assert.equal(typeof content[id][field], "string", `${id}.${field} must be text`);
    assert.ok(content[id][field].trim(), `${id}.${field} is empty`);
  }

  const shelfMatches = appSource.match(new RegExp(`sectionBook\\("${id}"`, "g")) || [];
  assert.equal(shelfMatches.length, 1, `${id} must appear on exactly one shelf`);
  assert.match(html, new RegExp(`href=["']#${id}["']`), `Catalog is missing #${id}`);
}

new vm.Script(appSource, { filename: "app.js" });
assert.doesNotMatch(contentSource, /href=["']#["']/, "Draft links must not erase the active book hash");

console.log(`Static smoke test passed: ${sectionIds.length} sections, ${requiredFiles.length} required assets.`);
