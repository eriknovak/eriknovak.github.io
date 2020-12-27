import { PublicationProps } from "../Interfaces";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-regular-svg-icons";

export default function Publication(props: PublicationProps) {
  // get properties
  const {
    authors,
    title,
    reference,
    location,
    year,
    url,
    presentation,
  } = props;

  return (
    <span className="inline-block">
      {authors}
      {". "}
      {url ? (
        <a
          className="transition text-lightblue hover:text-lightblue-dark"
          href={url}
          target="_blank"
        >
          {title}
        </a>
      ) : (
        title
      )}
      {". "}
      {reference}, {location ? ` ${location}, ` : " "}
      {year}.{" "}
      {presentation ? (
        <a
          className="transition text-yellow hover:text-yellow-dark"
          href={presentation}
          target="_blank"
        >
          <FontAwesomeIcon
            icon={faPlayCircle}
            fixedWidth
            style={{ marginTop: "4px" }}
          />{" "}
          Presentation
        </a>
      ) : undefined}
    </span>
  );
}
