import { SoftwareProps } from "../Interfaces";
import styles from "../styles/modules/Software.module.scss";

import label2image from "../assets/label2image";

export default function Software(props: SoftwareProps) {
  // get properties
  const { title, labels, description, links } = props;

  return (
    <div className={styles.software}>
      <h2 className={styles.title}>
        {title}
        {labels
          ? labels.map((label, id) => (
              <img
                key={id}
                className={styles.image}
                src={label2image[label]}
              ></img>
            ))
          : null}
      </h2>

      {description
        ? description.map((desc, id) => <p key={id}>{desc}</p>)
        : null}

      {links ? (
        <div className={styles.links}>
          <h4>Links</h4>
          <table className={styles.table}>
            <tbody>
              {links.map((link, id) => (
                <tr key={id}>
                  <td className={styles.linkLabel}>{link.label}</td>
                  <td className={styles.linkUrl}>
                    <a href={link.url} target="_blank">
                      {link.url}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
