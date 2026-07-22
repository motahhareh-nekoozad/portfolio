"use client";
import React from "react";
import { Project } from "@/types/type";
import { CircuitBackground } from "./circuit-background";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface DesktopCardProps {
  project: Project;
  index: number;
  onExplore: (project: Project, cardIndex: number, e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const DesktopCard = React.memo(({ project, index, onExplore }: DesktopCardProps) => {
  return (
    <div 
      className="desktop-card absolute inset-0 h-screen w-full flex overflow-hidden bg-gradient-to-b from-transparent to-[#030303] will-change-transform" 
      style={{ zIndex: (index + 1) * 10, '--accent-color': project.accent } as React.CSSProperties}
    >
      <CircuitBackground />

      <div className="grid grid-cols-12 w-full h-full relative z-10 px-20 xl:px-32 items-center">
        <div className="info-inner col-span-6 flex flex-col justify-center relative pr-12 border-r border-white/5">
          <span className="text-[18rem] font-black text-white/[0.01] absolute -top-36 right-0 leading-none select-none italic font-mono">{project.id}</span>
          
          <h2 className="text-7xl xl:text-8xl font-black text-white leading-none tracking-tighter mb-6 shine-effect select-none">
            {project.title}
          </h2>
          
          <p className="text-white/60 text-lg xl:text-xl font-light max-w-lg mb-10 leading-relaxed text-justify">
            {project.desc}
          </p>

          <button 
            onClick={(e) => onExplore(project, index, e)}
            className="unique-btn group relative" 
            style={{ '--accent-color': project.accent } as React.CSSProperties}
          >
            <span className="btn-content">
              EXPLORE PROJECT
              <svg className="w-5 h-5 mr-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </button>
        </div>

        <div className="col-span-6 flex items-center justify-end p-6 perspective-1000 relative">
          <div className="img-portal relative w-[80%] aspect-[4/5] group transition-all duration-700 ease-out layer-optimized mt-16">
             
             <div className="lamp-container absolute top-0 left-0 w-full h-[50%] pointer-events-none z-20 flex flex-col items-center opacity-0 rounded-t-[2.5rem] overflow-hidden">
                <div className="lamp-emitter w-full h-[3px] transition-all duration-300" 
                     style={{ 
                       backgroundColor: "#ffffff", 
                       boxShadow: `0 1px 15px 3px ${project.accent}, 0 2px 30px 6px ${project.accent}, inset 0 0 1px #fff` 
                     }} 
                />
                <div className="light-cone absolute top-0 left-0 w-full h-full origin-top opacity-0" 
                     style={{ 
                       background: `linear-gradient(to bottom, ${project.accent}33 0%, ${project.accent}05 40%, transparent 100%)`,
                       mixBlendMode: 'screen'
                     }} 
                />
             </div>

             <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-transparent">
                <OptimizedImage
                  src={project.img}
                  alt={project.title}
                  priority={index === 0}
                  sizes="(max-width: 1280px) 50vw, 600px"
                  className="object-cover scale-105 group-hover:scale-100 group-hover:rotate-1 transition-all duration-[1.5s] ease-out brightness-[0.7] group-hover:brightness-100 project-img"
                />
                <div className="image-glow-overlay absolute inset-0 pointer-events-none opacity-0"
                     style={{
                       background: `linear-gradient(to bottom, #ffffff11 0%, ${project.accent}55 12%, ${project.accent}0a 35%, transparent 60%)`,
                       mixBlendMode: 'color-dodge'
                     }}
                />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
});
DesktopCard.displayName = "DesktopCard";