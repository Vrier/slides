# Pragmatics II — LIU44008

**Trinity College Dublin · Dr. Thomas Stephen · Semester 1 / Michaelmas · 2025–2026**
*Year 4 (Senior Sophister) · 5 ECTS · prereq Pragmatics I (LIU22012). Assessment (handbook): two
components, 40% / 60% — wired as Presentation (40%) + Essay (60%); confirm the split.*

## Workspace mapping
The plan below is 11 weeks (7 taught + 4 presentation). In the 12-slot workspace it maps to a
**reading week at 7**, with the Statistics block split across it:

| WS wk | Plan | | WS wk | Plan |
|---|---|---|---|---|
| 1 | Three Roads to Meaning | | 7 | **Reading Week** |
| 2 | Intention and Relevance | | 8 | Probability and the Rational Speaker |
| 3 | Implicature and Accommodation | | 9 | Student Presentations |
| 4 | Meaning in the Grammar | | 10 | Student Presentations |
| 5 | Exhaustification and Projection | | 11 | Student Presentations |
| 6 | Information and Surprisal | | 12 | Student Presentations |

Taught weeks (1–6, 8) are scaffolded with skeleton deck/handout/readings/homework files under
`weeks-pragmatics2/`, structured by the three approaches (not the four lenses); the third corner (**Information & Probability**)
covers information theory, surprisal and RSA. Weeks 9–12 are
blank "Student Presentations" cards. Catalogue: `shared/prag2-meta.js`; theme: `shared/theme-rust.css`.

---

# Pragmatics: Language, Communication, Cognition, Information & LLMs
### Final-year undergraduate lecture course · 11 weeks · 2 × 1-hour sessions/week · primary-reading-led

**Structure (this revision):** an adapted Option B. Week 1 introduces and reminds. Weeks 2–7 run the three approaches, **one approach per two weeks** — a general introduction, then a week applying it to the two diagnostics. Weeks 8–11 are student presentations, drawn from a 10-topic pool that extends the same themes.

---

## 1. The spine

Three approaches to meaning-in-use, run as a three-cornered space:

- **Inference** — meaning reconstructed from speaker intentions (Grice, Relevance Theory, RSA).
- **Grammar / convention** — meaning encoded and computed by the linguistic system, via covert operators or conventionalisation (Chierchia, Potts, Levinson).
- **Statistics / information** — meaning and structure carried by the statistical regularities of the signal (Shannon, surprisal, UID, efficiency), with **LLMs as the limit case**.

Two **diagnostics** are threaded through every approach, so the course keeps testing the same two specimens from three angles:

- **Scalar implicature** (*some* ⇒ not all)
- **Presupposition** (and its projection / accommodation)

One **running theme, never its own week**: the **semantics/pragmatics interface** — how much inference intrudes into truth-conditional content. Flagged in every applied week.

```
                 INFERENCE
              (Grice, RT, RSA)
                 /        \
   GRAMMAR / CONVENTION --- STATISTICS / INFORMATION
   (Chierchia, Potts,        (Shannon, surprisal,
    Levinson)                 UID, efficiency, LLMs)
```

---

## 2. Structure at a glance

| Week | Block | Focus |
|---|---|---|
| 1 | Introduction | Recap + the three corners + the two diagnostics + interface theme |
| 2 | Inference — general | Intention, common ground, Relevance Theory |
| 3 | Inference — applied | Scalar implicature (globalist) + presupposition (accommodation) |
| 4 | Grammar — general | Encoded meaning; covert operators; conventional implicature; defaults |
| 5 | Grammar — applied | SI via exhaustivity operator + presupposition projection |
| 6 | Statistics — general | Information theory; UID/efficiency; LLMs as the limit case |
| 7 | Statistics — applied | SI via RSA/informativity + presupposition + what LLMs do with both |
| 8–11 | Presentations | 10-topic pool (§4) |

---

## 3. Week-by-week (taught portion)

### Week 1 — Introduction & reminder
- **S1**: Recap the prior pragmatics course (implicature, speech acts, presupposition), reframed — *was Grice doing inference, or describing a code?*
- **S2**: Lay out the three-cornered space, the two diagnostics, and the interface as the running theme. State the course question: *does mastering statistical structure deliver grammar and/or inference for free?*
- **Reading**: Grice, "Logic and Conversation" (1975), revisited; Sperber & Wilson, *Relevance* (1986/95), ch. 1. Light recap: Levinson, *Pragmatics* (1983), intro.

### Weeks 2–3 — Approach 1: INFERENCE

