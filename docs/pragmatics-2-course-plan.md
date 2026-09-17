# Pragmatics II — LIU44008

**Trinity College Dublin · Dr. Thomas Stephen · Semester 1 / Michaelmas · 2026–2027**
*Year 4 (Senior Sophister) · 5 ECTS · prereq Pragmatics I (LIU22012). Assessment (handbook): two
components, 40% / 60%, wired as Presentation (40%) + Essay (60%); confirm the split.*

> **Revision note (2026-09-15).** This plan replaces the earlier "three approaches"
> version (Inference / Grammar / Statistics, adjudicated against two diagnostics).
> The course is now a **modelling and methods course**: it builds four frameworks so
> that students can propose their own analyses of pragmatic phenomena and design
> studies to test them. The earlier version's §6.1 (where cognition went) and §6.5
> (your own angle) are closed in favour of cognition and experimental pragmatics.

## Workspace mapping

12-slot workspace, 7 taught weeks, reading week at 7, presentations 9–12.

| WS wk | Topic | | WS wk | Topic |
|---|---|---|---|---|
| 1 | From Logic to Probability | | 7 | **Reading Week** |
| 2 | Game Theory and Signalling | | 8 | Models, Data and Language Models |
| 3 | Information Theory | | 9 | Student Presentations |
| 4 | Probability, Priors and Common Ground | | 10 | Student Presentations |
| 5 | Rational Speech Act Models | | 11 | Student Presentations |
| 6 | Cognitive Science and Resource Limits | | 12 | Student Presentations |

Catalogue: `shared/prag2-meta.js`; rail: `shared/prag2-rail.js`; theme: `shared/theme-rust.css`.

---

# Pragmatics: Modelling Meaning in Use
### Final-year undergraduate lecture course · 2 × 1-hour sessions/week · modelling-led

---

## 1. The design

Four frameworks, but they are not four topics. They are four aspects of **one object**:
a speaker and a listener choosing under uncertainty with limited resources.

- **Game theory** supplies the strategic structure: agents, utilities, best response, equilibrium.
- **Information theory** supplies the currency: surprisal, entropy, KL divergence.
- **Rational Speech Act models** supply the probabilistic implementation that composes the two.
- **Cognitive science** supplies the resource bound, and the link from model to data.

The machinery is built once, in dependency order (game theory needs no probability;
information theory supplies the utility; probability supplies the priors; RSA composes
all three; cognitive science bounds it and tests it). Students then extend it themselves.

Two **diagnostics** run through every week as worked examples:

- **Scalar implicature** (*some* ⇒ not all), which probes **alternatives**
- **Presupposition** and its projection, which probes **priors**

Those are the two halves of a Bayesian model, which is why these two specimens and not others.

One **running theme**: the semantics/pragmatics interface, flagged wherever a derivation
forces the question of how much inference intrudes into truth-conditional content.

```
                 GAME THEORY
            (structure: who chooses what)
                 /          \
   INFORMATION THEORY --- COGNITIVE SCIENCE
   (currency: surprisal)    (the bound, the data)
                 \          /
                    RSA
          (the composed, runnable model)
```

## 2. Learning outcomes

By the end of the module a student can:

1. Specify a pragmatic phenomenon as a model: states, alternatives, priors, utilities.
2. Implement that model and derive quantitative predictions from it.
3. Identify what data would discriminate the model from a named rival.
4. Design a study that collects those data, anticipating task artefacts.
5. Analyse the result and revise the model in light of it.
6. Situate all of the above against the classical logical tradition it grew out of.

## 3. Structure at a glance

| Week | Builds | Methods component |
|---|---|---|
| 1 | The problem; what a model is | Run a model, move a parameter |
| 2 | Agents, utilities, best response | Best responses in a 2×2 signalling game |
| 3 | The utility currency | Compute surprisal and entropy |
| 4 | Priors and Bayesian update | Fit a model to a supplied dataset |
| 5 | The composed model | Extend an RSA model; predict before running |
| 6 | The resource bound | Study-design workshop; task artefacts |
| 8 | Application and evaluation | Proposal workshop, end to end |

---

## 4. Week by week

### Week 1 — From Logic to Probability
*Section: Introduction*

