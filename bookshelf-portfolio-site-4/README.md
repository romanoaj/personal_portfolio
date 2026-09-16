# Bookshelf Portfolio

An original, dependency-free one-page portfolio presented as a whimsical pixel-art bookshelf. Exactly three tall, cluttered shelves hold varied grid-drawn book spines, two horizontal book stacks, loose pages, sturdy wood supports, and small pixel props. Titled books open accessible book-shaped dialogs for About Me, Experience, Projects, Research, Skills, Education, Resume, Hobbies, and Contact.

## Preview locally

From this folder, run:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

To run the dependency-free project check:

```bash
node tests/static-smoke.mjs
```

## Personalize it

- Edit the display name, tagline, and social-preview metadata in `index.html`.
- Replace the placeholder section content in `src/scripts/content.js`.
- Add real project images under `assets/images/`, then reference them from the section markup.
- Add a resume under `assets/documents/` and replace the placeholder resume action.
- Update the contact links before publishing.

The nine section IDs are used for shareable URLs such as `#projects`; keep those IDs stable if you want old links to continue working.

## Typography

All interface, spine, and book-page text uses the bundled `Cabinet Pixel Serif`. It is a project-local, grid-rendered derivative of DejaVu Serif Bold; the source font terms and derivative attribution are in `assets/fonts/LICENSE.txt`, with implementation notes in `assets/fonts/README.md`.

To rebuild the local font files after changing `tools/build_pixel_font.py`, run:

```bash
python3 tools/build_pixel_font.py
```

To rebuild the strict 24×24 grid sprites after changing `tools/build_pixel_sprites.mjs`, run:

```bash
node tools/build_pixel_sprites.mjs
```

The supplied visual reference is Pixelta. To use Pixelta in the published site, first obtain the appropriate webfont license, add the licensed webfont file under `assets/fonts/`, and update the source and family name in the `@font-face` rule at the top of `src/styles/main.css`. Do not commit or redistribute a personal-use-only font download.

## Structure

```text
portfolio-bookshelf/
├── index.html
├── README.md
├── assets/
│   ├── documents/   # Add your public resume PDF here
│   ├── fonts/       # Local pixel-serif webfont, notes, and license
│   ├── icons/       # Strict grid-based SVG props and favicon
│   └── images/      # Generated wood texture, its prompt, and future imagery
├── src/
│   ├── scripts/
│   │   ├── content.js
│   │   └── app.js
│   └── styles/
│       └── main.css
├── tests/
│   └── static-smoke.mjs
└── tools/
    ├── build_pixel_font.py
    └── build_pixel_sprites.mjs
```

## Publish

Because this is a static site, the folder can be deployed directly with GitHub Pages, Netlify, Cloudflare Pages, or any basic web host. No build command is required.

## Accessibility notes

- Titled spines are real buttons; decorative books and props are hidden from assistive technology.
- The native dialog supports Escape, backdrop click, focus return, and keyboard focus containment.
- A catalog menu provides a non-visual alternative to finding titles on the shelves.
- Reduced-motion and high-contrast preferences are respected.

## Artwork

The wood texture was generated specifically for this project from the supplied visual references. The upright sprout, over-the-rim pothos, candle, half-arm globe, teacup, quill, amethyst geode, strawberry picture frame, and favicon are original SVG pixel art constructed from non-overlapping, integer-aligned grid cells. The books are CSS-rendered pixel art rather than image-generation assets, so their proportions, labels, band placement, and colors remain easy to tune. No external image or font requests are required.
