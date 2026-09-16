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
  "assets/fonts/cabinet-pixel-serif.ttf",
  "assets/fonts/LICENSE.txt",
  "assets/fonts/README.md",
  "assets/icons/plant.svg",
  "assets/icons/hanging-plant.svg",
  "assets/icons/candle.svg",
  "assets/icons/teacup.svg",
  "assets/icons/globe.svg",
  "assets/icons/quill.svg",
  "assets/icons/bookend.svg",
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
assert.match(css, /@font-face[\s\S]*Cabinet Pixel Serif/, "Local pixel-serif @font-face is missing");
assert.match(css, /cabinet-pixel-serif\.ttf/, "Local pixel-serif font is not consumed by CSS");
assert.match(css, /grid-template-rows:\s*repeat\(3,/, "Bookshelf must have exactly three visual rows");
assert.doesNotMatch(css, /grid-template-rows:\s*repeat\(4,/, "A legacy four-row bookshelf rule remains");
assert.match(css, /flex:\s*0 0 var\(--book-width\)/, "Books must use fixed, non-growing widths");
assert.match(css, /\.shelf-contents[\s\S]*?gap:\s*0;/, "Upright books must sit flush together");
assert.doesNotMatch(css, /\.shelf-ledge\b/, "The rejected ornate shelf ledge must not remain");
assert.match(css, /prefers-reduced-motion/, "Reduced-motion styles are missing");
assert.match(css, /forced-colors/, "Forced-color styles are missing");

for (const match of css.matchAll(/--prop-size:\s*(\d+)px/g)) {
  assert.equal(Number(match[1]) % 24, 0, `Prop size ${match[1]}px is not a whole 24×24 grid multiple`);
}

const shelfRowCalls = appSource.match(/^\s+shelfRow\(/gm) || [];
assert.equal(shelfRowCalls.length, 3, "Shelf layout must contain exactly three rows");

const fillerCount = [...appSource.matchAll(/decorativeRun\((\d+),/g)]
  .reduce((sum, match) => sum + Number(match[1]), 0);
assert.ok(fillerCount >= 80 && fillerCount <= 100,
  `Shelves should be packed with fewer, more varied books; found ${fillerCount} filler books`);

for (const iconName of ["plant", "hanging-plant", "candle", "teacup", "globe", "quill", "bookend", "favicon"]) {
  const svg = read(`assets/icons/${iconName}.svg`);
  assert.match(svg, /viewBox=["']0 0 24 24["']/, `${iconName} must use a 24×24 grid`);
  const openingTags = [...svg.matchAll(/<(?!\/)([A-Za-z][\w:-]*)\b/g)].map((match) => match[1]);
  assert.ok(openingTags.every((tag) => ["svg", "g", "rect"].includes(tag)),
    `${iconName} must be drawn only with grouped rectangles`);
  assert.doesNotMatch(svg, /<(?:path|circle|ellipse|line|polyline|polygon|filter|linearGradient|radialGradient)\b/i,
    `${iconName} contains non-grid SVG geometry`);
  assert.doesNotMatch(svg, /\b(?:transform|stroke)\s*=/i, `${iconName} contains transformed or stroked pixels`);

  const occupiedCells = new Set();
  const rects = [...svg.matchAll(/<rect\b([^>]*)\/?\s*>/gi)];
  assert.ok(rects.length > 0, `${iconName} has no pixel cells`);

  for (const rect of rects) {
    const attributes = Object.fromEntries(
      [...rect[1].matchAll(/([\w:-]+)=["']([^"']+)["']/g)].map((match) => [match[1], match[2]])
    );
    assert.equal(attributes.width, "1", `${iconName} has a pixel wider than one cell`);
    assert.equal(attributes.height, "1", `${iconName} has a pixel taller than one cell`);
    assert.match(attributes.x || "", /^\d+$/, `${iconName} has a non-integer x coordinate`);
    assert.match(attributes.y || "", /^\d+$/, `${iconName} has a non-integer y coordinate`);
    const x = Number(attributes.x);
    const y = Number(attributes.y);
    assert.ok(x >= 0 && x < 24 && y >= 0 && y < 24, `${iconName} has an out-of-bounds pixel`);
    const coordinate = `${x},${y}`;
    assert.ok(!occupiedCells.has(coordinate), `${iconName} overlaps a pixel at ${coordinate}`);
    occupiedCells.add(coordinate);
  }
}

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

const inspectableAppSource = appSource.replace(
  '  if (document.readyState === "loading") {',
  '  globalThis.__SHELF_LAYOUT = SHELF_LAYOUT; return;\n  if (document.readyState === "loading") {'
);
assert.notEqual(inspectableAppSource, appSource, "Could not instrument shelf data for inspection");
const layoutContext = vm.createContext({ window: {} });
new vm.Script(inspectableAppSource, { filename: "app-layout-inspection.js" }).runInContext(layoutContext);
const shelfLayout = layoutContext.__SHELF_LAYOUT;
assert.equal(shelfLayout.length, 3, "Rendered shelf data must contain exactly three rows");
assert.ok(
  shelfLayout.every((row) => row.filter((item) => item.type === "book" && !item.section).length >= 27),
  "Each shelf must retain at least 27 filler books"
);
assert.equal(
  JSON.stringify(shelfLayout.flatMap((row) => row.filter((item) => item.section).map((item) => item.section)).slice().sort()),
  JSON.stringify(sectionIds.slice().sort()),
  "The nine featured books must each appear once across the three shelves"
);
assert.equal(
  JSON.stringify(shelfLayout.flatMap((row) => row.filter((item) => item.type === "prop").map((item) => item.name)).slice().sort()),
  JSON.stringify(["candle", "globe", "hanging-plant", "plant", "quill", "teacup"]),
  "The intended six shelf props must each appear once"
);

const bookends = shelfLayout.flatMap((row) => row.filter((item) => item.type === "bookend"));
assert.equal(
  JSON.stringify(bookends.map((item) => item.side)),
  JSON.stringify(["left", "right"]),
  "A single paired set of bookends is required"
);
const bookendRow = shelfLayout.find((row) => row.some((item) => item.type === "bookend"));
const leftBookendIndex = bookendRow.findIndex((item) => item.type === "bookend" && item.side === "left");
const rightBookendIndex = bookendRow.findIndex((item) => item.type === "bookend" && item.side === "right");
const booksBetweenBookends = bookendRow.slice(leftBookendIndex + 1, rightBookendIndex);
assert.equal(booksBetweenBookends.length, 6, "The bookends must enclose exactly six books");
assert.ok(
  booksBetweenBookends.every((item) => item.type === "book" && !item.section),
  "Only decorative books may sit inside the bookend pair"
);
const horizontalBooks = shelfLayout.flatMap((row) => row.filter((item) => item.type === "horizontal-stack"));
assert.equal(horizontalBooks.length, 1, "Exactly one horizontal book stack is required");
assert.equal(horizontalBooks[0].books.length, 2, "The horizontal stack must contain two books");
assert.match(css, /\.book--pixel-9\b/, "Nine irregular spine-band placements must be defined");
assert.doesNotMatch(
  css,
  /book--section:focus-visible::after/,
  "Closing the dialog must not leave the corner sparkle active on focused books"
);

console.log(`Static smoke test passed: ${sectionIds.length} sections, ${requiredFiles.length} required assets.`);
