# Prompt template — author a week in a fresh chat

Copy the block below into a new Cowork chat, fill the [BRACKETS], and delete
any brief lines that don't apply. Keep this file in sync with CLAUDE.md.

---

Connect this folder: C:\Users\Tom\Desktop\Slides — my Trinity teaching repo
(local clone of github.com/Vrier/slides, live at https://slides.tstephen.com;
pushing to main deploys automatically in about a minute, gated by CI).

Read CLAUDE.md (the authoring guide) and the last entry of PLAN.md's Session
log first, and follow them strictly. Start green: run `npm test` before
touching anything. Note: the shell VM has been flaky on this machine
("VM service not running" / mount failures) — if it's down, work with the
file tools directly, skip shell-only steps, and leave commits for me.

**Task: build [MODULE — e.g. Semantics II] week [N] — "[WEEK TITLE]".**
Artifacts wanted this session: [deck / handout / homework / readings — list].

Workflow reminders (details in CLAUDE.md):

1. Identify the module wiring from the CLAUDE.md module table before editing
   anything (folder · catalogue · rail · theme).
2. Fill the week's lens q/d (or arc/approach fields) in the module's
   shared/*-meta.js from my brief below FIRST — scaffolds inherit them.
3. If the week's files don't exist: `npm run new -- [module-key] [N]`
   (shell down → hand-copy templates/week/ skeletons, adjusting to
   ../../shared/ paths and substituting every {{TOKEN}}).
4. Author by copying canonical patterns from pattern-library/deck.html and
   pattern-library/print.html (they sit ONE level deep — weeks use
   ../../shared/…), plus the reference weeks listed in CLAUDE.md.
5. Keep index.html's WEEKS array in sync with the meta and flip artifact
   statuses to 'ready' as things are finished — `npm test` enforces the
   title/section sync, and CI blocks deploy on failure.
6. Verify: `npm test`; open the deck in a browser and step through it
   (rail fills, steppers highlight, MathJax typesets, trees mount).
7. Commit (docs + PLAN.md session-log entry in the same commit) and push to
   main if a push path exists; otherwise leave the commits ready and say so.
8. Hard-refresh the live page to confirm after deploy.

Style rules: plain descriptive slide titles only — the "N X, one Y" pattern
is vetoed. Use ONLY the content I give below; do not invent linguistic
content or raid uploads//pdfs/ unless I explicitly say to. Where my brief is
thin, ask me instead of filling the gap.

**Content brief** (for Semantics III / Pragmatics II, replace the four lens
lines with: arc/approach · session 1 plan · session 2 plan):

- Framing question of the week: [ONE LINE]
- Empirical — data, judgements, contrasts to explain: [NOTES]
- Historical — figures, context, debates: [NOTES]
- Formal — machinery introduced this week: [NOTES]
- Typological/Applied — cross-linguistic or applied angle: [NOTES]
- Worked example(s) to build step-by-step: [EXAMPLES]
- Readings: [LIST — or "already in the week's readings.html / shared/_readings-data.md"]
- Homework tasks: [NOTES — or "draft from the week's content, I'll review"]
- Figures/diagrams to embed (weeks-semantics1/figures/ etc.): [ANY]
- Out of scope this session: [ANY]
