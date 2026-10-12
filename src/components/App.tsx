"use client";

import { has } from "@/lib/data";
import { SmoothScroll } from "@/lib/scroll";
import Navigation from "./Navigation";
import Hero from "./hero/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Work from "./sections/Work";
import Certifications from "./sections/Certifications";
import Experience from "./sections/Experience";
import Achievements from "./sections/Achievements";
import Contact from "./sections/Contact";
import RevealObserver from "./ui/RevealObserver";

export default function App() {
  return (
    <>
      <SmoothScroll />
      <a href="#about" className="skip">Skip to content</a>
      <Navigation />
      <main>
        <Hero />
        <About />
        {has("skills") && <Skills />}
        {has("work") && <Work />}
        {has("certifications") && <Certifications />}
        {has("experience") && <Experience />}
        {has("achievements") && <Achievements />}
        <Contact />
      </main>
      <RevealObserver />
      <style>{`
        .skip { position: fixed; left: 16px; top: -60px; z-index: 100; background: var(--ink); color: #fff; padding: 10px 16px; border-radius: 999px; font-size: 14px; transition: top .3s var(--ease); }
        .skip:focus { top: 16px; }
        section[tabindex="-1"]:focus { outline: none; }
      `}</style>
    </>
  );
}
