# Readings — APA upgrade working data (resume file)

Status: pragmatics readings currently use the triad (classical/contemporary/textbook) WITHOUT full APA.
Semantics readings still use the OLD core/further layout. This file holds the compiled APA dataset to
regenerate ALL 22 readings with: triad layout, full APA (italic journal/vol + book titles), page ranges
where confident, DOIs, and open-PDF/SEP link chips.

User decisions (m0136):
- W1 (prag): swap to primary texts — Wittgenstein PI + Ayer/Carnap (done in data below; dropped Grice 1957 lead).
- W6 (prag): keep, but linguistic textbook — Jurafsky & Martin SLP3 (free online).
- W11 (prag): confirmed = grammatical view of implicature.
- W10 (prag): use Goodman & Frank (2016, TiCS) as the textbook/review.
- apply triad to SEMANTICS too.
- citation style: FULL APA with page ranges.
- find open PDFs and add links where available.

VERIFIED live this session (high confidence, with open PDF/DOI):
- Grice (1957). Meaning. The Philosophical Review, 66(3), 377–388. PDF: https://web.stanford.edu/~paulsko/papers/Grice-meaning.pdf
- Grice (1975). Logic and conversation. In Cole & Morgan (Eds.), Syntax and semantics 3 (pp. 41–58). Academic Press.
- Sauerland (2004). Scalar implicatures in complex sentences. Linguistics and Philosophy, 27(3), 367–391. doi:10.1023/B:LING.0000023378.71748.db  PDF: https://web.mit.edu/24.954/www/files/sauerland.implicatures.pdf
- Schlenker (2009). Local contexts. Semantics and Pragmatics, 2(3), 1–78. doi:10.3765/sp.2.3 (Diamond OA) PDF: https://semprag.org/index.php/sp/article/download/sp.2.3/71/0
- Stalnaker (1978). Assertion. In Cole (Ed.), Syntax and semantics 9 (pp. 315–332). Academic Press.
- Sauerland (2012). The computation of scalar implicatures… Language and Linguistics Compass, 6(1), 36–49.

UNVERIFIED page ranges/DOIs to CONFIRM next session (search budget = ~4/turn):
- Carston 2008 Synthese 165(3),321–345 (doi 10.1007/s11229-007-9191-8?) ; Chemla & Singh 2014 LLC 8(9) pages ;
  Heim 1983 WCCFL2 pp.114–125 ; Potts 2015 handbook pp ; Wilson&Sperber 2004 handbook pp.607–632 ;
  Chierchia/Fox/Spector 2012 HSK pp.2297–2331 ; Lakoff 1973 CLS pp.292–305 ; Horn 1984 GURT pp.11–42 ;
  Searle 1975 pp.59–82 ; Frege 1948 Phil Review 57(3),209–230 ; Russell 1905 Mind 14(56),479–493 ;
  Strawson 1950 Mind 59(235),320–344 ; Shannon 1948 BSTJ 27(3),379–423 ; Church 1940 JSL 5(2),56–68 ;
  Church 1936 AJM 58(2),345–363 ; Quine 1956 J.Phil 53(5),177–187 ; Barwise&Cooper 1981 L&P 4(2),159–219 ;
  Tarski 1944 PPR 4(3),341–376 ; Sperber&Wilson 1987 BBS 10(4),697–710 ; Sperber et al 2010 Mind&Lang 25(4),359–393 ;
  Frank&Goodman 2012 Science 336(6084),998 ; Goodman&Frank 2016 TiCS 20(11),818–829 ;
  Piantadosi 2014 Psychon Bull Rev 21(5),1112–1130 ; Gibson et al 2019 TiCS 23(5),389–407 ;
  Terkourafi 2005 JPR 1(2),237–262 ; Schlenker 2008 Theor.Ling 34(3),157–212 ; Geurts 2019 Theor.Ling 45(1–2),1–30.

Stable links (confident): SEP slugs plato.stanford.edu/entries/{meaning,descriptions,truth,generalized-quantifiers,
compositionality,type-theory,lambda-calculus,possible-worlds,presupposition,implicature,prop-attitude-reports}/ ;
Jurafsky&Martin SLP3 https://web.stanford.edu/~jurafsky/slp3/ ; von Fintel&Heim Intensional Semantics
http://mit.edu/fintel/fintel-heim-intensional.pdf ; RSA handout
https://web.stanford.edu/class/linguist130a/2022/materials/ling130a-handout-02-17-rsa.pdf

## Remaining build steps
1. (CSS done) .ti-j/.bk italics, .rd-link chips added to shared/readings.css.
2. Verify the UNVERIFIED list via web_search (batches of ~4/turn); correct pages/DOIs.
3. Regenerate all 22 readings (run_script): triad layout + APA fmt() + link chips. Semantics 4th lens = Typological/g-typ; Pragmatics = Applied/g-app.
4. index.html: readings already all 'ready' — no change needed unless states shift.
5. ready_for_verification(index.html).