**S1.** The two specimens, judgements taken cold. Grice's derivation written out as a
formal argument. Cancellability; the negation test; projection. Both specimens have
logical origins: Horn scales are ordered by entailment, presupposition began as a
truth-value gap in Strawson against Russell.

**S2.** Where the logical picture strains: gradience, defeasibility (you cannot cancel
the conclusion of a valid argument; non-monotonic logic as the failed repair), epicycles
(Geurts's standard recipe and its Competence Assumption), noise. The move to degrees of
belief. What a model is: states, alternatives, utilities, and a prediction that can be
wrong. The shape of the term.

*Methods:* first WebPPL session. Run a model, change a parameter, watch the prediction move.

*Readings:* Grice (1975), "Logic and conversation," revisited. Sperber & Wilson (1995),
*Relevance*, ch. 1. Levinson (1983), *Pragmatics*, introduction.
*Optional, and a good frame for the whole module:* Franke & Jäger, "Probabilistic
pragmatics, or why Bayes' rule is probably important for pragmatics," §§1–3 and §5.
Week 1 draws its levels-of-explanation table and its gradience data from this paper.

---

### Week 2 — Game Theory and Signalling
*Section: Frameworks*

**S1.** Lewis (1969) signalling games. Coordination problems; signalling systems;
convention as equilibrium. How meaning can arise from coordinated self-interested choice.

**S2.** Equilibrium and its troubles for pragmatics: multiple equilibria, refinement,
common knowledge of rationality. **Iterated best response** (Franke; Jäger): bounded depth
of reasoning as the fix, and the direct ancestor of RSA. Parikh's games of partial
information; Benz's optimal-answer models, where relevance is projected onto the hearer's
decision problem.

*Methods:* compute best responses in a 2×2 signalling game by hand.

*Readings:* Lewis (1969), *Convention*, ch. 4. Benz & Stevens (2018), "Game-theoretic
approaches to pragmatics," *Annual Review of Linguistics* 4, 173–191. Optional: Benz &
van Rooij (2007), "Optimal assertions and what they implicate," *Topoi* 26, 63–78.

---

### Week 3 — Information Theory
*Section: Frameworks*

**S1.** Shannon: source, channel, noise, redundancy. Surprisal as −log₂ p; entropy as
expected surprisal; bits. Worked examples: fair against biased coin; a four-symbol source;
*the* against a rare word. Efficiency: Zipf, and Piantadosi, Tily & Gibson (2011) on word
lengths being predicted by information content rather than raw frequency.

**S2.** Information in language. Uniform Information Density and Jaeger's optional
*that*-mentioning. Noisy-channel comprehension: Gibson, Bergen & Piantadosi (2013), which
can be run live on the room. KL divergence and mutual information. Relevance as entropy
reduction (van Rooy 2001), and Bernardo's result that this is a special case of
decision-theoretic relevance under logarithmic utility.

*Methods:* compute surprisal and entropy over a small distribution.

*Readings:* Shannon (1948), introduction and entropy section, tightly excerpted.
Jaeger (2010), "Redundancy and reduction," *Cognitive Psychology* 61, 23–62.
Gibson et al. (2019), "How efficiency shapes human language," *TiCS* 23(5).
Optional: Piantadosi, Tily & Gibson (2012), "The communicative function of ambiguity."

---

### Week 4 — Probability, Priors and Common Ground
*Section: Frameworks*

**S1.** Bayes' rule: prior, likelihood, posterior. Stalnaker's context set, then the move
the course depends on: generalise it from a set of worlds to a distribution over them.
Presupposition as near-certainty in the prior. Projection, and why the clean story
(negation operates on the update, leaving the prior untouched) is only a first
approximation.

**S2.** The gradience data. Tonhauser, Beaver & Degen (2018) on the Gradient Projection
Principle; Degen & Tonhauser (2021) on prior beliefs modulating projection. Priors move the
other specimen too: Degen (2015) on the distribution of *some*; Degen, Tessler & Goodman on
listeners revising world knowledge. Then Bayesian data analysis: fitting a model to
judgements, credible intervals, model comparison.

*Methods:* first data-analysis exercise on a supplied dataset.

*Readings:* probLang Appendix 1 (probability and Bayes). Stalnaker (1978), "Assertion."
von Fintel (2008), "What is presupposition accommodation, again?" Tonhauser, Beaver &
Degen (2018), *Journal of Semantics* 35(3), 495–542.

> **Teaching note.** Gradience is well evidenced for **projection**, not for
> accommodation, where the record is contradictory (Tiemann et al. 2015 find no
> accommodation of the *wieder* presupposition and propose "minimize accommodation";
> Domaneschi & Di Paola 2018 find it immediate, incremental and costly; Singh et al. 2016
> find it plausibility-gated). Teach gradience through projection. Degen & Tonhauser
> (2025) state that no analysis currently on the market captures their results, which
> makes this a good open problem to hand students.

---

### Week 5 — Rational Speech Act Models
*Section: The Model*

**S1.** probLang ch. 1: literal listener, pragmatic speaker, pragmatic listener, built on
the reference game. Alternatives from week 2, priors from week 4, utility from week 3,
composed. The speaker optimality parameter. Where does the alternative set come from?
Horn scales, the symmetry problem, structural constraints (Katzir). The grammatical rival
named here: exhaustification as the conservative option.

**S2.** probLang ch. 2: scalar implicature derived. Goodman & Stuhlmüller on speaker
knowledge, where partial access blocks the implicature. Competence as a graded inferred
variable, dissolving week 1's epicycle. Then probLang Appendix 2: speaker utility is
negative surprisal minus cost, equals minimised KL divergence, equals Gricean Quantity,
and under flat priors reduces to preferring the logically stronger message. Week 1's
promise discharged.

*Methods:* extend the model. Add an utterance, shift the priors, predict before running.

*Readings:* probLang ch. 1–2 and Appendix 2. Frank & Goodman (2012), *Science* 336, 998.
Goodman & Frank (2016), *TiCS* 20(11), 818–829. Degen (2023), "The Rational Speech Act
framework," *Annual Review of Linguistics* 9, 519–540. Franke & Jäger, "Probabilistic
pragmatics," §4 (the reference-game model worked through with real data, soft-max and
\(\lambda\), and a fitted likelihood) and §6 (indirect speech acts via game theory, which
also back-fills week 2).

