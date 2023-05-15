import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faTwitter, faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";

import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.container}>
      <div className={styles.content}>
        <a href="mailto:erik.novak@ijs.si" className={styles.link}>
          <FontAwesomeIcon icon={faEnvelope} />
        </a>
        <a href="https://twitter.com/novakoverik" className={styles.link}>
          <FontAwesomeIcon icon={faTwitter} />
        </a>
        <a href="https://www.linkedin.com/in/novakerik" className={styles.link}>
          <FontAwesomeIcon icon={faLinkedin} />
        </a>
        <a href="https://github.com/eriknovak" className={styles.link}>
          <FontAwesomeIcon icon={faGithub} />
        </a>
      </div>
    </footer>
  );
}
