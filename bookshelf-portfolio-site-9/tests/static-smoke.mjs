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
  "assets/icons/sleeping-cat.svg",
  "assets/icons/cat-tail.svg",
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
  "page-left",
  "page-right"
]) {
  assert.match(html, new RegExp(`id=["']${id}["']`), `Missing #${id}`);
}

const requestedSectionOrder = [
  "about", "education", "skills",
  "experience", "research", "projects",
  "hobbies", "resume", "contact"
];
const catalogOrder = [...html.matchAll(/<a\s+href=["']#[^"']+["']\s+data-section=["']([^"']+)["']/g)]
  .map((match) => match[1]);
assert.deepEqual(catalogOrder, requestedSectionOrder,
  "The hamburger catalog must mirror the requested shelf reading order");

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
assert.match(css, /--wood-dark:\s*#4a281e;[\s\S]*?--wood:\s*#6b3824;[\s\S]*?--wood-light:\s*#9b5934;/,
  "The approved cooler wood palette was not restored");

for (const match of css.matchAll(/--prop-size:\s*(\d+)px/g)) {
  assert.equal(Number(match[1]) % 24, 0, `Prop size ${match[1]}px is not a whole 24×24 grid multiple`);
}

const shelfRowCalls = appSource.match(/^\s+shelfRow\(/gm) || [];
assert.equal(shelfRowCalls.length, 3, "Shelf layout must contain exactly three rows");

const fillerCount = [...appSource.matchAll(/decorativeRun\((\d+),/g)]
  .reduce((sum, match) => sum + Number(match[1]), 0);
assert.ok(fillerCount >= 90 && fillerCount <= 105,
  `Shelves should be cluttered with varied books; found ${fillerCount} generated filler books`);

const iconGrids = {
  plant: [24, 24],
  "hanging-plant": [24, 24],
  candle: [24, 24],
  teacup: [24, 24],
  globe: [24, 24],
  quill: [24, 24],
  geode: [24, 24],
  "strawberry-frame": [24, 24],
  "sleeping-cat": [42, 28],
  "cat-tail": [12, 30],
  favicon: [24, 24]
};

for (const [iconName, [gridWidth, gridHeight]] of Object.entries(iconGrids)) {
  const svg = read(`assets/icons/${iconName}.svg`);
  assert.match(svg, new RegExp(`viewBox=["']0 0 ${gridWidth} ${gridHeight}["']`),
    `${iconName} must use its declared integer grid`);
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
    assert.ok(x >= 0 && x < gridWidth && y >= 0 && y < gridHeight,
      `${iconName} has an out-of-bounds pixel`);
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
  topProp: item.topProp || null,
  stack: item.books?.map(({ color, detail, width }) => ({ color, detail, width })) || null
})));
const structuralHash = createHash("sha256").update(JSON.stringify(structuralLayout)).digest("hex");
assert.equal(
  structuralHash,
  "51a27354f03df97d0edb5a070d09db6f17e48674064276bc850e69aaed1b8f5c",
  "Shelf rows, placements, sizes, spine details, or stack structure changed"
);
assert.match(appSource, /sectionBook\("education", "maroon", "high", "slim", "gilt"\)/,
  "Education must retain its position while using the slightly taller height");
assert.match(appSource, /sectionBook\("experience", "maroon", "medium-tall", "regular", "gilt"\)/,
  "Experience must retain its position while using the slightly taller height");
assert.match(appSource, /sectionBook\("resume", "gold", "high", "regular", "gilt"\)/,
  "Resume must be slightly shorter and thinner");
assert.match(css, /\.book--height-medium-tall\s*\{\s*--book-height:\s*84%;\s*\}/,
  "The Experience height step must remain a subtle increase");
assert.match(css, /\.book--height-high\s*\{\s*--book-height:\s*92%;\s*\}/,
  "The shared high step must keep Education slightly taller and Resume slightly shorter");
const decorativeBooks = shelfLayout.flatMap((row) => row.filter((item) => item.type === "book" && !item.section));
assert.equal(decorativeBooks.filter((book) => book.color === "navy").length, 3,
  "Exactly three decorative navy books must be distributed across the shelves");
assert.ok(decorativeBooks.filter((book) => book.color === "forest").length >= 15,
  "The restored palette must retain a strong dark-green presence");
assert.ok(
  shelfLayout.every((row) => row.filter((item) => item.type === "book" && !item.section).length >= 30),
  "Each shelf must retain at least 30 filler books"
);
assert.equal(
  JSON.stringify(shelfLayout[0].map((item, index) => item.section ? [item.section, index] : null).filter(Boolean)),
  JSON.stringify([["about", 6], ["education", 17], ["skills", 23]]),
  "Top-shelf interactive books must remain shifted left of the wider ladder"
);
assert.ok(shelfLayout[1].slice(0, 8).every((item) => item.type === "book" && !item.section),
  "The middle shelf must begin with books pressed against the left sidewall");