> **Citation note.** The copy in hand is the Tübingen preprint, filed as 2015. The
> published version is *Zeitschrift für Sprachwissenschaft* 35(1), 3–44, dated 2016.
> Check which one you want on a student-facing list; the section numbering referred to
> above is the preprint's.

---

### Week 6 — Cognitive Science and Resource Limits
*Section: Cognition*

**S1.** Resource rationality: Simon's satisficing; Anderson's rational analysis;
Griffiths, Lieder & Goodman (2015) on rational process models as a level between the
computational and the algorithmic; Gershman, Horvitz & Tenenbaum (2015) on computational
rationality. Then **Relevance Theory as the algorithmic-level theory**: cognitive effects
weighed against processing effort; the comprehension procedure as satisficing rather than
optimising; comprehension as a submodule of mindreading (Sperber & Wilson 2002). The
formal bridges: amortised RSA (White, Mu & Goodman 2020); rate-distortion RSA (Zaslavsky,
Hu & Levy 2021).

**S2.** Testing it. Does inference cost anything? Bott & Noveck (2004) against Grodner et
al. (2010) against Huang & Snedeker (2018), unresolved after twenty years and the course
thesis in miniature. Surprisal theory of processing (Hale 2001; Levy 2008; Smith & Levy
2013) and the log-versus-linear dispute (Brothers & Kuperberg 2021; Shain et al. 2024).
Theory of mind as a bounded resource (Apperly & Butterfill 2009; Fairchild & Papafragou
2021).

*Methods:* **study-design workshop.** Task artefacts taught through real cases: Geurts &
Pouscoulous obtaining 1% local implicatures in verification and 51% in inference from the
same participants on the same materials; van Tiel (2014) on typicality masquerading as a
distinct reading; Katsos & Bishop (2011) on ternary judgements beating binary.

*Readings:* Wilson & Sperber (2004), "Relevance theory," in Horn & Ward (eds.),
*Handbook of Pragmatics*. Griffiths, Lieder & Goodman (2015), *Topics in Cognitive
Science* 7(2), 217–229. Staub (2025), "Predictability in language comprehension,"
*Annual Review of Linguistics* 11. Bott & Noveck (2004), *JML* 51(3), 437–457.

