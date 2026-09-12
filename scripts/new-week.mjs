#!/usr/bin/env node
/* ============================================================
   scripts/new-week.mjs — scaffold a week from templates/week/.

   Usage:  node scripts/new-week.mjs <module> <week> [--force]
           npm run new -- <module> <week>
   Modules: sem | sem2 | sem3 | prag | prag2   (hub keys)

   What it does:
   · resolves the module → folder / catalogue / rail / theme
     (the CLAUDE.md module table, encoded below)
   · reads the week's entry in the module's shared/*-meta.js
     (title · section · lenses q/d · figures · arc/approach)
   · writes weeks-<module>/week-NN/{deck,handout,readings,
     exercises}.html from templates/week/, pre-filled
   · never overwrites: existing files are skipped (--force
     overwrites them)
   · flips the week's artifact statuses 'none' → 'draft' in the
     hub's WEEKS array (index.html) for the files it wrote
   Then: open the deck in a browser, run `npm test`, fill the
   todo-boxes. Substitution is split/join (never String.replace —
   replacement text may contain $-sequences).
   ============================================================ */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/* ---- the module table (mirrors CLAUDE.md) --------------------------------- */
const MODULES = {
  sem: {
    dir: "weeks-semantics1", meta: "week-meta.js", rail: "deck-rail.js", theme: null,
    code: "LI7869", courseLine: "LI7869 · Formal Semantics", codeLinePrint: "LI7869 · Describing Meaning",
    termDeck: "Semester 2 · Hilary", termPrint: "Semester 2, Hilary",
    lecturer: "Dr. Thomas Stephen", spine: "lenses", exKind: "Homework",
    watermark: '<div class="a-watermark">⟦⟧</div>',
    thumb: { bg: "#07284a", panel: "#0a3564", line: "#c1daee", text: "#82b4dc" },
    pthumb: { bg: "#e6f0f9", accent: "#0569b9", line: "#c1daee" },
  },
  sem2: {
    dir: "weeks-semantics2", meta: "sem2-meta.js", rail: "sem2-rail.js", theme: "theme-teal.css",
    code: "LIU33008", courseLine: "LIU33008 · Semantics II", codeLinePrint: "LIU33008 · Semantics II",
    termDeck: "Semester 1 · Michaelmas", termPrint: "Semester 1, Michaelmas",
    lecturer: "Dr. Thomas Stephen", spine: "lenses", exKind: "Homework",
    watermark: '<div class="a-watermark">⟦⟧</div>',
    thumb: { bg: "#0f352d", panel: "#14483d", line: "#c4dbd6", text: "#89b7ae" },
    pthumb: { bg: "#e3efec", accent: "#136f5c", line: "#a7cdc2" },
  },
  sem3: {
    dir: "weeks-semantics3", meta: "sem3-meta.js", rail: "sem3-rail.js", theme: "theme-indigo.css",
    code: "LIU44010", courseLine: "LIU44010 · Semantics III", codeLinePrint: "LIU44010 · Semantics III",
    termDeck: "Semester 2 · Hilary", termPrint: "Semester 2, Hilary",
    lecturer: "Thomas Stephen", spine: "arcs", exKind: "Seminar tasks",
    watermark: '<div class="a-watermark" style="font-style:italic">⟦⟧</div>',
    arcs: {
      I:  { ci: "Arc I",  h: "Formal Tools",        p: "What an attitude relates an agent to, and how a clause composes with the verb." },
      II: { ci: "Arc II", h: "Empirical Phenomena", p: "The grammar of embedding run through the major puzzles." },
    },
    cardsClass: " cols-2 compact",
    thumb: { bg: "#2a2056", panel: "#382a72", line: "#c8c2e3", text: "#9389c8" },
    pthumb: { bg: "#eceaf6", accent: "#4b3c9a", line: "#c8c2e3" },
  },
  prag: {
    dir: "weeks-pragmatics", meta: "prag-meta.js", rail: "prag-rail.js", theme: "theme-burgundy.css",
    code: "LI7862", courseLine: "LI7862 · Linguistic Pragmatics", codeLinePrint: "LI7862 · Linguistic Pragmatics",
    termDeck: "Semester 1 · Michaelmas", termPrint: "Semester 1, Michaelmas",
    lecturer: "Dr. Thomas Stephen", spine: "lenses", exKind: "Homework",
    watermark: '<div class="a-watermark" style="font-style:italic">¶</div>',
    thumb: { bg: "#451726", panel: "#611f34", line: "#ecc7d3", text: "#c47f97" },
    pthumb: { bg: "#f5e9ed", accent: "#8a2f4a", line: "#ddb8c4" },
  },
  prag2: {
    dir: "weeks-pragmatics2", meta: "prag2-meta.js", rail: "prag2-rail.js", theme: "theme-rust.css",
    code: "LIU44008", courseLine: "LIU44008 · Pragmatics II", codeLinePrint: "LIU44008 · Pragmatics II",
    termDeck: "Semester 1 · Michaelmas", termPrint: "Semester 1, Michaelmas",
    lecturer: "Thomas Stephen", spine: "approaches", exKind: "Seminar tasks",
    watermark: '<div class="a-watermark" style="font-style:italic">¶</div>',
    cardsClass: "",
    thumb: { bg: "#5a1c0e", panel: "#7a2410", line: "#efcab9", text: "#d99878" },
    pthumb: { bg: "#f8ece7", accent: "#b23a1e", line: "#eac4b5" },
  },
};

