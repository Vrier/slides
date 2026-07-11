/* ============================================================
   shared/decks.js — THE deck catalogue. Single source of truth:
   the hub (/index.html) renders from this, scripts/check.mjs
   validates folders against it. One entry per deck folder.

   Fields:
     year   number   top-level folder (e.g. 2026)
     slug   string   folder name — kebab-case, NEVER renamed once shared
     title  string
     venue  string   conference / seminar / "—"
     date   string   "YYYY-MM-DD" (talk date, or last edit for drafts)
     status "ready" | "draft"   (drafts deploy too; the hub just marks them)
   ============================================================ */
window.DECKS = [
  {
    year: 2026,
    slug: "demo",
    title: "Demo deck — design-system smoke test",
    venue: "—",
    date: "2026-07-11",
    status: "ready"
  }
];
