"use client";
import React from "react";
import { Project } from "@/types/type";

interface TechGridBgProps {
  project: Project;
}

export const TechGridBg = React.memo(({ project }: TechGridBgProps) => {
  return (
    <div className="tech-grid-bg absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000">
      <div className="absolute inset-0 tech-grid opacity-[0.03]" />
      
      <div className="absolute inset-0 lg:hidden overflow-hidden pointer-events-none opacity-40">
        <div className="mobile-cyber-particle particle-1" style={{ backgroundColor: project.accent }} />
        <div className="mobile-cyber-particle particle-2" />
        <div className="mobile-cyber-particle particle-3" style={{ backgroundColor: project.accent }} />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.15] hidden lg:block">
        <div className="grid-streak streak-v-1" />
        <div className="grid-streak streak-v-2" />
        <div className="grid-streak streak-v-3" />
        <div className="grid-streak streak-h-1" />
        <div className="grid-streak streak-h-2" />
      </div>

      <div className="hud-radar absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.12] pointer-events-none">
        <div className="radar-circle" style={{ transform: "scale(0.35)" }}>
          <div className="radar-inner-ring clockwise" />
        </div>
        <div className="radar-circle" style={{ transform: "scale(0.65)" }}>
          <div className="radar-inner-ring counter-clockwise" />
        </div>
        <div className="radar-circle" style={{ transform: "scale(0.95)" }}>
          <div className="radar-inner-ring clockwise opacity-50" />
        </div>
        <div className="radar-crosshair" />
      </div>

      <div 
        className="absolute top-1/2 left-1/3 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full filter blur-[150px] opacity-[0.08]"
        style={{ backgroundColor: project.accent }}
      />
      
      <style jsx>{`
        .mobile-cyber-particle {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.4);
          will-change: transform;
        }
        .particle-1 {
          top: 20%;
          left: 15%;
          animation: floatParticle1 12s linear infinite;
        }
        .particle-2 {
          top: 60%;
          left: 80%;
          animation: floatParticle2 16s linear infinite;
        }
        .particle-3 {
          top: 85%;
          left: 30%;
          animation: floatParticle1 14s linear infinite;
          animation-delay: -3s;
        }

        @keyframes floatParticle1 {
          0% { transform: translate3d(0, 0, 0); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translate3d(20px, -80px, 0); opacity: 0; }
        }
        @keyframes floatParticle2 {
          0% { transform: translate3d(0, 0, 0); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translate3d(-30px, -110px, 0); opacity: 0; }
        }

        .tech-grid {
          background-size: 30px 30px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
        }

        .grid-streak {
          position: absolute;
          will-change: transform, opacity;
        }
        
        @media (min-width: 1025px) {
          .streak-v-1 {
            top: 0;
            left: 15%;
            width: 1px;
            height: 100%;
            background: linear-gradient(to bottom, transparent, var(--accent-glow), transparent);
            animation: streakVertical 7.3s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          }
          .streak-v-2 {
            top: 0;
            left: 48%;
            width: 1px;
            height: 100%;
            background: linear-gradient(to bottom, transparent, #ffffff, transparent);
            opacity: 0.6;
            animation: streakVertical 11.1s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
            animation-delay: 2.5s;
          }
          .streak-v-3 {
            top: 0;
            left: 82%;
            width: 1px;
            height: 100%;
            background: linear-gradient(to bottom, transparent, var(--accent-glow), transparent);
            animation: streakVertical 13.7s cubic-bezier(0.2, 0.6, 0.4, 1) infinite;
            animation-delay: 5.1s;
          }
          .streak-h-1 {
            left: 0;
            top: 25%;
            width: 100%;
            height: 1px;
            background: linear-gradient(to right, transparent, var(--accent-glow), transparent);
            animation: streakHorizontal 9.4s cubic-bezier(0.3, 1, 0.7, 1) infinite;
            animation-delay: 1.2s;
          }
          .streak-h-2 {
            left: 0;
            top: 68%;
            width: 100%;
            height: 1px;
            background: linear-gradient(to right, transparent, #ffffff, transparent);
            opacity: 0.6;
            animation: streakHorizontal 15.2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
            animation-delay: 4.8s;
          }
        }

        @keyframes streakVertical {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        @keyframes streakHorizontal {
          0% { transform: translateX(-100%); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateX(100%); opacity: 0; }
        }

        .hud-radar {
          transform-style: preserve-3d;
          perspective: 1000px;
        }
        .radar-circle {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .radar-inner-ring {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 1px dashed var(--accent-glow);
          opacity: 0.12;
          will-change: transform;
        }
        .radar-inner-ring.clockwise {
          animation: rotateClockwise 35s linear infinite;
        }
        .radar-inner-ring.counter-clockwise {
          animation: rotateCounterClockwise 45s linear infinite;
          border-style: dotted;
          border-width: 1.5px;
        }
        .radar-crosshair {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 0.05;
        }
        .radar-crosshair::before, .radar-crosshair::after {
          content: '';
          position: absolute;
          background: var(--accent-glow);
        }
        .radar-crosshair::before {
          top: 50%;
          left: 0;
          width: 100%;
          height: 1px;
        }
        .radar-crosshair::after {
          left: 50%;
          top: 0;
          width: 1px;
          height: 100%;
        }
        @keyframes rotateClockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes rotateCounterClockwise {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @media (max-width: 1024px) {
          .hud-radar {
            display: none !important;
          }
          .grid-streak {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
});

TechGridBg.displayName = "TechGridBg";