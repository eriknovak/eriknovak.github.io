import Link from "./Link";
import { useRouter } from "next/router";

const pages = [
  { title: "Home", route: "/" },
  { title: "Projects", route: "/projects" },
  { title: "Software", route: "/software" },
  { title: "Publications", route: "/publications" },
];

const activeLink =
  "transition block mt-4 mr-4 lg:inline-block text-yellow hover:text-yellow-dark";
const passiveLink =
  "transition block mt-4 mr-4 lg:inline-block text-white hover:text-white-dark";

export default function Header() {
  const router = useRouter();
  return (
    <nav className="relative md:fixed md:top-20 grid grid-cols-auto gap-3 p-5 pt-8 text-xl">
      {pages.map((page, id) => (
        <Link href={page.route} key={id}>
          <a className={router.route === page.route ? activeLink : passiveLink}>
            {page.title}
          </a>
        </Link>
      ))}
    </nav>
  );
}
