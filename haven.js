function initForgeAccordion() {
  var forgeNodes = Array.from(document.querySelectorAll(".forge-node"));
  if (!forgeNodes.length) {
    return;
  }

  forgeNodes.forEach(function (node) {
    var trigger = node.querySelector(".forge-trigger");
    var panel = node.querySelector(".forge-subgrid");
    if (!trigger || !panel) {
      return;
    }

    trigger.addEventListener("click", function () {
      var willOpen = !node.classList.contains("is-open");

      forgeNodes.forEach(function (otherNode) {
        otherNode.classList.remove("is-open");
        var otherTrigger = otherNode.querySelector(".forge-trigger");
        if (otherTrigger) {
          otherTrigger.setAttribute("aria-expanded", "false");
        }
      });

      if (willOpen) {
        node.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });
}

function initVgmVideoCards() {
  var watchButtons = Array.from(document.querySelectorAll(".vgm-watch-btn"));
  if (!watchButtons.length) {
    return;
  }

  var activeButton = null;

  function closeVideo(button) {
    var targetId = button.getAttribute("aria-controls");
    var slot = targetId ? document.getElementById(targetId) : null;
    var card = button.closest(".vgm-session-card");
    var watchLabel = button.getAttribute("data-watch-label") || "Watch Session";

    if (slot) {
      slot.innerHTML = "";
      slot.hidden = true;
    }

    if (card) {
      card.classList.remove("is-open");
    }

    button.textContent = watchLabel;
    button.setAttribute("aria-expanded", "false");
  }

  function openVideo(button) {
    var videoId = button.getAttribute("data-video-id");
    var videoTitle = button.getAttribute("data-video-title") || "Session Video";
    var targetId = button.getAttribute("aria-controls");
    var slot = targetId ? document.getElementById(targetId) : null;
    var card = button.closest(".vgm-session-card");
    var videoWrap;
    var frame;

    if (!videoId || !slot) {
      return;
    }

    videoWrap = document.createElement("div");
    videoWrap.className = "video";

    frame = document.createElement("iframe");
    frame.src = "https://www.youtube.com/embed/" + videoId + "?rel=0&autoplay=1";
    frame.title = videoTitle;
    frame.loading = "eager";
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    frame.allowFullscreen = true;

    videoWrap.appendChild(frame);
    slot.innerHTML = "";
    slot.appendChild(videoWrap);
    slot.hidden = false;

    if (card) {
      card.classList.add("is-open");
    }

    button.textContent = "Close Video";
    button.setAttribute("aria-expanded", "true");
  }

  watchButtons.forEach(function (button) {
    button.setAttribute("data-watch-label", button.textContent.trim() || "Watch Session");

    button.addEventListener("click", function () {
      var isOpen = button.getAttribute("aria-expanded") === "true";

      if (activeButton && activeButton !== button) {
        closeVideo(activeButton);
        activeButton = null;
      }

      if (isOpen) {
        closeVideo(button);
        activeButton = null;
        return;
      }

      openVideo(button);
      activeButton = button;
    });
  });
}

function initDevotionalBrowser() {
  var browser = document.querySelector("[data-devo-browser]");
  if (!browser) {
    return;
  }

  var categoryButtons = Array.from(browser.querySelectorAll("[data-devo-category]"));
  var bookButtons = Array.from(browser.querySelectorAll("[data-devo-book]"));
  var bookPanels = Array.from(browser.querySelectorAll("[data-devo-books-panel]"));
  var chapterPanels = Array.from(browser.querySelectorAll("[data-devo-chapters-panel]"));

  function setPressedState(buttons, activeValue, attributeName) {
    buttons.forEach(function (button) {
      var isActive = button.getAttribute(attributeName) === activeValue;
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
      button.classList.toggle("is-active", isActive);
    });
  }

  function showChapters(book) {
    chapterPanels.forEach(function (panel) {
      var isActive = panel.getAttribute("data-devo-chapters-panel") === book;
      panel.hidden = !isActive;
      panel.classList.toggle("is-active", isActive);
    });
  }

  function showBooks(category) {
    bookPanels.forEach(function (panel) {
      var isActive = panel.getAttribute("data-devo-books-panel") === category;
      panel.hidden = !isActive;
      panel.classList.toggle("is-active", isActive);
    });

    var matchingBooks = bookButtons.filter(function (button) {
      return button.getAttribute("data-devo-category-parent") === category;
    });

    if (!matchingBooks.length) {
      chapterPanels.forEach(function (panel) {
        panel.hidden = true;
        panel.classList.remove("is-active");
      });
      return;
    }

    var firstBook = matchingBooks[0].getAttribute("data-devo-book");
    setPressedState(bookButtons, firstBook, "data-devo-book");
    showChapters(firstBook);
  }

  categoryButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var category = button.getAttribute("data-devo-category");
      setPressedState(categoryButtons, category, "data-devo-category");
      showBooks(category);
    });
  });

  bookButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var book = button.getAttribute("data-devo-book");
      setPressedState(bookButtons, book, "data-devo-book");
      showChapters(book);
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initForgeAccordion();
  initVgmVideoCards();
  initDevotionalBrowser();
});
