const PROFILE: { [key: string]: React.ReactNode } = {
  title: "dr. Erik Novak",
  subtitle: "Researcher in Artificial Intelligence",
  description: (
    <>
      <p>Hi!</p>
      <p>I am a researcher in Artificial Intelligence.
        My research interests are in NLP, more specifically, text documents and
        text stream analysis, (semi-)automatic data exploration, and text data
        visualization.
      </p>
      <p>I am a Data Scientist at{" "}
        <a
          className="transition text-link hover:text-link-hover hover:underline"
          href="https://eventregistry.org/"
          target="_blank"
          rel="noopener"
        >
          Event Registry
        </a>
        , where I work on applying NLP to news data.
      </p>
      <p>
        I am also a Senior Researcher at the{" "}
        <a
          className="transition text-link hover:text-link-hover hover:underline"
          href="https://ailab.ijs.si/"
          target="_blank"
          rel="noopener"
        >
          Department for Artificial Intelligence, Jozef Stefan Institute
        </a>
        , where I am managing a number of European Research Projects and mentoring
        junior researchers and students.
      </p>
      <p>
        Furthermore, I am a Teaching Assistant at the{" "}
        <a
          className="transition text-link hover:text-link-hover hover:underline"
          href="https://www.mps.si/en/"
          target="_blank"
          rel="noopener"
        >
          Jozef Stefan International Postgraduate School
        </a>
        , where I assist at the AI for Data Analysis course.
      </p>
    </>
  ),
};

export default PROFILE;
