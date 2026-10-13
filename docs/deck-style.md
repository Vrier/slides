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
| Wrap-up and "Week by week" slides removed; deck ends on one line about Thursday | **End plainly.** No recap slide. (Week 1 headed that slide "Lecture 1 closes"; Thomas has since ruled the word out, see §2.) |
| Subtitle line added to the title slide: "Lecture 1 · The extensional system and its limits" | When a week has more than one lecture, the title slide names the lecture |

Week pointers that survived the edit: a bare "Weeks 2 and 3" at the end of a
row, and the closing line about Thursday. A pointer is a number, never a
sentence about what is coming.

---

## 2. Running order

1. **Title** (`.a-title-wrap`; watermark glyph; week number as `h1`; week title as `.a-course-sub`).
2. **This week** — `h2` only; `.q-banner` with the week's framing question (the one place a question is allowed); two `.erow`s; `.figs-line`.
3. **Concepts and skills** — the week's outcomes, two columns (§ 11).
4. **Today** — `.lxr3` roadmap, one `.stop` per lens, `.rmb` bullets naming the slides.
5. **Housekeeping** (week 1 only) and **readings** (one slide).
6. **Four lenses in the fixed order**: Empirical, Historical, Formal, Typological. Each opens with an `.lxd2` divider. Content may sit before a divider when it bridges from the previous part (week 1's nesting problem).
7. **Concepts and skills** again, word for word, as the last slide (§ 11). Nothing else closes the deck: no Thursday line, no recap, no wrap-up. Never "closes", on any slide (Thomas, September 2026).

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
| Question | `.qwrap` › `.qask` (a plain prompt, never prefixed "Decide:": "What the negation applies to", "Same model. Your turn") + `.convo` rows + `.qsrc` | Always followed by an answer slide sharing its `data-sec` |
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
  both. The Skills column of the Concepts and skills slide names what Thursday's
  sheet practises (§ 11).

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

## 9. Text register (from the LI7862 week 3 and week 4 reviews)

Read off Thomas's edits to the Linguistic Pragmatics week 3 deck and his review
of week 4, October 2026. Applies to every module.

**Rows.** A content row is one to three full explanatory sentences, in the
register of a textbook paraphrase, often from a named source. No fragments, no
telegraphic rows, no clipped lists of points. A bold lead opens a row only when it
names a **term being defined**, a **source** (author and year) or a **title** of a
work. A lead that is a label or subtitle ("The upshot.", "Rates.", "Why it
matters.", "Today.", "Both.") is wrong: rewrite the row so it needs none. No bold
inside a sentence for emphasis.

**No synthesis.** No closing line, no summary row, no "lesson" or pay-off line, no
row that restates what the slide has already shown. The slide ends on its last
piece of content. The one repetition allowed in a deck is the closing Concepts and
skills slide (§ 11), which repeats the opening one word for word.

**Question slides.** Only the data: the exchange, the sentence, the items. No
prompt, no instruction, no source line. If a heading is needed it is a plain topic
label ("Scales and strengthening"), never an explanation of the task. The sources
for a question slide's examples go on the answer slide that follows.

**Sources.** Every content and answer slide ends with a small source line
(`.srcl`): author (year), venue, what was taken. Attested data carries its source;
constructed examples are never presented as attested.

**Titles and dividers.** Titles name the thing ("Russell on negation", "The
barn"); no questions, aphorisms or wordplay, no "X in the wild". A divider is a
plain title plus one short descriptive line, with no "and the tests that show it"
tail.

**Phrasing.** The house rules in `CLAUDE.md` hold (no em-dashes, no "X, not Y",
no "one X, N Y", statements over questions), plus: no "rather than" contrasts, no
stock phrases, British spelling.

**Notation.** The deck's central notation is the one standard in formal
semantics, used throughout; alternatives students will meet get the one "Other
notations" slide (§ 8).

**Pointers.** A pointer to another week is a bare week number at the end of a row.

**Portraits.** Caption is name and dates only; the photo credit lives in an HTML
comment.

**Sparse slides.** Larger type and deeper rows (`roomy`) rather than empty space;
dense slides take `dense` or `snug`. Measure every slide.

**Before handing over**, sweep for: labelling leads, mid-sentence bold, summary
lines, prompts and source lines on question slides, em-dashes, contrastive
phrasing. Fix them without being asked.

---

## 10. Before it ships

- [ ] Slide count fits the hour.
- [ ] Concepts and skills: slide 3 and the last slide, identical, and identical to the handout's What you need to know block (§ 11; `npm test` checks).
- [ ] No sentence on any slide talks about the lecture, a later slide, or a later week beyond a bare week number.
- [ ] Examples run (1) to (N) without gaps; cross-references still point at the right numbers after any cut.
- [ ] Every question slide has its answer slide.
- [ ] No labelling bold leads; no summary or pay-off rows; no prompts or source lines on question slides (§ 9).
- [ ] Every content and answer slide ends with a source line.
- [ ] Linguistic data carries a source; nothing invented stands as attested.
- [ ] Portraits: right person, licence stated, file localised to `week-NN/images/`.
- [ ] `TITLES` / `GROUPS` match the slides; sidebar shows the right week.
- [ ] `npm test` green.

---

## 11. Concepts and skills

Thomas, 13 October 2026: every week starts and ends with what students are going
to learn and what they should be able to do by the end of the week.

**Planned first.** The Concepts and skills list is the first item of a week's
text plan, agreed with Thomas before the deck, handout or data task is planned in
detail. Everything else in the week is then planned against it: each concept is
introduced and defined somewhere in the week (deck or handout), and each skill
is practised by at least one exercise (the Thursday handout in Semantics II, the
Friday handout in Pragmatics II, the data analysis task in LI7862). A slide or
exercise that serves nothing on the list is a candidate for cutting; an item
nothing serves comes off the list.

**One list, three places.** The same two lists appear

1. on slide 3 of the deck, after This week and before Today;
2. as the last slide of the deck;
3. as the closing "What you need to know" block of the handout, with its two
   `.proc` columns headed Concepts and Skills (older sheets say Key notions).

The wording is identical in all three, character for character apart from
markup (`<em>` on slides, `<i>` on the sheet), so write symbols as Unicode
(⟨s, t⟩, ⊆) rather than MathJax in these items. `npm test` compares them. When
the lecture runs short, the list does not change: the handout covers the rest
of the week, so the closing slide still shows the whole week.

**Writing the items.**

- **Concepts**: the terms, notions and analyses of the week, as bare noun
  phrases with a full stop. "Hintikka semantics." "Frame conditions for knowledge
  and belief; closure." Several related terms may share an item, joined by
  semicolons.
- **Skills**: what a student can do by the end of the week, as an imperative
  that a handout exercise could test. "Evaluate attitude reports in a small
  model." "Compute the entropy of a distribution by hand." Verbs that name a
  checkable act (evaluate, compute, annotate, prove, diagnose, tag, derive,
  give the truth conditions of); never "understand", "appreciate", "be familiar
  with".
- Four to seven items per column, each short enough for one or two lines. No
  bold leads, no sources, no week pointers, no colons inside an item.
- This is the one place in a deck where fragments stand in for full sentences
  (§ 9): the slide is a checklist, as on the handout.

**Markup.** Copy the two slides from `weeks-semantics2/week-04/deck.html` (the
worked example). The pattern lives in `shared/deck-slides.css`:

```html
<section class="slide" data-label="Concepts and skills" data-screen-label="03">
  <div class="b-slide pal-a dB" data-sec="cs">
    <aside class="mrail"></aside>
    <div class="b-main dB">
      <h2 class="b-h">Concepts and skills</h2>
      <div class="cs-grid">
        <div class="cs-col" data-step="1"><div class="cs-head">Concepts</div><ol class="cs-list">
          <li>…</li>
        </ol></div>
        <div class="cs-col" data-step="2"><div class="cs-head">Skills</div><ol class="cs-list">
          <li>…</li>
        </ol></div>
      </div>
    </div>
  </div>
</section>
```

The closing copy takes `data-sec="cs2"`. In the sidebar script, add `cs` to the
Introduction group and give `cs2` its own last group titled Concepts and skills.
Use `.cs-grid.dense` when the columns run to six or seven items or several
two-line items, and measure: the grid ends above y = 960. No source line on
either slide.

**Enforcement.** `npm test` (§ 7 of `scripts/check.mjs`) fails a built deck in
Semantics II, Semantics III, LI7862 or Pragmatics II that lacks either slide,
whose two slides differ, or whose lists differ from the handout's closing block.
Scaffolds are skipped, and decks built before 13 October 2026 are baselined in
`CS_BASELINE`; retrofitting one means taking it off that list.
