/* ============================================================================
   COMPOSE engine — extracted verbatim from the COMPOSE app
   (Coppock & Champollion fragment; Lambda Calculator lineage).
   Two framework-agnostic modules attached to window:
     • window.LC       — λ-calculus: parse, β-reduce, types, HTML pretty-print
     • window.LCFormat — file/tree parser, type inference, FA/PM/NN/PA solver
   Do not edit — this is the authoritative engine the kit renders on top of.
   ============================================================================ */

/* ===== window.LC ========================================================== */
/* ===========================================================================
   COMPOSE — semantic engine
   Parser, capture-avoiding substitution, beta-reduction, alpha-equivalence,
   light type inference, and pretty-printers (unicode + journal-style HTML).
   Framework-agnostic; attached to window.LC.
   AST nodes:
     {t:'sym',  name}                      identifier (var / const / predicate)
     {t:'lam',  v, body}                    lambda abstraction
     {t:'app',  fn, arg}                    application
     {t:'not',  e}                          negation
     {t:'bin',  op, l, r}   op: ∧ ∨ → ↔ =   binary connective / comparison
     {t:'quant',q, v, body} q: ∀ ∃ ι        quantifier / iota
   ========================================================================= */
(function () {
  'use strict';

  // ---- constructors -------------------------------------------------------
  const Sym  = (name) => ({ t: 'sym', name });
  const Lam  = (v, body) => ({ t: 'lam', v, body });
  const App  = (fn, arg) => ({ t: 'app', fn, arg });
  const Not  = (e) => ({ t: 'not', e });
  const Bin  = (op, l, r) => ({ t: 'bin', op, l, r });
  const Quant = (q, v, body) => ({ t: 'quant', q, v, body });

  // ---- tokenizer ----------------------------------------------------------
  // Operates on UNICODE input (callers convert ASCII shortcuts first).
  const BINDERS = { 'λ': 'lam', '∀': '∀', '∃': '∃', 'ι': 'ι' };
  function tokenize(src) {
    const toks = [];
    let i = 0;
    // Binder letters in the Lambda-Calculator ASCII convention:
    //   L = λ, A = ∀, E = ∃, I = ι.  A binder is one of these uppercase
    //   letters immediately followed by a (single-letter) bound variable.
    const BINDER_ASCII = { L: 'λ', A: '∀', E: '∃', I: 'ι' };
    const readVar = () => {                 // single letter + digits/primes
      let j = i + 1;
      while (j < src.length && /[0-9_'’]/.test(src[j])) j++;
      const v = src.slice(i, j); i = j; return v;
    };
    while (i < src.length) {
      const c = src[i];
      if (/\s/.test(c)) { i++; continue; }
      if (c === '-' && src[i + 1] === '>') { toks.push({ k: 'op', v: '→' }); i += 2; continue; }
      if (c === '<' && src[i + 1] === '-' && src[i + 2] === '>') { toks.push({ k: 'op', v: '↔' }); i += 3; continue; }
      // temporal-logic comparison operators (Chapter 12): precedence < / >, inclusion ⊆
      if (c === '<') { toks.push({ k: 'op', v: '<' }); i++; continue; }
      if (c === '>') { toks.push({ k: 'op', v: '>' }); i++; continue; }
      if (c === '⊆' || c === '⊑') { toks.push({ k: 'op', v: '⊆' }); i++; continue; }
      // mereology operators (Chapter 10): parthood ≤ (e×e→t), sum ⊕ (e×e→e)
      if (c === '≤') { toks.push({ k: 'op', v: '≤' }); i++; continue; }
      if (c === '⊕') { toks.push({ k: 'op', v: '⊕' }); i++; continue; }
      // plural star operator (Chapter 10): ∗P (⟨e,t⟩→⟨e,t⟩) — unary prefix
      if (c === '∗' || c === '*') { toks.push({ k: 'star' }); i++; continue; }
      if ('λ∀∃ι'.includes(c)) {             // unicode binder + following var
        const map = { 'λ': 'λ', '∀': '∀', '∃': '∃', 'ι': 'ι' };
        toks.push({ k: 'binder', v: map[c] }); i++;
        while (i < src.length && /\s/.test(src[i])) i++;
        if (i < src.length && /[A-Za-z]/.test(src[i])) toks.push({ k: 'var', v: readVar() });
        continue;
      }
      if ('∧∨→↔='.includes(c)) { toks.push({ k: 'op', v: c }); i++; continue; }
      if (c === '&') { toks.push({ k: 'op', v: '∧' }); i++; continue; }
      if (c === '≠') { toks.push({ k: 'op', v: '≠' }); i++; continue; }
      if (c === '¬' || c === '~') { toks.push({ k: 'neg' }); i++; continue; }
      if (c === '(') { toks.push({ k: '(' }); i++; continue; }
      if (c === ')') { toks.push({ k: ')' }); i++; continue; }
      if (c === '[') { toks.push({ k: '[' }); i++; continue; }
      if (c === ']') { toks.push({ k: ']' }); i++; continue; }
      if (c === ',') { toks.push({ k: ',' }); i++; continue; }
      if (c === '.') { toks.push({ k: '.' }); i++; continue; }
      if (/[A-Za-z]/.test(c)) {
        // ASCII binder (L/A/E/I) — only when followed by a SINGLE-letter variable.
        // "Agent", "Every", "Legolas" stay as identifiers; "LxLe" = two binders.
        // Rule: treat as binder when the char after the variable is NOT a letter,
        // OR is itself a binder letter (so chained LxLe, AxEy, etc. work).
        if (BINDER_ASCII[c] && i + 1 < src.length && /[A-Za-z]/.test(src[i + 1])) {
          let jb = i + 2;
          while (jb < src.length && /[0-9_'']/.test(src[jb])) jb++;
          const nb = src[jb] || '';
          if (!/[A-Za-z]/.test(nb) || BINDER_ASCII[nb]) {
            toks.push({ k: 'binder', v: BINDER_ASCII[c] }); i++;
            toks.push({ k: 'var', v: readVar() });
            continue;
          }
        }
        // identifier: maximal run of letters/digits/prime/hyphen/underscore
        let j = i + 1;
        while (j < src.length && /[A-Za-z0-9_''-]/.test(src[j])) j++;
        toks.push({ k: 'id', v: src.slice(i, j) });
        i = j; continue;
      }
      throw new ParseError('Unexpected character “' + c + '”');
    }
    return toks;
  }

  function ParseError(msg) { this.message = msg; this.name = 'ParseError'; }
  ParseError.prototype = Object.create(Error.prototype);

  // ---- parser (recursive descent) ----------------------------------------
  // precedence (low→high): ↔ , → , ∨ , ∧ , (= ≠ < > ⊆) , ¬ , application , atom
  function parse(src) {
    const toks = tokenize(src);
    let p = 0;
    const peek = () => toks[p];
    const next = () => toks[p++];
    const expect = (k) => { if (!peek() || peek().k !== k) throw new ParseError('Expected ' + k); return next(); };

    function parseExpr() { return parseIff(); }
    function parseIff() {
      let l = parseImp();
      while (peek() && peek().k === 'op' && peek().v === '↔') { next(); l = Bin('↔', l, parseImp()); }
      return l;
    }
    function parseImp() {
      let l = parseOr();
      if (peek() && peek().k === 'op' && peek().v === '→') { next(); return Bin('→', l, parseImp()); }
      return l;
    }
    function parseOr() {
      let l = parseAnd();
      while (peek() && ((peek().k === 'op' && peek().v === '∨') || (peek().k === 'id' && peek().v === 'V'))) {
        next(); l = Bin('∨', l, parseAnd());
      }
      return l;
    }
    function parseAnd() {
      let l = parseCmp();
      while (peek() && peek().k === 'op' && peek().v === '∧') { next(); l = Bin('∧', l, parseCmp()); }
      return l;
    }
    function parseCmp() {
      let l = parseOplus();
      if (peek() && peek().k === 'op' && (peek().v === '=' || peek().v === '≠' || peek().v === '<' || peek().v === '>' || peek().v === '⊆' || peek().v === '≤')) {
        const op = next().v; return Bin(op, l, parseOplus());
      }
      return l;
    }
    // ⊕ (mereological sum, Ch.10) — left-associative so f⊕s⊕n works
    function parseOplus() {
      let l = parseNeg();
      while (peek() && peek().k === 'op' && peek().v === '⊕') {
        next(); l = Bin('⊕', l, parseNeg());
      }
      return l;
    }
    function parseNeg() {
      if (peek() && peek().k === 'neg') { next(); return Not(parseNeg()); }
      return parseApp();
    }
    function parseApp() {
      let head = parseAtom();
      // trailing applications: f(a)(b), [..](a)
      while (peek() && peek().k === '(') {
        next();
        const args = [parseExpr()];
        while (peek() && peek().k === ',') { next(); args.push(parseExpr()); }
        expect(')');
        for (const a of args) head = App(head, a);
      }
      return head;
    }
    function parseBinderChain() {
      const b = next(); // binder token
      if (!peek() || peek().k !== 'var') throw new ParseError('Expected variable after binder');
      const v = next().v;
      // chain another binder, or read body
      let body;
      if (peek() && peek().k === 'binder') body = parseBinderChain();
      else if (b.v !== 'λ' && peek() && peek().k === '[') {
        // Scope-delimiting bracket: ∀x[φ], ∃y[φ], ιz[φ] — the quantifier's scope
        // is exactly the bracketed expression (standard textbook notation), so a
        // following operator (∧, →, …) attaches OUTSIDE the quantifier.
        body = parseAtom();
      }
      else { if (peek() && peek().k === '.') next(); body = parseExpr(); }
      if (b.v === 'λ') return Lam(v, body);
      return Quant(b.v, v, body);
    }
    function parseAtom() {
      const t = peek();
      if (!t) throw new ParseError('Unexpected end of expression');
      if (t.k === 'binder') return parseBinderChain();
      if (t.k === 'neg') return parseNeg();
      // ∗P — consume star then grab the next atom; parseApp then applies (x) correctly
      if (t.k === 'star') { next(); return { t: 'star', e: parseAtom() }; }
      if (t.k === '(') { next(); const e = parseExpr(); expect(')'); return e; }
      if (t.k === '[') { next(); const e = parseExpr(); expect(']'); return e; }
      if (t.k === 'id') { next(); return Sym(t.v); }
      throw new ParseError('Unexpected token');
    }

    const e = parseExpr();
    if (p < toks.length) throw new ParseError('Unexpected trailing input');
    return e;
  }

  // ---- free variables & substitution -------------------------------------
  function freeVars(e, acc = new Set(), bound = new Set()) {
    switch (e.t) {
      case 'sym': if (!bound.has(e.name)) acc.add(e.name); break;
      case 'lam': { const b2 = new Set(bound); b2.add(e.v); freeVars(e.body, acc, b2); break; }
      case 'quant': { const b2 = new Set(bound); b2.add(e.v); freeVars(e.body, acc, b2); break; }
      case 'app': freeVars(e.fn, acc, bound); freeVars(e.arg, acc, bound); break;
      case 'not': freeVars(e.e, acc, bound); break;
      case 'star': freeVars(e.e, acc, bound); break;
      case 'bin': freeVars(e.l, acc, bound); freeVars(e.r, acc, bound); break;
    }
    return acc;
  }

  let _fresh = 0;
  // preferred alternates when a name collides: x→y→z→u→v→w, then subscripts
  const VAR_ALTERNATES = { x: ['y','z','u','v','w'], y: ['z','u','v','w'], z: ['u','v','w'], e: ['d','s'], P: ['Q','R'], Q: ['R','S'] };
  function freshName(base, avoid) {
    let n = base.replace(/[0-9']+$/, '');
    if (!avoid.has(n)) return n;
    // try harmless single-letter alternates first (y, z, … before x1)
    const alts = VAR_ALTERNATES[n] || [];
    for (const a of alts) if (!avoid.has(a)) return a;
    // fall back to numeric subscripts
    let cand = n, k = 0;
    while (avoid.has(cand)) { k++; cand = n + k; }
    return cand;
  }

  // substitute value for free occurrences of varName in e (capture-avoiding)
  function subst(e, varName, value) {
    switch (e.t) {
      case 'sym': return e.name === varName ? value : e;
      case 'app': return App(subst(e.fn, varName, value), subst(e.arg, varName, value));
      case 'not': return Not(subst(e.e, varName, value));
      case 'star': return { t: 'star', e: subst(e.e, varName, value) };
      case 'bin': return Bin(e.op, subst(e.l, varName, value), subst(e.r, varName, value));
      case 'lam':
      case 'quant': {
        if (e.v === varName) return e; // shadowed
        const fvVal = freeVars(value);
        let v = e.v, body = e.body;
        if (fvVal.has(v)) { // would capture → rename
          const avoid = new Set([...fvVal, ...freeVars(body), varName]);
          const nv = freshName(v, avoid);
          body = subst(body, v, Sym(nv));
          v = nv;
        }
        const nb = subst(body, varName, value);
        return e.t === 'lam' ? Lam(v, nb) : Quant(e.q, v, nb);
      }
    }
    return e;
  }

  // ---- beta reduction -----------------------------------------------------
  function findRedex(e) { // leftmost-outermost; returns path or null
    if (e.t === 'app' && e.fn.t === 'lam') return [];
    const recurse = (child, key) => { const r = findRedex(child); return r ? [key, ...r] : null; };
    switch (e.t) {
      case 'app': return recurse(e.fn, 'fn') || recurse(e.arg, 'arg');
      case 'lam': return recurse(e.body, 'body');
      case 'quant': return recurse(e.body, 'body');
      case 'not': return recurse(e.e, 'e');
      case 'star': return recurse(e.e, 'e');
      case 'bin': return recurse(e.l, 'l') || recurse(e.r, 'r');
    }
    return null;
  }
  function reduceAt(e, path) {
    if (path.length === 0) {
      // e is App(Lam(v,body), arg)
      return subst(e.fn.body, e.fn.v, e.arg);
    }
    const [k, ...rest] = path;
    const clone = Object.assign({}, e);
    clone[k] = reduceAt(e[k], rest);
    return clone;
  }
  function betaStep(e) { const p = findRedex(e); return p ? reduceAt(e, p) : null; }
  function normalize(e, max = 1000) {
    let cur = e, n = 0;
    while (n++ < max) { const s = betaStep(cur); if (!s) break; cur = s; }
    return cur;
  }
  function isNormal(e) { return findRedex(e) === null; }

  // ---- eta reduction: λx.(f x) → f  when x ∉ FV(f) -----------------------
  function etaReduce(e) {
    switch (e.t) {
      case 'lam': {
        const body = etaReduce(e.body);
        if (body.t === 'app' && body.arg.t === 'sym' && body.arg.name === e.v) {
          const fv = freeVars(body.fn);
          const xFree = fv.has ? fv.has(e.v) : fv.includes(e.v);
          if (!xFree) return etaReduce(body.fn);
        }
        return { t: 'lam', v: e.v, body };
      }
      case 'app': return { t: 'app', fn: etaReduce(e.fn), arg: etaReduce(e.arg) };
      case 'not': return { t: 'not', e: etaReduce(e.e) };
      case 'star': return { t: 'star', e: etaReduce(e.e) };
      case 'bin': return { t: 'bin', op: e.op, l: etaReduce(e.l), r: etaReduce(e.r) };
      case 'quant': return { t: 'quant', q: e.q, v: e.v, body: etaReduce(e.body) };
      default: return e;
    }
  }
  // Compare two terms up to αβη + AC (used for lenient answer checking)
  function equivACη(a, b) {
    try { return alphaEqualAC(etaReduce(normalize(a)), etaReduce(normalize(b))); }
    catch { return false; }
  }

  // all single-step reductions (any redex) — for lenient step checking
  function allSteps(e) {
    const out = [];
    function walk(node, rebuild) {
      if (node.t === 'app' && node.fn.t === 'lam') {
        out.push(rebuild(subst(node.fn.body, node.fn.v, node.arg)));
      }
      const kids = childKeys(node);
      for (const k of kids) {
        walk(node[k], (nv) => rebuild(setChild(node, k, nv)));
      }
    }
    walk(e, (x) => x);
    return out;
  }
  function childKeys(e) {
    switch (e.t) {
      case 'app': return ['fn', 'arg'];
      case 'lam': case 'quant': return ['body'];
      case 'not': return ['e'];
      case 'bin': return ['l', 'r'];
      default: return [];
    }
  }
  function setChild(e, k, v) { const c = Object.assign({}, e); c[k] = v; return c; }

  // ---- alpha equivalence --------------------------------------------------
  function alphaEqual(a, b, env = new Map()) {
    if (a.t !== b.t) return false;
    switch (a.t) {
      case 'sym': {
        const m = env.get(a.name);
        if (m !== undefined) return m === b.name;     // both bound: must map
        return a.name === b.name && !revHas(env, b.name); // both free same name
      }
      case 'app': return alphaEqual(a.fn, b.fn, env) && alphaEqual(a.arg, b.arg, env);
      case 'not': return alphaEqual(a.e, b.e, env);
      case 'bin': return a.op === b.op && alphaEqual(a.l, b.l, env) && alphaEqual(a.r, b.r, env);
      case 'lam': {
        const e2 = new Map(env); e2.set(a.v, b.v); return alphaEqual(a.body, b.body, e2);
      }
      case 'quant': {
        if (a.q !== b.q) return false;
        const e2 = new Map(env); e2.set(a.v, b.v); return alphaEqual(a.body, b.body, e2);
      }
    }
    return false;
  }
  function revHas(env, name) { for (const v of env.values()) if (v === name) return true; return false; }

  // like alphaEqual, but ∧ and ∨ are treated as commutative at every depth
  // (so a student's Predicate Modification answer is accepted in either order)
  function alphaEqualAC(a, b, env = new Map()) {
    if (a.t !== b.t) return false;
    switch (a.t) {
      case 'sym': {
        const m = env.get(a.name);
        if (m !== undefined) return m === b.name;
        return a.name === b.name && !revHas(env, b.name);
      }
      case 'app': return alphaEqualAC(a.fn, b.fn, env) && alphaEqualAC(a.arg, b.arg, env);
      case 'not': return alphaEqualAC(a.e, b.e, env);
      case 'star': return alphaEqualAC(a.e, b.e, env);
      case 'bin': {
        if (a.op !== b.op) return false;
        // For AC operators, flatten into multisets and compare
        if (a.op === '∧' || a.op === '∨') {
          function flatBin(node, op) {
            if (node.t === 'bin' && node.op === op) return [...flatBin(node.l, op), ...flatBin(node.r, op)];
            return [node];
          }
          const la = flatBin(a, a.op), lb = flatBin(b, b.op);
          if (la.length !== lb.length) return false;
          const used = new Array(lb.length).fill(false);
          for (const ea of la) {
            let found = false;
            for (let i = 0; i < lb.length; i++) {
              if (!used[i] && alphaEqualAC(ea, lb[i], env)) { used[i] = true; found = true; break; }
            }
            if (!found) return false;
          }
          return true;
        }
        return alphaEqualAC(a.l, b.l, env) && alphaEqualAC(a.r, b.r, env);
      }
      case 'lam': { const e2 = new Map(env); e2.set(a.v, b.v); return alphaEqualAC(a.body, b.body, e2); }
      case 'quant': { if (a.q !== b.q) return false; const e2 = new Map(env); e2.set(a.v, b.v); return alphaEqualAC(a.body, b.body, e2); }
    }
    return false;
  }

  // compare two source strings for meaning-equality (parse + normalize + alpha)
  function equiv(srcA, srcB) {
    try {
      const a = normalize(parse(srcA));
      const b = normalize(parse(srcB));
      // also allow commutativity of ∧ ∨ at top level for friendliness
      return alphaEqual(a, b) || alphaEqualMod(a, b);
    } catch (e) { return false; }
  }
  // allow commutativity of ∧/∨ (one level, recursive)
  function alphaEqualMod(a, b, env = new Map()) {
    if (a.t === 'bin' && b.t === 'bin' && a.op === b.op && (a.op === '∧' || a.op === '∨')) {
      if (alphaEqual(a.l, b.l, new Map(env)) && alphaEqual(a.r, b.r, new Map(env))) return true;
      if (alphaEqual(a.l, b.r, new Map(env)) && alphaEqual(a.r, b.l, new Map(env))) return true;
    }
    return false;
  }

  // ---- types --------------------------------------------------------------
  // Type repr: string atom ('e','t',...) | {from,to} | {prod:[t1,t2]} | {var:'a'}
  function parseType(src) {
    let i = 0;
    function ws() { while (i < src.length && /\s/.test(src[i])) i++; }
    function atom() {
      ws();
      const c = src[i];
      if (c === '<' || c === '⟨') {
        i++; const left = type(); ws();
        if (src[i] === '>' || src[i] === '⟩') { i++; return left; } // ⟨et⟩ shorthand = grouping
        if (src[i] === ',') i++;
        const right = type(); ws();
        if (src[i] === '>' || src[i] === '⟩') i++;
        return { from: left, to: right };
      }
      if (c === "'" ) { i++; let j = i; while (j < src.length && /[A-Za-z]/.test(src[j])) j++; const n = src.slice(i, j); i = j; return { var: n }; }
      // sequence of single-letter atoms like "et" → <e,t>
      let j = i; while (j < src.length && /[a-zA-Z]/.test(src[j])) j++;
      const run = src.slice(i, j); i = j;
      if (run.length === 1) return run;
      // expand run "et" → <e,t> right-assoc
      let t = run[run.length - 1];
      for (let k = run.length - 2; k >= 0; k--) t = { from: run[k], to: t };
      return t;
    }
    function type() {
      ws();
      let left = atom();
      ws();
      if (src[i] === '*') { i++; const right = atom(); return { prod: [left, right] }; }
      return left;
    }
    const r = type(); return r;
  }
  function typeToHTML(t) {
    if (typeof t === 'string') return '<span class="ty-atom">' + t + '</span>';
    if (t.var) return '<span class="ty-var">' + greekType(t.var) + '</span>';
    if (t.prod) return typeToHTML(t.prod[0]) + '<span class="ty-prod">×</span>' + typeToHTML(t.prod[1]);
    return '<span class="ty-ang">⟨</span>' + typeToHTML(t.from) + '<span class="ty-comma">,</span>' + typeToHTML(t.to) + '<span class="ty-ang">⟩</span>';
  }
  function typeToStr(t) {
    if (typeof t === 'string') return t;
    if (t.var) return greekType(t.var);
    if (t.prod) return typeToStr(t.prod[0]) + '×' + typeToStr(t.prod[1]);
    return '⟨' + typeToStr(t.from) + ',' + typeToStr(t.to) + '⟩';
  }
  const GREEK = { a: 'α', b: 'β', c: 'γ', d: 'δ', e: 'ε', f: 'ζ', A: 'α', B: 'β', C: 'γ' };
  function greekType(n) { return GREEK[n] || n; }

  function typeEqual(a, b, sub = {}) {
    if (typeof a === 'object' && a.var) { if (sub[a.var]) return typeEqual(sub[a.var], b, sub); sub[a.var] = b; return true; }
    if (typeof b === 'object' && b.var) { if (sub[b.var]) return typeEqual(a, sub[b.var], sub); sub[b.var] = a; return true; }
    if (typeof a === 'string' || typeof b === 'string') return a === b;
    if (a.prod && b.prod) return typeEqual(a.prod[0], b.prod[0], sub) && typeEqual(a.prod[1], b.prod[1], sub);
    if (a.from && b.from) return typeEqual(a.from, b.from, sub) && typeEqual(a.to, b.to, sub);
    return false;
  }
  const isFun = (t) => t && typeof t === 'object' && t.from !== undefined;

  // ---- pretty printer (HTML, journal style) -------------------------------
  // Precedence for bracketing: atom/app 5, ¬ 4, cmp 3, ∧ 2, ∨ 2, → 1, ↔ 0
  function prec(e) {
    switch (e.t) {
      case 'sym': case 'app': return 5;
      case 'not': return 4;
      case 'bin':
        if (e.op === '=' || e.op === '≠' || e.op === '<' || e.op === '>' || e.op === '⊆' || e.op === '≤') return 3;
        if (e.op === '⊕') return 4; // ⊕ binds tighter than comparison
        if (e.op === '∧') return 2;
        if (e.op === '∨') return 2;
        if (e.op === '→') return 1;
        return 0;
      case 'star': return 5;
      case 'lam': case 'quant': return 0;
    }
    return 5;
  }
  function symHTML(name) {
    // xN → x<sub>N</sub> for trace-index vars like x1, x2
    const nm = name.match(/^([A-Za-z]+)(\d+)$/);
    if (nm) {
      const base = nm[1], sub = nm[2];
      const bt = base.length === 1 ? '<i class="lx-var">' + esc(base) + '</i>' : '<span class="lx-const">' + esc(base) + '</span>';
      return bt + '<sub class="lx-sub">' + sub + '</sub>';
    }
    const isVar = name.length <= 2 && /^[A-Za-z]['‘]?$/.test(name);
    if (isVar) return '<i class="lx-var">' + esc(name) + '</i>';
    return '<span class="lx-const">' + esc(name) + '</span>';
  }
  function esc(s) { return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }

  // collect application spine: returns {head, args}
  function spine(e) { const args = []; let h = e; while (h.t === 'app') { args.unshift(h.arg); h = h.fn; } return { head: h, args }; }

  function toHTML(e, parentPrec = -1) {
    let s = render(e);
    if (prec(e) < parentPrec) s = '<span class="lx-paren">(</span>' + s + '<span class="lx-paren">)</span>';
    return s;
  }
  function render(e) {
    switch (e.t) {
      case 'sym': return symHTML(e.name);
      case 'app': {
        const { head, args } = spine(e);
        if (head.t === 'sym') {
          // predicate / function application: name(arg, arg)
          return symHTML(head.name) + '<span class="lx-paren">(</span>' +
            args.map((a) => toHTML(a, -1)).join('<span class="lx-comma">, </span>') +
            '<span class="lx-paren">)</span>';
        }
        // (complex)(arg)(arg)
        return toHTML(head, 5) + args.map((a) => '<span class="lx-paren">(</span>' + toHTML(a, -1) + '<span class="lx-paren">)</span>').join('');
      }
      case 'not': return '<span class="lx-op lx-neg">¬</span>' + toHTML(e.e, 4);
      case 'bin': {
        const op = e.op;
        return toHTML(e.l, prec(e) + (op === '→' ? 1 : 0)) +
          '<span class="lx-op lx-' + opClass(op) + '">' + opGlyph(op) + '</span>' +
          toHTML(e.r, prec(e));
      }
      case 'lam': {
        // gather lambda chain
        let chain = [], cur = e;
        while (cur.t === 'lam') { chain.push(cur.v); cur = cur.body; }
        return '<span class="lx-binder">' + chain.map((v) => 'λ' + varNoItalic(v)).join('') + '</span>' +
          '<span class="lx-dot">.</span>' + toHTML(cur, 0);
      }
      case 'quant': {
        const g = { '∀': '∀', '∃': '∃', 'ι': 'ι' }[e.q];
        return '<span class="lx-binder">' + g + varNoItalic(e.v) + '</span><span class="lx-dot">.</span>' + toHTML(e.body, 0);
      }
    }
    return '';
  }
  function varNoItalic(v) { return '<i class="lx-bv">' + esc(v) + '</i>'; }
  function opGlyph(op) { return { '∧': '∧', '∨': '∨', '→': '→', '↔': '↔', '=': '=', '≠': '≠', '<': '<', '>': '>', '⊆': '⊆', '≤': '≤', '⊕': '⊕' }[op] || op; }
  function opClass(op) { return { '∧': 'and', '∨': 'or', '→': 'imp', '↔': 'iff', '=': 'eq', '≠': 'neq', '<': 'lt', '>': 'gt', '⊆': 'sub', '≤': 'leq', '⊕': 'oplus' }[op] || 'op'; }

  // plain unicode string (for inputs / comparison display)
  function toStr(e, parentPrec = -1) {
    let s;
    switch (e.t) {
      case 'sym': s = e.name; break;
      case 'app': {
        const { head, args } = spine(e);
        if (head.t === 'sym') s = head.name + '(' + args.map((a) => toStr(a, -1)).join(', ') + ')';
        else s = toStr(head, 5) + args.map((a) => '(' + toStr(a, -1) + ')').join('');
        break;
      }
      case 'not': s = '¬' + toStr(e.e, 4); break;
      case 'star': s = '∗' + toStr(e.e, 5); break;
      case 'bin': s = toStr(e.l, prec(e) + (e.op === '→' ? 1 : 0)) + ' ' + opGlyph(e.op) + ' ' + toStr(e.r, prec(e)); break;
      case 'lam': { let chain = [], cur = e; while (cur.t === 'lam') { chain.push(cur.v); cur = cur.body; } s = chain.map((v) => 'λ' + v).join('') + '.' + toStr(cur, 0); break; }
      case 'quant': s = e.q + e.v + '.' + toStr(e.body, 0); break;
    }
    if (prec(e) < parentPrec) s = '(' + s + ')';
    return s;
  }

  // ---- ASCII shortcuts → unicode (for student input) ----------------------
  function asciiToUnicode(str) {
    let s = str;
    // backslash codes
    const codes = [
      [/\\lambda|\\l\b/g, 'λ'], [/\\forall|\\all|\\A\b/g, '∀'], [/\\exists|\\E\b/g, '∃'],
      [/\\iota|\\i\b/g, 'ι'], [/\\and/g, '∧'], [/\\or/g, '∨'], [/\\not|\\neg/g, '¬'],
      [/\\to|\\imp/g, '→'], [/\\iff/g, '↔'], [/\\neq/g, '≠'],
      [/\\subseteq|\\sub\b/g, '⊆'], [/\\prec\b/g, '<'],
      [/\\leq\b/g, '≤'], [/\\oplus\b/g, '⊕'], [/\\star\b/g, '∗'],
    ];
    for (const [re, ch] of codes) s = s.replace(re, ch);
    // direct symbols
    s = s.replace(/->/g, '→').replace(/<->/g, '↔').replace(/&/g, '∧').replace(/~/g, '¬');
    // note: we intentionally do NOT auto-convert bare L/E/A/V to avoid breaking
    // multi-letter identifiers; the palette + backslash codes handle binders.
    return s;
  }

  // safe parse → returns {ok, ast, error}
  function tryParse(src) {
    try { return { ok: true, ast: parse(asciiToUnicode(src)) }; }
    catch (e) { return { ok: false, error: e.message || 'Parse error' }; }
  }

  
  // ---- variable prettification -----------------------------------------------
  // Renames xN-style bound variables (like x1, x2 from QR traces) to simple
  // letters (x, y, z, …) when the term is in normal form and renaming is safe.
  const SIMPLE_VARS = ['x','y','z','u','v','w','p','q','r','s','n','m'];
  // Higher-type variable names (for bound vars used in function position, e.g.
  // a generalized quantifier produced by RaiseS/RaiseO). Matches the textbook
  // convention of capitals for higher types.
  const HIGH_VARS = ['P','Q','R','X','Y','Z','F','G','H','K'];
  // True if bound variable `v` is ever applied as a function head inside `e`
  // (i.e. occurs as v(...)), meaning v is higher-typed and should read as a capital.
  function appliedAsFn(e, v) {
    switch (e.t) {
      case 'app':
        if (e.fn.t === 'sym' && e.fn.name === v) return true;
        return appliedAsFn(e.fn, v) || appliedAsFn(e.arg, v);
      case 'lam':
      case 'quant':
        if (e.v === v) return false;           // shadowed below this binder
        return appliedAsFn(e.body, v);
      case 'not': return appliedAsFn(e.e, v);
      case 'bin': return appliedAsFn(e.l, v) || appliedAsFn(e.r, v);
      default: return false;
    }
  }
  function prettifyVars(term) {
    if (!isNormal(term)) return term;
    // Seed reserved names with ALL variable names in the term (free AND bound),
    // so renaming a binder can never collide with another binder still named with
    // a simple letter (e.g. abstracting x₁ when ∃x already binds x in the body).
    const usedNames = new Set(freeVars(term));
    (function collect(e) {
      if (!e || typeof e !== 'object') return;
      switch (e.t) {
        case 'sym': usedNames.add(e.name); break;
        case 'app': collect(e.fn); collect(e.arg); break;
        case 'not': collect(e.e); break;
        case 'star': collect(e.e); break;
        case 'bin': collect(e.l); collect(e.r); break;
        case 'lam': case 'quant': usedNames.add(e.v); collect(e.body); break;
      }
    })(term);
    function pickSimple(hint) {
      const base = hint[0];           // e.g. 'x' from 'x1'
      if (!usedNames.has(base)) { usedNames.add(base); return base; }
      for (const s of SIMPLE_VARS) if (!usedNames.has(s)) { usedNames.add(s); return s; }
      return hint;                    // fallback: keep as-is
    }
    function pickHigh(hint) {
      for (const s of HIGH_VARS) if (!usedNames.has(s)) { usedNames.add(s); return s; }
      return hint;
    }
    function walk(e, env) {
      switch (e.t) {
        case 'sym': return Sym(env.get(e.name) || e.name);
        case 'app': return App(walk(e.fn, env), walk(e.arg, env));
        case 'not': return Not(walk(e.e, env));
        case 'star': return { t: 'star', e: walk(e.e, env) };
        case 'bin': return Bin(e.op, walk(e.l, env), walk(e.r, env));
        case 'lam':
        case 'quant': {
          const oldV = e.v;
          let newV = env.get(oldV) || oldV;
          // promote a lowercase var that's applied as a function to a capital
          // (higher type — e.g. a raised generalized quantifier)
          const isHigh = /^[a-z]/.test(oldV) && appliedAsFn(e.body, oldV);
          if (isHigh && !env.has(oldV)) newV = pickHigh(oldV);
          // only simplify xN-style vars (single-letter base + digits)
          else if (/^[a-z]\d+$/.test(oldV) && !env.has(oldV)) newV = pickSimple(oldV);
          else usedNames.add(newV); // reserve even non-prettified bound vars so inner binders can't steal the name
          const newEnv = new Map(env); newEnv.set(oldV, newV);
          const newBody = walk(e.body, newEnv);
          return e.t === 'lam' ? Lam(newV, newBody) : Quant(e.q, newV, newBody);
        }
      }
      return e;
    }
    return walk(term, new Map());
  }

window.LC = {
    Sym, Lam, App, Not, Bin, Quant,
    parse, tokenize, tryParse, asciiToUnicode,
    freeVars, subst, betaStep, normalize, isNormal, allSteps, findRedex, reduceAt,
    alphaEqual, alphaEqualAC, equiv, prettifyVars, etaReduce, equivACη,
    parseType, typeToHTML, typeToStr, typeEqual, isFun,
    toHTML, toStr,
  };
})();

/* ===== window.LCFormat ==================================================== */
/* ===========================================================================
   COMPOSE — file-format loader, type inference, derivation solver
   Parses the authentic .lbd/.txt exercise format (declarations, `define`,
   `use rule`, `exercise …`, labeled-bracket trees) into playable problem sets,
   infers types by unification, and computes node meanings for FA / PM / NN /
   Predicate (λ) Abstraction.  Exposed as window.LCFormat.
   ========================================================================= */
(function () {
  'use strict';
  const E = window.LC;

  /* ---- list / range expansion: "a-o", "x-z", bare tokens ---------------- */
  function expandList(str) {
    const out = [];
    for (const tok of str.trim().split(/\s+/)) {
      if (!tok) continue;
      const m = tok.match(/^([A-Za-z])-([A-Za-z])$/);
      if (m) { for (let c = m[1].charCodeAt(0); c <= m[2].charCodeAt(0); c++) out.push(String.fromCharCode(c)); }
      else out.push(tok);
    }
    return out;
  }

  /* ---- type variables + unification ------------------------------------- */
  let _tvc = 0;
  const fresh = () => ({ tv: ++_tvc });
  const isProd = (t) => t && typeof t === 'object' && t.prod;
  const isFun = (t) => t && typeof t === 'object' && t.from !== undefined;
  const isTv = (t) => t && typeof t === 'object' && t.tv !== undefined;

  function walk(t, sub) {
    if (isTv(t)) return sub[t.tv] ? walk(sub[t.tv], sub) : t;
    if (typeof t === 'string') return t;
    if (isProd(t)) return { prod: [walk(t.prod[0], sub), walk(t.prod[1], sub)] };
    if (isFun(t)) return { from: walk(t.from, sub), to: walk(t.to, sub) };
    return t;
  }
  function occurs(id, t, sub) {
    t = walk(t, sub);
    if (isTv(t)) return t.tv === id;
    if (typeof t === 'string') return false;
    if (isProd(t)) return occurs(id, t.prod[0], sub) || occurs(id, t.prod[1], sub);
    if (isFun(t)) return occurs(id, t.from, sub) || occurs(id, t.to, sub);
    return false;
  }
  function unify(a, b, sub) {
    a = walk(a, sub); b = walk(b, sub);
    if (isTv(a)) { if (isTv(b) && b.tv === a.tv) return true; if (occurs(a.tv, b, sub)) return false; sub[a.tv] = b; return true; }
    if (isTv(b)) { if (occurs(b.tv, a, sub)) return false; sub[b.tv] = a; return true; }
    if (typeof a === 'string' || typeof b === 'string') return a === b;
    if (isProd(a) && isProd(b)) return unify(a.prod[0], b.prod[0], sub) && unify(a.prod[1], b.prod[1], sub);
    if (isFun(a) && isFun(b)) return unify(a.from, b.from, sub) && unify(a.to, b.to, sub);
    return false;
  }

  /* ---- type inference over a term --------------------------------------- */
  // typeEnv: declared variable/constant letter → type (no products)
  function inferType(term, typeEnv) {
    const sub = {};
    const predEnv = {};
    function infer(t, ctx) {
      switch (t.t) {
        case 'sym': {
          const n = t.name;
          if (ctx[n] !== undefined) return ctx[n];
          if (typeEnv[n] !== undefined) return typeEnv[n];
          if (predEnv[n] !== undefined) return predEnv[n];
          return (predEnv[n] = fresh());
        }
        case 'lam': {
          const vt = typeEnv[t.v] !== undefined ? typeEnv[t.v] : fresh();
          const bt = infer(t.body, Object.assign({}, ctx, { [t.v]: vt }));
          return { from: vt, to: bt };
        }
        case 'app': {
          const tf = infer(t.fn, ctx), ta = infer(t.arg, ctx), r = fresh();
          if (!unify(tf, { from: ta, to: r }, sub)) throw new Error('type mismatch: applying ' + E.typeToStr(walk(tf, sub)));
          return r;
        }
        case 'not': { const e = infer(t.e, ctx); if (!unify(e, 't', sub)) throw new Error('¬ on non-truth type'); return 't'; }
        case 'star': {
          // ∗P: plural closure, ⟨e,t⟩ → ⟨e,t⟩
          const inner = infer(t.e, ctx);
          if (!unify(inner, { from: 'e', to: 't' }, sub)) throw new Error('∗ expects a predicate ⟨e,t⟩');
          return cleanType(walk({ from: 'e', to: 't' }, sub));
        }
        case 'bin': {
          const l = infer(t.l, ctx), r = infer(t.r, ctx);
          if (t.op === '=' || t.op === '≠') { if (!unify(l, r, sub)) throw new Error('= on mismatched types'); return 't'; }
          if (t.op === '<' || t.op === '>' || t.op === '⊆') {
            // temporal precedence / inclusion: both operands are times (type i)
            if (!unify(l, 'i', sub) || !unify(r, 'i', sub)) throw new Error(t.op + ' expects two times (type i)');
            return 't';
          }
          if (t.op === '≤') {
            // mereological parthood (Ch.10): e × e → t
            if (!unify(l, 'e', sub) || !unify(r, 'e', sub)) throw new Error('≤ expects two individuals (type e)');
            return 't';
          }
          if (t.op === '⊕') {
            // mereological sum (Ch.10): e × e → e
            if (!unify(l, 'e', sub) || !unify(r, 'e', sub)) throw new Error('⊕ expects two individuals (type e)');
            return 'e';
          }
          if (!unify(l, 't', sub) || !unify(r, 't', sub)) throw new Error(t.op + ' on non-truth type'); return 't';
        }
        case 'quant': {
          const vt = typeEnv[t.v] !== undefined ? typeEnv[t.v] : fresh();
          const b = infer(t.body, Object.assign({}, ctx, { [t.v]: vt }));
          if (!unify(b, 't', sub)) throw new Error(t.q + ' body must be a truth value');
          return t.q === 'ι' ? vt : 't';
        }
      }
      throw new Error('cannot type node');
    }
    const raw = infer(term, {});
    return prettify(groundT(walk(raw, sub)), {});
  }
  // remaining unconstrained type variables in this corpus are always the
  // result of an atomic predication → default them to truth-type t.
  function groundT(t) {
    if (isTv(t)) return 't';
    if (typeof t === 'string') return t;
    if (isProd(t)) return { prod: [groundT(t.prod[0]), groundT(t.prod[1])] };
    if (isFun(t)) return { from: groundT(t.from), to: groundT(t.to) };
    return t;
  }
  // turn remaining {tv} into stable greek display vars {var:'a'/'b'/…}
  function prettify(t, map) {
    if (t == null) return t;
    if (isTv(t)) { if (!map[t.tv]) map[t.tv] = String.fromCharCode(97 + Object.keys(map).length); return { var: map[t.tv] }; }
    if (typeof t === 'string') return t;
    if (isProd(t)) return { prod: [prettify(t.prod[0], map), prettify(t.prod[1], map)] };
    if (isFun(t)) return { from: prettify(t.from, map), to: prettify(t.to, map) };
    return t;
  }
  // strip display vars back to fresh tvs (so two lexical items don't share α)
  function refreshVars(t, map) {
    if (t == null) return t;
    if (typeof t === 'string') return t;
    if (t.var) { if (!map[t.var]) map[t.var] = fresh(); return map[t.var]; }
    if (isProd(t)) return { prod: [refreshVars(t.prod[0], map), refreshVars(t.prod[1], map)] };
    if (isFun(t)) return { from: refreshVars(t.from, map), to: refreshVars(t.to, map) };
    return t;
  }


  function pmVar(l, r, domainType) {
    // prefer the bound variable from the input lambda terms, matching their convention.
    // event predicates (domain = 'v') use 'e'; entities use 'x'.
    if (l.term && l.term.t === 'lam') return l.term.v;
    if (r.term && r.term.t === 'lam') return r.term.v;
    const dom = typeof domainType === 'string' ? domainType : (domainType && domainType.var ? domainType.var : '');
    if (dom === 'v' || dom === 's') return 'e';
    return 'x';
  }

  /* ---- composition rules (work on concrete/poly types) ------------------ */
  const norm = (term) => E.normalize(term);
  function applicable(children) {
    // children: [{term,type}]  → list of {key,name,abbr,desc,result:{term,type}}
    const out = [];
    if (children.length === 1) {
      out.push({ key: 'nn', name: 'Non-branching Node', abbr: 'NN',
        desc: 'A node with one child inherits that child’s meaning.',
        raw: children[0].term,
        result: { term: children[0].term, type: children[0].type } });
      return out;
    }
    if (children.length !== 2) return out;
    const [l, r] = children;
    if (!l || !r || l.type == null || r.type == null) return out;
    // Function Application (both directions)
    for (const [f, a, order] of [[l, r, 'lr'], [r, l, 'rl']]) {
      const sub = {};
      const ft = refreshVars(f.type, {});
      if (isFun(ft) && unify(ft.from, refreshVars(a.type, {}), sub)) {
        out.push({ key: 'fa', name: 'Function Application', abbr: 'FA', order,
          desc: 'Apply the function sister to its argument sister.',
          raw: E.App(f.term, a.term),
          result: { term: norm(E.App(f.term, a.term)), type: cleanType(walk(ft.to, sub)) } });
        break;
      }
    }
    // Predicate Modification — both ⟨X,t⟩ with matching X
    {
      const sub = {};
      const lt = refreshVars(l.type, {}), rt = refreshVars(r.type, {});
      if (isFun(lt) && isFun(rt) && unify(lt.to, 't', sub) && unify(rt.to, 't', sub) && unify(lt.from, rt.from, sub)) {
        const v = pmVar(l, r, walk(lt.from, sub));
        const term = E.Lam(v, E.Bin('∧', E.App(l.term, E.Sym(v)), E.App(r.term, E.Sym(v))));
        out.push({ key: 'pm', name: 'Predicate Modification', abbr: 'PM',
          desc: 'Conjoin two predicates of the same type pointwise.',
          raw: term,
          result: { term: norm(term), type: cleanType({ from: walk(lt.from, sub), to: 't' }) } });
      }
    }
    return out;
  }
  function cleanType(t) { return prettify(groundT(t), {}); }

  /* ---- type-shifting operators ------------------------------------------ */
  // Each operator is a closed λ-term applied to a node's meaning. `input` is
  // the type the node must have for the operator to apply; we β-normalize the
  // application and re-infer the result type.
  // Checks if type contains event domain 'v' anywhere
  function hasEventType(t) {
    if (t === 'v') return true;
    if (!t || typeof t !== 'object') return false;
    return hasEventType(t.from) || hasEventType(t.to);
  }

  const SHIFTERS = [
    { key: 'lift',  name: 'Lift',        group: 'NP type-shifting', input: 'e',          output: '<<e,t>,t>', term: 'Lx.LP.P(x)',           desc: 'Lift e → ⟨⟨e,t⟩,t⟩: an individual becomes the set of its properties (Partee 1986).' },
    { key: 'ident', name: 'Ident',       group: 'NP type-shifting', input: 'e',          output: '<e,t>',      term: 'Lx.Ly.(y=x)',          desc: 'Ident e → ⟨e,t⟩: an individual becomes the property of being identical to it (Partee 1986).' },
    { key: 'iota',  name: 'Iota (the)', group: 'NP type-shifting', input: '<e,t>',       output: 'e',          term: 'LP.Iz.P(z)',            desc: 'Iota ⟨e,t⟩ → e: a predicate becomes the unique individual satisfying it (Partee 1986).' },
    { key: 'aop',   name: 'A',           group: 'NP type-shifting', input: '<e,t>',       output: '<<e,t>,t>', term: 'LP.LQ.Ez[P(z) & Q(z)]', desc: 'A ⟨e,t⟩ → ⟨⟨e,t⟩,t⟩: a predicate becomes an existential generalized quantifier (Partee 1986).' },
    { key: 'be',    name: 'BE',           group: 'NP type-shifting', input: '<<e,t>,t>',  output: '<e,t>',      term: 'LT.Lx.T(Ly.(y=x))',    desc: 'BE ⟨⟨e,t⟩,t⟩ → ⟨e,t⟩: a generalized quantifier becomes a predicate; inverse of Lift (Partee 1986).' },
    { key: 'lower', name: 'Lower',       group: 'NP type-shifting', input: '<<e,t>,t>',  output: 'e',          term: 'LT.Iz.T(Ly.(z=y))',    desc: 'Lower ⟨⟨e,t⟩,t⟩ → e: a principal generalized quantifier collapses back to an individual (Partee 1986).' },
    { key: 'mod',   name: 'MOD',         group: 'Adjectives', input: '<e,t>',        output: '<<e,t>,<e,t>>', term: 'LF[LG[Lx[F(x) & G(x)]]]',
      desc: 'MOD ⟨e,t⟩ → ⟨⟨e,t⟩,⟨e,t⟩⟩: a predicative adjective becomes an attributive modifier that conjoins with a noun (Coppock & Champollion 2022).' },
    { key: 'modpred', name: 'PRED',      group: 'Adjectives', input: '<<e,t>,<e,t>>', output: '<e,t>', term: 'LM[M(Lz.(z=z))]',
      desc: 'PRED ⟨⟨e,t⟩,⟨e,t⟩⟩ → ⟨e,t⟩: a modifier becomes a predicate, applied to the trivial property λz.z=z; inverse of MOD (Coppock & Champollion 2022).' },
    { key: 'ec-e', name: 'EC (individuals)', group: 'Closure',
      matchFun: (t) => isFun(t) && t.from === 'e',
      computeOutput: (t) => t.to,
      term: 'LP.Ex.P(x)',
      desc: 'EC over individuals ⟨e,σ⟩ → σ: existentially binds the individual argument, λP.∃x.P(x) (Coppock & Champollion 2022).' },
    { key: 'ec-v', name: 'EC (events)', group: 'Closure',
      matchFun: (t) => isFun(t) && t.from === 'v',
      computeOutput: (t) => t.to,
      term: 'LP.Ee.P(e)',
      desc: 'EC over events ⟨v,σ⟩ → σ: existentially binds the event argument, λP.∃e.P(e) (Davidson 1967; Coppock & Champollion 2022).' },
    { key: 'ec-i', name: 'EC (times)', group: 'Closure',
      matchFun: (t) => isFun(t) && t.from === 'i',
      computeOutput: (t) => t.to,
      term: 'LP.Et.P(t)',
      desc: 'EC over times ⟨i,σ⟩ → σ: existentially binds the time argument, λP.∃t.P(t) (Coppock & Champollion 2022, §12).' },
    { key: 'ec',   name: 'EC (polymorphic)', group: 'Closure',
      matchFun: (t) => isFun(t) && typeof t.from === 'string' && t.from !== 't',
      computeOutput: (t) => t.to,
      computeTerm: (t) => t.from === 'i' ? 'LP.Et.P(t)' : (t.from === 'v' ? 'LP.Ee.P(e)' : 'LP.Ex.P(x)'),
      term: 'LP.Ex.P(x)',
      desc: 'Polymorphic EC ⟨τ,σ⟩ → σ for any atomic domain τ (individuals e, events v, times i, …): existentially binds the argument, λP.∃x.P(x) (Coppock & Champollion 2022).' },
    { key: 'raiseO', name: 'RaiseO', group: 'Argument raising',
      matchFun: (t) => isFun(t) && isFun(t.to) && t.from === 'e' && (t.to.to === 't' || t.to.from === 'e'),
      computeOutput: (t) => ({ from: { from: { from: 'e', to: 't' }, to: 't' }, to: { from: t.to.from, to: t.to.to } }),
      computeTerm: (t) => hasEventType(t.to.to)
        ? 'LH.LQ.Lx.Le.Q(Ly.H(y)(x)(e))'
        : 'LH.LQ.Lx.Q(Ly.H(y)(x))',
      term: 'LH.LQ.Lx.Q(Ly.H(y)(x))',
      desc: 'RaiseO ⟨e,⟨σ,t⟩⟩ → ⟨⟨⟨e,t⟩,t⟩,⟨σ,t⟩⟩: lifts the object position so a generalized quantifier can fill it, for any type σ (Hendriks 1993).' },
    { key: 'raiseS', name: 'RaiseS', group: 'Argument raising',
      matchFun: (t) => isFun(t) && isFun(t.to) && t.to.from === 'e' && t.to.to === 't',
      computeOutput: (t) => ({ from: t.from, to: { from: { from: { from: 'e', to: 't' }, to: 't' }, to: 't' } }),
      term: 'LH.Ly.LQ.Q(Lx.H(y)(x))',
      desc: 'RaiseS ⟨σ,⟨e,t⟩⟩ → ⟨σ,⟨⟨⟨e,t⟩,t⟩,t⟩⟩: lifts the subject position to a generalized quantifier, for any type σ (Hendriks 1993).' },
  ];
  // EC accepts any predicate of an atomic argument: ⟨e,t⟩, ⟨v,t⟩, ⟨s,t⟩, …
  function isAtomicPredicate(t) {
    return t && typeof t === 'object' && t.from !== undefined
      && typeof t.from === 'string' && (t.to === 't' || (t.to && t.to.var));
  }
  function typeMatches(nodeType, op) {
    if (nodeType == null) return false;
    if (op.matchFun) return op.matchFun(nodeType);
    if (op.matchPred) return isAtomicPredicate(nodeType);
    const want = E.parseType(op.input);
    return E.typeEqual(stripVars(nodeType), want, {}) && E.typeEqual(want, stripVars(nodeType), {});
  }
  function stripVars(t) { // display-var → keep structure but compare leniently
    if (typeof t === 'string') return t;
    if (t.var) return t;            // a polymorphic slot; equality handles it
    if (t.prod) return { prod: [stripVars(t.prod[0]), stripVars(t.prod[1])] };
    if (t.from) return { from: stripVars(t.from), to: stripVars(t.to) };
    return t;
  }
  function applicableShifts(nodeType) {
    return SHIFTERS.filter((s) => typeMatches(nodeType, s));
  }
  function applyShift(op, nodeTerm, nodeType, typeEnv) {
    const termStr = (op.computeTerm && nodeType) ? op.computeTerm(nodeType) : op.term;
    const opTerm = E.parse(E.asciiToUnicode(termStr));
    const term = norm(E.App(opTerm, nodeTerm));
    let type;
    if (op.computeOutput && nodeType) type = cleanType(op.computeOutput(nodeType));
    else if (op.matchPred) type = 't';
    else type = E.parseType(op.output);
    return { term, type, op: op.key, opName: op.name };
  }

  /* ---- candidate rules: ALL structural rules + ok/reason ---------------- */
  // For the rule chooser: returns FA, PM, NN (in that order), each annotated
  // with whether it applies and, if not, a human-readable reason. PA nodes are
  // handled separately by the view.
  function candidateRules(children) {
    const FA  = { key: 'fa',  name: 'Function Application',             abbr: 'FA',  desc: 'Apply a function sister ⟨A,B⟩ to its argument sister of type A, giving type B.' };
    const PM  = { key: 'pm',  name: 'Predicate Modification',           abbr: 'PM',  desc: 'Conjoin two sister predicates of the same type ⟨A,t⟩ pointwise: λx.[F(x) ∧ G(x)].' };
    const NN  = { key: 'nn',  name: 'Non-branching Node',               abbr: 'NN',  desc: 'A node with one child inherits that child’s meaning unchanged.' };
    const IFA = { key: 'ifa', name: 'Intensional Function Application', abbr: 'IFA', desc: 'Compose an intension-seeking head ⟨⟨s,σ⟩,τ⟩ with the intension λw₀.β of its sister (type σ), giving type τ. The sister’s meaning is wrapped as λw₀.β before application (Heim & Kratzer 1998, §13).' };
    const n = children.length;
    const tyStr = (c) => (c && c.type != null) ? E.typeToStr(c.type) : '?';
    const out = [];

    // Function Application
    if (n === 2 && children[0] && children[1] && children[0].type != null && children[1].type != null) {
      const [l, r] = children;
      let fres = null;
      for (const [f, a] of [[l, r], [r, l]]) {
        const sub = {}; const ft = refreshVars(f.type, {});
        if (isFun(ft) && unify(ft.from, refreshVars(a.type, {}), sub)) {
          const rawTerm = E.App(f.term, a.term);
          fres = { term: norm(rawTerm), type: cleanType(walk(ft.to, sub)), raw: rawTerm }; break;
        }
      }
      if (fres) out.push(Object.assign({}, FA, { ok: true, result: fres, raw: fres.raw }));
      else out.push(Object.assign({}, FA, { ok: false, reason: 'Neither sister is a function that takes the other as its argument. The sisters are type ' + tyStr(l) + ' and ' + tyStr(r) + '.' }));
      // Predicate Modification
      const sub = {}; const lt = refreshVars(l.type, {}), rt = refreshVars(r.type, {});
      if (isFun(lt) && isFun(rt) && unify(lt.to, 't', sub) && unify(rt.to, 't', sub) && unify(lt.from, rt.from, sub)) {
        const v = pmVar(l, r, walk(lt.from, sub)); const term = E.Lam(v, E.Bin('∧', E.App(l.term, E.Sym(v)), E.App(r.term, E.Sym(v))));
        out.push(Object.assign({}, PM, { ok: true, result: { term: norm(term), type: cleanType({ from: walk(lt.from, sub), to: 't' }), raw: term }, raw: term }));
      } else {
        out.push(Object.assign({}, PM, { ok: false, reason: 'Both sisters must be predicates ⟨A,t⟩ of the same type A. The sisters are ' + tyStr(l) + ' and ' + tyStr(r) + '.' }));
      }
    } else {
      out.push(Object.assign({}, FA, { ok: false, reason: 'Function Application combines exactly two sisters; this node has ' + n + '.' }));
      out.push(Object.assign({}, PM, { ok: false, reason: 'Predicate Modification combines exactly two sisters; this node has ' + n + '.' }));
    }

    // Non-branching Node
    if (n === 1 && children[0] && children[0].type != null) {
      out.push(Object.assign({}, NN, { ok: true, result: { term: children[0].term, type: children[0].type } }));
    } else {
      out.push(Object.assign({}, NN, { ok: false, reason: 'Non-branching Node applies only to a node with exactly one child; this node has ' + n + '.' }));
    }

    // Intensional Function Application (IFA, Composition Rule 8, Heim & Kratzer 1998)
    // Fires when one sister has type ⟨⟨s,σ⟩,τ⟩ and the other has type σ.
    // Wraps the σ-type sister as λw0.β (its intension) before applying the head.
    if (n === 2 && children[0] && children[1] && children[0].type != null && children[1].type != null) {
      const [l2, r2] = children;
      let ifares = null;
      for (const [f2, a2] of [[l2, r2], [r2, l2]]) {
        const sub2 = {}; const ft2 = refreshVars(f2.type, {});
        if (isFun(ft2) && isFun(ft2.from) && ft2.from.from === 's' && unify(ft2.from.to, refreshVars(a2.type, {}), sub2)) {
          const rawTerm2 = E.App(f2.term, E.Lam('w0', a2.term));
          ifares = { term: norm(rawTerm2), type: cleanType(walk(ft2.to, sub2)), raw: rawTerm2 }; break;
        }
      }
      if (ifares) out.push(Object.assign({}, IFA, { ok: true, result: ifares, raw: ifares.raw }));
      else out.push(Object.assign({}, IFA, { ok: false, reason: 'IFA requires one sister of type ⟨⟨s,σ⟩,τ⟩ and the other of type σ. Sisters here are type ' + tyStr(l2) + ' and ' + tyStr(r2) + '.' }));
    } else {
      out.push(Object.assign({}, IFA, { ok: false, reason: 'IFA combines exactly two sisters; this node has ' + n + '.' }));
    }

    return out;
  }

  /* ---- tree parsing (labeled brackets) ---------------------------------- */
  let _nid = 0;
  function parseTree(src) {
    let i = 0;
    const ws = () => { while (i < src.length && /\s/.test(src[i])) i++; };
    function node() {
      ws();
      if (src[i] === '[') {
        i++; ws();
        let label = null;
        if (src[i] === '.') { i++; let j = i; while (j < src.length && !/\s/.test(src[j]) && src[j] !== ']' && src[j] !== '[') j++; label = src.slice(i, j); i = j; }
        const children = [];
        ws();
        while (i < src.length && src[i] !== ']') { children.push(node()); ws(); }
        if (src[i] === ']') i++;
        return { id: 'k' + (_nid++), label, children };
      }
      let j = i;
      while (j < src.length && !/\s/.test(src[j]) && src[j] !== ']' && src[j] !== '[') j++;
      const word = src.slice(i, j); i = j;
      return { id: 'k' + (_nid++), word, children: [] };
    }
    return node();
  }

  /* ---- solver: compute meaning of a whole tree -------------------------- */
  // Returns map nodeId → {term, type, rule} for every computable node
  // (leaves included, so the UI can read any node's target meaning).
  function solveTree(root, set) {
    const result = {};
    function leaf(node) {
      const w = node.word;
      const tm = w.match(/^t_?(\d+)$/i);
      if (tm) return (result[node.id] = { term: E.Sym('x' + tm[1]), type: 'e', rule: 'trace' });
      if (/^\d+$/.test(w)) return null;          // bare index — not a meaning
      const lx = set.lex[w];
      if (lx && lx.term) return (result[node.id] = { term: lx.term, type: lx.type, rule: 'lex' });
      return null;
    }
    function solve(node) {
      if (!node.children || node.children.length === 0) return leaf(node);
      // Predicate Abstraction node:  [.LP i  S ]  (or any label with a numeric first child)
      const idxChild = node.children.find((c) => c.word && /^\d+$/.test(c.word));
      const realKids = node.children.filter((c) => !(c.word && /^\d+$/.test(c.word)));
      const lambdaLabel = (node.label || '').match(/^\u03bb(\d+)$/);
      const paIdx = (idxChild && realKids.length === 1) ? idxChild.word
                  : (lambdaLabel && node.children.length === 1) ? lambdaLabel[1] : null;
      const paChild = paIdx ? (idxChild ? realKids[0] : node.children[0]) : null;
      if (paIdx && paChild) {
        const inner = solve(paChild);
        if (!inner || inner.type == null) return null;
        const vname = 'x' + paIdx;
        const rawTerm = E.Lam(vname, inner.term);
        return (result[node.id] = { term: norm(rawTerm), raw: rawTerm, idx: paIdx,
          type: cleanType({ from: 'e', to: refreshVars(inner.type, {}) }), rule: 'PA' });
      }
      const kids = realKids.map(solve);
      if (kids.some((k) => !k || k.type == null)) return null;
      const rules = applicable(kids);
      if (rules.length === 0) return null;
      const chosen = rules[0];
      return (result[node.id] = { term: chosen.result.term, type: chosen.result.type, raw: chosen.raw, rule: chosen.abbr || chosen.key });
    }
    solve(root);
    return result;
  }

  /* ---- whole-file parser ------------------------------------------------ */
  // Dispatches on content: a leading "{" means the native COMPOSE JSON format;
  // anything else is parsed as the legacy Lambda-Calculator DSL.
  function parseFile(text, fallbackTitle) {
    const t = (text || '').trim();
    if (t.charAt(0) === '{') {
      try { return parseJSON(JSON.parse(t), fallbackTitle); }
      catch (e) { /* not valid JSON — fall through to the legacy DSL parser */ }
    }
    return parseDSL(text, fallbackTitle);
  }

  // Build a normalized "allowed"-style config object from a JSON `rules` block.
  function rulesToConfig(r) {
    r = r || {};
    const comp = r.composition || {};
    const shiftKeys = Array.isArray(r.typeShifts) ? r.typeShifts : [];
    const shift = {};
    for (const s of SHIFTERS) shift[s.key] = shiftKeys.includes(s.key);
    return {
      fa: comp.functionApplication !== false,
      pm: !!comp.predicateModification,
      nn: comp.nonBranchingNodes !== false,
      pa: !!comp.predicateAbstraction,
      shift,
      qr: !!r.quantifierRaising,
      autoNN: !!r.autoResolveNonBranching,
      lastResort: !!r.typeShiftsLastResort,
    };
  }

  // Native COMPOSE exercise format (JSON). See FORMAT.md for the schema.
  function parseJSON(obj, fallbackTitle) {
    const set = { id: obj.id || '', subtitle: obj.subtitle || '', title: obj.title || fallbackTitle || '',
      typeEnv: {}, constEnv: {}, lex: {}, lexList: [], rules: [], multiLetter: true, groups: [], displayHints: {} };

    // --- domain declarations ---
    const dom = obj.domain || {};
    set.multiLetter = dom.multiLetterNames !== false;
    const applyDecls = (map, isConst) => {
      for (const typeStr in (map || {})) {
        let ty; try { ty = E.parseType(String(typeStr).replace(/⟨/g, '<').replace(/⟩/g, '>').trim()); } catch (e) { continue; }
        if (containsProd(ty)) continue;
        for (const sym of expandList(map[typeStr])) { set.typeEnv[sym] = ty; if (isConst) set.constEnv[sym] = ty; }
      }
    };
    applyDecls(dom.constants, true);
    applyDecls(dom.variables, false);

    // --- lexicon ---
    for (const e of (obj.lexicon || [])) {
      const words = Array.isArray(e.words) ? e.words.map((w) => String(w).trim()).filter(Boolean)
        : String(e.words || e.word || '').split(',').map((w) => w.trim()).filter(Boolean);
      const src = String(e.denotation || e.den || '').trim();
      const display = e.displayAs || e.display || null;
      if (display) for (const w of words) set.displayHints[w] = display;
      let term = null, type = null, err = null;
      const pr = E.tryParse(src);
      if (pr.ok) { term = pr.ast; try { type = inferType(term, set.typeEnv); } catch (ex) { err = ex.message; } }
      else err = pr.error;
      const entry = { words, src, term, type, err, hint: display };
      set.lexList.push(entry);
      for (const w of words) set.lex[w] = entry;
    }

    // --- rule configuration (composition rules, type-shifts, behaviour) ---
    set.config = rulesToConfig(obj.rules);
    // mirror the enabled composition rules into the legacy `rules` name list
    const comp = (obj.rules && obj.rules.composition) || {};
    if (comp.functionApplication !== false) set.rules.push('function application');
    if (comp.predicateModification) set.rules.push('predicate modification');
    if (comp.nonBranchingNodes !== false) set.rules.push('non-branching nodes');
    if (comp.predicateAbstraction) set.rules.push('predicate abstraction');

    // --- exercises (every exercise is a tree; no kind needed) ---
    (obj.exercises || []).forEach((g, gi) => {
      const group = { id: 'g' + gi, kind: 'tree', title: g.title || '', directions: g.instructions || g.directions || '', problems: [] };
      (g.items || g.trees || []).forEach((item, pi) => {
        const tgts = Array.isArray(item.targets) ? item.targets.filter(Boolean) : (item.target ? [item.target] : []);
        group.problems.push({ id: group.id + 'p' + pi, kind: 'tree', tree: String(item.tree || '').trim(),
          gloss: item.sentence || item.instructions || item.gloss || '',
          targets: tgts.length ? tgts : undefined });
      });
      set.groups.push(group);
    });

    if (!set.title) set.title = set.id || 'Exercise set';
    return set;
  }

  function parseDSL(text, fallbackTitle) {
    const set = { id: '', subtitle: '', title: fallbackTitle || '', typeEnv: {}, constEnv: {}, lex: {}, lexList: [],
      rules: [], multiLetter: false, groups: [], displayHints: {} };
    const lines = text.split(/\r?\n/);
    let group = null, pendingInstr = null, pendingTargets = [], seenContent = false;

    const setType = (typeStr, listStr, hint, isConst) => {
      let t; try { t = E.parseType(typeStr.replace(/⟨/g, '<').replace(/⟩/g, '>').trim()); } catch (e) { return; }
      if (containsProd(t)) return;            // leave product-typed predicates to inference
      for (const sym of expandList(listStr)) { set.typeEnv[sym] = t; if (isConst) set.constEnv[sym] = t; if (hint) set.displayHints[sym] = hint; }
    };

    for (let raw of lines) {
      const line = raw.replace(/\s+$/, '');
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith('#')) continue;

      // id / subtitle (first two content lines before any directive)
      if (!seenContent && !/^(constants|variables|define|use rule|multiple|exercise|title|directions|instructions|target)\b/i.test(trimmed) && trimmed[0] !== '[') {
        if (!set.id) { set.id = trimmed; continue; }
        if (!set.subtitle && !group) { set.subtitle = trimmed; continue; }
      }

      let m;
      if ((m = trimmed.match(/^constants of type\s+(.+?)\s*:\s*(.+)$/i))) {
        seenContent = true;
        let listPart = m[2], hint = null;
        const hm = listPart.match(/;\s*display as:\s*(.+)$/i);
        if (hm) { hint = hm[1].trim(); listPart = listPart.slice(0, hm.index); }
        setType(m[1], listPart, hint, true);
        continue;
      }
      if ((m = trimmed.match(/^variables of type\s+(.+?)\s*:\s*(.+)$/i))) {
        seenContent = true;
        let listPart = m[2], hint = null;
        const hm = listPart.match(/;\s*display as:\s*(.+)$/i);
        if (hm) { hint = hm[1].trim(); listPart = listPart.slice(0, hm.index); }
        setType(m[1], listPart, hint, false);
        continue;
      }
      if (/^multiple letter identifiers/i.test(trimmed)) { set.multiLetter = true; seenContent = true; continue; }
      if ((m = trimmed.match(/^use rule\s+(.+)$/i))) { set.rules.push(m[1].trim().toLowerCase()); seenContent = true; continue; }
      if ((m = trimmed.match(/^define\s+(.+?)\s*:\s*(.+)$/i))) {
        seenContent = true;
        const words = m[1].split(',').map((w) => w.trim()).filter(Boolean);
        const src = m[2].trim();
        let term = null, type = null, err = null;
        const pr = E.tryParse(src);
        if (pr.ok) { term = pr.ast; try { type = inferType(term, set.typeEnv); } catch (e) { err = e.message; } }
        else err = pr.error;
        const entry = { words, src, term, type, err, hint: set.displayHints[words[0]] || null };
        set.lexList.push(entry);
        for (const w of words) set.lex[w] = entry;
        continue;
      }
      if ((m = trimmed.match(/^exercise\s+(.+)$/i))) {
        seenContent = true;
        const kindRaw = m[1].trim().toLowerCase();
        const kind = kindRaw.startsWith('semantic') ? 'types' : kindRaw.startsWith('lambda') ? 'conversion' : 'tree';
        group = { id: 'g' + set.groups.length, kind, title: '', directions: '', problems: [] };
        set.groups.push(group); pendingInstr = null; pendingTargets = [];
        continue;
      }
      if ((m = trimmed.match(/^title\s+(.+)$/i))) { if (group) group.title = m[1].trim(); seenContent = true; continue; }
      if ((m = trimmed.match(/^directions\s+(.+)$/i))) { if (group) group.directions = m[1].trim(); seenContent = true; continue; }
      if ((m = trimmed.match(/^instructions\s+(.+)$/i))) { pendingInstr = m[1].trim(); seenContent = true; continue; }
      if ((m = trimmed.match(/^target\s+(.+)$/i))) { (pendingTargets = pendingTargets || []).push(m[1].trim()); seenContent = true; continue; }

      // otherwise: a problem line in the current group
      if (group) {
        seenContent = true;
        if (group.kind === 'tree' || trimmed[0] === '[') {
          group.problems.push({ id: group.id + 'p' + group.problems.length, kind: 'tree', tree: trimmed, gloss: pendingInstr || '', targets: pendingTargets && pendingTargets.length ? [...pendingTargets] : undefined });
        } else if (group.kind === 'types') {
          const pr = E.tryParse(trimmed);
          let ans = null; if (pr.ok) { try { ans = inferType(pr.ast, set.typeEnv); } catch (e) {} }
          group.problems.push({ id: group.id + 'p' + group.problems.length, kind: 'types', src: trimmed, answerType: ans, gloss: pendingInstr || '' });
        } else {
          group.problems.push({ id: group.id + 'p' + group.problems.length, kind: 'conversion', src: trimmed, gloss: pendingInstr || '' });
        }
        pendingInstr = null; pendingTargets = [];
      }
    }
    if (!set.title) set.title = set.id || 'Exercise set';
    return set;
  }
  function containsProd(t) { if (isProd(t)) return true; if (isFun(t)) return containsProd(t.from) || containsProd(t.to); return false; }


  /* ---- Quantifier Raising tree utilities --------------------------------- */
  function findNodeById(root, id) {
    if (root.id === id) return root;
    for (const c of root.children || []) { const f = findNodeById(c, id); if (f) return f; }
    return null;
  }
  function findParentOf(root, childId) {
    for (const c of root.children || []) {
      if (c.id === childId) return root;
      const f = findParentOf(c, childId); if (f) return f;
    }
    return null;
  }
  // Clause-level labels a quantifier may raise to. Besides S/CP we include the
  // Chapter-12 functional projections (vP, AspP, PerfP, ModP, TenseP), so a
  // quantified subject/object can raise to the top of a tense/aspect tree.
  const CLAUSE_LABELS = ['S', 'CP', 'vP', 'AspP', 'PerfP', 'ModP', 'TenseP'];
  function allSNodes(root) {
    // All clause nodes (actual clause nodes, not LP binder nodes)
    const out = [];
    (function walk(n) {
      const lbl = n.label || '';
      if ((CLAUSE_LABELS.includes(lbl) || (!lbl && n.children && n.children.length > 0 && !n.word)) && lbl !== 'LP')
        out.push(n);
      (n.children || []).forEach(walk);
    })(root);
    return out;
  }
  function isDominatedBy(root, ancestorId, nodeId) {
    const anc = findNodeById(root, ancestorId);
    if (!anc || anc.id === nodeId) return false;
    return !!findNodeById(anc, nodeId);
  }
  function applyQR(root, dpId, targetSId, index) {
    const tree = JSON.parse(JSON.stringify(root));
    const dpParent = findParentOf(tree, dpId);
    if (!dpParent) throw new Error('DP has no parent');
    const dpIdx = dpParent.children.findIndex(c => c.id === dpId);
    const dp = dpParent.children[dpIdx];
    const trace = { id: 'qrt-' + index, word: 't_' + index, children: [] };
    dpParent.children[dpIdx] = trace;
    // find target (now with trace inside it)
    const targetInTree = findNodeById(tree, targetSId);
    const targetParent = findParentOf(tree, targetSId);
    const idxNode = { id: 'qridx-' + index, word: String(index), children: [] };
    const lpNode = { id: 'qrlp-' + index, label: 'LP', children: [idxNode, JSON.parse(JSON.stringify(targetInTree))] };
    const newS = { id: 'qrs-' + index, label: (targetInTree.label || 'S'), children: [dp, lpNode] };
    if (!targetParent) return newS;
    const tIdx = targetParent.children.findIndex(c => c.id === targetSId);
    targetParent.children[tIdx] = newS;
    return tree;
  }

  window.LCFormat = { parseFile, parseJSON, parseDSL, rulesToConfig, parseTree, solveTree, applicable, candidateRules, inferType, expandList, refreshVars, SHIFTERS, applicableShifts, applyShift, findNodeById, findParentOf, allSNodes, isDominatedBy, applyQR };
})();
