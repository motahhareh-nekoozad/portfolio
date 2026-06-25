"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface ContactFloatButtonProps {
  onClick?: () => void;
}

export default function ContactFloatButton({ onClick }: ContactFloatButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleHide = () => {
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          x: 120,
          opacity: 0,
          scale: 0.7,
          rotate: -20,
          pointerEvents: "none",
          duration: 0.7,
          ease: "power3.inOut"
        });
      }
    };

    const handleShow = () => {
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          x: 0,
          opacity: 1,
          scale: 1,
          rotate: 0,
          pointerEvents: "auto",
          duration: 0.9,
          ease: "back.out(1.2)"
        });
      }
    };

    window.addEventListener("project-explore", handleHide);
    window.addEventListener("project-back", handleShow);

    return () => {
      window.removeEventListener("project-explore", handleHide);
      window.removeEventListener("project-back", handleShow);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const btn = buttonRef.current;
    const rect = btn.getBoundingClientRect();
    
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btn, {
      x: x * 0.25,
      y: y * 0.25,
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!buttonRef.current) return;

    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)"
    });
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center pointer-events-auto"
    >
      <button
        ref={buttonRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative w-12 h-12 flex items-center justify-center rounded-full bg-[#060608]/95 border border-cyan-500/20 hover:border-cyan-400/40 shadow-[0_8px_24px_rgba(0,0,0,0.7)] cursor-pointer focus:outline-none group transition-colors duration-500"
        aria-label="Contact Us"
      >
        <span className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping pointer-events-none" style={{ animationDuration: "2.5s" }} />
        <span className="absolute inset-0 rounded-full bg-purple-500/10 animate-ping pointer-events-none delay-750" style={{ animationDuration: "3.5s" }} />

        <div 
          className="absolute inset-[-3px] rounded-full border border-dashed border-cyan-400/30 group-hover:border-cyan-400/80 transition-colors duration-500 animate-spin" 
          style={{ animationDuration: isHovered ? "3s" : "10s" }} 
        />
        <div 
          className="absolute inset-[-6px] rounded-full border border-purple-500/20 group-hover:border-purple-500/60 transition-colors duration-500 animate-spin" 
          style={{ animationDuration: isHovered ? "5s" : "14s", animationDirection: "reverse" }} 
        />

        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400/10 to-purple-500/10 opacity-30 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-500 rounded-full pointer-events-none" />

        <div className="relative z-10 transition-all duration-500 group-hover:scale-110">
          <svg
            className="w-5.5 h-5.5 text-white/80 group-hover:text-white transition-colors duration-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.3)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            <path 
              d="M13 8l-3 4h4l-3 4" 
              stroke="#22d3ee" 
              strokeWidth="1.8" 
              fill="none" 
              className="drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
            />
          </svg>
        </div>

        <div className="absolute right-16 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 translate-x-3 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0 flex items-center gap-2">
          <div className="py-2 px-3 rounded-lg border border-purple-500/20 bg-[#060608]/95 backdrop-blur-md flex items-center gap-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.6)] whitespace-nowrap">
            <span className="text-[9px] tracking-wider text-purple-400 font-mono font-semibold">⚡ READY?</span>
            <div className="w-[1px] h-2.5 bg-white/10" />
            <span className="text-[9px] tracking-[0.2em] text-white/90 uppercase font-light">Let's Talk</span>
          </div>
        </div>

        <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,1)] animate-pulse" />
      </button>
    </div>
  );
}