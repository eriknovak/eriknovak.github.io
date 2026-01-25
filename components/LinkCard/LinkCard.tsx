import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faDatabase,
  faCubes,
  faCode,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faWindowMaximize } from "@fortawesome/free-regular-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ProjectLink } from "../../Interfaces";
import styles from "./LinkCard.module.scss";

const ICON_MAP: Record<string, IconDefinition> = {
  homepage: faHouse,
  service: faWindowMaximize,
  data: faDatabase,
  model: faCubes,
  code: faCode,
  github: faGithub,
  "github-org": faGithub,
};

interface LinkCardProps {
  type: ProjectLink["type"];
  label: string;
  url: string;
}

export default function LinkCard({ type, label, url }: LinkCardProps) {
  const icon = ICON_MAP[type] || faArrowUpRightFromSquare;

  return (
    <a href={url} target="_blank" rel="noopener" className={styles.card}>
      <div className={styles.iconWrapper}>
        <FontAwesomeIcon icon={icon} className={styles.icon} />
      </div>
      <div className={styles.content}>
        <span className={styles.label}>{label}</span>
        <span className={styles.url}>{new URL(url).hostname}</span>
      </div>
      <FontAwesomeIcon
        icon={faArrowUpRightFromSquare}
        className={styles.external}
      />
    </a>
  );
}
