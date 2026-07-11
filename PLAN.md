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
`deck-stage.js` and has ≥1 slide. Add a check for every feature you ship.

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
- **Next session must know:** this is now the teaching repo — follow
  CLAUDE.md for authoring. Clone from GitHub; `npm test` before touching
  anything.
