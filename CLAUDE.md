# Trinity Teaching Workspace — Lecture, Handout, Readings & Homework System

This repo holds **weekly teaching materials** for Dr Thomas Stephen's formal
semantics & pragmatics modules at Trinity College Dublin — **five modules** sharing
one infrastructure. Each week is authored quickly from a worked reference week.

Everything is **static HTML/CSS/JS** — no build step. Preview any file by opening it
in a browser. The site is served at **https://slides.tstephen.com**; pushing to
`main` deploys automatically (see `DEPLOY.md`).

When asked to **"start on Semantics II week 4"** or **"write Pragmatics I week 8"**,
follow the workflow below. **Always identify the module first** (it determines the
folder, catalogue, rail, and theme), read that module's reference week, then work
with the user's provided content — do not invent linguistic content or pull from the
old PDFs in `uploads/` / `pdfs/` unless explicitly asked.

---

## The hub — `index.html`

`index.html` (repo root) is the **Teaching Workspace**: a filterable catalogue of
every week of every module, linking each week's four artifacts (deck · handout ·
readings · homework). It supports term filters (Michaelmas / Hilary), per-module
filters, search, and a twin-identity toggle for dual-coded modules. It is the
lecturer's working view — students only receive direct links to week pages.

> **GOTCHA — the hub embeds its own `WEEKS` array** (mirroring the per-module meta
> files) plus an `IDENTITIES`/`DIR` map. When you change a week's status or title, or
> add/scaffold files, update **both** the module's `shared/*-meta.js` **and** the
> `WEEKS` array in `index.html`. The `DIR` map there resolves module → folder.
> `npm test` now enforces this (check 5 in `scripts/check.mjs`): drift in week
> set, title, section, reading/present flags, or identity codes fails CI — and CI
> gates deploys. Per-artifact status and `fig` strings still live only in the hub.

Artifact status in the hub: `ready` (built) · `draft` (scaffold exists) · `none`
(no file). Readings default to `ready` for every teaching week.

---

## The five modules

Every module shares the same global catalogue API (`MODULE_SECTIONS` / `WEEKS` /
`getWeek` / `MODULE`, plus `LENSES` where it uses lenses) so the rail filler reads it
unchanged. They differ in **folder, catalogue, rail, theme, accent colour, and
organising spine**:

| Module (default identity) | Code(s) | Folder | Catalogue | Rail | Theme override | Accent | Spine |
|---|---|---|---|---|---|---|---|
| Semantics I / Describing Meaning | LIU11011 / **LI7869** | `weeks-semantics1/` | `week-meta.js` | `deck-rail.js` | none (base TCD blue) | `#0569b9` | Four lenses |
| Semantics II | LIU33008 | `weeks-semantics2/` | `sem2-meta.js` | `sem2-rail.js` | `theme-teal.css` | `#136f5c` | Four lenses |
| Semantics III | LIU44010 | `weeks-semantics3/` | `sem3-meta.js` | `sem3-rail.js` | `theme-indigo.css` | `#4b3c9a` | Two arcs |
| Pragmatics I / Linguistic Pragmatics | LIU22012 / **LI7862** | `weeks-pragmatics/` | `prag-meta.js` | `prag-rail.js` | `theme-burgundy.css` | `#8a2f4a` | Four lenses (4th = *Applied*) |
| Pragmatics II | LIU44008 | `weeks-pragmatics2/` | `prag2-meta.js` | `prag2-rail.js` | `theme-rust.css` | `#b23a1e` | Three approaches |

**Dual-coded modules** (Semantics I, Pragmatics I): the same week files are taught
under an undergraduate code (default identity) **and** an MPhil code. The weeks are
shared — only the identity label and the per-identity overview/assessment docs differ.
The split lives in each catalogue's `MODULE.identities[]` and the hub's `IDENTITIES`.

