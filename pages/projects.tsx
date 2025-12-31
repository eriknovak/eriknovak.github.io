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
    <div className="grid gap-16">
      <Head>
        <title>Projects | Erik Novak</title>
      </Head>

      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold">Active Projects</h1>
          <p className="text-xl text-highlight">Current Research Initiatives</p>
        </div>

        <div className="grid grid-flow-row gap-12">
          {ACTIVE_PROJECTS.map((item: ProjectProps, id: number) => (
            <div key={id}>
              <Project {...item} />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold">Past Projects</h1>
          <p className="text-xl text-highlight">Completed Research Work</p>
        </div>

        <div className="grid grid-flow-row gap-12">
          {PAST_PROJECTS.map((item: ProjectProps, id: number) => (
            <div key={id}>
              <Project {...item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
