const papers: {
  authors: string;
  title: string;
  url: string;
  reference: string;
  location: string | null;
  year: number;
  presentation: string | null;
}[] = [
  {
    authors: "E. Novak, L. Bizjak, D. Mladenić, and M. Grobelnik",
    title: "Why is a Document Relevant? Understanding the Relevance Scores in Cross-Lingual Document Retrieval",
    url: "https://www.sciencedirect.com/science/article/pii/S0950705122002416",
    reference: "Knowledge-Based Systems",
    location: null,
    year: 2022,
    presentation: null,
  },
  {
    authors: "K. Kenda, B. Kažič, E. Novak, D. and Mladenić",
    title: "Streaming Data Fusion for the Internet of Things",
    url: "https://www.mdpi.com/1424-8220/19/8/1955",
    reference: "Sensors, 19(8)",
    location: null,
    year: 2019,
    presentation: null,
  },
];

export default papers;
