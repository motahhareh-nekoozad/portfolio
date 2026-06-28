"use client";
import React from "react";

export const CircuitBackground = React.memo(() => {
  return (
    <div className="circuit-bg-container absolute inset-0 w-full h-full opacity-35 pointer-events-none transition-opacity duration-1000 layer-optimized">
      <svg className="w-full h-full" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 150H300L450 300H900L1000 200H1500L1580 280H1920" stroke="rgba(255,255,255,0.02)" strokeWidth="1.5" />
        <path d="M1920 850H1600L1450 700H1100L950 850H400L300 750H0" stroke="rgba(255,255,255,0.02)" strokeWidth="1.5" />
        <path d="M500 0V400L650 550V1080" stroke="rgba(255,255,255,0.01)" strokeWidth="1" />
        <path d="M1400 1080V680L1250 530V0" stroke="rgba(255,255,255,0.01)" strokeWidth="1" />
        
        <path d="M0 450H200L320 570H750L820 500H1300L1420 620H1920" stroke="rgba(255,255,255,0.02)" strokeWidth="1.2" />
        <path d="M150 1080V800L280 670H600L700 770V1080" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
        <path d="M1750 0V350L1600 500H1150L1050 400V0" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
        <path d="M960 0V250L900 310H450" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />

        <path className="pulse-line path-long" d="M0 150H300L450 300H900L1000 200H1500L1580 280H1920" stroke="var(--accent-color)" strokeWidth="2.5" strokeLinecap="round" />
        <path className="pulse-line path-long delay-1" d="M1920 850H1600L1450 700H1100L950 850H400L300 750H0" stroke="var(--accent-color)" strokeWidth="2.5" strokeLinecap="round" />
        <path className="pulse-line path-vert delay-2" d="M500 0V400L650 550V1080" stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" />
        <path className="pulse-line path-vert delay-3" d="M1400 1080V680L1250 530V0" stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" />
        
        <path className="pulse-line path-mid delay-4" d="M0 450H200L320 570H750L820 500H1300L1420 620H1920" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" />
        <path className="pulse-line path-vert delay-5" d="M150 1080V800L280 670H600L700 770V1080" stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" />
        <path className="pulse-line path-mid delay-6" d="M1750 0V350L1600 500H1150L1050 400V0" stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" />

        <circle cx="300" cy="150" r="4" fill="var(--accent-color)" className="circuit-dot" />
        <circle cx="450" cy="300" r="4" fill="var(--accent-color)" className="circuit-dot" />
        <circle cx="1000" cy="200" r="4" fill="var(--accent-color)" className="circuit-dot" />
        <circle cx="1450" cy="700" r="4" fill="var(--accent-color)" className="circuit-dot" />
        <circle cx="400" cy="850" r="4" fill="var(--accent-color)" className="circuit-dot" />
        <circle cx="200" cy="450" r="3.5" fill="var(--accent-color)" className="circuit-dot dot-delay" />
        <circle cx="320" cy="570" r="3.5" fill="var(--accent-color)" className="circuit-dot" />
        <circle cx="820" cy="500" r="3.5" fill="var(--accent-color)" className="circuit-dot dot-delay" />
        <circle cx="1420" cy="620" r="3.5" fill="var(--accent-color)" className="circuit-dot" />
        <circle cx="280" cy="670" r="3" fill="var(--accent-color)" className="circuit-dot dot-delay" />
        <circle cx="1600" cy="500" r="3" fill="var(--accent-color)" className="circuit-dot" />
      </svg>
    </div>
  );
});
CircuitBackground.displayName = "CircuitBackground";