// app/page.tsx
import dynamic from "next/dynamic";
import HeroSection from "@/components/sections/hero";
import Navbar from "@/components/navbar";
import ScrollSpy from "@/components/scroll-spy";
import ContactFloatButton from "@/components/contact-float-button";

const PortfolioSection = dynamic(
  () => import("@/components/sections/portfolio").then((m) => ({ default: m.PortfolioSection })),
  { ssr: true }
);

const AboutSection = dynamic(() => import("@/components/sections/aboutus"), {
  ssr: true,
});

const ContactSection = dynamic(() => import("@/components/sections/contactus"), {
  ssr: true,
});

export default function Home() {
  const activeSections = [
    { id: "hero", label: "Home" },
    { id: "portfolio", label: "Portfolio" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" }
  ];

  return (
    <main className="relative min-h-screen">
      <div className="noise-overlay" />

      <ScrollSpy sections={activeSections} />
          <Navbar />

          <ContactFloatButton/>

      <div className="relative z-10">
        <HeroSection />
        
        <div id="portfolio">
          <PortfolioSection />
        </div>
          <AboutSection/>
          <ContactSection />
      </div>
    </main>
  );
}