import { PublicationProps } from "../Interfaces";

/** "E." or "Ž." — a single uppercase letter followed by a period. */
const isInitial = (t: string) =>
  t.length === 2 && t.endsWith(".") && t[0] !== t[0].toLowerCase();

/** Lowercase ASCII letters only, for citation keys. */
const keyPart = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

/** Splits "A, B, and C" into ["A", "B", "C"]. */
function parseAuthors(authors: string): string[] {
  return authors
    .split(",")
    .map((a) => a.trim().replace(/^and\s+/i, ""))
    .filter(Boolean);
}

/** Family name of "E. Novak" or "T. Zdolšek Draksler"; whole name for groups. */
function familyName(author: string): string {
  const family = author.split(/\s+/).filter((t) => !isInitial(t));
  return family.join(" ") || author;
}

/**
 * "T. Zdolšek Draksler" → "Zdolšek Draksler, T." so BibTeX keeps multi-word
 * family names intact; names without initials are treated as group authors
 * and braced so they are not split.
 */
function formatAuthor(author: string): string {
  const tokens = author.split(/\s+/);
  const initials = tokens.filter((t) => isInitial(t));
  if (initials.length === 0) {
    return `{${author.replace(/^the\s+/i, "")}}`;
  }
  return `${familyName(author)}, ${initials.join(" ")}`;
}

/**
 * Generates a BibTeX entry from a publication.
 */
export function generateBibtex(pub: PublicationProps): string {
  const authors = parseAuthors(pub.authors);
  const titleWords = keyPart(pub.title.split(" ").slice(0, 2).join(""));
  const citationKey = `${keyPart(familyName(authors[0] || "unknown"))}${pub.year}${titleWords}`;

  // Type is capitalized on the publications page and may differ elsewhere.
  const kind = (pub.type || "").toLowerCase();
  const entryType = pub.chapter
    ? "incollection"
    : kind === "journal"
      ? "article"
      : kind === "arxiv" || kind === "dataset"
        ? "misc"
        : "inproceedings";

  const fields: [string, string | undefined][] = [
    ["author", authors.map(formatAuthor).join(" and ")],
    ["title", pub.title],
  ];

  const arxivId =
    kind === "arxiv" ? pub.reference.match(/arXiv:(\S+)/)?.[1] : undefined;
  if (entryType === "article") {
    fields.push(["journal", pub.reference]);
  } else if (entryType === "misc") {
    if (arxivId) {
      fields.push(["eprint", arxivId], ["archivePrefix", "arXiv"]);
    } else {
      fields.push(["howpublished", pub.reference]);
    }
  } else {
    fields.push(["booktitle", pub.reference]);
  }

  fields.push(
    ["volume", pub.volume],
    ["number", pub.number],
    ["pages", pub.pages?.replace(/(\d)\s*[-–]\s*(\d)/, "$1--$2")],
    ["publisher", pub.publisher],
    ["year", String(pub.year)],
    ["address", pub.location || undefined],
    ["doi", pub.doi],
    ["url", pub.url],
    ["keywords", pub.keywords?.length ? pub.keywords.join(", ") : undefined],
  );

  const body = fields
    .filter(([, v]) => v)
    .map(([k, v]) => `  ${k} = {${v}}`)
    .join(",\n");
  return `@${entryType}{${citationKey},\n${body}\n}`;
}

/**
 * Copies text to clipboard.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return true;
    } catch {
      document.body.removeChild(textArea);
      return false;
    }
  }
}
