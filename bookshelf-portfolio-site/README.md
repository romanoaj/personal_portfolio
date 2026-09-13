# Bookshelf Portfolio

An original, dependency-free one-page portfolio presented as a whimsical pixel-art bookshelf. Titled books open accessible book-shaped dialogs for About Me, Experience, Projects, Research, Skills, Education, Resume, Hobbies, and Contact.

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

## Structure

```text
portfolio-bookshelf/
├── index.html
├── README.md
├── assets/
│   ├── icons/       # Original pixel-art props and favicon
│   ├── images/      # Generated wood texture, its prompt, and future imagery
│   └── documents/   # Add your public resume PDF here
├── src/
│   ├── scripts/
│   │   ├── content.js
│   │   └── app.js
│   └── styles/
│       └── main.css
└── tests/
    └── static-smoke.mjs
```

## Publish

Because this is a static site, the folder can be deployed directly with GitHub Pages, Netlify, Cloudflare Pages, or any basic web host. No build command is required.

## Accessibility notes

- Titled spines are real buttons; decorative books and props are hidden from assistive technology.
- The native dialog supports Escape, backdrop click, focus return, and keyboard focus containment.
- A catalog menu provides a non-visual alternative to finding titles on the shelves.
- Reduced-motion and high-contrast preferences are respected.

## Artwork

The wood texture was generated specifically for this project from the supplied visual references. The five prop icons are original SVG pixel art. No external image or font requests are required.
