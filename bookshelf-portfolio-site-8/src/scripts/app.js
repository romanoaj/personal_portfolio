(function () {
  "use strict";

  var SECTION_IDS = Object.freeze([
    "about",
    "education",
    "skills",
    "experience",
    "research",
    "projects",
    "hobbies",
    "resume",
    "contact"
  ]);

  var PROP_DETAILS = Object.freeze({
    plant: { src: "assets/icons/plant.svg", label: "Potted sprout" },
    "hanging-plant": { src: "assets/icons/hanging-plant.svg", label: "Trailing pothos" },
    candle: { src: "assets/icons/candle.svg", label: "Flickering candle" },
    teacup: { src: "assets/icons/teacup.svg", label: "Teacup" },
    globe: { src: "assets/icons/globe.svg", label: "Antique globe" },
    quill: { src: "assets/icons/quill.svg", label: "Quill and inkpot" },
    geode: { src: "assets/icons/geode.svg", label: "Amethyst geode" },
    "strawberry-frame": { src: "assets/icons/strawberry-frame.svg", label: "Framed strawberry" }
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

  function horizontalStack(count, pages, topProp) {
    return {
      type: "horizontal-stack",
      books: [
        { color: "cerulean", detail: "bands", width: "long" },
        { color: "burnt-orange", detail: "gilt", width: "short" },
        { color: "aubergine", detail: "bands", width: "medium" }
      ].slice(0, count || 2),
      pages: Boolean(pages),
      topProp: topProp || null
    };
  }

  var DECORATIVE_COLORS = Object.freeze([
    "olive",
    "maroon",
    "deep-red",
    "cerulean",
    "aubergine",
    "gold",
    "burnt-orange",
    "forest",
    "forest",
    "teal"
  ]);
  var NAVY_BOOK_SEQUENCES = Object.freeze([7, 47, 90]);
  var DECORATIVE_HEIGHTS = Object.freeze([
    "petite",
    "tall",
    "short",
    "medium",
    "tower",
    "tall",
    "medium",
    "short",
    "tower"
  ]);
  var DECORATIVE_WIDTHS = Object.freeze([
    "hairline",
    "regular",
    "wide",
    "slim",
    "chunky",
    "regular",
    "slim",
    "wide",
    "regular",
    "chunky",
    "slim",
    "regular"
  ]);
  var DECORATIVE_DETAILS = Object.freeze(["bands", "plain", "diamond", "plain", "bands", "plain"]);

  function decorativeRun(count, offset) {
    var books = [];
    var start = offset || 0;

    for (var index = 0; index < count; index += 1) {
      var sequence = start + index;
      books.push(decorativeBook(
        NAVY_BOOK_SEQUENCES.indexOf(sequence) >= 0
          ? "navy"
          : DECORATIVE_COLORS[sequence % DECORATIVE_COLORS.length],
        DECORATIVE_HEIGHTS[(sequence * 5 + 1) % DECORATIVE_HEIGHTS.length],
        DECORATIVE_WIDTHS[(sequence * 5 + 2) % DECORATIVE_WIDTHS.length],
        DECORATIVE_DETAILS[(sequence * 5 + 1) % DECORATIVE_DETAILS.length]
      ));
    }

    return books;
  }

  function shelfRow() {
    var items = [];

    Array.prototype.forEach.call(arguments, function (part) {
      if (Array.isArray(part)) {
        items.push.apply(items, part);
      } else {
        items.push(part);
      }
    });

    return Object.freeze(items);
  }

  /* Three fixed rows deliberately offset titles and curios from one another. */
  var SHELF_LAYOUT = Object.freeze([
    shelfRow(
      decorativeRun(2, 0),
      prop("plant"),
      decorativeRun(3, 2),
      sectionBook("about", "aubergine", "tower", "wide", "gilt"),
      decorativeRun(4, 5),
      horizontalStack(3, true),
      decorativeRun(3, 9),
      prop("candle"),
      decorativeRun(1, 12),
      sectionBook("education", "maroon", "tall", "slim", "gilt"),
      decorativeRun(3, 13),
      prop("strawberry-frame"),
      decorativeRun(1, 16),
      sectionBook("skills", "gold", "medium", "regular", "gilt"),
      decorativeRun(15, 17)
    ),
    shelfRow(
      decorativeRun(8, 32),
      sectionBook("experience", "maroon", "medium", "regular", "gilt"),
      decorativeRun(2, 40),
      prop("globe"),
      decorativeRun(3, 42),
      decorativeBook("gold", "tower", "wide", "bands", "diagonal"),
      decorativeRun(6, 45),
      sectionBook("research", "aubergine", "tower", "wide", "gilt"),
      decorativeRun(3, 51),
      prop("hanging-plant", "overhanging"),
      decorativeRun(3, 54),
      sectionBook("projects", "olive", "tall", "regular", "gilt"),
      decorativeRun(4, 57),
      decorativeRun(8, 61)
    ),
    shelfRow(
      decorativeRun(8, 63),
      sectionBook("hobbies", "cerulean", "tall", "regular", "gilt"),
      decorativeRun(4, 71),
      prop("quill"),
      decorativeRun(4, 75),
      sectionBook("resume", "gold", "tower", "wide", "gilt"),
      decorativeRun(6, 79),
      horizontalStack(2, false, "teacup"),
      decorativeRun(3, 85),
      prop("geode"),
      sectionBook("contact", "burnt-orange", "tall", "regular", "gilt"),
      decorativeRun(11, 88)
    )
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
    var dialogFrame = dialog ? dialog.querySelector(".book-dialog-frame") : null;
    var leftPage = document.getElementById("page-left");
    var rightPage = document.getElementById("page-right");
    var catalogToggle = document.getElementById("catalog-toggle");
    var catalogMenu = document.getElementById("catalog-menu");

    if (!content || !bookshelf || !dialog || !dialogTitle || !leftPage || !rightPage) {
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
      if (closeButton) {
        closeButton.setAttribute("aria-label", "Close " + entry.title + " book");
      }
      leftPage.innerHTML = entry.leftHtml;
      rightPage.innerHTML = entry.rightHtml;
      leftPage.scrollTop = 0;
      rightPage.scrollTop = 0;
      if (dialogFrame) {
        dialogFrame.scrollTop = 0;
      }
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
      var decorativeOrdinal = 0;

      row.className = "shelf-row shelf-row--" + (rowIndex + 1);
      if (items.some(function (item) { return item.type === "prop" && item.name === "hanging-plant"; })) {
        row.classList.add("shelf-row--has-overhang");
      }
      row.setAttribute("role", "group");
      row.setAttribute("aria-label", "Bookshelf row " + (rowIndex + 1));
      contents.className = "shelf-contents";

      items.forEach(function (item, itemIndex) {
        var currentDecorativeOrdinal = null;

        if (item.type === "book" && !item.section) {
          currentDecorativeOrdinal = decorativeOrdinal;
          decorativeOrdinal += 1;
        }

        if (item.type === "prop") {
          contents.appendChild(createProp(item));
        } else if (item.type === "horizontal-stack") {
          contents.appendChild(createHorizontalStack(item, rowIndex, itemIndex));
        } else {
          contents.appendChild(createBook(item, content, rowIndex, itemIndex, currentDecorativeOrdinal));
        }
      });

      row.appendChild(contents);
      fragment.appendChild(row);
    });

    fragment.appendChild(createLadderScene());

    bookshelf.replaceChildren(fragment);
  }

  function createBook(item, content, rowIndex, itemIndex, decorativeOrdinal) {
    var isInteractive = Boolean(item.section && content[item.section]);
    var book = document.createElement(isInteractive ? "button" : "span");
    var classes = [
      "book",
      isInteractive ? "book--section book--featured" : "book--decorative",
      "book--" + item.color,
      "book--height-" + item.height,
      "book--width-" + item.width,
      "book--detail-" + item.detail,
      "book--pixel-" + (((rowIndex * 7 + itemIndex) % 9) + 1)
    ];

    if (!isInteractive) {
      var responsiveSequence = decorativeOrdinal;
      if (responsiveSequence % 5 === 4) {
        classes.push("book--compact-hide");
      }
      if (responsiveSequence % 10 !== 9) {
        classes.push("book--desktop-tight-keep");
      }
      if (responsiveSequence % 3 !== 2) {
        classes.push("book--tablet-dense-keep");
      }
      if (responsiveSequence % 2 === 0) {
        classes.push("book--tablet-keep");
      }
      if (responsiveSequence % 3 === 0) {
        classes.push("book--small-keep");
      }
      if (responsiveSequence % 4 === 0) {
        classes.push("book--mobile-keep");
      }
      if (responsiveSequence % 6 === 0) {
        classes.push("book--phone-keep");
      }
      if (responsiveSequence % 8 === 0) {
        classes.push("book--tiny-keep");
      }
      if (responsiveSequence % 10 === 0) {
        classes.push("book--micro-keep");
      }
    }

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
    topBand.className = "book__band book__band--top";
    bottomBand.className = "book__band book__band--bottom";
    book.appendChild(topBand);
    if (!isInteractive) {
      var ornament = document.createElement("span");
      ornament.className = "book__ornament";
      ornament.setAttribute("aria-hidden", "true");
      book.appendChild(ornament);
    }
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
    image.height = 96;
    image.loading = "eager";
    image.decoding = "async";
    image.className = "shelf-prop__image";
    image.dataset.decorativeName = details.label;
    wrapper.appendChild(image);

    return wrapper;
  }

  function createHorizontalStack(item, rowIndex, itemIndex) {
    var stack = document.createElement("span");
    stack.className = "horizontal-stack horizontal-stack--" + item.books.length;
    if (item.pages) {
      stack.classList.add("horizontal-stack--with-pages");
    }
    stack.setAttribute("aria-hidden", "true");

    item.books.forEach(function (bookData, stackIndex) {
      var book = document.createElement("span");
      book.className = [
        "horizontal-book",
        "horizontal-book--" + bookData.width,
        "book--" + bookData.color,
        "book--detail-" + bookData.detail,
        "book--pixel-" + (((rowIndex * 5 + itemIndex + stackIndex) % 9) + 1)
      ].join(" ");
      stack.appendChild(book);
    });

    if (item.topProp && PROP_DETAILS[item.topProp]) {
      var details = PROP_DETAILS[item.topProp];
      var topProp = document.createElement("span");
      var topPropImage = document.createElement("img");
      topProp.className = "horizontal-stack__top-prop horizontal-stack__top-prop--" + item.topProp;
      topPropImage.src = details.src;
      topPropImage.alt = "";
      topPropImage.width = 72;
      topPropImage.height = 72;
      topPropImage.loading = "eager";
      topPropImage.decoding = "async";
      topPropImage.dataset.decorativeName = details.label;
      topProp.appendChild(topPropImage);
      stack.appendChild(topProp);
    }

    if (item.pages) {
      ["one", "two"].forEach(function (pageName) {
        var page = document.createElement("span");
        page.className = "loose-page loose-page--" + pageName;
        stack.appendChild(page);
      });
    }

    return stack;
  }

  function createLadderScene() {
    var scene = document.createElement("span");
    var ladder = document.createElement("span");
    var leftRail = document.createElement("span");
    var rightRail = document.createElement("span");
    var cat = document.createElement("span");
    var catBody = document.createElement("img");
    var catTail = document.createElement("img");

    scene.className = "ladder-scene";
    scene.setAttribute("aria-hidden", "true");
    ladder.className = "library-ladder";
    leftRail.className = "library-ladder__rail library-ladder__rail--left";
    rightRail.className = "library-ladder__rail library-ladder__rail--right";
    ladder.appendChild(leftRail);
    ladder.appendChild(rightRail);

    for (var rungIndex = 1; rungIndex <= 5; rungIndex += 1) {
      var rung = document.createElement("span");
      rung.className = "library-ladder__rung library-ladder__rung--" + rungIndex;
      ladder.appendChild(rung);
    }

    cat.className = "ladder-cat";
    catBody.className = "ladder-cat__body";
    catBody.src = "assets/icons/sleeping-cat.svg";
    catBody.alt = "";
    catBody.width = 144;
    catBody.height = 144;
    catBody.loading = "eager";
    catBody.decoding = "async";
    catTail.className = "ladder-cat__tail";
    catTail.src = "assets/icons/cat-tail.svg";
    catTail.alt = "";
    catTail.width = 36;
    catTail.height = 90;
    catTail.loading = "eager";
    catTail.decoding = "async";
    cat.appendChild(catTail);
    cat.appendChild(catBody);
    ladder.appendChild(cat);
    scene.appendChild(ladder);

    return scene;
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