**Week 2 — general**
- **S1**: Grice's intention-based meaning; reflexive intentions; common ground and joint action (Stalnaker, Clark).
- **S2**: Relevance Theory — ostensive-inferential communication; cognitive effects vs processing effort; explicature vs implicature.
- **Reading**: Grice, "Meaning" (1957) or "Logic and Conversation"; Wilson & Sperber, "Relevance Theory" (2004, *Handbook of Pragmatics*). Optional: Clark, *Using Language* (1996), selected.

**Week 3 — applied to the diagnostics**
- **S1**: **Scalar implicature** as Quantity/relevance-driven inference — the globalist "standard story"; the speaker-reasoning derivation.
- **S2**: **Presupposition** as common-ground management and **accommodation** (Stalnaker); interface flag: is this content semantic or pragmatic?
- **Reading**: Geurts (2010), *Quantity Implicatures*, selected, or Sauerland (2004); von Fintel (2008), "What is presupposition accommodation, again?" (accessible).

### Weeks 4–5 — Approach 2: GRAMMAR

**Week 4 — general**
- **S1**: The grammaticalist program — "pragmatic" meaning computed *in the grammar*, not by reasoning; covert operators; the semantics/pragmatics boundary.
- **S2**: **Conventional implicature** (Potts) — encoded, non-truth-conditional meaning (*but*, *even*, appositives, expressives); **generalised conversational implicature as defaults** (Levinson) — between inference and convention.
- **Reading**: Chierchia, Fox & Spector (2012), "The grammatical view of scalar implicatures," intro sections; Potts (2005), *The Logic of Conventional Implicature*, selected; Levinson (2000), *Presumptive Meanings*, intro.

