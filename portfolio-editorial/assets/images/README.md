# Images go here

Nothing in this folder is required for the site to work — every image on
the page has a hand-drawn placeholder that shows automatically until the
real file exists. Once you add a file with the exact name below, it
replaces the placeholder with no code changes needed.

| File to add                  | Where it appears        | Suggested shape          |
|-------------------------------|--------------------------|---------------------------|
| `portrait.jpg`                | Hero section (top)       | Portrait, 4:5 ratio       |
| `about-portrait.jpg`          | "About Me" popup         | Portrait or square        |
| `hobbies-photo.jpg`           | "Hobbies" popup          | Landscape or square       |
| `resume-preview.jpg`          | "Résumé" popup           | Screenshot of your résumé |
| `og-image.jpg`                | Link preview (LinkedIn, iMessage, Slack, etc.) | 1200×630px |

Want more images (e.g. inside "Research" or "Experience")? Open
`js/content.js`, find the relevant entry, and add a block like:

```js
{ type: "image", caption: "Figure 1", src: "assets/images/your-file.jpg" }
```

Keep file sizes reasonable (under ~500KB each is plenty for the web) so
the page stays fast on GitHub Pages.
