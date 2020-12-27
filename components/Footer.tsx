import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faEnvelope } from "@fortawesome/free-regular-svg-icons";

export default function Footer() {
  return (
    <footer className="footer grid grid-cols-1 sm:grid-cols-6 xl:grid-cols-10 2xl:grid-cols-12 gap-4 p-5">
      <div className="sm:col-span-6 sm:col-start-1 md:col-span-4 md:col-start-2 xl:col-span-8 xl:col-start-2 2xl:col-start-3 flex flex-col sm:flex-row sm:flex-wrap">
        <div className="flex-grow text-left">
          <h3 className="text-xl font-medium mt-5 mb-2">Contact</h3>
          <ul className="fa-ul ml-8">
            <li className="mb-1">
              <FontAwesomeIcon
                icon={faBuilding}
                listItem
                fixedWidth
                style={{ marginTop: "4px" }}
              />
              Erik Novak <br />
              Department of Artificial Intelligence
              <br />
              Jožef Stefan Institute <br />
              Jamova cesta 39 <br />
              1000 Ljubljana <br />
              Slovenia
            </li>
            <li className="mb-1">
              <a
                href="mailto:erik.novak@ijs.si"
                className="text-yellow hover:text-yellow-dark"
              >
                <FontAwesomeIcon
                  icon={faEnvelope}
                  listItem
                  fixedWidth
                  style={{ marginTop: "4px" }}
                />
                erik.novak@ijs.si
              </a>
            </li>
          </ul>
        </div>
        <div className="flex-grow order-first text-left sm:order-last sm:text-right">
          <h3 className="text-xl font-medium mt-5 mb-2">Pages</h3>
          <ul className="pl-0">
            <li className="transition text-yellow hover:text-yellow-dark mb-1">
              <Link href="/">Homepage</Link>
            </li>
            <li className="transition text-yellow hover:text-yellow-dark mb-1">
              <Link href="/publications">Publications</Link>
            </li>
            <li className="transition text-yellow hover:text-yellow-dark mb-1">
              <Link href="/projects">Projects</Link>
            </li>
            <li className="transition text-yellow hover:text-yellow-dark mb-1">
              <Link href="/software">Software</Link>
            </li>
            {/* <li className="text-yellow hover:text-yellow-dark mb-1">
              <Link href="/lectures">Lectures</Link>
            </li> */}
          </ul>
        </div>
      </div>
    </footer>
  );
}
