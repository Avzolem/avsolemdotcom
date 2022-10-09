import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Head>
        <title> Avsolem 🦈 </title>
        <meta name="Online CV Maker" content="A Web Develop in Web" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero />

      <Footer />
    </>
  );
}
