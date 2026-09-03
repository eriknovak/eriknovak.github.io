import { PublicationProps } from "../../Interfaces";

const JOURNAL_PAPERS: PublicationProps[] = [
  {
    id: "clinical-ner-llms-2026",
    selected: true,
    abstract:
      "Compares large language model approaches for extracting biomedical entities from multilingual clinical records within the PREPARE project.",
    authors: "E. Calcina, E. Novak, D. Mladenić, and PREPARE Project Group",
    title:
      "Extracting Biomedical Entities from Clinical Records: A Comparative Study of Large Language Model Approaches",
    url: "https://www.tandfonline.com/doi/full/10.1080/08839514.2026.2700905",
    reference: "Applied Artificial Intelligence, 40(1)",
    location: null,
    year: 2026,
    doi: "10.1080/08839514.2026.2700905",
  },
  {
    id: "synthetic-medical-data-eval-2025",
    authors: "L. Dolinar, E. Calcina, E. Novak",
    title:
      "Evaluating Open-Source Large Language Models for Synthetic Non-English Medical Data Generation Using Prompt-Based Techniques",
    url: "https://www.informatica.si/index.php/informatica/article/view/7763/4618",
    reference: "Informatica",
    location: null,
    year: 2025,
    doi: "10.31449/inf.v49i27.7763",
  },
  {
    id: "tarnet-2024",
    authors: "K. Buza, E. Novak",
    title:
      "TARNet for the Classification of Time Series with Missing Values: A Strong Baseline",
    url: "https://acta.sapientia.ro/en/series/informatica/publications/volume-16-no-1-2024/tarnet-for-the-classification-of-time-series-with-missing-values-a-strong-baseline",
    reference: "Acta Univ. Sapientiae, Informatica",
    location: null,
    year: 2024,
    doi: "10.47745/ausi-2024-0001",
  },
  {
    id: "kleefstra-cohort-2024",
    authors:
      "T. Zdolšek Draksler, A. Bouman, A. Guček, E. Novak, P. Burger, F. Colin, T. Kleefstra",
    title:
      "Exploring Kleefstra Syndrome Cohort Phenotype Characteristics: Prevalence Insights from Caregiver-Reported Outcomes",
    url: "https://www.sciencedirect.com/science/article/pii/S1769721224000661",
    reference: "European Journal of Medical Genetics",
    location: null,
    year: 2024,
    doi: "10.1016/j.ejmg.2024.104974",
  },
  {
    id: "text-generation-eval-2024",
    selected: true,
    abstract:
      "An evaluation metric for text generation that couples semantic similarity with word-order sensitivity, outperforming BLEU-style baselines.",
    authors: "E. Novak, L. Bizjak, D. Mladenić, and M. Grobelnik",
    title:
      "Evaluating Text Generation Model Performance by Combining Semantic Meaning and Word Order",
    url: "https://ieeexplore.ieee.org/document/10591977",
    reference: "IEEE Access",
    location: null,
    year: 2024,
    doi: "10.1109/ACCESS.2024.3426082",
  },
  {
    id: "crosslingual-relevance-2022",
    selected: true,
    abstract:
      "Examines what drives the relevance scores in cross-lingual document retrieval, making multilingual ranking models interpretable.",
    authors: "E. Novak, L. Bizjak, D. Mladenić, and M. Grobelnik",
    title:
      "Why is a Document Relevant? Understanding the Relevance Scores in Cross-Lingual Document Retrieval",
    url: "https://www.sciencedirect.com/science/article/pii/S0950705122002416",
    reference: "Knowledge-Based Systems",
    location: null,
    year: 2022,
    doi: "10.1016/j.knosys.2022.108545",
  },
  {
    id: "streaming-data-fusion-2019",
    selected: true,
    abstract:
      "A streaming data fusion methodology that turns heterogeneous IoT sensor streams into feature vectors ready for machine learning.",
    authors: "K. Kenda, B. Kažič, E. Novak, D. and Mladenić",
    title: "Streaming Data Fusion for the Internet of Things",
    url: "https://www.mdpi.com/1424-8220/19/8/1955",
    reference: "Sensors, 19(8)",
    location: null,
    year: 2019,
    doi: "10.3390/s19081955",
  },
];

export default JOURNAL_PAPERS;
