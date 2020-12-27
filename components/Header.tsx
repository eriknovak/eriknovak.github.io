import Link from "next/link";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();
  const homepage = router.pathname === "/";
  const publications = router.pathname.includes("publications");
  const projects = router.pathname.includes("projects");
  const software = router.pathname.includes("software");
  // const lectures = router.pathname.includes("lectures");

  return (
    <nav className="grid md:grid-cols-6 xl:grid-cols-10 2xl:grid-cols-12 gap-4 p-5">
      <div className="md:col-span-4 md:col-start-2 xl:col-span-8 xl:col-start-2 2xl:col-start-3 block text-xl">
        <Link href="/">
          <a
            className={
              homepage
                ? "transition block mt-4 mr-4 lg:inline-block text-yellow hover:text-yellow-dark"
                : "transition block mt-4 mr-4 lg:inline-block text-white hover:text-white-dark"
            }
          >
            Home
          </a>
        </Link>
        <Link href="/publications">
          <a
            className={
              publications
                ? "transition block mt-4 mr-4 lg:inline-block text-yellow hover:text-yellow-dark"
                : "transition block mt-4 mr-4 lg:inline-block text-white hover:text-white-dark"
            }
          >
            Publications
          </a>
        </Link>
        <Link href="/projects">
          <a
            className={
              projects
                ? "transition block mt-4 mr-4 lg:inline-block text-yellow hover:text-yellow-dark"
                : "transition block mt-4 mr-4 lg:inline-block text-white hover:text-white-dark"
            }
          >
            Projects
          </a>
        </Link>
        <Link href="/software">
          <a
            className={
              software
                ? "transition block mt-4 mr-4 lg:inline-block text-yellow hover:text-yellow-dark"
                : "transition block mt-4 mr-4 lg:inline-block text-white hover:text-white-dark"
            }
          >
            Software
          </a>
        </Link>
        {/* <Link href="/lectures">
          <a
            className={
              lectures
                ? "transition block mt-4 mr-4 lg:inline-block text-yellow hover:text-yellow-dark"
                : "transition block mt-4 mr-4 lg:inline-block text-white hover:text-white-dark"
            }
          >
            Lectures
          </a>
        </Link> */}
      </div>
    </nav>
  );
}
