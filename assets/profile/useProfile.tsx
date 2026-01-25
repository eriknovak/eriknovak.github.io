import { useTranslation, Trans } from "react-i18next";

interface ProfileData {
  title: string;
  subtitle: string;
  description: React.ReactNode;
  ready: boolean;
}

const linkClass = "transition text-link hover:text-link-hover hover:underline";

export function useProfile(): ProfileData {
  const { t, ready } = useTranslation("home");

  const description = (
    <>
      <p>{t("profile.greeting")}</p>
      <p>{t("profile.bio1")}</p>
      <p>
        <Trans
          i18nKey="profile.bio2"
          ns="home"
          components={{
            link1: (
              <a
                className={linkClass}
                href="https://ailab.ijs.si/"
                target="_blank"
                rel="noopener"
              />
            ),
          }}
        />
      </p>
      <p>
        <Trans
          i18nKey="profile.bio3"
          ns="home"
          components={{
            link2: (
              <a
                className={linkClass}
                href="https://eventregistry.org/"
                target="_blank"
                rel="noopener"
              />
            ),
          }}
        />
      </p>
      <p>
        <Trans
          i18nKey="profile.bio4"
          ns="home"
          components={{
            link3: (
              <a
                className={linkClass}
                href="https://www.mps.si/en/"
                target="_blank"
                rel="noopener"
              />
            ),
          }}
        />
      </p>
    </>
  );

  return {
    title: t("title"),
    subtitle: t("subtitle"),
    description,
    ready,
  };
}
