#!/usr/bin/env node
/* ============================================================
   scripts/check.mjs — THE test suite (`npm test`). No deps.
   1. every <year>/<slug>/ deck folder has index.html
   2. shared/decks.js parses; entries ↔ folders match 1:1
   3. every local href/src in every HTML file resolves
   4. every deck loads deck-stage.js and has ≥1 slide section
   5. no NUL bytes / empty text files (host-tool truncation guard)
   6. <div> tags balance in every HTML file
   Add a check for every feature you ship.
   ============================================================ */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const fail = (msg) => failures.push(msg);
const rel = (p) => path.relative(ROOT, p).replaceAll(path.sep, "/");

// ---- collect files ---------------------------------------------------------
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

// ---- 1 + 2: deck folders ↔ decks.js catalogue ------------------------------
const yearDirs = fs
  .readdirSync(ROOT, { withFileTypes: true })
  .filter((e) => e.isDirectory() && /^\d{4}$/.test(e.name))
  .map((e) => e.name);

const deckFolders = new Set();
for (const y of yearDirs) {
  for (const e of fs.readdirSync(path.join(ROOT, y), { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    deckFolders.add(`${y}/${e.name}`);
    if (!fs.existsSync(path.join(ROOT, y, e.name, "index.html")))
      fail(`deck folder ${y}/${e.name}/ has no index.html`);
  }
}

let DECKS = null;
try {
  const src = fs.readFileSync(path.join(ROOT, "shared", "decks.js"), "utf8");
  const w = {};
  new Function("window", src)(w);
  DECKS = w.DECKS;
  if (!Array.isArray(DECKS)) throw new Error("window.DECKS is not an array");
} catch (e) {
  fail(`shared/decks.js failed to evaluate: ${e.message}`);
}

if (DECKS) {
  const seen = new Set();
  for (const d of DECKS) {
    const where = `decks.js entry ${JSON.stringify(d.slug ?? d)}`;
    for (const k of ["year", "slug", "title", "venue", "date", "status"])
      if (d[k] === undefined || d[k] === "") fail(`${where}: missing field "${k}"`);
    if (!/^\d{4}$/.test(String(d.year))) fail(`${where}: year must be a 4-digit number`);
    if (d.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(d.slug)) fail(`${where}: slug must be kebab-case`);
    if (!["ready", "draft"].includes(d.status)) fail(`${where}: status must be "ready" or "draft"`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date ?? "")) fail(`${where}: date must be YYYY-MM-DD`);
    const key = `${d.year}/${d.slug}`;
    if (seen.has(key)) fail(`${where}: duplicate entry for ${key}`);
    seen.add(key);
    if (!deckFolders.has(key)) fail(`${where}: folder ${key}/ does not exist`);
  }
  for (const f of deckFolders)
    if (!seen.has(f)) fail(`deck folder ${f}/ has no entry in shared/decks.js`);
}

// ---- 3: local links resolve ------------------------------------------------
const LINK_RE = /(?:href|src)\s*=\s*"([^"]+)"/g;
for (const f of htmlFiles) {
  // strip <script> bodies — JS builds links from strings the regex would misread
  const html = fs.readFileSync(f, "utf8").replace(/<script[\s\S]*?<\/script>/g, "<script></script>");
  for (const [, url] of html.matchAll(LINK_RE)) {
    if (/^(https?:|\/\/|mailto:|data:|javascript:|#)/.test(url)) continue;
    const clean = url.split("#")[0].split("?")[0];
    if (!clean) continue;
    const target = path.resolve(path.dirname(f), clean);
    const ok = clean.endsWith("/")
      ? fs.existsSync(path.join(target, "index.html"))
      : fs.existsSync(target);
    if (!ok) fail(`${rel(f)}: broken link "${url}"`);
  }
}

// ---- 4: deck sanity ---------------------------------------------------------
for (const key of deckFolders) {
  const f = path.join(ROOT, key, "index.html");
  if (!fs.existsSync(f)) continue; // already reported
  const html = fs.readFileSync(f, "utf8");
  if (!html.includes("deck-stage.js")) fail(`${key}/index.html: does not load shared/deck-stage.js`);
  if (!/<section class="slide/.test(html)) fail(`${key}/index.html: no <section class="slide"> found`);
}

// ---- 5: NUL bytes / empty text files (truncation guard) ---------------------
const TEXT_EXT = new Set([".html", ".css", ".js", ".mjs", ".md", ".json", ".yml", ".yaml", ".gitignore"]);
for (const f of allFiles) {
  if (!TEXT_EXT.has(path.extname(f)) && path.basename(f) !== ".gitignore") continue;
  const buf = fs.readFileSync(f);
  if (buf.length === 0) fail(`${rel(f)}: file is empty`);
  if (buf.includes(0)) fail(`${rel(f)}: contains NUL bytes (truncated/corrupted write?)`);
}

// ---- 6: <div> balance --------------------------------------------------------
for (const f of htmlFiles) {
  const html = fs.readFileSync(f, "utf8");
  const open = (html.match(/<div\b/g) || []).length;
  const close = (html.match(/<\/div>/g) || []).length;
  if (open !== close) fail(`${rel(f)}: unbalanced <div> tags (${open} open vs ${close} close)`);
}

// ---- report ------------------------------------------------------------------
if (failures.length) {
  console.error(`FAIL — ${failures.length} problem(s):`);
  for (const m of failures) console.error("  ✗ " + m);
  process.exit(1);
}
console.log(
  `OK — ${deckFolders.size} deck(s), ${htmlFiles.length} HTML file(s), links + catalogue + integrity all green.`
);