/* ---- helpers --------------------------------------------------------------- */
const sub = (str, token, value) => str.split("{{" + token + "}}").join(value);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const die = (msg) => { console.error("new-week: " + msg); process.exit(1); };

function loadCatalogue(file) {
  const src = fs.readFileSync(path.join(ROOT, "shared", file), "utf8");
  const window = {};
  vm.runInNewContext(src, { window });
  return window;
}

/* ---- args ------------------------------------------------------------------ */
const args = process.argv.slice(2).filter((a) => a !== "--force");
const force = process.argv.includes("--force");
const [mkey, weekArg] = args;
if (!mkey || !MODULES[mkey] || !weekArg || !/^\d{1,2}$/.test(weekArg))
  die("usage: node scripts/new-week.mjs <sem|sem2|sem3|prag|prag2> <week 1-12> [--force]");
const M = MODULES[mkey];
const no = Number(weekArg);

/* ---- week meta ------------------------------------------------------------- */
const cat = loadCatalogue(M.meta);
const wk = (cat.WEEKS || []).find((w) => w.no === no);
if (!wk) die(`week ${no} not found in shared/${M.meta}`);
if ((wk.reading || wk.present) && !force)
  die(`week ${no} is a ${wk.reading ? "reading" : "presentations"} week — nothing to scaffold (--force to override)`);
const sectionName = (cat.MODULE_SECTIONS || [])[wk.section] || "";
const title = esc(wk.title);
const figs = (wk.figures || []).map(esc).join(" · ");

/* ---- common tokens --------------------------------------------------------- */
const themeLink = M.theme ? `<link rel="stylesheet" href="../../shared/${M.theme}" />` : "";
const common = {
  CODE: M.code, COURSE_LINE: M.courseLine, CODE_LINE_PRINT: M.codeLinePrint,
  WEEK_NO: String(no), TITLE: title, LECTURER: M.lecturer,
  TERM_DECK: M.termDeck, TERM_PRINT: M.termPrint, THEME_LINK: themeLink,
  WATERMARK_DIV: M.watermark, META_JS: M.meta, RAIL_JS: M.rail,
  SECTION: esc(sectionName), EX_KIND: M.exKind,
  THUMB_BG: M.thumb.bg, THUMB_PANEL: M.thumb.panel, THUMB_LINE: M.thumb.line, THUMB_TEXT: M.thumb.text,
  PTHUMB_BG: M.pthumb.bg, PTHUMB_ACCENT: M.pthumb.accent, PTHUMB_LINE: M.pthumb.line,
};

/* ---- deck-specific tokens --------------------------------------------------- */
let deckTemplate, deckTokens = {};
if (M.spine === "lenses") {
  deckTemplate = "deck-lenses.html";
  (cat.LENSES || []).forEach((lens, i) => {
    const n = i + 1;
    const wl = (wk.lenses || {})[lens.key] || { q: "", d: "" };
    deckTokens["L" + n + "_KEY"] = lens.key;
    deckTokens["L" + n + "_LABEL"] = lens.label;
    deckTokens["L" + n + "_GLYPH"] = lens.glyph;
    deckTokens["L" + n + "_Q"] = esc(wl.q || lens.prompt);
    deckTokens["L" + n + "_D"] = esc(wl.d || "Framing to add — fill q/d in shared/" + M.meta + ".");
  });
} else {
  deckTemplate = "deck-spine.html";
  let cards = [], kick = esc(sectionName);
  if (M.spine === "arcs") {
    const on = wk.arc || null;
    cards = Object.entries(M.arcs).map(([k, a]) =>
      `        <div class="spine-card${k === on ? " on" : ""}"><div class="ci">${a.ci}</div><h3>${a.h}</h3><p>${a.p}</p></div>`);
    if (on) kick = esc(sectionName) + " · " + M.arcs[on].ci + " — " + M.arcs[on].h;
  } else {
    const on = wk.approach || null;
    cards = (cat.APPROACHES || []).map((a, i) =>
      `        <div class="spine-card${a.key === on ? " on" : ""}"><div class="ci">Approach ${i + 1}</div><h3>${esc(a.label)}</h3><p>${esc(a.gloss)}</p></div>`);
  }
  deckTokens.KICK_LINE = kick;
  deckTokens.SPINE_CARDS = `<div class="spine-cards${M.cardsClass || ""}">\n${cards.join("\n")}\n      </div>`;
  deckTokens.FIGS_LINE = figs ? `<div class="figs-line"><b>Figures:</b> ${figs}</div>` : "";
}

