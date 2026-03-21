(function () {
  var toggles = Array.prototype.slice.call(document.querySelectorAll('[data-reveal-target]'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-reveal-panel]'));

  if (!toggles.length || !panels.length) {
    return;
  }

  function setActive(nextId) {
    toggles.forEach(function (toggle) {
      var isActive = toggle.getAttribute('data-reveal-target') === nextId;
      toggle.setAttribute('aria-expanded', String(isActive));
      toggle.classList.toggle('is-active', isActive);
    });

    panels.forEach(function (panel) {
      var isActive = panel.getAttribute('data-reveal-panel') === nextId;
      panel.hidden = !isActive;
    });
  }

  toggles.forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var targetId = toggle.getAttribute('data-reveal-target');
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      setActive(isOpen ? '' : targetId);
    });
  });
})();
