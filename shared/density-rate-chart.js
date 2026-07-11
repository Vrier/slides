/* ============================================================
   density-rate-chart.js — reusable scatter component
   Information density vs speech rate, one point per language.
   Source data: Coupé, Oh, Dediu & Pellegrino (2019),
   "Different languages, similar encoding efficiency,"
   Science Advances 5(9): eaaw2594.

   Renders a native SVG scatter into a container, themeable later
   (colours, fonts and chrome read from CSS custom properties /
   the surrounding deck tokens). No external dependencies.

   USAGE
     <div class="drc-host" data-drc='{"callout":true,"statStrip":true}'></div>
     <script src="../shared/density-rate-chart.js"></script>
     // auto-mounts every [data-drc] on load, OR call manually:
     DensityRateChart.render(el, { callout:false, statStrip:false });

   OPTIONS
     callout    {bool}  show the "constant information rate" annotation
                        pointing at the 40 bits/s line   (default false)
     statStrip  {bool}  render the spread strip beneath the chart
                        (default false)
     amber      {string} colour of the highlighted 40 bits/s line
                        (default "#e8a23d")
   ============================================================ */
(function (global) {
  "use strict";

  // ---- data: language, family, density (bits/syll), rate (syll/s) ----
  var DATA = [
    ["Basque",     "Basque",         4.83, 7.54],
    ["Japanese",   "Japonic",        5.03, 8.03],
    ["Italian",    "Indo-European",  5.29, 7.16],
    ["Turkish",    "Turkic",         5.34, 7.05],
    ["Spanish",    "Indo-European",  5.43, 7.73],
    ["Serbian",    "Indo-European",  5.47, 7.15],
    ["Catalan",    "Indo-European",  5.49, 7.07],
    ["Finnish",    "Uralic",         5.49, 7.17],
    ["Korean",     "Koreanic",       5.56, 7.12],
    ["Hungarian",  "Uralic",         5.90, 5.87],
    ["German",     "Indo-European",  6.08, 6.09],
    ["Cantonese",  "Sino-Tibetan",   6.53, 5.57],
    ["French",     "Indo-European",  6.68, 6.88],
    ["Mandarin",   "Sino-Tibetan",   6.96, 5.86],
    ["English",    "Indo-European",  7.09, 6.34],
    ["Thai",       "Tai-Kadai",      7.19, 4.70],
    ["Vietnamese", "Austroasiatic",  8.02, 5.30]
  ];

  // ---- family palette ----
  var FAMILY = {
    "Indo-European": "#3b6fb0",
    "Sino-Tibetan":  "#c0504d",
    "Uralic":        "#3f9a82",
    "Japonic":       "#8e6bb0",
    "Koreanic":      "#5a72c4",
    "Turkic":        "#b07d34",
    "Tai-Kadai":     "#cc5f8f",
    "Austroasiatic": "#6a9a3a",
    "Basque":        "#7a7a7a"
  };
  // legend order (most languages first)
  var FAMILY_ORDER = [
    "Indo-European", "Sino-Tibetan", "Uralic", "Japonic", "Koreanic",
    "Turkic", "Tai-Kadai", "Austroasiatic", "Basque"
  ];

  // ---- plot geometry (viewBox units) ----
  var VB_W = 1200, VB_H = 752;
  var M = { l: 96, r: 132, t: 30, b: 96 };
  var PW = VB_W - M.l - M.r;          // plot width
  var PH = VB_H - M.t - M.b;          // plot height
  var X0 = 4.4, X1 = 8.5;             // density range
  var Y0 = 4.3, Y1 = 8.6;             // rate range

  function px(x) { return M.l + (x - X0) / (X1 - X0) * PW; }
  function py(y) { return M.t + (Y1 - y) / (Y1 - Y0) * PH; }

  var NS = "http://www.w3.org/2000/svg";
  function el(name, attrs, text) {
    var n = document.createElementNS(NS, name);
    if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }

  // iso information-rate curve: rate = IR / density. Returns the visible
  // polyline points plus the right-/bottom-most exit point (for labels).
  function isoCurve(ir) {
    var pts = [], exit = null, steps = 160;
    for (var i = 0; i <= steps; i++) {
      var x = X0 + (X1 - X0) * i / steps;
      var y = ir / x;
      if (y <= Y1 + 1e-6 && y >= Y0 - 1e-6) {
        pts.push([px(x), py(y)]);
        exit = [x, y];           // keep advancing → ends at rightmost visible
      }
    }
    return { pts: pts, exit: exit };
  }

  function polyStr(pts) {
    return pts.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ");
  }

  function render(host, opts) {
    opts = opts || {};
    var amber = opts.amber || "#e8a23d";
    host.classList.add("drc");
    host.innerHTML = "";

    var svg = el("svg", {
      viewBox: "0 0 " + VB_W + " " + VB_H,
      class: "drc-svg",
      role: "img",
      "aria-label": "Scatter plot: information density versus speech rate, one point per language, clustering along a constant information-rate line near 40 bits per second."
    });

    // ---- faint grid + ticks ----
    var gridG = el("g", { class: "drc-grid" });
    var xticks = [5, 6, 7, 8], yticks = [5, 6, 7, 8];
    xticks.forEach(function (t) {
      gridG.appendChild(el("line", { x1: px(t), y1: M.t, x2: px(t), y2: M.t + PH }));
    });
    yticks.forEach(function (t) {
      gridG.appendChild(el("line", { x1: M.l, y1: py(t), x2: M.l + PW, y2: py(t) }));
    });
    svg.appendChild(gridG);

    // ---- axes (left + bottom only; no top/right border) ----
    var axisG = el("g", { class: "drc-axis" });
    axisG.appendChild(el("line", { x1: M.l, y1: M.t, x2: M.l, y2: M.t + PH }));
    axisG.appendChild(el("line", { x1: M.l, y1: M.t + PH, x2: M.l + PW, y2: M.t + PH }));
    svg.appendChild(axisG);

    // tick labels
    var tlG = el("g", { class: "drc-ticklab" });
    xticks.forEach(function (t) {
      tlG.appendChild(el("text", { x: px(t), y: M.t + PH + 34, "text-anchor": "middle" }, t));
    });
    yticks.forEach(function (t) {
      tlG.appendChild(el("text", { x: M.l - 18, y: py(t) + 7, "text-anchor": "end" }, t));
    });
    svg.appendChild(tlG);

    // ---- iso information-rate curves ----
    var curveG = el("g", { class: "drc-curves" });
    var lblG = el("g", { class: "drc-curvelab" });
    [30, 35, 45].forEach(function (ir) {
      var c = isoCurve(ir);
      curveG.appendChild(el("polyline", { points: polyStr(c.pts), class: "drc-iso" }));
      var ex = c.exit;
      // label just outside the exit point
      var atRight = ex[0] > X1 - 0.05;
      lblG.appendChild(el("text", {
        x: px(ex[0]) + (atRight ? 12 : 9),
        y: py(ex[1]) + (atRight ? 6 : -9),
        "text-anchor": "start", class: "drc-iso-lab"
      }, String(ir)));
    });
    // amber 40 line on top
    var c40 = isoCurve(40);
    curveG.appendChild(el("polyline", {
      points: polyStr(c40.pts), class: "drc-iso40",
      style: "stroke:" + amber
    }));
    lblG.appendChild(el("text", {
      x: px(c40.exit[0]) + 12, y: py(c40.exit[1]) + 6,
      "text-anchor": "start", class: "drc-iso40-lab",
      style: "fill:" + amber
    }, "\u2248 40 bits/s"));
    svg.appendChild(curveG);
    svg.appendChild(lblG);

    // ---- optional callout pointing at the 40 line ----
    if (opts.callout) {
      var tx = 6.95, tyv = 40 / 6.95;      // target on amber line ~ (6.95, 5.76)
      var bx = 7.55, byv = 6.95;           // box anchor (clear zone, upper-right)
      var cg = el("g", { class: "drc-callout" });
      cg.appendChild(el("line", {
        x1: px(bx), y1: py(byv) + 6, x2: px(tx), y2: py(tyv) - 6, class: "drc-leader",
        style: "stroke:" + amber
      }));
      cg.appendChild(el("circle", { cx: px(tx), cy: py(tyv), r: 5.5, class: "drc-leader-dot", style: "fill:" + amber }));
      cg.appendChild(el("text", { x: px(bx), y: py(byv) - 6, "text-anchor": "start", class: "drc-callout-t1" }, "constant"));
      cg.appendChild(el("text", { x: px(bx), y: py(byv) + 24, "text-anchor": "start", class: "drc-callout-t2" }, "information rate"));
      svg.appendChild(cg);
    }

    // ---- points ----
    var ptG = el("g", { class: "drc-pts" });
    DATA.forEach(function (d) {
      var name = d[0], fam = d[1], dens = d[2], rate = d[3];
      ptG.appendChild(el("circle", {
        cx: px(dens), cy: py(rate), r: 11,
        fill: FAMILY[fam] || "#888",
        class: "drc-pt", "data-lang": name, "data-family": fam
      }));
    });
    svg.appendChild(ptG);

    // ---- direct point labels for the four anchor cases (corners of the cloud) ----
    var dlG = el("g", { class: "drc-ptlab" });
    var anchors = {
      "Basque":     [ 14, -10, "start"],
      "Japanese":   [ 14,   2, "start"],
      "Thai":       [-14,  20, "end"],
      "Vietnamese": [ -2,  26, "middle"]
    };
    DATA.forEach(function (d) {
      var a = anchors[d[0]];
      if (!a) return;
      dlG.appendChild(el("text", {
        x: px(d[2]) + a[0], y: py(d[3]) + a[1], "text-anchor": a[2], class: "drc-ptlab-t"
      }, d[0]));
    });
    svg.appendChild(dlG);

    // ---- axis titles ----
    var atG = el("g", { class: "drc-axistitle" });
    atG.appendChild(el("text", {
      x: M.l + PW / 2, y: VB_H - 14, "text-anchor": "middle"
    }, "Information density (bits per syllable)"));
    var yt = el("text", {
      x: 26, y: M.t + PH / 2, "text-anchor": "middle",
      transform: "rotate(-90 26 " + (M.t + PH / 2) + ")"
    }, "Speech rate (syllables per second)");
    atG.appendChild(yt);
    svg.appendChild(atG);

    // ---- legend (lower-left, empty region, no frame) ----
    var lgG = el("g", { class: "drc-legend" });
    var lx = M.l + 20, ly = M.t + PH - 168, col2 = lx + 196, rowH = 30;
    FAMILY_ORDER.forEach(function (fam, i) {
      var col = i < 5 ? 0 : 1;
      var row = i < 5 ? i : i - 5;
      var gx = col === 0 ? lx : col2;
      var gy = ly + row * rowH;
      lgG.appendChild(el("circle", { cx: gx, cy: gy - 5, r: 8, fill: FAMILY[fam] }));
      lgG.appendChild(el("text", { x: gx + 16, y: gy, "text-anchor": "start", class: "drc-legend-t" }, fam));
    });
    svg.appendChild(lgG);

    host.appendChild(svg);

    // ---- optional stat strip beneath the chart ----
    if (opts.statStrip) {
      var strip = document.createElement("div");
      strip.className = "drc-strip";
      strip.innerHTML =
        '<span><b>density spread</b> &plusmn;15%</span>' +
        '<span class="drc-strip-sep"></span>' +
        '<span><b>rate spread</b> &plusmn;15%</span>' +
        '<span class="drc-strip-sep"></span>' +
        '<span class="drc-strip-hi"><b>information rate spread</b> &plusmn;8%</span>';
      host.appendChild(strip);
    }
  }

  function autoMount() {
    var hosts = document.querySelectorAll("[data-drc]");
    hosts.forEach(function (h) {
      var opts = {};
      try { opts = JSON.parse(h.getAttribute("data-drc") || "{}"); } catch (e) {}
      render(h, opts);
    });
  }

  global.DensityRateChart = { render: render, DATA: DATA, FAMILY: FAMILY };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoMount);
  } else {
    autoMount();
  }
})(window);
