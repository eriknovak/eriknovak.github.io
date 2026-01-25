import { useTranslation } from "react-i18next";
import styles from "./LanguageSwitcher.module.scss";
import cn from "classnames";

const languages = [
  { code: "en", label: "EN" },
  { code: "sl", label: "SL" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className={styles.container}>
      {languages.map((lang, index) => (
        <span key={lang.code}>
          {index > 0 && <span className={styles.divider}>|</span>}
          <button
            className={cn(styles.button, {
              [styles["button--active"]]: i18n.language === lang.code,
            })}
            onClick={() => changeLanguage(lang.code)}
            aria-label={`Switch to ${lang.label}`}
          >
            {lang.label}
          </button>
        </span>
      ))}
    </div>
  );
}
