# Week 4 · Figures — Stuff and Things

Animated figures for the mass/count, atoms, and lattice material.
All files live in `weeks-semantics1/figures/`. Embed in a slide with:

```html
<iframe src="../figures/fig-semilattice.html"
        style="width:100%;height:100%;border:0;"></iframe>
```

or lift the `.fig` div directly into a `.b-slide` (remove the `position:absolute` line from `.fig` in that case).

---

## Fig 1 · Join semilattice of plurals
**File:** `../figures/fig-semilattice.html`  
**Interaction:** click atoms (a, b, c) to select them and see their join highlighted on the lattice; press **Apply ∗** to reveal the full star-closure (all 7 sums); Reset.  
**Slot:** formal lens. Good for the slide introducing Link's ∗ operator and the denotation of bare plurals.

**TO DO / ideas:**
- Could add a fourth atom (d) to push the lattice to 15 nodes — useful if you want to show the exponential growth.
- Consider a variant where the lattice labels use real NPs (boys, girls, etc.) rather than a/b/c.

---

## Fig 2 · Mass vs count — atomicity & divisive reference
**File:** `../figures/fig-mass-count.html`  
**Interaction:** **Divide ↓** button cuts both domains simultaneously. The apple hits an atom (halves are no longer apples ✗); the water keeps dividing (every part is still water ✓). Up to 4 cuts.  
**Slot:** formal lens. Pair with the definition slides for *cumulative* and *divisive* reference.

**TO DO / ideas:**
- Add a third column for a bare plural (*apples*) to show cumulative-but-atomic.
- The ✗ / ✓ readout could display the Quine quote ("same stuff, smaller portion").

---

## Fig 3 · Cumulative vs quantized reference
**File:** `../figures/fig-quantized.html`  
**Interaction:** pick a predicate from the left panel (*water*, *an apple*, *apples*, *three apples*); the two cards on the right test cumulative and quantized and show a witness + verdict.  
**Slot:** formal lens. Good after the formal definitions, before moving to the verbal domain.

**TO DO / ideas:**
- Add *some water*, *a glass of water* to show measure phrases quantizing a mass noun.
- The MathJax formulae could animate in step-by-step.

---

## References
- Link, G. (1983). The logical analysis of plurals and mass terms. In R. Bäuerle et al. (eds.), *Meaning, Use, and Interpretation of Language*, 302–323. de Gruyter.
- Quine, W. V. O. (1960). *Word and Object*. MIT Press. (§19 on mass terms.)
- Krifka, M. (1989). Nominal reference, temporal constitution and quantification in event semantics. In R. Bartsch et al. (eds.), *Semantics and Contextual Expression*, 75–115. Foris.
