"use client";
import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from 'lenis/react';

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  const [activeIndex, setActiveIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    const sections = ["hero", "portfolio", "about", "contact"];
    let cachedOffsets: number[] = [];

    const calculateOffsets = () => {
      cachedOffsets = sections.map((id) => {
        const el = document.getElementById(id);
        if (!el) return 0;
        const originalPos = el.style.position;
        el.style.position = "relative";
        let top = 0;
        let parent: HTMLElement | null = el;
        while (parent) {
          top += parent.offsetTop;
          parent = parent.offsetParent as HTMLElement | null;
        }
        el.style.position = originalPos;
        return top;
      });
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      let currentIdx = 0;
      const offsetMargin = 120;
      for (let i = 0; i < cachedOffsets.length; i++) {
        if (scrollY >= cachedOffsets[i] - offsetMargin) {
          currentIdx = i;
        }
      }
      setActiveIndex(currentIdx);

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const pct = (scrollY / docHeight) * 100;
        setProgressPercent(Math.min(100, Math.max(0, pct)));
      }
    };

    const timeoutId = setTimeout(() => {
      calculateOffsets();
      handleScroll();
    }, 600);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", calculateOffsets, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", calculateOffsets);
    };
  }, []);

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -200,
      opacity: 0,
      duration: 1.2,
      ease: "expo.out",
      delay: 1,
    });
  }, { scope: navRef });

  useGSAP(() => {
    gsap.from(mobileNavRef.current, {
      y: -200,
      opacity: 0,
      duration: 1.2,
      ease: "expo.out",
      delay: 1,
    });
  }, { scope: mobileNavRef });

  const scrollToSection = (id: string) => {
    const targetElement = document.getElementById(id);
    if (!targetElement) return;

    const portfolioTriggers = ScrollTrigger.getAll().filter((st) =>
      st.trigger && (st.trigger as HTMLElement).classList.contains("portfolio-section-container")
    );

    const needsCollapse = id !== "portfolio";

    if (needsCollapse && portfolioTriggers.length > 0) {
      document.body.classList.add("is-nav-scrolling");
      portfolioTriggers.forEach(st => st.disable(false)); 
    }

    const originalPos = targetElement.style.position;
    targetElement.style.position = "relative";
    
    let targetTop = 0;
    let el: HTMLElement | null = targetElement;
    while (el) {
      targetTop += el.offsetTop;
      el = el.offsetParent as HTMLElement | null;
    }
    
    targetElement.style.position = originalPos;
    targetTop = targetTop - 80;

    if (lenis) {
      lenis.scrollTo(targetTop, {
        duration: 1.5,
        easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
        onComplete: () => {
          if (needsCollapse && portfolioTriggers.length > 0) {
            portfolioTriggers.forEach(st => st.enable());
            
            setTimeout(() => {
              document.body.classList.remove("is-nav-scrolling");
            }, 150);
          }
        }
      });
    } else {
      window.scrollTo({ top: targetTop, behavior: "smooth" });
      if (needsCollapse && portfolioTriggers.length > 0) {
        setTimeout(() => {
          portfolioTriggers.forEach(st => st.enable());
          setTimeout(() => {
            document.body.classList.remove("is-nav-scrolling");
          }, 150);
        }, 1600);
      }
    }
  };

  const isHero = activeIndex === 0;
  const isPortfolio = activeIndex === 1;
  const isAbout = activeIndex === 2;
  const isContact = activeIndex === 3;

  const mobileSections = [
    { id: "hero", label: "Home" },
    { id: "portfolio", label: "Portfolio" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <>
      <nav
        ref={navRef}
        className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-[100] items-center gap-8 px-8 py-3 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl"
      >
        <button 
          onClick={() => scrollToSection("hero")} 
          className={`relative transition-all duration-500 text-xs uppercase px-2 py-1 ${
            isHero 
              ? "text-cyan-400 font-semibold tracking-[0.2em] drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]" 
              : "text-white/70 hover:text-white tracking-widest hover:tracking-[0.2em]"
          }`}
        >
          Home
          <span className={`absolute bottom-[-4px] left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_8px_rgba(34,211,238,0.6)] transition-all duration-500 rounded-full ${isHero ? "w-[80%] opacity-100" : "w-0 opacity-0"}`} />
        </button>

        <button 
          onClick={() => scrollToSection("portfolio")} 
          className={`relative transition-all duration-500 text-xs uppercase px-2 py-1 ${
            isPortfolio 
              ? "text-cyan-400 font-semibold tracking-[0.2em] drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]" 
              : "text-white/70 hover:text-white tracking-widest hover:tracking-[0.2em]"
          }`}
        >
          Portfolio
          <span className={`absolute bottom-[-4px] left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_8px_rgba(34,211,238,0.6)] transition-all duration-500 rounded-full ${isPortfolio ? "w-[80%] opacity-100" : "w-0 opacity-0"}`} />
        </button>

        <div className="h-4 w-[1px] bg-white/20" />

        <button 
          onClick={() => scrollToSection("about")} 
          className={`relative transition-all duration-500 text-xs uppercase px-2 py-1 ${
            isAbout 
              ? "text-cyan-400 font-semibold tracking-[0.2em] drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]" 
              : "text-white/70 hover:text-white tracking-widest hover:tracking-[0.2em]"
          }`}
        >
          About Us
          <span className={`absolute bottom-[-4px] left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_8px_rgba(34,211,238,0.6)] transition-all duration-500 rounded-full ${isAbout ? "w-[80%] opacity-100" : "w-0 opacity-0"}`} />
        </button>

        <button 
          onClick={() => scrollToSection("contact")} 
          className={`relative transition-all duration-500 text-xs uppercase px-2 py-1 ${
            isContact 
              ? "text-cyan-400 font-semibold tracking-[0.2em] drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]" 
              : "text-white/70 hover:text-white tracking-widest hover:tracking-[0.2em]"
          }`}
        >
          Contact Us
          <span className={`absolute bottom-[-4px] left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_8px_rgba(34,211,238,0.6)] transition-all duration-500 rounded-full ${isContact ? "w-[80%] opacity-100" : "w-0 opacity-0"}`} />
        </button>
      </nav>
      <nav
        ref={mobileNavRef}
        className="flex md:hidden fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-[360px] items-center justify-between px-5 py-3 rounded-full border border-white/5 bg-black/55 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] select-none"
      >
        {mobileSections.map((sec, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className="relative flex flex-col items-center justify-center focus:outline-none py-1.5 px-3 rounded-full transition-all duration-500"
            >
              <span className={`absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/4 to-purple-500/4 blur-[2px] transition-all duration-500 ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-95"}`} />

              <span className={`absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-12 h-6 bg-gradient-to-t from-cyan-400/25 via-cyan-500/5 to-transparent rounded-full blur-[6px] transition-all duration-500 ${isActive ? "opacity-100 scale-110" : "opacity-0 scale-50"}`} />

              <span className={`relative text-[9px] uppercase tracking-wider transition-all duration-500 font-medium z-10 ${isActive ? "text-cyan-400 font-bold" : "text-white/40"}`}>
                {sec.label}
              </span>
            </button>
          );
        })}

        <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-white/5 rounded-full overflow-hidden pointer-events-none">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </nav>
    </>
  );
}