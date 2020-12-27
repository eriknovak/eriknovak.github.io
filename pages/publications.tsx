import Head from "next/head";

import Publication from "../components/Publication";

import conferences from "../assets/publications/conferences";
import journals from "../assets/publications/journals";
import { PublicationProps } from "../Interfaces";

export default function Publications() {
  return (
    <div>
      <Head>
        <title>Publications | Erik Novak</title>
      </Head>
      <h1 className="text-4xl font-semibold mt-10">Publications</h1>

      <div className="mt-16 mb-0">
        <h2 className="text-3xl font-semibold">Journal Papers</h2>
        <dl className="journals relative list-none">
          {journals.map((item: PublicationProps, id: number) => (
            <dd key={id} style={{ counterSet: `item ${journals.length - id}` }}>
              <Publication
                authors={item.authors}
                title={item.title}
                url={item.url}
                reference={item.reference}
                location={item.location}
                year={item.year}
                presentation={item.presentation}
              />
            </dd>
          ))}
        </dl>
      </div>

      <div className="mt-16 mb-0">
        <h2 className="text-3xl font-semibold">Conference Papers</h2>
        <dl className="conferences relative list-none">
          {conferences.map((item: PublicationProps, id: number) => (
            <dd
              key={id}
              style={{ counterSet: `item ${conferences.length - id}` }}
            >
              <Publication
                authors={item.authors}
                title={item.title}
                url={item.url}
                reference={item.reference}
                location={item.location}
                year={item.year}
                presentation={item.presentation}
              />
            </dd>
          ))}
        </dl>
      </div>
    </div>
  );
}
