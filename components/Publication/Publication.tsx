import { PublicationProps } from "../../Interfaces";

import styles from "./Publication.module.scss";
import cn from "classnames";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilm } from "@fortawesome/free-solid-svg-icons";

function createTitle(title: string, URL: string) {
  return URL ? (
    <a className={styles.link} href={URL} target="_blank" rel="noopener">
      {title}
    </a>
  ) : (
    title
  );
}

export default function Publication(props: PublicationProps) {
  // get properties
  const { authors, title, reference, location, year, url, presentation, type } =
    props;

  return (
    <span className={cn(styles.container, styles[`publication--${type}`])}>
      {createTitle(title, url)}. {authors}. {reference},{" "}
      {location ? ` ${location}, ` : " "}
      {year}.{" "}
      {presentation ? (
        <a
          className={cn(styles.link, styles["link--video"])}
          href={presentation}
          target="_blank"
          rel="noopener"
        >
          <FontAwesomeIcon icon={faFilm} fixedWidth /> Video
        </a>
      ) : undefined}
    </span>
  );
}