/* ---- print-specific tokens --------------------------------------------------- */
let bandTags = `<span class="tag">${esc(sectionName)}</span>`;
if (M.spine === "arcs" && wk.arc) bandTags = `<span class="tag">${M.arcs[wk.arc].ci} — ${M.arcs[wk.arc].h}</span>\n    ` + bandTags;
if (M.spine === "approaches" && wk.approach) {
  const a = (cat.APPROACHES || []).find((x) => x.key === wk.approach);
  if (a) bandTags = `<span class="tag">${esc(a.label)}</span>\n    ` + bandTags;
}
const printTokens = {
  BAND_TAGS: bandTags,
  READS_ITEMS: `<li>Readings to add — see <span class="bk">shared/_readings-data.md</span> and the week's readings.html.</li>`,
  FIGS_SPAN: figs ? `<span class="figs"><b>Figures:</b> ${figs}</span>` : "",
};

/* ---- render + write --------------------------------------------------------- */
const nn = String(no).padStart(2, "0");
const outDir = path.join(ROOT, M.dir, "week-" + nn);
fs.mkdirSync(outDir, { recursive: true });

function render(templateFile, tokens) {
  let out = fs.readFileSync(path.join(ROOT, "templates", "week", templateFile), "utf8");
  for (const [k, v] of Object.entries({ ...common, ...tokens })) out = sub(out, k, v);
  const leftover = out.match(/\{\{[A-Z0-9_]+\}\}/g);
  if (leftover) die(`${templateFile}: unreplaced tokens ${[...new Set(leftover)].join(", ")}`);
  return out;
}

const PLAN = [
  { out: "deck.html", template: deckTemplate, tokens: deckTokens, hubKey: "deck" },
  { out: "handout.html", template: "handout.html", tokens: printTokens, hubKey: "handout" },
  { out: "readings.html", template: "readings.html", tokens: printTokens, hubKey: "rd" },
  { out: "exercises.html", template: "exercises.html", tokens: printTokens, hubKey: "ex" },
];

const written = [], skipped = [];
for (const job of PLAN) {
  const dest = path.join(outDir, job.out);
  if (fs.existsSync(dest) && !force) { skipped.push(job.out); continue; }
  fs.writeFileSync(dest, render(job.template, job.tokens));
  written.push(job);
}

/* ---- hub status flip ('none' → 'draft' for what we wrote) -------------------- */
let hubNote = "hub: no status changes needed";
if (written.length) {
  const hubPath = path.join(ROOT, "index.html");
  const hub = fs.readFileSync(hubPath, "utf8");
  const lines = hub.split("\n");
  const needle = `m:'${mkey}', no:${no},`;
  const i = lines.findIndex((l) => l.includes(needle));
  if (i === -1) {
    hubNote = `hub: WARNING — no WEEKS line matching "${needle}"; update index.html by hand`;
  } else {
    let line = lines[i], flipped = [];
    for (const job of written) {
      const from = `${job.hubKey}:'none'`, to = `${job.hubKey}:'draft'`;
      if (line.includes(from)) { line = line.split(from).join(to); flipped.push(job.hubKey); }
    }
    if (flipped.length) {
      lines[i] = line;
      fs.writeFileSync(hubPath, lines.join("\n"));
      hubNote = `hub: flipped ${flipped.join(", ")} → 'draft' on the ${mkey} week-${no} line`;
    } else {
      hubNote = "hub: statuses already set (nothing was 'none')";
    }
  }
}

/* ---- report ------------------------------------------------------------------ */
console.log(`new-week: ${M.dir}/week-${nn} — "${wk.title}" (${sectionName})`);
for (const j of written) console.log(`  + ${j.out}`);
for (const s of skipped) console.log(`  · ${s} exists — skipped (--force to overwrite)`);
console.log(`  ${hubNote}`);
console.log(`Next: open ${M.dir}/week-${nn}/deck.html in a browser · fill the todo-boxes · npm test`);
