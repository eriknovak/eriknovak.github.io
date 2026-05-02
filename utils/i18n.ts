import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enCommon from "../public/locales/en/common.json";
import enHome from "../public/locales/en/home.json";
import enPublications from "../public/locales/en/publications.json";
import enProjects from "../public/locales/en/projects.json";
import enBlog from "../public/locales/en/blog.json";

import slCommon from "../public/locales/sl/common.json";
import slHome from "../public/locales/sl/home.json";
import slPublications from "../public/locales/sl/publications.json";
import slProjects from "../public/locales/sl/projects.json";
import slBlog from "../public/locales/sl/blog.json";

const resources = {
  en: {
    common: enCommon,
    home: enHome,
    publications: enPublications,
    projects: enProjects,
    blog: enBlog,
  },
  sl: {
    common: slCommon,
    home: slHome,
    publications: slPublications,
    projects: slProjects,
    blog: slBlog,
  },
};

// Only initialize on client side to avoid hydration mismatch
const isClient = typeof window !== "undefined";

i18n.use(initReactI18next);

if (isClient) {
  i18n.use(LanguageDetector);
}

i18n.init({
  resources,
  lng: isClient ? undefined : "en", // Server always uses English
  fallbackLng: "en",
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
  detection: isClient
    ? {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
      }
    : undefined,
  react: {
    useSuspense: false, // Disable suspense to handle hydration
  },
});

export default i18n;
