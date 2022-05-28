import { ProjectProps } from "../../Interfaces";

import styles from "./Project.module.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faComputer } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const ICON_TYPE_MAP = {
  homepage: faHouse,
  service: faComputer,
  code: faGithub,
};

export default function Project(props: ProjectProps) {
  // get properties
  const { title, startDate, endDate, description, links } = props;

  return (
    <div className={styles.container}>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className={styles.duration}>
        {startDate} - {endDate}
      </p>

      <div className={styles.description}>
        {description
          ? description.map((desc, id) => <p key={id}>{desc}</p>)
          : null}
      </div>

      {links ? (
        <div className={styles.links}>
          <h4 className="text-xl font-semibold">Links</h4>
          {links.map((link, id) => (
            <a key={id} className={styles.link} href={link.url} target="_blank">
              <FontAwesomeIcon icon={ICON_TYPE_MAP[link.type]} fixedWidth />{" "}
              {link.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
