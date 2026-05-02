import { useEffect, useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faCheck,
  faQuoteRight,
  faLink,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import { PublicationProps } from "../../Interfaces";
import { generateBibtex, copyToClipboard } from "../../utils/bibtex";
import styles from "./Publication.module.scss";

interface Props extends PublicationProps {
  /** Home view: title + inline meta line, no abstract or chips. */
  minimal?: boolean;
}

const chipStyle: CSSProperties = {
  fontFamily: "var(--ed-sans)",
  fontSize: 13,
  color: "var(--ed-fg)",
  textDecoration: "none",
  border: "1px solid var(--ed-rule)",
  padding: "4px 10px",
  borderRadius: 2,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
  letterSpacing: "0.2px",
  background: "var(--ed-input)",
  cursor: "pointer",
  textAlign: "left",
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
    minimal = false,
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

  if (minimal) {
    return (
      <div className={styles.minimal}>
        <div
          style={{
            fontFamily: "var(--ed-serif)",
            fontSize: 18,
            lineHeight: 1.4,
            marginBottom: 6,
            fontWeight: 500,
          }}
        >
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
        <div
          style={{
            fontSize: 14,
            color: "var(--ed-muted)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {authors} · <em style={{ fontStyle: "italic" }}>{reference}</em>
          {location ? ` (${location})` : ""} · {year}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div>
        {type && (
          <div
            style={{
              fontFamily: "var(--ed-sans)",
              fontSize: 10,
              color: "var(--ed-muted)",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            {type}
          </div>
        )}
        <div
          style={{
            fontFamily: "var(--ed-serif)",
            fontSize: 18,
            fontWeight: 500,
            lineHeight: 1.35,
            marginBottom: 8,
          }}
        >
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
        <div
          style={{
            fontSize: 14,
            color: "var(--ed-muted)",
            lineHeight: 1.5,
          }}
        >
          {authors} · <em style={{ fontStyle: "italic" }}>{reference}</em>
          {location ? `, ${location}` : ""} · {year}
        </div>
        {abstract && (
          <div
            style={{
              fontSize: 14,
              color: "var(--ed-text-secondary)",
              lineHeight: 1.55,
              marginTop: 10,
              paddingTop: 10,
              borderTop: "1px dashed var(--ed-rule)",
              fontStyle: "italic",
            }}
          >
            {abstract}
          </div>
        )}
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          onClick={handleCopyBibtex}
          style={chipStyle}
          title={tt(
            copied ? "copied" : "copyBibtex",
            copied ? "Copied!" : "Copy BibTeX",
          )}
        >
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <FontAwesomeIcon
              icon={copied ? faCheck : faQuoteRight}
              style={{ color: "var(--ed-muted)", fontSize: 11 }}
              fixedWidth
            />
            <span>
              {copied ? tt("copiedShort", "Copied") : tt("bibtex", "BibTeX")}
            </span>
          </span>
        </button>
        {doi && (
          <a
            href={`https://doi.org/${doi}`}
            target="_blank"
            rel="noopener noreferrer"
            style={chipStyle}
            title={tt("viewDoi", "View DOI")}
          >
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <FontAwesomeIcon
                icon={faLink}
                style={{ color: "var(--ed-muted)", fontSize: 11 }}
                fixedWidth
              />
              <span>DOI</span>
            </span>
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              style={{ color: "var(--ed-muted)", fontSize: 9 }}
            />
          </a>
        )}
        {pdf && (
          <a
            href={pdf}
            target="_blank"
            rel="noopener noreferrer"
            style={chipStyle}
            title={tt("downloadPdf", "Download PDF")}
          >
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <FontAwesomeIcon
                icon={faFilePdf}
                style={{ color: "var(--ed-muted)", fontSize: 11 }}
                fixedWidth
              />
              <span>{tt("pdf", "PDF")}</span>
            </span>
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              style={{ color: "var(--ed-muted)", fontSize: 9 }}
            />
          </a>
        )}
      </div>
    </div>
  );
}