**Not yet built:** Semantics II deck/handout/homework content (readings are done for
every week; week 1 has generated scaffolds). To scaffold any missing week, run
`npm run new -- <module> <week>` (see "How to build a week" step 0).

---

## Two organising spines

Most modules sort each week into **four ordered lenses** (defined in each catalogue's
`LENSES`, styled by `shared/lens.css`, accent rules subtle):

1. **Empirical** — *What data motivates this?* Judgements, contrasts, patterns to explain.
2. **Historical** — *Who developed this, and in what context?* The figures and key debates.
3. **Formal** — *What formal machinery do we need?* Sets, logic, λ-calculus, worlds, etc.
4. **Typological** — *How does it vary across languages?* (Pragmatics I relabels this **Applied** — *how does it play out in real social use?* — keeping the CSS key `typological` and using glyph `g-app`.)

Glyphs: `g-emp` (data asterisk), `g-his` (column), `g-for` (⟦⟧ brackets), `g-typ`
(globe), `g-app` (applied).

The two **final-year modules use a different spine** (still the same catalogue API):
- **Semantics III** — two **arcs** (`arc: "I"` formal tools → `arc: "II"` empirical phenomena); weeks 9–12 are student presentations. Parked Arc II topics live in `window.SEM3_PARKED`.
- **Pragmatics II** — three **approaches** (`window.APPROACHES`: Inference / Grammar / Information); weeks 9–12 are student presentations.

---

## File structure

```
index.html                      THE HUB — catalogue of all modules/weeks (see above)
templates/week/                 token-based skeletons ({{TOKEN}}s) for the four artifacts
                                (deck-lenses / deck-spine / handout-classic / handout /
                                readings / exercises). handout-classic = the house sheet
                                and what the scaffold writes; handout = the older lens one
scripts/new-week.mjs            scaffold generator — `npm run new -- <module> <week>`
scripts/check.mjs               THE test suite — `npm test` (see PLAN.md §Checks)
pattern-library/                deck.html + print.html — canonical copy of every shared
                                pattern (see Reference weeks below; not linked from the hub)
weeks-semantics1/               Semantics I / Describing Meaning (12 wks; wk 7 reading)
  figures/                      interactive lattice/event figures + figure-gallery.html
weeks-semantics2/               Semantics II (readings only so far)
weeks-semantics3/               Semantics III (wks 1–6, 8; 9–12 presentations)
weeks-pragmatics/               Pragmatics I / Linguistic Pragmatics (12 wks)
  week-02/                      also holds pragmatics-map.html + logic-in-exile-map.html
weeks-pragmatics2/              Pragmatics II (wks 1–6, 8; 9–12 presentations)
  week-NN/  deck.html  handout.html  readings.html  exercises.html
shared/                         ← all CSS/JS, referenced as ../../shared/… from each week
  tokens.css                    TCD colours, type scale, spacing tokens
  dir-a.css dir-b.css dir-c.css deck visual directions (title / chrome / callouts)
  lens.css                      the four-lens palette + divider/roadmap/stepper styles
  deck-slides.css               deck content-slide extensions (lens kick, steppers, rail)
                                + shared scaffold/overview patterns (q-banner, spine-cards,
                                chip-row, todo-box, figs-line, reads-box, park-grid)
  handout.css                   A4 handout styles for the LENS-based sheet (callouts,
                                exercise blocks, answer lines, h-band›tag, todo-box)
  handout-classic.css           THE CLASSIC SHEET — house pattern for printed handouts
                                (sec›num/body/note, defs, proc, exs, tasks, lines, rec).
                                Rules for what a sheet may contain: docs/handout-style.md
  readings.css  exercises.css   readings list + downloadable homework sheet styles
  theme-burgundy.css  theme-indigo.css  theme-rust.css  theme-teal.css   per-module accent overrides
  deck-stage.js                 the slide-deck shell (arrow keys, full-screen, print-to-PDF)
  *-meta.js                     THE WEEK CATALOGUES (one per module — see table)
  *-rail.js                     fill the deck progress rail + steppers at runtime
  handout-trees.js              mounts COMPOSE derivation trees from data-compose attrs
  compose-kit/                  the COMPOSE composition-tree engine (handout trees)
  density-rate-chart.js/.css    reusable info-density scatter (both pragmatics modules)
  _readings-data.md             canonical per-week reading sources
  tcd-crest.webp                official Trinity crest — referenced statically everywhere
docs/                           per-module course plans (markdown)
uploads/  pdfs/                 source material (last year's PDFs, handbooks) — reference only
.github/workflows/deploy.yml    push to main → VPS pulls (see DEPLOY.md)
```

