"use client";
import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
  accentColor: string;
  skills: string[];
}

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileCardRef = useRef<HTMLDivElement>(null);
  
  const [activeIdx, setActiveIdx] = useState<number>(0);

  const team: TeamMember[] = [
    {
      id: 2,
      name: "ماهان نکوزاد ",
      role: "توسعه‌دهنده خلاق فرانت‌اند",
      bio: "متخصص در خلق تعاملات بصری پیچیده، انیمیشن‌های پیشرفته و رابط‌های کاربری مدرن نسل وب.",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600",
      accentColor: "#a855f7", // Purple
      skills: ["React / Next.js", "GSAP", "WebGL"]
    },
    {
      id: 1,
      name: "پریناز بختیاری",
      role: "مدیر نوآوری و آرشیتکت ارشد",
      bio: "خلاقیت مداوم در طراحی سیستم‌های مقیاس‌پذیر و هدایت تیم به سمت افق‌های نوین تکنولوژی.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
      accentColor: "#38bdf8", // Cyan
      skills: ["System Design", "UI/UX", "Creative Direction"]
    },
    {
      id: 3,
      name: " اشکان آصف",
      role: "مهندس ارشد هوش مصنوعی",
      bio: "ترکیب الگوریتم‌های هوشمند یادگیری ماشین با محصولات کاربردی جهت شخصی‌سازی بهینه تجربه کاربری.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600",
      accentColor: "#ec4899", // Pink
      skills: ["Python", "PyTorch", "Data Science"]
    }
  ];

  const currentActiveMember = team[activeIdx];

  // GSAP for Entrance Animations (Desktop & General)
  useGSAP(() => {
    gsap.from(".reveal-about-item", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
      },
      opacity: 0,
      y: 60,
      filter: "blur(12px)",
      stagger: 0.15,
      duration: 1.2,
      ease: "power3.out",
      clearProps: "all",
    });

    gsap.to(".glowing-pulse-about-1", {
      x: "-10%",
      y: "15%",
      scale: 1.2,
      opacity: 0.5,
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(".glowing-pulse-about-2", {
      x: "15%",
      y: "-12%",
      scale: 1.15,
      opacity: 0.4,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, { scope: containerRef });

  // Highly Optimized useGSAP for Mobile State Transitions
  useGSAP(() => {
    if (!mobileCardRef.current) return;

    // Prevent overlap / Cancel previous run animations instantly
    gsap.killTweensOf(".mobile-animate-target");
    gsap.killTweensOf(".mobile-image-target");

    // Ultra lightweight slide + scale on GPU
    gsap.fromTo(
      ".mobile-animate-target",
      { opacity: 0, y: 10, scale: 0.98 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.45, 
        stagger: 0.04, 
        ease: "power2.out" 
      }
    );

    // Dynamic contrast splash for portrait image
    gsap.fromTo(
      ".mobile-image-target",
      { opacity: 0.4, scale: 1.04 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
    );
  }, { dependencies: [activeIdx], scope: mobileCardRef });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, isActive: boolean) => {
    if (!isActive) return; 
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);

    const tiltX = -((y - rect.height / 2) / (rect.height / 2)) * 4;
    const tiltY = ((x - rect.width / 2) / (rect.width / 2)) * 4;

    gsap.to(card, {
      rotateX: tiltX,
      rotateY: tiltY,
      transformPerspective: 1000,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "power2.out"
    });
  };

  return (
    <section 
      id="about" 
      ref={containerRef}
      className="sticky top-0 h-screen h-[100dvh] w-full bg-gradient-to-br from-[#05040f] via-[#0c0d24] to-[#0a0718] overflow-hidden text-white flex items-center justify-center px-6 select-none z-20 shadow-[0_-40px_80px_rgba(0,0,0,0.9)]"
      style={{ fontFamily: "'Quicksand', 'Inter', sans-serif" }}
    >
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />
      <div className="absolute inset-0 scanline-effect pointer-events-none" />

      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none glowing-pulse-about-1 opacity-40 mix-blend-screen" />
      <div className="absolute bottom-1/4 left-1/4 w-[550px] h-[550px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none glowing-pulse-about-2 opacity-40 mix-blend-screen" />

      {/* ==================== DESKTOP VERSION (lg:grid) ==================== */}
      <div className="hidden lg:grid max-w-7xl w-full grid-cols-12 gap-16 relative z-10 items-center">
        
        <div className="col-span-5 flex flex-col gap-8 order-2 lg:order-1 text-right" dir="rtl">
          
          <div className="reveal-about-item flex items-center justify-start gap-6">
            <div className="relative w-24 h-24 flex items-center justify-center rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
              <div className="absolute inset-0 cyber-grid opacity-30" />
              
              <div 
                className="absolute w-14 h-14 rounded-full blur-xl opacity-80 transition-all duration-700"
                style={{ 
                  backgroundColor: currentActiveMember.accentColor,
                  boxShadow: `0 0 30px ${currentActiveMember.accentColor}`
                }}
              />

              <svg className="w-12 h-12 relative z-10" viewBox="0 0 100 100" fill="none">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="35" 
                  stroke={currentActiveMember.accentColor} 
                  strokeWidth="2" 
                  strokeDasharray="6 6" 
                  className="animate-spin" 
                  style={{ animationDuration: "12s", transition: "stroke 0.5s ease" }} 
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="22" 
                  stroke={currentActiveMember.accentColor} 
                  strokeWidth="3" 
                  className="transition-colors duration-500"
                />
                <polygon 
                  points="50,38 60,58 40,58" 
                  fill="white" 
                  className="animate-pulse" 
                  style={{ transformOrigin: "50% 50%" }}
                />
              </svg>
            </div>

            <div>
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold block mb-1">NEXUS ACTIVE AGENTS</span>
              <h3 className="text-2xl font-black text-white">هسته متخصصان خلاق</h3>
            </div>
          </div>

          <div className="reveal-about-item space-y-4">
            <h2 className="text-4xl font-black text-white leading-tight">
              تلاقی مهندسی ایده و <br />
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">پیاده‌سازی فرکانس‌بالا</span>
            </h2>
            <p className="text-white/60 text-sm leading-relaxed font-light">
              آکادمی و آژانس ما با تکیه بر تفکر مدرن و ابزارهای آینده‌نگرانه، راه‌حل‌های دیجیتالی ارائه می‌دهد که فراتر از استانداردهای حال حاضر وب حرکت می‌کنند. برای آشنایی بیشتر، روی کارت هر عضو هاور کنید.
            </p>
          </div>

          <div className="reveal-about-item grid grid-cols-3 gap-4 pt-6 border-t border-white/5 font-mono">
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 text-center">
              <span className="block text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">+40</span>
              <span className="text-[9px] text-white/40 uppercase tracking-wider block mt-1">پروژه موفق</span>
            </div>
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 text-center">
              <span className="block text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">99.9%</span>
              <span className="text-[9px] text-white/40 uppercase tracking-wider block mt-1">پایداری فرکانس</span>
            </div>
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 text-center">
              <span className="block text-xl font-bold bg-gradient-to-r from-pink-400 to-orange-500 bg-clip-text text-transparent">3</span>
              <span className="text-[9px] text-white/40 uppercase tracking-wider block mt-1">عضو هسته</span>
            </div>
          </div>

        </div>

        <div className="col-span-7 w-full flex flex-row gap-4 items-stretch justify-center order-1 lg:order-2">
          {team.map((member, idx) => {
            const isActive = activeIdx === idx;
            return (
              <div
                key={member.id}
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseMove={(e) => handleMouseMove(e, isActive)}
                onMouseLeave={handleMouseLeave}
                style={{
                  "--accent-color": member.accentColor,
                } as React.CSSProperties}
                className={`reveal-about-item relative overflow-hidden rounded-[2.5rem] border cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.3,1)]
                  ${isActive 
                    ? "flex-[3.5] h-[500px] border-[var(--accent-color)] shadow-[0_20px_50px_rgba(0,0,0,0.6)]" 
                    : "flex-[1] h-[500px] border-white/10 opacity-60 hover:opacity-100"
                  }`}
              >
                {isActive && (
                  <div className="absolute inset-0 opacity-100 pointer-events-none bg-[radial-gradient(400px_circle_at_var(--mouse-x,_0px)_var(--mouse-y,_0px),_rgba(255,255,255,0.05),_transparent_80%)]" />
                )}

                <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className={`w-full h-full object-cover transition-all duration-700 ease-out 
                      ${isActive ? "scale-105 grayscale-0" : "scale-100 grayscale contrast-125 opacity-40"}`}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-500
                    ${isActive ? "opacity-95" : "opacity-70"}`} 
                  />
                </div>

                <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 rounded-tl-lg pointer-events-none transition-opacity duration-500 ${isActive ? "border-[var(--accent-color)] opacity-100" : "opacity-0"}`} />
                <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 rounded-tr-lg pointer-events-none transition-opacity duration-500 ${isActive ? "border-[var(--accent-color)] opacity-100" : "opacity-0"}`} />
                <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 rounded-bl-lg pointer-events-none transition-opacity duration-500 ${isActive ? "border-[var(--accent-color)] opacity-100" : "opacity-0"}`} />
                <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 rounded-br-lg pointer-events-none transition-opacity duration-500 ${isActive ? "border-[var(--accent-color)] opacity-100" : "opacity-0"}`} />

                <div 
                  className={`absolute inset-0 flex flex-col justify-end p-8 text-right transition-all duration-500 ease-out
                    ${isActive ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-6 pointer-events-none"}`}
                  dir="rtl"
                >
                  <span 
                    className="text-[9px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-md border bg-black/50 inline-block mb-3 w-fit"
                    style={{ borderColor: `${member.accentColor}30`, color: member.accentColor }}
                  >
                    {member.role}
                  </span>
                  <h4 className="text-2xl font-black text-white mb-1">{member.name}</h4>
                  
                  <p className="text-white/75 text-xs leading-relaxed mb-4 max-w-sm font-light">
                    {member.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 justify-start">
                    {member.skills.map((skill, sIdx) => (
                      <span 
                        key={sIdx}
                        className="text-[9px] font-mono bg-white/[0.04] border border-white/5 px-2.5 py-0.5 rounded text-white/50"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div 
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-500 pointer-events-none
                    ${!isActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"}`}
                >
                  <span 
                    className="text-white/50 font-bold tracking-widest text-xs uppercase whitespace-nowrap md:[writing-mode:vertical-rl]" 
                    style={{ transform: "rotate(180deg)" }}
                  >
                    {member.name}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      <div 
        ref={mobileCardRef}
        className="flex lg:hidden w-full h-full flex-col justify-between relative z-10 max-w-md mx-auto pt-14 pb-24" 
        dir="rtl"
      >
        <div className="reveal-about-item text-center space-y-1">
          <span className="text-[9px] font-mono tracking-widest text-cyan-400 font-bold block">
            NEXUS ACTIVE AGENTS
          </span>
          <h2 className="text-xl xs:text-2xl font-black text-white leading-tight">
            تلاقی مهندسی ایده و <br />
            <span 
              className="bg-clip-text text-transparent transition-all duration-500 drop-shadow-[0_0_12px_rgba(168,85,247,0.25)]"
              style={{ 
                backgroundImage: `linear-gradient(to left, ${currentActiveMember.accentColor}, #38bdf8)` 
              }}
            >
              پیاده‌سازی فرکانس‌بالا
            </span>
          </h2>
        </div>

        <div className="reveal-about-item flex justify-center items-center gap-4 py-1.5">
          {team.map((member, idx) => {
            const isActive = activeIdx === idx;
            return (
              <button
                key={member.id}
                onClick={() => setActiveIdx(idx)}
                className="relative focus:outline-none transition-all duration-300"
              >
                {isActive && (
                  <svg className="absolute inset-0 -m-1.5 w-[calc(100%+12px)] h-[calc(100%+12px)] pointer-events-none" viewBox="0 0 100 100">
                    <rect
                      x="2" y="2" width="96" height="96" rx="18"
                      fill="none"
                      stroke={member.accentColor}
                      strokeWidth="2.5"
                      strokeDasharray="12 8"
                      className="animate-spin"
                      style={{ animationDuration: "12s", transformOrigin: "center" }}
                    />
                  </svg>
                )}
                
                <div 
                  className={`relative w-11 h-11 xs:w-12 xs:h-12 rounded-2xl overflow-hidden border transition-all duration-500
                    ${isActive ? "scale-105 border-transparent" : "scale-90 border-white/10 opacity-40 grayscale"}`}
                >
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                <div 
                  className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-500
                    ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
                  style={{ 
                    backgroundColor: member.accentColor, 
                    boxShadow: `0 0 8px ${member.accentColor}` 
                  }}
                />
              </button>
            );
          })}
        </div>

        <div 
          className="reveal-about-item transform-gpu will-change-transform relative w-[180px] h-[180px] xs:w-[200px] xs:h-[200px] mx-auto rounded-[2.2rem] border border-white/10 overflow-hidden bg-black/40 backdrop-blur-md flex flex-col justify-end transition-colors duration-500 shadow-[0_15px_35px_rgba(0,0,0,0.8)]"
          style={{ borderColor: `${currentActiveMember.accentColor}30` }}
        >
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 rounded-tl-xl pointer-events-none transition-colors duration-500" style={{ borderColor: currentActiveMember.accentColor }} />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 rounded-tr-xl pointer-events-none transition-colors duration-500" style={{ borderColor: currentActiveMember.accentColor }} />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 rounded-bl-xl pointer-events-none transition-colors duration-500" style={{ borderColor: currentActiveMember.accentColor }} />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 rounded-br-xl pointer-events-none transition-colors duration-500" style={{ borderColor: currentActiveMember.accentColor }} />

          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
            <img 
              src={currentActiveMember.image} 
              alt={currentActiveMember.name} 
              className="mobile-image-target transform-gpu will-change-transform w-full h-full object-cover transition-all duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
          </div>
        </div>

        <div className="reveal-about-item text-center px-4 space-y-3 min-h-[140px] flex flex-col justify-center">
          
          {/* Glowing Header Name & Accent Badge */}
          <div className="space-y-1.5">
            <h4 
              className="mobile-animate-target transform-gpu will-change-transform text-2xl font-black transition-colors duration-500"
              style={{ 
                color: currentActiveMember.accentColor,
                textShadow: `0 0 15px ${currentActiveMember.accentColor}35` 
              }}
            >
              {currentActiveMember.name}
            </h4>
            <span 
              className="mobile-animate-target transform-gpu will-change-transform text-[8px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-md border bg-black/60 inline-block transition-colors duration-500"
              style={{ borderColor: `${currentActiveMember.accentColor}30`, color: currentActiveMember.accentColor }}
            >
              {currentActiveMember.role}
            </span>
          </div>

          <p className="mobile-animate-target transform-gpu will-change-transform text-white/70 text-[11px] leading-relaxed font-light max-w-xs mx-auto">
            {currentActiveMember.bio}
          </p>

          <div className="mobile-animate-target transform-gpu will-change-transform flex flex-wrap gap-1 justify-center pt-0.5">
            {currentActiveMember.skills.map((skill, sIdx) => (
              <span 
                key={sIdx}
                className="text-[8px] font-mono bg-white/[0.04] border border-white/5 px-2 py-0.5 rounded text-white/60"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="reveal-about-item grid grid-cols-3 gap-2.5 pt-3.5 border-t border-white/5 font-mono">
          <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-2.5 text-center">
            <span className="block text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">+40</span>
            <span className="text-[7.5px] text-white/40 uppercase tracking-wider block mt-0.5">پروژه موفق</span>
          </div>
          <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-2.5 text-center">
            <span className="block text-sm font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">99.9%</span>
            <span className="text-[7.5px] text-white/40 uppercase tracking-wider block mt-0.5">پایداری فرکانس</span>
          </div>
          <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-2.5 text-center">
            <span className="block text-sm font-bold bg-gradient-to-r from-pink-400 to-orange-500 bg-clip-text text-transparent">3</span>
            <span className="text-[7.5px] text-white/40 uppercase tracking-wider block mt-0.5">عضو هسته</span>
          </div>
        </div>

      </div>

      <style jsx>{`
        .cyber-grid {
          background-size: 50px 50px;
          background-image: 
            linear-gradient(to right, rgba(168, 85, 247, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(56, 189, 248, 0.02) 1px, transparent 1px);
        }

        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .scanline-effect {
          background: linear-gradient(to bottom, transparent, rgba(56, 189, 248, 0.02), transparent);
          animation: scanline 12s linear infinite;
        }

        .animate-spin {
          animation: spin 20s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}