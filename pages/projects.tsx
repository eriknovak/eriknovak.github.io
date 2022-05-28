import Head from "next/head";

import Project from "../components/Project";

import RESEARCH_PROJECTS from "../assets/projects/research_projects";
import { ProjectProps } from "../Interfaces";

export default function Projects() {
  return (
    <div className="grid gap-20">
      <Head>
        <title>Projects | Erik Novak</title>
      </Head>
      <h1 className="text-4xl font-semibold">Projects</h1>

      <div className="grid grid-flow-row gap-16">
        {RESEARCH_PROJECTS.map((item: ProjectProps, id: number) => (
          <Project key={id} {...item} />
        ))}
      </div>
    </div>
  );
}
