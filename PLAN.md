# PLAN.md — slides.tstephen.com

Plan of record for the slides workspace. Repo: `github.com/Vrier/slides`.
This file is the only memory between sessions — read it first, append to
§Session log every session, commit it every session.

## Product spec

**What.** Research talk decks (formal semantics: LaTeX math, numbered examples,
derivation trees) authored as static HTML and hosted at stable URLs.

**Stack.** The teaching-repo deck system, vendored into this repo — no build
step, no dependencies to install; what's committed is what's served.

- Deck shell: `shared/deck-stage.js` (1920×1080 stage, arrow keys, full-screen,
  print-to-PDF).
- Math: MathJax 3 (`tex-svg` from jsdelivr CDN) with the `\sem` ⟦·⟧ macro;
  inline `\( \)`, display `\[ \]`. Trees: `shared/compose-kit/` +
  `shared/deck-trees.js`. Not real LaTeX — no expex/forest; numbered examples
  are hand-formatted HTML (`shared/examples.css`). If a future talk needs
  heavy forest typesetting, add a pre-committed-PDF escape hatch then.
- Styles: `shared/tokens.css`, `dir-a/b/c.css`, `deck-slides.css`, plus
  `theme-*.css` accent overrides per deck. Rail identity per deck via inline
  `window.TALK` + `shared/talk-rail.js`. Fonts (STIX Two Text, Source Sans 3,
  IBM Plex Mono, Spectral for trees) from Google Fonts CDN.
- Vendoring policy: `shared/` is a snapshot copied from the teaching repo
  (July 2026), minus Trinity/module machinery (lens/rail/meta files). It
  evolves independently here; if a fix lands in one repo that the other
  needs, port it by hand and note it in the session log.

**URLs.** One folder per deck: `slides.tstephen.com/<year>/<slug>/`
(e.g. `/2026/sub31-modality/`). The deck file is `index.html` inside that
folder so Caddy's `file_server` serves the bare folder URL directly. Slugs:
kebab-case, stable once shared — never rename a published deck folder.

**Hub.** `index.html` at the repo root: an unlisted catalogue (title, venue,
date, status, link) for the author's use; audiences only ever get direct deck
links. Single source of truth: the hub renders from `shared/decks.js` — the
one catalogue file. (Deliberate fix for the teaching repo's gotcha of a
duplicated `WEEKS` array in the hub.) Adding a deck = new folder + one entry
in `decks.js`.

**New-deck ritual.** Copy `templates/deck/` → `<year>/<slug>/`, adjust theme
link + title slide + `window.TALK`, add the `decks.js` entry, `npm test`,
commit, push, verify live with curl. Worked reference: `2026/demo/`.

## Infrastructure (matches the standard static recipe — never any other path)

- Serve: Caddy on the existing Hetzner VPS (167.233.233.109), block
  `slides.tstephen.com { root * /srv/slides, file_server, encode gzip }`.
- Deploy: push to `main` → GitHub Actions runs `npm test` → SSHes as
  `compose@167.233.233.109` → `git -C /srv/slides fetch origin main && git -C
  /srv/slides reset --hard origin/main`. No restarts. CI red = no deploy.
- `DEPLOY_SSH_KEY` Actions secret: same base64-encoded VPS key as the other
  repos; workflow tries `base64 -d` first, falls back to raw.
- Repo deploy key: fresh keypair `.deploy-key`(+`.pub`) in the repo root,
  gitignored, unique to this repo; public half added as a GitHub deploy key
  WITH write access. Cowork pushes with:
  `GIT_SSH_COMMAND="ssh -i .deploy-key -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new" git push origin HEAD:main`
- One-time setup recipe: `DEPLOY.md`.

## Checks — `npm test`

One command, no dependencies (`node scripts/check.mjs`):

1. Every `<year>/<slug>/` folder contains `index.html`.
2. `shared/decks.js` parses; entries and deck folders match 1:1; fields valid.
3. Every local `href`/`src` in every HTML file resolves to a file in the repo.
4. Every deck references `deck-stage.js` and has ≥1 `<section class="slide">`.
5. No NUL bytes / empty text files (guards the host-file-tool truncation
   failure mode).
6. `<div>` tags balance in every HTML file.

Every shipped feature adds a check. CI runs `npm test` before deploying.

## Work items

