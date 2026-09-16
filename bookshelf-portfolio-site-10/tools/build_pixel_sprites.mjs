import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const outputDirectory = path.resolve(here, "../assets/icons");

const colors = Object.freeze({
  outline: "#1c1216",
  forest: "#263b25",
  oliveDark: "#526b2f",
  olive: "#7e9342",
  leafLight: "#9aaa52",
  woodDark: "#5a2e24",
  terracotta: "#a84a3f",
  terracottaLight: "#c46b3e",
  ceruleanDark: "#174e67",
  cerulean: "#2f7f8d",
  ceruleanLight: "#79aeb0",
  goldDark: "#8b5a22",
  gold: "#c79a3b",
  goldLight: "#e3c36c",
  paper: "#e7d5a4",
  canvas: "#eee3c8",
  steam: "#9d927c",
  tea: "#4a281e",
  stoneDark: "#45464c",
  stone: "#6d6f73",
  stoneLight: "#9b9da0",
  quartz: "#c2aeba",
  amethystDark: "#47203f",
  amethystBlue: "#554778",
  amethyst: "#76517f",
  amethystLight: "#b595bd",
  amethystBright: "#ead6ef",
  berryDark: "#682638",
  berry: "#b9474b",
  berryLight: "#de6a5b",
  catBlack: "#1b1a1d",
  catBlackLight: "#38353b",
  catWhiteShadow: "#b8b1a2",
  catWhite: "#e7e0cf",
  catPink: "#c47b7f"
});

function sprite(name, draw, dimensions) {
  const gridWidth = dimensions?.width || 24;
  const gridHeight = dimensions?.height || 24;
  const cells = new Map();
  const set = (x, y, fill) => {
    if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) {
      throw new Error(`${name}: out-of-bounds cell ${x},${y}`);
    }
    cells.set(`${x},${y}`, fill);
  };
  const row = (y, start, end, fill) => {
    for (let x = start; x <= end; x += 1) set(x, y, fill);
  };
  const column = (x, start, end, fill) => {
    for (let y = start; y <= end; y += 1) set(x, y, fill);
  };

  draw({ set, row, column, colors });

  const groups = new Map();
  for (const [coordinate, fill] of cells) {
    if (!groups.has(fill)) groups.set(fill, []);
    groups.get(fill).push(coordinate.split(",").map(Number));
  }

  const body = [...groups.entries()].map(([fill, coordinates]) => {
    const rects = coordinates
      .sort((a, b) => a[1] - b[1] || a[0] - b[0])
      .map(([x, y]) => `<rect x="${x}" y="${y}" width="1" height="1"/>`)
      .join("");
    return `  <g fill="${fill}">${rects}</g>`;
  }).join("\n");

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${gridWidth} ${gridHeight}" shape-rendering="crispEdges" aria-hidden="true" focusable="false">`,
    body,
    "</svg>",
    ""
  ].join("\n");

  fs.writeFileSync(path.join(outputDirectory, `${name}.svg`), svg);
}

sprite("plant", ({ row, column, colors: c }) => {
  // Two broad, opposing sprout leaves.
  row(3, 5, 9, c.outline); row(3, 14, 18, c.outline);
  row(4, 3, 10, c.outline); row(4, 13, 20, c.outline);
  row(5, 2, 10, c.outline); row(5, 13, 21, c.outline);
  row(6, 2, 11, c.outline); row(6, 12, 21, c.outline);
  row(7, 3, 11, c.outline); row(7, 12, 20, c.outline);
  row(8, 4, 11, c.outline); row(8, 12, 19, c.outline);
  row(9, 6, 11, c.outline); row(9, 12, 17, c.outline);
  row(10, 8, 11, c.outline); row(10, 12, 15, c.outline);
  row(4, 5, 8, c.olive); row(4, 15, 18, c.oliveDark);
  row(5, 4, 9, c.olive); row(5, 14, 19, c.oliveDark);
  row(6, 3, 9, c.oliveDark); row(6, 14, 20, c.olive);
  row(7, 5, 10, c.oliveDark); row(7, 13, 18, c.olive);
  row(8, 6, 10, c.forest); row(8, 13, 17, c.oliveDark);
  row(9, 8, 10, c.forest); row(9, 13, 15, c.oliveDark);
  row(5, 5, 6, c.leafLight); row(5, 17, 18, c.leafLight);
  column(11, 9, 16, c.outline); column(12, 9, 16, c.outline);
  column(12, 10, 15, c.oliveDark);

  // Tapered terracotta pot, planted directly on the shelf line.
  row(15, 6, 17, c.outline); row(16, 5, 18, c.outline);
  row(17, 6, 17, c.outline); row(18, 7, 16, c.outline);
  row(19, 7, 16, c.outline); row(20, 8, 15, c.outline);
  row(21, 8, 15, c.outline); row(22, 9, 14, c.outline); row(23, 9, 14, c.outline);
  row(16, 7, 16, c.goldDark); row(17, 8, 15, c.terracottaLight);
  row(18, 8, 15, c.terracotta); row(19, 8, 15, c.terracotta);
  row(20, 9, 14, c.terracotta); row(21, 9, 14, c.woodDark);
  row(22, 10, 13, c.woodDark);
});

