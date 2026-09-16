/**
 * main.js
 * -----------------------------------------------------------------------
 * Handles interactivity only: opening/closing the entry popup and
 * rendering its content blocks from content.js. No copy lives here.
 * -----------------------------------------------------------------------
 */

(function () {
  "use strict";

  // Populate every element tagged with data-site / data-site-href from
  // SITE_INFO in content.js, so name & contact details live in one place.
  if (typeof SITE_INFO !== "undefined") {
    document.querySelectorAll("[data-site]").forEach((el) => {
      const key = el.dataset.site;
      if (SITE_INFO[key] !== undefined) el.textContent = SITE_INFO[key];
    });
    document.querySelectorAll("[data-site-href]").forEach((el) => {
      const key = el.dataset.siteHref;
      if (SITE_INFO[key] !== undefined) el.setAttribute("href", SITE_INFO[key]);
    });
  }

  const overlay    = document.getElementById("modalOverlay");
  const entryEl    = document.getElementById("entryPanel");
  const closeBtn   = document.getElementById("entryClose");
  const kickerEl   = document.getElementById("entryKicker");
  const titleEl    = document.getElementById("entryTitle");
  const bodyEl     = document.getElementById("entryBody");
  const folioEl    = document.getElementById("entryFolio");
  const triggers   = document.querySelectorAll("[data-entry]");

  let lastFocusedEl = null;

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /** Render one ordered list of content blocks into an HTML string. */
  function renderBlocks(blocks) {
    if (!blocks) return "";
    return blocks.map((block) => {
      switch (block.type) {

        case "paragraph":
          return `<p>${escapeHTML(block.text)}</p>`;

        case "image": {
          const caption = escapeHTML(block.caption || "Image placeholder");
          if (block.src) {
            const src = escapeHTML(block.src);
            return `<div class="entry__image">` +
                     `<img src="${src}" alt="${caption}" loading="lazy" ` +
                     `onerror="this.style.display='none'; this.parentElement.classList.add('is-missing');">` +
                     `<span class="entry__image-fallback">\uD83C\uDFDE\uFE0F&nbsp; ${caption} &mdash; add a file at ${src}</span>` +
                   `</div>`;
          }
          return `<div class="entry__image is-missing"><span class="entry__image-fallback">\uD83C\uDFDE\uFE0F&nbsp; ${caption}</span></div>`;
        }

        case "quote":
          return `<div class="entry__quote">${escapeHTML(block.text)}</div>`;

        case "tags": {
          const items = (block.items || []).map((i) => `<li>${escapeHTML(i)}</li>`).join("");
          const label = block.label ? `<div class="meta">${escapeHTML(block.label)}</div>` : "";
          return `${label}<ul class="entry__tags">${items}</ul>`;
        }

        case "entry": {
          const meta = block.meta ? `<div class="meta">${escapeHTML(block.meta)}</div>` : "";
          const bullets = block.bullets
            ? `<ul>${block.bullets.map((b) => `<li>${escapeHTML(b)}</li>`).join("")}</ul>`
            : "";
          return `<h3>${escapeHTML(block.heading)}</h3>${meta}${bullets}`;
        }

        case "list": {
          const items = (block.items || []).map((i) => `<li>${escapeHTML(i)}</li>`).join("");
          return `<ul>${items}</ul>`;
        }

        case "button":
          return `<p><a class="btn btn--solid" href="${escapeHTML(block.href)}">${escapeHTML(block.label)}</a></p>`;

        default:
          return "";
      }
    }).join("");
  }

  function openEntry(id) {
    const data = typeof ENTRIES !== "undefined" ? ENTRIES[id] : null;
    if (!data) return;

    kickerEl.textContent = data.kicker || "";
    titleEl.textContent = data.title || "";
    bodyEl.innerHTML = renderBlocks(data.body);
    folioEl.textContent = data.folio || "";

    lastFocusedEl = document.activeElement;
    overlay.classList.add("is-open");
    document.documentElement.classList.add("no-scroll");
    document.body.classList.add("no-scroll");
    overlay.setAttribute("aria-hidden", "false");

    entryEl.querySelector(".entry__scroll").scrollTop = 0;
    closeBtn.focus();
  }

  function closeEntry() {
    overlay.classList.remove("is-open");
    document.documentElement.classList.remove("no-scroll");
    document.body.classList.remove("no-scroll");
    overlay.setAttribute("aria-hidden", "true");
    if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
      lastFocusedEl.focus();
    }
  }

  triggers.forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openEntry(el.dataset.entry);
    });
  });

  closeBtn.addEventListener("click", closeEntry);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeEntry();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) {
      closeEntry();
    }
  });
})();
