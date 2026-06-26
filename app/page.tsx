// app/page.tsx
import HeroSection from '@/components/sections/hero';
import { PortfolioSection } from "@/components/sections/portfolio";
import Navbar from "@/components/navbar";
import CustomCursor from '@/hooks/custom-cursor';
import ScrollSpy from '@/components/scroll-spy';
import ContactSection from '@/components/sections/contactus';
import AboutSection from '@/components/sections/aboutus';
import ContactFloatButton from '@/components/contact-float-button';

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
      <CustomCursor /> 
      
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