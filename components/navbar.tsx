"use client";
import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from 'lenis/react';

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -200,
      opacity: 0,
      duration: 1.2,
      ease: "expo.out",
      delay: 1,
    });
  }, { scope: navRef });

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

  return (
    <nav
      ref={navRef}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-8 px-8 py-3 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl"
    >
      <button onClick={() => scrollToSection("hero")} className="relative text-white/70 hover:text-white transition-all duration-300 text-xs uppercase tracking-widest hover:tracking-[0.2em] px-2">Home</button>
      <button onClick={() => scrollToSection("portfolio")} className="relative text-white/70 hover:text-white transition-all duration-300 text-xs uppercase tracking-widest hover:tracking-[0.2em] px-2">Portfolio</button>
      <div className="h-4 w-[1px] bg-white/20" />
      <button onClick={() => scrollToSection("about")} className="relative text-white/70 hover:text-white transition-all duration-300 text-xs uppercase tracking-widest hover:tracking-[0.2em] px-2">About Us</button>
      <button onClick={() => scrollToSection("contact")} className="relative text-white/70 hover:text-white transition-all duration-300 text-xs uppercase tracking-widest hover:tracking-[0.2em] px-2">Contact Us</button>
    </nav>
  );
}