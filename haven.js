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

document.addEventListener("DOMContentLoaded", function () {
  initForgeAccordion();
  initVgmVideoCards();
});
