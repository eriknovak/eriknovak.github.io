import Head from "next/head";

import Publication from "../components/Publication";

import CONFERENCE_PAPERS from "../assets/publications/conference_papers";
import JOURNAL_PAPERS from "../assets/publications/journal_papers";
import { PublicationProps } from "../Interfaces";

export default function Publications() {
  return (
    <div className="grid gap-20">
      <Head>
        <title>Publications | Erik Novak</title>
      </Head>

      <h1 className="text-4xl font-semibold">Publications</h1>

      <div className="grid grid-flow-row gap-4">
        <h2 className="text-2xl font-semibold">Journal Papers</h2>
        <div className="grid grid-flow-row gap-6">
          {JOURNAL_PAPERS.map((item: PublicationProps, id: number) => (
            <Publication key={id} {...item} />
          ))}
        </div>
      </div>

      <div className="grid grid-flow-row gap-4">
        <h2 className="text-2xl font-semibold">Conference Papers</h2>
        <div className="grid grid-flow-row gap-6">
          {CONFERENCE_PAPERS.map((item: PublicationProps, id: number) => (
            <Publication key={id} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}
