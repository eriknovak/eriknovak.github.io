import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import cn from "classnames";

import Link from "../components/Link";
import Project from "../components/Project";
import Publication from "../components/Publication";
import SEO from "../components/SEO";

import { useProfile } from "../assets/profile/useProfile";
import ACADEMIC_PROFILE from "../assets/profile/academic";
import RESEARCH_PROJECTS from "../assets/projects/research_projects";
import JOURNAL_PAPERS from "../assets/publications/journal_papers";
import CONFERENCE_PAPERS from "../assets/publications/conference_papers";
import ARXIV_PAPERS from "../assets/publications/arxiv_papers";

import { withThumbnails } from "../utils/publications";
import { getThumbnailIds } from "../utils/publications.server";
import { sortByDate } from "../utils/sort";
import styles from "./index.module.scss";

const CURRENT_PROJECTS = RESEARCH_PROJECTS.filter(
  (p) => p.endDate === "Present",
).sort((a, b) => sortByDate(a, b, "startDate"));

const LATEST_PUBLICATIONS = [
  ...JOURNAL_PAPERS.map((paper) => ({ ...paper, type: "Journal" })),
  ...CONFERENCE_PAPERS.map((paper) => ({ ...paper, type: "Conference" })),
  ...ARXIV_PAPERS.map((paper) => ({ ...paper, type: "arXiv" })),
]
  .sort((a, b) => sortByDate(a, b, "year"))
  .slice(0, 3);

const SectionHeader = ({
  title,
  href,
  cta,
}: {
  title: string;
  href: string;
  cta: string;
}) => (
  <div
    style={{
      marginTop: 80,
      marginBottom: 24,
      paddingBottom: 16,
      borderBottom: "1px solid var(--ed-rule)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
    }}
  >
    <h2
      style={{
        fontFamily: "var(--ed-serif)",
        fontWeight: 400,
        fontSize: 32,
        margin: 0,
        letterSpacing: "-0.5px",
      }}
    >
      {title}
    </h2>
    <Link
      href={href}
      style={{
        fontFamily: "var(--ed-sans)",
        fontSize: 12,
        letterSpacing: "1px",
        color: "var(--ed-accent)",
        textTransform: "uppercase",
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <span>{cta}</span>
      <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: 10 }} />
    </Link>
  </div>
);

export function getStaticProps() {
  return { props: { thumbnailIds: getThumbnailIds() } };
}

export default function Home({ thumbnailIds }: { thumbnailIds: string[] }) {
  const { t, ready } = useTranslation("home");
  const profile = useProfile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tt = (key: string, fallback: string) =>
    mounted && ready ? t(key) : fallback;

  return (
    <div className={styles.page}>
      <SEO
        title="Home"
        description="Erik Novak - AI researcher specializing in NLP, text analysis, and data visualization. Data Scientist at Event Registry and Senior Researcher at Jozef Stefan Institute."
        path="/"
        type="profile"
      />

      <div
        style={{
          fontSize: 12,
          color: "var(--ed-muted)",
          letterSpacing: "2px",
          textTransform: "uppercase",
          marginBottom: 32,
        }}
      >
        {tt("kicker", "Researcher · Ljubljana")}
      </div>

      <h1 className={styles.heroTitle}>{tt("h1a", "Erik Novak.")}</h1>
      <h1 className={cn(styles.heroTitle, styles.heroTitleItalic)}>
        {tt("h1b1", "AI research,")}
        <br />
        {tt("h1b2", "language & data.")}
      </h1>

      <div className={styles.bio}>
        <div className={styles.bioText}>{profile.description}</div>
        <div>
          <div className={styles.bioImageFrame}>
            <img
              src="./imgs/profile.jpg"
              alt="Dr. Erik Novak — AI Researcher"
              className={styles.bioImage}
            />
          </div>
        </div>
      </div>

      <div className={styles.profileLinks}>
        {ACADEMIC_PROFILE.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target={link.url.startsWith("mailto:") ? undefined : "_blank"}
            rel={
              link.url.startsWith("mailto:") ? undefined : "noopener noreferrer"
            }
            className={styles.profileLink}
          >
            <span>{link.label}</span>
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              style={{ color: "var(--ed-muted)", fontSize: 10 }}
            />
          </a>
        ))}
      </div>

      <SectionHeader
        title={tt("activeTitle", "Active Projects")}
        href="/projects"
        cta={tt("seeAll", "See all")}
      />
      {CURRENT_PROJECTS.map((p) => (
        <Project key={p.title} {...p} minimal />
      ))}

      <SectionHeader
        title={tt("pubsTitle", "Latest Publications")}
        href="/publications"
        cta={tt("seeAll", "See all")}
      />
      <div>
        {withThumbnails(LATEST_PUBLICATIONS, thumbnailIds).map((p) => (
          <Publication key={p.id ?? p.title} {...p} />
        ))}
      </div>
    </div>
  );
}
