# Week 1 Deck — Design Choices

**File:** `weeks-semantics1/week-01/deck.html` · LI7869 *Describing Meaning* · "What is Meaning?"
**Status:** worked reference for deck design across the module (complements the `week-03` reference for lens/strand plumbing).

This document records the design decisions made while building the Week 1 deck, so future weeks (and future modules) can follow them without re-deriving the reasoning. Where a decision replaced an earlier attempt, the rejected option is noted — those rejections are as binding as the choices.

---

## 1 · Vocabulary: "strands", not "lenses"

The module's four organising perspectives are called **strands** in all student-facing copy. "Lenses" survives only in code (CSS keys `lens-empirical`, `--lens-emp`, `lens.css`, etc.) — renaming the code would touch all five modules for no student-visible gain.

- Rationale: *strands* is real curriculum vocabulary; they run through the whole term and weave together. Runners-up considered: threads, angles, passes.
- The four strands for this module: **Empirical · Historical · Formal · Typological**.
- Divider slides announce "STRAND 0N / 04".
- In the sidebar, groups carry **content titles**, not strand names (see §5). The Typological group is titled **"Metalanguage"** — after Week 1's actual content — on the lecturer's instruction.

## 2 · Content architecture

The deck runs seven groups, ~33 slides:

1. **Introduction** — framing hook ("How do we know?"), then **"Today"**: the roadmap slide titled just *Today*, showing the four strands with their sub-sections as bullet lists (not prose descriptions).
2. **What does this mean? (Empirical)** — five *question → consideration* pairs (see §3): Hegel (opacity), Bilbo (paraphrase), telescope (structural ambiguity), salt (literal vs. Speaker meaning), *Tír gan teanga* (translation). Closes with "What do we study in semantics?".
3. **A history of meaning (Historical)** — map of the tradition, then figure slides: Aristotle → Stoics → Medievals → Frege → the modern turn (Tarski/Davidson/Montague).
4. **The formal toolkit (Formal)** — truth conditions, entailment, tautology/contradiction/contingency, validity. Definitions + one worked example each; *practice lives in the handout*, and each slide points to its handout exercise in a uniform format ("In the handout · Exercise B: classify each").
5. **Metalanguage (Typological)** — the Davidson T-schema hook: "Snow is white" looks empty because object- and meta-language coincide; a foreign sentence makes the biconditional informative; conclusion = a formal meta-language neutral across languages.
6. **The limits** — imperatives, questions, presupposition, fiction, nonsense — each with a *diagnosis* of what goes wrong, not a bare list.
7. **Housekeeping + wrap-up** — kept near the end (lecturer's preference), never strand-coded.

**Divider slides** (`.lxd2`) open each strand with numeral, glyph, strand label, a content title, and a framing question.

## 3 · The question → consideration rhythm

Every "What does this mean?" item is **two slides**:

- **Question slide:** a very large italic serif "**What does this mean?**" (`.bigask`, 64px, strand glyph at left) sits *above* the material. Then the quotation large (`.bigq`), then attribution (`.qsrc`), then the portrait. These enter in a stagger (see §9): question first, quote next, attribution + image last — mirroring how the lecturer reveals them live.
- **Consideration slide:** repeats the quotation compactly (`.qref`), then works through the answer with the editorial row pattern (§4).

Attribution conventions: portrait captions carry **name + dates only** — never the work title (that lives in the attribution line). Bilbo is attributed "on his eleventy-first birthday". Hegel replaced the original Kierkegaard quote (lecturer's swap); the consideration answer is deliberately blunt: *"No idea." / "Maybe some philosophers know, but understanding this meaning is not a matter of understanding language."*

## 4 · Visual direction: editorial hairline

Three directions were prototyped for content slides: (A) tinted strand cards, (B) editorial hairline, (C) a denser panel style. **Direction B won** — the lecturer explicitly rejected the coloured-boxes look ("colour-coded boxes that aren't coded to our strands").

The Direction B kit (all in the deck's `<style>`; shared plumbing in `deck-slides.css` / `lens.css` / `dir-a.css`):

- **`.erow`** — the workhorse: a small-caps sans label column (`.lb`, ~200px) beside serif/sans body text (`.tx`), rows split by thin hairlines. No boxes, no fills.
- **`.lead`** — one-sentence serif stand-first under the heading, followed by **`.accrule`** — a short strand-coloured accent rule. This pair is the standard opening for content slides.
- **`.egpanel`** — the numbered-example block: a hairline-framed panel with an `.eghead` mini-heading and `.eg` rows: `(1)`, `(2)`… numbers in mono, object-language sentences in italic serif, verdicts as `✓ holds` / `✗ fails` chips.
- **`.aline`** — a single-line takeaway anchored by the amber marker (see §6). Used sparingly; several were *removed* on request — don't close every slide with a moral.
- **`.lens-kick`** — small strand tag (glyph + name) at the top of every content slide; the strand also colours the slide's accent variable `--lens`.

**One deviation only:** the summary slide uses strand-tinted recap rows (`.recap .rr`) — a colour-coded moment is earned there because the content *is* the four strands.

## 5 · The sidebar (`.mrail`)

Replaced the old module-wide course rail. Decisions, in order of iteration:

- **Compact:** 262px (down from 392px). Crest + "LI7869 / Week 1" header, TOC, footer with week title.
- **Lecture-aware:** it lists *this lecture's* sections, not the course structure.
- **Real titles, strand-coloured:** entries are the actual section titles ("Aristotle", "Truth conditions"…), tinted by their strand — not the strand names themselves.
- **Accordion:** sections group under seven thematic headings (Introduction / What does this mean? / A history of meaning / The formal toolkit / Metalanguage / The limits / Housekeeping). Only the current group is expanded; done groups dim.
- **Hyperlinked:** every group heading and entry is a real `<a href="#N">` that drives `deck-stage.goTo()` — clickable navigation, and the URLs survive reload.
- **Typography:** group headings are **11px uppercase Source Sans, non-italic** — *not* serif. (A serif/italic experiment was rejected as "curly and weird".)
- **Implementation:** the rail is script-rendered from a `TITLES` map + `GROUPS` array at the foot of the deck, keyed by each slide's `data-sec` attribute. **Gotcha:** the group-title span uses class `gt`, which collided with a global `.gt` rule (the interlinear-gloss free-translation line) — the sidebar rule now scopes `.mrail .ghd .gt` explicitly. Avoid two-letter utility class names.

## 6 · Colour and emphasis

- **Palette:** TCD tokens (`tokens.css`) — TCD blue, ink `#07284a`, warm greys. Strand accents from `lens.css`. No new hues invented; harmonics via `color-mix`/oklch when a tint is needed.
- **The emphasis system is deliberately separate from the strand system**, so bolding never reads as strand-coding:
  - `<strong>` → ink-coloured semibold, for in-sentence emphasis.
  - `<mk>` → a single **amber** highlight marker, the only non-strand accent colour. At most one or two per slide.
  - Verdict green/red (`--c-ex` / `--c-exr`) appear *only* in example verdicts, ✓/✗ cells, and the Bilbo grids — never for emphasis.
- **Headings:** consistent patterns per slide family. Figures: "Name: contribution" (*Aristotle: the first formal logic*). Empirical considerations: the phenomenon name (*Structural ambiguity*, *Literal vs. Speaker meaning*, *Meaning across languages*).

## 7 · Prose rules

- **No em dashes anywhere.** 117 were swept; use commas, colons, semicolons, or a new sentence. (Comma splices introduced by the sweep were later repaired — prefer restructuring the sentence over a bare comma.)
- **No LLM-isms:** no "The payoff", "at a glance", "delve", etc. Labels name the content ("Why formal, not English").
- Object language in *italic serif* (`.sent`-style); notation in mono; glosses follow Leipzig style (see §8).
- Definitions are stated once, in the deck, in the same wording the handout uses.

## 8 · Diagrams

Principle: **every core concept gets one purpose-built diagram**, drawn in HTML/CSS or inline SVG in deck colours — no screenshots of other people's figures, no decorative charts. The inventory:

- **Structural ambiguity:** labelled-bracket notation *plus* two SVG constituency trees (high vs. low PP attachment), one per reading.
- **Bilbo's speech:** dual 12×12 dot grids (144 guests, "one gross"), script-filled, one per clause, with legend and a vague-quantity scale bar. Ported from the lecturer's own widget; colours kept from that widget (they're data colours, not strand colours).
- **Literal vs. Speaker meaning:** two-armed split, boxes titled "Literal · Semantic Meaning" / "Speaker · Pragmatic Meaning".
- **Interlinear gloss** (Pearse): word-aligned gloss with mono uppercase gloss line, then `Lit.` and `Free` translations — academic-linguistics style.
- **Historical:** map-of-the-tradition timeline; three syllogistic moods (Barbara/Celarent/Darii) as `.arg` premise-bar-conclusion stacks; the **five Stoic indemonstrables** as a schema+instantiation table (day/light/night examples); the **three modes of supposition** (*man* → individuals / concept / word); a hand-drawn SVG of **Frege's Begriffsschrift** quantifier-over-conditional beside modern FOL `∀x(F(x) → G(x))`.
- **Formal:** truth-conditions **situation-sorting strip** (✓/✗ situation cards, actual world pinned as unknown); entailment **inclusion diagram** (A-situations nested in B-situations) beside judged examples; tautology/contradiction/contingency as ✓/✗ **cell rows**.
- **Typological:** the T-schema examples, then a left-to-right flow — four object-language chips (English, Irish, French, Japanese) → formal meta-language node `white(snow)` → a photo of real snow ("the condition the world must meet").

## 9 · Motion

- One entrance animation: `riseIn` (16px rise + fade), applied via `.anim` with per-element `--d` delays.
- **Gated** on `[data-deck-active]` and `@media (prefers-reduced-motion: no-preference)`; the visible end-state is the base style, so print/PDF/reduced-motion show finished slides.
- Used only on the question slides' reveal sequence (question → quote → attribution/portrait). Delays kept short (0.35s / 0.7s). No loops, no decorative motion.

## 10 · Imagery

- **Portraits from Wikimedia Commons**, hotlinked via `https://commons.wikimedia.org/wiki/Special:FilePath/<File>.jpg?width=700` with `referrerpolicy="no-referrer"`: Aristotle (Altemps bust), Chrysippus (BM bust), Ockham (stained glass), Hegel (Schlesinger), Frege, Gödel, Tarski, fresh snow. *Caveat:* Commons' CDN blocks canvas capture, so these render live but come out blank in DOM-to-image screenshots/exports — accepted trade-off; swap to local copies if offline bundling is ever needed.
- **Local images** (`images/`): davidson.jpg, montague.jpg (user-supplied — no free Commons portrait exists), bilbo.jpg, pearse.jpg, buridan.jpg (user-supplied manuscript; he's "Jean", not "John").
- **Real photographs over generated art** — a canvas-generated "snow" image was rejected and replaced with a Commons photo.
- Figures with no reliable free portrait get a name-plate card, not a fake image.

## 11 · Biographies

Every historical figure carries a **three-sentence biography** — placed **in the right-hand text column** (`.fbio`) above the content rows, *not* squeezed under the portrait (a caption-bio experiment was rejected as cramped). On the three-portrait "modern turn" slide, bios sit in a `.tribio` three-column row under the portraits. Portrait captions stay minimal: name + dates (+ place where it helps).

## 12 · Slide plumbing (maintenance notes)

- Every content slide: `<section class="slide">` → `.b-slide.pal-a.lens-<strand>` with `data-sec="<key>"`, an empty-in-source `.mrail`, and `.b-main` (often `.dB`).
- `data-sec` keys drive the sidebar; adding a slide means updating `TITLES`/`GROUPS` in the deck-foot script (and `index.html`'s `WEEKS` if status changes).
- `<body data-week="1">` feeds the shared rail filler; MathJax loads for `\( … \)`; `\sem{x}` macro renders ⟦x⟧.
- Overflow budget: `.b-main` must not scroll at 1920×1080 — checked per-slide after every structural edit.
- Direct-editability: all tags closed, all attributes quoted; slide text lives in the HTML, not in scripts (the sidebar and Bilbo grids are the two scripted exceptions).

## 13 · Things we tried and rejected (do not resurrect)

- Coloured content boxes / rainbow accents uncoordinated with strands.
- Strand names as sidebar entries; serif or italic sidebar group headings; the 392px course-structure rail.
- Em dashes; "The payoff"-style labels.
- Kierkegaard as the opacity example (now Hegel).
- Work titles in portrait captions.
- A flat 12-row week-by-week (now grouped: Meaning & logic / Quantification / Events, time & modality).
- Caption-position biographies.
- Generated imagery where a real photograph exists.
- Closing every slide with an `.aline` moral.
