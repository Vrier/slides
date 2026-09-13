# Readings harvest — Pragmatics I (LI7862) · Week 1 "Pragmatic Meaning"

Session 2026-09-12. The sandbox shell was down, so **no files could be
downloaded this session** — this manifest records verified open-access links
and the exact commands to fetch them in a healthy session. Note: this folder
sits inside the public repo; keep it out of git (or move it) if you don't want
the PDFs on slides.tstephen.com.

## Verified — ready to download

| # | Citation | Save as | Source (verified) |
|---|----------|---------|-------------------|
| 1 | Ayer, A. J. (1936). The function of philosophy and the elimination of metaphysics. In *Language, truth and logic* (chap. 1). Victor Gollancz. | `ayer1936.pdf` | LSE course posting, exactly ch. 1 — text confirmed: https://personal.lse.ac.uk/robert49/teaching/ph201/Week02_Ayer.pdf |
| 2 | Horn, L. R., & Ward, G. (2004). Introduction. In *The handbook of pragmatics* (pp. xi–xix). Blackwell. | `horn-ward2004-intro.pdf` | Publisher sample PDF (e-bookshelf), contains the complete Introduction xi–xix plus front matter — text confirmed: https://download.e-bookshelf.de/download/0000/5791/95/L-G-0000579195-0015278659.pdf |

Download commands (run when the shell VM is healthy, from the repo root):

```bash
cd readings
curl -sL -4 --max-time 120 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" \
  "https://personal.lse.ac.uk/robert49/teaching/ph201/Week02_Ayer.pdf" -o ayer1936.pdf
curl -sL -4 --max-time 120 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" \
  "https://download.e-bookshelf.de/download/0000/5791/95/L-G-0000579195-0015278659.pdf" -o horn-ward2004-intro.pdf
file *.pdf && ls -l *.pdf   # both must say "PDF document"
```

## Unavailable / unverified

| Citation | Status |
|----------|--------|
| Levinson, S. C. (1983). The scope of pragmatics. In *Pragmatics* (chap. 1). Cambridge University Press. | **No verified open copy.** Copyrighted CUP textbook chapter; the only full PDFs found are unauthorised book uploads (skipped). One plausible course-posted scan exists but could not be verified (image-only scan, host unreachable from this machine): https://parles.upf.edu/llocs/bgehrke/Pragmatik13/levinson83_1.pdf — the sibling `levinson83_4.pdf` is confirmed to exist on that course page, so try `_1` first in a healthy session and check it is ch. 1. Otherwise: TCD library has the book (Cambridge Core ebook — students can read ch. 1 via the Stella catalogue), or scan ch. 1 from a print copy for Blackboard. Interlibrary-loan citation: Levinson, Stephen C. 1983. *Pragmatics* (Cambridge Textbooks in Linguistics). Cambridge: CUP, ch. 1, pp. 1–53. ISBN 9780521294140. |

Also on file: archive.org has a freely readable scan of the full Ayer text
(https://archive.org/details/ayer-language-truth-and-logic) as a backup if the
LSE link dies; the Levinson at archive.org (`pragmatics00levi`) is a
controlled-lending scan — borrowable page-by-page, not downloadable.