**Reference weeks (copy their patterns):**
- **`pattern-library/`** — START HERE: `deck.html` (one canonical slide per shared deck pattern, rendered by the real runtime) + `print.html` (every handout/homework/readings block as three A4 cards). Copy sections straight from their source — but note the library sits one level deep (`../shared/…`), weeks two (`../../shared/…`). Opened directly; not linked from the hub.
- **`weeks-semantics1/week-03`** (Predicates & Set Theory) — the fully-worked lens-based reference. Read its `deck.html` + `handout.html` before building any lens-based week.
- **`weeks-semantics3/week-01`** and **`weeks-pragmatics2/week-01`** — references for the arc / approach spines and their themes.
- **`weeks-pragmatics/week-01`** — the PROSE STYLE reference (with `overview-li7862.html`): plain titles, fragments, no em-dashes, statements over questions. The rules live in §Conventions › House style.

Each week file is **self-contained** (its slide text lives in its own HTML). The only
shared runtime dependency is the module's `*-meta.js` → its `*-rail.js` (module section
+ week title in the deck chrome).

---

## How to build a week

### 0. Confirm the brief
- **Identify the module** → folder, `*-meta.js`, `*-rail.js`, theme (table above).
- Check the week's entry in that module's `*-meta.js` (title + `section` index into `MODULE_SECTIONS`, plus `figures`/`arc`/`approach` where used). Update it if wrong — this drives the rail. Mirror any status change into `index.html`'s `WEEKS`.
- **If the week's files don't exist yet, scaffold them:** `npm run new -- <module> <week>`
  (modules: `sem` `sem2` `sem3` `prag` `prag2`). It wires the right catalogue/rail/theme,
  pre-fills the roadmap and dividers from the meta's lens `q`/`d` (or the arc/approach
  cards), skips files that already exist, and flips the hub statuses `none`→`draft`.
  Fill the lens `q`/`d` in the meta FIRST — the scaffold inherits them.
