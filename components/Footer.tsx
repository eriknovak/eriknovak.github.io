import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faEnvelope } from "@fortawesome/free-regular-svg-icons";

import styles from "../styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.contacts}>
          <h3>Contact</h3>
          <ul className="fa-ul">
            <li className={styles.address}>
              <FontAwesomeIcon icon={faBuilding} listItem fixedWidth style={{marginTop:"4px"}} />
              Artificial Intelligence Laboratory <br />
              Jožef Stefan Institute <br />
              Jamova cesta 39 <br />
              1000 Ljubljana <br />
              Slovenia
            </li>
            <li className={styles.email}>
              <a href="mailto:erik.novak@ijs.si">
              <FontAwesomeIcon icon={faEnvelope} listItem fixedWidth style={{marginTop:"4px"}} />
                erik.novak@ijs.si
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.pages}>
          <h3>Pages</h3>
          <ul className={styles.links}>
            <li>
              <Link href="/">Homepage</Link>
            </li>
            <li>
              <Link href="/publications">Publications</Link>
            </li>
            <li>
              <Link href="/projects">Projects</Link>
            </li>
            <li>
              <Link href="/software">Software</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
