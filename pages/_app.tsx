import type { AppProps } from "next/app";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="container">
      <Header />
      <main className="main">
        <div className="content">
          <Component {...pageProps} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default MyApp;
