(function () {
  "use strict";

  var SECTION_IDS = Object.freeze([
    "about",
    "experience",
    "projects",
    "research",
    "skills",
    "education",
    "resume",
    "hobbies",
    "contact"
  ]);

  var PROP_DETAILS = Object.freeze({
    plant: { src: "assets/icons/plant.svg", label: "Trailing plant" },
    candle: { src: "assets/icons/candle.svg", label: "Flickering candle" },
    teacup: { src: "assets/icons/teacup.svg", label: "Teacup" },
    globe: { src: "assets/icons/globe.svg", label: "Antique globe" },
    quill: { src: "assets/icons/quill.svg", label: "Quill and inkpot" }
  });

  function decorativeBook(color, height, width, detail, lean) {
    return {
      type: "book",
      color: color,
      height: height || "medium",
      width: width || "regular",
      detail: detail || "plain",
      lean: lean || "none"
    };
  }

  function sectionBook(section, color, height, width, detail, lean) {
    var book = decorativeBook(color, height, width, detail, lean);
    book.section = section;
    return book;
  }

  function prop(name, position) {
    return { type: "prop", name: name, position: position || "standing" };
  }

  /* The order is intentionally fixed so the cabinet always feels hand-arranged. */
  var SHELF_LAYOUT = Object.freeze([
    Object.freeze([
      decorativeBook("olive", "medium", "slim", "bands"),
      decorativeBook("maroon", "tall", "regular", "diamond", "left"),
      sectionBook("about", "aubergine", "tall", "wide", "gilt"),
      decorativeBook("gold", "short", "slim", "bands"),
      decorativeBook("cerulean", "medium", "regular", "plain"),
      prop("plant", "hanging"),
      decorativeBook("burnt-orange", "short", "wide", "bands"),
      decorativeBook("olive", "tall", "regular", "diamond"),
      sectionBook("experience", "maroon", "medium", "wide", "gilt"),
      decorativeBook("aubergine", "tall", "slim", "bands", "right"),
      prop("candle"),
      decorativeBook("cerulean", "short", "regular", "plain"),
      sectionBook("skills", "gold", "tall", "regular", "gilt"),
      decorativeBook("olive", "medium", "wide", "bands")
    ]),
    Object.freeze([
      sectionBook("projects", "olive", "tall", "wide", "gilt"),
      decorativeBook("burnt-orange", "medium", "regular", "bands"),
      decorativeBook("aubergine", "short", "wide", "diamond", "left"),
      decorativeBook("gold", "tall", "slim", "plain"),
      decorativeBook("maroon", "medium", "regular", "bands"),
      prop("globe"),
      decorativeBook("cerulean", "tall", "regular", "diamond"),
      sectionBook("research", "aubergine", "medium", "wide", "gilt"),
      decorativeBook("olive", "short", "slim", "bands"),
      decorativeBook("burnt-orange", "tall", "wide", "plain"),
      decorativeBook("maroon", "medium", "regular", "diamond", "right"),
      decorativeBook("gold", "short", "regular", "bands")
    ]),
    Object.freeze([
      decorativeBook("cerulean", "tall", "slim", "bands"),
      decorativeBook("gold", "medium", "regular", "diamond"),
      sectionBook("education", "maroon", "tall", "wide", "gilt"),
      decorativeBook("olive", "short", "wide", "plain", "left"),
      prop("teacup"),
      decorativeBook("aubergine", "medium", "regular", "bands"),
      decorativeBook("burnt-orange", "tall", "slim", "diamond"),
      decorativeBook("cerulean", "short", "regular", "plain"),
      sectionBook("resume", "gold", "tall", "wide", "gilt"),
      decorativeBook("maroon", "medium", "slim", "bands"),
      decorativeBook("olive", "tall", "regular", "diamond", "right"),
      decorativeBook("aubergine", "short", "wide", "bands")
    ]),
    Object.freeze([
      decorativeBook("burnt-orange", "medium", "wide", "diamond"),
      sectionBook("hobbies", "cerulean", "tall", "wide", "gilt"),
      decorativeBook("gold", "short", "slim", "bands", "left"),
      decorativeBook("olive", "tall", "regular", "plain"),
      decorativeBook("aubergine", "medium", "regular", "diamond"),
      prop("quill"),
      decorativeBook("maroon", "short", "wide", "bands"),
      decorativeBook("cerulean", "medium", "slim", "plain"),
      sectionBook("contact", "burnt-orange", "tall", "wide", "gilt"),
      decorativeBook("gold", "medium", "regular", "diamond"),
      decorativeBook("olive", "short", "wide", "bands"),
      decorativeBook("aubergine", "tall", "slim", "plain", "right"),
      decorativeBook("maroon", "medium", "regular", "bands")
    ])
  ]);

  var FOCUSABLE_SELECTOR = [
    "a[href]",
    "area[href]",
    "button:not([disabled])",
    "input:not([disabled]):not([type='hidden'])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "iframe",
    "object",
    "embed",
    "[contenteditable='true']",
    "[tabindex]:not([tabindex='-1'])"
  ].join(",");

  var HISTORY_STATE_KEY = "portfolioBookOverlay";
  var historyOwner = Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);

  function start() {
    var content = window.PORTFOLIO_CONTENT;
    var bookshelf = document.getElementById("bookshelf");
    var dialog = document.getElementById("book-dialog");
    var closeButton = document.getElementById("dialog-close");
    var dialogTitle = document.getElementById("dialog-title");
    var dialogSubtitle = document.getElementById("dialog-subtitle");
    var leftPage = document.getElementById("page-left");
    var rightPage = document.getElementById("page-right");
    var catalogToggle = document.getElementById("catalog-toggle");
    var catalogMenu = document.getElementById("catalog-menu");

    if (!content || !bookshelf || !dialog || !dialogTitle || !dialogSubtitle || !leftPage || !rightPage) {
      return;
    }

    var activeSection = null;
    var returnFocusTarget = null;
    var focusRequest = 0;
    var locationSyncQueued = false;

    function isDialogOpen() {
      return Boolean(dialog.open || dialog.hasAttribute("open"));
    }
    var bodyOverflowBeforeDialog = "";

    renderBookshelf(bookshelf, content);
    prepareCatalog(catalogMenu, content);
    dialogTitle.setAttribute("tabindex", "-1");
    applyEnvironmentClasses();

    var motionQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;

    function applyEnvironmentClasses() {
      var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.body.classList.toggle("prefers-reduced-motion", Boolean(reducedMotion));
      document.body.classList.toggle("is-document-hidden", document.hidden);
    }

    function onMotionPreferenceChange(event) {
      document.body.classList.toggle("prefers-reduced-motion", event.matches);
    }

    if (motionQuery) {
      if (typeof motionQuery.addEventListener === "function") {
        motionQuery.addEventListener("change", onMotionPreferenceChange);
      } else if (typeof motionQuery.addListener === "function") {
        motionQuery.addListener(onMotionPreferenceChange);
      }
    }

    document.addEventListener("visibilitychange", applyEnvironmentClasses);

    bookshelf.addEventListener("click", function (event) {
      var book = event.target.closest("button[data-section]");
      if (!book || !bookshelf.contains(book)) {
        return;
      }

      openFromControl(book.dataset.section, book);
    });

    if (catalogMenu) {
      catalogMenu.addEventListener("click", function (event) {
        var link = event.target.closest("a[data-section]");
        if (!link || !catalogMenu.contains(link)) {
          return;
        }

        var section = link.dataset.section;
        if (!isSection(section, content)) {
          return;
        }

        event.preventDefault();
        setCatalogOpen(false);
        openFromControl(section, catalogToggle || link);
      });
    }

    if (catalogToggle && catalogMenu) {
      catalogToggle.addEventListener("click", function () {
        setCatalogOpen(catalogMenu.hidden);
      });

      document.addEventListener("pointerdown", function (event) {
        if (!catalogMenu.hidden && !catalogMenu.contains(event.target) && event.target !== catalogToggle) {
          setCatalogOpen(false);
        }
      });
    }

    if (closeButton) {
      closeButton.addEventListener("click", requestDialogClose);
    }

    dialog.addEventListener("cancel", function (event) {
      event.preventDefault();
      requestDialogClose();
    });

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) {
        requestDialogClose();
      }
    });

    dialog.addEventListener("keydown", trapDialogFocus);

    dialog.addEventListener("close", function () {
      if (!activeSection) {
        return;
      }

      if (sectionFromHash(content) === activeSection) {
        removeSectionHash();
      }
      finishClosingDialog(true);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && catalogMenu && !catalogMenu.hidden && !isDialogOpen()) {
        event.preventDefault();
        setCatalogOpen(false, true);
      }
    });

    window.addEventListener("popstate", queueLocationSync);
    window.addEventListener("hashchange", queueLocationSync);

    var initialSection = sectionFromHash(content);
    if (initialSection) {
      returnFocusTarget = bookshelf.querySelector('[data-section="' + initialSection + '"]');
      showSection(initialSection);
    }

    function isSection(section, contentMap) {
      return SECTION_IDS.indexOf(section) !== -1 && Object.prototype.hasOwnProperty.call(contentMap, section);
    }

    function sectionFromHash(contentMap) {
      var hash = window.location.hash.slice(1).toLowerCase();
      return isSection(hash, contentMap) ? hash : null;
    }

    function openFromControl(section, control) {
      if (!isSection(section, content)) {
        return;
      }

      if (control && !dialog.contains(control)) {
        returnFocusTarget = control;
      }

      var currentSection = sectionFromHash(content);
      if (currentSection !== section) {
        var currentState = window.history.state;
        var nextState = currentState && typeof currentState === "object" ? Object.assign({}, currentState) : {};
        nextState[HISTORY_STATE_KEY] = { owner: historyOwner, section: section };
        window.history.pushState(nextState, "", "#" + section);
      }

      showSection(section);
    }

    function showSection(section) {
      var entry = content[section];
      if (!entry) {
        return;
      }

      activeSection = section;
      dialogTitle.textContent = entry.title;
      dialogSubtitle.textContent = entry.subtitle;
      if (closeButton) {
        closeButton.setAttribute("aria-label", "Close " + entry.title + " book");
      }
      leftPage.innerHTML = entry.leftHtml;
      rightPage.innerHTML = entry.rightHtml;
      updateCurrentSection(section);
      setCatalogOpen(false);
      document.body.classList.add("book-is-open");
      if (!isDialogOpen()) {
        bodyOverflowBeforeDialog = document.body.style.overflow;
        document.body.style.overflow = "hidden";
      }

      if (!isDialogOpen()) {
        if (typeof dialog.showModal === "function") {
          dialog.showModal();
        } else {
          dialog.setAttribute("open", "");
          dialog.setAttribute("role", "dialog");
          dialog.setAttribute("aria-modal", "true");
        }
      }

      var thisFocusRequest = ++focusRequest;
      window.requestAnimationFrame(function () {
        if (thisFocusRequest === focusRequest && activeSection === section && isDialogOpen()) {
          dialogTitle.focus({ preventScroll: true });
        }
      });
    }

    function requestDialogClose() {
      if (!activeSection) {
        return;
      }

      var currentState = window.history.state;
      var marker = currentState && typeof currentState === "object" ? currentState[HISTORY_STATE_KEY] : null;
      var ownsEntry = marker && marker.owner === historyOwner;

      if (sectionFromHash(content) === activeSection && ownsEntry) {
        window.history.back();
        return;
      }

      if (sectionFromHash(content) === activeSection) {
        removeSectionHash();
      }
      finishClosingDialog(true);
    }

    function removeSectionHash() {
      var state = window.history.state;
      var nextState = state && typeof state === "object" ? Object.assign({}, state) : null;

      if (nextState) {
        delete nextState[HISTORY_STATE_KEY];
      }

      window.history.replaceState(nextState, "", window.location.pathname + window.location.search);
    }

    function finishClosingDialog(restoreFocus) {
      var target = returnFocusTarget;
      activeSection = null;
      focusRequest += 1;
      updateCurrentSection(null);
      document.body.classList.remove("book-is-open");
      document.body.style.overflow = bodyOverflowBeforeDialog;

      if (isDialogOpen()) {
        if (typeof dialog.close === "function") {
          dialog.close();
        } else {
          dialog.removeAttribute("open");
        }
      }

      if (restoreFocus && target && target.isConnected) {
        window.requestAnimationFrame(function () {
          target.focus({ preventScroll: true });
        });
      }
    }

    function queueLocationSync() {
      if (locationSyncQueued) {
        return;
      }

      locationSyncQueued = true;
      window.requestAnimationFrame(function () {
        locationSyncQueued = false;
        var section = sectionFromHash(content);

        if (section) {
          showSection(section);
        } else if (activeSection) {
          finishClosingDialog(true);
        }
      });
    }

    function trapDialogFocus(event) {
      if (event.key !== "Tab" || !isDialogOpen()) {
        return;
      }

      var focusable = Array.prototype.filter.call(
        dialog.querySelectorAll(FOCUSABLE_SELECTOR),
        function (element) {
          return element.tabIndex >= 0 &&
            element.getAttribute("aria-hidden") !== "true" &&
            !element.hasAttribute("hidden") &&
            (element.getClientRects().length > 0 || element === document.activeElement);
        }
      );

      if (!focusable.length) {
        event.preventDefault();
        dialogTitle.focus({ preventScroll: true });
        return;
      }

      var activeIndex = focusable.indexOf(document.activeElement);
      if (activeIndex === -1) {
        event.preventDefault();
        (event.shiftKey ? focusable[focusable.length - 1] : focusable[0]).focus();
      } else if (event.shiftKey && activeIndex === 0) {
        event.preventDefault();
        focusable[focusable.length - 1].focus();
      } else if (!event.shiftKey && activeIndex === focusable.length - 1) {
        event.preventDefault();
        focusable[0].focus();
      }
    }

    function setCatalogOpen(open, restoreFocus) {
      if (!catalogToggle || !catalogMenu) {
        return;
      }

      catalogMenu.hidden = !open;
      catalogMenu.classList.toggle("is-open", open);
      catalogToggle.setAttribute("aria-expanded", String(open));

      if (!open && restoreFocus) {
        catalogToggle.focus({ preventScroll: true });
      }
    }

    function updateCurrentSection(section) {
      var controls = document.querySelectorAll("[data-section]");
      controls.forEach(function (control) {
        var current = control.dataset.section === section;
        control.classList.toggle("is-current", current);

        if (control.tagName === "A") {
          if (current) {
            control.setAttribute("aria-current", "page");
          } else {
            control.removeAttribute("aria-current");
          }
        }
      });
    }
  }

  function renderBookshelf(bookshelf, content) {
    var fragment = document.createDocumentFragment();

    SHELF_LAYOUT.forEach(function (items, rowIndex) {
      var row = document.createElement("div");
      var contents = document.createElement("div");
      var ledge = document.createElement("div");

      row.className = "shelf-row shelf-row--" + (rowIndex + 1);
      row.setAttribute("role", "group");
      row.setAttribute("aria-label", "Bookshelf row " + (rowIndex + 1));
      contents.className = "shelf-contents";
      ledge.className = "shelf-ledge";
      ledge.setAttribute("aria-hidden", "true");

      items.forEach(function (item, itemIndex) {
        contents.appendChild(
          item.type === "prop"
            ? createProp(item)
            : createBook(item, content, rowIndex, itemIndex)
        );
      });

      row.appendChild(contents);
      row.appendChild(ledge);
      fragment.appendChild(row);
    });

    bookshelf.replaceChildren(fragment);
  }

  function createBook(item, content, rowIndex, itemIndex) {
    var isInteractive = Boolean(item.section && content[item.section]);
    var book = document.createElement(isInteractive ? "button" : "span");
    var classes = [
      "book",
      isInteractive ? "book--section book--featured" : "book--decorative",
      "book--" + item.color,
      "book--" + item.height,
      "book--" + item.width,
      "book--detail-" + item.detail
    ];

    if (item.color === "burnt-orange") {
      classes.push("book--orange");
    }

    if (item.lean !== "none") {
      classes.push("book--lean-" + item.lean);
    }

    book.className = classes.join(" ");

    if (isInteractive) {
      var title = content[item.section].title;
      book.type = "button";
      book.dataset.section = item.section;
      book.setAttribute("aria-haspopup", "dialog");
      book.setAttribute("aria-controls", "book-dialog");
      book.setAttribute("aria-label", "Open " + title + " portfolio book");
      book.title = "Open " + title;

      var titleLabel = document.createElement("span");
      titleLabel.className = "book__title";
      titleLabel.textContent = title;
      book.appendChild(titleLabel);
    } else {
      book.setAttribute("aria-hidden", "true");
    }

    var topBand = document.createElement("span");
    var bottomBand = document.createElement("span");
    var ornament = document.createElement("span");
    topBand.className = "book__band book__band--top";
    bottomBand.className = "book__band book__band--bottom";
    ornament.className = "book__ornament";
    ornament.setAttribute("aria-hidden", "true");
    book.appendChild(topBand);
    book.appendChild(ornament);
    book.appendChild(bottomBand);
    book.dataset.shelfPosition = String(rowIndex + 1) + "-" + String(itemIndex + 1);

    return book;
  }

  function createProp(item) {
    var details = PROP_DETAILS[item.name];
    var wrapper = document.createElement("span");
    var image = document.createElement("img");

    wrapper.className = "shelf-prop shelf-prop--" + item.name + " shelf-prop--" + item.position;
    wrapper.setAttribute("aria-hidden", "true");
    image.src = details.src;
    image.alt = "";
    image.width = 96;
    image.height = 112;
    image.loading = "eager";
    image.decoding = "async";
    image.className = "shelf-prop__image";
    image.dataset.decorativeName = details.label;
    wrapper.appendChild(image);

    return wrapper;
  }

  function prepareCatalog(catalogMenu, content) {
    if (!catalogMenu) {
      return;
    }

    SECTION_IDS.forEach(function (section) {
      var selector = '[data-section="' + section + '"]';
      var link = catalogMenu.querySelector(selector);

      if (!link) {
        link = document.createElement("a");
        link.href = "#" + section;
        link.dataset.section = section;
        link.textContent = content[section].title;
        catalogMenu.appendChild(link);
      }

      link.setAttribute("aria-haspopup", "dialog");
      link.setAttribute("aria-controls", "book-dialog");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
}());
