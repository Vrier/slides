/* ============================================================
   shared/prag2-meta.js — LIU44008 Pragmatics II
   Final-year (Senior Sophister) module. Sister catalogue to
   prag-meta.js, but Pragmatics II is organised by a different
   spine again: FOUR FRAMEWORKS (game theory / information
   theory / RSA / cognitive science) built in dependency order,
   threaded by TWO DIAGNOSTICS (scalar implicature,
   presupposition). Weeks 9–12 are student presentations.

   REVISED 2026-09-15. The previous version organised the module
   as THREE APPROACHES (Inference / Grammar / Statistics)
   adjudicated against each other. The module is now a MODELLING
   AND METHODS course: it builds the frameworks so students can
   propose their own analyses and design studies. Full plan in
   docs/pragmatics-2-course-plan.md.

   NB the global is still called APPROACHES rather than
   FRAMEWORKS: scripts/new-week.mjs reads `cat.APPROACHES` to
   build the spine-cards, so the name is load-bearing. There are
   now FOUR entries, so a deck rendering them wants
   `.spine-cards cols-2` rather than the default 3-up grid.

   Same global API (MODULE_SECTIONS / WEEKS / getWeek) so the rail
   filler (prag2-rail.js) reads it unchanged.
   ============================================================ */

window.MODULE_SECTIONS = [
  "Introduction",        // 0 — wk 1
  "Frameworks",          // 1 — wk 2, 3, 4
  "The Model",           // 2 — wk 5
  "Cognition",           // 3 — wk 6
  "Reading Week",        // 4 — wk 7
  "Application",         // 5 — wk 8
  "Presentations",       // 6 — wk 9, 10, 11, 12
];

/* The four frameworks the course builds, in dependency order. Each
   is one aspect of a single object: a speaker and listener choosing
   under uncertainty with limited resources. */
window.APPROACHES = [
  { key: "game",        label: "Game Theory",       gloss: "The strategic structure: agents, utilities, best response, equilibrium (Lewis, Parikh, Franke)." },
  { key: "information", label: "Information Theory", gloss: "The currency: surprisal, entropy, KL divergence, efficiency (Shannon, Jaeger, Gibson)." },
  { key: "rsa",         label: "Rational Speech Acts", gloss: "The probabilistic implementation that composes the two (Frank & Goodman, Scontras, Franke)." },
  { key: "cognition",   label: "Cognitive Science", gloss: "The resource bound and the link to data: relevance, processing, rational analysis (Sperber & Wilson, Simon, Griffiths)." },
];

/* The two standing diagnostics, threaded through every taught week.
   One probes alternatives, one probes priors: the two halves of a
   Bayesian model, which is why these two and not others. */
window.DIAGNOSTICS = [
  { key: "scalar",       label: "Scalar implicature", probes: "alternatives" },
  { key: "presupposition", label: "Presupposition",   probes: "priors" },
];

/* section = index into MODULE_SECTIONS. approach = which framework the
   week builds. figures = key figures the week covers. */
window.WEEKS = [
  { no: 1,  title: "From Logic to Probability", section: 0, approach: null,
    figures: ["Grice", "Horn", "Strawson"] },
  { no: 2,  title: "Game Theory and Signalling", section: 1, approach: "game",
    figures: ["Lewis", "Parikh", "Franke", "Jäger"] },
  { no: 3,  title: "Information Theory", section: 1, approach: "information",
    figures: ["Shannon", "Zipf", "Jaeger", "Gibson"] },
  { no: 4,  title: "Probability, Priors and Common Ground", section: 1, approach: "rsa",
    figures: ["Stalnaker", "von Fintel", "Tonhauser", "Degen"] },
  { no: 5,  title: "Rational Speech Act Models", section: 2, approach: "rsa",
    figures: ["Frank & Goodman", "Goodman & Stuhlmüller", "Scontras"] },
  { no: 6,  title: "Cognitive Science and Resource Limits", section: 3, approach: "cognition",
    figures: ["Sperber & Wilson", "Simon", "Anderson", "Bott & Noveck"] },
  { no: 7,  title: "Reading Week",            section: 4, reading: true },
  { no: 8,  title: "Models, Data and Language Models", section: 5, approach: null,
    figures: ["Oh & Schuler", "Mahowald et al.", "Bender & Koller", "Hu et al."] },
  { no: 9,  title: "Student Presentations",   section: 6, present: true },
  { no: 10, title: "Student Presentations",   section: 6, present: true },
  { no: 11, title: "Student Presentations",   section: 6, present: true },
  { no: 12, title: "Student Presentations",   section: 6, present: true },
];

window.getWeek = function (no) { return window.WEEKS.find((w) => w.no === Number(no)); };

/* Module-level documents. Pragmatics II is a single Year-4 module (LIU44008) — no
   MPhil twin. Two assessments per the TJH Linguistics handbook 2025-26: 40/60
   (named here Presentation + Essay; confirm split). Under the revised design the
   natural fit is: presentation = propose the analysis; essay = the modelling paper
   with study design. status: 'none' until authored. */
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
