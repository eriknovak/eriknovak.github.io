import { ProjectProps } from "../Interfaces";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

export default function Project(props: ProjectProps) {
  // get properties
  const { title, startDate, endDate, description, links } = props;

  return (
    <div className="inline-block mt-20 mb-0">
      <h2 className="text-3xl font-semibold mb-0">{title}</h2>
      <p className="text-sm mt-0 mb-3">
        {startDate} - {endDate}
      </p>
      {description
        ? description.map((desc, id) => (
            <p key={id} className="mb-3">
              {desc}
            </p>
          ))
        : null}

      {links ? (
        <div>
          <h4 className="text-lg font-semibold mb-0">Links</h4>
          {links.map((link, id) => (
            <div
              className="transition text-lightblue hover:text-lightblue-dark"
              key={id}
            >
              <a href={link.url} target="_blank">
                <FontAwesomeIcon
                  icon={faExternalLinkAlt}
                  fixedWidth
                  style={{ marginTop: "4px" }}
                />{" "}
                {link.label}
              </a>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
