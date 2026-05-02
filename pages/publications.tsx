import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";

import Publication from "../components/Publication";
import SEO from "../components/SEO";

import CONFERENCE_PAPERS from "../assets/publications/conference_papers";
import JOURNAL_PAPERS from "../assets/publications/journal_papers";
import { PublicationProps } from "../Interfaces";

import { sortByDate } from "../utils/sort";

import styles from "./publications.module.scss";

type FilterValue = "all" | "Journal" | "Conference";

const ALL_PAPERS: PublicationProps[] = [
  ...JOURNAL_PAPERS.map((paper) => ({ ...paper, type: "Journal" })),
  ...CONFERENCE_PAPERS.map((paper) => ({ ...paper, type: "Conference" })),
].sort((a, b) => sortByDate(a, b, "year"));

const COUNTS = {
  all: ALL_PAPERS.length,
  Journal: ALL_PAPERS.filter((p) => p.type === "Journal").length,
  Conference: ALL_PAPERS.filter((p) => p.type === "Conference").length,
};

export default function Publications() {
  const { t, ready } = useTranslation("publications");
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<FilterValue>("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  const tt = (key: string, fallback: string) =>
    mounted && ready ? t(key) : fallback;

  const filtered = useMemo(
    () =>
      filter === "all"
        ? ALL_PAPERS
        : ALL_PAPERS.filter((p) => p.type === filter),
    [filter],
  );

  const byYear = useMemo(() => {
    return filtered.reduce<Record<string, PublicationProps[]>>((acc, p) => {
      const key = String(p.year);
      (acc[key] = acc[key] || []).push(p);
      return acc;
    }, {});
  }, [filtered]);
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  const FilterChip = ({
    value,
    label,
    count,
  }: {
    value: FilterValue;
    label: string;
    count: number;
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
        />
        <FilterChip
          value="Conference"
          label={tt("filterConf", "Conference")}
          count={COUNTS.Conference}
        />
      </div>

      {years.map((y) => (
        <div key={y} className={styles.yearGroup}>
          <div className={styles.yearHeader}>
            <div className={styles.yearLabel}>{y}</div>
            <div className={styles.yearMeta}>
              {byYear[y].length}{" "}
              {byYear[y].length === 1
                ? tt("yearMetaOne", "paper")
                : tt("yearMetaMany", "papers")}
            </div>
          </div>
          {byYear[y].map((p, i) => (
            <Publication key={`${y}-${i}`} {...p} />
          ))}
        </div>
      ))}
    </div>
  );
}
