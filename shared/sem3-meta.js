/* ============================================================
   shared/sem3-meta.js — LIU44010 Semantics III
   Final-year (Senior Sophister) proseminar on Attitude Verbs and
   Clausal Embedding. Organised in TWO ARCS, not the four lenses:
     Arc I (formal tools) → Arc II (empirical phenomena).
   Weeks 9–12 are student presentations.

   Same global API (MODULE_SECTIONS / WEEKS / getWeek) so the rail
   filler (sem3-rail.js) reads it unchanged. Full plan lives in
   /Semantics III - Course Plan.md.

   NOTE — PARKED TOPICS: the plan's Arc II runs five weeks
   (Factivity, Neg-raising, Embedded questions, Selection, Indexical
   shift). Only Factivity is taught (wk 8); the other four are
   displaced by the student-presentation block and parked in
   window.SEM3_PARKED (below) + the Week-1 deck, ready to restore.
   ============================================================ */

window.MODULE_SECTIONS = [
  "Intensionality",        // 0 — wk 1
  "Modality & Attitudes",  // 1 — wk 2, 3
  "Objects of Attitude",   // 2 — wk 4, 5
  "Decomposition",         // 3 — wk 6
  "Reading Week",          // 4 — wk 7
  "Factivity",             // 5 — wk 8
  "Presentations",         // 6 — wk 9, 10, 11, 12
];

/* section = index into MODULE_SECTIONS. arc = "I" (formal tools) or
   "II" (empirical phenomena). figures = key figures the week covers. */
window.WEEKS = [
  { no: 1,  title: "Sense, Reference and Opacity", section: 0, arc: "I",
    figures: ["Frege", "Russell", "Carnap"] },
  { no: 2,  title: "Frames and Accessibility",     section: 1, arc: "I",
    figures: ["Kripke"] },
  { no: 3,  title: "Quantifying over Alternatives", section: 1, arc: "I",
    figures: ["Hintikka", "Kratzer"] },
  { no: 4,  title: "De Re, De Dicto, De Se",       section: 2, arc: "I",
    figures: ["Lewis", "Percus & Sauerland"] },
  { no: 5,  title: "The Granularity Problem",      section: 2, arc: "I",
    figures: ["Cresswell & von Stechow", "Moltmann"] },
  { no: 6,  title: "Decomposing Attitude Verbs",   section: 3, arc: "I",
    figures: ["Kratzer", "Moulton", "Davidson"] },
  { no: 7,  title: "Reading Week",                 section: 4, reading: true },
  { no: 8,  title: "Factivity",                    section: 5, arc: "II",
    figures: ["Kiparsky & Kiparsky", "Karttunen"] },
  { no: 9,  title: "Student Presentations",        section: 6, present: true },
  { no: 10, title: "Student Presentations",        section: 6, present: true },
  { no: 11, title: "Student Presentations",        section: 6, present: true },
  { no: 12, title: "Student Presentations",        section: 6, present: true },
];

/* Parked Arc II topics — taught in the original 11-week plan, displaced here by
   the presentation block. Restore by giving them weeks (e.g. swapping out
   presentation slots) and scaffolding folders like the taught weeks. */
window.SEM3_PARKED = [
  { title: "Neg-Raising",
    blurb: "“I don't think he'll come” ⇝ “I think he won't.” Excluded-middle presupposition vs strict-NPI-licensing.",
    readings: ["Bartsch 1973", "Gajewski 2007, “Neg-raising and Polarity”"] },
  { title: "Embedded Questions & Responsive Predicates",
    blurb: "Question denotations; exhaustivity (mention-some/all); predicates taking both complement types; the uniform-semantics program.",
    readings: ["Karttunen 1977", "Groenendijk & Stokhof 1984 (excerpt)", "Spector & Égré 2015", "Theiler, Roelofsen & Aloni 2018", "Uegaki 2019 (Compass)"] },
  { title: "Selection & Anti-rogativity",
    blurb: "Why “believe” hates “whether”. Anti-rogative vs anti-interrogative predicates; deriving selection rather than stipulating it. The frontier; a home for an assessed squib.",
    readings: ["Uegaki & Sudo 2019", "Mayr 2019", "Theiler, Roelofsen & Aloni 2019, “Picky Predicates”", "Uegaki 2019"] },
  { title: "Indexical Shift & Monsters",
    blurb: "Kaplan's prohibition and the data that breaks it (Amharic, Zazaki, Uyghur); shift-together; the loop back to de se.",
    readings: ["Schlenker 2003, “A Plea for Monsters”", "Anand & Nevins 2004", "Deal 2020 (survey)"] },
];

window.getWeek = function (no) { return window.WEEKS.find((w) => w.no === Number(no)); };

/* Module-level documents. Single Year-4 proseminar (LIU44010) — no twin.
   Two assessments per the TJH Linguistics handbook 2025-26: Participation 30% +
   Research paper 70%. status: 'none' until authored — reserves the room. */
window.MODULE = {
  default: "liu44010",
  identities: [
    { key: "liu44010", code: "LIU44010", name: "Semantics III", term: "Semester 2 / Hilary", coordinator: "Dr Thomas Stephen",
      overview: { file: "overview-liu44010.html", status: "none" },
      assessments: [
        { no: 1, title: "Participation & discussion-leading", weight: 30, file: "assessments/liu44010-a1.html", status: "none" },
        { no: 2, title: "Research paper", weight: 70, file: "assessments/liu44010-a2.html", status: "none" },
      ] },
  ],
};
