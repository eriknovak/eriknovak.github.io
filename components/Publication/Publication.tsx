import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import cn from "classnames";
import { PublicationProps } from "../../Interfaces";
import { generateBibtex, copyToClipboard } from "../../utils/bibtex";
import styles from "./Publication.module.scss";

interface Props extends PublicationProps {
  /** Home view: title + inline meta line, no abstract or links. */
}

/** Publication-type colour coding (option A); keys are lowercase. */
const TYPE_COLORS: Record<string, string> = {
  journal: "var(--ed-type-journal)",
  conference: "var(--ed-type-conference)",
  arxiv: "var(--ed-type-arxiv)",
  dataset: "var(--ed-type-dataset)",
};

export default function Publication(props: Props) {
  const { t, ready } = useTranslation("publications");
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    authors,
    title,
    reference,
    location,
    year,
    url,
    type,
    doi,
    pdf,
    abstract,
    thumbnail,
    selected = false,
  } = props;

  const tt = (key: string, fallback: string) =>
    mounted && ready ? t(key) : fallback;

  const handleCopyBibtex = async () => {
    const bibtex = generateBibtex(props);
    const success = await copyToClipboard(bibtex);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const typeColor = type ? TYPE_COLORS[type.toLowerCase()] : undefined;
  const typeLabel = !type
    ? null
    : type === "Journal"
      ? tt("filterJournal", "Journal")
      : type === "Conference"
        ? tt("filterConf", "Conference")
        : type === "arXiv"
          ? tt("filterArxiv", "arXiv")
          : type === "Dataset"
            ? tt("typeDataset", "Dataset")
            : type;

  const paperHref = pdf || url;
  const firstPage = thumbnail && (
    <img src={thumbnail} alt={`First page of “${title}”`} loading="lazy" />
  );

  return (
    <div
      className={cn(styles.entry, {
        [styles.entrySelected]: selected,
        [styles.entryWithThumb]: thumbnail,
      })}
    >
      {thumbnail &&
        (paperHref ? (
          <a
            href={paperHref}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.thumb}
            title={tt("openPaper", "Open paper")}
          >
            {firstPage}
          </a>
        ) : (
          <span className={styles.thumb}>{firstPage}</span>
        ))}
      <div>
        {typeLabel && (
          <div className={styles.typeKicker} style={{ color: typeColor }}>
            {selected && <span className={styles.selectedDash} aria-hidden />}
            {selected && <span>{tt("selected", "Selected")} · </span>}
            <span>{typeLabel}</span>
          </div>
        )}
        <div className={styles.title}>
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--ed-fg)", textDecoration: "none" }}
            >
              {title}
            </a>
          ) : (
            title
          )}
        </div>
        <div className={styles.meta}>
          {authors} · <em style={{ fontStyle: "italic" }}>{reference}</em>
          {location ? `, ${location}` : ""} · {year}
          {doi && (
            <>
              {" · "}
              <a
                href={`https://doi.org/${doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.action}
                title={tt("viewDoi", "View DOI")}
              >
                DOI
              </a>
            </>
          )}
          {pdf && (
            <>
              {" · "}
              <a
                href={pdf}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.action}
                title={tt("downloadPdf", "Download PDF")}
              >
                {tt("pdf", "PDF")}
              </a>
            </>
          )}
          {" · "}
          <button
            type="button"
            onClick={handleCopyBibtex}
            className={styles.action}
            title={tt(
              copied ? "copied" : "copyBibtex",
              copied ? "Copied!" : "Copy BibTeX",
            )}
          >
            {copied ? (
              <>
                <FontAwesomeIcon icon={faCheck} style={{ fontSize: 10 }} />{" "}
                {tt("copiedShort", "Copied")}
              </>
            ) : (
              tt("bibtex", "BibTeX")
            )}
          </button>
        </div>
        {selected && abstract && (
          <div className={styles.abstract}>{abstract}</div>
        )}
      </div>
    </div>
  );
}
