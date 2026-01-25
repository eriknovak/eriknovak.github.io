import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import Publication from "../components/Publication";
import SEO from "../components/SEO";

import CONFERENCE_PAPERS from "../assets/publications/conference_papers";
import JOURNAL_PAPERS from "../assets/publications/journal_papers";
import { PublicationProps } from "../Interfaces";

import { sortByDate } from "../utils/sort";

//===============================================
// Variable Definitions
//===============================================

const SORTED_PAPERS = [
  ...JOURNAL_PAPERS.map((paper) => ({ ...paper, type: "journal" })),
  ...CONFERENCE_PAPERS.map((paper) => ({ ...paper, type: "conference" })),
].sort((a, b) => sortByDate(a, b, "year"));

//===============================================
// Page Definition
//===============================================

export default function Publications() {
  const { t, ready } = useTranslation("publications");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="grid gap-16">
      <SEO
        title="Publications"
        description="Scientific publications by Erik Novak including journal articles and conference papers on NLP, text analysis, and artificial intelligence research."
        path="/publications/"
      />

      <div className="space-y-4">
        <h1 className="text-4xl lg:text-5xl font-bold">
          {mounted && ready ? t("title") : "Publications"}
        </h1>
        <p className="text-xl text-highlight">
          {mounted && ready ? t("subtitle") : "Journal and Conference Papers"}
        </p>
      </div>

      <div className="grid grid-flow-row gap-6">
        {SORTED_PAPERS.map((item: PublicationProps, id: number) => (
          <Publication key={id} {...item} />
        ))}
      </div>
    </div>
  );
}
