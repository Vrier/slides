# Handout style — the classic sheet

The house pattern for printed handouts across all five modules, settled on
**Pragmatics II week 1** (Michaelmas 2026) and derived from the Semantics II
week 1 handout (`uploads/SemII_H1.pdf`).

**Worked reference:** `weeks-pragmatics2/week-01/handout.html`. Read it before
writing a new handout. This file explains *why* it looks the way it does, so
that the next handout can be written without another round of trimming.

**Starting one:** `npm run new -- <module> <week>` scaffolds it. The handout it
writes is this sheet — `templates/week/handout-classic.html`, with a worked
block 0 showing every component and the rules repeated as comments. Styling is
`shared/handout-classic.css`; do not re-declare it in the week file.

This is the printed-sheet style. It sits alongside the deck prose rules in
`CLAUDE.md` § Conventions › House style, which still apply to every word here:
plain titles that name things, no em-dashes, no "N X, one Y" slogans, no
contrastive "X, not Y", fragments over flow, statements over questions.

---

## 1. What the sheet is for

A handout is **data, definitions and procedures, with room to write**. It is
not a lecture in prose and not a reading. The student should be able to work
through it with a pen and end up with filled-in judgements.

Three consequences, all of which were enforced by hand on the week 1 sheet:

- **Recap only what this week needs.** Material that a later week will build
  properly gets cut, not previewed. Week 1 lost its blocks on embedded
  implicature and symmetry, on exhaustification, and on gradedness, because
  each of those has a week of its own.
- **Cut theory-architecture questions.** Exercises that ask the student to
  comment on how the account is put together were removed throughout. What
  survives asks them to run a procedure on data: state the implicature, apply
  the diagnostic, classify the environment, judge the pair.
- **Do not explain in the margin what the definitions already say.** See §4.

---

## 2. Page architecture

One numbered block per page, numbered **from 0**. Examples numbered
**continuously across the whole sheet**, `(1)` to `(N)`; they never restart per
block. Blocks are referred to by number in prose ("the diagnostics in block 2")
only when the reference survives editing — check after any cut.

Each block is a three-column grid:

| column | width | holds |
|---|---|---|
| `.num` | 30pt | the block number, 21pt bold |
| `.body` | `1fr` | everything the student reads and writes on |
| `.note` | 128pt | **bare citations only** (§4) |

Masthead (crest-less lockup, module code, lecturer, term), rule, `WEEK N ·
HANDOUT` kicker, then the document title. Block 0 follows on the same page.

### Print rules

`.sec + .sec` takes `break-before:page`, so every block starts on a fresh
sheet. **Do not put `break-inside:avoid` on `.sec`** — once a block carries a
definitions strip it is taller than a page, and the renderer responds by
emitting blank pages. Put `break-inside:avoid` on the small units instead:

```css
.defs, .proc, .task, .lines, table.rec, ol.exs li { break-inside:avoid; }
.sec h2, .task { break-after:avoid; }
```

Answer lines are **19pt** apart. Groups run to three lines; four or more is
usually a sign the block is over-long. A block that spills one stray task onto
a second page should be tightened rather than allowed to spill: fold a list
into the definitions, or drop a line from the longest group.

---

## 3. The definitions strip

Every block opens with one, directly under the `<h2>` (or under the Context
line where one survives). Ruled top and bottom, `DEFINITIONS` in the small-caps
`.sc` style, then term/gloss rows on a 118pt column.

```html
<div class="defs">
  <div class="sc">Definitions</div>
  <div class="d"><span class="t">Projection</span><span class="g">A presupposition survives embedding under an operator that removes the assertion.</span></div>
</div>
```

Rules that came out of the week 1 pass:

- **Use Thomas's own wording** from the earlier version of the course wherever
  it exists. The Pragmatics I decks and handouts in `uploads/` are the source
  for the Gricean and presuppositional vocabulary. Do not paraphrase a
  definition he has already written.
- **One line each.** If a gloss needs two sentences it is probably a Context
  line in disguise.
- **Do not define what the sheet does not use.** *Epistemic step* and
  *competence assumption* were cut together with the exercise that needed them.
  *Conventional implicature* was cut as already covered.
- **Do not open with a definition of the field.** *Pragmatics — meaning in
  context, derived by inference* was cut: the reader knows what module this is.
- **Fold short lists in.** Block 0's separate Cooperative Principle list became
  five definition rows (Cooperative Principle, Quality, Quantity, Relation,
  Manner). This is what made the block fit one page, and it reads better.
- **Phrase the vocabulary so it plugs into the logic spine.** The deck
  introduces natural deduction and monotonicity in week 1, so the handout says
  *Entailments cannot be cancelled and are monotonic*, defines **Monotonic**
  (Γ ⊢ A implies Γ ∪ {B} ⊢ A), and renames defeasibility as **Defeasibility /
  non-monotonicity**. Recap vocabulary should connect forward to the formal
  machinery, not sit in a separate Gricean vocabulary box.
- **Prefer entailment-based glosses to informal ones.** *Strengthening — what
  is communicated is logically stronger than what is said* was replaced by
  **Logical strength**: *A is logically stronger than B iff A entails B but B
  does not entail A*. **Scale** likewise became *a set of alternative
  expressions ordered by logical strength*, not "ordered, strongest first".

> **Watch the direction of the entailment.** The stronger statement is the one
> that *entails* the other: *all* entails *some*, so *all* is stronger. It is
> easy to write this backwards. Check any new definition against the *all > some*
> row of the scales table.

