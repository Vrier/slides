# Deck style — the Semantics II lecture deck

The conventions for LIU33008 lecture decks, read off the **week 1 deck as
Thomas left it** after his own edit of 14 September 2026 (commit `d1980b3`,
"Update deck.html"), set against the version Claude had drafted the day before
(`c49a186`). Where the two differ, his version is the rule.

**Worked reference:** `weeks-semantics2/week-01/deck.html`. Second worked
example, built to these rules: `weeks-semantics2/week-02/deck.html`.

This sits alongside the prose rules in `CLAUDE.md` § Conventions › House style
(plain titles, no em-dashes, no "N X, one Y", no contrastive "X, not Y",
fragments over flow, statements over questions). Those apply to every word
here. The sister document for printed sheets is `docs/handout-style.md`.

---

## 1. What the 14 September edit changed

The draft had 43 slides. The edit left 27. What went, and what that implies:

| Change | Rule it sets |
|---|---|
| Deck cut to what one 50-minute lecture covers; Historical, Formal and Typological sections removed and held for the next session | **One deck, one lecture.** Draft to the hour. Around 27 to 34 slides including dividers and question slides |
| "Act I / Act II", "Two acts" became "Part 1 / Part 2", "Two parts" | No theatrical framing |
| Deleted: "Hold that thought for Act II", "Remember that; the trouble starts exactly here", "The Formal lens repairs this today", "Run it on anything", "Act I's promise" | **No forward teasers and no commentary on the lecture itself.** A slide states its content and stops |
| Deleted callout labels "The killer fact", "One family", "No names needed" together with their summarising paragraphs | No dramatic labels. No synthesis paragraph restating what the rows already say |
| "news" became "informative" | The plain technical word |
| Kickers removed from the overview and roadmap slides ("The shape of the hour", "Through four lenses", "The question behind the term") | Overview slides carry a title only |
| Three readings slides, each with "What it is / Why now / How to read it", became one slide holding the citation | **Readings: citation only**, in a `.qref` with a `.src` line |
| Housekeeping moved from the end to directly after the roadmap, and cut to facts | Administrative slides come first and carry no rationale |
| Opening hook (Frege's puzzle on slide 2) moved into the Empirical section; deck now opens Title, overview, roadmap | **Open near the content.** Question slides live inside the lens they serve |
| Frege's Puzzle answer slide cut from 105 words to 38 | An answer slide gives the facts and the asymmetry. The module-level moral goes |
| Divider text cut to a title and one short line | Dividers: `h2` plus one `.ask` fragment |
| Examples renumbered (1) to (15) in order of appearance | **Examples numbered continuously through the deck**, in `.egpanel` and `.convo` rows; they never restart per slide |
| "One rule" corrected to "Two rules", Predicate Modification added | Accuracy over neatness |
| Aoife became Anna in the toy model | Names on slides are his call; keep deck and handout consistent |
| Added a "Same model. Your turn" slide and an "Intensional adjectives" slide | Interaction slides are wanted; so is extra data |
| Wrap-up and "Week by week" slides removed; deck ends on "Lecture 1 closes" with one line about Thursday | **Close plainly.** No recap slide |
| Subtitle line added to the title slide: "Lecture 1 · The extensional system and its limits" | When a week has more than one lecture, the title slide names the lecture |

Week pointers that survived the edit: a bare "Weeks 2 and 3" at the end of a
row, and the closing line about Thursday. A pointer is a number, never a
sentence about what is coming.

---

## 2. Running order

1. **Title** (`.a-title-wrap`; watermark glyph; week number as `h1`; week title as `.a-course-sub`).
2. **Overview** — `h2` only; `.q-banner` with the week's framing question (the one place a question is allowed); two `.erow`s; `.figs-line`.
3. **Today** — `.lxr3` roadmap, one `.stop` per lens, `.rmb` bullets naming the slides.
4. **Housekeeping** (week 1 only) and **readings** (one slide).
5. **Four lenses in the fixed order**: Empirical, Historical, Formal, Typological. Each opens with an `.lxd2` divider. Content may sit before a divider when it bridges from the previous part (week 1's nesting problem).
6. **Lecture closes** — `.qask` + `.bigq`, one line.

Thursday is the handout session from week 2 onwards, so a week has one deck.

---

## 3. Slide patterns in use

All are in the week 1 file; copy the markup from there.

| Pattern | Classes | Use |
|---|---|---|
| Editorial rows | `.b-slide.dB` › `.erow` › `.lb` + `.tx` (`.tx.tight` for longer text) | The workhorse. Label names the thing; text is fragments. First row takes `style="border-top:none"` |
| Example panel | `.egpanel` › `.eghead`, `.eg` › `.no` + `.ex` › `.gl` | Numbered object-language data with a gloss line. `#` marks in `var(--lens)` |
| Formula panel | `.egpanel` › `.fx` + `.fxnote` | Display maths with a one-line note |
| Two arms | `.brn` › `.split`, `.arms` › `.arm` / `.arm.meant` | A contrast of two readings or two cases |
| Four rows | `.fourways` › `.fw` › `.fl` (+`small`) + `.ft2`, `--fc` set to a lens colour | A small taxonomy: label, sub-label, one line of data |
| Worked steps | `.b-steps` › `.b-step` (+`.step-future` for the last) | Derivations and evaluations |
| Question | `.qwrap` › `.qask` (imperative: "Decide: …", "Same model. Your turn") + `.convo` rows + `.qsrc` | Always followed by an answer slide sharing its `data-sec` |
| Portraits | `.figrow` / `.figtwo` / `.figthree` › `.portrait` (`.npf` + `.npmono` when no free photo) | Real photos when legitimately available; source and licence in `.dt` and in an HTML comment; identity checked |
| Lineage | `.lineage` › `.ln` › `.dot` `.era` `.nm` `.ds`, then `.roots` | The historical spine, five nodes |
| Week tag | `.wktag` inside `h2` | A bare "Week N" |

Emphasis: `<strong>` for the one term a row introduces; `<em>` for
object-language words. Roughly one `<strong>` per row.

---

## 4. Budgets

- Content slide: 60 to 125 words. Week 1's heaviest is 123.
- Question slide: under 40.
- Divider: under 25.
- A `.fourways` slide: four rows, five at most.
- An `.erow` stack: three or four rows; a fifth only with `.tx.tight`.

---

## 5. Wiring

- `<body class="pal-a" data-week="N">`; `theme-teal.css`; `sem2-meta.js` then `sem2-rail.js`.
- Every content slide: `.b-slide` with a `data-sec` key and an empty `<aside class="mrail"></aside>`. The script at the foot of the file fills the sidebar from `TITLES` and `GROUPS`; **update both when slides are added, cut or renamed**, plus the hard-coded week number and title in `init()`.
- Lens colour on a group via `sc:"--lens-emp"` and so on. A sub-block inside a lens (week 2's "What a world is") gets its own group with the parent lens colour.
- `data-screen-label`: two-digit running number; dividers take `§ Lens` and are skipped in the count.
- `data-label`: `Lens ·Slide name`; question and answer slides end `, Q` and `, A`.
- The deck carries its own `<style>` block (copied from week 1). Additions for a week go at the end of it with a comment. Shared scaffold patterns stay in `deck-slides.css`.
- MathJax: `\( … \)`, `\[ … \]`, `\sem{…}`.

---

## 7. Type (from week 2)

Thomas's call, September 2026: set the materials in the LaTeX typeface and make
slide text clearer and larger, keeping the week 1 patterns.

- Link `shared/font-latex.css` after the theme. It points `--serif`, `--sans` and
  `--mono` at **New Computer Modern, Book weight**, self-hosted in
  `shared/fonts/newcm/`. MathJax already sets formulas in Computer Modern, so text
  and maths now match. Handouts link the same file after `handout-classic.css`.
- The text faces have no logic symbols; a maths face supplies them by
  `unicode-range`. **No face has subscript digits**: write `w<sub>1</sub>` in HTML
  and a `<tspan>` in SVG, never `w₁`.
- **Type scale (1920 canvas), settled on the week 2 aesthetic pass.** Week 1's
  29px body is about 14pt on a 13.3in slide and left the lower third of most slides
  empty. Week 2 defaults: `.erow .tx` 40px (tight 37), examples 40 with 28px
  glosses, `.fourways .ft2` 35, arms 35, display maths 40, question lines 44 (big
  56), uppercase labels 21 to 23, credits 17, sidebar 13 to 16. Floors: running
  text 30, glosses and notes 24, labels 19.
- **Two fallbacks, set as a class on `.b-main`:** `dense` (about 32px body; for a
  slide with a portrait column, a panel plus rows, or five table rows) and `snug`
  (default sizes, tighter row padding). Reach for them only after trimming words.
  Measure, do not eyeball: content must end above y = 960 of 1080.
- SVG figure text follows the same floor: world labels 32, captions 28.
- A slide that sets up a handout block carries the block's title: week 2 has
  Validity, Frame conditions, Axioms and flavours, Substitution under necessity on
  both. The closing slide lists what Thursday's sheet practises.

---

## 8. One notation

Thomas's rule, September 2026: **pick one notation and stick to it** across deck and
handout; give the alternatives one slide ("Other notations") and one table on the
sheet. For modal logic the module's notation is: `wRw′` ("w sees w′"), `R(w)` for
the set of worlds w sees, `M, w ⊨ φ`, `V(p)` as a set of worlds, `⟦φ⟧` for the set
of worlds where φ is true, axioms T, D, 4, B, 5. Everything else (`R(w,w′)`,
`R(w)(w′)`, `acc`, `⟦φ⟧^{w,M} = 1`, M for T, E for 5) appears only on the
alternatives slide and in the sheet's notation table.

---

## 9. Before it ships

- [ ] Slide count fits the hour.
- [ ] No sentence on any slide talks about the lecture, a later slide, or a later week beyond a bare week number.
- [ ] Examples run (1) to (N) without gaps; cross-references still point at the right numbers after any cut.
- [ ] Every question slide has its answer slide.
- [ ] Linguistic data carries a source; nothing invented stands as attested.
- [ ] Portraits: right person, licence stated, file localised to `week-NN/images/`.
- [ ] `TITLES` / `GROUPS` match the slides; sidebar shows the right week.
- [ ] `npm test` green.