sprite("hanging-plant", ({ set, row, colors: c }) => {
  // Dense foliage rises from the soil before spilling over both sides of the rim.
  [[10,0],[11,0],[9,1],[10,1],[11,1],[12,1],[7,2],[8,2],[9,2],[12,2],[13,2],[14,2],
   [6,3],[7,3],[8,3],[10,3],[11,3],[13,3],[14,3],[15,3],[5,4],[6,4],[8,4],[9,4],
   [11,4],[12,4],[14,4],[15,4],[16,4],[6,5],[7,5],[9,5],[10,5],[11,5],[13,5],[14,5],[16,5],[17,5]]
    .forEach(([x,y], index) => set(x, y, index % 5 === 0 ? c.leafLight : index % 2 ? c.olive : c.oliveDark));
  [[10,1],[8,3],[12,3],[15,4],[7,5],[10,5],[14,5]].forEach(([x,y]) => set(x,y,c.forest));

  // Low terracotta pot; vines visibly cross its top lip before turning downward.
  row(5, 6, 17, c.outline); row(6, 5, 18, c.outline);
  row(7, 6, 17, c.outline); row(8, 7, 16, c.outline);
  row(9, 7, 16, c.outline); row(10, 8, 15, c.outline);
  row(6, 7, 16, c.goldDark); row(7, 7, 16, c.terracottaLight);
  row(8, 8, 15, c.terracotta); row(9, 8, 15, c.terracotta);
  row(10, 9, 14, c.woodDark);

  // Four stepped, asymmetric trails begin above the rim, hook outward, then descend.
  const vines = [
    [6,4],[5,5],[4,6],[4,7],[3,8],[3,9],[3,10],[2,11],[2,12],[2,13],[3,14],[3,15],[3,16],[2,17],[2,18],[2,19],[1,20],[1,21],[1,22],[1,23],
    [8,4],[8,5],[7,6],[7,7],[6,8],[6,9],[6,10],[5,11],[5,12],[5,13],[6,14],[6,15],[6,16],[5,17],[5,18],[5,19],[5,20],[4,21],[4,22],
    [15,4],[16,5],[17,6],[17,7],[18,8],[18,9],[18,10],[19,11],[19,12],[19,13],[18,14],[18,15],[18,16],[19,17],[19,18],[19,19],[20,20],[20,21],[20,22],[20,23],
    [13,4],[14,5],[15,6],[15,7],[15,8],[16,9],[16,10],[16,11],[15,12],[15,13],[15,14],[16,15],[16,16],[16,17],[15,18],[15,19],[15,20],[14,21],[14,22]
  ];
  vines.forEach(([x,y], index) => set(x, y, index % 7 === 0 ? c.oliveDark : c.forest));

  const leafClusters = [
    [1,10],[2,10],[1,11],[2,11],[3,11], [4,13],[5,13],[4,14],[5,14],[6,14],
    [1,16],[2,16],[1,17],[2,17],[3,17], [3,20],[4,20],[3,21],[4,21],[5,21],
    [18,10],[19,10],[19,11],[20,11],[19,12], [16,13],[17,13],[16,14],[17,14],[18,14],
    [19,16],[20,16],[20,17],[21,17],[20,18], [14,18],[15,18],[14,19],[15,19],[16,19],
    [19,21],[20,21],[20,22],[21,22],[20,23], [13,21],[14,21],[13,22],[14,22],[15,22]
  ];
  leafClusters.forEach(([x,y], index) => set(x, y, index % 6 === 0 ? c.leafLight : index % 2 ? c.oliveDark : c.olive));
});