---

## 4. The margin: bare citations only

The `.note` column takes **author, year, title, and where relevant journal,
volume and pages. Nothing else.** No commentary, no teaching voice, no
forward-pointing to later weeks.

```html
<div class="note">
  <p><b>Fox &amp; Katzir 2011.</b> On the characterization of alternatives. <i>Natural Language Semantics</i> 19: 87–107.</p>
</div>
```

Every margin gloss on the week 1 sheet was cut on this rule, including several
that read well on their own: the remark that the maxims are assumptions hearers
make rather than rules speakers obey; that cancellability is the load-bearing
diagnostic; that step 5 to step 6 is the epistemic step; that *Hey wait a
minute* is the sharpest informal diagnostic; that the conjunction asymmetry
argues for incremental projection; and a forward-pointer about probabilistic
models having something to say about contextual ordering. Trailing glosses on a
citation go too — *Horn 1972 … The original scales* lost its last three words.

An empty margin is fine. Block 2 has one.

Historical anchors belong here as bare citations: Frege 1892 and Russell 1905
sit in the presupposition block with Strawson 1950, with no explanation of what
any of them argued.

---

## 5. Body blocks

In rough order of use.

- **Context line.** `<p><span class="runin">Context.</span> …</p>`. Optional,
  and the default is to leave it out. It survives only where it does work the
  definitions cannot: block 1's note that each maxim generates a characteristic
  kind of inference, block 3's framing of scalar implicature as a Quantity-style
  inference driven by alternatives. It was cut from blocks 0, 2, 4, 5, 6 and 7
  as scene-setting or as a restatement of the definitions.
- **`.proc`** — a small-caps heading plus `ol.steps`, for a procedure or a
  named set: the diagnostics, the Gricean derivation template, projection under
  embedding, the three environments.
- **`ol.exs`** — numbered object-language data. `.s` for the sentence (italic),
  `.ctx` for a bracketed context or a roman type label:
  `<li><span>(2)</span><span><span class="ctx">[someone arrives drenched]</span> <span class="s">Lovely weather.</span></span></li>`
- **`table.rec`** — reference tables, e.g. the scales. Header is a plain noun:
  `Scales`, not `Scale, strongest first`.
- **`.tasks` › `.task` + `.lines`** — the exercise. Lead with
  `<p><span class="runin">Exercise.</span></p>`, or fold the instruction into a
  run-in where the whole block is one task.
- A **dataset with no instruction and no answer lines** is a legitimate block.
  Block 6 (triggers) is ten numbered examples, a citation line in the margin,
  and nothing else; the instructions live in the lecture.

### Exercise wording

Name the mechanism exactly. *State the implicature and name the maxim at work*
became *state the implicature and the maxim flouted* — flouting is the thing
being exercised, so say so.

---

## 6. Titles

Plain names, per the standing rule. Two were fixed on the week 1 pass:

- *Three diagnostics* → **Diagnostics for Implicature** (a count is not a name)
- *Presupposition: asserted and presupposed content* → **Presupposition** (the
  subtitle repeated the first definition row)

The eight week 1 blocks, as a shape to imitate: Speaker meaning and the
Cooperative Principle · Implicature by maxim · Diagnostics for Implicature ·
Scalar implicature and strengthening · Where alternatives come from ·
Presupposition · Triggers · Holes, plugs and filters.

---

## 7. Notation

Light inline notation goes in **Unicode**, not MathJax: `Γ ⊢ A`, `Γ ∪ {B}`,
`⟨Cork, Wexford, Dublin, Belfast⟩`, `⟦x⟧`. MathJax needs JavaScript, so a
formula written as `\( … \)` renders in the browser but comes out as raw TeX in
any non-browser PDF pass. Keep MathJax loaded for genuine display maths; use
Unicode for anything that fits in a definition row.

---

## 8. Producing the PDF

The handout is printed from the browser: **Print → Save as PDF → A4 →
Background graphics on**. That is how `SemII_H1.pdf` was made and it is the
authoritative output — Chrome's pagination is what the students get.

Renderers other than a browser (WeasyPrint, for instance) approximate the
grid and can insert blank pages between blocks. Useful for checking content,
not for judging layout. Strip blank pages before sending anything out.

## 9. Before committing

- `npm test` green.
- No em-dashes in visible text; sweep for the vetoed slogan and contrastive
  title forms.
- Examples numbered contiguously from 1 after any cut, and no prose reference
  left pointing at a removed example or block.
- `<div>` count balanced; no NUL bytes. Edit existing files through the shell
  rather than whole-file rewrites.
- Line endings LF.

---

## Open items

- `handout.css` remains the styling for the older lens-based handouts, and
  `templates/week/handout.html` is still that sheet — swap the template name in
  `scripts/new-week.mjs` to scaffold one.
- `shared/handout-classic.css` also carries the figure and filled-table rules
  (`.draw`, `.mfig`, `table.rec.fill`) added for Semantics II week 2.
- One margin gloss survives against the rule in §4: block 1 still reads
  *Grice 1975. On flouting: the maxim is violated at the level of what is said,
  and observed at the level of what is meant.* Flouting is now a definition row
  in the same block, so this is a duplicate as well as a gloss.
- The week 1 homework (`exercises.html`) still follows the older lens-themed
  sheet and has not been brought onto this pattern.
