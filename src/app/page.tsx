import Hero from "@/components/sections/Hero";
import SelectedWork from "@/components/sections/SelectedWork";
import Showreel from "@/components/sections/Showreel";
import Photography from "@/components/sections/Photography";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <SelectedWork />
        <Showreel />
        <Photography />
        <About />
        <Services />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
