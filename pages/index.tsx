// import components
import Link from "../components/Link";
import Publication from "../components/Publication";
import SEO from "../components/SEO";

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
  (p) => p.endDate === "Present",
).sort((a, b) => sortByDate(a, b, "startDate"));

// get the list of latest publications
const LATEST_PUBLICATIONS = JOURNAL_PAPERS.concat(CONFERENCE_PAPERS)
  .sort((a, b) => sortByDate(a, b, "year"))
  .slice(0, 3);

export default function Home() {
  return (
    <div className="grid gap-20">
      <SEO
        title="Home"
        description="Erik Novak - AI researcher specializing in NLP, text analysis, and data visualization. Data Scientist at Event Registry and Senior Researcher at Jozef Stefan Institute."
        path="/"
        type="profile"
      />

      {/** PROFILE */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center lg:items-start">
        <div className="flex-shrink-0 relative">
          <div className="relative">
            <img
              className="rounded-md w-64 lg:w-80 object-cover"
              src="./imgs/profile.jpg"
              alt="Profile"
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-6">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              {PROFILE.title}
            </h1>
            <h2 className="text-xl lg:text-2xl text-highlight">
              {PROFILE.subtitle}
            </h2>
          </div>
          <div className="grid grid-flow-row gap-4 text-base leading-relaxed">
            {PROFILE.description}
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            {ACADEMIC_PROFILE.map((link, id) => (
              <a
                key={id}
                className="inline-flex items-center gap-2 px-4 py-2 bg-base-highlight rounded-lg transition-all hover:shadow-lg hover:scale-105 text-link hover:text-link-hover"
                href={link.url}
                target="_blank"
                rel="noopener"
                title={link.label}
              >
                <FontAwesomeIcon icon={logos[link.logo]} fixedWidth />
                <span className="text-sm font-medium">{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/** PUBLICATIONS */}
      <div className="grid grid-flow-row gap-6">
        <h2 className="text-2xl lg:text-3xl font-semibold">
          Latest Publications{" "}
          <Link href="/publications" legacyBehavior>
            <a className="transition text-link hover:text-link-hover text-xl">
              (see more)
            </a>
          </Link>
        </h2>

        <div className="grid grid-flow-row gap-6">
          {LATEST_PUBLICATIONS.map((p, i) => (
            <div
              key={i}
              className="bg-base-highlight p-6 block col-span-12 md:col-span-6 xl:col-span-4 rounded-xl"
            >
              <Publication {...p} />
            </div>
          ))}
        </div>
      </div>

      {/** PROJECTS */}
      <div className="grid grid-flow-row gap-6">
        <h2 className="text-2xl lg:text-3xl font-semibold">
          Active Projects{" "}
          <Link href="/projects" legacyBehavior>
            <a className="transition text-link hover:text-link-hover text-xl">
              (see more)
            </a>
          </Link>
        </h2>
        <div className="grid grid-flow-row gap-6">
          {CURRENT_PROJECTS.map(
            ({ title, startDate, endDate, description, links, type }, i) => (
              <a
                key={i}
                className="bg-base-highlight p-6 col-span-12 md:col-span-6 xl:col-span-4 rounded-xl cursor-pointer"
                href={links?.length ? links[0]?.url : "#"}
                target="_blank"
                rel="noopener"
              >
                <h4 className="text-lg font-semibold mb-2">{title}</h4>
                <p className="text-sm text-highlight mb-3">
                  {startDate} - {endDate} | {type}
                </p>
                <p className="leading-relaxed">{description[0]}</p>
              </a>
            ),
          )}
        </div>
      </div>

      {/** PROGRAMMING SKILLS */}
      <div className="grid grid-flow-row gap-6">
        <h2 className="text-2xl font-semibold">Programming Skills</h2>
        <div className="flex flex-row flex-wrap gap-4">
          {PROGRAMMING_SKILLS.map((link, id) => (
            <div
              key={id}
              className="bg-base-highlight p-3 rounded-lg"
              title={link.label}
            >
              <img className="h-10 w-10" src={link.image} alt={link.label} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