- [x] **W1 — Repo skeleton**: vendored `shared/`; `CLAUDE.md`, `PLAN.md`,
      `README.md`, `DEPLOY.md`, `.gitignore`; `templates/deck/`; hub
      `index.html` + `shared/decks.js`; `scripts/check.mjs` + `package.json`;
      `.github/workflows/deploy.yml`; `.deploy-key` pair generated.
- [x] **W2 — Demo deck** at `2026/demo/` exercising math, examples, a
      compose-kit tree, and the three visual directions — doubles as the live
      smoke test and the worked reference deck.
- [x] **W3 — Thomas: one-time setup** (browser/SSH): create `Vrier/slides` on
      GitHub; Porkbun A record `slides` → 167.233.233.109 **before** the
      Caddy block; add repo deploy key (write access); add `DEPLOY_SSH_KEY`
      secret; after first push, paste the VPS root block (clone → chown
      compose → Caddy block → reload). Full recipe: `DEPLOY.md`.
- [x] **W4 — First deploy**: push main, watch Actions, `curl -sI` the hub and
      the demo deck; fix until green and live.
- [ ] **W5 — First real deck** (content from Thomas).

## Working discipline

Start green (`npm test` before touching anything) · stay in scope · end green
· update §Session log · commit (docs in the same commit as the code they
describe) · push · verify live with curl after each deploy. Never push red.
If repo and docs disagree, the repo wins — verify, then fix the doc.

Cowork gotchas: edits to EXISTING files go through the sandbox shell (python
heredocs with exact-anchor asserts); Write tool for NEW files only. Absolute
paths every bash call. Template-token substitution by split/join, never
`String.replace` (deck content contains `$`-sequences).

## Session log

*(append one entry per session: date · what shipped · surprises/decisions ·
what the next session must know)*

### 2026-07-11 — bootstrap

- **Shipped:** W1 + W2. Vendored the teaching design system into `shared/`
  (tokens, dir-a/b/c, deck-slides, deck-stage, themes, compose-kit, crest);
  new `talk-rail.js` (inline `window.TALK` replaces module meta/rail files),
  `examples.css` (expex stand-in), `deck-trees.js` (deck-side tree mounter
  adapted from `handout-trees.js`); hub + `decks.js` catalogue;
  `templates/deck/`; demo deck `2026/demo/`; `scripts/check.mjs` (6 check
  families); deploy workflow with base64-decode-or-raw key handling;
  `.deploy-key` pair generated locally (gitignored).
- **Decisions:** decks are `<year>/<slug>/index.html` so bare folder URLs
  serve; one catalogue file (`decks.js`) — hub has no duplicate array; demo
  deck kept in the catalogue as `ready` so the live smoke test is a real
  entry; compose tree on slides uses `"mode":"static"`.
- **Vendoring notes:** `.tree-frame` was only styled in the teaching repo's
  `handout.css` (not vendored) — a deck-side rule was added to
  `shared/deck-slides.css`. `check.mjs` strips `<script>` bodies before
  link-checking (the hub builds links in JS).
- **Environment note:** the mounted folder can't hold `.git` (lock/unlink
  restrictions) — this session's git database lives at `/tmp/slides.git`
  (`GIT_DIR=/tmp/slides.git GIT_WORK_TREE=<mounted repo>`). Ephemeral: if
  the session ends before the first push, re-init and recommit from the
  mounted tree. After the first push, clone from GitHub instead.
- **Shipped later same session:** W3 (Thomas: repo, deploy key, secret, DNS,
  VPS block) and W4 — first push deployed; hub, demo deck and shared assets
  verified live over HTTPS with curl (all 200).
- **Deploy debugging (W4):** first deploys failed with Permission denied —
  the DEPLOY_SSH_KEY value was never actually authorized for compose@VPS,
  then a regenerated key's halves drifted (pubkey installed ≠ private key
  in the secret). Fixed by generating the pair ON the VPS in one sitting
  (`gha-slides`, SHA256:j7oTNRHf…) and pasting its base64 into the secret
  immediately. Diagnosis trick worth keeping: temporarily have the workflow
  push its `ssh -v` transcript to a ci-debug branch (Actions logs aren't
  API-readable without auth). Debug scaffolding removed afterwards; the
  secret was pasted through chat once — rotate at leisure.
- **Next session must know:** site is live; clone from GitHub (repo is the
  source of truth). Next work item is W5 — first real deck, content from
  Thomas. Start green: npm test before touching anything.
