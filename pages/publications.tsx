import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";

import Publication from "../components/Publication";
import SEO from "../components/SEO";

import ARXIV_PAPERS from "../assets/publications/arxiv_papers";
import CONFERENCE_PAPERS from "../assets/publications/conference_papers";
import DATASETS from "../assets/publications/datasets";
import JOURNAL_PAPERS from "../assets/publications/journal_papers";
import { PublicationProps } from "../Interfaces";

import { withThumbnails } from "../utils/publications";
import { getThumbnailIds } from "../utils/publications.server";
import { sortByDate } from "../utils/sort";

import styles from "./publications.module.scss";

type FilterValue = "all" | "Journal" | "Conference" | "arXiv" | "Datasets";

const ALL_PAPERS: PublicationProps[] = [
  ...JOURNAL_PAPERS.map((paper) => ({ ...paper, type: "Journal" })),
  ...CONFERENCE_PAPERS.map((paper) => ({ ...paper, type: "Conference" })),
  ...ARXIV_PAPERS.map((paper) => ({ ...paper, type: "arXiv" })),
].sort((a, b) => sortByDate(a, b, "year"));

const DATASET_ITEMS: PublicationProps[] = DATASETS.map((d) => ({
  ...d,
  type: "Dataset",
})).sort((a, b) => sortByDate(a, b, "year"));

const EVERYTHING: PublicationProps[] = [...ALL_PAPERS, ...DATASET_ITEMS].sort(
  (a, b) => sortByDate(a, b, "year"),
);

/** Spelled-out phrases folded to their acronym so either form finds the other. */
const ACRONYMS: [RegExp, string][] = [
  [/\blarge language models?\b/g, "llm"],
  [/\bmachine learning\b/g, "ml"],
  [/\bartificial intelligence\b/g, "ai"],
  [/\bnatural language processing\b/g, "nlp"],
  [/\bnamed entity recognition\b/g, "ner"],
  [/\bknowledge graphs?\b/g, "kg"],
  [/\bopen educational resources?\b/g, "oer"],
  [/\binternet of things\b/g, "iot"],
  [/\banti[- ]money laundering\b/g, "aml"],
];

const normalize = (value: string) => {
  const folded = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  return ACRONYMS.reduce((v, [re, short]) => v.replace(re, short), folded);
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Every query token must start a word in title, authors, venue or abstract. */
function matchesQuery(p: PublicationProps, query: string) {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;
  const haystack = normalize(
    [p.title, p.authors, p.reference, p.location, p.abstract]
      .filter(Boolean)
      .join(" "),
  );
  return tokens.every((token) =>
    new RegExp(`(^|[^a-z0-9])${escapeRegExp(token)}`).test(haystack),
  );
}

export function getStaticProps() {
  return { props: { thumbnailIds: getThumbnailIds() } };
}

export default function Publications({
  thumbnailIds,
}: {
  thumbnailIds: string[];
}) {
  const { t, ready } = useTranslation("publications");
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<FilterValue>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const tt = (key: string, fallback: string) =>
    mounted && ready ? t(key) : fallback;

  const matching = useMemo(
    () => EVERYTHING.filter((p) => matchesQuery(p, query)),
    [query],
  );

  const counts = useMemo(
    () => ({
      all: matching.length,
      Journal: matching.filter((p) => p.type === "Journal").length,
      Conference: matching.filter((p) => p.type === "Conference").length,
      arXiv: matching.filter((p) => p.type === "arXiv").length,
      Datasets: matching.filter((p) => p.type === "Dataset").length,
    }),
    [matching],
  );

  const filtered = useMemo(() => {
    const list =
      filter === "all"
        ? matching
        : filter === "Datasets"
          ? matching.filter((p) => p.type === "Dataset")
          : matching.filter((p) => p.type === filter);
    return withThumbnails(list, thumbnailIds);
  }, [filter, matching, thumbnailIds]);

  const byYear = useMemo(() => {
    const groups = filtered.reduce<Record<string, PublicationProps[]>>(
      (acc, p) => {
        const key = String(p.year);
        (acc[key] = acc[key] || []).push(p);
        return acc;
      },
      {},
    );
    // Featured (selected) papers lead their year group.
    for (const list of Object.values(groups)) {
      list.sort((a, b) => Number(!!b.selected) - Number(!!a.selected));
    }
    return groups;
  }, [filtered]);
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  const FilterChip = ({
    value,
    label,
    count,
    dot,
  }: {
    value: FilterValue;
    label: string;
    count: number;
    /** Type-coding colour (option A); omitted for "All". */
    dot?: string;
  }) => {
    const active = filter === value;
    return (
      <button
        type="button"
        onClick={() => setFilter(value)}
        className={cn(styles.filterChip, {
          [styles.filterChipActive]: active,
        })}
      >
        {dot && (
          <span className={styles.filterDot} style={{ background: dot }} />
        )}
        {label} ({count})
      </button>
    );
  };

  return (
    <div className={styles.page}>
      <SEO
        title="Publications"
        description="Scientific publications by Erik Novak including journal articles and conference papers on NLP, text analysis, and artificial intelligence research."
        path="/publications/"
      />

      <div className={styles.hero}>
        <div className={styles.heroKicker}>
          {ALL_PAPERS.length} {tt("kickerSuffix", "papers")}
        </div>
        <h1 className={styles.heroH1}>{tt("h1", "Publications")}</h1>
        <p className={styles.heroLead}>
          {tt("lead", "Journal articles & conference papers, grouped by year.")}
        </p>
      </div>

      <div className={styles.searchBar}>
        <svg
          className={styles.searchIcon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" />
        </svg>
        <input
          type="search"
          className={styles.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tt(
            "searchPlaceholder",
            "Search by title, author, venue or abstract",
          )}
          aria-label={tt("searchLabel", "Search publications")}
        />
        {query && (
          <button
            type="button"
            className={styles.searchClear}
            onClick={() => setQuery("")}
            aria-label={tt("searchClear", "Clear search")}
          >
            ×
          </button>
        )}
      </div>

      <div className={styles.filterBar}>
        <FilterChip
          value="all"
          label={tt("filterAll", "All")}
          count={counts.all}
        />
        <FilterChip
          value="Journal"
          label={tt("filterJournal", "Journal")}
          count={counts.Journal}
          dot="var(--ed-type-journal)"
        />
        <FilterChip
          value="Conference"
          label={tt("filterConf", "Conference")}
          count={counts.Conference}
          dot="var(--ed-type-conference)"
        />
        <FilterChip
          value="arXiv"
          label={tt("filterArxiv", "arXiv")}
          count={counts.arXiv}
          dot="var(--ed-type-arxiv)"
        />
        <FilterChip
          value="Datasets"
          label={tt("filterDatasets", "Datasets")}
          count={counts.Datasets}
          dot="var(--ed-type-dataset)"
        />
      </div>

      {years.length === 0 && (
        <p className={styles.empty}>
          {tt("noResults", "No publications match")} “{query}”.
        </p>
      )}

      {years.map((y) => (
        <div key={y} className={styles.yearGroup}>
          <div className={styles.yearCol}>
            <div className={styles.yearLabel}>{y}</div>
            <div className={styles.yearMeta}>
              {byYear[y].length}{" "}
              {byYear[y].length === 1
                ? tt("yearMetaOne", "paper")
                : tt("yearMetaMany", "papers")}
            </div>
          </div>
          <div>
            {byYear[y].map((p, i) => (
              <Publication key={`${y}-${i}`} {...p} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
