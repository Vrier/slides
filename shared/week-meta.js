/* ============================================================
   shared/week-meta.js — LI7869 Describing Meaning
   The term's week catalogue + the four-lens model.
   Loaded by every deck (the rail reads it); also the single
   reference for what each week is about.

   Each deck/handout file is otherwise SELF-CONTAINED — its slide
   text lives in its own HTML. This file only drives:
     · the deck progress rail (module section + week title)
     · the default lens prompts used when scaffolding a new week
   ------------------------------------------------------------
   To rename or re-section a week, edit its entry here.
   ============================================================ */

window.MODULE_SECTIONS = [
  "Foundations",        // 0 — wk 1
  "Logic & Sets",       // 1 — wk 2, 3
  "Nouns & Plurality",  // 2 — wk 4
  "Quantification",     // 3 — wk 5, 6
  "Reading Week",       // 4 — wk 7
  "Events & Roles",     // 5 — wk 8, 9
  "Time & Aspect",      // 6 — wk 10, 11
  "Modality",           // 7 — wk 12
];

/* The four lenses, in fixed teaching order, with the question each asks
   and the SVG glyph id used in markup (<use href="#g-emp"> …). */
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

/* section = index into MODULE_SECTIONS. lenses = per-week framing
   (q = section question shown on roadmap/divider, d = one-line gloss). */
window.WEEKS = [
  { no: 1, title: "What is Meaning?", section: 0, lenses: {
    empirical:   { q: "The data: synonymy, entailment, anomaly", d: "Sentences that mean the same, entail one another, or are simply odd — the phenomena to explain." },
    historical:  { q: "From Aristotle to Frege", d: "The long tradition of asking what words stand for, and why it had to be made precise." },
    formal:      { q: "Introducing the model", d: "Domains, individuals, truth values — the basic machinery of model-theoretic semantics." },
    typological: { q: "Is meaning universal?", d: "Whether semantic universals or radical difference better describes cross-linguistic meaning." },
  }},
  { no: 2,  title: "Sentences and Connectives", section: 1, lenses: blankLenses() }, // propositional logic
  { no: 3,  title: "Predicates and Set Theory", section: 1, lenses: blankLenses() }, // sets
  { no: 4,  title: "Stuff and Things",          section: 2, lenses: blankLenses() }, // mass, count & plurals
  { no: 5,  title: "Quantifiers and Scope",     section: 3, lenses: blankLenses() },
  { no: 6,  title: "Generalised Quantifiers",   section: 3, lenses: blankLenses() },
  { no: 7,  title: "Reading Week",              section: 4, lenses: blankLenses(), reading: true },
  { no: 8,  title: "Verbs and Events",          section: 5, lenses: blankLenses() }, // event semantics
  { no: 9,  title: "Thematic Roles and Argument Selection", section: 5, lenses: blankLenses() },
  { no: 10, title: "Aktionsart and Time",       section: 6, lenses: blankLenses() },
  { no: 11, title: "Tense and Aspect",          section: 6, lenses: blankLenses() },
  { no: 12, title: "Necessity and Possibility", section: 7, lenses: blankLenses() }, // modality
];

/* Empty lenses fall back to the generic prompts at scaffold time. */
function blankLenses() {
  return { empirical: { q: "", d: "" }, historical: { q: "", d: "" }, formal: { q: "", d: "" }, typological: { q: "", d: "" } };
}

window.getWeek = function (no) { return window.WEEKS.find((w) => w.no === Number(no)); };

/* Module-level documents. This content is DUAL-CODED: the same weeks are taught as
   the undergrad Semantics I (LIU11011, default) and the MPhil Describing Meaning
   (LI7869). The WEEKS above are SHARED — only the identity label and these distinct
   overview/assessment documents differ. Weightings from the 2025-26 handbooks.
   status: 'none' until authored — reserves the room, no content yet. */
window.MODULE = {
  default: "liu11011",
  identities: [
    { key: "liu11011", code: "LIU11011", name: "Semantics I", term: "Semester 2 / Hilary", coordinator: "Dr Thomas Stephen",
      overview: { file: "overview-liu11011.html", status: "none" },
      assessments: [
        { no: 1, title: "Data-analysis assignment", weight: 30, file: "assessments/liu11011-a1.html", status: "none" },
        { no: 2, title: "Written assignment", weight: 70, file: "assessments/liu11011-a2.html", status: "none" },
      ] },
    { key: "li7869", code: "LI7869", name: "Describing Meaning", term: "Semester 2 / Hilary", coordinator: "Dr Thomas Stephen",
      overview: { file: "overview-li7869.html", status: "none" },
      assessments: [
        { no: 1, title: "Exercises", weight: 40, file: "assessments/li7869-a1.html", status: "none" },
        { no: 2, title: "Essay", weight: 60, words: 3000, file: "assessments/li7869-a2.html", status: "none" },
      ] },
  ],
};
