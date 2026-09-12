#!/usr/bin/env node
/* ============================================================
   scripts/check.mjs — THE test suite (`npm test`). No deps.
   Generic integrity checks for the teaching workspace:
   1. every local href/src in every HTML file resolves
   2. no NUL bytes / empty text files (host-tool truncation guard)
   3. <div> tags balance in every HTML file
   4. every deck.html loads deck-stage.js and has ≥1 slide section
   5. the hub's WEEKS/IDENTITIES mirror the shared/*-meta.js
      catalogues (title · section · reading/present · identities)
   6. no unreplaced {{TOKEN}}s outside templates/ (scaffold guard)
   Add a check for every feature you ship.
   ============================================================ */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const fail = (msg) => failures.push(msg);
const rel = (p) => path.relative(ROOT, p).replaceAll(path.sep, "/");

const SKIP_DIRS = new Set([".git", "node_modules"]);
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}
const allFiles = walk(ROOT);
const htmlFiles = allFiles.filter((f) => f.endsWith(".html"));

// ---- 1: local links resolve --------------------------------------------------
const LINK_RE = /(?:href|src)\s*=\s*"([^"]+)"/g;
for (const f of htmlFiles) {
  // strip <script> bodies — pages build links from strings the regex would misread
  const html = fs.readFileSync(f, "utf8").replace(/<script[\s\S]*?<\/script>/g, "<script></script>");
  for (const [, url] of html.matchAll(LINK_RE)) {
    if (/^(https?:|\/\/|mailto:|data:|javascript:|#)/.test(url)) continue;
    if (url.includes("{{")) continue; // template token (templates/week/*) — filled by new-week.mjs
    const clean = decodeURIComponent(url.split("#")[0].split("?")[0]);
    if (!clean) continue;
    const target = path.resolve(path.dirname(f), clean);
    const ok = clean.endsWith("/")
      ? fs.existsSync(path.join(target, "index.html"))
      : fs.existsSync(target);
    if (!ok) fail(`${rel(f)}: broken link "${url}"`);
  }
}

// ---- 2: NUL bytes / empty text files (truncation guard) -----------------------
const TEXT_EXT = new Set([".html", ".css", ".js", ".mjs", ".md", ".json", ".yml", ".yaml", ".gitignore"]);
for (const f of allFiles) {
  if (!TEXT_EXT.has(path.extname(f)) && path.basename(f) !== ".gitignore") continue;
  const buf = fs.readFileSync(f);
  if (buf.length === 0) fail(`${rel(f)}: file is empty`);
  if (buf.includes(0)) fail(`${rel(f)}: contains NUL bytes (truncated/corrupted write?)`);
}

// ---- 3: <div> balance ----------------------------------------------------------
// Legacy imbalances (browsers auto-close; pages render fine) are frozen at
// their known values — any NEW imbalance, or a change to these, fails.
const DIV_BASELINE = {
  "uploads/COMPOSE - Invitation to Formal Semantics Ch 6-8 -Teacher-.html": [178, 174],
  "weeks-pragmatics/week-01/exercises.html": [35, 31],
  "weeks-pragmatics/week-03/exercises.html": [35, 31],
  "weeks-pragmatics/week-04/exercises.html": [35, 31],
  "weeks-pragmatics/week-05/exercises.html": [35, 31],
  "weeks-pragmatics/week-06/exercises.html": [35, 31],
  "weeks-pragmatics/week-08/exercises.html": [35, 31],
  "weeks-pragmatics/week-09/exercises.html": [35, 31],
  "weeks-pragmatics/week-10/exercises.html": [35, 31],
  "weeks-pragmatics/week-11/exercises.html": [35, 31],
  "weeks-pragmatics/week-12/exercises.html": [35, 31],
  "weeks-semantics1/week-01/exercises.html": [35, 31],
  "weeks-semantics1/week-02/exercises.html": [35, 31],
  "weeks-semantics1/week-03/handout.html": [100, 101],
};
for (const f of htmlFiles) {
  const html = fs.readFileSync(f, "utf8");
  const open = (html.match(/<div\b/g) || []).length;
  const close = (html.match(/<\/div>/g) || []).length;
  const base = DIV_BASELINE[rel(f)];
  if (base ? open !== base[0] || close !== base[1] : open !== close)
    fail(`${rel(f)}: unbalanced <div> tags (${open} open vs ${close} close)`);
}

// ---- 4: deck sanity ------------------------------------------------------------
for (const f of htmlFiles.filter((f) => path.basename(f) === "deck.html")) {
  const html = fs.readFileSync(f, "utf8");
  if (!html.includes("deck-stage.js")) fail(`${rel(f)}: does not load shared/deck-stage.js`);
  if (!/<section class="slide/.test(html)) fail(`${rel(f)}: no <section class="slide"> found`);
}

// ---- 5: hub ↔ catalogue sync ---------------------------------------------------
// CLAUDE.md's #1 gotcha: week status/title changes must land in BOTH the module's
// shared/*-meta.js AND index.html's WEEKS array. This check makes drift fail CI
// (and CI gates deploys), so a mismatch can never go live. Compared per module:
// week set · title · section name · reading/present flags · identity codes+names.
// (Per-artifact status and `fig` strings live only in the hub — not compared.)
const CATALOGUES = {
  sem:   "shared/week-meta.js",
  sem2:  "shared/sem2-meta.js",
  sem3:  "shared/sem3-meta.js",
  prag:  "shared/prag-meta.js",
  prag2: "shared/prag2-meta.js",
};

function loadCatalogue(file) {
  const src = fs.readFileSync(path.join(ROOT, file), "utf8");
  const window = {};
  vm.runInNewContext(src, { window });
  return window;
}

// Pull `const NAME = […] / {…}` out of the hub's inline script and evaluate the
// literal. closer is the top-level terminator ("\n];" or "\n};") — nested lines
// are indented, so the first column-0 occurrence closes the literal.
function extractHubConst(html, name, closer) {
  const marker = `const ${name} = `;
  const i = html.indexOf(marker);
  if (i === -1) return null;
  const j = html.indexOf(closer, i);
  if (j === -1) return null;
  const literal = html.slice(i + marker.length, j + closer.length - 1); // drop ";"
  return vm.runInNewContext("(" + literal + ")");
}

{
  const hubHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  let hubWeeks = null, hubIdent = null;
  try { hubWeeks = extractHubConst(hubHtml, "WEEKS", "\n];"); } catch (e) { fail(`index.html: WEEKS array did not evaluate (${e.message})`); }
  try { hubIdent = extractHubConst(hubHtml, "IDENTITIES", "\n};"); } catch (e) { fail(`index.html: IDENTITIES map did not evaluate (${e.message})`); }
  if (!hubWeeks) fail("index.html: could not locate/evaluate the WEEKS array");
  if (!hubIdent) fail("index.html: could not locate/evaluate the IDENTITIES map");

  for (const [m, file] of Object.entries(CATALOGUES)) {
    let cat;
    try { cat = loadCatalogue(file); }
    catch (e) { fail(`${file}: failed to evaluate (${e.message})`); continue; }
    const metaWeeks = cat.WEEKS || [];
    if (!metaWeeks.length) fail(`${file}: no WEEKS found`);
    if (!hubWeeks) continue;
    const hub = hubWeeks.filter((w) => w.m === m);

    const metaNos = metaWeeks.map((w) => w.no).sort((a, b) => a - b).join(",");
    const hubNos = hub.map((w) => w.no).sort((a, b) => a - b).join(",");
    if (metaNos !== hubNos) { fail(`hub↔${file}: week sets differ (hub: [${hubNos}] vs meta: [${metaNos}])`); continue; }

    for (const mw of metaWeeks) {
      const hw = hub.find((w) => w.no === mw.no);
      const where = `hub↔${file} week ${mw.no}`;
      if (hw.title !== mw.title) fail(`${where}: title "${hw.title}" (hub) ≠ "${mw.title}" (meta)`);
      const secName = (cat.MODULE_SECTIONS || [])[mw.section];
      if (hw.sec !== secName) fail(`${where}: section "${hw.sec}" (hub) ≠ "${secName}" (meta)`);
      if (!!hw.reading !== !!mw.reading) fail(`${where}: 'reading' flag differs (hub: ${!!hw.reading} vs meta: ${!!mw.reading})`);
      if (!!hw.present !== !!mw.present) fail(`${where}: 'present' flag differs (hub: ${!!hw.present} vs meta: ${!!mw.present})`);
    }

    const metaIds = (((cat.MODULE || {}).identities) || []).map((i) => `${i.code} ${i.name}`).join(" | ");
    const hubIds = (((hubIdent || {})[m]) || []).map((i) => `${i.code} ${i.name}`).join(" | ");
    if (metaIds !== hubIds) fail(`hub↔${file}: identities differ (hub: "${hubIds}" vs meta: "${metaIds}")`);
  }
}

// ---- 6: no unreplaced template tokens outside templates/ ------------------------
// templates/week/*.html legitimately contain {{TOKEN}}s; anywhere else one appears,
// a new-week.mjs substitution failed or a template was copied by hand unfilled.
for (const f of htmlFiles) {
  if (rel(f).startsWith("templates/")) continue;
  const hits = fs.readFileSync(f, "utf8").match(/\{\{[A-Z0-9_]+\}\}/g);
  if (hits) fail(`${rel(f)}: unreplaced template token(s) ${[...new Set(hits)].join(", ")}`);
}

// ---- report ---------------------------------------------------------------------
if (failures.length) {
  console.error(`FAIL — ${failures.length} problem(s):`);
  for (const m of failures) console.error("  ✗ " + m);
  process.exit(1);
}
console.log(`OK — ${htmlFiles.length} HTML file(s): links, integrity, deck sanity, hub↔catalogue sync all green.`);
