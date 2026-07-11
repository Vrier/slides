/* ============================================================================
   compose-kit.js — author-facing renderer for COMPOSE compositions.
   Turns a tiny spec (lexicon + bracketed tree) into a pixel-faithful COMPOSE
   tree you can drop into a slide or a handout. Vanilla JS — works anywhere.

   Requires (load first): compose-engine.js, compose-kit.css, and the
   Spectral + IBM Plex Mono web fonts.

   ── Authoring ──────────────────────────────────────────────────────────────
   COMPOSE.render(target, {
     sentence: "Frodo runs",                  // optional italic gloss
     lexicon: {                               // word → denotation (L = λ)
       "Frodo": "f",
       "runs":  "Lx.run(x)"
     },
     tree: "[.S [.DP Frodo ] [.VP runs ] ]",  // labelled-bracket (qtree) notation
     mode: "interactive",   // "interactive" (click / step to build) | "static" (all shown)
     showTypes: true,       // type badges ⟨e,t⟩ under each node
     density: "regular",    // "compact" | "regular" | "roomy"
     scale: 1,              // multiply the whole figure (handy on slides)
     constants: { "e": "f j m" },   // optional explicit domain decls by type…
     variables: { "<e,t>": "P Q" }, // …(single-letter individual denotations auto-typed e)
     rules: { pm: true, pa: false } // FA + NN always on; PM on by default
   });
   Notation in denotations: L/λ/\\ = lambda, A = ∀, E = ∃, & = ∧, ~ = ¬, -> = →.
   Multi-letter predicates fine (run, love, giggle). Application: f(x), love(y)(x).
   ============================================================================ */
