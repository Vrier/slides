# PLAN.md — slides.tstephen.com (Trinity Teaching Workspace)

Plan of record. Repo: `github.com/Vrier/slides`. This file is the only memory
between sessions — read it first, append to §Session log every session, commit
it every session.

## What this repo is

The **Trinity teaching workspace** — five formal semantics & pragmatics
modules (weekly deck · handout · readings · homework), served at
**https://slides.tstephen.com**. `CLAUDE.md` is the authoring guide: modules,
catalogues, rails, themes, reference weeks, per-artifact recipes. Read it
before building any week.

History note: this repo briefly hosted a research-talks scaffold (hub +
`templates/deck/` + demo deck, commits up to 2026-07-11); Thomas repointed it
to host the teaching workspace instead. The talks scaffold lives in git
history (`git log` around "Bootstrap slides workspace") and can be resurrected
when a home for research talks is decided (still open — see W-open below).

## Infrastructure (standard static recipe — never any other path)

- Serve: Caddy on the Hetzner VPS (167.233.233.109), block
  `slides.tstephen.com { root * /srv/slides, file_server, encode gzip }`.
- Deploy: push to `main` → GitHub Actions runs `npm test` → SSHes as
  `compose@167.233.233.109` → `git -C /srv/slides fetch origin main && git -C
  /srv/slides reset --hard origin/main`. No restarts. CI red = no deploy.
- `DEPLOY_SSH_KEY` Actions secret: base64 of the `gha-slides` key
  (provisioned & proven green 2026-07-11). Workflow tries `base64 -d` first,
  falls back to raw.
- Repo deploy key `.deploy-key`(+`.pub`) in the repo root, gitignored, unique
  to this repo, added on GitHub WITH write access. Cowork pushes with:
  `GIT_SSH_COMMAND="ssh -i .deploy-key -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new" git push origin HEAD:main`
- One-time setup recipe: `DEPLOY.md` (already done for this repo).

## Checks — `npm test`

`node scripts/check.mjs`, no dependencies: every local `href`/`src` in every
HTML file resolves; no NUL bytes / empty text files (host-tool truncation
guard); `<div>` balance (legacy imbalances frozen in `DIV_BASELINE` — new
files must balance, changes to legacy counts fail); every `deck.html` loads
`deck-stage.js` and has ≥1 slide; the hub's `WEEKS`/`IDENTITIES` mirror the
five `shared/*-meta.js` catalogues (week set · title · section name ·
reading/present flags · identity codes+names — the CLAUDE.md double-entry
gotcha, now CI-enforced). Add a check for every feature you ship.

## Work items

- [x] **T1 — Import**: teaching workspace (5 modules, hub, shared, docs,
      pdfs/uploads — 248 files) replaces the talks scaffold; docs repointed
      teaching.tstephen.com → slides.tstephen.com; checks adapted.
- [ ] **T2 — Ongoing weekly authoring** per CLAUDE.md (e.g. Semantics II
      weeks are readings-only; `sem2-rail.js` doesn't exist yet).
- [ ] **W-open — Research talks home**: undecided. The scaffold (hub keyed on
      `shared/decks.js`, `templates/deck/`, `talk-rail.js`, `examples.css`,
      demo deck) is in git history, ready to transplant to a new repo/
      subdomain when Thomas picks one.

## Working discipline

Start green (`npm test` before touching anything) · stay in scope · end green
· update §Session log · commit (docs in the same commit as the code they
describe) · push · verify live with curl after each deploy. Never push red.
If repo and docs disagree, the repo wins — verify, then fix the doc.
Hub gotcha (from CLAUDE.md): week status/title changes must update BOTH the
module's `shared/*-meta.js` AND the `WEEKS` array in `index.html`.

Cowork gotchas: edits to EXISTING files go through the sandbox shell (python
heredocs with exact-anchor asserts); Write tool for NEW files only. Absolute
paths every bash call. Template-token substitution by split/join, never
`String.replace` (content contains `$`-sequences). The mounted folder can't
hold `.git` — keep the git database in the sandbox
(`GIT_DIR=/tmp/slides.git GIT_WORK_TREE=<mounted repo>`) or clone fresh from
GitHub (the repo is the source of truth).

## Session log

*(append one entry per session: date · what shipped · surprises/decisions ·
what the next session must know)*

### 2026-07-11 — bootstrap (research-talks scaffold, since superseded)

- Shipped W1–W4 of the original talks plan: vendored deck system, hub +
  `decks.js`, `templates/deck/`, demo deck, checks, deploy pipeline; site
  live and verified. Full details in this file's history at that commit.
- **Deploy debugging (worth keeping):** first deploys failed with Permission
  denied — the `DEPLOY_SSH_KEY` value was never actually authorized for
  compose@VPS, then a regenerated key's halves drifted (pubkey installed ≠
  private key in the secret). Fixed by generating the pair ON the VPS in one
  sitting (`gha-slides`, SHA256:j7oTNRHf…) and pasting its base64 into the
  secret immediately. Diagnosis trick: temporarily have the workflow push its
  `ssh -v` transcript to a ci-debug branch (Actions logs aren't API-readable
  without auth). Scaffolding removed after; the key transited chat once —
  rotate at leisure.

### 2026-07-11 (later) — pivot: this repo now hosts the teaching workspace

- **Shipped:** replaced repo content with the Trinity teaching export
  (zip → 248 files, verified by checksum against the source). Docs repointed
  to slides.tstephen.com; kept the proven deploy workflow (`npm test` +
  `/srv/slides` pull) and the same deploy key/secret — zero server-side
  changes needed. `scripts/check.mjs` rewritten to generic integrity checks
  (links / NUL / div balance / deck sanity); deck-catalogue checks dropped
  (they were talks-specific).
- **Surprises:** 14 legacy files have unbalanced `<div>`s (render fine —
  browsers auto-close); frozen as `DIV_BASELINE` in check.mjs rather than
  editing working teaching materials.
- **Decisions:** research-talks hosting deliberately left open (W-open); the
  talks scaffold is recoverable from git history. The separate `Vrier/
  teaching` repo prepared earlier this session was never created on GitHub —
  abandoned, local copy deleted.
- **Mobile pass:** decks were already touch-ready (deck-stage: tap-to-
  advance, auto-scale, rail hidden <640px). Added a screen-only mobile
  block to `shared/handout.css` (the fixed 210mm A4 card now reflows to
  the viewport ≤840px — covers handouts, readings AND homework, print
  untouched; lens roadmap 4→2 cols, trees scroll horizontally) and made
  the hub's module filter bar wrap ≤560px.
- **Pragmatics I week 1 deck shipped** (34 slides, style ported from the
  sem1 wk1 bespoke deck: mrail TOC, Q/A pairs, lineage, facts/weeks/recap).
  Content per Thomas: hook = Grundy ch.1 footpath exchange; Empirical =
  six phenomenon intuitions keyed to this year's blocks (wks 2–8);
  Historical = genealogy (positivism → OLP → Grice + three side threads),
  with Thomas's diagram embedded (week-01/pragmatics-genealogy.svg);
  Formal = the four programmes = wks 9–12 + 'one datum four ways';
  Applied = in-the-wild + project. prag-meta wk1 lenses filled; hub deck
  status ready; exercises.html semester fixed to 1 (LI7862 = Sem 1;
  undergrad sister LIU22012 = Sem 2, content to be copied over later).
  Housekeeping details carried from last year's L1 — CONFIRM with Thomas
  (times, office hours, due date left as 'see Learn'). Handout still
  pending for wk1 (deliberately out of scope this pass).