---

### Week 7 — Reading Week

---

### Week 8 — Models, Data and Language Models
*Section: Application*

**S1.** Language models as instruments and as rivals. Next-token prediction as a
statistical code at scale. LM surprisal against human reading times; **Oh & Schuler
(2023)** on inverse scaling, where larger and lower-perplexity models fit reading times
*worse*, driven by their excessive accuracy on rare words. Formal against functional
competence (Mahowald et al. 2024; Bender & Koller 2020). What models do with the two
diagnostics (Hu et al. 2023).

**S2.** **Proposal workshop**, worked end to end on a phenomenon nobody has modelled:
identify the alternatives, specify priors and utilities, derive a prediction, name the
rival account, design the study that separates them, say what result would change your
mind. Presentation briefing.

*Readings:* Mahowald et al. (2024), "Dissociating language and thought in LLMs," *or*
Bender & Koller (2020), "Climbing towards NLU." Oh & Schuler (2023), *TACL* 11.
Hu et al. (2023), "A fine-grained comparison of pragmatic language understanding in
humans and language models."

---

## 5. The methods spine

The methods component is cumulative and is assessed through the presentation and essay
rather than separately.

1. **Week 1** — what a model is; run one, move a parameter.
2. **Week 2** — best response by hand; strategic reasoning without probability.
3. **Week 3** — surprisal and entropy by hand; the currency.
4. **Week 4** — Bayesian update; fitting a model to a supplied dataset.
5. **Week 5** — build and extend an RSA model; predict before running.
6. **Week 6** — evaluate a study design; recognise task artefacts.
7. **Week 8** — propose an analysis and design the study that tests it.

**Tooling.** WebPPL, via probLang. This is now compulsory rather than optional: proposing
an analysis means implementing it. Structured problem sets are required, and students need
somewhere to get unstuck, which the 2 × 1-hour format does not obviously provide. See
§7.2.

## 6. Presentation topic pool (10)

Re-tagged from the previous version. Each topic is now tagged by **which framework you
would model it in** and **what study would test it**, rather than by which corner it
extends. probLang supplies ready launchpads for three of them.

1. **Metaphor and irony.** Non-literal language as goal/QUD inference. *(RSA; probLang ch. 3.)*
2. **Theory of mind and mindreading.** The cognitive substrate inference-based pragmatics assumes; the LLM ToM controversy. *(Cognitive science.)* Apperly; Kosinski (2023) against Ullman (2023).
3. **The acquisition of pragmatics.** Where the child deficit actually sits: alternatives, relevance, or quantifier semantics. *(Cognitive science.)* Barner, Brooks & Bale (2011); Skordos & Papafragou (2016); Horowitz, Schneider & Frank (2018).
4. **Dialogue, grounding and repair.** Communication as interaction rather than single-utterance interpretation. *(Game theory.)* Clark & Brennan (1991).
5. **Politeness, face and social meaning.** Social utilities in the speaker's objective. *(RSA; probLang ch. 9.)* Brown & Levinson (1987); Yoon et al.
6. **Deixis, indexicality and perspective.** The anchoring problem. *(Information theory / grounding.)*
7. **Speech acts, commitment and accountability.** Can a model assert, promise, be held to it? *(Game theory.)* Geurts (2019), "Communication as commitment sharing."
8. **Vagueness and gradable adjectives.** Threshold inference. *(RSA; probLang ch. 5.)* Lassiter & Goodman (2017).
9. **What LLMs say about linguistic theory.** Run as a structured debate. *(Cognitive science.)* Piantadosi (2024); Kodner, Payne & Heinz (2023).
10. **Meaning, reference and grounding.** Distributional against grounded meaning. *(Information theory.)* Harnad (1990); Bender & Koller (2020).

**An eleventh, if you want one with genuinely open stakes:** design an experiment that
would discriminate Relevance Theory's satisficing comprehension procedure from RSA's
optimisation. No such experiment appears to have been published, and the two literatures
barely cite each other (Degen 2023 cites Sperber & Wilson once; Franke & Jäger 2016
mention Relevance Theory once). Unger & Buschmeier (2025) is the only bridging attempt.

## 7. Open decisions

