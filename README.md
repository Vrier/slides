# slides.tstephen.com

Weekly teaching materials for Dr Thomas Stephen's formal semantics & pragmatics
modules at Trinity College Dublin — five modules, each week shipping four artifacts:
**deck · handout · readings · homework**. All plain static HTML/CSS/JS; nothing to
build, nothing to install.

- **Live:** https://slides.tstephen.com (public but unlisted — no link from the main site)
- **Landing page:** `index.html` — the hub, a filterable catalogue of every week of
  every module. It is a working view for the lecturer; students only ever get direct
  links to individual week pages.

## The five modules

| Module | Folder | Status |
|---|---|---|
| Semantics I / Describing Meaning | `weeks-semantics1/` | 12 weeks built (wk 7 = reading week) |
| Semantics II | `weeks-semantics2/` | readings only — weeks not yet built |
| Semantics III | `weeks-semantics3/` | wks 1–6, 8 built; 9–12 student presentations |
| Pragmatics I / Linguistic Pragmatics | `weeks-pragmatics/` | 12 weeks (wk 1 deck/handout pending) |
| Pragmatics II | `weeks-pragmatics2/` | wks 1–6, 8 built; 9–12 student presentations |

Each week folder holds `deck.html`, `handout.html`, `readings.html`, `exercises.html`
(the hub labels the last one "Homework"). Everything shared — tokens, themes, the
deck shell, week catalogues, rail fillers, the COMPOSE tree kit — lives in `shared/`.

## Repo layout

```
index.html            the hub (catalogue of all modules/weeks)
weeks-*/              one folder per module, week-NN/ inside
shared/               all shared CSS/JS + week catalogues (*-meta.js) + rails
docs/                 course plans (markdown)
uploads/  pdfs/       source material from previous years — reference only, but served
.github/workflows/    deploy pipeline (push to main → VPS pulls)
CLAUDE.md             authoring guide — how to build a week (read this first)
DEPLOY.md             one-time server/DNS/repo setup recipe
```

## Working on materials (Cowork / Claude Code)

1. Clone the repo locally and open the folder in Cowork (or Claude Code).
2. `CLAUDE.md` is the full authoring guide: module → folder/catalogue/rail/theme
   wiring, the reference weeks to copy patterns from, and the per-artifact recipes.
3. Preview by opening the HTML files directly in a browser — no server needed
   (everything is relative paths).
4. Commit and push to `main`. GitHub Actions SSHes into the VPS and fast-forwards
   `/srv/slides`; the site updates within ~a minute. Nothing to restart.

## Deployment

Static files served by Caddy on a Hetzner VPS. Push-to-deploy via GitHub Actions —
see `DEPLOY.md` for the one-time setup (DNS, Caddy block, deploy key, secret) and
`.github/workflows/deploy.yml` for the pipeline.

## Provenance / what was cleaned in the port

Ported from the original Claude workspace ("Trinity College Slides"), July 2026.
Excluded: `_archive/` (superseded monolithic system), scratch files, and two
superseded drafts in `weeks-pragmatics/week-02/` (`deck-v1-boxes.html`, the map
design exploration). Renamed to kebab-case: `pragmatics-map.html`,
`logic-in-exile-map.html` (both week-02 Pragmatics I), and
`weeks-semantics1/figures/figure-gallery.html`.
