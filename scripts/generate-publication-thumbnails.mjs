#!/usr/bin/env node
/**
 * Generate first-page thumbnails (PNG) for publications.
 *
 * Output: public/imgs/publications/<id>.png — the <id> matches the `id` field
 * in assets/publications/*.ts. The publications page picks up any PNG in that
 * directory automatically at build time; no code change is needed after
 * adding or regenerating an image.
 *
 * Requires poppler's `pdftoppm` on the PATH:
 *   - Debian/Ubuntu: sudo apt-get install poppler-utils
 *   - macOS:         brew install poppler
 *
 * Usage:
 *   node scripts/generate-publication-thumbnails.mjs             # all known PDFs
 *   node scripts/generate-publication-thumbnails.mjs --force     # regenerate existing
 *   node scripts/generate-publication-thumbnails.mjs <id>        # one entry from the list
 *   node scripts/generate-publication-thumbnails.mjs <id> <pdf>  # manual: local file or URL
 *
 * The manual form is for papers whose PDF is not openly downloadable
 * (paywalled journals) or not yet published (posters): download the PDF
 * yourself, then run e.g.
 *   node scripts/generate-publication-thumbnails.mjs ohdsi-llm-pipeline-poster-2025 ~/Downloads/poster.pdf
 */

import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "imgs", "publications");
const WIDTH = 480; // 92px display width — 480px keeps it crisp on retina

/**
 * id → PDF source. Kept in sync by hand with assets/publications/*.ts
 * (entries there without an open PDF are omitted; use the manual form for
 * those). URLs mirror the `pdf`/`url` fields or the publisher's open-access
 * PDF endpoint.
 */
const SOURCES = {
  // Journal papers
  "clinical-ner-llms-2026":
    "https://www.tandfonline.com/doi/pdf/10.1080/08839514.2026.2700905",
  "synthetic-medical-data-eval-2025":
    "https://www.informatica.si/index.php/informatica/article/view/7763/4618",
  "kleefstra-cohort-2024":
    "https://www.sciencedirect.com/science/article/pii/S1769721224000661/pdfft?download=true",
  "text-generation-eval-2024":
    "https://ieeexplore.ieee.org/stampPDF/getPDF.jsp?tp=&arnumber=10591977",
  "streaming-data-fusion-2019": "https://www.mdpi.com/1424-8220/19/8/1955/pdf",
  // tarnet-2024 and crosslingual-relevance-2022 have no open PDF endpoint —
  // use the manual form with a downloaded copy.

  // Conference papers
  "ohdsi-prepare-poster-2026":
    "https://www.ohdsi-europe.org/images/symposium-2026/posters/34_abstract.pdf",
  "semantic-prompting-ner-2025":
    "https://aile3.ijs.si/dunja/SiKDD2025/Papers/IS2024_-_SIKDD_2025_paper_3.pdf",
  "synthetic-medical-data-2024":
    "https://aile3.ijs.si/dunja/SiKDD2024/Papers/IS2024_-_SIKDD_2024_paper_4.pdf",
  "local-world-models-2024":
    "https://aile3.ijs.si/dunja/SiKDD2024/Papers/IS2024_-_SIKDD_2024_paper_22.pdf",
  "kg-extraction-llm-2024":
    "https://aile3.ijs.si/dunja/SiKDD2024/Papers/IS2024_-_SIKDD_2024_paper_15.pdf",
  "slomet-2022":
    "https://ailab.ijs.si/dunja/SiKDD2022/Papers/SiKDD2022_paper_5674.pdf",
  "song-artists-similarity-2022":
    "https://ailab.ijs.si/dunja/SiKDD2022/Papers/SiKDD2022_paper_5269.pdf",
  "film-text-generation-2022":
    "https://ailab.ijs.si/dunja/SiKDD2022/Papers/SiKDD2022_paper_4772.pdf",
  "aml-screening-2022":
    "https://link.springer.com/content/pdf/10.1007/978-3-030-94590-9_13.pdf",
  "news-stream-clustering-2021":
    "https://ailab.ijs.si/dunja/SiKDD2021/Papers/Novak.pdf",
  "legal-semantic-enrichment-2019":
    "http://ailab.ijs.si/dunja/SiKDD2019/Papers/Besher_Final.pdf",
  "legal-doc-embeddings-2019":
    "http://ailab.ijs.si/dunja/SiKDD2019/Papers/Kralj_Urbancic_Final.pdf",
  "oer-preferences-2019":
    "http://ailab.ijs.si/dunja/SiKDD2019/Papers/Sunar_Final.pdf",
  "multimodal-data-nlp-2018":
    "http://ailab.ijs.si/dunja/SiKDD2018/Papers/NovakErik.pdf",
  "skill-demand-supply-2017":
    "http://ailab.ijs.si/dunja/SiKDD2017/Papers/Novak_Skill.pdf",
  "videolectures-analysis-2016":
    "http://ailab.ijs.si/dunja/SiKDD2016/Papers/Novak_VLN.pdf",
  // ohdsi-llm-pipeline-poster-2025, oer-learning-pathways-2020 and
  // qminer-2014 have no direct PDF — use the manual form.

  // arXiv preprints
  "olympics-news-dataset-2025": "https://arxiv.org/pdf/2502.06648",
  "ai-learning-companion-2021": "https://arxiv.org/pdf/2112.01242",
  "peek-dataset-2021": "https://arxiv.org/pdf/2109.03154",
};

