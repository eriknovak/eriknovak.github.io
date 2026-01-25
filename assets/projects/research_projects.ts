import { ProjectProps } from "../../Interfaces";

const RESEARCH_PROJECTS: ProjectProps[] = [
  {
    title: "PREPARE",
    type: "Horizon Europe",
    startDate: "June 2023",
    endDate: "Present",
    description: [
      "PREPARE is a Horizon Europe project aimed at improving the lives of people with chronic noncommunicable diseases by developing tools that enable patients and healthcare providers to select optimal therapy strategies. The project transforms rehabilitation through personalized care approaches, combining advances in clinical research, socio-behavioral science, data science, and AI methods to overcome challenges in patient stratification and outcome prediction.",
      "Our contributions include developing text anonymization tools (Anonipy) and medical terminology extraction methods (Medtermex) to support privacy-preserving health data analysis. In addition, we developed an extraction tool to support medical term extraction and mapping to standardized medical vocabularies.",
    ],
    links: [
      {
        type: "homepage",
        label: "Project Homepage",
        url: "https://prepare-rehab.eu/",
      },
    ],
    resources: [
      {
        type: "github",
        label: "Anonipy",
        owner: "eriknovak",
        repo: "anonipy",
      },
      {
        type: "github",
        label: "Medtermex",
        owner: "E3-JSI",
        repo: "medtermex",
      },
    ],
  },
  {
    title: "European Statistics Awards",
    type: "Eurostat Contract",
    startDate: "January 2022",
    endDate: "December 2025",
    description: [
      "The European Statistics Awards is a Eurostat initiative promoting statistical literacy and data-driven thinking among students and young researchers across Europe. The project developed and maintains a competition platform that hosts annual challenges where participants analyze official European statistics to address real-world questions.",
      "Our contribution involves developing and maintaining the web platform that manages competition organization, team registrations, submissions, and evaluation workflows.",
    ],
    links: [
      {
        type: "homepage",
        label: "Competition Platform",
        url: "https://statistics-awards.eu/",
      },
    ],
  },
  {
    title: "SEMTEH",
    type: "Slovenian Ministry for Culture",
    startDate: "Mar 2023",
    endDate: "October 2023",
    description: [
      "SEMTEH upgraded open-access semantic resources for the Slovenian language by creating a new, manually reviewed version of the Slovenian WordNet semantic lexicon and establishing semantic links to the Digital Dictionary Database (DSB). The project employed deep learning and neural network methods to prepare data for manual review and to connect semantic resources, improving both vocabulary coverage and data reliability of the existing WordNet. The resulting linked data ensures availability of Slovenian semantic resources in major language technology collections such as BabelNet and Wikidata.",
    ],
  },
  {
    title: "RSDO",
    type: "Development of Slovene in a Digital Environment",
    startDate: "May 2020",
    endDate: "Feb 2023",
    description: [
      "RSDO developed modern language technologies for the Slovenian language, creating computational tools and services for research institutions, businesses, and the general public. The project delivered applications for speech recognition, machine transcription, machine translation, and terminology extraction, all released under open licenses through a public portal.",
      "Our contributions included developing commonsense knowledge resources (SloATOMIC) and language models for Slovenian to ensure the language remains viable in the digital age.",
    ],
    links: [
      {
        type: "homepage",
        label: "Project Homepage",
        url: "https://www.cjvt.si/rsdo/en/project/",
      },
    ],
    resources: [
      {
        type: "github",
        label: "SloATOMIC 2020 Dataset",
        owner: "E3-JSI",
        repo: "dataset-SloATOMIC-2020",
      },
      {
        type: "github",
        label: "SloMET ATOMIC 2020 Model",
        owner: "E3-JSI",
        repo: "model-SloMET-ATOMIC-2020",
      },
    ],
  },
  {
    title: "Humane AI Network",
    type: "Horizon 2020",
    startDate: "Sept 2020",
    endDate: "Aug 2024",
    description: [
      "The Humane AI Network is a European initiative advancing human-centered artificial intelligence that meaningfully integrates with human contexts and capabilities. The network coordinates research across multiple work packages covering human-in-the-loop systems, multimodal perception, ethics, and societal applications, while funding over 120 collaborative micro-projects. The initiative bridges AI research with societal impact, examining how artificial intelligence affects diverse communities and addressing ethical dimensions of AI deployment.",
    ],
    links: [
      {
        type: "homepage",
        label: "Project Homepage",
        url: "https://www.humane-ai.eu/",
      },
    ],
  },
  {
    title: "CURLICAT",
    type: "CEF Telecomm Programme",
    startDate: "Jun 2020",
    endDate: "Nov 2022",
    description: [
      "CURLICAT compiled curated multilingual language datasets in seven Central and Eastern European languages (Bulgarian, Croatian, Hungarian, Polish, Romanian, Slovak, and Slovenian) to enhance the EU's Automated Translation infrastructure. The project targeted domains relevant to European Digital Service Infrastructures, creating high-quality parallel corpora for training machine translation systems. These resources support improved translation capabilities for underrepresented European languages within the CEF digital services.",
    ],
    links: [
      {
        type: "homepage",
        label: "Project Homepage",
        url: "https://curlicat.eu/",
      },
    ],
  },
  {
    title: "Infinitech",
    type: "Horizon 2020",
    startDate: "Oct 2019",
    endDate: "Dec 2022",
    description: [
      "Infinitech developed novel Big Data, IoT, and AI technologies for managing diverse data types in the finance and insurance sectors, with strong emphasis on regulatory compliance and data governance. The project established nine testbeds and sandboxes offering open APIs for testing and validating innovative fintech solutions. These tools support both regulatory authorities and financial institutions in adopting data-driven decision-making while maintaining compliance.",
    ],
    links: [
      {
        type: "homepage",
        label: "Project Homepage",
        url: "https://www.infinitech-h2020.eu/",
      },
    ],
  },
  {
    title: "EnviroLENS",
    type: "Horizon 2020",
    startDate: "Dec 2018",
    endDate: "Jun 2021",
    description: [
      "EnviroLENS bridged the gap between European satellite capabilities provided by Copernicus and environmental law enforcement needs. The project delivered Earth observation-based services providing evidence on environmental incidents and legal violations to support judicial data-gathering processes and foster data-driven decision-making.",
      "Our contribution included developing the eLENS Miner System for processing and analyzing environmental legal documents and connecting them to geo-locations.",
    ],
    links: [
      {
        type: "homepage",
        label: "Project Homepage",
        url: "https://envirolens.eu/",
      },
    ],
    resources: [
      {
        type: "github",
        label: "eLENS Miner System",
        owner: "E3-JSI",
        repo: "eLENS-miner-system",
      },
    ],
  },
  {
    title: "X5GON",
    type: "Horizon 2020",
    startDate: "Sep 2017",
    endDate: "Dec 2020",
    description: [
      "X5GON created an AI-driven platform connecting open educational resources across languages, cultures, and domains to deliver personalized learning experiences. The project developed discovery, recommendation, and translation services that adapt to learner needs, making educational materials accessible regardless of language barriers. The technology formed the basis for UNESCO's International Research Centre on Artificial Intelligence work in education.",
    ],
    links: [
      {
        type: "homepage",
        label: "Project Homepage",
        url: "https://x5gon.org/",
      },
      {
        type: "service",
        label: "X5GON Platform",
        url: "https://platform.x5gon.org/",
      },
      {
        type: "service",
        label: "X5GON Discovery",
        url: "https://discovery.x5gon.org/",
      },
    ],
    resources: [
      {
        type: "github-org",
        label: "X5GON Organization",
        org: "X5GON",
      },
    ],
  },
  {
    title: "European Data Science Academy",
    type: "Horizon 2020",
    startDate: "Sep 2015",
    endDate: "Jan 2018",
    description: [
      "EDSA addressed Europe's data science skills shortage by designing modular curricula for data science training across the European Union. The project analyzed sector-specific skillsets, developed adaptable training programs, and delivered learning resources through multi-platform and multilingual channels. The initiative established a virtuous learning cycle connecting industry demands with educational offerings through an interactive dashboard and aggregated courses portal.",
    ],
    links: [
      {
        type: "homepage",
        label: "Project Homepage",
        url: "https://edsa-project.eu/",
      },
    ],
  },
  {
    title: "QMiner",
    type: "Open Source Project",
    startDate: "Feb 2015",
    endDate: "Jun 2022",
    description: [
      "QMiner is a data analytics platform for processing large-scale real-time streams containing structured and unstructured data. Built as a Node.js addon, it provides support for text mining, full-text search, similarity matching, stream processing, and machine learning on continuous data flows. The platform enables anomaly detection, keyword analysis, and document classification for applications requiring real-time data analysis.",
    ],
    links: [
      {
        type: "homepage",
        label: "Project Homepage",
        url: "https://qminer.github.io/",
      },
    ],
    resources: [
      {
        type: "github",
        label: "qminer",
        owner: "qminer",
        repo: "qminer",
      },
    ],
  },
];

export default RESEARCH_PROJECTS;
