import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faEnvelope } from "@fortawesome/free-regular-svg-icons";

export default function Footer() {
  return (
    <footer className="footer flex flex-col sm:flex-row m-5 md:ml-48 py-12">
      <div className="flex-grow flex-shring-0 text-left">
        <h3 className="text-xl font-medium mt-5 mb-2">Contact</h3>
        <ul className="fa-ul ml-8">
          <li className="mb-1">
            <FontAwesomeIcon
              icon={faBuilding}
              listItem
              fixedWidth
              style={{ marginTop: "4px" }}
            />
            Department for Artificial Intelligence
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
    </footer>
  );
}