sprite("globe", ({ set, row, colors: c }) => {
  // A mathematically balanced 16×16 stepped circle, separate from its meridian arm.
  [
    [1,7,12], [2,5,14], [3,4,15], [4,3,16], [5,3,16],
    [6,2,17], [7,2,17], [8,2,17], [9,2,17], [10,2,17], [11,2,17],
    [12,3,16], [13,3,16], [14,4,15], [15,5,14], [16,7,12]
  ].forEach(([y,start,end]) => row(y,start,end,c.outline));
  [
    [2,7,12], [3,6,13], [4,5,14], [5,4,15],
    [6,3,16], [7,3,16], [8,3,16], [9,3,16], [10,3,16], [11,3,16],
    [12,4,15], [13,4,15], [14,5,14], [15,7,12]
  ].forEach(([y,start,end]) => row(y,start,end,c.cerulean));

  // Chunky olive land masses and two cool highlights echo the supplied globe.
  [[7,3],[8,3],[9,3],[6,4],[7,4],[8,4],[9,4],[10,4],[6,5],[7,5],[8,5],[9,5],
   [7,6],[8,6],[9,6],[10,6],[11,6],[9,7],[10,7],[11,7],[8,8],[9,8],[10,8],
   [12,10],[13,10],[14,10],[11,11],[12,11],[13,11],[14,11],[10,12],[11,12],[12,12],
   [9,13],[10,13],[11,13],[8,14],[9,14],[10,14]].forEach(([x,y]) => set(x,y,c.oliveDark));
  [[7,4],[8,4],[7,5],[12,11],[13,11],[11,12]].forEach(([x,y]) => set(x,y,c.olive));
  [[4,7],[5,7],[15,8],[4,11],[13,14]].forEach(([x,y]) => set(x,y,c.ceruleanLight));

  // A gold arm encircles only the upper, right, and lower half of the sphere.
  row(0, 8, 14, c.outline); row(0, 9, 13, c.goldLight);
  row(1, 13, 17, c.outline); row(1, 14, 16, c.gold);
  row(2, 16, 19, c.outline); row(2, 17, 18, c.gold);
  row(3, 18, 20, c.outline); set(19, 3, c.gold);
  row(4, 19, 21, c.outline); set(20, 4, c.goldLight);
  for (let y = 5; y <= 12; y += 1) {
    row(y, 20, 22, c.outline);
    set(21, y, y % 3 === 0 ? c.goldLight : c.gold);
  }
  row(13, 19, 21, c.outline); set(20, 13, c.gold);
  row(14, 18, 20, c.outline); set(19, 14, c.gold);
  row(15, 16, 19, c.outline); row(15, 17, 18, c.gold);
  row(16, 13, 17, c.outline); row(16, 14, 16, c.goldDark);
  row(17, 8, 14, c.outline); row(17, 9, 13, c.gold);

  // A centered golden pedestal reaches the shelf line.
  row(18, 9, 13, c.outline); row(19, 9, 13, c.outline); row(20, 9, 13, c.outline);
  row(18, 10, 12, c.gold); row(19, 10, 12, c.goldDark); row(20, 10, 12, c.goldDark);
  row(21, 7, 15, c.outline); row(21, 9, 13, c.gold);
  row(22, 4, 18, c.outline); row(22, 6, 16, c.gold);
  row(23, 3, 19, c.outline); row(23, 5, 17, c.goldDark);
});

