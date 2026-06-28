"use client";
import React from "react";
import { Project } from "@/types/type";

interface MobileCardProps {
  project: Project;
  index: number;
  onExplore: (project: Project, cardIndex: number, e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const MobileCard = React.memo(({ project, index, onExplore }: MobileCardProps) => {
  return (
    <div 
      className="mobile-card w-[85vw] sm:w-[65vw] h-[80vh] shrink-0 rounded-[2rem] overflow-hidden border border-white/10 relative flex flex-col justify-between p-6 bg-gradient-to-b from-[#050508] to-[#010102] select-none"
      style={{ 
        '--accent-color': project.accent,
        contentVisibility: 'auto'
      } as React.CSSProperties}
    >
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-grid-pattern" />
      
      <div 
        className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[80px] pointer-events-none opacity-25"
        style={{ backgroundColor: project.accent }}
      />

      <div className="flex justify-between items-center z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: project.accent }} />
          <span className="text-[9px] font-mono text-white/30 tracking-wider">PROJECTED</span>
        </div>
      </div>

      <div className="flex-1 my-3 flex items-center justify-center perspective-1000 w-full">
        <div 
          className="img-portal relative w-full aspect-[4/5] rounded-2xl overflow-hidden group border border-white/5 transition-transform duration-300 ease-out will-change-transform"
          style={{
            boxShadow: `0 15px 35px -10px rgba(0,0,0,0.85), 0 0 15px -3px ${project.accent}20`
          }}
        >
           <div className="lamp-container absolute top-0 left-0 w-full h-[50%] pointer-events-none z-20 flex flex-col items-center opacity-0 rounded-t-2xl overflow-hidden">
              <div className="lamp-emitter w-full h-[2.5px]" 
                   style={{ 
                     backgroundColor: "#ffffff", 
                     boxShadow: `0 1px 12px 2.5px ${project.accent}, 0 2px 24px 5px ${project.accent}, inset 0 0 1px #fff` 
                   }} 
              />
              <div className="light-cone absolute top-0 left-0 w-full h-full origin-top opacity-0" 
                   style={{ 
                     background: `linear-gradient(to bottom, ${project.accent}33 0%, ${project.accent}05 40%, transparent 100%)`,
                     mixBlendMode: 'screen'
                   }} 
              />
           </div>

           <div className="relative w-full h-full rounded-2xl overflow-hidden bg-transparent">
              <img 
                src={project.img} 
                className="w-full h-full object-cover scale-105 project-img brightness-[0.7] transition-[transform,filter] duration-500 ease-out" 
                alt={project.title} 
              />
              <div className="image-glow-overlay absolute inset-0 pointer-events-none opacity-0"
                   style={{
                     background: `linear-gradient(to bottom, #ffffff11 0%, ${project.accent}44 12%, ${project.accent}08 35%, transparent 60%)`,
                     mixBlendMode: 'color-dodge'
                   }}
              />
           </div>
        </div>
      </div>

      <div className="mobile-info-inner flex flex-col gap-2.5 z-10 text-right will-change-transform" dir="rtl">
        <h3 className="text-3xl font-black text-white leading-none tracking-tight shine-effect">
          {project.title}
        </h3>
        
        <p className="text-white/50 text-xs font-light leading-relaxed text-justify line-clamp-3">
          {project.desc}
        </p>

        <button 
          onClick={(e) => onExplore(project, index, e)}
          className="unique-btn group relative w-[90%] self-center mt-2.5" 
          dir="ltr"
          style={{ '--accent-color': project.accent } as React.CSSProperties}
        >
          <span className="btn-content w-full py-3.5 text-[10px] tracking-widest font-mono font-bold flex justify-center items-center gap-2">
            EXPLORE PROJECT
            <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
});
MobileCard.displayName = "MobileCard";