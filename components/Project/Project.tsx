import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ProjectProps } from "../../Interfaces";
import LinkCard from "../LinkCard";

import styles from "./Project.module.scss";

export default function Project(props: ProjectProps) {
  const { t, ready } = useTranslation("projects");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const { title, startDate, endDate, description, links, resources, type } =
    props;

  // Links section: homepage and service links only
  const websiteLinks =
    links?.filter(
      (link) =>
        (link.type === "homepage" || link.type === "service") && link.url,
    ) || [];

  const hasLinks = websiteLinks.length > 0;
  const hasResources = resources && resources.length > 0;

  return (
    <div className={styles.container}>
      <h2 className="text-2xl font-semibold inline-block">{title}</h2>
      <p className={styles.duration}>
        {startDate} - {endDate} | {type || "Unknown"}
      </p>

      <div className={styles.description}>
        {description
          ? description.map((desc, id) => <p key={id}>{desc}</p>)
          : null}
      </div>

      {/* Links and Resources Section */}
      {(hasLinks || hasResources) && (
        <div className={styles.linksSection}>
          <h4 className="text-lg font-semibold mb-3">
            {mounted && ready ? t("linksAndResources") : "Links and Resources"}
          </h4>
          <div className={styles.linkGrid}>
            {websiteLinks.map((link, id) => (
              <LinkCard
                key={id}
                type={link.type as "homepage" | "service"}
                label={link.label}
                url={link.url!}
              />
            ))}
            {resources?.map((link, id) => {
              let url = link.url;
              if (link.type === "github" && link.owner && link.repo) {
                url = `https://github.com/${link.owner}/${link.repo}`;
              } else if (link.type === "github-org" && link.org) {
                url = `https://github.com/${link.org}`;
              }
              return (
                <LinkCard
                  key={`resource-${id}`}
                  type={link.type}
                  label={link.label}
                  url={url!}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
