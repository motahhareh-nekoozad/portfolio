"use client";
import React, { useRef, useState } from "react";
import { Project } from "./types";

interface GalleryPaneProps {
  project: Project;
}

export const GalleryPane = React.memo(({ project }: GalleryPaneProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const displayImages = [
    project.gallery?.[0] || project.img,
    project.gallery?.[1] || project.img,
    project.gallery?.[2] || project.img,
    project.gallery?.[3] || project.gallery?.[2] || project.img,
  ];

  const handleSliderScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) return;
    
    const absScroll = Math.abs(scrollLeft);
    const percentage = absScroll / maxScroll;
    const calculatedIndex = Math.min(
      displayImages.length - 1,
      Math.max(0, Math.round(percentage * (displayImages.length - 1)))
    );
    
    if (calculatedIndex !== activeIdx) {
      setActiveIdx(calculatedIndex);
    }
  };

  return (
    <div className="w-full lg:w-[62%] h-auto lg:h-full flex flex-col items-center justify-center bg-[#010101]/95 relative z-10 p-6 lg:p-12 pb-24 lg:pb-12">
      
      {/* اسلایدر حالت موبایل */}
      <div className="lg:hidden w-full flex flex-col gap-6 relative z-10 mobile-slider-container">
        <div 
          ref={sliderRef}
          onScroll={handleSliderScroll}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-[10vw] py-8 w-full"
        >
          {displayImages.map((imgSrc, idx) => {
            const isActive = idx === activeIdx;
            const rotationY = !isActive ? (idx < activeIdx ? "15deg" : "-15deg") : "0deg";
            const translateZ = !isActive ? "-40px" : "0px";

            return (
              <a 
                key={idx}
                href={project.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`puzzle-piece piece-${idx} snap-center shrink-0 w-[78vw] aspect-[4/3] rounded-2xl overflow-hidden border transition-all duration-500 ease-out bg-neutral-950/40 backdrop-blur-md relative will-change-transform block group cursor-pointer`}
                style={{
                  transform: `perspective(1000px) rotateY(${rotationY}) translateZ(${translateZ}) scale(${isActive ? 1 : 0.91})`,
                  opacity: isActive ? 1 : 0.35,
                  borderColor: isActive ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.03)",
                  boxShadow: isActive ? `0 15px 40px -15px ${project.accent}60` : "none"
                }}
              >
                {isActive && (
                  <div className="absolute inset-2 pointer-events-none z-30 animate-hud-lock">
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: project.accent }} />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: project.accent }} />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: project.accent }} />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: project.accent }} />
                  </div>
                )}

                <div className="scanline z-20 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent z-10 opacity-70" />
                
                <img 
                  src={imgSrc} 
                  className={`w-full h-full object-cover transition-all duration-700 ${isActive ? "scale-100 brightness-[0.85]" : "scale-[1.05] brightness-[0.5] filter blur-[1px]"}`}
                  alt={`${project.title} slide ${idx + 1}`} 
                  loading="lazy" 
                />
              </a>
            );
          })}
        </div>
        
        {/* نقاط اندیکاتور اسلایدر موبایل */}
        <div className="flex justify-center items-center gap-2 mt-[-10px]">
          {displayImages.map((_, idx) => (
            <div 
              key={idx} 
              className="h-[3px] rounded-full transition-all duration-500 ease-out" 
              style={{ 
                width: idx === activeIdx ? '32px' : '6px', 
                backgroundColor: idx === activeIdx ? project.accent : 'rgba(255,255,255,0.12)',
                boxShadow: idx === activeIdx ? `0 0 8px ${project.accent}` : "none"
              }} 
            />
          ))}
        </div>
      </div>

      {/* شبکه دسکتاپ (Puzzle Pieces) */}
      <div className="hidden lg:grid grid-cols-2 gap-5 w-full max-w-3xl aspect-[16/11] relative z-10">
        {displayImages.map((imgSrc, idx) => (
          <div 
            key={idx} 
            className={`puzzle-piece piece-${idx} rounded-xl overflow-hidden border border-white/5 bg-neutral-950/40 backdrop-blur-md group relative will-change-transform aspect-video cursor-pointer`}
          >
            <a href={project.link || "#"} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative">
              <div className="scanline z-20 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10 opacity-70 group-hover:opacity-30 transition-opacity duration-500" />
              <img 
                src={imgSrc} 
                className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-all duration-[1.2s] ease-out filter brightness-[0.75] group-hover:brightness-100" 
                alt={`${project.title} puzzle ${idx + 1}`} 
                loading="lazy" 
              />
            </a>
          </div>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes hudLock {
          0% {
            opacity: 0;
            transform: scale(1.18);
          }
          100% {
            opacity: 0.85;
            transform: scale(1);
          }
        }
        .animate-hud-lock {
          animation: hudLock 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
        .scanline {
          width: 100%;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--accent-glow), transparent);
          position: absolute;
          top: 0;
          animation: scan 5s linear infinite;
        }
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { top: 100%; opacity: 0; }
        }
        @media (max-width: 1024px) {
          .mobile-slider-container {
            perspective: 1000px;
          }
        }
      `}</style>
    </div>
  );
});

GalleryPane.displayName = "GalleryPane";