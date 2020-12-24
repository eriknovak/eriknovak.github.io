import { PublicationProps } from "../Interfaces";
import styles from "../styles/modules/Publication.module.scss";

export default function Publication(props: PublicationProps) {
  // get properties
  const { authors, title, reference, location, year, url } = props;

  return (
    <span className={styles.publication}>
      {authors}
      {". "}
      {url ? (
        <a className={styles.link} href={url} target="_blank">
          {title}
        </a>
      ) : (
        title
      )}
      {". "}
      {reference}, {location ? ` ${location}, ` : " "}
      {year}.
    </span>
  );
}
