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
