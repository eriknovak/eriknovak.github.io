import { useEffect, useState } from "react";
import { useTheme } from "../../utils/useTheme";
import cn from "classnames";
import styles from "./ThemeToggle.module.scss";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={styles.toggle}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      title={`Switch to ${isLight ? "dark" : "light"} mode`}
    >
      <span
        className={cn(styles.label, { [styles["label--active"]]: !isLight })}
      >
        Dark
      </span>
      <span className={styles.divider}>/</span>
      <span
        className={cn(styles.label, { [styles["label--active"]]: isLight })}
      >
        Light
      </span>
    </button>
  );
}
