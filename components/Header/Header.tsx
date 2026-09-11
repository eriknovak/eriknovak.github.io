import { useState, useEffect } from "react";
import Link from "../Link";
import ThemeToggle from "../ThemeToggle";
import LanguageSwitcher from "../LanguageSwitcher";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import cn from "classnames";
import styles from "./Header.module.scss";

const pages = [
  { titleKey: "nav.home", fallback: "Home", route: "/" },
  { titleKey: "nav.projects", fallback: "Projects", route: "/projects" },
  {
    titleKey: "nav.publications",
    fallback: "Publications",
    route: "/publications",
  },
];

export default function Header() {
  const router = useRouter();
  const { t, ready } = useTranslation("common");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className={styles.container}>
      <div className={styles.content}>
        <Link href="/" className={styles.brand}>
          Erik Novak
        </Link>
        <div className={styles.links}>
          {pages.map((page) => {
            const isActive =
              router.route === page.route ||
              (page.route !== "/" && router.route.startsWith(page.route + "/"));
            return (
              <Link
                href={page.route}
                key={page.route}
                className={cn(styles.link, {
                  [styles["link--active"]]: isActive,
                })}
              >
                {mounted && ready ? t(page.titleKey) : page.fallback}
              </Link>
            );
          })}
        </div>
        <div className={styles.controls}>
          {mounted && <LanguageSwitcher />}
          <span className={styles.divider} aria-hidden />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
