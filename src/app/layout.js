import "./globals.css";

import { Manrope } from "next/font/google";

import Header from "../components/Header";

import Footer from "../components/Footer";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function RootLayout({ children }) {

  return (

    <html lang="pt-br">

      <body className={manrope.className}>

        <Header />

        {children}

        <Footer />

      </body>

    </html>
  );
}