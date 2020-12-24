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
      <h1>Publications</h1>

      <div className="section">
        <h2>Journal Papers</h2>
        <dl className="journals">
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

      <div className="section">
        <h2>Conference Papers</h2>
        <dl className="conferences">
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
