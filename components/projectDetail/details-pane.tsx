"use client";
import React from "react";
import { Project } from "@/types/type";

interface DetailsPaneProps {
  project: Project;
}

export const DetailsPane = React.memo(({ project }: DetailsPaneProps) => {
  return (
    <div className="w-full lg:w-[38%] min-h-screen flex flex-col justify-center pr-8 lg:pr-28 pl-8 lg:pl-16 pb-12 lg:py-24 relative z-10 bg-[#050505]/40 backdrop-blur-md border-l border-white/5 overflow-hidden">
      
      <div 
        className="absolute lg:hidden top-[15%] right-[-60px] w-[260px] h-[260px] rounded-full filter blur-[100px] pointer-events-none z-0"
        style={{ 
          background: `radial-gradient(circle, ${project.accent} 0%, transparent 70%)`,
          animation: "mobilePulseGlow 8s ease-in-out infinite",
          willChange: "opacity, transform"
        }}
      />

      <div className="info-grid-bg">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="24%" y1="0" x2="24%" y2="100%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1="48%" y1="0" x2="48%" y2="100%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1="72%" y1="0" x2="72%" y2="100%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1="0" y1="24%" x2="100%" y2="24%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1="0" y1="48%" x2="100%" y2="48%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1="0" y1="72%" x2="100%" y2="72%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

          <line x1="12%" y1="0" x2="12%" y2="100%" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <line x1="36%" y1="0" x2="36%" y2="100%" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <line x1="60%" y1="0" x2="60%" y2="100%" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <line x1="84%" y1="0" x2="84%" y2="100%" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <line x1="94%" y1="0" x2="94%" y2="100%" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

          <line x1="0" y1="12%" x2="100%" y2="12%" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <line x1="0" y1="36%" x2="100%" y2="36%" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <line x1="0" y1="60%" x2="100%" y2="60%" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <line x1="0" y1="84%" x2="100%" y2="84%" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <line x1="0" y1="94%" x2="100%" y2="94%" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

          <line x1="24%" y1="0" x2="24%" y2="100%" stroke="var(--accent-glow)" strokeWidth="1.5" className="info-runner-v-1" />
          <line x1="48%" y1="0" x2="48%" y2="100%" stroke="var(--accent-glow)" strokeWidth="1.5" className="info-runner-v-2" />
          <line x1="72%" y1="0" x2="72%" y2="100%" stroke="var(--accent-glow)" strokeWidth="1.5" className="info-runner-v-3" />
          <line x1="84%" y1="0" x2="84%" y2="100%" stroke="var(--accent-glow)" strokeWidth="1.5" className="info-runner-v-4" />
          
          <line x1="0" y1="24%" x2="100%" y2="24%" stroke="var(--accent-glow)" strokeWidth="1.5" className="info-runner-h-1" />
          <line x1="0" y1="48%" x2="100%" y2="48%" stroke="var(--accent-glow)" strokeWidth="1.5" className="info-runner-h-2" />
          <line x1="0" y1="60%" x2="100%" y2="60%" stroke="var(--accent-glow)" strokeWidth="1.5" className="info-runner-h-3" />
          <line x1="0" y1="84%" x2="100%" y2="84%" stroke="var(--accent-glow)" strokeWidth="1.5" className="info-runner-h-4" />
        </svg>
      </div>

      <div className="space-y-8 relative z-10">
        <div className="flex items-center gap-4 detail-meta-item">
          <span className="text-[10px] font-mono px-3 py-1 border border-white/10 rounded-md tracking-wider bg-white/[0.02]" style={{ color: project.accent }}>
            [ FILE // {project.id} ]
          </span>
          {/* <span className="text-[10px] text-white/40 font-mono">[ DIRECTORY_ACTIVE ]</span> */}
        </div>

        <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-none detail-title" style={{ textShadow: `0 0 45px ${project.accent}20` }}>
          {project.title}
        </h1>

        <div className="space-y-2 detail-meta-item">
          <div className="flex justify-between text-[10px] font-mono text-white/40">
            <span>DECRYPTING DATA CORE...</span>
            <span>70%</span>
          </div>
          <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden relative">
            <div className="hud-accent-bar h-full absolute left-0 top-0 rounded-full" style={{ backgroundColor: project.accent }} />
          </div>
        </div>

        <p className="text-white/60 text-sm leading-relaxed text-justify max-w-sm detail-desc">
          {project.desc}
        </p>

        <div className="relative p-6 border border-white/5 bg-white/[0.01] backdrop-blur-md rounded-2xl detail-meta-item">
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l" style={{ borderColor: project.accent }} />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r" style={{ borderColor: project.accent }} />
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r" style={{ borderColor: project.accent }} />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l" style={{ borderColor: project.accent }} />

          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/40 font-mono">CLIENT // کارفرما</span>
              <span className="font-semibold">آژانس تکنولوژی نکسوس</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/40 font-mono">ROLE // نقش در پروژه</span>
              <span className="font-semibold">طراح ارشد تعاملی</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/40 font-mono">TECH // تکنولوژی‌ها</span>
              <span className="font-semibold text-[10px] font-mono bg-white/5 px-2 py-1 rounded" style={{ color: project.accent }}>
                R3F / GSAP / NextJS
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .info-grid-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-color: rgba(4, 4, 4, 0.45);
          overflow: hidden;
        }

        .info-runner-v-1,
        .info-runner-v-2,
        .info-runner-v-3,
        .info-runner-v-4,
        .info-runner-h-1,
        .info-runner-h-2,
        .info-runner-h-3,
        .info-runner-h-4 {
          vector-effect: non-scaling-stroke;
          will-change: stroke-dashoffset, opacity;
          opacity: 0;
        }

        .info-runner-v-1 {
          stroke-dasharray: 20 1000;
          animation: sweepRunnerForward 5s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          animation-delay: 1.2s;
        }
        .info-runner-v-2 {
          stroke-dasharray: 28 1000;
          animation: sweepRunnerReverse 7s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          animation-delay: 3.2s;
        }
        .info-runner-v-3 {
          stroke-dasharray: 18 1000;
          animation: sweepRunnerForward 5.8s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          animation-delay: 0.4s;
        }
        .info-runner-v-4 {
          stroke-dasharray: 32 1000;
          animation: sweepRunnerReverse 8.2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          animation-delay: 4.8s;
        }

        .info-runner-h-1 {
          stroke-dasharray: 30 1200;
          animation: sweepRunnerForward 5.5s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          animation-delay: 1.8s;
        }
        .info-runner-h-2 {
          stroke-dasharray: 22 1200;
          animation: sweepRunnerReverse 7.2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          animation-delay: 0.2s;
        }
        .info-runner-h-3 {
          stroke-dasharray: 35 1200;
          animation: sweepRunnerForward 6.4s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          animation-delay: 3.8s;
        }
        .info-runner-h-4 {
          stroke-dasharray: 18 1200;
          animation: sweepRunnerReverse 8.8s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          animation-delay: 1.5s;
        }

        @keyframes sweepRunnerForward {
          0% { stroke-dashoffset: 1200; opacity: 0; }
          10% { opacity: 0.95; }
          90% { opacity: 0.95; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }

        @keyframes sweepRunnerReverse {
          0% { stroke-dashoffset: -1200; opacity: 0; }
          10% { opacity: 0.95; }
          90% { opacity: 0.95; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }

        .hud-accent-bar {
          box-shadow: 0 0 10px var(--accent-glow);
        }

        @keyframes mobilePulseGlow {
          0%, 100% { opacity: 0.12; transform: scale(0.9) translate3d(0, 0, 0); }
          50% { opacity: 0.22; transform: scale(1.15) translate3d(10px, -10px, 0); }
        }
      `}</style>
    </div>
  );
});

DetailsPane.displayName = "DetailsPane";