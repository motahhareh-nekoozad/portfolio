// components/Navbar.tsx
"use client";
import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -100,
      opacity: 0,
      duration: 1.2,
      ease: "expo.out",
      delay: 1 
    });
  }, { scope: navRef });

  return (
    <nav 
      ref={navRef}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-8 px-8 py-3 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl"
    >
      <a href="#home" className="text-white/70 hover:text-white transition-colors text-xs uppercase tracking-widest">Home</a>
      <a href="#portfolio" className="text-white/70 hover:text-white transition-colors text-xs uppercase tracking-widest">Work</a>
      <div className="h-4 w-[1px] bg-white/20" />
      <a href="#contact" className="text-white/70 hover:text-white transition-colors text-xs uppercase tracking-widest">Contact</a>
    </nav>
  );
}