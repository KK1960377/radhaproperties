import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import Properties from "../components/Properties";
import Counters from "../components/Counters";
import WhyUs from "../components/WhyUs";
import About from "../components/About";
import Team from "../components/Team";
import Partners from "../components/Partners";
import Testimonials from "../components/Testimonials";
import BlogsSection from "../components/BlogsSection";
import FAQ from "../components/FAQ";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import FloatingButtons from "../components/FloatingButtons";

export default function Home() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get("/settings").then((res) => setSettings(res.data)).catch(() => {});
  }, []);

  return (
    <div>
      <Navbar settings={settings} />
      <Hero />
      <SearchBar />
      <Properties />
      <Counters />
      <WhyUs />
      <About settings={settings} />
      <Team />
      <Partners />
      <Testimonials />
      <BlogsSection />
      <FAQ />
      <Contact settings={settings} />
      <Footer settings={settings} />
      <FloatingButtons settings={settings} />
    </div>
  );
}