assert.ok(shelfLayout[1].slice(-8).every((item) => item.type === "book" && !item.section),
  "The middle shelf must end with books pressed against the right sidewall");
assert.equal(
  JSON.stringify(shelfLayout.flatMap((row) => row.filter((item) => item.section).map((item) => item.section)).slice().sort()),
  JSON.stringify(sectionIds.slice().sort()),
  "The nine featured books must each appear once across the three shelves"
);
assert.equal(
  JSON.stringify(shelfLayout.flatMap((row) => row.filter((item) => item.type === "prop").map((item) => item.name)).slice().sort()),
  JSON.stringify(["candle", "geode", "globe", "hanging-plant", "plant", "quill", "strawberry-frame"]),
  "The intended seven freestanding shelf props must each appear once"
);

assert.equal(
  JSON.stringify(shelfLayout.map((row) => row.filter((item) => item.section).map((item) => item.section))),
  JSON.stringify([
    requestedSectionOrder.slice(0, 3),
    requestedSectionOrder.slice(3, 6),
    requestedSectionOrder.slice(6, 9)
  ]),
  "Titled books must follow the requested top-to-bottom, left-to-right order"
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
assert.equal(horizontalStacks.filter((stack) => stack.topProp === "teacup").length, 1,
  "The teacup must sit on exactly one horizontal book stack");
assert.equal(shelfLayout[2].filter((item) => item.section).at(-1).section, "contact",
  "The bottom-right titled book must be Contact after shifting it left of the ladder");
assert.equal(
  shelfLayout.flatMap((row) => row.filter((item) => item.type === "book" && item.lean === "diagonal")).length,
  1,
  "Exactly one upright book must lean diagonally"
);
assert.match(css, /\.book--pixel-9\b/, "Nine irregular spine-band placements must be defined");
const bandPlacements = [...css.matchAll(/\.book--pixel-(\d+)\s*\{[\s\S]*?--band-top:\s*(\d+)px;[\s\S]*?--band-bottom:\s*(\d+)px;[\s\S]*?\}/g)];
assert.equal(bandPlacements.length, 9, "All nine spine-band placements must be inspectable");
for (const [, variant, top, bottom] of bandPlacements) {
  assert.equal(top, bottom, `Spine-band variant ${variant} is not symmetric`);
}
assert.ok(new Set(bandPlacements.map(([, , top]) => top)).size >= 6,
  "Spine bands must retain varied distances across different books");
assert.match(css, /\.book--section\s*\{[\s\S]*?padding:\s*calc\(var\(--band-top\) \+ 9px\) 6px;/,
  "Titled-book text must be padded clear of its decorative bands");
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
assert.match(css, /\.book--section \.book__title\s*\{[\s\S]*?color:\s*#f2dfad;[\s\S]*?transform:\s*rotate\(180deg\);/i,
  "Titled spines must use uniform light, bottom-to-top lettering");
assert.match(css, /\.book--section \.book__ornament\s*\{[\s\S]*?display:\s*none;/,
  "Titled books must not show the small gilt ornament");
assert.match(appSource, /if \(!isInteractive\) \{[\s\S]*?book__ornament[\s\S]*?appendChild\(ornament\);[\s\S]*?\}/,
  "Spine ornaments must only be generated for untitled books");
assert.match(appSource, /"deep-red"/, "The deep-red book color is missing");
assert.match(appSource, /NAVY_BOOK_SEQUENCES\s*=\s*Object\.freeze\(\[7, 47, 90\]\)/,
  "The three navy books are not fixed to their approved shelf positions");
assert.doesNotMatch(appSource + css, /sienna/i, "The rejected sienna book color remains");
assert.doesNotMatch(html, /dialog-subtitle/, "The open-book subtitle is still present in the page");
assert.doesNotMatch(appSource, /dialogSubtitle|entry\.subtitle/, "The open-book subtitle is still rendered by the app");
assert.match(html, /id="page-left"[^>]*tabindex="0"/,
  "The left book page must be keyboard-scrollable");
assert.match(html, /id="page-right"[^>]*tabindex="0"/,
  "The right book page must be keyboard-scrollable");
assert.match(css, /\.book-page\s*\{[\s\S]*?min-height:\s*0;[\s\S]*?overflow-y:\s*auto;[\s\S]*?scrollbar-gutter:\s*stable;/,
  "Desktop book pages must use bounded scrolling");
assert.match(css, /#dialog-title:focus,[\s\S]*?#dialog-title:focus-visible\s*\{[\s\S]*?outline:\s*0;/,
  "The non-interactive dialog title must not receive a yellow focus box");
assert.match(css, /\.dialog-heading\s*\{[\s\S]*?top:\s*clamp\(35px, 4\.3dvh, 42px\);[\s\S]*?transform:\s*translate\(-50%, -50%\);/,
  "Open-book titles must be vertically centered within the dotted header strip");
assert.equal((html.match(/class="catalog-toggle__line"/g) || []).length, 3,
  "The catalog control must contain exactly three hamburger lines");
assert.match(html, /id="catalog-toggle"[\s\S]*?aria-label="Open portfolio catalog"/,
  "The icon-only catalog control needs an accessible name");
assert.match(css, /\.catalog-toggle__label\s*\{[\s\S]*?clip-path:\s*inset\(50%\);/,
  "The retired catalog text must remain available only to assistive technology");
assert.match(css, /\.catalog-toggle__line\s*\{[\s\S]*?linear-gradient\(180deg, #efd378[\s\S]*?#c49a3a/,
  "The hamburger lines must use the nameplate's textured gold palette");
assert.match(appSource, /function createLadderScene\(\)[\s\S]*?rungIndex <= 5[\s\S]*?sleeping-cat\.svg[\s\S]*?cat-tail\.svg/,
  "The straight five-rung ladder and sleeping cat scene are missing");
assert.doesNotMatch(css, /library-ladder__rung--6/, "A sixth ladder rung still remains");
assert.match(css, /\.ladder-scene\s*\{[\s\S]*?width:\s*clamp\(147px, 11\.7vw, 198px\);/,
  "The ladder must be approximately one-half wider");
assert.match(css, /@media \(max-width: 900px\)\s*\{[\s\S]*?\.ladder-scene\s*\{[\s\S]*?display:\s*none;/,
  "The ladder must withdraw before it can cover the Skills book on narrower screens");
assert.match(css, /\.library-ladder__rail\s*\{[\s\S]*?width:\s*24px;[\s\S]*?border:\s*4px solid #1f0f0f;/,
  "The ladder rails must be substantially thicker");
assert.match(css, /\.library-ladder__rung\s*\{[\s\S]*?height:\s*18px;[\s\S]*?border:\s*4px solid #1f0f0f;/,
  "The ladder rungs must be substantially thicker");
assert.match(css, /repeating-linear-gradient\(180deg, #8d5135[\s\S]*?#603426[\s\S]*?#422018/,
  "The ladder needs its subtly darkened wood tones");
assert.match(css, /\.ladder-cat\s*\{[\s\S]*?bottom:\s*calc\(55% - 4px\);[\s\S]*?width:\s*168px;[\s\S]*?height:\s*112px;/,
  "The sleeping cat must be substantially larger than the small shelf props");
assert.match(appSource, /catBody\.width = 168;[\s\S]*?catBody\.height = 112;[\s\S]*?catTail\.width = 36;[\s\S]*?catTail\.height = 90;/,
  "The rendered cat and shorter tail dimensions are incorrect");
assert.match(css, /@keyframes cat-tail-swing[\s\S]*?translateX\(-4px\)[\s\S]*?translateX\(4px\)/,
  "The cat tail must swing in stepped whole-pixel increments");
assert.match(css, /\.horizontal-stack__top-prop--teacup::before,[\s\S]*?animation:\s*teacup-steam 2\.6s steps\(6, jump-none\)/,
  "The teacup needs a stepped wispy steam animation");

assert.equal(
  createHash("sha256").update(read("assets/icons/hanging-plant.svg")).digest("hex"),
  "32adc22f0df370877face6e785183444aa5550b847ff1b0dc80bc8cc8f75521a",
  "The previously approved hanging-plant sprite was not restored exactly"
);
const teacupRows = [...read("assets/icons/teacup.svg").matchAll(/<rect\b[^>]*\by=["'](\d+)["']/g)]
  .map((match) => Number(match[1]));
assert.deepEqual([...new Set(teacupRows.filter((row) => row >= 19))].sort((a, b) => a - b), [19, 20, 21],
  "The teacup saucer must be reduced to exactly three pixel rows");
assert.match(css, /\.horizontal-stack__top-prop\s*\{[\s\S]*?bottom:\s*36px;/,
  "The thinner teacup saucer must still rest directly on its book stack");

const titledSpineColors = {
  about: "#47203f",
  skills: "#6d2632",
  resume: "#5b4520",
  experience: "#682638",
  research: "#203252",
  hobbies: "#174e67",
  education: "#304529",
  contact: "#87401f",
  projects: "#4b5728"
};
const titleInk = "#f2dfad";
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
    `${section} is missing its dark titled-spine color`
  );
  assert.ok(contrast(titleInk, color) >= 4.5, `${section} title contrast is below 4.5:1`);
}

console.log(`Static smoke test passed: ${sectionIds.length} sections, ${requiredFiles.length} required assets.`);
