"use client";
import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [formState, setFormState] = useState<"idle" | "transmitting" | "secured">("idle");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isTyping, setIsTyping] = useState(false);

  useGSAP(() => {
    gsap.from(".reveal-contact-item", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
      },
      opacity: 0,
      y: 50,
      filter: "blur(10px)",
      stagger: 0.15,
      duration: 1.2,
      ease: "power3.out",
      clearProps: "all", 
    });

    gsap.to(".glowing-pulse-bg-1", {
      x: "15%",
      y: "-10%",
      scale: 1.25,
      opacity: 0.6,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(".glowing-pulse-bg-2", {
      x: "-10%",
      y: "15%",
      scale: 1.2,
      opacity: 0.5,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, { scope: containerRef });

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsTyping(true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1200); 
  };

  const handleSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormState("transmitting");
    
    setTimeout(() => {
      setFormState("secured");
      setTimeout(() => {
        setFormData({ name: "", email: "", message: "" });
        setFormState("idle");
      }, 4000);
    }, 2800);
  };

  return (
    <section 
      id="contact" 
      ref={containerRef}
      className="relative min-h-screen w-full bg-gradient-to-br from-[#0c0d24] via-[#0f0a1c] to-[#05040f] overflow-hidden text-white flex items-center justify-center py-24 px-6 select-none"
      style={{ fontFamily: "'Quicksand', 'Inter', sans-serif" }}
    >
      <div className="absolute inset-0 cyber-grid opacity-35 pointer-events-none" />

      <div className="absolute inset-0 scanline-effect pointer-events-none" />

      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[130px] pointer-events-none glowing-pulse-bg-1 opacity-50 mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-[550px] h-[550px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none glowing-pulse-bg-2 opacity-40 mix-blend-screen" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-pink-500/10 rounded-full blur-[160px] pointer-events-none opacity-20" />

      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative z-10 items-center">
        
        <div 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="reveal-contact-item lg:col-span-6 bg-gradient-to-br from-white/[0.04] via-[#100d28]/70 to-black/40 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative group/terminal transition-all duration-300 hover:border-cyan-500/30 overflow-hidden"
        >
          <div className="absolute inset-0 opacity-0 group-hover/terminal:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(500px_circle_at_var(--mouse-x,_0px)_var(--mouse-y,_0px),_rgba(34,211,238,0.08),_transparent_80%)]" />

          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-400/50 rounded-tr-xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-400/50 rounded-bl-xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400/50 rounded-br-xl pointer-events-none" />

          {/* <div className="absolute top-5 right-5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[9px] font-mono tracking-widest text-cyan-400/90 font-bold">LINK STABLE</span>
          </div> */}

          <div className="mb-10 mt-2 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none mb-3">
              INITIALIZE <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">UPLINK</span>
            </h2>
            <p className="text-white/50 text-xs tracking-wider uppercase font-mono leading-relaxed">درگاهی امن برای مخابره پیام‌ها و ایده‌های فرکانس بالا.</p>
          </div>

          {formState === "secured" ? (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in relative z-10">
              <div className="relative w-20 h-20 mb-6 flex items-center justify-center rounded-full border border-[#10b981]/50 bg-[#10b981]/5 shadow-[0_0_35px_rgba(16,185,129,0.4)]">
                <svg className="w-8 h-8 text-[#10b981] animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold tracking-widest text-[#10b981] uppercase font-mono mb-2">DATA STREAM SECURED</h3>
              <p className="text-white/50 text-xs max-w-sm leading-relaxed">بسته‌ اطلاعاتی با موفقیت رمزگذاری و در پایگاه داده فرود آمد. پاسخ به زودی روی فرکانس شما ارسال خواهد شد.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmission} className="space-y-6 relative z-10">
              
              <div className="relative group/input">
                <input
                  type="text"
                  required
                  disabled={formState === "transmitting"}
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full bg-[#0c091f]/50 border border-white/10 rounded-xl px-5 py-4 text-white text-sm tracking-wider placeholder-white/20 focus:outline-none focus:border-cyan-400 focus:bg-[#0f0b29] transition-all duration-300 font-mono disabled:opacity-40"
                  placeholder="IDENTIFIER / YOUR NAME"
                />
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-transparent group-focus-within/input:border-cyan-400 group-focus-within/input:w-3.5 group-focus-within/input:h-3.5 transition-all duration-300" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-transparent group-focus-within/input:border-cyan-400 group-focus-within/input:w-3.5 group-focus-within/input:h-3.5 transition-all duration-300" />
              </div>

              <div className="relative group/input">
                <input
                  type="email"
                  required
                  disabled={formState === "transmitting"}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full bg-[#0c091f]/50 border border-white/10 rounded-xl px-5 py-4 text-white text-sm tracking-wider placeholder-white/20 focus:outline-none focus:border-purple-400 focus:bg-[#0f0b29] transition-all duration-300 font-mono disabled:opacity-40"
                  placeholder="FREQUENCY GATEWAY / EMAIL"
                />
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-transparent group-focus-within/input:border-purple-400 group-focus-within/input:w-3.5 group-focus-within/input:h-3.5 transition-all duration-300" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-transparent group-focus-within/input:border-purple-400 group-focus-within/input:w-3.5 group-focus-within/input:h-3.5 transition-all duration-300" />
              </div>

              <div className="relative group/input">
                <textarea
                  rows={4}
                  required
                  disabled={formState === "transmitting"}
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className="w-full bg-[#0c091f]/50 border border-white/10 rounded-xl px-5 py-4 text-white text-sm tracking-wider placeholder-white/20 focus:outline-none focus:border-cyan-400 focus:bg-[#0f0b29] transition-all duration-300 font-mono resize-none disabled:opacity-40"
                  placeholder="ENCRYPT MESSAGE / PROJECT DETAILS..."
                />
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-transparent group-focus-within/input:border-cyan-400 group-focus-within/input:w-3.5 group-focus-within/input:h-3.5 transition-all duration-300" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-transparent group-focus-within/input:border-cyan-400 group-focus-within/input:w-3.5 group-focus-within/input:h-3.5 transition-all duration-300" />
              </div>

              <button 
                type="submit"
                disabled={formState === "transmitting"}
                className={`unique-btn group relative w-full ${formState === "transmitting" ? "cursor-wait" : ""}`} 
                style={{ "--accent-color": formState === "transmitting" ? "#c084fc" : "#38bdf8" } as React.CSSProperties}
              >
                <span className="btn-content w-full p-2 flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-xs py-4 transition-all duration-300">
                  {formState === "transmitting" ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      TRANSMITTING DATA PACKET...
                    </>
                  ) : (
                    <>
                      Submit
                      <svg className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>
          )}
        </div>

        <div className="lg:col-span-6 flex flex-col gap-8">
          
          <div className="reveal-contact-item hidden md:flex relative w-full aspect-[2/1] items-center justify-center rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#0e0c1f]/50 to-[#030305]/80 p-6 overflow-hidden shadow-2xl group/hub">
            <div className="absolute inset-0 cyber-grid opacity-15 pointer-events-none" />
            
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-gradient-to-t from-cyan-500/10 to-transparent blur-2xl pointer-events-none group-hover/hub:from-purple-500/15 transition-all duration-700 ${isTyping ? "from-pink-500/20" : ""}`} />

            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400/40 rounded-tl-xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-400/40 rounded-tr-xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-400/40 rounded-bl-xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400/40 rounded-br-xl pointer-events-none" />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg className="w-[85%] h-[85%] opacity-85" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="200" cy="100" r="80" stroke="rgba(168, 85, 247, 0.15)" strokeWidth="1.5" strokeDasharray="5 5" className={`animate-spin ${isTyping ? "speed-typing-fast" : ""}`} style={{ animationDuration: "20s" }} />
                <circle cx="200" cy="100" r="50" stroke={isTyping ? "rgba(236, 72, 153, 0.4)" : "rgba(56, 189, 248, 0.25)"} strokeWidth="1.5" className="transition-all duration-300" />
                <circle cx="200" cy="100" r="25" stroke="rgba(168, 85, 247, 0.45)" strokeWidth="2" strokeDasharray="3 3" className={`animate-spin ${isTyping ? "speed-typing-fast-reverse" : ""}`} style={{ animationDuration: "8s", animationDirection: "reverse" }} />
                
                <path d="M50 100H150" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
                <path d="M250 100H350" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
                <path d="M200 30V75" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
                <path d="M200 125V170" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />

                <path className={`contact-pulse-path ${isTyping ? "contact-pulse-fast" : ""}`} d="M50 100H150" stroke={isTyping ? "#f472b6" : "#38bdf8"} strokeWidth="2.5" strokeLinecap="round" />
                <path className={`contact-pulse-path delay-pulse-1 ${isTyping ? "contact-pulse-fast" : ""}`} d="M350 100H250" stroke={isTyping ? "#a855f7" : "#c084fc"} strokeWidth="2.5" strokeLinecap="round" />
                
                <circle cx="200" cy="100" r="8" fill={isTyping ? "#f472b6" : "#38bdf8"} className="animate-ping" style={{ animationDuration: isTyping ? "1s" : "3s" }} />
                <circle cx="200" cy="100" r="6" fill={isTyping ? "#a855f7" : "#c084fc"} />
                
                <circle cx="50" cy="100" r="3" fill="#38bdf8" />
                <circle cx="350" cy="100" r="3" fill="#c084fc" />
              </svg>
            </div>
          </div>

          <div 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="reveal-contact-item flex items-center gap-5 bg-gradient-to-r from-white/[0.03] to-[#120f2b]/70 border border-white/10 rounded-2xl p-5 md:p-6 backdrop-blur-md transition-all duration-300 hover:border-cyan-400/40 hover:bg-[#131032]/75 group/card shadow-lg relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(350px_circle_at_var(--mouse-x,_0px)_var(--mouse-y,_0px),_rgba(34,211,238,0.08),_transparent_80%)]" />
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400/30" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400/30" />
            
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 group-hover/card:shadow-[0_0_15px_rgba(56,189,248,0.45)] transition-all duration-300 relative z-10">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.39.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.36-.49.99-.75 3.88-1.69 6.46-2.8 7.74-3.32 3.66-1.5 4.42-1.76 4.92-1.77.11 0 .36.03.52.16.14.12.18.28.19.4z" />
              </svg>
            </div>
            <div className="relative z-10">
              {/* <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono tracking-widest text-white/60 uppercase">QUANTUM FREQUENCY</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                <span className="text-[8px] font-mono text-[#10b981] animate-pulse">ONLINE</span>
              </div> */}
              <p className="text-sm font-semibold tracking-wider text-white group-hover/card:text-cyan-400 transition-colors duration-300">@nextgen_agency</p>
            </div>
          </div>

          <div 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="reveal-contact-item flex items-center gap-5 bg-gradient-to-r from-white/[0.03] to-[#120f2b]/70 border border-white/10 rounded-2xl p-5 md:p-6 backdrop-blur-md transition-all duration-300 hover:border-purple-400/40 hover:bg-[#131032]/75 group/card shadow-lg relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(350px_circle_at_var(--mouse-x,_0px)_var(--mouse-y,_0px),_rgba(168,132,252,0.08),_transparent_80%)]" />
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-purple-400/30" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-purple-400/30" />

            <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-purple-500/30 bg-purple-500/10 text-purple-400 group-hover/card:shadow-[0_0_15px_rgba(192,132,252,0.45)] transition-all duration-300 relative z-10">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="relative z-10">
              {/* <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono tracking-widest text-white/60 uppercase">SECURE COMM CHANNEL</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                <span className="text-[8px] font-mono text-[#10b981]">SECURED</span>
              </div> */}
              <p className="text-sm font-semibold tracking-wider text-white group-hover/card:text-purple-400 transition-colors duration-300">uplink@agency.next</p>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .cyber-grid {
          background-size: 50px 50px;
          background-image: 
            linear-gradient(to right, rgba(168, 85, 247, 0.025) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(56, 189, 248, 0.025) 1px, transparent 1px);
        }

        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .scanline-effect {
          background: linear-gradient(to bottom, transparent, rgba(56, 189, 248, 0.03), transparent);
          animation: scanline 10s linear infinite;
        }

        @keyframes contactPulse {
          0% { stroke-dashoffset: 200; }
          100% { stroke-dashoffset: 0; }
        }

        .contact-pulse-path {
          stroke-dasharray: 40 160;
          animation: contactPulse 3s linear infinite;
          filter: drop-shadow(0 0 8px #38bdf8);
          will-change: stroke-dashoffset;
        }

        .delay-pulse-1 {
          animation-delay: -1.5s;
          filter: drop-shadow(0 0 8px #c084fc);
        }

        .speed-typing-fast {
          animation-duration: 5s !important;
        }
        .speed-typing-fast-reverse {
          animation-duration: 2s !important;
        }
        .contact-pulse-fast {
          animation-duration: 1s !important;
        }

        .unique-btn {
          position: relative;
          width: fit-content;
          padding: 2.5px;
          border-radius: 12px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.03);
          transition: all 0.4s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .unique-btn::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(transparent, transparent, var(--accent-color, #38bdf8), transparent);
          animation: rotateBtnBorder 4s linear infinite;
          z-index: 1;
        }

        @keyframes rotateBtnBorder { 
          100% { transform: rotate(360deg); } 
        }

        .btn-content {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #09090b;
          border-radius: 10px;
          color: #fff;
          font-weight: 700;
          letter-spacing: 0.15em;
          z-index: 2;
          transition: all 0.3s ease;
        }

        .unique-btn:hover {
          box-shadow: 0 0 35px var(--accent-color, #38bdf8);
          transform: translateY(-2px);
        }

        .unique-btn:hover .btn-content {
          background: transparent;
          color: #000;
          font-weight: 900;
        }

        .unique-btn:hover::before {
          background: var(--accent-color, #38bdf8);
          animation: none;
        }

        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}