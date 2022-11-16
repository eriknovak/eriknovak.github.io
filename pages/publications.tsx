import Head from "next/head";

import Publication from "../components/Publication";

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
  return (
    <div className="grid gap-20">
      <Head>
        <title>Publications | Erik Novak</title>
      </Head>

      <h1 className="text-4xl font-semibold">Publications</h1>

      <div className="grid grid-flow-row gap-4">
        <h2 className="text-2xl font-semibold">
          Journal and Conference Papers
        </h2>
        <div className="grid grid-flow-row gap-6">
          {SORTED_PAPERS.map((item: PublicationProps, id: number) => (
            <Publication key={id} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}
