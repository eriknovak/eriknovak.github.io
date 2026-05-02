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
  { titleKey: "nav.blog", fallback: "Blog", route: "/blog" },
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
        <div className={styles.links}>
          {pages.map((page, id) => (
            <Link href={page.route} key={id} legacyBehavior>
              <a
                className={cn(styles.link, {
                  [styles["link--active"]]:
                    router.route === page.route ||
                    (page.route !== "/" &&
                      router.route.startsWith(page.route + "/")),
                })}
              >
                {mounted && ready ? t(page.titleKey) : page.fallback}
              </a>
            </Link>
          ))}
        </div>
        <div className={styles.controls}>
          {mounted && <LanguageSwitcher />}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
