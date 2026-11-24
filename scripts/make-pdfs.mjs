#!/usr/bin/env node
/* ============================================================
   scripts/make-pdfs.mjs — the premade PDFs behind the hub's PDF
   buttons (`npm run pdfs`).

     npm run pdfs                 make the PDFs that are missing or
                                  out of date
     npm run pdfs -- --all        remake every PDF
     npm run pdfs -- week-10 …    remake only pages whose path
                                  contains one of these

   Needs `npm install` once (playwright-core) and Google Chrome.
   Set CHROME_PATH to use a particular browser binary.

   Every ready HTML page the hub links to (scripts/hub-pdfs.mjs) is
   opened from disk, left to finish its fonts, maths and images, and
   printed the way Chrome's Print → Save as PDF prints it: sheets on
   their own A4 @page rules, decks one page per slide at the design
   size with every build shown. The PDF is saved beside the page
   (x.html → x.pdf) and recorded in shared/pdf-list.js with a hash of
   the page and its local CSS/JS/images. Commit the PDFs and
   shared/pdf-list.js with the pages; npm test warns when a page has
   changed since its PDF was made.
   ============================================================ */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { hubPages, pdfOf, sourceHash, readPdfList, writePdfList } from "./hub-pdfs.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

let chromium;
try { ({ chromium } = await import("playwright-core")); }
catch { console.error("make-pdfs: run `npm install` first (it needs playwright-core)."); process.exit(1); }

const args = process.argv.slice(2);
const remakeAll = args.includes("--all");
const only = args.filter((a) => !a.startsWith("--"));

const pages = hubPages(ROOT);
const list = readPdfList(ROOT);
for (const k of Object.keys(list)) if (!pages.includes(k)) delete list[k];   // no longer on the hub

const todo = pages.filter((p) => {
  if (only.length) return only.some((f) => p.includes(f));
  if (remakeAll) return true;
  return list[p] !== sourceHash(ROOT, p) || !fs.existsSync(path.join(ROOT, pdfOf(p)));
});
if (!todo.length) { console.log(`make-pdfs: all ${pages.length} PDFs are up to date.`); process.exit(0); }
console.log(`make-pdfs: ${todo.length} of ${pages.length} page(s) to print.`);

const launch = { args: process.getuid && process.getuid() === 0 ? ["--no-sandbox"] : [] };
if (process.env.CHROME_PATH) launch.executablePath = process.env.CHROME_PATH;
else launch.channel = "chrome";
const browser = await chromium.launch(launch);
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });

// Wait until the page has finished drawing: webfonts, MathJax (v2 or v3),
// images (lazy ones forced to load), then a short pause for scripts that
// build figures after load (COMPOSE trees, rails).
async function settle(page) {
  await page.evaluate(async () => {
    document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = "eager"; });
    const MJ = window.MathJax;
    if (MJ && MJ.startup && MJ.startup.promise) await MJ.startup.promise;
    else if (MJ && MJ.Hub && MJ.Hub.Queue) await new Promise((r) => MJ.Hub.Queue(r));
    await document.fonts.ready;
    await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))));
  });
  await page.waitForTimeout(800);
}

const failed = [];
for (const [n, p] of todo.entries()) {
  const out = path.join(ROOT, pdfOf(p));
  const t0 = Date.now();
  const page = await context.newPage();
  try {
    await page.goto(pathToFileURL(path.join(ROOT, p)).href, { waitUntil: "networkidle", timeout: 120000 });
    await settle(page);
    const deck = await page.evaluate(() => !!document.querySelector("deck-stage"));
    await page.emulateMedia({ media: "print" });
    // The deck shell readies every slide for print on beforeprint
    // (all builds shown, entrance animations frozen at their end).
    if (deck) await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
    await page.waitForTimeout(deck ? 600 : 200);
    const tmp = out + ".part";
    await page.pdf({ path: tmp, printBackground: true, preferCSSPageSize: true, format: "A4" });
    fs.renameSync(tmp, out);
    list[p] = sourceHash(ROOT, p);
    const kb = Math.round(fs.statSync(out).size / 1024);
    console.log(`  [${n + 1}/${todo.length}] ${pdfOf(p)}  ${kb} KB  ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  } catch (e) {
    failed.push(p);
    console.error(`  [${n + 1}/${todo.length}] FAILED ${p}: ${e.message.split("\n")[0]}`);
  } finally {
    await page.close();
  }
  writePdfList(ROOT, list);           // after every page, so an interrupted run keeps its work
}
await browser.close();

if (failed.length) { console.error(`make-pdfs: ${failed.length} page(s) failed.`); process.exit(1); }
console.log("make-pdfs: done. Commit the PDFs and shared/pdf-list.js.");
