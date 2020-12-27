import type { AppProps } from "next/app";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "tailwindcss/tailwind.css";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="container mx-auto flex flex-col h-screen justify-between">
      <Header />
      <main className="grid md:grid-cols-6 xl:grid-cols-10 2xl:grid-cols-12 gap-4 p-5 pb-16">
        <div className="md:col-span-4 md:col-start-2 xl:col-span-8 xl:col-start-2 2xl:col-start-3">
          <Component {...pageProps} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default MyApp;
