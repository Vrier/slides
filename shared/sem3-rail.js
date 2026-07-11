/* ============================================================
   shared/sem3-rail.js — fills the deck chrome for LIU44010.
   Branded "Semantics III / LIU44010". Reads <body data-week="N">
   → window.WEEKS (sem3-meta.js first). Semantics III is a
   proseminar organised in TWO ARCS (formal tools → empirical
   phenomena), not the four lenses; the lens-stepper helpers
   below no-op when their elements are absent, and the left
   progress rail tracks MODULE_SECTIONS.
   ============================================================ */
(function () {
  var CREST = "../../shared/tcd-crest.webp";
  var LENS_ORDER = ["empirical", "historical", "formal", "typological"];
  var LENS_LABELS = { empirical: "Empirical", historical: "Historical", formal: "Formal", typological: "Applied" };

  function railHTML(wk) {
    var rows = (window.MODULE_SECTIONS || []).map(function (s, i) {
      var cls = i === wk.section ? "is-active" : i < wk.section ? "is-done" : "";
      return '<div class="b-prog-item ' + cls + '"><div class="b-prog-mark"></div><div class="b-prog-t">' + s + '</div></div>';
    }).join("");
    return '' +
      '<div class="b-mark">' +
      '  <img class="crest" src="' + CREST + '" alt="Trinity College Dublin crest" style="width:58px;height:67px;object-fit:contain;display:block;flex-shrink:0">' +
      '  <div class="b-mark-txt"><div class="t">Semantics<br>III</div><div class="c">LIU44010</div></div>' +
      '</div>' +
      '<div class="b-progress">' + rows + '</div>' +
      '<div class="b-rail-foot">' +
      '  <div class="wk">Week ' + wk.no + '</div>' +
      '  <div class="no" style="font-size:26px;line-height:1.2;margin-top:4px">' + wk.title + '</div>' +
      '</div>';
  }

  function stepperHTML(activeLens) {
    var ai = LENS_ORDER.indexOf(activeLens);
    return LENS_ORDER.map(function (k, i) {
      var state = i < ai ? "done" : i === ai ? "active" : "";
      return '<div class="lp ' + state + '"><div class="bar"></div><div class="nm">' + LENS_LABELS[k] + '</div></div>';
    }).join("");
  }

  function init() {
    var no = document.body.getAttribute("data-week");
    var wk = window.getWeek ? window.getWeek(no) : null;
    if (!wk) { console.warn("sem3-rail: no week meta for data-week=" + no); return; }

    document.querySelectorAll(".b-rail").forEach(function (el) { el.innerHTML = railHTML(wk); });
    document.querySelectorAll(".lxd2-foot[data-lens]").forEach(function (el) { el.innerHTML = stepperHTML(el.dataset.lens); });
    document.querySelectorAll(".lens-progress[data-lens]").forEach(function (el) { el.innerHTML = stepperHTML(el.dataset.lens); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
