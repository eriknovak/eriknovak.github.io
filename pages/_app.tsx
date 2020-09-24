import type { AppProps } from 'next/app';

import Footer from "../components/Footer";

import "../styles/globals.css";


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="container">
      <main className="main">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}

export default MyApp;


