import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import Link from "../components/Link";
import SEO from "../components/SEO";

export default function Custom404() {
  const { t, ready } = useTranslation("common");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist."
        path="/404"
        noindex
      />

      <h1 className="text-6xl lg:text-8xl font-bold mb-4">404</h1>
      <h2 className="text-2xl lg:text-3xl font-semibold mb-6 text-highlight">
        {mounted && ready ? t("notFound.title") : "Page Not Found"}
      </h2>
      <p className="text-lg mb-8 max-w-md">
        {mounted && ready
          ? t("notFound.description")
          : "The page you're looking for doesn't exist or has been moved."}
      </p>
      <Link href="/" legacyBehavior>
        <a className="px-6 py-3 bg-base-highlight rounded-lg transition-all hover:shadow-lg hover:scale-105 text-link hover:text-link-hover font-medium">
          {mounted && ready ? t("notFound.backHome") : "Back to Home"}
        </a>
      </Link>
    </div>
  );
}
