import Head from "next/head";
import Link from "../components/Link";
import Publication from "../components/Publication";

import academic from "../assets/profile/academic";

import research from "../assets/projects/research";

import conferences from "../assets/publications/conferences";
import journals from "../assets/publications/journals";

import programming from "../assets/profile/programming";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  faOrcid,
  faResearchgate,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

const logos = {
  faGraduationCap: faGraduationCap,
  faPlayCircle: faPlayCircle,
  faOrcid: faOrcid,
  faResearchgate: faResearchgate,
  faGithub: faGithub,
};

// get the list of current projects
const currentProjects = research.filter((p) => p.endDate === "Present");

// get the list of latest publications
const latestPublications = journals
  .concat(conferences)
  .sort((a, b) => b.year - a.year)
  .slice(0, 3);

export default function Home() {
  return (
    <div className="page">
      <Head>
        <title>Home | Erik Novak</title>
      </Head>

      <div className="flex flex-col lg:flex-row">
        <div className="flex-initial md:mr-4">
          <h1 className="text-5xl font-semibold mt-10 mb-8">Erik Novak</h1>
          <p className="mb-6">
            I am an Assistant Researcher at the{" "}
            <a
              className="transition text-lightblue hover:text-lightblue-dark"
              href="https://ailab.ijs.si/"
            >
              Department for Artificial Intelligence, Jozef Stefan Institute
            </a>
            . My research interests are data and text stream analysis,
            (semi-)automatic data exploration, and data visualization.
          </p>

          <p className="mb-6">
            I am also a Teaching Assistant at the{" "}
            <a
              className="transition text-lightblue hover:text-lightblue-dark"
              href="https://www.mps.si/en/"
            >
              Jozef Stefan International Postgraduate School
            </a>
            .
          </p>
        </div>
        <div className="flex-shrink-0 my-10">
          <img
            className="rounded-full border-8 border-white m-auto"
            src="./imgs/profile.png"
          ></img>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-14 lg:mt-6 mb-4">
        Current Projects{" "}
        <Link href="/projects">
          <a className="transition text-white hover:text-white-dark">
            (see more)
          </a>
        </Link>
      </h2>
      <div className="grid grid-cols-12 grid-flow-row gap-4">
        {currentProjects.map(
          ({ title, startDate, endDate, description, links }, i) => (
            <a
              key={i}
              className="darker-bg block transition hover:text-lightblue p-4 pb-6 rounded cursor-pointer col-span-12 md:col-span-6 xl:col-span-4"
              href={links[0]?.url}
              target="_blank"
            >
              <h4 className="text-lg font-semibold">{title}</h4>
              <p className="text-sm mt-0 mb-3">
                {startDate} - {endDate}
              </p>
              <p>
                {description[0]?.split(" ").slice(0, 15).join(" ") + " ..."}
              </p>
            </a>
          )
        )}
      </div>

      <h2 className="text-2xl font-semibold mt-20 mb-4">
        Latest Publications{" "}
        <Link href="/publications">
          <a className="transition text-white hover:text-white-dark">
            (see more)
          </a>
        </Link>
      </h2>

      <div className="grid grid-flow-row gap-4">
        {latestPublications.map((p, i) => (
          <div key={i} className="darker-bg block p-4 pb-6 rounded">
            <Publication {...p} />
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="flex-shrink-0 2xl:flex-1 mr-24">
          <h2 className="text-2xl font-semibold mt-20 mb-4">
            Academic Profiles
          </h2>

          {academic.map((link, id) => (
            <div key={id}>
              <a
                href={link.url}
                target="_blank"
                className="transition text-lightblue hover:text-lightblue-dark"
              >
                <FontAwesomeIcon
                  icon={logos[link.logo]}
                  fixedWidth
                  style={{ marginTop: "4px" }}
                />{" "}
                {link.label}
              </a>
            </div>
          ))}
        </div>

        <div className="flex-2">
          <h2 className="text-2xl font-semibold mt-20 mb-4">
            Programming Skills
          </h2>
          <div className="flex flex-row flex-wrap">
            {programming.map((link, id) => (
              <img
                key={id}
                className="h-10 my-1 mx-2"
                src={link.image}
                alt={link.label}
              ></img>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
