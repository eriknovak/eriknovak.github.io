import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import Project from "../components/Project";
import SEO from "../components/SEO";

import RESEARCH_PROJECTS from "../assets/projects/research_projects";
import { ProjectProps } from "../Interfaces";
import { sortByDate } from "../utils/sort";

const ACTIVE_PROJECTS = RESEARCH_PROJECTS.filter(
  (p) => p.endDate === "Present",
).sort((a, b) => sortByDate(a, b, "startDate"));

const PAST_PROJECTS = RESEARCH_PROJECTS.filter(
  (p) => p.endDate !== "Present",
).sort((a, b) => sortByDate(a, b, "startDate"));

export default function Projects() {
  const { t, ready } = useTranslation("projects");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="grid gap-16">
      <SEO
        title="Projects"
        description="Research projects by Erik Novak including active and past European research initiatives in artificial intelligence, NLP, and data analysis."
        path="/projects/"
      />

      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold">
            {mounted && ready ? t("activeProjects") : "Active Projects"}
          </h1>
          <p className="text-xl text-highlight">
            {mounted && ready
              ? t("currentInitiatives")
              : "Current Research Initiatives"}
          </p>
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
          <h1 className="text-4xl lg:text-5xl font-bold">
            {mounted && ready ? t("pastProjects") : "Past Projects"}
          </h1>
          <p className="text-xl text-highlight">
            {mounted && ready ? t("completedWork") : "Completed Research Work"}
          </p>
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
