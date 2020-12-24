import Link from "next/link";
import { useRouter } from "next/router";

import styles from "../styles/modules/Header.module.scss";

export default function Header() {
  const router = useRouter();
  const homepage = router.pathname === "/";
  const publications = router.pathname.includes("publications");
  const projects = router.pathname.includes("projects");
  const software = router.pathname.includes("software");
  const lectures = router.pathname.includes("lectures");

  return (
    <nav className={styles.navbar}>
      <div className={styles.navigationPannel}>
        <Link href="/">
          <a className={homepage ? styles.active : undefined}>Home</a>
        </Link>
        <Link href="/publications">
          <a className={publications ? styles.active : undefined}>
            Publications
          </a>
        </Link>
        <Link href="/projects">
          <a className={projects ? styles.active : undefined}>Projects</a>
        </Link>
        <Link href="/software">
          <a className={software ? styles.active : undefined}>Software</a>
        </Link>
        <Link href="/lectures">
          <a className={lectures ? styles.active : undefined}>Lectures</a>
        </Link>
      </div>
    </nav>
  );
}
