import type { AppProps } from "next/app";

import Header from "../components/Header";
import Footer from "../components/Footer";

// Initialize i18n
import "../utils/i18n";

import "../styles/globals.scss";
import "../styles/index.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <main className="pb-20">
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}

export default MyApp;
