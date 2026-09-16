# Your Name — Portfolio

A single-page, editorial-style portfolio: a "table of contents" of
clickable sections (About, Research, Education, Experience, Skills,
Résumé, Interests, Hobbies, Contact) that each open into a magazine-style
popup. Pastel sage, warm paper tones, serif type, hand-drawn botanical
accents.

Plain HTML/CSS/JS — no build step, no dependencies.

## Deploying to GitHub Pages

1. Create a new GitHub repository (or use an existing one).
2. Push the contents of this folder to the repo's root (or to a `/docs`
   folder — your choice, just make sure the setting in step 3 matches).
3. In the repo, go to **Settings → Pages**, set **Source** to the branch
   and folder you pushed to, and save.
4. GitHub will give you a URL like `https://yourusername.github.io/repo-name/`
   — that's the link to put on LinkedIn and in job applications.

That's it — no build tools, no npm install, nothing to compile.

## File structure

```
portfolio-editorial/
├── index.html               Page structure: header, hero, index, footer, popup
├── css/
│   ├── tokens.css           Color palette & font variables — edit here to re-theme
│   ├── base.css             Reset, paper texture, typography defaults
│   ├── layout.css           Header, hero, buttons, footer
│   ├── index-grid.css       The clickable "table of contents" rows
│   └── modal.css            The popup: paper card, tags, image placeholders
├── js/
│   ├── content.js           ← Nearly all the text & links you'll edit lives here
│   └── main.js               Popup open/close logic — no copy in here
└── assets/
    ├── icons/                3 original hand-drawn SVG botanical line-art pieces
    ├── images/                Drop your photos here (see its own README)
    └── documents/              Drop your résumé PDF here (see its own README)
```

## Personalizing it

**Your name, role, and contact links** all live in one place: the
`SITE_INFO` object at the top of `js/content.js`. Change it once and it
updates the header, hero, footer, and contact popup automatically.

**What each popup says** is in the `ENTRIES` object in the same file.
Each section is a `kicker` / `title` / `folio` plus an ordered list of
content `body` blocks — paragraphs, pull-quotes, tag rows, job/degree
entries, plain lists, buttons, and images. The comment at the top of
`content.js` documents every block type. You do not need to touch
`main.js` or `index.html` to change what a section says.

**Photos & résumé:** see `assets/images/README.md` and
`assets/documents/README.md` — every image already has a placeholder
that's automatically replaced the moment you add a correctly-named file.
No code edits required.

**Adding or removing a section:** each entry needs three things kept in
sync — a `<button data-entry="id">` row inside `.index-list` in
`index.html`, matching quick-links in the header/hero if you want them
reachable directly (`data-entry="id"`), and an `id:` key in `ENTRIES` in
`content.js`.

**Colors & type:** everything is a CSS variable in `css/tokens.css` —
the sage/cream/charcoal palette, plus the three font families
(`Fraunces` for display, `Lora` for body, `Jost` for labels/nav).

## Accessibility notes

- Every clickable section is a real `<button>` — reachable by Tab,
  openable with Enter/Space.
- The popup is a `role="dialog"` with `aria-modal`, closes on Escape,
  a click on the dark backdrop, or the close button, and returns focus
  to whatever opened it.
- Motion (hover lifts, the popup's entrance) is disabled for visitors
  with `prefers-reduced-motion` set.
- The layout reflows to a single column below ~780px, and the index
  rows drop their teaser text below ~720px so nothing overlaps on
  small phones.

## A couple of honest design notes

- **No stock nature photography:** rather than pulling in someone else's
  photos or illustrations from the reference images you shared, every
  placeholder is exactly that — a clearly-labeled placeholder — and the
  only artwork included is three original line-art botanical SVGs in
  `assets/icons/`. Your own photography is what will actually make this
  page feel like *you*; the layout is just waiting for it.
- **Serif body text:** editorial print references (like the Ghibli zine
  and the Boerum spreads you shared) set body copy in serif, so this
  does too (Lora). If you'd prefer a cleaner sans-serif body for
  readability on long entries, swap `--font-body` in `tokens.css`.
