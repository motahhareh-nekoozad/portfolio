"use client";
import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from 'lenis/react';

interface Section {
  id: string;
  label: string;
}

interface ScrollSpyProps {
  sections?: Section[];
}

const defaultSections: Section[] = [
  { id: "hero", label: "Home" },
  { id: "portfolio", label: "Portfolio" }, 
  { id: "contact", label: "Contact Us" }, 
];

export default function ScrollSpy({ sections = defaultSections }: ScrollSpyProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -20% 0px",
      threshold: 0.1,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sections.findIndex((sec) => sec.id === entry.target.id);
          if (index !== -1) setActiveIndex(index);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    sections.forEach((sec) => {
      const element = document.getElementById(sec.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    if (indicatorRef.current && containerRef.current) {
      const buttons = containerRef.current.querySelectorAll(".scrollspy-dot-btn");
      const activeBtn = buttons[activeIndex] as HTMLElement;
      
      if (activeBtn) {
        const btnCenterY = activeBtn.offsetTop + (activeBtn.offsetHeight / 2);
        const targetY = btnCenterY - (indicatorRef.current.offsetHeight / 2);
        
        gsap.to(indicatorRef.current, {
          y: targetY,
          duration: 0.7,
          ease: "elastic.out(1, 0.75)", 
        });
      }
    }
  }, [activeIndex]);

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

    const targetTop = targetElement.getBoundingClientRect().top + window.scrollY - 80;

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

  const progressPercent = sections.length > 1 ? (activeIndex / (sections.length - 1)) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="fixed right-6 md:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center py-7 px-4 rounded-3xl border border-white/10 bg-[#060608]/40 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] select-none group/panel hover:border-purple-500/20 transition-colors duration-500"
    >
      <div className="relative flex flex-col gap-8 items-center">
        <div className="absolute w-[2px] h-[calc(100%-16px)] bg-white/5 top-2 left-1/2 -translate-x-1/2 pointer-events-none overflow-hidden rounded-full fiber-track" />
        <div
          className="absolute w-[2px] bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-500 top-2 left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-700 ease-out shadow-[0_0_8px_rgba(168,85,247,0.5)]"
          style={{ height: `${progressPercent}%`, maxHeight: "calc(100% - 16px)" }}
        />
        <div
          ref={indicatorRef}
          className="absolute w-10 h-10 -left-3 flex items-center justify-center pointer-events-none"
        >
           <div className="absolute inset-0 rounded-full border border-cyan-400/40 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.2)]" />
           <div className="absolute w-[80%] h-[80%] rounded-full border-t-2 border-b-2 border-purple-500/60 rotate-45 animate-spin" style={{ animationDuration: '8s' }} />
           <div className="absolute w-[80%] h-[80%] rounded-full border-l-2 border-r-2 border-cyan-400/60 -rotate-45 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
        </div>

        {sections.map((sec, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className="scrollspy-dot-btn group/btn relative w-4 h-4 flex items-center justify-center focus:outline-none cursor-pointer z-10"
              aria-label={`Go to ${sec.label}`}
            >
              <span className={`rounded-full transition-all duration-500 ${isActive ? "w-3 h-3 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)] border border-white/50" : "w-1.5 h-1.5 bg-white/25 group-hover/btn:bg-white/80 group-hover/btn:scale-125"}`} />
              <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 translate-x-4 transition-all duration-300 ease-out group-hover/btn:opacity-100 group-hover/btn:translate-x-0 flex items-center gap-2">
                <div className="py-2 px-3.5 rounded-lg border border-cyan-500/20 bg-[#060608]/90 backdrop-blur-md flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] whitespace-nowrap">
                   <span className="text-[10px] tracking-wider text-cyan-400 font-mono font-semibold">0{index + 1}</span>
                   <div className="w-[1px] h-3 bg-white/10" />
                   <span className="text-[10px] tracking-[0.2em] text-white/90 uppercase font-light">{sec.label}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <style jsx>{`
        @keyframes fiberPulse { 0% { top: -30%; } 100% { top: 130%; } }
        .fiber-track::after { content: ''; position: absolute; width: 2px; height: 40px; left: 0; background: linear-gradient(to bottom, transparent, #38bdf8, #a855f7, transparent); animation: fiberPulse 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite; }
      `}</style>
    </div>
  );
}