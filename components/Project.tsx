import { ProjectProps } from "../Interfaces";
import styles from "../styles/modules/Project.module.scss";

export default function Project(props: ProjectProps) {
  // get properties
  const { title, startDate, endDate, description, links } = props;

  return (
    <div className={styles.project}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.dates}>
        {startDate} - {endDate}
      </p>
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
