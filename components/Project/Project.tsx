import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faCode,
  faFileLines,
  faBoxArchive,
  faBuildingColumns,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import cn from "classnames";
import { ProjectProps, ProjectLink } from "../../Interfaces";
import styles from "./Project.module.scss";

type EditorialLinkType = "site" | "code" | "resource";

interface Props extends ProjectProps {
  /** Home view: short description only, no link rows. */
  minimal?: boolean;
  /** Past project — slightly faded. */
  past?: boolean;
}

function classify(link: ProjectLink): EditorialLinkType | null {
  switch (link.type) {
    case "homepage":
    case "service":
      return "site";
    case "code":
    case "github":
    case "github-org":
      return "code";
    case "data":
    case "model":
      return "resource";
    default:
      return null;
  }
}

function resolveUrl(link: ProjectLink): string | undefined {
  if (link.url) return link.url;
  if (link.type === "github" && link.owner && link.repo) {
    return `https://github.com/${link.owner}/${link.repo}`;
  }
  if (link.type === "github-org" && link.org) {
    return `https://github.com/${link.org}`;
  }
  return undefined;
}

const LINK_ICONS: Record<EditorialLinkType, IconDefinition> = {
  site: faGlobe,
  code: faCode,
  resource: faFileLines,
};

const LinkIcon = ({ type }: { type: EditorialLinkType }) => (
  <FontAwesomeIcon
    icon={LINK_ICONS[type]}
    style={{ fontSize: 11 }}
    fixedWidth
    aria-hidden
  />
);

const ORDER: EditorialLinkType[] = ["site", "code", "resource"];

/** Programme accent colour, keyed on the project's `type` text. */
function programmeColor(programme: string): string {
  const p = programme.toLowerCase();
  if (p.includes("horizon")) return "var(--ed-type-journal)";
  if (p.includes("aris")) return "var(--ed-type-conference)";
  if (p.includes("eurostat")) return "var(--ed-type-arxiv)";
  if (p.includes("cef")) return "var(--ed-type-dataset)";
  return "var(--ed-muted)";
}

export default function Project(props: Props) {
  const { t, ready } = useTranslation("projects");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    title,
    startDate,
    endDate,
    cordis,
    description,
    contribution,
    links,
    resources,
    type,
    minimal = false,
    past = false,
  } = props;

  const allLinks = [...(links ?? []), ...(resources ?? [])];
  const grouped = allLinks.reduce<Record<EditorialLinkType, ProjectLink[]>>(
    (acc, link) => {
      const cat = classify(link);
      if (!cat) return acc;
      acc[cat] = acc[cat] || [];
      acc[cat].push(link);
      return acc;
    },
    { site: [], code: [], resource: [] },
  );

  const label = (key: string, fallback: string) =>
    mounted && ready && t(key) !== key ? t(key) : fallback;
  const contributionLabel = label("contribution", "Contribution");
  const archivedLabel = label("archived", "archived");

  const dateLabel = `${startDate} — ${endDate === "Present" ? "Present" : endDate}`;
  const typeLabel = type ?? "";
  const body = description?.[0] ?? "";

  return (
    <div
      className={cn("project-card", styles.container, {
        [styles.past]: past,
      })}
    >
      <div>
        <div className={styles.title}>{title}</div>
        <div
          style={{
            fontFamily: "var(--ed-sans)",
            fontSize: 11,
            color: "var(--ed-muted)",
            letterSpacing: "1px",
            textTransform: "uppercase",
            lineHeight: 1.6,
          }}
        >
          {dateLabel}
        </div>
        {typeLabel && (
          <div className={styles.programme}>
            <span
              className={styles.dot}
              style={{ background: programmeColor(typeLabel) }}
              aria-hidden
            />
            <span>{typeLabel}</span>
          </div>
        )}
        {cordis && (
          <a
            className={styles.cordis}
            href={`https://cordis.europa.eu/project/id/${cordis}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faBuildingColumns} fixedWidth aria-hidden />
            <span>CORDIS</span>
          </a>
        )}
      </div>
      <div>
        {minimal ? (
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.65,
              margin: 0,
              color: "var(--ed-text-secondary)",
            }}
          >
            {body}
          </p>
        ) : (
          <>
            {(past ? description?.slice(0, 1) : description)?.map(
              (para, idx) => (
                <p key={idx} className={styles.paragraph}>
                  {para}
                </p>
              ),
            )}
            {contribution && (
              <div
                className={styles.contribution}
                style={{ borderColor: programmeColor(typeLabel) }}
              >
                <div className={styles.contributionLabel}>
                  {contributionLabel}
                </div>
                <p className={styles.paragraph}>{contribution}</p>
              </div>
            )}
            {allLinks.length > 0 && (
              <div className={styles.chipRow}>
                {ORDER.flatMap((cat) =>
                  grouped[cat].map((link, i) => {
                    const url = resolveUrl(link);
                    return (
                      <a
                        key={`${cat}-${i}`}
                        href={url ?? "#"}
                        target={url ? "_blank" : undefined}
                        rel={url ? "noopener noreferrer" : undefined}
                        className={styles.chip}
                        title={
                          link.archived ? "Wayback Machine copy" : undefined
                        }
                      >
                        {link.archived ? (
                          <FontAwesomeIcon
                            icon={faBoxArchive}
                            style={{ fontSize: 11 }}
                            fixedWidth
                            aria-hidden
                          />
                        ) : (
                          <LinkIcon type={cat} />
                        )}
                        <span>{link.label}</span>
                        {link.archived && (
                          <span className={styles.archived}>
                            {archivedLabel}
                          </span>
                        )}
                      </a>
                    );
                  }),
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
