import Head from "next/head";

import Software from "../components/Software";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

import software from "../assets/software";

import { SoftwareProps } from "../Interfaces";

export default function Softwares() {
  return (
    <div>
      <Head>
        <title>Software | Erik Novak</title>
      </Head>

      <h1 className="text-4xl font-semibold mt-10">
        <a href="https://github.com/eriknovak">
          <FontAwesomeIcon icon={faGithub} style={{ marginRight: "10px" }} />
        </a>
        Software
      </h1>

      {software.map((item: SoftwareProps, id: number) => (
        <div key={id}>
          <Software
            title={item.title}
            labels={item.labels}
            description={item.description}
            links={item.links}
          />
        </div>
      ))}
    </div>
  );
}
