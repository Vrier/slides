/* ============================================================
   shared/prag-meta.js — LI7862 Linguistic Pragmatics
   Sister catalogue to week-meta.js (Describing Meaning).
   Same global API (MODULE_SECTIONS / LENSES / WEEKS / getWeek)
   so the rail filler can read it unchanged.

   The four lenses keep their CSS *keys* (empirical / historical /
   formal / typological) so every lens-* class and colour still
   resolves — but the FOURTH is re-labelled "Applied" for
   pragmatics and gets its own glyph id (g-app).
   ------------------------------------------------------------
   Each week carries the KEY FIGURES it covers (figures[]) and,
   where relevant, a reference link (ref). Lens framing (q/d) is
   filled in as each week's deck is authored; Week 2 is worked.
   ============================================================ */

window.MODULE_SECTIONS = [
  "Foundations",                      // 0 — wk 1
  "Speech Acts",                      // 1 — wk 2
  "Implicature",                      // 2 — wk 3
  "Presupposition & Common Ground",   // 3 — wk 4, 5
  "Information",                      // 4 — wk 6
  "Reading Week",                     // 5 — wk 7
  "Politeness",                       // 6 — wk 8
  "Gricean & Probabilistic",          // 7 — wk 9, 10, 11
  "Grammar",                          // 8 — wk 12
];

/* Fixed teaching order. key = CSS hook (unchanged); label = what
   the student sees; glyph = <use href="#…"> id used in markup. */
window.LENSES = [
  { key: "empirical",   label: "Empirical",  glyph: "g-emp", roman: "I",
    prompt: "What utterance data motivates this?" },
  { key: "historical",  label: "Historical", glyph: "g-his", roman: "II",
    prompt: "Who developed this, and in what context?" },
  { key: "formal",      label: "Formal",     glyph: "g-for", roman: "III",
    prompt: "What analytical machinery do we need?" },
  { key: "typological", label: "Applied",    glyph: "g-app", roman: "IV",
    prompt: "How does it play out in real social use?" },
];

/* section = index into MODULE_SECTIONS. figures = key figures the
   week covers (drives historical framing + the workspace card). */
window.WEEKS = [
  { no: 1, title: "Pragmatic Meaning", section: 0,
    figures: ["Logical Positivism", "Wittgenstein"], lenses: blankLenses() },

  { no: 2, title: "Speech Acts", section: 1,
    figures: ["Austin", "Searle"], lenses: {
      empirical:   { q: "When is saying also doing?", d: "Performatives, felicity conditions and misfires — utterances judged successful or failed, not true or false." },
      historical:  { q: "Austin & Searle at Oxford", d: "Ordinary-language philosophy and the move from Austin's observations to Searle's systematic taxonomy." },
      formal:      { q: "Force, content & the taxonomy", d: "The force/content split F(p), the three diagnostic dimensions, and five illocutionary types." },
      typological: { q: "Speech acts in the wild", d: "Institutions that run on declarations, and dogwhistles engineered for deniability." },
  }},

  { no: 3, title: "Implicature", section: 2,
    figures: ["Grice"], lenses: blankLenses() },

  { no: 4, title: "Presupposition", section: 3,
    figures: ["Russell", "Frege", "Strawson"], lenses: blankLenses() },

  { no: 5, title: "Common Ground & Projection", section: 3,
    figures: ["Stalnaker", "Heim"], lenses: blankLenses() },

  { no: 6, title: "Information", section: 4,
    figures: ["Shannon", "Huffman", "Zipf", "Hamming"],
    note: "Case study: the most common words in Irish", lenses: blankLenses() },

  { no: 7, title: "Reading Week", section: 5, reading: true, lenses: blankLenses() },

  { no: 8, title: "Politeness", section: 6,
    figures: ["Brown", "Levinson"], lenses: blankLenses() },

  { no: 9, title: "Neo-Gricean Pragmatics", section: 7,
    figures: ["Horn", "Levinson"], lenses: blankLenses() },

  { no: 10, title: "Relevance Theory", section: 7,
    figures: ["Sperber", "Wilson"], lenses: blankLenses() },

  { no: 11, title: "Rational Speech Acts (RSA)", section: 7,
    figures: ["Bayes", "Lewis", "Franke", "Goodman"],
    ref: "https://web.stanford.edu/class/linguist130a/2022/materials/ling130a-handout-02-17-rsa.pdf",
    lenses: blankLenses() },

  { no: 12, title: "Grammaticalism", section: 8,
    figures: [], lenses: blankLenses() },
];

function blankLenses() {
  return { empirical: { q: "", d: "" }, historical: { q: "", d: "" }, formal: { q: "", d: "" }, typological: { q: "", d: "" } };
}

window.getWeek = function (no) { return window.WEEKS.find((w) => w.no === Number(no)); };

/* Module-level documents. This content is DUAL-CODED: the same weeks are taught as
   the undergrad Pragmatics I (LIU22012, default; coordinated by Dr Conor Pyle) and
   the MPhil Linguistic Pragmatics (LI7862). The WEEKS above are SHARED — only the
   identity label and these distinct overview/assessment documents differ.
   Weightings from the 2025-26 handbooks. status: 'none' until authored. */
window.MODULE = {
  default: "liu22012",
  identities: [
    { key: "liu22012", code: "LIU22012", name: "Pragmatics I", term: "Semester 2 / Hilary", coordinator: "Dr Conor Pyle",
      overview: { file: "overview-liu22012.html", status: "none" },
      assessments: [
        { no: 1, title: "Assessment 1", weight: 20, file: "assessments/liu22012-a1.html", status: "none" },
        { no: 2, title: "Assessment 2", weight: 20, file: "assessments/liu22012-a2.html", status: "none" },
        { no: 3, title: "Assessment 3", weight: 60, file: "assessments/liu22012-a3.html", status: "none" },
      ] },
    { key: "li7862", code: "LI7862", name: "Linguistic Pragmatics", term: "Semester 1 / Michaelmas", coordinator: "Dr Thomas Stephen",
      overview: { file: "overview-li7862.html", status: "none" },
      assessments: [
        { no: 1, title: "Assignment", weight: 100, words: "3500-4000", file: "assessments/li7862-a1.html", status: "none" },
      ] },
  ],
};