- **Wk1 deck expanded to 41 slides:** Historical gains foundations
  (Frege·Russell·early-Wittgenstein, Commons photos), a Tractatus slide,
  and a Vienna Circle slide (Schlick·Neurath photos, Ayer plate); Formal
  gains one slide per programme (NG, RT, RSA incl. Bayes formula,
  Grammaticalism). Thomas pasted portraits for Carnap/Grice/Strawson/
  Austin as INLINE chat images — not saved as files, so those figures
  remain name-plates; if he re-attaches them as file uploads, drop into
  weeks-pragmatics/week-01/images/ and swap the .npf plates for <img>
  portraits (pattern: sem1 wk1 images/pearse.jpg). Commons has no usable
  photos for Horn/Levinson/Sperber/Wilson/Frank/Goodman/Chierchia/Fox
  ("Danny Fox.jpg" is a footballer).
- **Wk1 portraits self-hosted:** week-01/images/ now holds 14 portraits
  (frege, russell, wittgenstein×2, schlick, neurath, carnap, ayer,
  austin, strawson, grice, sperber, frank, goodman — sourced via
  Wikipedia/Commons APIs; austin/strawson/grice are en-wiki fair-use
  files matching Thomas's photos, strawson only 120px so upscaled-soft).
  All hotlinks removed. Still name-plates (no usable photo found):
  Wilson, Horn, Levinson, Chierchia, Fox/Spector.
- **More portraits:** wilson.jpg (Commons 'Deirdre Wilson Books.jpg' — the
  photo Thomas pasted) and spector.jpg (Institut Nicod). Fox card removed
  from the Grammaticalism slide at Thomas's request; Spector has his own
  card. Horn & Levinson photos NOT found online (MPI/Yale pages are
  JS-rendered) — still plates; Thomas has photos, needs to send as FILE
  attachments (pasted-inline images never reach disk).
- **Horn + Levinson portraits found** (Yale ling profile asset directly;
  MPI portrait via Wayback Machine — double-encode %20 as %2520 in the
  nested URL to stop web.archive.org 400s; useful trick). Every figure
  card in the wk1 deck now has a real photo except Chierchia (plate).
- **Style rule (Thomas, applies to ALL future decks):** no numeral-slogan
  headings ('Four strands, one field', 'One datum, four ways') — rule now
  codified in CLAUDE.md §Conventions. Wk1 headings rewritten; each
  programme slide gained a typeset core formula panel (Horn-scale schema,
  Relevance ratio, RSA listener/speaker pair, EXH operator).
- **Next session must know:** this is now the teaching repo — follow
  CLAUDE.md for authoring. Clone from GitHub; `npm test` before touching
  anything.

### 2026-09-12 — templates groundwork: sync check + shared scaffold patterns

- **Plan of record (agreed with Thomas):** four streamlining pieces, in order:
  (1) hub↔catalogue CI check → (2) shared scaffold CSS + retrofit →
  (3) templates/ + scripts/new-week.mjs generator (incl. sem2-rail.js + teal
  theme) → (4) slide pattern library page. Retrofit-as-we-go approved.
- **Shipped (1):** check 5 in `scripts/check.mjs` — the hub's `WEEKS`/
  `IDENTITIES` must mirror the five `shared/*-meta.js` catalogues (week set ·
  title · section name · reading/present flags · identity codes+names).
  CLAUDE.md gotcha block + this file's §Checks updated.
- **Shipped (2):** per-deck `.p3-*`/`.p2-*` scaffold styles promoted to shared —
  `deck-slides.css` gains q-banner, spine-cards (+`.cols-2 .compact`),
  chip-row›chip, todo-box, figs-line, reads-box, park-grid/park-card;
  `handout.css` gains print twins h-band›tag, todo-box, reads-plain; homework
  scaffolds reuse the existing `.hw-todo`. All 42 sem3+prag2 scaffold files
  retrofitted (two parallel subagents); grep-verified zero `p2-`/`p3-` remain.
  Deliberate deltas: deck todo-box unified to 26px; homework todo adopts the
  `.hw-todo` look. CLAUDE.md §1 recipe now lists the shared patterns.
- **Environment surprise:** the session's sandbox shell never mounted its
  shares ("no Plan9 drive shares mounted") — npm test and git could not run
  from Cowork. All edits made via host file tools, verified by grep +
  desk-check. Chrome extension refuses file:// URLs, so no browser check
  either. **Commits + npm test left for Thomas / a healthy session.**
- `.deploy-key` is absent from this clone (gitignored ⇒ not in fresh clones) —
  restore it, or mint a new write-access deploy key, if Cowork should push.
- **Shipped (3):** `templates/week/` (deck-lenses · deck-spine · handout ·
  readings · exercises — {{TOKEN}} skeletons, placed two dirs deep so their
  `../../shared/` links resolve) + `scripts/new-week.mjs` (`npm run new --
  <module> <week>`): resolves the module table, reads the week from its
  `*-meta.js` via node:vm, pre-fills roadmap/dividers from lens q/d (or
  arc/approach spine-cards), skips existing files (--force overrides),
  flips hub artifact statuses 'none'→'draft' (split/join, single line),
  refuses reading/presentation weeks. New `shared/sem2-rail.js` (twin of
  deck-rail.js) + `shared/theme-teal.css` (#136f5c ramp; lens palette
  re-tuned — Empirical moved off sage onto steel blue to clear the brand
  green). check.mjs: check 6 (no unreplaced {{TOKEN}}s outside templates/)
  + link check skips {{…}} URLs. package.json gains "new". CLAUDE.md:
  module table row for sem2 completed, scaffold step added to §0, file
  structure updated.
- **Workout:** sem2 week-01 deck/handout/exercises scaffolded (hand-applied
  from the templates — the shell VM was down, so new-week.mjs itself has
  NOT yet executed; its first real run should be `npm run new -- sem2 2`
  and diff-eyeballed against week-01). Hub sem2 wk1 statuses → draft.
- **Shipped (4):** `pattern-library/` — `deck.html` (a real deck-stage deck:
  one canonical slide per shared pattern — title, roadmap, divider, callouts,
  worked steps, the piece-2 scaffold patterns, summary — plus a field-guide
  slide signposting the prag-wk1 bespoke vocabulary, which stays deliberately
  un-promoted for now) + `print.html` (three A4 cards: handout blocks incl. a
  live COMPOSE tree, homework blocks, readings blocks). Chrome divs are left
  empty by design (no rail JS loaded — the library shows what you TYPE);
  `.pl-*` classes are library-only annotations. Both files sit ONE level deep
  (`../shared/…`) — copying into a week needs `../../shared/…`; flagged in
  both file headers and CLAUDE.md. Docs updated (reference-weeks: "start
  here"; file structure).
- **Next:** npm test + first `npm run new -- sem2 2` + commit + push (shell
  VM permitting — see Environment surprise above), verify live. All four
  template-streamlining pieces are now written; everything is uncommitted
  and desk-verified only.

### 2026-09-12 (later) — Pragmatics I week 1: handout + homework authored

- **Scope (agreed with Thomas):** the wk-1 deck (~40 slides) and readings were
  already ready and untouched; the missing artifacts were the handout (no file)
  and the homework (scaffold only). Content derived strictly from the deck's own
  material; homework is formative (not assessed), default due line kept.
- **Authored then WITHDRAWN:** `weeks-pragmatics/week-01/handout.html` — a full
  wk-02-modelled handout was written, then Thomas decided a handout is not
  appropriate for week 1. The file is still on disk (shell VM down — Cowork
  could not delete it): **delete it before committing**, or keep it aside if
  wanted later. Hub handout status reverted to 'none'.
- **Shipped:** wk-01 `exercises.html` — four `.hw-todo` placeholders replaced
  with real lens problems (presupposition/accommodation/indirectness data ·
  Grice + three threads · semantics/pragmatics boundary + slogan matching ·
  field-collection task doubling as a project datum). Band now reads
  "formative · not assessed"; per-problem marks are "—".
- **Hub:** prag wk 1 ex draft→ready; handout stays 'none' (see withdrawal
  above). Statuses live only in the hub; meta title/section untouched, so
  check 5 unaffected. Deck assets desk-verified: pragmatics-genealogy.svg +
  images/ portraits present (Chierchia is a deliberate no-photo block).
- **Shipped (same session, later):** `weeks-pragmatics/overview-li7862.html` —
  the LI7862 module overview (HTML, print-clean via handout.css + mono print
  override; ONE level deep ⇒ `../shared/…`). Sections: description + two-arc
  narrative, 5 learning outcomes (DRAFTED from repo content — Thomas to review
  before deploy), 12-week schedule table (topics link to each week's
  readings.html — wk 3/8/12 existence spot-checked), assessment (project
  write-up = the 3,500–4,000-word assignment, 100%, **due Monday 14 December
  2026**, Blackboard; weekly exercises formative), logistics (Mon 10:00–12:00
  · PX113; OH Thu 14:00–15:00; tmurrays@tcd.ie; Grundy 3rd ed.), policies
  pointer to the CLCS handbook. Wiring: meta `MODULE.identities` li7862
  overview status none→ready; hub `modToolsHTML` now renders a live Overview
  link when an identity has `ov:'ready'` (new `a.mt-ov.ready` CSS; li7862 got
  the flag) — check 5 only compares identity code+name, so the extra field is
  safe. NOTE for wk-12 row: figures shown as Chierchia · Fox · Spector (from
  the wk-1 deck; meta has none). Redrafted same session per Thomas: clipped
  fragment style throughout, and NO set textbook — "selected readings from
  across the literature" replaces Grundy. Style rules now standing for
  overview-adjacent prose: no em/en dashes, no hyphens, no "not X but Y".
- **Deck additions (same session, Thomas's request):** wk-1 deck gains two
  Housekeeping slides carrying the overview info — "The assessment" (21a,
  data-sec `assess`: format/weight/deadline facts + choose·collect·analyse
  hnote) and "Learning outcomes" (21b, data-sec `outc`: five erows). Bespoke
  mrail TITLES/GROUPS extended (Housekeeping keys now mod2·assess·outc·wk·sum).
  Housekeeping slide 21 aligned with the overview: PX113, tmurrays@tcd.ie,
  Selected readings (Grundy line REMOVED), deadline Mon 14 Dec 2026,
  Learn→Blackboard. Grammaticalism slide: `.npf` text block replaced by
  `images/chierchia.jpg` — **the image file does NOT exist yet** (VM down, no
  binary copy): Thomas must save his supplied photo to
  `weeks-pragmatics/week-01/images/chierchia.jpg` BEFORE `npm test`
  (check 1 fails on the missing src until then). Edits desk-verified
  div-balanced.
- **Correction (Thomas):** the wk-1 RSA slides wrongly featured Michael C.
  Frank (Stanford); the module's figure is Michael FRANKE (Universität
  Tübingen — affiliation verified via uni-tuebingen.de; meta wk 11 already
  said Franke). Deck slide 17c card is now Franke (`images/franke.jpg`, from
  his homepage's wald.JPG — Thomas downloads it, command supplied) and the
  four-programmes slide says "Franke & Goodman". `images/frank.jpg` is now
  ORPHANED (harmless to checks; delete at will). Environment notes: his
  machine lacks npm/Node — CI (deploy.yml runs npm test before SSH) is the
  test gate for now; also the chat-uploads dir is session-virtual, so binary
  images must reach the repo via user download/copy, not Cowork file tools.
- **Also added:** wk-1 deck slide 21c "This week's readings" (data-sec
  `reads`, shared `.reads-box` pattern ×3: textbook/classical/contemporary)
  — all five items and one-line notes taken from the week's readings.html
  (NB the earlier PDF-harvest manifest covered only 3 of the 5; Grice 1957
  already has an open PDF link in readings.html, Carston 2008 is
  library-access). mrail Housekeeping keys now
  mod2·assess·outc·reads·wk·sum.
- **Deck restyle (Thomas's direction, applied to wk-1 deck):** (1) Grundy
  footpath hook DELETED (both "An exchange" slides; data-sec `how` gone) and
  the Tractatus slide DELETED (`tlp` gone) — mrail TITLES/GROUPS updated;
  screen-labels now have gaps (cosmetic). (2) "What is pragmatic meaning?"
  slide: new lead ("…literal *semantic* content…"); "The boundary" row
  replaced by four interface rows (Grammar/Cognition/Society/Politics —
  content from the module's own material; matches the original brief's
  applied line). (3) Titles now plain school/topic names: Logical
  Positivism, Ordinary Language Philosophy, The Vienna Circle, Grice, The
  historical spine, The genealogy map, and the six empirical answers are
  Speech Acts/Implicature/Presupposition/Common Ground/Information/
  Politeness with bare week wktags; Applied pair now "Pragmatics in everyday
  talk" + "The term project". (4) ALL em-dashes stripped from visible text
  (colons/parens/commas; en-dash dates kept per Thomas); interrogatives
  rephrased as statements/imperatives except the slide title "What is
  pragmatic meaning?" (kept as framing) and object-language questions in
  data. (5) Dangling refs fixed: mother's echo → hearer's reply; "small talk
  on footpaths" → "small talk"; Strawson's "(4)" → prose. STYLE RULES NOW
  STANDING for this module's prose: no em-dashes, no "not X but Y",
  fragments over flow, plain title names.
- **Overview polish:** callout accent colours (purple def / yellow key /
  note) neutralised to greys via file-local custom-property overrides — the
  page now runs ink/grey + the burgundy section rules only. Assessment word
  count changed everywhere from "3,500–4,000" to a **limit of 3,500 words**
  (overview · deck 21a fact · prag-meta words field · hub identity
  assessment title — the last pair not check-5-compared but kept in sync).
- **Docs:** CLAUDE.md now codifies the session's style decisions as
  "§Conventions › House style for slide & document prose" (titles name
  things · no em-dashes · no contrastive not-framings · fragments ·
  statements over questions · no hooks · real portraits, verified · plain
  callouts on print docs · LI7862 module facts incl. 3,500-word limit,
  Blackboard, PX113). prag wk-1 deck + overview added to Reference weeks as
  the prose-style reference; deck-building Rules point at the block.
- **Known style drift left for later:** exercises.html still has the
  em-dash car datum + question leads; readings.html notes have em-dashes;
  prag-meta wk-1 lens q/d strings are questions with em-dashes (feed hub);
  deck head has now-unused .bigask/.qsrc CSS.
- **Also:** week-1 readings PDF hunt — `readings/_MANIFEST.md` (repo root, keep
  out of git or move if unwanted publicly): Ayer ch. 1 (LSE course PDF) and
  Horn & Ward intro (publisher sample) verified with download commands;
  Levinson 1983 ch. 1 has no verified open copy (candidate UPF scan noted,
  unverifiable — VM down + site unreachable from browser).
- **Environment:** shell VM down again all session ("VM service not running") —
  npm test NOT run; everything desk-verified by grep (div balance, no leftover
  todos/placeholders, links against shared/). **Commits + npm test + live
  verify left for Thomas / a healthy session**, on top of the still-uncommitted
  template-streamlining work above.

### 2026-09-15 — Pragmatics II week 1 authored (deck · handout · homework · readings)

- **Brief disambiguation (worth keeping):** the request opened "my Pragmatics II
  slides for week 1" but the task line read "[Linguistic Pragmatics] week [1] —
  [Pragmatics Meaning]", which is a different module (prag, LI7862) whose week 1
  is already fully built and whose handout Thomas withdrew on 2026-09-12.
  Confirmed with Thomas: **Pragmatics II / LIU44008**. The bracketed template in
  the request appears to be stale from a prag session; the artifact bracket also
  arrived unedited as the full slash-list. Both were resolved by asking.
- **Content source:** the brief itself never arrived (nothing followed "Artifacts
  wanted"). Agreed with Thomas: build from `docs/pragmatics-2-course-plan.md`
  §Week 1 (S1 recap reframed; S2 three corners, two diagnostics, interface,
  course question) plus the already-authored `weeks-pragmatics/week-01` deck for
  the recap material, on the grounds that "the prior pragmatics course" is
  literally Pragmatics I (the stated prereq). `uploads/`/`pdfs/` NOT touched.
- **Shipped:** `weeks-pragmatics2/week-01/` deck 4 scaffold slides → **14
  authored slides** (title · this week · recap · implicature · speech acts ·
  presupposition · Grice reread · three approaches · two diagnostics · SI in each
  corner · the interface · course question · readings · wrap); handout skeleton →
  three approaches + two diagnostics callouts, an `.ex-tool-intro`/`.ex-tasks`
  three-corner test, an `.ex-prog` deriving one datum three ways, and two
  `.ex-instrn` tasks; `exercises.html` 2 placeholders → **4 real problems**;
  `readings.html` 3 placeholder slots → Grice 1975 (classical) · Sperber &
  Wilson 1995 ch. 1 (contemporary) · Levinson 1983 intro (textbook), per the
  course plan, with per-item notes. No link blocks added (no open-access copies
  verified this session).
- **Housekeeping block deliberately SKIPPED** (Thomas's call). CLAUDE.md's house
  style wants one on a week-1 deck, but the hard-coded module facts there are
  **LI7862's, not LIU44008's** — room, time, office hours, platform, deadline and
  learning outcomes are all unknown for this module, and course plan §6.3 flags
  the 40/60 Presentation/Essay split as unconfirmed. A "This week's readings"
  slide WAS included (content, not logistics). Add the rest once the facts land.
- **Meta:** `prag2-meta.js` wk 1 needed **no change** — title, `section: 0`,
  `approach: null` and figures were already correct. `approach: null` is right for
  an introduction week: no `.spine-card` takes `.on`.
- **Hub:** prag2 wk 1 deck/handout/ex/rd all `draft` → `ready`; `fig` string
  gained Levinson to match the meta. Title/section untouched, so check 5 is
  unaffected.
- **Pattern discipline:** the prag2 deck does **not** load `lens.css`, and the
  prag wk-1 bespoke vocabulary (`.mrail` `.convo` `.brn` `.egpanel` `.erow`
  `.qwrap`) is deliberately un-promoted — so the recap was rebuilt in **shared**
  vocabulary only (`.c-box`/`.f-box-wrap`, `.b-steps`, `.q-banner`,
  `.spine-cards`, `.chip-row`, `.figs-line`, `.reads-box`). NB `.f-box-wrap` is
  defined in no stylesheet at all; it is nonetheless the canonical wrapper (5 uses
  in sem1 wk 3, plus the pattern library) and `.c-box + .c-box` does the spacing.
- **House style fixes:** the generator's S1/S2 headings were long question-form
  sentences with em-dashes — replaced with plain titles. One em-dash in the
  Approach 3 spine-card fixed. Two **numeral-slogan** forms caught in this
  session's own first draft and rewritten ("one datum, three derivations" →
  "the same datum, derived three ways"; "Three architectures…, one datum" →
  "Each derivation assumes a different architecture"). The week title "Three
  Roads to Meaning" sits close to that veto but is Thomas's own, from the course
  plan and meta, so it stands.
- **Cleared since last session:** `weeks-pragmatics/week-01/images/chierchia.jpg`
  **and** `franke.jpg` both now exist (the two check-1 blockers flagged on
  09-12), and the withdrawn prag wk-1 `handout.html` is gone from disk. Nothing
  outstanding there.
- **Still unconfirmed for LIU44008:** `exercises.html` carries the generator's
  band "Due Week 2 · 17:00 · submit via Blackboard" — Blackboard is documented as
  the **LI7862** platform, not verified for this module; marks read "—". Check
  before circulating. Scaffolded `<title>` tags carry template em-dashes across
  every generated week (cosmetic, template-wide).
- **Environment:** shell VM down for the **third consecutive session** ("no Plan9
  drive shares mounted under /mnt/.virtiofs-root/shared"). `npm test` NOT run;
  no browser step-through (extension refuses `file://`, and no local server
  without the VM). Desk-verified instead: `<div>` balance exact in all four files
  (deck 194/194, handout 46/46, ex 29/29, readings 21/21), 14 slides with
  balanced `<section>`s, `deck-stage.js` + `prag2-meta.js` + `prag2-rail.js`
  still loaded, file tails intact, zero leftover todo/placeholder strings, zero
  unreplaced `{{TOKEN}}`s, no new local `href`/`src` introduced.
- **Next session must know:** **commits + `npm test` + push + live verify are
  still outstanding**, now covering three sessions of work (template
  streamlining, prag wk-1 handout/homework/overview, and this week). Verify the
  deck in a browser once a healthy environment exists: rail fills from
  `data-week="1"`, `.spine-cards` render 3-up with none active, MathJax is loaded
  but unused on these slides.

- **REVISION, same session (Thomas's steer): the deck was rebuilt around the
  course's actual arc.** The first pass treated LIU44008 as a topic-coverage
  recap, which Thomas rejected ("you've missed the point of the course"). Two
  corrective passes followed.
  - **What the sweep established** (read across all of `weeks-pragmatics/`,
    `weeks-pragmatics2/`, both course plans, and the live site): the live prag2
    weeks 2–8 are byte-identical scaffolds to local, so nothing was published
    that the clone lacks. Pragmatics I already teaches **Shannon, entropy, Zipf
    and Huffman in its week 6**, and its weeks 9–12 ARE Neo-Gricean / RT / RSA /
    Grammaticalism (readings only, no decks). Its **week 1 already runs the same
    datum, *Some of the students passed*, four ways** across those programmes. So
    prag2 wk 1 is a reprise, not an introduction. Thomas's call on prior depth:
    **assume little** (cohort varies, gap can be ~18 months, wks 9–12 engagement
    patchy).
  - **THE ARC (Thomas, verbatim intent):** the course is not three co-equal
    corners adjudicated against each other. The hook is **cognitive science
    joined to Relevance Theory, Bayesian reasoning (RSA) and information
    theory** — RT's effects-against-effort, RSA's Bayesian recursion and
    surprisal \(-\log_2 p\) as three notations for **comprehension as inference
    under resource limits**. **Grammar is the contrast case** the picture gets
    tested against. LLMs enter as a **measuring instrument** (next-token
    surprisal ↔ reading times) before they are a rival.
  - **Deck rebuilt to 16 slides**, S1/S2 split kept as the course plan has it
    (Thomas: keep the LLM material light in S1, hold the space and the course
    question for S2 — an earlier draft wrongly pulled them forward). S1: two
    specimens cold → scalar implicature (Grice derivation + cancellation) →
    presupposition (negation test) → the asymmetry side by side → Grice reread →
    speech acts in passing. S2: the space → **"Comprehension as inference under
    resource limits"** (the arc slide) → **"Cognitive science as the connective
    tissue"** (processing, prediction, models as instruments) → grammar as
    contrast → interface thread → course question → readings → wrap.
  - Presupposition is now framed as content that "was already probable", which
    seeds the information-theoretic thread inside the week-1 recap.
  - Course question restored to Thomas's **"and/or"** (an earlier draft wrote
    "and", collapsing three possible answers to two).
  - **DRIFT FLAGGED, NOT FIXED:** `docs/pragmatics-2-course-plan.md` and
    `prag2-meta.js`'s `APPROACHES` glosses still describe three co-equal
    approaches, and the **scaffolded S1/S2 headings for weeks 2–8 were generated
    from that doc**. Week 1 now announces the convergence arc, so the eight weeks
    behind it are inconsistent until the plan is rewritten. The plan's own §6.1
    ("where cognition went" — redistributed, with a note on restoring it) and
    §6.5 ("your own angle … experimental-pragmatics") are the two open decisions
    Thomas has effectively closed. **Next session should offer to rewrite the
    course plan doc to match, then regenerate/adjust weeks 2–8.**
  - Handout, homework and readings were NOT revised to the new arc this pass and
    still reflect the neutral three-corner framing. They need a second look.
  - Verified after rebuild: `<div>` 226/226, 16 slides with balanced
    `<section>`s, zero em-dashes in the file, scripts and tail intact, two
    house-style slips caught in Claude's own prose and fixed ("three ways of
    writing down one idea" and "Three outcomes, not two").

- **SECOND REVISION, same session: LIU44008 REDESIGNED as a modelling and
  methods course.** Thomas's brief, verbatim in intent: "build up theories in
  RSA, information theory, game theory, and cognitive science so that students
  can propose their own analyses of phenomena in terms of them and can design
  studies of data". This supersedes both the original three-approaches plan and
  the convergence-arc revision earlier in this session. **Game theory is new**
  as a named pillar; **adjudication between camps is no longer the point**;
  capability is.
  - **Design:** four frameworks as four aspects of ONE object (a speaker and
    listener choosing under uncertainty with limited resources). Game theory =
    strategic structure; information theory = the currency; RSA = the composed
    implementation; cognitive science = the resource bound and the link to data.
    Built in dependency order, because game theory needs no probability,
    information theory supplies the utility, probability supplies the priors,
    RSA composes all three, cognition bounds and tests it. The two diagnostics
    survive as worked examples and now have a *reason*: scalar implicature
    probes **alternatives**, presupposition probes **priors**, which are the two
    halves of a Bayesian model.
  - **New week structure** (7 taught): 1 From Logic to Probability · 2 Game
    Theory and Signalling · 3 Information Theory · 4 Probability, Priors and
    Common Ground · 5 Rational Speech Act Models · 6 Cognitive Science and
    Resource Limits · 7 Reading Week · 8 Models, Data and Language Models.
    New `MODULE_SECTIONS`: Introduction · Frameworks · The Model · Cognition ·
    Reading Week · Application · Presentations.
  - **Files changed:** `docs/pragmatics-2-course-plan.md` rewritten whole (design,
    6 learning outcomes, week-by-week with per-week readings and a methods
    component, the cumulative methods spine, re-tagged 10-topic presentation
    pool, open decisions, probLang mapping table, and a §9 list of citations
    needing verification). `shared/prag2-meta.js` rewritten: new
    MODULE_SECTIONS, new week titles/sections/figures, `window.APPROACHES`
    repopulated with the FOUR frameworks (**name deliberately kept** because
    `scripts/new-week.mjs` reads `cat.APPROACHES`), new `window.DIAGNOSTICS`.
    `index.html` WEEKS array synced (check 5 verified by hand: week set, titles,
    section names, reading/present flags all mirror the meta).
  - **Week-01 files retitled** "Three Roads to Meaning" → "From Logic to
    Probability" across deck/handout/readings/exercises, and `<title>` em-dashes
    normalised to middle dots. **Hub statuses regressed deck/handout/ex from
    'ready' to 'draft'** — honest, because the bodies were written for the
    three-corner design. Readings stays 'ready': Grice 1975 / Sperber & Wilson
    1995 ch.1 / Levinson 1983 are unchanged for week 1 under the new plan.
  - **Weeks 02–08 retitled by subagent** (24 files, 78 substitutions, verified
    zero old titles remain, div counts unchanged). Section tags remapped too.
  - **RESEARCH DONE THIS PASS (three parallel agents, ~580k subagent tokens).**
    Findings worth keeping: (a) **relevance has been formalised repeatedly but
    never by relevance theorists** — decision-theoretic (van Rooy 2001),
    information-theoretic (entropy reduction, Lindley 1956), argumentative
    (Merin 1999), with **Bernardo 1979** proving entropy-reduction relevance is
    a special case of decision-theoretic relevance under log utility. That is a
    SECOND containment result structurally identical to probLang App 2's
    flat-prior one. (b) **Nobody has formalised processing effort in RT's
    sense** — every formalisation captures effects. That asymmetry is the state
    of the art. (c) **The two literatures barely cite each other**: Degen 2023
    cites Sperber & Wilson once, Franke & Jäger 2016 mention RT once, no
    relevance theorist has published a substantial critique of RSA, and **no
    experiment has been designed to adjudicate satisficing against
    optimising**. Unger & Buschmeier 2025 (arXiv) is the only bridging attempt.
    Recorded in the plan as presentation topic 11. (d) RT and RSA sit at
    different Marr levels; Griffiths, Lieder & Goodman 2015's "rational process
    models" is the level where they reconcile. (e) Best single teaching hook
    found: **Oh & Schuler 2023** — larger, lower-perplexity LMs fit reading
    times WORSE, driven by excessive accuracy on rare words.
  - **Two overclaims by Claude corrected by the research:** gradedness is well
    evidenced for presupposition **projection** (Tonhauser, Beaver & Degen 2018;
    Degen & Tonhauser 2021) but the **accommodation** record is contradictory
    (Tiemann et al. 2015 find none and propose "minimize accommodation";
    Domaneschi & Di Paola 2018 find it immediate and costly; Singh et al. 2016
    find it plausibility-gated). And "projection falls out because negation
    leaves the prior untouched" is a first approximation only: Schwarz & Tiemann
    2017 find projection cognitively effortful; Degen & Tonhauser 2025 say no
    analysis on the market captures their data. Both corrections are written
    into the plan as teaching notes.
  - **Bad citations caught and recorded in plan §9** (do not let these back in):
    there is **no** Chemla paper "Presupposition projection from quantified
    sentences: strengthened meanings and tacit variables" (conflation of Chemla
    2009 *NLS* 17:299–340 with Sudo, Romoli, Hackl & Fox 2012); there is **no**
    Ryskin & Gibson noisy-channel *Annual Review*; Lieder & Griffiths 2020 is
    **not** a language paper (credit Hahn et al. 2022, Futrell et al. 2020,
    Zaslavsky, Hu & Levy 2021); Kristina Liefke has nothing on relevance.
  - **KNOWN INCONSISTENCIES LEFT (next session's job).** (1) Every prag2 deck
    still renders the OLD three-approach `spine-cards` (Inference / Grammar /
    Information) — a real content mismatch with the four-framework meta, and it
    needs an editorial decision, not a rename. Four cards want
    `.spine-cards cols-2`, not the default 3-up. (2) Weeks 02–08 scaffold
    BODIES still carry S1/S2 headings generated from the OLD course plan; they
    want regenerating with `npm run new -- prag2 N --force` once the VM is up.
    (3) Week-01's deck body is still the convergence-arc version and needs
    rebuilding to the new week 1 (logical inheritance → the four cracks → the
    move → what a model is). (4) todo-box prose in wks 02–04 decks points at
    retitled weeks. (5) `b-kick` wrap-up lines across prag2 retain em-dashes.
  - **Three consequences Thomas has accepted or must confirm:** the grammatical
    account **loses its dedicated week** (exhaustification survives as a named
    rival in wk 5 and as a presentation topic; the post-2016 hybrid position of
    Potts et al. 2016 and Franke & Bergen 2020 will not get taught properly);
    **WebPPL becomes compulsory** rather than optional, with no lab time in the
    2×1hr format (plan §7.2 lists three mitigations); and **probability is a
    real prerequisite by week 3**.
  - **Environment:** shell VM still down (third session). `npm test` NOT run.
    Desk-verified: `<div>` balance across all of `weeks-pragmatics2/` is
    964/964 and every file matches its own count; meta↔hub check 5 fields
    compared by hand and agree; zero stale title strings remain.

- **THIRD REVISION, same session: week 1 rebuilt from Thomas's own handoff note.**
  Thomas worked independently on week 1 and supplied
  `prag2-week1-and-structure-handoff.md` (a beat sheet with timings, a
  slide-level keep/revise/cut inventory, a house shape for taught weeks, and a
  closed assessment decision). Its audit was checked and is accurate: its
  slide inventory maps exactly onto the 16-slide deck, with correct numbering.
  - **Adopted from the note, and worth keeping:** **politeness replaces speech
    acts** in week 1 as "the reserved case". The argument is that it names the
    **third model component**: implicature probes alternatives, presupposition
    probes priors, **politeness probes utilities**. Brown & Levinson's
    \(W_x = D(S,H) + P(H,S) + R_x\) is taught as "an additive formula over three
    quantities inside a theory with no way to run it", which makes the
    logic-to-probability thesis concrete in a third register. Yoon, Tessler,
    Goodman & Frank (2020), *Open Mind*, is the runnable counterpart
    (**verified by search**: real, three competing goals — informational,
    social, self-presentational; and note it is Michael C. **Frank**, Stanford,
    not Franke, Tübingen — the trap that has already cost this repo a round).
  - Also adopted: S1 stays **monochrome** (no probability, RSA or WebPPL; the
    turn only lands if S2 owns the move); Strawson-against-Russell BEFORE the
    negation test, so the origin reads as a truth-value gap; the derivation
    shown as a **numbered argument with the competence premise visible** in S1
    and cashed as Geurts's standard recipe in S2; and the S1 close on "you
    cannot cancel the conclusion of a valid argument", which S2 opens on.
  - **Deck rebuilt: 16 → 20 slides**, split S1 (10) / S2 (10). S1: title ·
    four-framework spine cards · orientation and assessment · two sentences ·
    scalar implicature · presupposition · the asymmetry · the logical
    inheritance · politeness · close. S2: where it strains · the standard
    recipe · degrees of belief · what a model is · your first model (WebPPL) ·
    the shape of the term · the interface thread · the assessment · readings ·
    wrap. **Spine cards are now the FOUR frameworks in `cols-2 compact`**, which
    was the fix flagged last pass.
  - **Handout and homework rebuilt to match** (they still carried the retired
    three-corner test and "inference or code"). Homework band changed to
    "Formative · bring to Week 2 · not assessed", dropping the generator's
    unverified "submit via Blackboard" claim, which is an **LI7862** fact and
    was never confirmed for LIU44008.
  - Hub statuses for prag2 wk 1 deck/handout/ex back to 'ready'.
  - **ASSESSMENT DECISION CLOSED by Thomas:** 40% presentation (weeks 9–12) +
    60% essay, **2,500 words**, end of term, deadline TBA. This is now on deck
    slides 3 and 18. **NOT YET in the catalogue:** `prag2-meta.js`'s
    `MODULE.identities[0].assessments` needs a `words: "2500"` field (the
    LI7862 identity has one; keep the two apart, LI7862 is 3,500) and the hub's
    identity block kept in sync.
  - **Open points raised by the note, not yet resolved.** (1) It assumes **five**
    learning outcomes; the rewritten plan has **six**. The shared rubric depends
    on which. (2) It retires the convergence slide to "week 6"; the plan puts
    probLang App 2's identities in **week 5 S2**, with week 6 being
    relevance-and-resource-rationality. The slide blended both, so it was cut
    from week 1 and needs splitting across 5 and 6 rather than moving whole.
    (3) Its week 6 S2 is listed as carrying both the Bott & Noveck standoff AND
    a whole-hour study-design workshop, which breaks the house shape the same
    note sets (30 strain / 25 methods / 5 close). (4) **Topic sign-up should
    move to week 5 or 6** so reading week is usable; currently implied at week 8,
    one week before presentations. Deck slide 18 says week 5, so the plan doc
    and the topic pool need to follow.
  - **Natural deduction block added to week 1 (Thomas's request, same session).**
    S1 now teaches a propositional ND system explicitly before the contrast is
    drawn. Five slides between the asymmetry and politeness: **Deductive
    reasoning** (\(\Gamma \vdash A\); validity; what the guarantee ignores) ·
    **A natural deduction system** (\(\wedge\)I/E, \(\rightarrow\)I/E,
    \(\neg\)I, with assumption-and-discharge called out as what makes it
    natural) · **A proof** (five lines, two applications of \(\rightarrow\)E) ·
    **Monotonicity** (\(\Gamma \vdash A \Rightarrow \Gamma \cup \{B\} \vdash A\),
    flagged as the property the hour breaks) · **The derivation fails both
    tests** (validity fails: cooperative speaker, partial access, premises true
    and conclusion false; monotonicity fails: add "the speaker has no idea how
    many" and the conclusion goes; the repair costs the competence premise;
    Grice's own calculability-plus-cancellability pair says the inference is
    reasoning and is not deduction). Deck now **24 slides**, S1 14 / S2 10.
  - S1 close rewritten: it previously posed the cancellable-valid-argument
    puzzle, which the ND block now demonstrates, so it states the two halves to
    keep (it is reasoning; it is not deduction) and hands the "what kind of
    reasoning, then" question to S2. S2's defeasibility box sharpened to name
    non-monotonic and default logics as the attempt to repair pragmatics by
    dropping the monotonicity rule students have just been taught.
  - Handout gained a matching ND block (rules restated, two proofs to complete,
    one monotonicity check) and the progression now runs the validity and
    monotonicity tests explicitly on Grice's derivation.
  - **Franke & Jäger incorporated into week 1** (Thomas supplied the PDF; read in
    full). Three things taken, all of which replace assertions with material:
    (1) **"Levels of explanation"**, a new S2 slide built from their Figure 1:
    constraints (Hurford) · principles (strongest meaning) · maxims (Quantity) ·
    reasons (optimal language use) · processes, each with its what/why/how
    question. It tells students where the course operates (the level of reasons)
    and why that does not displace the structural approaches ("one task, many
    tools"). Carries Anderson's line that rational analysis "does not imply any
    actual logical deduction in choosing optimal behavior, only that the
    behavior will be optimized", which is Thomas's week-1 thesis in the words of
    the person who founded the framework. (2) **"Gradience, measured"**, a new S2
    slide: the ten-circles demo (people answer four or five; two feels less
    likely than six), the categorical account's flat prediction against the
    observed peaked-then-falling ratings for *Some of the As are Bs* (van Tiel;
    Degen & Tanenhaus), and **scalar diversity** (*some*/*all* and
    *sometimes*/*always* readily, *big*/*enormous* and *attractive*/*stunning*
    much less, which entailment alone cannot explain). This is the empirical
    crux and it was previously one thin assertion. (3) **Grice's own words** on
    the S1 close: "talking as a special case or variety of purposive, indeed
    rational, behaviour", and conversational practice as "something that it is
    *reasonable* for us to follow". Rational, purposive, reasonable; validity
    never enters. Textual support for "reasoning but not deduction".
  - Handout gained a third ex-block on gradience: the ten-circles judgement, a
    two-curve sketch (categorical prediction against your own ratings), and a
    scalar-diversity ranking with the entailment account asked to explain it.
  - Deck now **26 slides**, S1 14 / S2 12.
  - Paper added to the course plan: optional week-1 framing read (§§1–3, §5) and
    a set week-5 reading (§4 reference-game model with fitted likelihood, §6
    indirect speech acts via game theory, which also back-fills week 2).
    **Citation flag recorded in the plan:** the copy in hand is the Tübingen
    preprint filed as 2015; the published version is *Zeitschrift für
    Sprachwissenschaft* 35(1), 3–44, 2016, and the section numbers cited are the
    preprint's.
  - **Not yet used, worth mining later:** their §6 indirect-speech-act material
    (the veiled bribe from *Fargo*, Stalnaker's John Snow dollar example, the
    mobster's veiled threat, and the fully worked carpet-sale signalling game
    with payoff trees and posterior tables) is close to ideal for **week 2**, and
    the Cleo-marbles case with the wonky-worlds joint inference belongs in
    **week 4** with the priors material.
  - **Still outstanding:** weeks 02–08 deck BODIES (stale S1/S2 stubs and
    three-approach spine cards); weeks 09–12 have no pages at all and
    `new-week.mjs` **refuses presentation weeks**, so they need hand-building;
    `overview-liu44008.html` and both assessment pages are 404.

### 2026-09-18 — Semantics II week 2 deck drafted; deck conventions codified

- **Shipped:** `weeks-semantics2/week-02/deck.html` (new, 38 slides: 28 content,
  4 dividers, 4 question slides, title, close) for **Worlds, Intensions & Modal
  Logic**, and `docs/deck-style.md` (new), the deck counterpart of
  `docs/handout-style.md`.
- **Where the conventions came from:** a diff of the week 1 deck between
  `c49a186` (Claude's restyle, 43 slides) and `d1980b3` (Thomas's own edit, 27
  slides). His version is the rule: one deck per lecture, "Part" for "Act", no
  forward teasers or commentary on the lecture, no dramatic callout labels or
  synthesis paragraphs, title-only overview slides, one citation-only readings
  slide, hook moved inside the Empirical lens, examples numbered continuously,
  plain "Lecture closes" ending. The table is in `docs/deck-style.md` §1.
- **Brief (Thomas, in chat):** nothing presumed from Semantics I; enough of the
  philosophy of possible worlds, with a light touch on fictionalism; Scots and
  Irish English as the typological cases alongside Nez Perce; history and
  applications carried by the lecture, content by the handout.
- **Build:** head, local `<style>` block and `.mrail` script copied from week 1;
  `TITLES`/`GROUPS` rewritten (six groups, "What a world is" as a sub-block in the
  Historical colour). Additions at the end of the style block: `.qsrc` (copied
  from prag wk 1; week 1 uses the class but never defined it), `.kfig` for the
  inline-SVG Kripke model, `.fl .fm` for a formula under a `.fourways` label.
- **NUMBERING GOTCHA:** the renumbering that drops Negation has **not landed on
  `main`**. `sem2-meta.js` and the hub still say week 2 = Negation, and
  `week-02/readings.html` is still the Negation list. The deck hard-codes its own
  week title in the sidebar, so it renders correctly either way; only the lens
  steppers read the catalogue. **Hub status deliberately NOT flipped** (the sem2
  wk 2 row is still the Negation row). When the renumber is applied, it must keep
  `week-02/deck.html` in place while `week-03/readings.html` moves down to join
  it, then flip deck `none` → `draft`.
- **Open TODOs (HTML comments in the deck):** glossed *-o'qa* example from Deal
  2011; authors of the 2024 *ELL* double-modals paper for (20); check (19)
  against Brown & Miller 1975: 174; Lakoff attribution of the Bardot sentence;
  page reference for Kripke's dice. Four portraits hotlink Wikimedia Commons
  (licences on the slides): localise to `week-02/images/`. Commons' "David Lewis
  1968.jpg" is not verified as the philosopher; the 1962 photo is used.
- **Length:** about ten slides over week 1's count. First cuts: "Two frames from
  games", "Uses of the semantics", the *can't seem to* row.
- **Not yet built for week 2:** handout, homework, revised readings list (plan
  agreed in chat; stale chapter references to fix: vF&H §2.3–2.4.1 in the current
  build, Coppock & Champollion ch. 12, Portner ch. 2).
- **Same day, second pass (Thomas's notes):** material conditional slide kept;
  two Carnap slides added (state-descriptions; necessity as truth in every
  state-description, drawn as four cards with a truth table under them); three
  diagram slides added, all inline SVG under a new `.wfig` block in the deck's
  style block: logical space as a 2×2 grid with propositions as regions
  (Empirical), then Necessity and Possibility on one shared frame (Formal, before
  "Frames and models"). Readings slide now lists three: vF&H §2.3/§2.4.1, Carnap
  1947 §2 and §39, Deal 2011 §§1–3 (Deal not yet confirmed). Deck now 43 slides.
  Zamorano-Mansilla 2023 (epistemic *mustn't*) is held for week 3 at his request.
- **2026-09-19, third pass: last year's modality materials folded in** (Thomas's
  Semantics III handout 3 "Propositional Modal Logic", Portner 2009 ch. 2, Coppock &
  Champollion "Toward a theory of modality", Oct 2025 draft where it is §13.3; the
  Sept 2026 draft numbers the chapter 12, so cite by section title).
  **Deck** (still 43 slides): "Two frames from games" out, "Portner's ants" in before
  the axiom table (examples renumbered, now (1) to (25)); "Frames and flavours" rows
  now define epistemic and deontic R after Portner and carry the H3 system names
  (S5, KD45, KD) plus a future-time row; validity slide labels T "also M" and
  separates validity in a model from validity on a frame; "Limits" rebuilt from this
  week's sources (whose knowledge and when; must/should and "most worlds"; Cresswell's
  rich/poor sentence; Catch-22 and seriality), with Robin's fine and graded modality
  held for week 3; may/can gap added to "Flavours"; world-variable row on "Must and
  may"; textbook reading is now Portner ch. 2 §§2.1 to 2.2.3.
  **Handout** (new, `week-02/handout.html`, classic sheet, ten blocks, ten A4 pages in
  Chrome): 0 The modal language · 1 Kripke semantics · 2 Validity · 3 Frame conditions ·
  4 Axioms and flavours · 5 Accessibility relations · 6 World variables · 7 Substitution
  under necessity · 8 Scots, Ulster, Irish English, Nez Perce · 9 What you need to know.
  Definitions in blocks 0, 1, 3 and 4 keep the H3 wording. H3's "further
  correspondences" (functional, shift-reflexive, dense, convergent) are left for
  Semantics III week 2.
  **CSS:** the classic-sheet styles are lifted to `shared/handout-classic.css` (open
  item in docs/handout-style.md), with three additions: `.draw`, `table.rec.fill`,
  `.mfig`. The Pragmatics II week 1 handout still carries its inline copy; repoint it
  when that file is next touched.
- **2026-09-19, fourth pass (Thomas's notes):** typological data lives in the slides
  only, so handout block 8 (Scots, Ulster, Irish English, Nez Perce) is cut; the
  sheet is now nine blocks, 0 to 8, examples (1) to (25), nine A4 pages. Deck set up
  against the sheet block by block: the validity slide is split into **Validity**
  (model vs frame, a countermodel at w2) and **Frame conditions**; "Frames and
  flavours" renamed **Axioms and flavours**; new **Substitution under necessity**
  slide (Quine's number of planets, rigid designators) ahead of handout block 7; the
  Cresswell formula is off the Limits slide because block 6 asks students to write
  it; closing slide lists Thursday's skills. Deck 45 slides, examples (1) to (27).
  **Type:** `shared/font-latex.css` + `shared/fonts/newcm/` (New Computer Modern Book,
  GUST licence, unmodified WOFF2 re-wraps, about 3 MB). Opt-in per file; week 2 deck
  and handout link it. Rolling it out elsewhere is one `<link>` per file, or an
  `@import` in tokens.css for every deck at once. Unicode subscripts replaced by
  `<sub>`/`<tspan>` because no NewCM face has them. Slide text sizes raised
  (docs/deck-style.md §7); every slide re-measured headlessly, none overflows.
- **2026-09-19, fifth pass: Menzel's SEP "Possible worlds" read and applied.** It had
  been cited from memory as a reading and never actually read; two things in the
  philosophy block were wrong. "Ersatz worlds; Kripke's dice" is replaced by **Three
  answers**: concretism (Lewis), abstractionism (Adams's consistent total sets of
  propositions; Plantinga's maximal possible states of affairs), combinatorialism
  (Armstrong, the Tractatus; Carnap's state-descriptions are its linguistic version,
  Lewis's "linguistic ersatzism"). Corrections: "ersatzism" is Lewis's label, not the
  field's neutral one; Plantinga works with states of affairs, not sets of
  propositions; the objection to abstractionism is not circularity but that the
  definitions are irreducibly modal, which loses the extensionality that motivated
  possible-world semantics. Lewis slide gains Menzel's two framing questions (what a
  world is; what it is to exist in one), the maximal-connected-object definition, and
  no-overlap giving worldboundedness and counterparts. Fictionalism slide notes
  Armstrong's parallel as-if move. Substitution slide and handout block 7 gain
  Menzel's §1.1 predicate case (John's dogs and pets under necessity), which is a
  cleaner failure of classical substitutivity than the Ginsburg pair alone. Menzel §2
  added to the readings slide as optional. Deck 45 slides, examples (1) to (28);
  handout examples (1) to (28), still nine pages.
- **2026-09-20, sixth pass (Thomas's review notes).** Flavours and *Must and may* stay
  in Monday's lecture and now come **early** in the Formal lens, straight after the
  worked model: order is Necessity, Possibility, Frames and models, Truth at a world,
  Worked, Your turn, **Must and may**, **Other notations**, Portner's ants, Validity,
  Frame conditions, Axioms and flavours, Substitution, Limits. The epistemic and
  deontic definitions of R moved onto *Must and may* so the intuitive account is
  complete before the frame-condition material. Historical cuts as agreed: the spine
  and *Uses of the semantics* are gone, the two Carnap slides are one, Armstrong's row
  is off *Fictionalism*. **One notation** (docs/deck-style.md §8): `wRw′`, `R(w)`,
  `M,w ⊨ φ`, `V(p)`, T/5; the lexical entries now read `∀w′[wRw′ → w′ ∈ p]`; a new
  **Other notations** slide and a table on the sheet's last page carry the variants.
  *Axioms and flavours* now says outright that the simple theory makes epistemic
  *must p* entail *p*, and that (14) is a problem for it. `#` on (22) kept at
  Thomas's say-so. Verified tonight and corrected: the Bardot sentence is McCawley's,
  in Lakoff 1968; Carnap's Leibniz gloss is MN p. 9; Łukasiewicz was RIA Professor of
  Mathematical Logic from autumn 1946 (honorary TCD doctorate 1955); Kripke's dice
  are N&N preface pp. 15 to 17; the Hawick tweet is from Morin, Desagulier & Grieve
  2024. Still open: Brown & Miller 1975 full reference; a glossed Deal example.
  **Portraits localised** to `week-02/images/` (four files, licences on the slides).
  **Aesthetic pass:** every slide screenshotted and measured headlessly; type scale
  raised in four rounds to a 40px body with `dense` and `snug` fallbacks
  (docs/deck-style.md §7); logical-space figure redrawn larger; a merge bug that put
  the lens icon where Carnap's figure belonged was caught on the contact sheet.
  **Handout:** C&C's M1 dropped for the lecture's single model with a C&C-style
  fill-in table; block 6 rewritten without Ty2/acc; (T) for (M) throughout; print
  type up half a point for Computer Modern (rules live in font-latex.css under
  `.sheet`); nine blocks, nine pages. Deck 43 slides, examples (1) to (28).
- `npm test` green (166 files).

