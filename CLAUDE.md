# Slides Workspace — slides.tstephen.com

Research talk decks for Thomas Stephen (formal semantics). Everything is
**static HTML/CSS/JS — no build step**. Preview any deck by opening its
`index.html` in a browser. Pushing to `main` runs `npm test` in CI and deploys
(see `PLAN.md` §Infrastructure). **`PLAN.md` is the plan of record — read it
first; its §Session log is the only memory between sessions.**

## Layout

```
index.html              unlisted hub — renders the catalogue from shared/decks.js
<year>/<slug>/index.html  one folder per deck; the URL is /<year>/<slug>/
templates/deck/         the scaffold to copy for every new deck
2026/demo/              the worked reference deck (smoke test — keep it green)
shared/                 vendored design system (see below)
scripts/check.mjs       `npm test` — folders↔catalogue, links, deck sanity, NUL guard
.github/workflows/      push to main → npm test → VPS pulls
```

## The one catalogue

`shared/decks.js` is the **single source of truth** for what decks exist
(deliberate fix for the teaching repo's duplicated-`WEEKS`-array gotcha). The
hub renders from it; `npm test` fails if folders and entries don't match 1:1.
Adding a deck = folder + one entry. **Never rename a published deck folder** —
URLs are forever.

## New-deck ritual

1. `cp -r templates/deck <year>/<slug>` (kebab-case slug).
2. Fill in title slide, `window.TALK` (rail identity + sections), theme link.
3. Add the `shared/decks.js` entry (`status: "draft"` until shipped).
4. `npm test` → commit → push → `curl -sI https://slides.tstephen.com/<year>/<slug>/`.

## The design system (`shared/` — vendored from the teaching repo)

Snapshot copied July 2026, evolves independently; port fixes by hand and note
them in the session log. Origin: github.com/Vrier/teaching.

- `deck-stage.js` — the `<deck-stage width="1920" height="1080">` shell:
  arrow keys, full-screen, print-to-PDF. Slides are `<section class="slide">`.
- `tokens.css` — colours, type scale, spacing. `dir-a.css` title slides,
  watermark, dividers (`a-div`), footers; `dir-b.css` content shell
  (`b-slide` → `b-rail` + `b-main`, `b-kick`, `b-h`, `b-road`, `b-steps`);
  `dir-c.css` callout boxes (`c-box`), flows, pills. `deck-slides.css` extras.
- `talk-rail.js` — fills every `.b-rail` from the deck's inline `window.TALK`
  (this repo's replacement for the teaching `*-meta.js`/`*-rail.js` pair);
  per-slide progress via `data-section="N"` on the rail div.
- `examples.css` — numbered (1), (2), … examples, judgments, interlinear
  glosses. This is the expex stand-in: examples are hand-formatted HTML.
- Math: MathJax 3 `tex-svg` (CDN), macro `\sem{…}` → ⟦…⟧. Inline `\( \)`,
  display `\[ \]`. **Not real LaTeX** — no expex/forest packages.
- Trees: `compose-kit/` + `deck-trees.js`. Author
  `<div class="tree-frame" id="UNIQUE" data-compose='{…}'>`; spec (lexicon,
  qtree brackets, `L` = λ) documented at the top of `compose-kit/compose-kit.js`.
  Use `"mode":"static"` on slides. Trees need the Spectral font (in the
  template's Google Fonts URL).
- Themes: default TCD blue; `theme-indigo/burgundy/rust.css` swap the accent.

## Discipline (every session)

- **Start green**: `npm test` before touching anything. **End green. Never
  push red.** Add a check to `scripts/check.mjs` for every feature shipped.
- Stay in scope; update `PLAN.md` §Session log; docs change in the same
  commit as the code they describe. Repo and docs disagree → repo wins:
  verify, then fix the doc.
- Verify live with `curl -sI` after every deploy.

## Cowork gotchas (hard-won — respect these)

- Host file tools can truncate/NUL-pad EXISTING files: **all edits to existing
  files go through the sandbox shell** (python heredocs with exact-anchor
  asserts). Write tool for NEW files only. `npm test` has a NUL-byte guard.
- Each sandbox bash call is independent — absolute paths, no cwd/env carryover.
- Template-token substitution with split/join, never `String.replace`
  (slide content contains `$`-sequences).
- Push with the repo deploy key:
  `GIT_SSH_COMMAND="ssh -i .deploy-key -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new" git push origin HEAD:main`
