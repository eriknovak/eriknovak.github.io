import { PublicationProps } from "../../Interfaces";

import styles from "./Publication.module.scss";
import cn from "classnames";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilmSimple } from "@fortawesome/free-solid-svg-icons";

function createTitle(title: string, URL: string) {
  return URL ? (
    <a className={styles.link} href={URL} target="_blank">
      {title}
    </a>
  ) : (
    title
  );
}

export default function Publication(props: PublicationProps) {
  // get properties
  const { authors, title, reference, location, year, url, presentation } =
    props;

  return (
    <span className={styles.container}>
      {authors}. {createTitle(title, url)}. {reference},{" "}
      {location ? ` ${location}, ` : " "}
      {year}.{" "}
      {presentation ? (
        <a
          className={cn(styles.link, styles["link--video"])}
          href={presentation}
          target="_blank"
        >
          <FontAwesomeIcon icon={faFilmSimple} fixedWidth /> Video
        </a>
      ) : undefined}
    </span>
  );
}
