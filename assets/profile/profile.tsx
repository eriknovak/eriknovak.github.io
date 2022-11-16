const PROFILE: { [key: string]: React.ReactNode } = {
  title: "Erik Novak",
  subtitle: "Researcher in Artificial Intelligence",
  description: (
    <>
      <p>👋🏽 Hi!</p>
      <p>
        I am a Researcher at the{" "}
        <a
          className="transition text-link hover:text-link-hover"
          href="https://ailab.ijs.si/"
          target="_blank"
          rel="noopener"
        >
          Department for Artificial Intelligence, Jozef Stefan Institute
        </a>
        . My research interests is in NLP, more specifically text document and
        text stream analysis, (semi-)automatic data exploration, and text data
        visualization.
      </p>
      <p>
        I am also a Teaching Assistant at the{" "}
        <a
          className="transition text-link hover:text-link-hover"
          href="https://www.mps.si/en/"
          target="_blank"
          rel="noopener"
        >
          Jozef Stefan International Postgraduate School
        </a>
        .
      </p>
    </>
  ),
};

export default PROFILE;
