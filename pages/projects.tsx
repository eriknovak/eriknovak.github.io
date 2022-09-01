import Head from "next/head";

import Project from "../components/Project";

import RESEARCH_PROJECTS from "../assets/projects/research_projects";
import { ProjectProps } from "../Interfaces";

import { sortByDate } from "../utils/sort";

//===============================================
// Variable Definitions
//===============================================

const ACTIVE_PROJECTS = RESEARCH_PROJECTS.filter(
  (p) => p.endDate === "Present"
).sort((a, b) => sortByDate(a, b, "startDate"));

const PAST_PROJECTS = RESEARCH_PROJECTS.filter(
  (p) => p.endDate !== "Present"
).sort((a, b) => sortByDate(a, b, "startDate"));

//===============================================
// Page Definition
//===============================================

export default function Projects() {
  return (
    <div className="grid gap-20">
      <Head>
        <title>Projects | Erik Novak</title>
      </Head>
      <h1 className="text-4xl font-semibold">Active Projects</h1>

      <div className="grid grid-flow-row gap-16">
        {ACTIVE_PROJECTS.map((item: ProjectProps, id: number) => (
          <Project key={id} {...item} />
        ))}
      </div>

      <h1 className="text-4xl font-semibold">Past Projects</h1>

      <div className="grid grid-flow-row gap-16">
        {PAST_PROJECTS.map((item: ProjectProps, id: number) => (
          <Project key={id} {...item} />
        ))}
      </div>
    </div>
  );
}