sprite("teacup", ({ set, row, colors: c }) => {
  // Two wisps of steam.
  [[8,3],[8,4],[7,5],[7,6],[8,7],[8,8],[13,2],[13,3],[14,4],[14,5],[13,6],[13,7]].forEach(([x,y], index) => set(x,y,index % 3 === 0 ? c.paper : c.steam));
  // Cup rim, bowl, and a truly hollow handle.
  row(9, 4, 16, c.outline); row(10, 3, 16, c.outline);
  row(11, 3, 16, c.outline); row(12, 3, 16, c.outline);
  row(13, 3, 16, c.outline); row(14, 4, 16, c.outline);
  row(15, 4, 16, c.outline); row(16, 5, 16, c.outline);
  row(17, 6, 15, c.outline); row(18, 7, 14, c.outline);
  row(10, 5, 15, c.tea); row(11, 5, 15, c.cerulean);
  row(12, 4, 15, c.cerulean); row(13, 4, 15, c.cerulean);
  row(14, 5, 15, c.cerulean); row(15, 5, 15, c.cerulean);
  row(16, 6, 14, c.ceruleanDark); row(17, 7, 13, c.ceruleanDark);
  row(18, 8, 13, c.ceruleanDark);
  row(11, 6, 8, c.paper); row(12, 6, 7, c.ceruleanLight);
  row(13, 6, 7, c.ceruleanLight); set(6, 14, c.paper);
  // The handle's dark outer ring and colored rim surround a 3×2-cell hollow.
  row(11, 16, 20, c.outline); row(12, 19, 21, c.outline);
  row(13, 20, 22, c.outline); row(14, 20, 22, c.outline);
  row(15, 19, 21, c.outline); row(16, 16, 20, c.outline);
  row(12, 17, 20, c.cerulean); set(20, 13, c.cerulean);
  set(20, 14, c.cerulean); row(15, 17, 20, c.ceruleanDark);
  // A thinner three-row saucer keeps the cup grounded without looking bulky.
  row(19, 4, 17, c.outline); row(19, 6, 15, c.goldDark);
  row(20, 2, 19, c.outline); row(20, 5, 16, c.paper);
  row(21, 4, 17, c.outline); row(21, 6, 15, c.goldLight);
});

sprite("geode", ({ set, row, colors: c }) => {
  // A rough, upright stone half with a flat bottom: clearly a cut-open rock, not an orb.
  [
    [3,9,14], [4,6,17], [5,4,19], [6,3,20], [7,2,21],
    [8,2,21], [9,1,22], [10,1,22], [11,1,22], [12,1,22],
    [13,1,22], [14,1,22], [15,2,21], [16,2,21], [17,2,21],
    [18,3,20], [19,3,20], [20,4,19], [21,5,18], [22,6,17], [23,6,17]
  ].forEach(([y,start,end]) => row(y,start,end,c.outline));
  [
    [4,9,14], [5,7,16], [6,5,18], [7,4,19], [8,3,20],
    [9,3,20], [10,2,21], [11,2,21], [12,2,21], [13,2,21],
    [14,2,21], [15,3,20], [16,3,20], [17,3,20], [18,4,19],
    [19,4,19], [20,5,18], [21,6,17], [22,7,16], [23,8,15]
  ].forEach(([y,start,end]) => row(y,start,end,c.stone));

  // Irregular chips make the outer rind feel like natural matrix.
  [[9,4],[14,4],[6,6],[17,6],[4,8],[19,8],[3,11],[20,12],[3,15],[19,17],
   [6,20],[16,20],[9,22]].forEach(([x,y]) => set(x,y,c.stoneDark));
  [[10,4],[7,5],[15,5],[5,7],[18,7],[3,10],[20,10],[4,17],[18,18],[8,21],[14,22]]
    .forEach(([x,y]) => set(x,y,c.stoneLight));

  // A one-cell mineral rim surrounds a larger, deep amethyst cavity.
  [
    [7,8,15], [8,6,17], [9,5,18], [10,4,19], [11,3,20],
    [12,3,20], [13,3,20], [14,3,20], [15,3,20], [16,4,19],
    [17,5,18], [18,6,17], [19,6,17], [20,7,16], [21,9,14]
  ].forEach(([y,start,end]) => row(y,start,end,c.quartz));
  [
    [7,10,13], [8,7,16], [9,6,17], [10,5,18], [11,4,19],
    [12,4,19], [13,4,19], [14,4,19], [15,4,19], [16,5,18],
    [17,6,17], [18,7,16], [19,7,16], [20,8,15]
  ].forEach(([y,start,end]) => row(y,start,end,c.amethystDark));

  // Separate crystal points fan upward, leaving dark seams and a visible hollow behind them.
  [[7,12],[7,13],[6,14],[7,14],[8,14],[6,15],[7,15],[8,15],[6,16],[7,16],[8,16],[7,17],[8,17]]
    .forEach(([x,y]) => set(x,y,c.amethyst));
  [[7,12],[7,13],[6,14],[7,14]].forEach(([x,y]) => set(x,y,c.amethystLight));

  [[11,9],[10,10],[11,10],[12,10],[10,11],[11,11],[12,11],[9,12],[10,12],[11,12],[12,12],
   [9,13],[10,13],[11,13],[12,13],[9,14],[10,14],[11,14],[12,14],[9,15],[10,15],[11,15],[12,15],
   [9,16],[10,16],[11,16],[12,16],[9,17],[10,17],[11,17],[12,17]]
    .forEach(([x,y]) => set(x,y,c.amethyst));
  [[11,9],[10,10],[10,11],[9,12],[10,12],[9,13],[10,13],[10,14]].forEach(([x,y]) => set(x,y,c.amethystLight));

  [[15,10],[14,11],[15,11],[14,12],[15,12],[16,12],[14,13],[15,13],[16,13],[13,14],[14,14],[15,14],[16,14],
   [13,15],[14,15],[15,15],[16,15],[13,16],[14,16],[15,16],[16,16],[13,17],[14,17],[15,17],[16,17]]
    .forEach(([x,y]) => set(x,y,c.amethyst));
  [[15,10],[14,11],[14,12],[14,13],[13,14],[14,14]].forEach(([x,y]) => set(x,y,c.amethystLight));

  [[17,13],[17,14],[18,14],[17,15],[18,15],[17,16]].forEach(([x,y]) => set(x,y,c.amethyst));
  [[17,13],[17,14]].forEach(([x,y]) => set(x,y,c.amethystLight));

  // Cool facets, dark seams, and isolated bright pixels create the crystalline sparkle.
  row(18, 8, 15, c.amethyst);
  row(19, 9, 14, c.amethystBlue);
  [[8,13],[8,15],[11,12],[12,14],[10,16],[15,13],[16,15],[14,17]]
    .forEach(([x,y]) => set(x,y,c.amethystBlue));
  [[8,14],[8,16],[13,12],[13,13],[17,15],[17,16],[12,18]].forEach(([x,y]) => set(x,y,c.amethystDark));
  [[7,12],[11,9],[15,10],[10,13],[14,14],[16,16],[9,18],[13,19]]
    .forEach(([x,y]) => set(x,y,c.amethystBright));

  // A short fracture from the cut face into the grey matrix sells the cracked-open rock shape.
  [[11,4],[11,5],[10,5],[10,6],[9,6],[9,7]].forEach(([x,y]) => set(x,y,c.stoneDark));
});

