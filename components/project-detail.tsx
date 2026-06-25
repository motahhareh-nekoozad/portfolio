"use client";
import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface Project {
  id: string;
  title: string;
  color: string;
  accent: string;
  desc: string;
  img: string;
  gallery?: string[]; // تصاویر بیشتر برای کاتالوگ
}

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export const ProjectDetail = ({ project, onBack }: ProjectDetailProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    // ۱. انیمیشن نمایان شدن پس‌زمینه های‌تک گرید و هاله نوری
    tl.fromTo(".tech-grid-bg", { opacity: 0 }, { opacity: 1, duration: 1.2 });
    
    // ۲. انیمیشن ورودی المان‌های متنی دشبورد
    tl.fromTo(".detail-meta-item", 
      { opacity: 0, y: 15 }, 
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" },
      "-=0.8"
    );
    tl.fromTo(".detail-title", 
      { opacity: 0, letterSpacing: "-0.05em", x: -20 }, 
      { opacity: 1, letterSpacing: "normal", x: 0, duration: 0.8, ease: "power3.out" }, 
      "-=0.6"
    );
    tl.fromTo(".detail-desc", 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.8 }, 
      "-=0.4"
    );
    tl.fromTo(".hud-accent-bar", 
      { width: "0%" }, 
      { width: "70%", duration: 1.2, ease: "power2.out" }, 
      "-=0.6"
    );

    // ۳. انیمیشن مونتاژ سه‌بعدی و استگر قطعات پازل از گوشه‌های صفحه به مرکز
    tl.fromTo(".piece-0", { x: -60, y: -60, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 1.1, ease: "power4.out" }, "-=0.8");
    tl.fromTo(".piece-1", { x: 60, y: -60, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 1.1, ease: "power4.out" }, "-=0.95");
    tl.fromTo(".piece-2", { x: -60, y: 60, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 1.1, ease: "power4.out" }, "-=0.95");
    tl.fromTo(".piece-3", { x: 60, y: 60, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 1.1, ease: "power4.out" }, "-=0.95");

  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef} 
      className="project-detail-container fixed inset-0 z-50 bg-[#030303] text-white flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden select-none"
      dir="rtl"
      style={{ '--accent-glow': project.accent } as React.CSSProperties}
    >
      {/* بکگراند های‌تک شطرنجی دیجیتال، رادارهای هولوگرافی، هاله نوری و تارهای نوری روان داینامیک */}
      <div className="tech-grid-bg absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000">
        <div className="absolute inset-0 tech-grid opacity-[0.03]" />
        
        {/* تارهای نوری منظم با نورهای روان متحرک و نامنظم */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.15]">
          <div className="grid-streak streak-v-1" />
          <div className="grid-streak streak-v-2" />
          <div className="grid-streak streak-v-3" />
          <div className="grid-streak streak-h-1" />
          <div className="grid-streak streak-h-2" />
        </div>

        {/* رادارهای هولوگرافی سه‌بعدی متقاطع در پس‌زمینه با چرخش جهت مخالف */}
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
      </div>

      {/* کلید بازگشت دایره‌ای متقارن در مرکز عمودی سمت راست با کشش هاور به سمت چپ */}
      <button 
        onClick={onBack} 
        className="unique-btn group"
        style={{ '--accent-glow': project.accent } as React.CSSProperties}
      >
        <span className="btn-content">
          <svg className="w-5 h-5 transform group-hover:-translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </span>
      </button>

      {/* بخش اول: دشبورد اطلاعات فنی (ستون سمت راست با حاشیه امن برای اسکرول اسپای) */}
      <div className="w-full lg:w-[38%] min-h-screen flex flex-col justify-center pr-8 lg:pr-28 pl-8 lg:pl-16 py-24 relative z-10 bg-[#050505]/40 backdrop-blur-md border-l border-white/5 overflow-hidden">
        
        {/* بکگراند شبکه شطرنجی مربعی اختصاصی و جریان‌های نوری تصادفی تله‌متری */}
        <div className="info-grid-bg">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* خطوط اصلی تیره تر و کاملا مشهود برای تفکیک بهتر بکگراند */}
            <line x1="24%" y1="0" x2="24%" y2="100%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <line x1="48%" y1="0" x2="48%" y2="100%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <line x1="72%" y1="0" x2="72%" y2="100%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
    05
            <line x1="0" y1="24%" x2="100%" y2="24%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <line x1="0" y1="48%" x2="100%" y2="48%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <line x1="0" y1="72%" x2="100%" y2="72%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

            {/* خطوط فرعی برای غنی‌تر شدن گرید */}
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
            <span className="text-[10px] text-white/40 font-mono">[ DIRECTORY_ACTIVE ]</span>
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
      </div>

      <div className="w-full lg:w-[62%] h-full flex items-center justify-center bg-[#010101]/95 relative z-10 p-6 lg:p-12">
        <div className="grid grid-cols-2 gap-4 lg:gap-5 w-full max-w-3xl aspect-[16/11] relative z-10">
          
          <div className="puzzle-piece piece-0 rounded-xl overflow-hidden border border-white/5 bg-neutral-950/40 backdrop-blur-md group relative will-change-transform aspect-video">
            <div className="scanline z-20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10 opacity-70 group-hover:opacity-40 transition-opacity duration-500" />
            <img src={project.gallery?.[0]} className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-all duration-[1.2s] ease-out filter brightness-[0.75] group-hover:brightness-100" alt={`${project.title} puzzle 1`} loading="lazy" />
            <div className="absolute bottom-4 right-4 z-20">
              {/* <span className="text-[8px] font-mono text-white/40">IMAGE_SPEC // 01</span> */}
            </div>
          </div>

          <div className="puzzle-piece piece-1 rounded-xl overflow-hidden border border-white/5 bg-neutral-950/40 backdrop-blur-md group relative will-change-transform aspect-video">
            <div className="scanline z-20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10 opacity-70 group-hover:opacity-40 transition-opacity duration-500" />
            <img src={project.gallery?.[1]} className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-all duration-[1.2s] ease-out filter brightness-[0.75] group-hover:brightness-100" alt={`${project.title} puzzle 2`} loading="lazy" />
            <div className="absolute bottom-4 right-4 z-20">
              {/* <span className="text-[8px] font-mono text-white/40">IMAGE_SPEC // 02</span> */}
            </div>
          </div>

          <div className="puzzle-piece piece-2 rounded-xl overflow-hidden border border-white/5 bg-neutral-950/40 backdrop-blur-md group relative will-change-transform aspect-video">
            <div className="scanline z-20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10 opacity-70 group-hover:opacity-40 transition-opacity duration-500" />
            <img src={project.gallery?.[2]} className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-all duration-[1.2s] ease-out filter brightness-[0.75] group-hover:brightness-100" alt={`${project.title} puzzle 3`} loading="lazy" />
            <div className="absolute bottom-4 right-4 z-20">
              {/* <span className="text-[8px] font-mono text-white/40">IMAGE_SPEC // 03</span> */}
            </div>
          </div>

        <div className="puzzle-piece piece-3 rounded-xl overflow-hidden border border-white/5 bg-neutral-950/40 backdrop-blur-md group relative will-change-transform aspect-video">
            <div className="scanline z-20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10 opacity-70 group-hover:opacity-40 transition-opacity duration-500" />
            <img src={project.gallery?.[2]} className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-all duration-[1.2s] ease-out filter brightness-[0.75] group-hover:brightness-100" alt={`${project.title} puzzle 3`} loading="lazy" />
            <div className="absolute bottom-4 right-4 z-20">
              {/* <span className="text-[8px] font-mono text-white/40">IMAGE_SPEC // 03</span> */}
            </div>
          </div>

          {/* <div className="puzzle-piece piece-3 rounded-xl overflow-hidden border border-white/5 bg-neutral-950/50 backdrop-blur-md p-5 flex flex-col justify-between relative group select-none aspect-video">
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/10" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/10" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/10" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/10" />
            
            <div className="flex justify-between items-center text-[9px] font-mono text-white/30 border-b border-white/5 pb-2">
              <span>SYS_DIAGNOSTIC // ON</span>
              <span className="animate-pulse" style={{ color: project.accent }}>● RUNNING</span>
            </div>
            <div className="h-12 flex items-center justify-center opacity-30 group-hover:opacity-75 transition-opacity py-1">
              <svg className="w-full h-full" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  className="vector-wave" 
                  d="M0 30 Q 20 5, 40 30 T 80 30 T 120 30 T 160 30 T 200 30" 
                  stroke={project.accent} 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  fill="none" 
                />
                <path 
                  className="vector-wave delay-wave" 
                  d="M0 30 Q 20 55, 40 30 T 80 30 T 120 30 T 160 30 T 200 30" 
                  stroke="#ffffff" 
                  strokeWidth="0.75" 
                  strokeDasharray="4 4" 
                  fill="none" 
                  opacity="0.4"
                />
              </svg>
            </div>

            <div className="space-y-0.5 font-mono text-[8px] text-white/40 border-t border-white/5 pt-2">
              <div className="flex justify-between">
                <span>RENDER_ENGINE //</span>
                <span style={{ color: project.accent }}>WebGL_ACTIVE</span>
              </div>
              <div className="flex justify-between">
                <span>PIXEL_SHADERS //</span>
                <span>COMPILING_100%</span>
              </div>
              <div className="flex justify-between">
                <span>TELEMETRY_REF //</span>
                <span>0x7FBC01A</span>
              </div>
            </div>
          </div> */}

        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .container-optimized {
          content-visibility: auto;
          contain-intrinsic-size: 500px;
        }

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

        .catalog-card {
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
          transition: box-shadow 0.5s ease, border-color 0.5s ease;
        }
        .catalog-card:hover {
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow: 0 0 25px calc(var(--accent-glow) + "25");
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
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rotateCounterClockwise {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
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

        .hud-accent-bar {
          box-shadow: 0 0 10px var(--accent-glow);
        }

        .vector-wave {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: waveSweep 3s linear infinite;
        }
        .delay-wave {
          animation-delay: 1.5s;
        }
        @keyframes waveSweep {
          0% { stroke-dashoffset: 200; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -200; }
        }

        .unique-btn {
          position: fixed;
          right: 24px;
          top: 50%;
          transform: translateY(-50%); 
          width: 52px;
          height: 52px;
          padding: 2px;
          border-radius: 9999px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.03);
          transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          will-change: transform;
          z-index: 60;
        }
        .unique-btn:hover {
          transform: translateY(-50%) translateX(-8px); /* کشیده شدن ملایم کلید به سمت چپ موقع هاور */
          box-shadow: 0 0 35px var(--accent-glow);
        }
        .unique-btn::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(transparent, transparent, var(--accent-glow), transparent);
          animation: rotateBtnBorder 4s linear infinite;
          z-index: 1;
        }
        @keyframes rotateBtnBorder { 100% { transform: rotate(360deg); } }
        .btn-content {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: #09090b;
          border-radius: 9999px;
          color: #fff;
          z-index: 2;
          transition: all 0.3s ease;
        }
        .unique-btn:hover .btn-content {
          background: transparent;
          color: #000;
        }
        .unique-btn:hover::before {
          background: var(--accent-glow);
          animation: none;
        }
      `}</style>
    </div>
  );
};