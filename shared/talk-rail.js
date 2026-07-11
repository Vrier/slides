/* ============================================================
   shared/talk-rail.js — fills the dir-b left rail for a talk.
   Adapted from the teaching repo's *-rail.js pattern, but talks
   are self-contained: each deck defines its own window.TALK
   inline (no external meta file).

   In the deck, before this script loads:
     window.TALK = {
       mark: "TS",                        // monogram (or set crest: "…webp")
       name: "Title of the talk",         // rail wordmark
       code: "SALT 36 · Jun 2026",        // small caps line under it
       sections: ["Setup", "Data", "Analysis", "Wrap"]
     };

   Each content slide's rail element says where it is:
     <div class="b-rail" data-section="1"></div>   (0-based index)
   Omit data-section to render the rail without progress marks.
   ============================================================ */
(function () {
  function railHTML(t, active) {
    var mark = t.crest
      ? '<img class="crest" src="' + t.crest + '" alt="" style="width:58px;height:67px;object-fit:contain;display:block;flex-shrink:0">'
      : '<div class="b-monogram">' + (t.mark || "·") + "</div>";
    var rows = "";
    if (Array.isArray(t.sections) && active >= 0) {
      rows = '<div class="b-progress">' + t.sections.map(function (s, i) {
        var cls = i === active ? "is-active" : i < active ? "is-done" : "";
        return '<div class="b-prog-item ' + cls + '"><div class="b-prog-mark"></div><div class="b-prog-t">' + s + "</div></div>";
      }).join("") + "</div>";
    }
    return (
      '<div class="b-mark">' + mark +
      '<div class="b-mark-txt"><div class="t">' + (t.name || "") + '</div><div class="c">' + (t.code || "") + "</div></div></div>" +
      rows +
      '<div class="b-rail-foot"><div class="wk">' + (t.foot || "") + "</div></div>"
    );
  }

  function init() {
    var t = window.TALK;
    if (!t) return;
    document.querySelectorAll(".b-rail").forEach(function (el) {
      var a = el.hasAttribute("data-section") ? parseInt(el.dataset.section, 10) : -1;
      el.innerHTML = railHTML(t, isNaN(a) ? -1 : a);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