sprite("strawberry-frame", ({ set, row, column, colors: c }) => {
  // Blocky antique frame with clipped corners and a warm off-white canvas.
  row(1, 5, 18, c.outline); row(2, 3, 20, c.outline);
  for (let y = 3; y <= 21; y += 1) row(y, 2, 21, c.outline);
  row(22, 3, 20, c.outline); row(23, 5, 18, c.outline);
  row(2, 6, 17, c.goldDark); row(3, 4, 19, c.gold);
  for (let y = 4; y <= 20; y += 1) row(y, 3, 20, c.gold);
  row(21, 4, 19, c.goldDark); row(22, 6, 17, c.gold);
  row(4, 6, 17, c.goldLight); row(20, 6, 17, c.goldDark);
  column(4, 6, 18, c.goldLight); column(19, 6, 18, c.goldDark);
  for (let y = 5; y <= 19; y += 1) row(y, 5, 18, c.outline);
  for (let y = 6; y <= 18; y += 1) row(y, 6, 17, c.canvas);

  // Tiny muted strawberry portrait.
  [[10,7],[13,7],[9,8],[10,8],[11,8],[12,8],[13,8],[14,8],[10,9],[11,9],[12,9],[13,9]]
    .forEach(([x,y], index) => set(x,y,index % 3 === 0 ? c.leafLight : c.oliveDark));
  [[9,10],[10,10],[11,10],[12,10],[13,10],[14,10],[8,11],[9,11],[10,11],[11,11],[12,11],[13,11],[14,11],[15,11],
   [8,12],[9,12],[10,12],[11,12],[12,12],[13,12],[14,12],[15,12],[9,13],[10,13],[11,13],[12,13],[13,13],[14,13],
   [9,14],[10,14],[11,14],[12,14],[13,14],[14,14],[10,15],[11,15],[12,15],[13,15],[11,16],[12,16]]
    .forEach(([x,y], index) => set(x,y,index % 7 === 0 ? c.berryLight : c.berry));
  [[10,11],[13,11],[9,13],[12,13],[13,15]].forEach(([x,y]) => set(x,y,c.goldLight));
  [[8,11],[15,11],[9,14],[14,14],[10,15],[13,15],[11,16],[12,16]].forEach(([x,y]) => set(x,y,c.berryDark));
});