- Ask the user for content if not given. Sort it into the four lenses (or the module's arc/approach). Ask which formal tool(s) the week introduces and which language data / historical figures to feature.

### 1. The deck — `weeks-<module>/week-NN/deck.html`
Each deck loads, in order: `deck-stage.js` → the module's `*-meta.js` → its `*-rail.js`,
plus `deck-slides.css`, `lens.css`, the module theme, and MathJax. The structure is
scaffolded: **Title → Roadmap → [Empirical divider] → … → Summary**, with a
`<!-- ▼ Add … content slides here -->` marker after each divider.

Copy a content slide from the reference week and edit it. Key slide types (all in
`weeks-semantics1/week-03`):
- **Content + callouts** — `.b-slide` › `.lens-kick` + `.b-h` + `.f-box-wrap` of `.c-box` (badges: Definition / Example / Key idea / Note). The workhorse.
- **Worked example** — `.b-steps` of `.b-step` (add `step-future` to dim a step for incremental reveal).
- **Diagram** — e.g. the Venn/membership figure (`.a-venn`).

Scaffold/overview patterns are **shared in `deck-slides.css`** — never re-define them
in a deck's `<style>` block (the old per-deck `.p2-*`/`.p3-*` copies are retired):
- **`.q-banner`** — italic serif framing question.
- **`.spine-cards`** › `.spine-card` (+`.on` for this week's corner; `.ci`/`h3`/`p` inside) — the module's arcs/approaches as a card row. Default 3-up; add `cols-2 compact` for the sem3 two-arc sizing.
- **`.chip-row`** › `.chip` — diagnostic/thread pills.
- **`.todo-box`** — hatched "content to add" placeholder (print twins: `.todo-box` in `handout.css`, `.hw-todo` in `exercises.css`).
- **`.figs-line`**, **`.reads-box`** (`.h`/`li`/`.bk`), **`.park-grid`** › `.park-card` (`h4`/`p`/`.r`).
Handout scaffolds likewise use `handout.css`'s `.h-band` › `.tag`, `.todo-box`, `.reads-plain`.

Rules:
- **Slide TEXT follows §Conventions › House style** (plain titles, fragments, no em-dashes, statements over questions) — the wk-1 pragmatics deck is the worked example.
- The content slide's coloured chrome comes from a lens class on `.b-slide`: `lens-empirical` / `lens-historical` / `lens-formal` / `lens-typological`.
- Put `<div class="lens-progress" data-lens="LENS"></div>` at the end of `.b-main` so the 4-step tracker shows position. The rail filler fills it.
- Leave `<div class="b-rail"></div>` **empty** — the rail filler fills it from `<body data-week="N">`. Never hand-write the rail.
- Dividers already have `<div class="lxd2-foot" data-lens="LENS"></div>` — also auto-filled.

### 2. The handout — `week-NN/handout.html`

> **Two handout patterns exist.** The **classic sheet** (numbered blocks, a
> definitions strip, a bare-citation margin, one block per page) is the house
> pattern, and what `npm run new` scaffolds — **read `docs/handout-style.md`
> before writing one**, with `weeks-pragmatics2/week-01/handout.html` as the
> worked reference, `shared/handout-classic.css` for styling and
> `templates/week/handout-classic.html` for the skeleton. The lens-based pattern
> below is the older one, still used by the Semantics I weeks; its template is
> `templates/week/handout.html` and its styling `shared/handout.css`.

Exercise-first: introduces tools and gets students using them. Each lens gets a
`.lens-sec`. Mix these blocks (defined in `handout.css`, all shown in the reference week):
- **`.callout`** (`callout-def/-ex/-key/-note`) — content/explanation.
- **`.ex-tool-intro` + `.ex-tasks`** — introduce a new tool, then numbered practice tasks.
- **`.ex-prog`** — same operation, increasing complexity (warm-up → build → stretch).
- **`.ex-instrn`** — standalone tasks each with their own italic instruction.
- **`.answer-space`** — ruled answer lines; set the count with `style="--lines:N"`.
- **COMPOSE tree** — `<div class="tree-frame" id="UNIQUE-ID" data-compose='{…}'></div>`; `handout-trees.js` renders it. See `#tree-formal` in the reference week.

Use `<em class="sent">…</em>` for object-language examples and `<span class="chip">…</span>`
for inline notation.

### 3. The readings & homework — `week-NN/readings.html`, `week-NN/exercises.html`
- **`readings.html`** (loads `readings.css`) — the week's reading list; canonical sources in `shared/_readings-data.md`.
- **`exercises.html`** (loads `exercises.css`) — the downloadable homework sheet (the hub labels this "Homework"). Both open print-ready; students use Print → Save as PDF.

### 4. Maths
Decks and handouts load MathJax. Write `\( … \)` inline, `\[ … \]` display. The macro
`\sem{x}` renders denotation brackets ⟦x⟧.

### 5. Verify
Open the deck (or handout) in a browser. Step a few slides; confirm the rail/steppers
fill, MathJax typesets, and any COMPOSE tree mounts. Check the hub still shows the
right status badges.

### 6. Deploy
Commit and push to `main`. GitHub Actions updates the server automatically — nothing
to build or restart. Hard-refresh https://slides.tstephen.com to confirm.

---

## Conventions / gotchas

### House style for slide & document prose (Thomas's standing rules, est. 2026-09 on prag wk 1)

Apply to ALL new slide, handout, homework and overview text, every module. The
worked example of every rule is **`weeks-pragmatics/week-01/deck.html` +
`weeks-pragmatics/overview-li7862.html`** (post-restyle) — read them before
writing slide prose.

For printed handouts these rules are joined by a second set covering what a
sheet may contain at all — definitions strip, bare-citation margin, no
theory-architecture exercises, no previewing later weeks. Those live in
**`docs/handout-style.md`** (est. 2026-09 on prag2 wk 1), worked example
`weeks-pragmatics2/week-01/handout.html`.

- **Titles name things.** Plain school/topic/thing names: "Logical Positivism",
  "Ordinary Language Philosophy", "The term project", "Speech Acts" with a bare
  week `wktag`. No slogans ("Ordinary language strikes back", "Saying is
  doing") and no numeral-slogan forms "N X, one Y" / "one X, N Y" ("Four
  strands, one field") — the long-standing veto.
- **No em-dashes in visible text.** Use colons, semicolons, commas or
  parentheses. En-dash date/week ranges ("1848 – 1925", "Weeks 9–12") may stay.
  Avoid prose hyphens where a rewording exists; lexical/technical hyphens
  (Neo-Gricean, non-natural) stay.
- **No contrastive "X, not Y" / "not X but Y" framings.** Assert the positive
  directly ("Context is a shared, constantly updated object", never "not a
  backdrop but…").
- **Fragments over flow.** Short sentences. Clipped. "Semantics: what the words
  encode. Pragmatics: what use and context add." Cut connective filler and
  LLM-ish cadence.
- **Prefer statements and imperatives to questions.** "Decide: true or false",
  "Find what both versions convey". Questions survive only inside
  object-language data ("Are you coming to the party?") and, sparingly, as a
  module-framing title ("What is pragmatic meaning?"). NB the meta lens `q`
  fields are framing questions by design and stay as they are.
- **No long scene-setting hooks.** Open near the content (the wk-1 Grundy
  footpath opener was cut on this rule). When a hook is cut, sweep the deck for
  dangling references to it.
- **Portraits: real photos when legitimately available** (personal or
  university pages; note the source); the `.npf` text block is the fallback.
  Verify the figure is the right person (wk 1 briefly shipped Michael C. Frank,
  Stanford, for Michael Franke, Tübingen).
- **Housekeeping block of a week-1-style deck:** How the module works → The
  assessment → Learning outcomes → This week's readings (shared `.reads-box`)
  → Week by week → Wrap-up, all registered in the deck's rail/TOC.
- **Print documents (overviews, handouts):** keep callouts plain — neutralise
  the coloured def/key/note accents with file-local custom-property overrides
  (see `overview-li7862.html`); ink/grey plus the module accent only.
- **LI7862 module facts** (hard-coded in several files — keep consistent):
  selected readings from across the literature, no set textbook; the platform
  is **Blackboard** (never "Learn"); assessment is one research project,
  **limit 3,500 words**, due **Monday 14 December 2026**, submitted via
  Blackboard; weekly exercises are formative, carry no marks, model answers
  follow; lectures Mondays 10:00 to 12:00 in PX113; office hours Thursdays
  14:00 to 15:00; contact tmurrays@tcd.ie.

### Wiring gotchas
- **Module = folder + catalogue + rail + theme.** Get all four right (table above). The most common mistake is wiring a week to the wrong `*-meta.js`/`*-rail.js`/theme.
- **`<body data-week="N">` on every deck** — the rail reads it. Skeletons already set it.
- **Keep the hub in sync.** Any status/title change must land in both the `*-meta.js` and `index.html`'s `WEEKS` array.
- **Crest is a static `<img src="../../sh