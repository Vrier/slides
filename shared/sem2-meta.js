/* ============================================================
   shared/sem2-meta.js — LIU33008 Semantics II
   Third catalogue, sister to week-meta.js (Describing Meaning)
   and prag-meta.js (Linguistic Pragmatics). Same global API
   (MODULE_SECTIONS / LENSES / WEEKS / getWeek) so the deck rail
   filler reads it unchanged.

   Semantics II is the INTENSIONAL continuation of Describing
   Meaning: it assumes Sem I (sets, predicate logic, λ, events,
   times) and adds possible worlds, rebuilding the clausal /
   verbal operators — negation, modality, attitudes, conditionals,
   aspect, evidentiality — at an advanced, cross-linguistic level.

   Each week carries the KEY FIGURES it covers (figures[]). Lens
   framing (q/d) is filled in as each week's deck is authored;
   Week 1 (the recap-and-pivot) is worked. Full per-week lens
   content lives in /Semantics II - Course Plan.md.
   ============================================================ */

window.MODULE_SECTIONS = [
  "Foundations",            // 0 — wk 1  (recap + the intensional turn)
  "Modality",               // 1 — wk 2, 3
  "Attitudes & Embedding",  // 2 — wk 4, 5, 6
  "Reading Week",           // 3 — wk 7
  "Conditionals",           // 4 — wk 8, 9
  "Time & Aspect",          // 5 — wk 10
  "Evidentiality",          // 6 — wk 11
  "Interactions",           // 7 — wk 12
];

/* Fixed teaching order. key = CSS hook (unchanged from Sem I, so every
   lens-* class + colour resolves); label = what the student sees. */
window.LENSES = [
  { key: "empirical",   label: "Empirical",   glyph: "g-emp", roman: "I",
    prompt: "What linguistic data motivates this?" },
  { key: "historical",  label: "Historical",  glyph: "g-his", roman: "II",
    prompt: "Who developed this, and in what context?" },
  { key: "formal",      label: "Formal",      glyph: "g-for", roman: "III",
    prompt: "What formal machinery do we need?" },
  { key: "typological", label: "Typological", glyph: "g-typ", roman: "IV",
    prompt: "How does it vary across languages?" },
];

/* section = index into MODULE_SECTIONS. figures = key figures the
   week covers (drives historical framing + the workspace card). */
window.WEEKS = [
  { no: 1, title: "Recap & the Intensional Turn", section: 0,
    figures: ["Frege", "Carnap", "Montague"], lenses: {
      empirical:   { q: "Where extensional meaning runs out", d: "Substitution failures, modal and attitude contexts, non-referential readings: the data a truth-in-a-model theory cannot capture." },
      historical:  { q: "Frege's puzzle to Montague", d: "Frege on the morning and evening star, Carnap's intension and extension, and Montague's step from an extensional to an intensional fragment." },
      formal:      { q: "From models to intensions", d: "Recap of domains, ⟦·⟧, predicate logic, λ and events; then the core new idea: an intension as a function from possible worlds (and times) to extensions." },
      typological: { q: "Is the type inventory universal?", d: "Whether every language encodes the same intensional distinctions: the cross-linguistic thread the term keeps returning to." },
  }},

  { no: 2, title: "Worlds, Intensions & Modal Logic", section: 1,
    figures: ["C. I. Lewis", "Carnap", "Kripke"], lenses: {
      empirical:   { q: "Must and might", d: "Displacement, possible worlds and intensions; duality, scope and the flavours of modality: modal words as quantifiers over possibilities." },
      historical:  { q: "C. I. Lewis to Kripke", d: "Strict implication and the five systems; Carnap's state-descriptions; Dublin in 1956; Kripke's and Hintikka's semantics in worlds; then what a world is." },
      formal:      { q: "Frames, models, validity", d: "\u25a1 and \u25c7 as quantifiers over accessible worlds: frames, models, truth at a world, lexical entries for must and may, and the conditions on R." },
      typological: { q: "Modal systems across varieties and languages", d: "Scots and Ulster double modals, Irish English epistemic mustn't, and Nez Perce -o'qa, a possibility modal with no dual." },
  }},

  { no: 3, title: "The Kratzer System", section: 1,
    figures: ["Kratzer"], lenses: blankLenses() },

  { no: 4, title: "Attitude Reports", section: 2,
    figures: ["Frege", "Hintikka", "Quine"], lenses: blankLenses() },

  { no: 5, title: "Factivity, Selection & Neg-Raising", section: 2,
    figures: ["Kiparsky & Kiparsky", "Karttunen"], lenses: blankLenses() },

  { no: 6, title: "Hyperintensionality", section: 2,
    figures: ["Cresswell", "Fine"], lenses: blankLenses() },

  { no: 7, title: "Reading Week", section: 3, reading: true, lenses: blankLenses() },

  { no: 8, title: "Indicatives & the Restrictor Analysis", section: 4,
    figures: ["Kratzer", "Lewis", "Stalnaker"], lenses: blankLenses() },

  { no: 9, title: "Counterfactuals & Similarity", section: 4,
    figures: ["Stalnaker", "Lewis", "Iatridou"], lenses: blankLenses() },

  { no: 10, title: "Aspect & the Perfect", section: 5,
    figures: ["Klein", "Dowty", "Vendler"], lenses: blankLenses() },

  { no: 11, title: "Evidentiality", section: 6,
    figures: ["Aikhenvald", "Faller", "Matthewson"], lenses: blankLenses() },

  { no: 12, title: "Modals & Tense", section: 7,
    figures: ["Condoravdi", "Hacquard", "Bhatt"], lenses: blankLenses() },
];

function blankLenses() {
  return { empirical: { q: "", d: "" }, historical: { q: "", d: "" }, formal: { q: "", d: "" }, typological: { q: "", d: "" } };
}

window.getWeek = function (no) { return window.WEEKS.find((w) => w.no === Number(no)); };

/* Module-level documents. Semantics II is a single undergrad module (LIU33008) — no
   MPhil twin. Three assessments per the TJH Linguistics handbook 2025-26: 10/30/60.
   (Structured as an identities[] array to match the other catalogues.)
   status: 'none' until the file is authored. No content yet — reserves the room. */
window.MODULE = {
  default: "liu33008",
  identities: [
    { key: "liu33008", code: "LIU33008", name: "Semantics II", term: "Semester 1 / Michaelmas", coordinator: "Dr Thomas Stephen",
      overview: { file: "overview-liu33008.html", status: "ready" },
      assessments: [
        { no: 1, title: "Assessment 1", weight: 10, file: "assessments/liu33008-a1.html", status: "none" },
        { no: 2, title: "Assessment 2", weight: 30, file: "assessments/liu33008-a2.html", status: "none" },
        { no: 3, title: "Assessment 3", weight: 60, file: "assessments/liu33008-a3.html", status: "none" },
      ] },
  ],
};
