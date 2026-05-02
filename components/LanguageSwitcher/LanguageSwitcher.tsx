import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import styles from "./LanguageSwitcher.module.scss";

const languages = [
  { code: "en", label: "EN" },
  { code: "sl", label: "SL" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const active = mounted ? i18n.language : "en";

  return (
    <div className={styles.container}>
      {languages.map((lang, index) => (
        <span key={lang.code} className={styles.cell}>
          {index > 0 && <span className={styles.divider}>/</span>}
          <button
            type="button"
            className={cn(styles.button, {
              [styles["button--active"]]: active === lang.code,
            })}
            onClick={() => i18n.changeLanguage(lang.code)}
            aria-label={`Switch to ${lang.label}`}
          >
            {lang.label}
          </button>
        </span>
      ))}
    </div>
  );
}