**Week 5 — applied to the diagnostics**
- **S1**: **Scalar implicature** via the **exhaustivity operator**; **embedded implicatures** as the decisive argument for grammar — or are they?
- **S2**: **Presupposition projection** as dynamic semantics (Karttunen filtering; Heim's context-change potential) — projection as the grammar corner's flagship case.
- **Reading**: Chierchia, Fox & Spector (2012) on embedded implicatures; Heim (1983), "On the projection problem for presuppositions" (excerpt) or a teachable secondary; globalist counter: Geurts & Pouscoulous (2009), "Embedded implicatures?!?"

### Weeks 6–7 — Approach 3: STATISTICS / INFORMATION

**Week 6 — general**
- **S1**: Information theory, gently — Shannon's source/channel/noise/redundancy; entropy as uncertainty; surprisal = −log₂ p; bits. Exercises (§5 #1–2).
- **S2**: UID and efficiency; ambiguity as a feature; the code reborn. **LLMs as the limit case** — next-token prediction = statistical code; form vs meaning and **formal vs functional competence** as the corner's self-understanding.
- **Reading**: Shannon (1948), intro + entropy section, with Weaver's introduction; Jaeger (2010), "Redundancy and reduction"; Bender & Koller (2020), "Climbing towards NLU," *or* Mahowald et al. (2024), "Dissociating language and thought in LLMs."

**Week 7 — applied to the diagnostics**
- **S1**: **Scalar implicature** probabilistically — **RSA** (Frank & Goodman 2012); informativity; the **processing** evidence (Bott & Noveck 2004; Huang & Snedeker 2009) as the cognitive face of this corner, adjudicating default-vs-inference. Exercise (§5 #5).
- **S2**: **Presupposition** via informativity/Bayesian accounts; **what LLMs actually do** with both diagnostics (Ruis et al. 2023; Hu et al. 2023); LLM surprisal ↔ human reading times (the "LLMs as cognitive models" thread).
- **Reading**: Frank & Goodman (2012), "Predicting pragmatic reasoning in language games" (Science); Goodman & Frank (2016); Hu et al. (2023), "A fine-grained comparison of pragmatic language understanding in humans and language models."

### Weeks 8–11 — Student presentations
Four weeks, eight sessions. The 10-topic pool (§4) gives more topics than slots, so students choose or are assigned; run 1–2 presentations + structured discussion per session. Each topic ships with a launchpad reading and is framed by **which corner(s) it extends** and **how it bears on the two diagnostics or the course question**, so presentations continue the argument rather than wandering off it.

---

## 4. Presentation topic pool (10)

Each extends the three-approaches framework to a new phenomenon or pushes the LLM question further. Tagged by the corner(s) it most engages.

1. **Metaphor & irony.** Figurative language as the inference corner's showcase — Relevance Theory's echoic-mention account of irony vs pretence vs lexical-pragmatic alternatives; irony as a known LLM soft spot. *(Inference; LLM probe.)* — Wilson & Sperber on irony; Sperber & Wilson, "Loose talk."
2. **Theory of mind & mindreading.** The cognitive substrate the inference corner assumes; the LLM ToM controversy. *(Inference ↔ cognition ↔ LLMs.)* — Apperly, *Mindreaders*, selected; Kosinski (2023) vs Ullman (2023).
3. **The acquisition of pragmatics.** How children acquire scalar implicature and presupposition; default-vs-inference developmentally; the **data-efficiency** argument against LLMs. *(Cognition; grammar↔statistics edge.)* — Noveck on developmental SI; Bott & Noveck (2004).
4. **Dialogue, grounding & repair.** Communication as interaction, not single-utterance interpretation; do LLM agents actually ground and repair? *(Communication pillar; LLM probe.)* — Clark & Brennan (1991); Sacks, Schegloff & Jefferson (1974); Pickering & Garrod (2004).
5. **Politeness, face & social meaning.** Indirectness and face; im/politeness; RLHF/sycophancy as machine "politeness." *(Inference + social; LLMs.)* — Brown & Levinson (1987); Culpeper on impoliteness.
6. **Deixis, indexicality & perspective.** The anchoring problem; why a model with no "here / now / I" struggles with deictic resolution. *(Grounding; LLM probe.)* — Levinson on deixis; Kaplan, "Demonstratives" (excerpt).
7. **Speech acts, commitment & accountability.** Performativity revisited; can a model *assert*, *promise*, be held accountable? A sharp test of what's missing in LLMs. *(All three corners; LLMs.)* — Austin/Searle recap; Geurts (2019), "Communication as commitment sharing."
8. **Vagueness & gradable adjectives.** Extends the statistical/RSA corner to a new phenomenon; the sorites as a communication problem. *(Statistics/RSA.)* — Lassiter & Goodman (2017); Kennedy on gradability.
9. **What LLMs say about linguistic theory — the Piantadosi debate.** Run as a structured debate: LLMs as theories that refute the generative approach vs poor theories of human cognition. *(Grammar ↔ statistics edge.)* — Piantadosi (2024); Kodner, Payne & Heinz (2023).
10. **Meaning, reference & grounding.** Can there be meaning without reference? The symbol-grounding problem; distributional vs grounded meaning; the octopus. *(Statistics ↔ meaning; the deep LLM question.)* — Harnad (1990); Piantadosi & Hill (2022); Bender & Koller (2020).

---

## 5. Information-theory teaching kit (light formalism + exercises)

Base-2 logs, small numbers. Five graded walkthroughs, each a bridge:

1. **Surprisal & entropy.** Surprisal = −log₂ p; entropy = expected surprisal. *Exercise:* fair coin (1 bit) vs biased (p = 0.9 → ≈ 0.47 bits) vs fair 4-symbol source (2 bits); then "the" vs a rare word.
2. **Efficiency / word length.** Toy frequencies → efficient codes make frequent words short. *Exercise:* code-length assignment, alphabetical vs frequency-sorted.
3. **Uniform Information Density.** *Exercise:* with/without *that*; full vs contracted → predict reduction where upcoming material is predictable. Links UID to Quantity.
4. **Noisy channel (Bayes).** Corrupted sentence + priors → most probable intended sentence (Gibson et al. 2013). Previews LLM error-correction.
5. **RSA reference game (week 7).** Three objects, two words; literal → pragmatic speaker → pragmatic listener. *Exercise:* compute the posterior; a scalar implicature emerges from the arithmetic — pointed contrast with the week-5 grammatical derivation.

---

## 6. Open design decisions (for you)

1. **Where cognition went.** The previously-planned standalone cognition/acquisition week is now **redistributed**: the *processing* evidence (Bott & Noveck; Huang & Snedeker) sits in the applied weeks (3, 5, 7) where it adjudicates each corner's account, and *acquisition* is presentation topic #3. If you'd rather restore a dedicated cognition week, the cleanest swap is to make weeks 6–7 a single statistics week and promote cognition into the taught core — say so and I'll redraw.
2. **Presentation logistics.** 8 sessions, 10 topics. Decide: students pick vs assigned; 1 or 2 per session; whether the final session is a synthesis/wrap led by you rather than students.
3. **Assessment.** Handbook (LIU44008): two components, 40/60 — wired as Presentation (40%) + Essay (60%). Confirm the split, and whether the presentation feeds the written piece.
4. **Reading-load realism.** Shannon (1948), Chierchia/Fox/Spector, Potts (2005), and Heim (1983) are hard as standalone primary texts for final-years — those weeks want tight excerpting or a scaffolding secondary.
5. **Your own angle.** With the grammar corner and the interface theme now central, a syntax/semantics-interface or experimental-pragmatics angle is well supported if you want the course to orbit your own work.

---

*Citations are author-year short form for a syllabus; happy to expand any into full references or produce a formatted bibliography.*
