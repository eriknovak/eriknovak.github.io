import { PublicationProps } from "../Interfaces";

/**
 * Generates a BibTeX entry from a publication.
 */
export function generateBibtex(pub: PublicationProps): string {
  // Generate citation key from first author's last name and year
  const firstAuthor = pub.authors.split(",")[0].trim();
  const lastName = firstAuthor.split(" ").pop()?.toLowerCase() || "unknown";
  const titleWords = pub.title
    .split(" ")
    .slice(0, 2)
    .join("")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
  const citationKey = `${lastName}${pub.year}${titleWords}`;

  // Determine entry type (type may be capitalized on the publications page
  // or lowercase on the home page, so normalize before comparing)
  const normalizedType = (pub.type || "").toLowerCase();
  const entryType =
    normalizedType === "journal"
      ? "article"
      : normalizedType === "arxiv" || normalizedType === "dataset"
        ? "misc"
        : "inproceedings";

  // Build BibTeX fields
  const fields: string[] = [];
  fields.push(`  author = {${formatAuthorsForBibtex(pub.authors)}}`);
  fields.push(`  title = {${pub.title}}`);

  if (entryType === "article") {
    fields.push(`  journal = {${pub.reference}}`);
  } else if (entryType === "misc") {
    fields.push(
      `  howpublished = {${
        normalizedType === "arxiv"
          ? `arXiv preprint ${pub.reference}`
          : pub.reference
      }}`,
    );
  } else {
    fields.push(`  booktitle = {${pub.reference}}`);
  }

  fields.push(`  year = {${pub.year}}`);

  if (pub.location) {
    fields.push(`  address = {${pub.location}}`);
  }

  if (pub.doi) {
    fields.push(`  doi = {${pub.doi}}`);
  }

  if (pub.url) {
    fields.push(`  url = {${pub.url}}`);
  }

  if (pub.keywords && pub.keywords.length > 0) {
    fields.push(`  keywords = {${pub.keywords.join(", ")}}`);
  }

  return `@${entryType}{${citationKey},\n${fields.join(",\n")}\n}`;
}

/**
 * Formats authors string for BibTeX (converts "A, B, C" to "A and B and C").
 */
function formatAuthorsForBibtex(authors: string): string {
  return authors
    .split(",")
    .map((a) => a.trim())
    .join(" and ");
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
