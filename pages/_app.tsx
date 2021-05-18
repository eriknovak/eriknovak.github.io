import type { AppProps } from "next/app";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "tailwindcss/tailwind.css";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="container mx-auto flex flex-col h-screen justify-between">
      <Header />
      <main className="grid grid-cols-12 m-5 md:ml-48 md:mt-20">
        <div className="col-span-12 xl:col-span-10">
          <Component {...pageProps} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default MyApp;
