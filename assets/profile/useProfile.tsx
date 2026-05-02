import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

interface ProfileData {
  description: React.ReactNode;
  ready: boolean;
}

const linkStyle: React.CSSProperties = {
  borderBottom: "1px solid var(--ed-fg)",
  color: "var(--ed-fg)",
  textDecoration: "none",
};

const linkClass = "underline-offset-4 hover:underline";

const FallbackDescription = () => (
  <>
    <p style={{ margin: "0 0 16px" }}>
      I work on natural language processing — text-document and text-stream
      analysis, semi-automatic data exploration, and visualization of text data.
    </p>
    <p style={{ margin: 0 }}>
      Senior Researcher at the{" "}
      <a
        className={linkClass}
        href="https://ailab.ijs.si/"
        target="_blank"
        rel="noopener noreferrer"
        style={linkStyle}
      >
        Department for Artificial Intelligence
      </a>
      , Jožef Stefan Institute. Data Scientist at{" "}
      <a
        className={linkClass}
        href="https://eventregistry.org/"
        target="_blank"
        rel="noopener noreferrer"
        style={linkStyle}
      >
        Event Registry
      </a>
      . Teaching assistant at the{" "}
      <a
        className={linkClass}
        href="https://www.mps.si/en/"
        target="_blank"
        rel="noopener noreferrer"
        style={linkStyle}
      >
        IPS PhD School
      </a>
      .
    </p>
  </>
);

export function useProfile(): ProfileData {
  const { t, ready } = useTranslation("home");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Until the client has hydrated we MUST render the same content the
  // server emitted (English), otherwise i18next picks the user's stored
  // locale on first client render and React reports a hydration mismatch.
  if (!mounted || !ready) {
    return {
      description: <FallbackDescription />,
      ready: false,
    };
  }

  const description = (
    <>
      <p style={{ margin: "0 0 16px" }}>{t("bio.body1")}</p>
      <p style={{ margin: 0 }}>
        <Trans
          i18nKey="bio.body2"
          ns="home"
          components={{
            link1: (
              <a
                className={linkClass}
                href="https://ailab.ijs.si/"
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
              />
            ),
            link2: (
              <a
                className={linkClass}
                href="https://eventregistry.org/"
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
              />
            ),
            link3: (
              <a
                className={linkClass}
                href="https://www.mps.si/en/"
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
              />
            ),
          }}
        />
      </p>
    </>
  );

  return {
    description,
    ready: true,
  };
}
