/* ============================================================
   shared/prag2-meta.js — LIU44008 Pragmatics II
   Final-year (Senior Sophister) module. Sister catalogue to
   prag-meta.js, but Pragmatics II is organised by a different
   spine: THREE APPROACHES (Inference / Grammar / Statistics)
   threaded by TWO DIAGNOSTICS (scalar implicature, presupposition),
   not the four lenses. Weeks 9–12 are student presentations.

   Same global API (MODULE_SECTIONS / WEEKS / getWeek) so the rail
   filler (prag2-rail.js) reads it unchanged. Full plan lives in
   /Pragmatics II - Course Plan.md.
   ============================================================ */

window.MODULE_SECTIONS = [
  "Introduction",        // 0 — wk 1
  "Inference",           // 1 — wk 2, 3
  "Grammar",             // 2 — wk 4, 5
  "Information & Probability",   // 3 — wk 6, 8
  "Reading Week",        // 4 — wk 7
  "Presentations",       // 5 — wk 9, 10, 11, 12
];

/* The three approaches that form the course's spine (for reference /
   future scaffolding). Each taught week sits in one corner. */
window.APPROACHES = [
  { key: "inference",  label: "Inference",  gloss: "Meaning reconstructed from speaker intentions (Grice, RT, RSA)." },
  { key: "grammar",    label: "Grammar",    gloss: "Meaning encoded & computed by the linguistic system (Chierchia, Potts, Levinson)." },
  { key: "statistics", label: "Information", gloss: "Meaning carried by the signal's statistics — information, probability, surprisal; LLMs as the limit case (Shannon, UID, RSA)." },
];

/* section = index into MODULE_SECTIONS. approach = which corner the week
   sits in. figures = key figures the week covers. */
window.WEEKS = [
  { no: 1,  title: "Three Roads to Meaning", section: 0, approach: null,
    figures: ["Grice", "Sperber & Wilson", "Levinson"] },
  { no: 2,  title: "Intention and Relevance",     section: 1, approach: "inference",
    figures: ["Grice", "Sperber & Wilson", "Clark"] },
  { no: 3,  title: "Implicature and Accommodation",     section: 1, approach: "inference",
    figures: ["Geurts", "Sauerland", "Stalnaker", "von Fintel"] },
  { no: 4,  title: "Meaning in the Grammar",       section: 2, approach: "grammar",
    figures: ["Chierchia", "Potts", "Levinson"] },
  { no: 5,  title: "Exhaustification and Projection",       section: 2, approach: "grammar",
    figures: ["Chierchia, Fox & Spector", "Heim", "Geurts & Pouscoulous"] },
  { no: 6,  title: "Information and Surprisal",    section: 3, approach: "statistics",
    figures: ["Shannon", "Jaeger", "Bender & Koller", "Mahowald et al."] },
  { no: 7,  title: "Reading Week",            section: 4, reading: true },
  { no: 8,  title: "Probability and the Rational Speaker",    section: 3, approach: "statistics",
    figures: ["Frank & Goodman", "Bott & Noveck", "Hu et al."] },
  { no: 9,  title: "Student Presentations",   section: 5, present: true },
  { no: 10, title: "Student Presentations",   section: 5, present: true },
  { no: 11, title: "Student Presentations",   section: 5, present: true },
  { no: 12, title: "Student Presentations",   section: 5, present: true },
];

window.getWeek = function (no) { return window.WEEKS.find((w) => w.no === Number(no)); };

/* Module-level documents. Pragmatics II is a single Year-4 module (LIU44008) — no
   MPhil twin. Two assessments per the TJH Linguistics handbook 2025-26: 40/60
   (named here Presentation + Essay; confirm split). status: 'none' until authored. */
window.MODULE = {
  default: "liu44008",
  identities: [
    { key: "liu44008", code: "LIU44008", name: "Pragmatics II", term: "Semester 1 / Michaelmas", coordinator: "Dr Thomas Stephen",
      overview: { file: "overview-liu44008.html", status: "none" },
      assessments: [
        { no: 1, title: "Presentation", weight: 40, file: "assessments/liu44008-a1.html", status: "none" },
        { no: 2, title: "Essay", weight: 60, file: "assessments/liu44008-a2.html", status: "none" },
      ] },
  ],
};
