import Link from "../Link";
import ThemeToggle from "../ThemeToggle";
import { useRouter } from "next/router";

import cn from "classnames";
import styles from "./Header.module.scss";

const pages = [
  { title: "Home", route: "/" },
  { title: "Publications", route: "/publications" },
  { title: "Projects", route: "/projects" },
];

export default function Header() {
  const router = useRouter();

  return (
    <nav className={styles.container}>
      <div className={styles.content}>
        <div className={styles.links}>
          {pages.map((page, id) => (
            <Link href={page.route} key={id} legacyBehavior>
              <a
                className={cn(styles.link, {
                  [styles["link--active"]]: router.route === page.route,
                })}
              >
                {page.title}
              </a>
            </Link>
          ))}
        </div>
        <div className={styles.toggle}>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
