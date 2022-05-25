import { SoftwareProps } from "../Interfaces";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

export default function Software(props: SoftwareProps) {
  // get properties
  const { title, labels, description, links } = props;

  return (
    <div className="inline-block mt-20 mb-0">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>

      {labels ? (
        <div className="flex flex-row flex-wrap gap-1 mb-2">
          {labels.map((label, id) => (
            <div key={id} className="px-2 py-1 bg-blue-light text-sm rounded-sm">
              {label}
            </div>
          ))}
        </div>
      ) : null}

      {description
        ? description.map((desc, id) => (
            <p key={id} className="mb-4">
              {desc}
            </p>
          ))
        : null}

      {links ? (
        <div>
          <h4 className="text-lg font-semibold mb-px">Links</h4>
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
