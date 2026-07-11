# Pragmatics Map — Structured Source Data

## How to use this file
This is source data for building an **interactive timeline/map** of pragmatics. It is written to be consumed by an LLM, not read as prose. The canonical content is the JSON block below; the notes after it are clarifications, not extra data.

Intended visual model:
- **Foundational figures** form their own bracket/band (roughly 1940–1980), shown before/above the schools.
- **Schools** are time-spans on a timeline. Most are open-ended (still active) — `end: null` means ongoing; render as an arrow/“to present”.
- **Edges** capture intellectual descent and debates (figure→school, school→school) plus the cross-cutting experimental-pragmatics layer.
- All years are **approximate** unless they refer to a specific publication. Treat decade-level precision as the intended resolution for the foundational bracket, and year-level for school onsets.

```json
{
  "meta": {
    "title": "Foundations & Modern Schools of Pragmatics",
    "year_resolution": "approximate; school onsets year-level, foundational figures decade-level",
    "root": "All four post-Gricean schools descend from H. P. Grice (Logic and Conversation, James Lectures 1967). The formal-broad school descends instead from possible-worlds and dynamic semantics."
  },

  "foundational_bracket": { "label": "Foundational figures", "span_start": 1940, "span_end": 1980 },

  "foundational_figures": [
    {
      "id": "austin",
      "name": "J. L. Austin",
      "active_start": 1946, "active_end": 1960,
      "institutions": ["University of Oxford"],
      "lineage": "oxford_ordinary_language",
      "contribution": "Ordinary-language philosophy; How to Do Things with Words (1955, pub. 1962). Performatives; locution/illocution/perlocution. Origin of speech act theory.",
      "feeds_schools": ["neo_gricean", "formal_broad"]
    },
    {
      "id": "strawson",
      "name": "P. F. Strawson",
      "active_start": 1950, "active_end": 1990,
      "institutions": ["University of Oxford"],
      "lineage": "oxford_ordinary_language",
      "contribution": "On Referring (1950); critique of Russell that established presupposition and referential use.",
      "feeds_schools": ["formal_broad"]
    },
    {
      "id": "grice",
      "name": "H. P. Grice",
      "active_start": 1948, "active_end": 1988,
      "peak_start": 1957, "peak_end": 1975,
      "institutions": ["University of Oxford (to 1967)", "UC Berkeley (1967-1988)"],
      "lineage": "oxford_ordinary_language",
      "contribution": "Meaning (1957); Logic and Conversation (1967). Cooperative Principle, maxims, implicature, speaker meaning. The hinge of the whole field.",
      "feeds_schools": ["neo_gricean", "relevance_theory", "grammaticalism", "rsa"],
      "is_root": true
    },
    {
      "id": "searle",
      "name": "John Searle",
      "active_start": 1959, "active_end": 1999,
      "institutions": ["UC Berkeley"],
      "lineage": "oxford_ordinary_language",
      "contribution": "Speech Acts (1969); taxonomy of illocutionary acts; indirect speech acts (1975). Systematized Austin.",
      "feeds_schools": ["formal_broad"]
    },
    {
      "id": "stalnaker",
      "name": "Robert Stalnaker",
      "active_start": 1970, "active_end": 2005,
      "peak_start": 1973, "peak_end": 1978,
      "institutions": ["Cornell University"],
      "lineage": "possible_worlds_formal",
      "contribution": "Pragmatic Presuppositions (1974); Assertion (1978). Common ground and the context-set model — impetus for the dynamic turn.",
      "feeds_schools": ["formal_broad", "rsa"]
    },
    {
      "id": "lewis",
      "name": "David Lewis",
      "active_start": 1966, "active_end": 2001,
      "institutions": ["Princeton University", "UCLA (earlier)"],
      "lineage": "possible_worlds_formal",
      "contribution": "Convention (1969): signalling games and conventions of language — ancestor of game-theoretic/RSA pragmatics. Scorekeeping in a Language Game (1979): accommodation and the conversational scoreboard.",
      "feeds_schools": ["rsa", "formal_broad"]
    },
    {
      "id": "shannon",
      "name": "Claude Shannon",
      "active_start": 1948, "active_end": 1958,
      "institutions": ["Bell Labs", "MIT (later)"],
      "lineage": "information_theoretic",
      "contribution": "A Mathematical Theory of Communication (1948). Entropy, channel, redundancy — information-theoretic backbone of probabilistic pragmatics. Dormant for pragmatics until the probabilistic turn decades later.",
      "feeds_schools": ["rsa"]
    }
  ],

  "lineages": [
    { "id": "oxford_ordinary_language", "label": "Oxford ordinary-language", "members": ["austin", "strawson", "grice", "searle"] },
    { "id": "possible_worlds_formal", "label": "Possible-worlds / formal", "members": ["stalnaker", "lewis"] },
    { "id": "information_theoretic", "label": "Information-theoretic", "members": ["shannon"] }
  ],

  "schools": [
    {
      "id": "neo_gricean",
      "name": "Neo-Gricean",
      "begin": 1981, "peak_start": 1990, "peak_end": 2009, "end": null,
      "onset_markers": ["Atlas & Levinson 1981", "Horn 1984"],
      "core_idea": "Keep Grice's architecture but reduce the maxims to a few competing principles (Q/R; Q/I/M); generalized conversational implicature as a default level.",
      "key_figures": [
        { "name": "Laurence Horn", "institution": "Yale (emer.)" },
        { "name": "Stephen Levinson", "institution": "Cambridge" },
        { "name": "Gerald Gazdar", "institution": "Sussex" }
      ]
    },
    {
      "id": "relevance_theory",
      "name": "Relevance Theory",
      "begin": 1986, "peak_start": 1986, "peak_end": 1999, "end": null,
      "onset_markers": ["Sperber & Wilson, Relevance 1986 (rev. 1995)"],
      "core_idea": "Replace the maxims with a single cognitive principle of relevance (effects vs. effort); rich notion of explicature; lexical pragmatics.",
      "key_figures": [
        { "name": "Dan Sperber", "institution": "Institut Jean Nicod, CNRS" },
        { "name": "Deirdre Wilson", "institution": "UCL" },
        { "name": "Robyn Carston", "institution": "UCL" }
      ]
    },
    {
      "id": "formal_broad",
      "name": "Formal pragmatics (broad)",
      "begin": 2005, "roots_from": 1978, "peak_start": 2005, "peak_end": 2013, "end": null,
      "onset_markers": ["Roberts 1996/2012 (QUD)", "Potts 2005", "Tonhauser et al. 2013 (projection taxonomy)"],
      "core_idea": "Formal semantics/pragmatics interface: presupposition & projection, not-at-issueness, QUD/information structure, multidimensional/conventional-implicature meaning.",
      "key_figures": [
        { "name": "David Beaver", "institution": "UT Austin" },
        { "name": "Judith Tonhauser", "institution": "Ohio State" },
        { "name": "Christopher Potts", "institution": "Stanford" }
      ]
    },
    {
      "id": "grammaticalism",
      "name": "Grammaticalism",
      "begin": 2004, "circulated_from": 2000, "peak_start": 2008, "peak_end": 2018, "end": null,
      "onset_markers": ["Chierchia 2004 (circulated 2000)", "Chierchia, Fox & Spector 2012"],
      "core_idea": "Scalar implicature computed in the grammar via a covert exhaustivity operator; implicatures embed freely. Drives the localist/globalist debate.",
      "key_figures": [
        { "name": "Gennaro Chierchia", "institution": "Harvard" },
        { "name": "Danny Fox", "institution": "MIT" },
        { "name": "Philippe Schlenker", "institution": "Institut Jean Nicod, CNRS; NYU" }
      ]
    },
    {
      "id": "rsa",
      "name": "Probabilistic / RSA",
      "begin": 2012, "peak_start": 2012, "peak_end": null, "end": null,
      "onset_markers": ["Frank & Goodman 2012"],
      "core_idea": "Gricean reasoning as Bayesian inference: pragmatic listener-speaker recursion; meaning probabilistic, informativeness gradient, alternatives & priors central.",
      "key_figures": [
        { "name": "Noah Goodman", "institution": "Stanford" },
        { "name": "Michael C. Frank", "institution": "Stanford" },
        { "name": "Judith Degen", "institution": "Stanford" }
      ]
    }
  ],

  "emergence_order": ["neo_gricean", "relevance_theory", "grammaticalism", "formal_broad", "rsa"],

  "experimental_pragmatics": {
    "id": "experimental",
    "label": "Experimental pragmatics (cross-cutting layer, ~2000-present)",
    "role": "Not a rival school; the empirical testing ground for the others.",
    "figures": [
      { "name": "Ira Noveck", "institution": "CNRS" },
      { "name": "Lewis Bott", "institution": "Cardiff" },
      { "name": "Napoleon Katsos", "institution": "Cambridge" },
      { "name": "Richard Breheny", "institution": "UCL" },
      { "name": "Anna Papafragou", "institution": "Penn" }
    ]
  },

  "edges": [
    { "from": "grice", "to": "neo_gricean", "type": "descends_from" },
    { "from": "grice", "to": "relevance_theory", "type": "descends_from" },
    { "from": "grice", "to": "grammaticalism", "type": "descends_from" },
    { "from": "grice", "to": "rsa", "type": "descends_from" },
    { "from": "stalnaker", "to": "formal_broad", "type": "descends_from" },
    { "from": "lewis", "to": "rsa", "type": "descends_from" },
    { "from": "lewis", "to": "formal_broad", "type": "informs" },
    { "from": "shannon", "to": "rsa", "type": "informs" },
    { "from": "austin", "to": "formal_broad", "type": "informs" },
    { "from": "searle", "to": "formal_broad", "type": "informs" },
    { "from": "strawson", "to": "formal_broad", "type": "informs" },
    { "from": "neo_gricean", "to": "relevance_theory", "type": "rivalry", "label": "default vs. context / single principle" },
    { "from": "grammaticalism", "to": "neo_gricean", "type": "debate", "label": "localist vs. globalist" },
    { "from": "experimental", "to": "neo_gricean", "type": "tests", "label": "Bott & Noveck 2004: default vs. context" },
    { "from": "experimental", "to": "relevance_theory", "type": "tests" },
    { "from": "experimental", "to": "grammaticalism", "type": "tests", "label": "Chemla & Spector 2011: embedded implicatures" },
    { "from": "experimental", "to": "rsa", "type": "tests", "label": "quantitative predictions" },
    { "from": "experimental", "to": "formal_broad", "type": "merges_with", "label": "Tonhauser, Beaver & Degen 2018; CommitmentBank 2019" },
    { "from": "rsa", "to": "formal_broad", "type": "bridge", "label": "Potts: conventional implicature -> probabilistic models" }
  ]
}
```

## Plain-language notes (for disambiguation, not for plotting)
- **`end: null` = ongoing.** All five schools remain active research programs; the `peak_*` fields mark the period of greatest activity/influence, useful if the map shades intensity.
- **`formal_broad` has two layers.** Its technical foundations sit ~1978–82 (Stalnaker; Karttunen & Peters 1979; Kamp's DRT and Heim's File Change Semantics 1981–82), but the school as a self-identified projection/QUD program crystallized ~2005–2013. `begin` reflects the latter; `roots_from` the former.
- **Grammaticalism and formal_broad are contemporaneous** (both 2000s) but aimed at different problems — implicature vs. projection. Avoid implying one caused the other.
- **Institution caveat.** Values are the affiliation each body of work is identified with, not a live appointment. Deceased: Austin, Grice, Strawson, Lewis, Shannon. Emeritus: Horn, Wilson, Stalnaker. Career moves not shown in the single-value fields: Stalnaker (Cornell → MIT), Levinson (Cambridge → Max Planck Nijmegen), Schlenker (NYU appointment 2008–2025).
