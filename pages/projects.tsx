import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Project from "../components/Project";
import SEO from "../components/SEO";

import RESEARCH_PROJECTS from "../assets/projects/research_projects";
import { ProjectProps } from "../Interfaces";
import { sortByDate } from "../utils/sort";

import styles from "./projects.module.scss";

const ACTIVE_PROJECTS = RESEARCH_PROJECTS.filter(
  (p) => p.endDate === "Present",
).sort((a, b) => sortByDate(a, b, "startDate"));

const PAST_PROJECTS = RESEARCH_PROJECTS.filter(
  (p) => p.endDate !== "Present",
).sort((a, b) => sortByDate(a, b, "startDate"));

const SectionTitle = ({ title, meta }: { title: string; meta: string }) => (
  <div className={styles.sectionTitle}>
    <h2 className={styles.sectionTitleHeading}>{title}</h2>
    <span className={styles.sectionTitleMeta}>{meta}</span>
  </div>
);

export default function Projects() {
  const { t, ready } = useTranslation("projects");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tt = (key: string, fallback: string) =>
    mounted && ready ? t(key) : fallback;

  return (
    <div className={styles.page}>
      <SEO
        title="Projects"
        description="Research projects by Erik Novak including active and past European research initiatives in artificial intelligence, NLP, and data analysis."
        path="/projects/"
      />

      <div className={styles.hero}>
        <div className={styles.heroKicker}>
          {tt("kicker", "Research · 2019 → present")}
        </div>
        <h1 className={styles.heroH1}>{tt("h1", "Projects")}</h1>
        <p className={styles.heroLead}>
          {tt(
            "lead",
            "Years of European research projects on language technology, health informatics, and small-language-model deployment.",
          )}
        </p>
      </div>

      <SectionTitle
        title={tt("activeProjects", "Active")}
        meta={`${tt("activeMeta", "Currently running")} · ${ACTIVE_PROJECTS.length}`}
      />
      {ACTIVE_PROJECTS.map((item: ProjectProps) => (
        <Project key={item.title} {...item} />
      ))}

      <SectionTitle
        title={tt("pastProjects", "Past")}
        meta={`${tt("pastMeta", "Completed")} · ${PAST_PROJECTS.length}`}
      />
      {PAST_PROJECTS.map((item: ProjectProps) => (
        <Project key={item.title} {...item} past />
      ))}
    </div>
  );
}
