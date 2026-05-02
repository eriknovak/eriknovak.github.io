import type { AppProps } from "next/app";

import Header from "../components/Header";
import Footer from "../components/Footer";

// Initialize i18n
import "../utils/i18n";

import "../styles/globals.scss";
import "../styles/index.scss";
import "katex/dist/katex.min.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <main className="px-4 max-w-screen-lg mx-auto pt-32 pb-20">
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}

export default MyApp;
