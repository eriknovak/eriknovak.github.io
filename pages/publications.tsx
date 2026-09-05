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

const COUNTS = {
  all: EVERYTHING.length,
  Journal: ALL_PAPERS.filter((p) => p.type === "Journal").length,
  Conference: ALL_PAPERS.filter((p) => p.type === "Conference").length,
  arXiv: ALL_PAPERS.filter((p) => p.type === "arXiv").length,
  Datasets: DATASET_ITEMS.length,
};

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

  useEffect(() => {
    setMounted(true);
  }, []);

  const tt = (key: string, fallback: string) =>
    mounted && ready ? t(key) : fallback;

  const filtered = useMemo(() => {
    const list =
      filter === "all"
        ? EVERYTHING
        : filter === "Datasets"
          ? DATASET_ITEMS
          : ALL_PAPERS.filter((p) => p.type === filter);
    return withThumbnails(list, thumbnailIds);
  }, [filter, thumbnailIds]);

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

      <div className={styles.filterBar}>
        <FilterChip
          value="all"
          label={tt("filterAll", "All")}
          count={COUNTS.all}
        />
        <FilterChip
          value="Journal"
          label={tt("filterJournal", "Journal")}
          count={COUNTS.Journal}
          dot="var(--ed-type-journal)"
        />
        <FilterChip
          value="Conference"
          label={tt("filterConf", "Conference")}
          count={COUNTS.Conference}
          dot="var(--ed-type-conference)"
        />
        <FilterChip
          value="arXiv"
          label={tt("filterArxiv", "arXiv")}
          count={COUNTS.arXiv}
          dot="var(--ed-type-arxiv)"
        />
        <FilterChip
          value="Datasets"
          label={tt("filterDatasets", "Datasets")}
          count={COUNTS.Datasets}
          dot="var(--ed-type-dataset)"
        />
      </div>

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