window.COMPOSE = (function () {
  'use strict';
  const LC = window.LC, F = window.LCFormat;
  if (!LC || !F) { console.error('COMPOSE kit: compose-engine.js must load first.'); }

  /* ---- tree layout (verbatim geometry from the COMPOSE app) ---- */
  function layoutTree(root, density) {
    const P = { compact: { gx: 158, gy: 136 }, regular: { gx: 196, gy: 156 }, roomy: { gx: 240, gy: 178 } }[density || 'regular'];
    const LEAF_GAP = P.gx, LEVEL_GAP = P.gy, PADX = 34, PADY = 80;
    let leafCursor = 0, maxDepth = 0;
    const pos = {};
    (function assign(node, depth) {
      maxDepth = Math.max(maxDepth, depth);
      if (!node.children || node.children.length === 0) { pos[node.id] = { gx: leafCursor++, depth }; return pos[node.id].gx; }
      const xs = node.children.map((c) => assign(c, depth + 1));
      pos[node.id] = { gx: (Math.min(...xs) + Math.max(...xs)) / 2, depth };
      return pos[node.id].gx;
    })(root, 0);
    const nodes = [], edges = [];
    (function collect(node) {
      const p = pos[node.id];
      const px = PADX + p.gx * LEAF_GAP, py = PADY + p.depth * LEVEL_GAP;
      nodes.push({ node, px, py });
      for (const c of node.children || []) {
        const cp = pos[c.id];
        edges.push({ x1: px, y1: py + 18, x2: PADX + cp.gx * LEAF_GAP, y2: PADY + cp.depth * LEVEL_GAP - 4, parentId: node.id, childId: c.id });
        collect(c);
      }
    })(root);
    return { nodes, edges, width: PADX * 2 + Math.max(1, leafCursor) * LEAF_GAP, height: PADY * 2 + (maxDepth + 1) * LEVEL_GAP + 64 };
  }

  function leafToken(word) {
    const tm = word.match(/^t_?(\d+)$/i);
    if (tm) return { trace: tm[1] };
    if (/^\d+$/.test(word)) return { index: word };
    return { word };
  }

  /* ---- build a COMPOSE `set` from the author spec ---- */
  function buildSet(spec) {
    const lexicon = [];
    if (Array.isArray(spec.lexicon)) {
      for (const e of spec.lexicon) lexicon.push({ words: e.words || String(e.word || '').split(',').map((s) => s.trim()).filter(Boolean), denotation: e.denotation || e.den || '' });
    } else {
      for (const key in (spec.lexicon || {})) lexicon.push({ words: key.split(',').map((s) => s.trim()).filter(Boolean), denotation: spec.lexicon[key] });
    }
    // domain: default individual variables + auto-type single-letter individual constants
    const constants = Object.assign({}, spec.constants);
    const variables = Object.assign({ e: 'x y z u v w' }, spec.variables);
    const eConsts = [];
    for (const entry of lexicon) {
      const d = String(entry.denotation || '').trim();
      if (/^[a-z]$/.test(d)) eConsts.push(d);
    }
    if (eConsts.length) constants.e = ((constants.e ? constants.e + ' ' : '') + eConsts.join(' '));

    const r = spec.rules || {};
    const obj = {
      compose: 1,
      title: spec.sentence || 'composition',
      domain: { constants, variables, multiLetterNames: true },
      lexicon,
      rules: { composition: {
        functionApplication: r.fa !== false,
        predicateModification: r.pm !== false,
        nonBranchingNodes: r.nn !== false,
        predicateAbstraction: !!r.pa,
      } },
      exercises: [{ items: [{ tree: spec.tree, sentence: spec.sentence || '' }] }],
    };
    return F.parseFile(JSON.stringify(obj));
  }

  function notationHTML(ast) { return '<span class="lx">' + LC.toHTML(ast) + '</span>'; }
  function typeHTML(type) { return LC.typeToHTML(type); }

  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  /* ---- main render ---- */
  function create(spec) {
    const root = el('div', 'compose-root');
    if (spec.theme) root.setAttribute('data-theme', spec.theme);

    let set, tree, solution;
    try {
      set = buildSet(spec);
      tree = F.parseTree(String(spec.tree || '').trim());
      solution = F.solveTree(tree, set);
    } catch (e) {
      root.appendChild(el('div', 'compose-error', 'COMPOSE could not build this composition:\n' + (e.message || e)));
      return root;
    }

    const mode = spec.mode || 'interactive';
    const showTypes = spec.showTypes !== false;
    const revealLeaves = spec.revealLeaves !== false; // leaves' denotations visible from the start
    const density = spec.density || 'regular';
    const scale = spec.scale || 1;

    const layout = layoutTree(tree, density);
    const nodeById = {};
    layout.nodes.forEach((n) => { nodeById[n.node.id] = n; });

    // revealed-state set
    const revealed = new Set();
    const isLeaf = (node) => !node.children || node.children.length === 0;
    // post-order (children before parents) for stepping
    const order = [];
    (function post(node) { (node.children || []).forEach(post); order.push(node); })(tree);
    const internalOrder = order.filter((n) => !isLeaf(n) && solution[n.id]);

    if (mode === 'static') { order.forEach((n) => revealed.add(n.id)); }
    else { order.forEach((n) => { if (isLeaf(n) && revealLeaves) revealed.add(n.id); }); }

    // ---- header ----
    const head = el('div', 'compose-head');
    const hl = el('div', 'compose-head-l');
    if (spec.eyebrow) hl.appendChild(el('div', 'compose-eyebrow', spec.eyebrow));
    if (spec.sentence) hl.appendChild(el('div', 'compose-sentence', '“' + spec.sentence + '”'));
    if (spec.caption) hl.appendChild(el('div', 'compose-caption', spec.caption));
    head.appendChild(hl);

    let stepBtn, allBtn, resetBtn;
    if (mode !== 'static' && internalOrder.length) {
      const ctrl = el('div', 'compose-controls');
      stepBtn = el('button', 'compose-btn primary', 'Step ▸');
      allBtn = el('button', 'compose-btn', 'Reveal all');
      resetBtn = el('button', 'compose-btn', 'Reset');
      ctrl.append(stepBtn, allBtn, resetBtn);
      head.appendChild(ctrl);
    }
    if (spec.sentence || spec.caption || spec.eyebrow || stepBtn) root.appendChild(head);

    // ---- canvas ----
    const zoom = el('div');
    zoom.style.width = (layout.width * scale) + 'px';
    zoom.style.height = (layout.height * scale) + 'px';
    const wrap = el('div', 'tree-wrap');
    wrap.style.width = layout.width + 'px';
    wrap.style.height = layout.height + 'px';
    wrap.style.transform = 'scale(' + scale + ')';
    zoom.appendChild(wrap);

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'tree-svg');
    svg.setAttribute('width', layout.width);
    svg.setAttribute('height', layout.height);
    layout.edges.forEach((e) => {
      const ln = document.createElementNS(svgNS, 'line');
      ln.setAttribute('x1', e.x1); ln.setAttribute('y1', e.y1);
      ln.setAttribute('x2', e.x2); ln.setAttribute('y2', e.y2);
      svg.appendChild(ln);
    });
    wrap.appendChild(svg);

    // children-resolved test → which internal nodes are available to reveal next
    function childrenRevealed(node) { return (node.children || []).every((c) => revealed.has(c.id) || (isLeaf(c) && revealLeaves)); }
    function isAvailable(node) { return mode !== 'static' && !isLeaf(node) && !revealed.has(node.id) && solution[node.id] && childrenRevealed(node); }

    function rebuild() {
      // remove existing node divs (keep svg)
      [...wrap.querySelectorAll('.tree-node')].forEach((n) => n.remove());
      layout.nodes.forEach(({ node, px, py }) => {
        const tok = leafToken(node.word || '');
        if (tok.index) return; // bare index node (PA) — no box
        const leaf = isLeaf(node);
        const m = solution[node.id];
        const shown = revealed.has(node.id) || (leaf && revealLeaves);
        const avail = isAvailable(node);

        const tn = el('div', 'tree-node');
        tn.style.left = px + 'px';
        tn.style.top = py + 'px';
        if (!leaf && !avail && !shown) tn.classList.add('node-locked');

        const cls = ['node-box'];
        if (leaf) cls.push('node-leaf'); else cls.push('selectable');
        if (avail) cls.push('available');
        if (m && !leaf && shown) cls.push('done');
        const box = el('div', cls.join(' '));

        if (m && !leaf && shown && m.rule && m.rule !== 'lex' && m.rule !== 'trace') {
          box.appendChild(el('span', 'node-rule-tag', m.rule));
        }
        if (leaf) {
          if (tok.trace) box.appendChild(el('span', 'node-word', '<i>t</i><sub>' + tok.trace + '</sub>'));
          else box.appendChild(el('span', 'node-word', notationHTML(LC.parse(LC.asciiToUnicode(node.word)))));
        } else {
          box.appendChild(el('span', 'node-label', node.label || '•'));
        }

        // click to reveal (interactive)
        if (avail) {
          box.onclick = () => { revealUpTo(node); };
        }
        tn.appendChild(box);

        // meaning + type
        if (m && shown) {
          tn.appendChild(el('span', 'node-meaning', notationHTML(m.term)));
          if (showTypes) tn.appendChild(el('span', 'node-type-badge', typeHTML(m.type)));
        } else if (!leaf && !shown) {
          tn.appendChild(el('span', 'node-meaning pending', avail ? 'ready — click' : 'awaiting children'));
        }
        wrap.appendChild(tn);
      });
    }

    function revealUpTo(node) {
      // reveal this node (its children must already be revealed)
      revealed.add(node.id);
      rebuild();
    }
    function stepOnce() {
      const next = internalOrder.find((n) => !revealed.has(n.id) && childrenRevealed(n));
      if (next) revealed.add(next.id);
      rebuild();
    }
    function revealAll() { order.forEach((n) => revealed.add(n.id)); rebuild(); }
    function reset() {
      revealed.clear();
      order.forEach((n) => { if (isLeaf(n) && revealLeaves) revealed.add(n.id); });
      rebuild();
    }

    if (stepBtn) stepBtn.onclick = stepOnce;
    if (allBtn) allBtn.onclick = revealAll;
    if (resetBtn) resetBtn.onclick = reset;

    rebuild();
    root.appendChild(zoom);

    // expose a tiny control API on the element (for deck keyboard hooks etc.)
    root._compose = { step: stepOnce, revealAll, reset, rebuild };
    return root;
  }

  function render(target, spec) {
    const host = typeof target === 'string' ? document.querySelector(target) : target;
    if (!host) { console.error('COMPOSE.render: target not found', target); return null; }
    const node = create(spec);
    host.appendChild(node);
    return node;
  }

  return { create, render, _layoutTree: layoutTree };
})();
