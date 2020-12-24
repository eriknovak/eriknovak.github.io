import Head from "next/head";

import Project from "../components/Project";

import research from "../assets/projects/research";
import { ProjectProps } from "../Interfaces";

export default function Projects() {
  return (
    <div>
      <Head>
        <title>Projects | Erik Novak</title>
      </Head>
      <h1>Projects</h1>

      {research.map((item: ProjectProps, id: number) => (
        <div key={id}>
          <Project
            title={item.title}
            startDate={item.startDate}
            endDate={item.endDate}
            description={item.description}
            links={item.links}
          />
        </div>
      ))}
    </div>
  );
}
