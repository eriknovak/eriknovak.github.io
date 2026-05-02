import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faGlobe,
  faCode,
  faFileLines,
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
    description,
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

  const labels = (key: EditorialLinkType): string => {
    if (mounted && ready) {
      const v = t(`linkLabels.${key}`);
      if (v && v !== `linkLabels.${key}`) return v;
    }
    return { site: "WEBSITE", code: "CODE", resource: "RESOURCE" }[key];
  };

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
        <div
          style={{
            fontFamily: "var(--ed-serif)",
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "-0.3px",
            marginBottom: 8,
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
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
          <div
            style={{
              fontFamily: "var(--ed-sans)",
              fontSize: 10,
              color: "var(--ed-muted)",
              letterSpacing: "1px",
              textTransform: "uppercase",
              lineHeight: 1.6,
            }}
          >
            {typeLabel}
          </div>
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
            {description?.map((para, idx) => (
              <p
                key={idx}
                style={{
                  fontSize: 14,
                  lineHeight: 1.65,
                  margin: idx === 0 ? "0 0 12px" : "0 0 12px",
                  color: "var(--ed-text-secondary)",
                }}
              >
                {para}
              </p>
            ))}
            {ORDER.some((k) => grouped[k].length > 0) && (
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {ORDER.filter((k) => grouped[k].length > 0).map((cat) => (
                  <div key={cat} className={styles.linkRow}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontFamily: "var(--ed-sans)",
                        fontSize: 10,
                        color: "var(--ed-muted)",
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                      }}
                    >
                      <LinkIcon type={cat} />
                      <span>{labels(cat)}</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {grouped[cat].map((link, i) => {
                        const url = resolveUrl(link);
                        return (
                          <a
                            key={`${cat}-${i}`}
                            href={url ?? "#"}
                            target={url ? "_blank" : undefined}
                            rel={url ? "noopener noreferrer" : undefined}
                            style={{
                              fontFamily: "var(--ed-sans)",
                              fontSize: 13,
                              color: "var(--ed-fg)",
                              textDecoration: "none",
                              border: "1px solid var(--ed-rule)",
                              padding: "4px 10px",
                              borderRadius: 2,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              letterSpacing: "0.2px",
                              background: "var(--ed-card)",
                            }}
                          >
                            <span>{link.label}</span>
                            <FontAwesomeIcon
                              icon={faArrowUpRightFromSquare}
                              style={{
                                color: "var(--ed-muted)",
                                fontSize: 9,
                              }}
                            />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