function assertPdftoppm() {
  const check = spawnSync("pdftoppm", ["-v"], { encoding: "utf8" });
  if (check.error) {
    console.error(
      "pdftoppm not found. Install poppler-utils (apt) / poppler (brew) first.",
    );
    process.exit(1);
  }
}

async function fetchPdf(source, destination) {
  if (!/^https?:\/\//.test(source)) {
    fs.copyFileSync(source, destination);
    return;
  }
  const res = await fetch(source, {
    redirect: "follow",
    headers: { "User-Agent": "Mozilla/5.0 (publication-thumbnails script)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (!buf.subarray(0, 5).toString("latin1").startsWith("%PDF")) {
    throw new Error("response is not a PDF (probably an HTML page)");
  }
  fs.writeFileSync(destination, buf);
}

function renderFirstPage(pdfPath, id) {
  const prefix = path.join(OUT_DIR, id);
  execFileSync("pdftoppm", [
    "-png",
    "-f",
    "1",
    "-l",
    "1",
    "-scale-to-x",
    String(WIDTH),
    "-scale-to-y",
    "-1",
    "-singlefile",
    pdfPath,
    prefix,
  ]);
  return `${prefix}.png`;
}

async function main() {
  assertPdftoppm();
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const args = process.argv.slice(2).filter((a) => a !== "--force");
  const force = process.argv.includes("--force");

  let jobs;
  if (args.length === 2) {
    jobs = [[args[0], args[1]]];
  } else if (args.length === 1) {
    if (!SOURCES[args[0]]) {
      console.error(`Unknown id "${args[0]}" — pass a PDF path/URL as well.`);
      process.exit(1);
    }
    jobs = [[args[0], SOURCES[args[0]]]];
  } else {
    jobs = Object.entries(SOURCES);
  }

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "pub-thumbs-"));
  let ok = 0;
  const failed = [];
  for (const [id, source] of jobs) {
    const out = path.join(OUT_DIR, `${id}.png`);
    if (!force && args.length !== 2 && fs.existsSync(out)) {
      console.log(`= ${id} (exists, skipping — use --force to regenerate)`);
      continue;
    }
    try {
      const pdfPath = path.join(tmp, `${id}.pdf`);
      await fetchPdf(source, pdfPath);
      renderFirstPage(pdfPath, id);
      console.log(`+ ${id}`);
      ok += 1;
    } catch (err) {
      failed.push(id);
      console.error(`! ${id}: ${err.message}`);
    }
  }
  fs.rmSync(tmp, { recursive: true, force: true });

  console.log(`\nDone: ${ok} generated, ${failed.length} failed.`);
  if (failed.length) {
    console.log(
      "For failed entries, download the PDF manually and run:\n" +
        "  node scripts/generate-publication-thumbnails.mjs <id> <path-to.pdf>",
    );
  }
}

main();
