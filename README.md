# slides.tstephen.com

Research talk decks — Thomas Stephen. Static HTML decks (the teaching-repo
design system, vendored into `shared/`), one folder per deck, served at
`https://slides.tstephen.com/<year>/<slug>/`. No build step: what's committed
is what's served.

- **Hub:** `/index.html` — unlisted catalogue rendered from `shared/decks.js`;
  audiences get direct deck links.
- **New deck:** copy `templates/deck/`, add a `shared/decks.js` entry — full
  ritual in `CLAUDE.md`.
- **Checks:** `npm test` (no dependencies) — CI runs it before every deploy.
- **Deploy:** push to `main` → GitHub Actions → VPS fast-forwards
  `/srv/slides`. One-time server/DNS/repo setup: `DEPLOY.md`.
- **Plan of record & session log:** `PLAN.md`.