1. **Assessment.** Handbook gives 40/60, wired as Presentation (40%) + Essay (60%).
   Under this design the natural fit is: presentation = propose the analysis; essay = the
   modelling paper with study design. **Confirm the split**, and whether the presentation
   feeds the written piece.
2. **WebPPL support.** Compulsory coding with no lab time is the main feasibility risk in
   this plan. Options: convert one session a fortnight into a clinic; set problem sets with
   worked solutions; or restrict implementation to modifying supplied models rather than
   writing from scratch.
3. **Probability prerequisite.** Real by week 3. probLang Appendix 1 is the primer and it
   is gentle, but a linguistics cohort will vary. Decide whether to set it as pre-term
   reading.
4. **The grammatical account loses its dedicated week.** Exhaustification survives as a
   named rival in week 5 and as an available presentation topic, but the embedded-implicature
   literature will not be taught properly. Note that the field's post-2016 position is a
   hybrid rather than a winner: Potts, Lassiter, Levy & Frank (2016) derive embedded
   readings pragmatically with no covert operator, and Franke & Bergen (2020) argue from
   Bayesian model comparison that grammar supplies the candidate readings while Gricean
   reasoning selects among them. If you want that taught, week 5 is the place and it needs
   a third hour.
5. **Reading-load realism.** Shannon (1948) and Lewis (1969) are hard as standalone primary
   texts for final-years. Both weeks want tight excerpting or a scaffolding secondary.

## 8. probLang mapping

Scontras, Tessler & Franke, *Probabilistic language understanding*,
https://michael-franke.github.io/probLang/

| probLang | Week | Use |
|---|---|---|
| Ch. 2, competence section | 1 | Geurts's standard recipe against the graded account. Conceptual only |
| Appendix 1, probability and Bayes | 4 | The primer; answers the prerequisite worry |
| Ch. 3, Question Under Discussion | 5 | Goal-projected utility; launchpad for topic 1 |
| Appendix 2, surprisal utilities from KL | 5 | The formal convergence. The centre of the course |
| Appendix 3, costs and utterance priors | 3 | The cost term |
| Ch. 1, vanilla RSA reference game | 5 | L₀ / S₁ / L₁ built up |
| Ch. 2, scalar implicature model | 5 | Payoff on diagnostic one |
| Ch. 10, questions about RSA | 6 | Where RSA's limits get named |
| Appendix 4, Bayesian data analysis | 4, 8 | Models against data |
| Ch. 5 vagueness · ch. 9 politeness | 9–12 | Launchpads for topics 8 and 5 |

**Gaps in probLang for this course:** nothing on presupposition (week 4 is built from
Stalnaker, von Fintel and the Tonhauser/Degen gradience literature); nothing on the
grammatical alternative; and nothing on language models, since it predates them.

---

## 9. Citations needing verification before printing

Carried from the research pass, flagged rather than silently trusted:

- **Warstadt, Agha & Franke**, "Quantifying epistemic relevance," *Open Mind* 10, 502–546,
  doi:10.1162/opmi.a.332. Dated 2026 in the sources found; verify volume and pages.
- **Buggy, Cho, Shain & Staub (2026)**, the eye-movement replication of Brothers &
  Kuperberg. Journal attribution and pagination come from a secondary source.
- **Mercier & Sperber (2011)**, *BBS* 34(2): sources give both 57–74 and 94–111 (target
  article against full treatment with commentaries).
- **Tiemann et al. (2011)**, *Sinn und Bedeutung* 15: page range given variously as
  581–596, 581–595 and 581–597.
- **Do not cite** a Chemla paper titled "Presupposition projection from quantified
  sentences: strengthened meanings and tacit variables." No such paper exists; it is a
  conflation of Chemla (2009), *NLS* 17, 299–340, with Sudo, Romoli, Hackl & Fox (2012).
- **Do not cite** a Ryskin & Gibson noisy-channel review in *Annual Review of Linguistics*.
  It does not appear to exist. The real *Annual Review* pieces in this space are Staub
  (2025) and Degen (2023).
- **Lieder & Griffiths (2020)** is not a language paper. Credit the language application to
  Hahn et al. (2022), Futrell, Gibson & Levy (2020) and Zaslavsky, Hu & Levy (2021).

---

*Citations are author-year short form for a syllabus. Happy to expand any into full
references or produce a formatted bibliography.*