sprite("sleeping-cat", ({ set, row, column, colors: c }) => {
  // A long, curled body follows the supplied chin-on-paws sleeping pose.
  [
    [4,23,29], [5,20,33], [6,18,35], [7,16,37], [8,15,39],
    [9,14,40], [10,14,40], [11,14,41], [12,14,41], [13,14,41],
    [14,14,41], [15,14,41], [16,14,41], [17,14,41], [18,15,41],
    [19,16,41], [20,17,41], [21,19,41], [22,21,40], [23,24,39],
    [24,27,38]
  ].forEach(([y,start,end]) => row(y,start,end,c.outline));
  [
    [5,23,29], [6,21,32], [7,19,34], [8,18,36], [9,17,38],
    [10,16,39], [11,16,39], [12,16,40], [13,16,40], [14,16,40],
    [15,16,40], [16,16,40], [17,16,40], [18,17,40], [19,18,40],
    [20,20,39], [21,22,39], [22,24,38], [23,28,37]
  ].forEach(([y,start,end]) => row(y,start,end,c.catBlack));

  // Shading separates the shoulder, round back, and tucked rear leg.
  row(6,24,29,c.catBlackLight); row(7,22,31,c.catBlackLight);
  row(8,21,33,c.catBlackLight); row(9,20,33,c.catBlackLight);
  [[19,10],[20,10],[19,11],[20,11],[18,12],[19,12],[18,13],[19,13],
   [18,14],[19,14],[19,15],[20,15]].forEach(([x,y]) => set(x,y,c.catBlackLight));
  row(17,33,38,c.catBlackLight); row(18,31,39,c.catBlackLight);
  row(19,30,40,c.catBlackLight); row(20,30,40,c.catBlackLight);
  row(21,31,39,c.catBlackLight); row(22,33,38,c.catBlackLight);

  // A rounded, front-facing head with upright ears overlaps the shoulder.
  row(2,4,6,c.outline); row(2,16,18,c.outline);
  row(3,3,7,c.outline); row(3,15,19,c.outline);
  row(4,2,8,c.outline); row(4,14,20,c.outline);
  row(5,2,20,c.outline); row(6,1,21,c.outline);
  row(7,0,22,c.outline); row(8,0,22,c.outline);
  row(9,0,22,c.outline); row(10,0,22,c.outline);
  row(11,0,22,c.outline); row(12,0,22,c.outline);
  row(13,0,22,c.outline); row(14,0,22,c.outline);
  row(15,0,22,c.outline); row(16,1,21,c.outline);
  row(17,1,21,c.outline); row(18,2,20,c.outline);
  row(19,4,18,c.outline);

  row(3,4,6,c.catBlack); row(3,16,18,c.catBlack);
  row(4,3,7,c.catBlack); row(4,15,19,c.catBlack);
  row(5,3,19,c.catBlack); row(6,2,20,c.catBlack);
  row(7,1,21,c.catBlack); row(8,1,21,c.catBlack);
  row(9,1,21,c.catBlack); row(10,1,21,c.catBlack);
  row(11,1,21,c.catBlack); row(12,1,21,c.catBlack);
  row(13,1,21,c.catBlack); row(14,1,21,c.catBlack);
  row(15,1,21,c.catBlack); row(16,2,20,c.catBlack);
  row(17,2,20,c.catBlack); row(18,3,19,c.catBlack);

  // Pink inner ears, a white tuxedo blaze, and two closed eyes make the face legible.
  [[4,4],[5,4],[16,4],[17,4],[4,5],[5,5],[16,5],[17,5],
   [5,6],[16,6]].forEach(([x,y]) => set(x,y,c.catPink));
  row(6,10,12,c.catWhite); row(7,9,13,c.catWhite);
  row(8,8,14,c.catWhite); row(9,6,16,c.catWhite);
  row(10,5,17,c.catWhite); row(11,4,18,c.catWhite);
  row(12,4,18,c.catWhite); row(13,3,19,c.catWhite);
  row(14,3,19,c.catWhite); row(15,3,19,c.catWhite);
  row(16,4,18,c.catWhite); row(17,5,17,c.catWhite);
  row(18,7,15,c.catWhite);
  row(11,6,8,c.outline); row(11,14,16,c.outline);
  set(8,12,c.outline); set(14,12,c.outline);
  row(14,10,12,c.catPink); set(9,15,c.outline); set(13,15,c.outline);
  row(16,10,12,c.outline); set(10,17,c.catWhiteShadow); set(12,17,c.catWhiteShadow);

  // A small tuxedo bib joins the face to the body without reading as a third paw.
  row(16,18,21,c.outline); row(17,17,22,c.outline);
  row(18,17,22,c.outline); row(19,18,22,c.outline); row(20,18,21,c.outline);
  row(17,19,20,c.catWhite); row(18,18,21,c.catWhite);
  row(19,19,21,c.catWhiteShadow);

  // Two compact forepaws sit immediately beneath the chin with open space around them.
  row(20,5,10,c.outline); row(21,4,11,c.outline);
  row(22,4,11,c.outline); row(23,4,11,c.outline); row(24,4,11,c.outline);
  row(25,5,10,c.outline); row(26,6,9,c.outline);
  row(21,6,9,c.catWhite); row(22,5,10,c.catWhite);
  row(23,5,10,c.catWhite); row(24,5,10,c.catWhiteShadow);
  row(25,6,9,c.catWhiteShadow); set(8,24,c.outline);

  row(20,12,17,c.outline); row(21,11,18,c.outline);
  row(22,11,18,c.outline); row(23,11,18,c.outline); row(24,11,18,c.outline);
  row(25,12,17,c.outline); row(26,13,16,c.outline);
  row(21,13,16,c.catWhite); row(22,12,17,c.catWhite);
  row(23,12,17,c.catWhite); row(24,12,17,c.catWhiteShadow);
  row(25,13,16,c.catWhiteShadow); set(15,24,c.outline);

  // A white rear sock makes the tucked hind foot readable against the black body.
  row(21,35,40,c.outline); row(22,34,41,c.outline); row(23,34,41,c.outline);
  row(24,34,40,c.outline); row(25,35,39,c.outline); row(26,36,38,c.outline);
  row(22,36,39,c.catWhiteShadow); row(23,35,40,c.catWhite);
  row(24,35,39,c.catWhite); row(25,36,38,c.catWhiteShadow);
  set(38,24,c.outline);
}, { width: 42, height: 28 });