## SEMANTICS triad (LI7869) — final picks
W1 What is Meaning?  C: Frege 1948 "Sense and reference" Phil Review 57(3)209–230 (orig 1892) | Cont: Speaks SEP "Theories of meaning" | Text: Heim&Kratzer 1998 ch.1
W2 Truth & Reference C: Russell 1905 Mind 14(56)479–493 | Cont: Ludlow SEP "Descriptions" | Text: Heim&Kratzer ch.5
W3 Predicates&Set Th C: Tarski 1944 PPR 4(3)341–376 | Cont: Glanzberg SEP "Truth" | Text: Heim&Kratzer chs.1–2
W4 Quantification    C: Barwise&Cooper 1981 L&P 4(2)159–219 | Cont: Westerståhl SEP "Generalized quantifiers" | Text: Heim&Kratzer chs.6–7
W5 Function App.     C: Frege 1891 "Function and concept" (Geach&Black) | Cont: Szabó SEP "Compositionality" | Text: Heim&Kratzer ch.3
W6 Type Theory       C: Church 1940 JSL 5(2)56–68 | Cont: SEP "Type theory" | Text: Heim&Kratzer ch.2
W7 Lambda Calculus   C: Church 1936 AJM 58(2)345–363 | Cont: SEP "The lambda calculus" | Text: von Fintel&Heim 2011 Intensional Semantics (open)
W8 Intensionality    C: Quine 1956 J.Phil 53(5)177–187 | Cont: SEP "Propositional attitude reports" | Text: Heim&Kratzer ch.12
W9 Possible Worlds   C: Kripke 1980 Naming and Necessity (Harvard) | Cont: Menzel SEP "Possible worlds" | Text: von Fintel&Heim 2011 (open)
W10 Presupposition   C: Stalnaker 1974 "Pragmatic presuppositions" in Munitz&Unger (NYU Press) | Cont: Schlenker 2009 Local Contexts (open) | Text: Beaver&Geurts SEP "Presupposition"
W11 Implicature      C: Grice 1975 (pp.41–58) | Cont: Sauerland 2004 (open pdf) | Text: Levinson 1983 Pragmatics ch.3

## PRAGMATICS triad (LI7862) — final picks (W1 has 2 classical)
W1 Pragmatic Meaning  C1: Wittgenstein 1953 Philosophical Investigations (Anscombe trans., Blackwell) ; C2: Ayer 1936 Language, Truth and Logic (Gollancz) | Cont: Carston 2008 Synthese 165(3)321–345 | Text: Levinson 1983 ch.1
W2 Speech Acts        C: Searle 1975 "Indirect speech acts" in Cole&Morgan SS3 pp.59–82 | Cont: Geurts 2019 Theor.Ling 45(1–2)1–30 | Text: Levinson 1983 ch.5
W3 Implicature        C: Grice 1975 pp.41–58 | Cont: Sauerland 2004 (open) | Text: Levinson 1983 ch.3
W4 Presupposition     C: Strawson 1950 Mind 59(235)320–344 | Cont: Schlenker 2008 Theor.Ling 34(3)157–212 | Text: Levinson 1983 ch.4
W5 Common Ground&Proj C: Stalnaker 1978 pp.315–332 | Cont: Schlenker 2009 Local Contexts (open) | Text: Potts 2015 in Lappin&Fox Handbook (2nd ed.) Wiley-Blackwell
W6 Information        C: Shannon 1948 BSTJ 27(3)379–423 | Cont: Piantadosi 2014 Psychon Bull Rev 21(5)1112–1130 | Text: Jurafsky&Martin SLP3 "N-gram language models" (online)
W7 Politeness         C: Lakoff 1973 CLS9 pp.292–305 | Cont: Terkourafi 2005 JPR 1(2)237–262 | Text: Grundy 2008 Doing Pragmatics 3e (politeness chap.) Hodder
W8 Neo-Gricean        C: Horn 1984 GURT'84 pp.11–42 | Cont: Chemla&Singh 2014 LLC 8(9) | Text: Huang 2007 Pragmatics ch.2 (OUP)
W9 Relevance Theory   C: Sperber&Wilson 1987 BBS 10(4)697–710 | Cont: Sperber et al 2010 Mind&Lang 25(4)359–393 | Text: Wilson&Sperber 2004 in Horn&Ward Handbook pp.607–632 (Blackwell)
W10 RSA               C: Lewis 1969 Convention (Harvard) | Cont: Frank&Goodman 2012 Science 336(6084)998 | Text: Goodman&Frank 2016 TiCS 20(11)818–829 + resource: Stanford RSA handout
W11 Grammaticalism    C: Chierchia 2004 in Belletti, Structures and Beyond v3 pp.39–103 (OUP) | Cont: Chierchia,Fox&Spector 2012 HSK 33.3 pp.2297–2331 (de Gruyter) | Text: Sauerland 2012 LLC 6(1)36–49
