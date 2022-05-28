const PROFILE: { [key: string]: React.ReactNode } = {
  title: "Erik Novak",
  subtitle: "PhD Researcher in Artificial Intelligence",
  description: (
    <>
      <p>👋🏽 Hi!</p>
      <p>
        I am an PhD Researcher at the{" "}
        <a
          className="transition text-link hover:text-link-hover"
          href="https://ailab.ijs.si/"
        >
          Department for Artificial Intelligence, Jozef Stefan Institute
        </a>
        . My research interests are data and text stream analysis,
        (semi-)automatic data exploration, and data visualization.
      </p>
      <p>
        I am also a Teaching Assistant at the{" "}
        <a
          className="transition text-link hover:text-link-hover"
          href="https://www.mps.si/en/"
        >
          Jozef Stefan International Postgraduate School
        </a>
        .
      </p>
    </>
  ),
};

export default PROFILE;
