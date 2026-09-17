/**
 * main.js
 * -----------------------------------------------------------------------
 * Handles interactivity only: no copy lives here.
 *
 * Two layers of interaction:
 *   1) Each row in the "Contents" index is a dropdown — clicking it
 *      expands a panel right there on the page. For most sections that
 *      panel just shows its content (About, Education, Skills, ...).
 *   2) For Research, Experience, and Projects, the panel instead shows a
 *      grid of small cards (two per row) — one per entry. Clicking a
 *      card opens a popup with that single entry's full detail.
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

  const overlay  = document.getElementById("modalOverlay");
  const entryEl  = document.getElementById("entryPanel");
  const closeBtn = document.getElementById("entryClose");
  const kickerEl = document.getElementById("entryKicker");
  const titleEl  = document.getElementById("entryTitle");
  const bodyEl   = document.getElementById("entryBody");
  const folioEl  = document.getElementById("entryFolio");

  let lastFocusedEl = null;

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : str;
    return div.innerHTML;
  }

  function truncate(str, max) {
    if (!str) return "";
    return str.length > max ? str.slice(0, max - 1).trim() + "\u2026" : str;
  }

  /** Render one ordered list of content blocks into an HTML string.
   *  Shared by simple-dropdown panels and the entry detail popup. */
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

        case "links": {
          const items = (block.items || []).map((i) => {
            const prefix = i.prefix ? escapeHTML(i.prefix) : "";
            const text = escapeHTML(i.text);
            const href = escapeHTML(i.href);
            const extra = i.external ? ' target="_blank" rel="noopener"' : "";
            return `<li>${prefix}<a href="${href}"${extra}>${text}</a></li>`;
          }).join("");
          return `<ul>${items}</ul>`;
        }

        case "button":
          return `<p><a class="btn btn--solid" href="${escapeHTML(block.href)}">${escapeHTML(block.label)}</a></p>`;

        default:
          return "";
      }
    }).join("");
  }

  /** One small preview card for a Research / Experience / Projects entry. */
  function renderCard(sectionId, index, entry) {
    const teaser = entry.teaser || (entry.bullets && entry.bullets[0]) || "";
    const meta = entry.meta ? `<div class="entry-card__meta">${escapeHTML(entry.meta)}</div>` : "";
    return (
      `<button type="button" class="entry-card" data-section="${escapeHTML(sectionId)}" data-index="${index}">` +
        meta +
        `<div class="entry-card__heading">${escapeHTML(entry.heading)}</div>` +
        `<div class="entry-card__teaser">${escapeHTML(truncate(teaser, 110))}</div>` +
        `<div class="entry-card__cta">View details &#8594;</div>` +
      `</button>`
    );
  }

  /** The full content for one accordion panel: either its plain body,
   *  or (for card-grid sections) an intro plus a grid of entry cards. */
  function renderPanel(id) {
    const data = ENTRIES[id];
    if (!data) return "";
    if (data.entries) {
      const intro = data.intro ? renderBlocks(data.intro) : "";
      const cards = data.entries.map((entry, i) => renderCard(id, i, entry)).join("");
      return `${intro}<div class="entry-grid">${cards}</div>`;
    }
    return renderBlocks(data.body);
  }

  // ---- Accordion (dropdown) panels ----------------------------------

  function setPanelOpen(id, open) {
    const panel = document.getElementById("panel-" + id);
    const row = document.querySelector('.index-row[data-entry="' + id + '"]');
    if (!panel || !row) return;
    panel.classList.toggle("is-open", open);
    row.classList.toggle("is-open", open);
    row.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      panel.removeAttribute("inert");
    } else {
      panel.setAttribute("inert", "");
    }
  }

  function togglePanel(id) {
    const panel = document.getElementById("panel-" + id);
    if (!panel) return;
    setPanelOpen(id, !panel.classList.contains("is-open"));
  }

  function openAndScrollTo(id) {
    setPanelOpen(id, true);
    const row = document.querySelector('.index-row[data-entry="' + id + '"]');
    if (row) row.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Render every panel's content once up front, wire up its cards, and
  // start it closed + inert (unreachable by keyboard while collapsed).
  document.querySelectorAll(".index-panel[data-panel]").forEach((panel) => {
    const id = panel.dataset.panel;
    const content = panel.querySelector(".index-panel__content");
    if (content) content.innerHTML = renderPanel(id);
    panel.setAttribute("inert", "");
    panel.querySelectorAll(".entry-card").forEach((card) => {
      card.addEventListener("click", () => {
        openEntryModal(card.dataset.section, parseInt(card.dataset.index, 10));
      });
    });
  });

  // Row click -> toggle its own panel.
  document.querySelectorAll(".index-row[data-entry]").forEach((row) => {
    row.addEventListener("click", () => togglePanel(row.dataset.entry));
  });

  // Any other element with data-entry (header/footer quick links) ->
  // force that section open and scroll to it.
  document.querySelectorAll("[data-entry]:not(.index-row)").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openAndScrollTo(el.dataset.entry);
    });
  });

  // ---- Entry detail popup (Research / Experience / Projects cards) ---

  function openEntryModal(sectionId, index) {
    const section = ENTRIES[sectionId];
    const entry = section && section.entries && section.entries[index];
    if (!entry) return;

    kickerEl.textContent = section.title || "";
    titleEl.textContent = entry.heading || "";

    let html = "";
    if (entry.meta) html += `<div class="meta">${escapeHTML(entry.meta)}</div>`;
    if (entry.bullets) {
      html += `<ul>${entry.bullets.map((b) => `<li>${escapeHTML(b)}</li>`).join("")}</ul>`;
    }
    bodyEl.innerHTML = html;
    folioEl.textContent = section.folio || "";

    lastFocusedEl = document.activeElement;
    overlay.classList.add("is-open");
    document.documentElement.classList.add("no-scroll");
    document.body.classList.add("no-scroll");
    overlay.setAttribute("aria-hidden", "false");

    entryEl.querySelector(".entry__scroll").scrollTop = 0;
    closeBtn.focus();
  }

  function closeEntryModal() {
    overlay.classList.remove("is-open");
    document.documentElement.classList.remove("no-scroll");
    document.body.classList.remove("no-scroll");
    overlay.setAttribute("aria-hidden", "true");
    if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
      lastFocusedEl.focus();
    }
  }

  closeBtn.addEventListener("click", closeEntryModal);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeEntryModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) {
      closeEntryModal();
    }
  });
})();
