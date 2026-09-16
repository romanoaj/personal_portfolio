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
  steam: "#9d927c",
  tea: "#4a281e"
});

function sprite(name, draw) {
  const cells = new Map();
  const set = (x, y, fill) => {
    if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || x >= 24 || y < 0 || y >= 24) {
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
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges" aria-hidden="true" focusable="false">',
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

sprite("hanging-plant", ({ set, row, column, colors: c }) => {
  // Hanging pot at the top of the sprite.
  row(1, 6, 17, c.outline); row(2, 5, 18, c.outline);
  row(3, 6, 17, c.outline); row(4, 6, 17, c.outline);
  row(5, 7, 16, c.outline); row(6, 8, 15, c.outline); row(7, 9, 14, c.outline);
  row(2, 7, 16, c.gold); row(3, 7, 16, c.terracottaLight);
  row(4, 7, 16, c.terracotta); row(5, 8, 15, c.terracotta);
  row(6, 9, 14, c.woodDark);

  // Three irregular vines and heart-like leaf clusters.
  column(9, 7, 13, c.forest); column(14, 7, 11, c.forest);
  column(12, 7, 18, c.oliveDark);
  set(8, 13, c.forest); set(8, 14, c.forest); set(7, 15, c.forest);
  set(7, 16, c.forest); set(7, 17, c.forest); set(6, 18, c.forest);
  set(6, 19, c.forest); set(6, 20, c.forest); set(5, 21, c.forest);
  set(5, 22, c.forest); set(5, 23, c.forest);
  set(15, 11, c.forest); set(15, 12, c.forest); set(16, 13, c.forest);
  set(16, 14, c.forest); set(16, 15, c.forest); set(17, 16, c.forest);
  set(17, 17, c.forest); set(17, 18, c.forest); set(18, 19, c.forest);
  set(18, 20, c.forest); set(18, 21, c.forest);
  set(11, 18, c.forest); set(11, 19, c.forest); set(10, 20, c.forest);
  set(10, 21, c.forest); set(10, 22, c.forest);

  const leaves = [
    [7, 10], [6, 11], [7, 11], [8, 11], [6, 12], [7, 12],
    [13, 10], [14, 10], [13, 11], [14, 11], [15, 11], [14, 12],
    [5, 16], [6, 16], [4, 17], [5, 17], [6, 17], [5, 18],
    [17, 14], [18, 14], [17, 15], [18, 15], [19, 15], [18, 16],
    [9, 19], [10, 19], [8, 20], [9, 20], [10, 20], [9, 21],
    [3, 21], [4, 21], [3, 22], [4, 22], [5, 22], [4, 23],
    [18, 19], [19, 19], [19, 20], [20, 20], [19, 21]
  ];
  leaves.forEach(([x, y], index) => set(x, y, index % 4 === 0 ? c.leafLight : index % 2 ? c.oliveDark : c.olive));
});

sprite("globe", ({ set, row, column, colors: c }) => {
  // The globe body occupies an exact 18×18-cell square, with stepped round edges.
  [
    [1, 9, 14], [2, 7, 16], [3, 6, 17], [4, 5, 18],
    [5, 4, 19], [6, 4, 19], [7, 3, 20], [8, 3, 20],
    [9, 3, 20], [10, 3, 20], [11, 3, 20], [12, 3, 20],
    [13, 4, 19], [14, 4, 19], [15, 5, 18], [16, 6, 17],
    [17, 7, 16], [18, 9, 14]
  ].forEach(([y, start, end]) => row(y, start, end, c.outline));

  [
    [2, 9, 14], [3, 8, 15], [4, 7, 16], [5, 6, 17],
    [6, 5, 18], [7, 4, 19], [8, 4, 19], [9, 4, 19],
    [10, 4, 19], [11, 4, 19], [12, 4, 19], [13, 5, 18],
    [14, 5, 18], [15, 6, 17], [16, 7, 16], [17, 8, 15]
  ].forEach(([y, start, end]) => row(y, start, end, c.gold));

  [
    [3, 10, 13], [4, 9, 14], [5, 8, 15], [6, 7, 16],
    [7, 6, 17], [8, 5, 18], [9, 5, 18], [10, 5, 18],
    [11, 5, 18], [12, 6, 17], [13, 6, 17], [14, 7, 16],
    [15, 8, 15], [16, 9, 14]
  ].forEach(([y, start, end]) => row(y, start, end, c.cerulean));

  // Continents and small reflected ocean pixels.
  [[8,5],[9,5],[8,6],[9,6],[10,6],[9,7],[10,7],[11,7],[11,8],[12,8],[11,9],
   [14,5],[15,5],[15,6],[16,6],[15,7],[16,7],[14,8],[15,8],[14,9],
   [6,10],[7,10],[8,10],[7,11],[8,11],[9,11],[9,12],[10,12],[10,13],[11,13],[11,14],
   [14,11],[15,11],[16,11],[15,12],[16,12],[15,13]].forEach(([x,y]) => set(x,y,c.oliveDark));
  [[7,7],[12,5],[13,5],[17,9],[7,13],[13,14]].forEach(([x,y]) => set(x,y,c.ceruleanLight));

  // Narrow axis and broad antique base.
  row(18, 10, 13, c.outline); row(19, 10, 13, c.outline);
  row(20, 10, 13, c.outline); row(21, 10, 13, c.outline);
  row(19, 11, 12, c.gold); row(20, 11, 12, c.gold); row(21, 11, 12, c.goldDark);
  row(22, 6, 17, c.outline); row(23, 5, 18, c.outline);
  row(22, 8, 15, c.gold); row(23, 7, 16, c.goldDark);
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
  // The bowl touches the saucer, whose last row rests on the shelf line.
  row(19, 4, 17, c.outline); row(19, 6, 15, c.goldDark); row(20, 2, 19, c.outline);
  row(21, 3, 18, c.gold); row(22, 5, 16, c.goldLight); row(23, 6, 15, c.outline);
  row(20, 5, 16, c.paper); row(21, 6, 15, c.goldLight);
});

sprite("bookend", ({ set, row, column, colors: c }) => {
  // A small brass cat on an L-shaped dark-wood base.
  set(4, 2, c.outline); set(9, 2, c.outline);
  row(3, 3, 10, c.outline); row(4, 2, 11, c.outline);
  row(5, 2, 11, c.outline); row(6, 2, 11, c.outline);
  row(7, 3, 10, c.outline); row(8, 4, 9, c.outline);
  row(4, 4, 9, c.goldDark); row(5, 3, 10, c.gold);
  row(6, 3, 10, c.gold); row(7, 5, 8, c.goldDark);
  set(4, 5, c.paper); set(9, 5, c.paper); set(5, 6, c.outline); set(8, 6, c.outline);
  column(5, 8, 20, c.outline); column(9, 8, 20, c.outline);
  row(9, 5, 9, c.outline); row(10, 5, 9, c.goldDark);
  row(11, 5, 9, c.gold); row(12, 5, 9, c.gold);
  row(13, 5, 9, c.goldDark); row(14, 5, 9, c.goldDark);
  row(15, 5, 9, c.woodDark); row(16, 5, 9, c.woodDark);
  row(17, 5, 9, c.woodDark); row(18, 5, 9, c.woodDark);
  row(19, 5, 9, c.woodDark); row(20, 5, 9, c.outline);
  // Pixel curl of the tail.
  set(10, 11, c.outline); set(11, 11, c.outline); set(12, 12, c.outline);
  set(12, 13, c.outline); set(12, 14, c.outline); set(11, 15, c.outline);
  set(10, 15, c.outline); set(10, 14, c.goldDark); set(11, 13, c.gold);
  // Wide base points toward the books.
  row(20, 3, 20, c.outline); row(21, 2, 22, c.outline);
  row(22, 2, 22, c.woodDark); row(23, 2, 22, c.outline);
  row(21, 4, 20, c.goldDark); row(22, 4, 20, c.gold);
});

console.log("Built plant, hanging plant, globe, teacup, and bookend sprites.");
