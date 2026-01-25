import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PublicationProps } from "../../Interfaces";
import { generateBibtex, copyToClipboard } from "../../utils/bibtex";

import styles from "./Publication.module.scss";
import cn from "classnames";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePdf,
  faQuoteRight,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

function createTitle(title: string, URL: string) {
  return URL ? (
    <a className={styles.link} href={URL} target="_blank" rel="noopener">
      {title}
    </a>
  ) : (
    title
  );
}

export default function Publication(props: PublicationProps) {
  const { t, ready } = useTranslation("publications");
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { authors, title, reference, location, year, url, type, doi, pdf } =
    props;

  const handleCopyBibtex = async () => {
    const bibtex = generateBibtex(props);
    const success = await copyToClipboard(bibtex);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={cn(styles.container, styles[`publication--${type}`])}>
      <span className={styles.content}>
        {createTitle(title, url)}. {authors}. {reference},{" "}
        {location ? ` ${location}, ` : " "}
        {year}.
      </span>

      <div className={styles.actions}>
        <button
          className={cn(styles.actionButton, {
            [styles["actionButton--copied"]]: copied,
          })}
          onClick={handleCopyBibtex}
          title={
            mounted && ready
              ? copied
                ? t("copied")
                : t("copyBibtex")
              : copied
                ? "Copied!"
                : "Copy BibTeX"
          }
        >
          <FontAwesomeIcon icon={copied ? faCheck : faQuoteRight} fixedWidth />
          {copied
            ? ` ${mounted && ready ? t("copiedShort") : "Copied"}`
            : ` ${mounted && ready ? t("bibtex") : "BibTeX"}`}
        </button>

        {doi && (
          <a
            className={cn(styles.badge, styles["badge--doi"])}
            href={`https://doi.org/${doi}`}
            target="_blank"
            rel="noopener"
            title={mounted && ready ? t("viewDoi") : "View DOI"}
          >
            DOI
          </a>
        )}

        {pdf && (
          <a
            className={cn(styles.actionLink, styles["actionLink--pdf"])}
            href={pdf}
            target="_blank"
            rel="noopener"
            title={mounted && ready ? t("downloadPdf") : "Download PDF"}
          >
            <FontAwesomeIcon icon={faFilePdf} fixedWidth />{" "}
            {mounted && ready ? t("pdf") : "PDF"}
          </a>
        )}
      </div>
    </div>
  );
}
