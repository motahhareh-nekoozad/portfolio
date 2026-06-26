// components/Preloader.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isTransitionActive, setIsTransitionActive] = useState(false);

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      const increment = progress < 75 ? Math.floor(Math.random() * 8) + 4 : Math.floor(Math.random() * 3) + 1;
      progress = Math.min(progress + increment, 100);
      setLoadingProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 50);

    const handleLoad = () => {
      progress = 100;
      setLoadingProgress(100);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  useGSAP(() => {
    if (loadingProgress < 100) return;

    setIsTransitionActive(true);

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      }
    });

    tl.to(".loader-hud", {
      scale: 0.8,
      opacity: 0,
      filter: "blur(10px)",
      duration: 0.6,
      ease: "power3.in"
    });

    tl.to(".loader-grid-line", {
      scaleX: 0,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.inOut"
    }, "-=0.4");

    tl.to(preloaderRef.current, {
      clipPath: "circle(0% at 50% 50%)",
      duration: 1.4,
      ease: "power4.inOut",
      pointerEvents: "none"
    }, "-=0.3");

    tl.fromTo([".layout-navbar", ".layout-btn"], 
      { autoAlpha: 0, y: -15 },
      { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.1, ease: "power2.out" },
      "-=1.1"
    );

    tl.fromTo(".reveal-item", 
      { autoAlpha: 0, scale: 0.94, y: 15 },
      { autoAlpha: 1, scale: 1, y: 0, duration: 1.2, stagger: 0.15, ease: "power3.out", force3D: true },
      "-=1.0"
    );

  }, { scope: preloaderRef, dependencies: [loadingProgress] });

  return (
    <div
      ref={preloaderRef}
      style={{ clipPath: "circle(100% at 50% 50%)" }}
      className="fixed inset-0 w-full h-full bg-[#050508] z-[9999] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="loader-grid-line absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      <div className="loader-grid-line absolute top-2/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/10 to-transparent" />
      <div className="loader-grid-line absolute top-3/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      <div className="absolute w-full h-1/3 bg-gradient-to-b from-transparent via-cyan-500/[0.02] to-transparent scanner-bar" />

      <div className="loader-hud flex flex-col items-center justify-center relative z-10 select-none">
        <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
          <svg className="w-full h-full rotate-180" viewBox="0 0 100 100">
            <polygon points="50,15 90,85 10,85" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
            <polygon 
              points="50,15 90,85 10,85" 
              fill="none" 
              stroke="url(#triangleGradient)" 
              strokeWidth="2" 
              strokeDasharray="240"
              strokeDashoffset={240 - (240 * loadingProgress) / 100}
              className="transition-all duration-300 ease-out"
            />
            <defs>
              <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute top-[10px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#38bdf8] animate-pulse" />
          <span className="absolute bottom-[10px] left-[6px] w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_#c084fc] animate-pulse" />
          <span className="absolute bottom-[10px] right-[6px] w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#38bdf8] animate-pulse" />
        </div>

        <div className="text-center font-mono">
          <span className="text-4xl md:text-5xl font-extralight tracking-widest text-white/95">
            {String(loadingProgress).padStart(3, "0")}
          </span>
          <span className="text-xs text-cyan-400/80 tracking-[0.2em] ml-1">%</span>
        </div>

        <div className="h-4 mt-4 overflow-hidden text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 animate-pulse">
            {loadingProgress < 30 && "Establishing Tri-Node Core..."}
            {loadingProgress >= 30 && loadingProgress < 65 && "Calibrating Quantum Coordinates..."}
            {loadingProgress >= 65 && loadingProgress < 90 && "Structuring Digital Dimensions..."}
            {loadingProgress >= 90 && "Synchronizing Unfolding..."}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        .scanner-bar {
          animation: scan 4s linear infinite;
        }
      `}</style>
    </div>
  );
}