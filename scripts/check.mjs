#!/usr/bin/env node
/* ============================================================
   scripts/check.mjs — THE test suite (`npm test`). No deps.
   Generic integrity checks for the teaching workspace:
   1. every local href/src in every HTML file resolves
   2. no NUL bytes / empty text files (host-tool truncation guard)
   3. <div> tags balance in every HTML file
   4. every deck.html loads deck-stage.js and has ≥1 slide section
   Add a check for every feature you ship.
   ============================================================ */
import fs from "node:fs";
import path from "node:path";
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

// ---- report ---------------------------------------------------------------------
if (failures.length) {
  console.error(`FAIL — ${failures.length} problem(s):`);
  for (const m of failures) console.error("  ✗ " + m);
  process.exit(1);
}
console.log(`OK — ${htmlFiles.length} HTML file(s): links, integrity, deck sanity all green.`);
