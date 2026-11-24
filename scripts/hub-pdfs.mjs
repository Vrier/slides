/* ============================================================
   scripts/hub-pdfs.mjs — what the hub's PDF buttons need. No deps.
   Shared by scripts/make-pdfs.mjs (which prints the PDFs) and
   scripts/check.mjs (which checks they exist and are up to date).

   hubPages(root)   every ready HTML page the hub links to: week rows
                    (CARD_ROWS × WEEKS, with files overrides), module
                    overviews, topics, docs and ready assessments, read
                    from index.html the way the hub's own script does.
   sourceHash(root, page)
                    sha1 of the page and the local CSS/JS/images it
                    loads, so a PDF is out of date when any of them
                    changes. Recorded in shared/pdf-list.js.
   pdfOf(page)      the PDF printed beside the page: x.html → x.pdf.
   readPdfList(root) the {page: hash} map in shared/pdf-list.js.
   ============================================================ */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";

export const PDF_LIST = "shared/pdf-list.js";

// Evaluate `const NAME = <literal>` from the hub's inline script. Bracket
// matching skips strings and // comments, so one-line and multi-line
// literals both work.
function hubConst(src, name) {
  const marker = `const ${name} = `;
  const i = src.indexOf(marker);
  if (i < 0) throw new Error(`index.html: const ${name} not found`);
  let j = i + marker.length, depth = 0, q = null;
  for (; j < src.length; j++) {
    const c = src[j];
    if (q) { if (c === "\\") j++; else if (c === q) q = null; continue; }
    if (c === "'" || c === '"' || c === "`") { q = c; continue; }
    if (c === "/" && src[j + 1] === "/") { j = src.indexOf("\n", j); continue; }
    if ("[{(".includes(c)) depth++;
    else if ("]})".includes(c) && --depth === 0) { j++; break; }
  }
  return vm.runInNewContext("(" + src.slice(i + marker.length, j) + ")");
}

export function hubPages(root) {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const WEEKS = hubConst(html, "WEEKS"), DIR = hubConst(html, "DIR");
  const CARD_ROWS = hubConst(html, "CARD_ROWS"), IDENTITIES = hubConst(html, "IDENTITIES");
  const pad = (n) => String(n).padStart(2, "0");
  const pages = new Set();
  for (const w of WEEKS) {
    if (w.reading || w.present) continue;            // note cards, no rows
    if (!("rd" in w)) w.rd = "ready";                 // as the hub does
    for (const [kind, file] of CARD_ROWS[w.m] || CARD_ROWS.default) {
      if (w[kind] !== "ready") continue;
      pages.add(`${DIR[w.m]}/week-${pad(w.no)}/${(w.files && w.files[kind]) || file}`);
    }
  }
  for (const [g, ids] of Object.entries(IDENTITIES)) {
    for (const id of ids) {
      const dir = DIR[g];
      if (id.ov === "ready") pages.add(`${dir}/overview-${id.key}.html`);
      if (id.topics) pages.add(`${dir}/${id.topics}`);
      for (const [file] of id.docs || []) pages.add(`${dir}/${file}`);
      for (const a of id.assessments || []) {
        if (a.st !== "ready") continue;
        pages.add(`${dir}/assessments/${id.key}-a${a.no}.html`);
        if (a.guide) pages.add(`${dir}/assessments/${a.guide}`);
      }
    }
  }
  return [...pages].filter((p) => p.endsWith(".html")).sort();
}

export const pdfOf = (page) => page.replace(/\.html$/, ".pdf");

const ASSET_RE = /(?:href|src)\s*=\s*"([^"#?]+)"/g;
const ASSET_EXT = /\.(css|js|mjs|png|jpe?g|webp|gif|svg|woff2?|ttf|otf)$/i;

export function sourceHash(root, page) {
  const abs = path.join(root, page);
  const html = fs.readFileSync(abs, "utf8");
  const h = crypto.createHash("sha1").update(html);
  const assets = new Set();
  for (const m of html.matchAll(ASSET_RE)) {
    const ref = m[1];
    if (/^(?:[a-z]+:|\/\/)/i.test(ref) || !ASSET_EXT.test(ref)) continue;
    const p = path.resolve(path.dirname(abs), ref);
    if (fs.existsSync(p)) assets.add(p);
  }
  for (const p of [...assets].sort()) h.update("\0" + path.relative(root, p) + "\0").update(fs.readFileSync(p));
  return h.digest("hex").slice(0, 16);
}

export function readPdfList(root) {
  const f = path.join(root, PDF_LIST);
  if (!fs.existsSync(f)) return {};
  const window = {};
  vm.runInNewContext(fs.readFileSync(f, "utf8"), { window });
  return window.PDF_LIST || {};
}

export function writePdfList(root, list) {
  const keys = Object.keys(list).sort();
  const body = keys.map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(list[k])},`).join("\n");
  fs.writeFileSync(path.join(root, PDF_LIST),
    "// Made by scripts/make-pdfs.mjs (npm run pdfs). Do not edit by hand.\n" +
    "// Each page that has a premade PDF beside it (x.html → x.pdf), with a hash of the\n" +
    "// page and the local files it loads when the PDF was made. The hub shows a PDF\n" +
    "// button for these pages; npm test warns when a hash no longer matches.\n" +
    "window.PDF_LIST = {\n" + body + "\n};\n");
}
