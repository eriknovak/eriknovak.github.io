// import components
import Head from "next/head";
import Link from "../components/Link";
import Publication from "../components/Publication";

// import data
import PROFILE from "../assets/profile/profile";
import ACADEMIC_PROFILE from "../assets/profile/academic";
import RESEARCH_PROJECTS from "../assets/projects/research_projects";
import JOURNAL_PAPERS from "../assets/publications/journal_papers";
import CONFERENCE_PAPERS from "../assets/publications/conference_papers";
import PROGRAMMING_SKILLS from "../assets/profile/programming";

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

import { sortByDate } from "../utils/sort";

//===============================================
// Variable Definitions
//===============================================

const logos = {
  faResearchgate: faResearchgate,
  faGraduationCap: faGraduationCap,
  faPlayCircle: faPlayCircle,
  faOrcid: faOrcid,
  faGithub: faGithub,
};

// get the list of current projects
const CURRENT_PROJECTS = RESEARCH_PROJECTS.filter(
  (p) => p.endDate === "Present"
).sort((a, b) => sortByDate(a, b, "startDate"));

// get the list of latest publications
const LATEST_PUBLICATIONS = JOURNAL_PAPERS.concat(CONFERENCE_PAPERS)
  .sort((a, b) => sortByDate(a, b, "year"))
  .slice(0, 3);

export default function Home() {
  return (
    <div className="grid gap-20">
      <Head>
        <title>Home | Erik Novak</title>
      </Head>

      {/** PROFILE */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        <div className="flex-initial flex flex-col gap-8">
          <h1 className="text-4xl font-bold">{PROFILE.title}</h1>
          <h4 className="text-xl">{PROFILE.subtitle}</h4>
          <div className="grid grid-flow-row gap-4">{PROFILE.description}</div>
        </div>
        <div className="flex-shrink-0">
          <img
            className="rounded-full border-8 border-white m-auto"
            src="./imgs/profile.png"
          ></img>
        </div>
      </div>

      {/** PUBLICATIONS */}
      <div className="grid grid-flow-row gap-4">
        <h2 className="text-2xl font-semibold">
          Latest Publications{" "}
          <Link href="/publications">
            <a className="transition text-link hover:text-link-hover">
              (see more)
            </a>
          </Link>
        </h2>

        <div className="grid grid-flow-row gap-4">
          {LATEST_PUBLICATIONS.map((p, i) => (
            <div
              key={i}
              className="bg-base-highlight p-4 block col-span-12 md:col-span-6 xl:col-span-4 rounded transition hover:shadow-lg"
            >
              <Publication {...p} />
            </div>
          ))}
        </div>
      </div>

      {/** PROJECTS */}
      <div className="grid grid-flow-row gap-4">
        <h2 className="text-2xl font-semibold">
          Current Projects{" "}
          <Link href="/projects">
            <a className="transition text-link hover:text-link-hover">
              (see more)
            </a>
          </Link>
        </h2>
        <div className="grid grid-flow-row grid-cols-12 gap-4">
          {CURRENT_PROJECTS.map(
            ({ title, startDate, endDate, description, links, type }, i) => (
              <a
                key={i}
                className="bg-base-highlight p-4 col-span-12 md:col-span-6 xl:col-span-4 rounded transition hover:shadow-lg cursor-pointer flex flex-col gap-2"
                href={links[0]?.url}
                target="_blank"
                rel="noopener"
              >
                <h4 className="text-lg font-semibold">{title}</h4>
                <p className="text-sm text-highlight">
                  {startDate} - {endDate} | {type}
                </p>
                <p>{description[0]}</p>
              </a>
            )
          )}
        </div>
      </div>

      {/** MISC */}
      <div className="flex flex-col lg:flex-row align-top items-start gap-24">
        <div className="flex-shrink-0 grid grid-flow-row gap-4">
          <h2 className="text-2xl font-semibold">Academic Profiles</h2>
          <div className="grid grid-flow-row gap-2">
            {ACADEMIC_PROFILE.map((link, id) => (
              <a
                key={id}
                className="transition block text-link hover:text-link-hover"
                href={link.url}
                target="_blank"
                rel="noopener"
              >
                <FontAwesomeIcon
                  icon={logos[link.logo]}
                  fixedWidth
                  style={{ marginTop: "4px" }}
                />{" "}
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex-2 grid grid-flow-row gap-4">
          <h2 className="text-2xl font-semibold">Programming Skills</h2>
          <div className="flex flex-row flex-wrap gap-0">
            {PROGRAMMING_SKILLS.map((link, id) => (
              <img
                key={id}
                className="h-10 w-10 my-2 mx-2"
                src={link.image}
                alt={link.label}
                title={link.label}
              ></img>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
