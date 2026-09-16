import assert from "node:assert/strict";
import { createHash } from "node:crypto";
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
  "assets/icons/geode.svg",
  "assets/icons/strawberry-frame.svg",
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
assert.ok(fillerCount >= 90 && fillerCount <= 105,
  `Shelves should be cluttered with varied books; found ${fillerCount} generated filler books`);

for (const iconName of ["plant", "hanging-plant", "candle", "teacup", "globe", "quill", "geode", "strawberry-frame", "favicon"]) {
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

const structuralLayout = shelfLayout.map((row) => row.map((item) => ({
  type: item.type,
  name: item.name || null,
  section: item.section || null,
  height: item.height || null,
  width: item.width || null,
  detail: item.detail || null,
  lean: item.lean || null,
  position: item.position || null,
  pages: item.pages ?? null,
  stack: item.books?.map(({ color, detail, width }) => ({ color, detail, width })) || null
})));
const structuralHash = createHash("sha256").update(JSON.stringify(structuralLayout)).digest("hex");
assert.equal(
  structuralHash,
  "9bb230048b31550460b15a83742b12ec3a2be8cd7549079f2d1b098d7113a937",
  "Shelf rows, placements, sizes, spine details, or stack structure changed"
);
assert.ok(
  shelfLayout.every((row) => row.filter((item) => item.type === "book" && !item.section).length >= 30),
  "Each shelf must retain at least 30 filler books"
);
assert.equal(
  JSON.stringify(shelfLayout.flatMap((row) => row.filter((item) => item.section).map((item) => item.section)).slice().sort()),
  JSON.stringify(sectionIds.slice().sort()),
  "The nine featured books must each appear once across the three shelves"
);
assert.equal(
  JSON.stringify(shelfLayout.flatMap((row) => row.filter((item) => item.type === "prop").map((item) => item.name)).slice().sort()),
  JSON.stringify(["candle", "geode", "globe", "hanging-plant", "plant", "quill", "strawberry-frame", "teacup"]),
  "The intended eight shelf props must each appear once"
);

assert.equal(shelfLayout.flatMap((row) => row.filter((item) => item.type === "bookend")).length, 0,
  "Bookends must not remain in the shelf data");
assert.doesNotMatch(appSource, /function bookend\b|createBookend\b|bookend\.svg/, "Bookend code or assets remain referenced");
const horizontalStacks = shelfLayout.flatMap((row) => row.filter((item) => item.type === "horizontal-stack"));
assert.equal(horizontalStacks.length, 2, "Exactly two horizontal book stacks are required");
assert.equal(
  JSON.stringify(horizontalStacks.map((stack) => stack.books.length).slice().sort()),
  JSON.stringify([2, 3]),
  "The horizontal stacks must contain two and three books"
);
assert.equal(
  shelfLayout.filter((row) => row.some((item) => item.type === "horizontal-stack")).length,
  2,
  "The horizontal stacks must sit on different shelves"
);
assert.equal(
  shelfLayout.flatMap((row) => row.filter((item) => item.type === "book" && item.lean === "diagonal")).length,
  1,
  "Exactly one upright book must lean diagonally"
);
assert.match(css, /\.book--pixel-9\b/, "Nine irregular spine-band placements must be defined");
assert.match(css, /\.shelf-prop--hanging-plant[\s\S]*?animation:\s*none\s*!important;/,
  "The hanging plant must not pulse or animate");
assert.doesNotMatch(
  css,
  /book--section:focus-visible::after/,
  "Closing the dialog must not leave the corner sparkle active on focused books"
);
assert.doesNotMatch(html, /Curious work, carefully collected\./i, "The retired subtitle is still visible");
assert.doesNotMatch(html, /cabinet-crown/, "The removed header surround is still in the page");
assert.doesNotMatch(css, /\.(?:cabinet-crown|crown)(?=[\s:{,.])/, "Removed header-surround styling remains");
assert.match(html, /<div class="nameplate">[\s\S]*?<h1[^>]*>Ava Romano<\/h1>[\s\S]*?Pick a book to open a chapter of the portfolio\./,
  "The shelf instruction must sit directly beneath the name on the nameplate");
assert.match(css, /\.book--section \.book__title\s*\{[\s\S]*?color:\s*#[0-9a-f]{6};[\s\S]*?transform:\s*rotate\(180deg\);/i,
  "Titled spines must use uniform dark, bottom-to-top lettering");
assert.match(css, /\.book--section \.book__ornament\s*\{[\s\S]*?display:\s*none;/,
  "Titled books must not show the small gilt ornament");
assert.match(appSource, /if \(!isInteractive\) \{[\s\S]*?book__ornament[\s\S]*?appendChild\(ornament\);[\s\S]*?\}/,
  "Spine ornaments must only be generated for untitled books");
assert.match(appSource, /"deep-red"[\s\S]*?"sienna"/, "The warmer red and sienna book colors are missing");

const titledSpineColors = {
  about: "#ad8098",
  skills: "#c9a85f",
  resume: "#c9a85f",
  experience: "#bb716b",
  research: "#7f9fa5",
  hobbies: "#7f9fa5",
  education: "#bd7954",
  contact: "#bd7954",
  projects: "#9da16f"
};
const titleInk = "#281719";
const luminance = (hex) => {
  const channels = hex.match(/[a-f\d]{2}/gi).map((value) => Number.parseInt(value, 16) / 255);
  const linear = channels.map((value) => value <= 0.03928
    ? value / 12.92
    : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
};
const contrast = (first, second) => {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
};

for (const [section, color] of Object.entries(titledSpineColors)) {
  assert.match(
    css,
    new RegExp(`\\.book--section\\[data-section=["']${section}["']\\][\\s\\S]{0,180}?--book-color:\\s*${color};`, "i"),
    `${section} is missing its light titled-spine color`
  );
  assert.ok(contrast(titleInk, color) >= 4.5, `${section} title contrast is below 4.5:1`);
}

console.log(`Static smoke test passed: ${sectionIds.length} sections, ${requiredFiles.length} required assets.`);