sprite("cat-tail", ({ row, colors: c }) => {
  // A longer S-curved tail uses the cat's four-pixel cell scale from root to tip.
  row(0,1,7,c.outline); row(1,1,8,c.outline); row(2,2,8,c.outline);
  row(3,3,8,c.outline); row(4,4,8,c.outline);
  for (let y = 5; y <= 17; y += 1) row(y,4,8,c.outline);
  row(18,3,8,c.outline); row(19,2,7,c.outline); row(20,1,6,c.outline);
  row(21,0,5,c.outline); row(22,0,4,c.outline); row(23,0,4,c.outline);
  row(24,0,4,c.outline); row(25,1,5,c.outline); row(26,1,6,c.outline);
  row(27,2,7,c.outline); row(28,3,8,c.outline); row(29,4,8,c.outline);
  row(30,5,8,c.outline);

  row(1,2,6,c.catBlack); row(2,3,7,c.catBlack); row(3,4,7,c.catBlack);
  for (let y = 4; y <= 17; y += 1) row(y,5,7,c.catBlack);
  row(18,4,6,c.catBlack); row(19,3,5,c.catBlack); row(20,2,4,c.catBlack);
  row(21,1,3,c.catBlack); row(22,1,3,c.catBlack); row(23,1,3,c.catBlack);
  row(24,1,3,c.catBlackLight); row(25,2,4,c.catBlackLight);
  row(26,2,5,c.catBlackLight); row(27,3,6,c.catBlackLight);
  row(28,4,7,c.catBlackLight); row(29,5,7,c.catBlackLight);
}, { width: 9, height: 32 });

console.log("Built shelf props plus the strict-grid sleeping cat and swinging tail sprites.");
