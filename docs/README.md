# Your Name — Portfolio

A single-page, editorial-style portfolio: a "table of contents" of ten
sections (About, Research, Education, Experience, Projects, Skills,
Résumé, Interests, Hobbies, Contact). Clicking a section drops it open
right there on the page. Three of them — Research, Experience, and
Projects — open into a grid of small cards instead of plain text; click
a card to pop open the full detail on that one entry. Pastel sage, warm
paper tones, serif type, hand-drawn botanical accents.

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
├── index.html               Page structure: header, hero, index rows + panels, footer
├── css/
│   ├── tokens.css           Color palette & font variables — edit here to re-theme
│   ├── base.css             Reset, paper texture, typography defaults
│   ├── layout.css           Header, hero, buttons, footer
│   ├── index-grid.css       The dropdown rows, their panels, and the entry-card grid
│   └── modal.css            The popup used for a single Research/Experience/Projects entry
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
updates the header, hero, footer, and contact section automatically.

**What each section says** is in the `ENTRIES` object in the same file.
There are two shapes:
- Most sections (About, Education, Skills, Résumé, Interests, Hobbies,
  Contact) are a `title` / `folio` plus an ordered list of `body`
  blocks — paragraphs, pull-quotes, tag rows, plain lists, buttons, and
  images — shown directly in the dropdown.
- Research, Experience, and Projects instead have an `entries` array —
  one object per card — plus an optional `intro` shown above the card
  grid. Clicking a card opens the popup with that entry's full detail.

The big comment at the top of `content.js` documents every block type
and the exact entry shape. You do not need to touch `main.js` or
`index.html` to change what a section says.

**Photos & résumé:** see `assets/images/README.md` and
`assets/documents/README.md` — every image already has a placeholder
that's automatically replaced the moment you add a correctly-named file.
No code edits required.

**Adding or removing a section:** three things need to stay in sync —
an `<li>` inside `.index-list` in `index.html` (a `.index-row` button
plus its matching `.index-panel` with an empty `.index-panel__content`
div — copy an existing one as a template), a matching `id:` key in
`ENTRIES` in `content.js`, and, only if you want it reachable as a
quick-link from the header, a `data-entry="id"` button there too.

**Colors & type:** everything is a CSS variable in `css/tokens.css` —
the sage/cream/charcoal palette, plus the three font families
(`Fraunces` for display, `Lora` for body, `Jost` for labels/nav).

## Accessibility notes

- Every section header is a real `<button>` with `aria-expanded` /
  `aria-controls`, reachable by Tab and openable with Enter/Space; its
  panel is marked `inert` while collapsed so keyboard focus can't land
  on hidden content inside it.
- Each entry card is also a real `<button>`. The detail popup it opens
  is a `role="dialog"` with `aria-modal`, closes on Escape, a click on
  the dark backdrop, or the close button, and returns focus to the card
  that opened it.
- Motion (hover lifts, the dropdown's expand/collapse, the popup's
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
