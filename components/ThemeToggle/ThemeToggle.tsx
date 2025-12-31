import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../utils/useTheme";
import cn from "classnames";
import styles from "./ThemeToggle.module.scss";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      onClick={toggleTheme}
      className={cn(styles.toggle, { [styles["toggle--light"]]: isLight })}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      title={`Switch to ${isLight ? "dark" : "light"} mode`}
    >
      <div className={styles.track}>
        <FontAwesomeIcon icon={faSun} className={styles.iconSun} />
        <FontAwesomeIcon icon={faMoon} className={styles.iconMoon} />
      </div>
      <div className={styles.thumb} />
    </button>
  );
}

