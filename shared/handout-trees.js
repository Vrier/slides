/* ============================================================
   shared/handout-trees.js — mounts COMPOSE derivation trees.
   Any element  <div class="tree-frame" id="UNIQUE" data-compose='{…}'>
   gets a tree rendered from the JSON in data-compose.
   Trees reveal fully before printing.
   (Handouts with no tree-frames simply do nothing.)
   ============================================================ */
(function () {
  function mount() {
    if (!window.COMPOSE) { setTimeout(mount, 80); return; }
    document.querySelectorAll(".tree-frame[data-compose]").forEach(function (el) {
      if (!el.id || el.dataset.mounted) return;
      var cfg;
      try { cfg = JSON.parse(el.dataset.compose); } catch (e) { console.warn("handout-trees: bad JSON on #" + el.id, e); return; }
      COMPOSE.render("#" + el.id, cfg);
      el.dataset.mounted = "1";
    });
    window.addEventListener("beforeprint", function () {
      document.querySelectorAll(".tree-frame .compose-root").forEach(function (r) {
        if (r._compose && r._compose.revealAll) r._compose.revealAll();
      });
    });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(mount);
  else mount();
})();
