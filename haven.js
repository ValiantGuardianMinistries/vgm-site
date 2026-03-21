document.addEventListener("DOMContentLoaded", function () {
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
});
