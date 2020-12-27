import Head from "next/head";

import academic from "../assets/profile/academic";
import programming from "../assets/profile/programming";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  faOrcid,
  faResearchgate,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

const logos = {
  faGraduationCap: faGraduationCap,
  faPlayCircle: faPlayCircle,
  faOrcid: faOrcid,
  faResearchgate: faResearchgate,
  faGithub: faGithub,
};

export default function Home() {
  return (
    <div className="page">
      <Head>
        <title>Home | Erik Novak</title>
      </Head>

      <div className="flex flex-col xl:flex-row">
        <div className="flex-initial xl:mr-4">
          <h1 className="text-4xl font-semibold mt-10 mb-2">
            Hi, I'm Erik Novak
          </h1>
          <p className="mb-3">
            I am an Asistant Researcher at the{" "}
            <a
              className="transition text-lightblue hover:text-lightblue-dark"
              href="https://ailab.ijs.si/"
            >
              Department of Artificial Intelligence, Jozef Stefan Institute
            </a>
            . My research interests are data and text stream analysis,
            (semi-)automatic data exploration, and data visualization.
          </p>
          <p className="mb-3">
            I am also teaching as an Asistant at the{" "}
            <a
              className="transition text-lightblue hover:text-lightblue-dark"
              href="https://www.mps.si/en/"
            >
              Jozef Stefan International Postgraduate School
            </a>
            .
          </p>

          <div className="flex justify-center xl:hidden my-10">
            <img
              className="rounded-full border-8 border-white"
              src="/imgs/profile.png"
            ></img>
          </div>

          <div className="flex flex-col lg:flex-row xl:flex-col">
            <div className="flex-1 mr-6">
              <h2 className="text-2xl font-semibold mt-10 mb-2">
                Academic Profiles
              </h2>

              {academic.map((link, id) => (
                <div
                  className="transition text-lightblue hover:text-lightblue-dark"
                  key={id}
                >
                  <a href={link.url} target="_blank">
                    <FontAwesomeIcon
                      icon={logos[link.logo]}
                      fixedWidth
                      style={{ marginTop: "4px" }}
                    />{" "}
                    {link.label}
                  </a>
                </div>
              ))}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mt-10 mb-2">
                Programming Skills
              </h2>
              <div className="flex flex-row flex-wrap">
                {programming.map((link, id) => (
                  <img
                    key={id}
                    className="h-10 my-1 mx-2"
                    src={link.image}
                    alt={link.label}
                  ></img>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-none hidden xl:block">
          <img
            className="rounded-full border-8 border-white"
            src="/imgs/profile.png"
          ></img>
        </div>
      </div>
    </div>
  );
}
