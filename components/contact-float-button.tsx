"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useCreateSubmission } from "@/hooks/useCreateSubmission"; 

interface ContactFloatButtonProps {
  onClick?: () => void;
}

export default function ContactFloatButton({ onClick }: ContactFloatButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const backdropBgRef = useRef<HTMLDivElement>(null); 
  const modalRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // States related to the Contact Form
  const [formState, setFormState] = useState<"idle" | "transmitting" | "secured">("idle");
  const [formData, setFormData] = useState({ name: "", contact_info: "", message: "" });
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [loadingStage, setLoadingStage] = useState("INITIALIZING REQUEST");

  const mutation = useCreateSubmission();

  // Floating Button Show/Hide animation
  useEffect(() => {
    const handleHide = () => {
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          x: 120,
          opacity: 0,
          scale: 0.7,
          rotate: -20,
          pointerEvents: "none",
          duration: 0.7,
          ease: "power3.inOut"
        });
      }
    };

    const handleShow = () => {
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          x: 0,
          opacity: 1,
          scale: 1,
          rotate: 0,
          pointerEvents: "auto",
          duration: 0.9,
          ease: "back.out(1.2)"
        });
      }
    };

    window.addEventListener("project-explore", handleHide);
    window.addEventListener("project-back", handleShow);

    return () => {
      window.removeEventListener("project-explore", handleHide);
      window.removeEventListener("project-back", handleShow);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (formState !== "transmitting") return;
    
    const stages = [
      "ESTABLISHING API HANDSHAKE",
      "SERIALIZING REQUEST PAYLOAD",
      "DISPATCHING HTTP POST REQUEST",
      "AWAITING SERVER RESPONSE"
    ];
    let currentStage = 0;
    const interval = setInterval(() => {
      currentStage = (currentStage + 1) % stages.length;
      setLoadingStage(stages[currentStage]);
    }, 600);

    return () => clearInterval(interval);
  }, [formState]);

  // Linux Genie / Compiz Stretch & Retract (Zero-Translation, Pure Scale Deformation)
  useEffect(() => {
    if (!backdropRef.current || !backdropBgRef.current || !modalRef.current || !buttonRef.current) return;

    gsap.killTweensOf([backdropRef.current, backdropBgRef.current, modalRef.current]);

    const updateTransformOrigin = () => {
      if (!buttonRef.current || !modalRef.current || !backdropRef.current) return;

      const originalDisplay = backdropRef.current.style.display;
      const originalVisibility = backdropRef.current.style.visibility;
      const originalTransform = modalRef.current.style.transform;

      modalRef.current.style.transform = "none";

      backdropRef.current.style.display = "flex";
      backdropRef.current.style.visibility = "hidden";

      const modalRect = modalRef.current.getBoundingClientRect();
      const buttonRect = buttonRef.current.getBoundingClientRect();

      backdropRef.current.style.display = originalDisplay;
      backdropRef.current.style.visibility = originalVisibility;
      modalRef.current.style.transform = originalTransform;

      const buttonCenterX = buttonRect.left + buttonRect.width / 2;
      const buttonCenterY = buttonRect.top + buttonRect.height / 2;

      const localX = buttonCenterX - modalRect.left;
      const localY = buttonCenterY - modalRect.top;

      gsap.set(modalRef.current, {
        transformOrigin: `${localX}px ${localY}px`
      });
    };

    if (isOpen) {
      updateTransformOrigin();

      gsap.set(backdropRef.current, { display: "flex" });
      gsap.set(backdropBgRef.current, { opacity: 0 });

      gsap.set(modalRef.current, {
        scaleX: 0,
        scaleY: 0,
        skewX: -45, 
        skewY: -20,
        rotate: 20,
        x: 0,
        y: 0,
        opacity: 1 
      });

      gsap.to(backdropBgRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      });

      // Pure solid physical expand & untwist (Smooth, fluid overshoot and settle)
      gsap.to(modalRef.current, {
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        skewY: 0,
        rotate: 0,
        duration: 0.85,
        ease: "back.out(1.35)" // Elegant bubble-like pop and glide
      });

    } else {
      updateTransformOrigin();

      gsap.to(backdropBgRef.current, {
        opacity: 0,
        duration: 0.75,
        ease: "power2.inOut"
      });

      const tl = gsap.timeline({
        onComplete: () => {
          if (backdropRef.current) {
            gsap.set(backdropRef.current, { display: "none" });
          }
        }
      });

      gsap.set(modalRef.current, { opacity: 1 });

      tl.to(modalRef.current, {
        scaleX: 0,
        scaleY: 0,
        skewX: 15,     
        skewY: 5,
        rotate: -10,   
        duration: 0.75,
        ease: "power3.in" 
      }, 0);

      tl.to(modalRef.current, {
        opacity: 0,
        duration: 0.45,
        ease: "power1.in"
      }, 0.3);
    }
  }, [isOpen]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const btn = buttonRef.current;
    const rect = btn.getBoundingClientRect();
    
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btn, {
      x: x * 0.25,
      y: y * 0.25,
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!buttonRef.current) return;

    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)"
    });
  };

  // Modal Mouse Movement Dynamic Hover effect
  const handleModalMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);

    const tiltX = -((y - rect.height / 2) / (rect.height / 2)) * 0.8; 
    const tiltY = ((x - rect.width / 2) / (rect.width / 2)) * 0.8; 

    gsap.to(card, {
      rotateX: tiltX,
      rotateY: tiltY,
      transformPerspective: 1500,
      duration: 0.5, 
      ease: "power2.out"
    });
  };

  const handleModalMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "power2.out"
    });
  };

  // Form Submission Logic
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
    if (!formData.name || !formData.contact_info || !formData.message) return;

    setFormState("transmitting");
    
    mutation.mutate({
      name: formData.name,
      contact_info: formData.contact_info,
      description: formData.message 
    }, {
      onSuccess: () => {
        setFormState("secured");
        setTimeout(() => {
          setFormData({ name: "", contact_info: "", message: "" });
          setFormState("idle");
          setIsOpen(false); 
        }, 3500);
      },
      onError: (error) => {
        setFormState("idle");
        console.error("Transmission error:", error);
      }
    });
  };

  return (
    <>
      <div
        ref={containerRef}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center pointer-events-auto"
      >
        <button
          ref={buttonRef}
          onClick={() => {
            setIsOpen(true);
            if (onClick) onClick();
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          className="relative w-12 h-12 flex items-center justify-center rounded-full bg-[#060608]/95 border border-cyan-500/20 hover:border-cyan-400/40 shadow-[0_8px_24px_rgba(0,0,0,0.7)] cursor-pointer focus:outline-none group transition-colors duration-500"
          aria-label="Contact Us"
        >
          <span className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping pointer-events-none" style={{ animationDuration: "2.5s" }} />
          <span className="absolute inset-0 rounded-full bg-purple-500/10 animate-ping pointer-events-none delay-750" style={{ animationDuration: "3.5s" }} />

          <div 
            className="absolute inset-[-3px] rounded-full border border-dashed border-cyan-400/30 group-hover:border-cyan-400/80 transition-colors duration-500 animate-spin" 
            style={{ animationDuration: isHovered ? "3s" : "10s" }} 
          />
          <div 
            className="absolute inset-[-6px] rounded-full border border-purple-500/20 group-hover:border-purple-500/60 transition-colors duration-500 animate-spin" 
            style={{ animationDuration: isHovered ? "5s" : "14s", animationDirection: "reverse" }} 
          />

          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400/10 to-purple-500/10 opacity-30 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-500 pointer-events-none" />

          <div className="relative z-10 transition-all duration-500 group-hover:scale-110">
            <svg
              className="w-5.5 h-5.5 text-white/80 group-hover:text-white transition-colors duration-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.3)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              <path 
                d="M13 8l-3 4h4l-3 4" 
                stroke="#22d3ee" 
                strokeWidth="1.8" 
                fill="none" 
                className="drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
              />
            </svg>
          </div>

          <div className="absolute right-16 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 translate-x-3 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0 flex items-center gap-2">
            <div className="py-2 px-3 rounded-lg border border-purple-500/20 bg-[#060608]/95 backdrop-blur-md flex items-center gap-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.6)] whitespace-nowrap">
              <span className="text-[9px] tracking-wider text-purple-400 font-mono font-semibold">⚡ READY?</span>
              <div className="w-[1px] h-2.5 bg-white/10" />
              <span className="text-[9px] tracking-[0.2em] text-white/90 uppercase font-light">Let's Talk</span>
            </div>
          </div>

          <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,1)] animate-pulse" />
        </button>
      </div>

      <div
        ref={backdropRef}
        style={{ display: "none" }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 select-none"
      >
        <div 
          ref={backdropBgRef} 
          className="absolute inset-0 bg-[#030208]/70 backdrop-blur-md pointer-events-auto"
        >
          <div className="absolute inset-0 cursor-default" onClick={() => setIsOpen(false)} />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none mix-blend-screen" />
        </div>

        <div 
          ref={modalRef}
          onMouseMove={handleModalMouseMove}
          onMouseLeave={handleModalMouseLeave}
          style={{ willChange: "transform" }}
          className="relative max-w-lg w-full bg-gradient-to-br from-white/[0.04] via-[#100d28]/85 to-black/90 border border-white/10 rounded-[2rem] shadow-[0_25px_60px_rgba(0,0,0,0.85)] group/terminal overflow-hidden"
        >
          <div className="absolute inset-0 cyber-grid opacity-15 pointer-events-none" />
          <div className="absolute inset-0 scanline-effect pointer-events-none" />

          <div className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-3.5 h-3.5 rounded-full bg-[#ef4444]/80 hover:bg-[#ef4444] transition-colors flex items-center justify-center group/btn relative"
                aria-label="Close"
              >
                <span className="opacity-0 group-hover/btn:opacity-100 text-[8px] text-black font-bold transition-opacity absolute">×</span>
              </button>
              <div className="w-3.5 h-3.5 rounded-full bg-[#f59e0b]/40 cursor-not-allowed" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#10b981]/40 cursor-not-allowed" />
            </div>
            <div className="w-14" /> 
          </div>

          <div className="p-8 md:p-10 relative z-10">
            {/* Terminal Corner highlights */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-400/50 rounded-tr-xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-400/50 rounded-bl-xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400/50 rounded-br-xl pointer-events-none" />

            <div className="absolute inset-0 opacity-0 group-hover/terminal:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(450px_circle_at_var(--mouse-x,_0px)_var(--mouse-y,_0px),_rgba(34,211,238,0.06),_transparent_80%)]" />

            <div className="mb-8 relative z-10 text-right" dir="rtl">
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-none mb-3 text-left" dir="ltr">
                INITIALIZE <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">UPLINK</span>
              </h2>
              <p className="text-white/50 text-[10px] tracking-wider uppercase font-mono leading-relaxed">درگاهی برای ارسال اطلاعات پروژه و برقراری ارتباط سریع با تیم توسعه.</p>
            </div>

            {formState === "secured" ? (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in relative z-10" dir="rtl">
                <div className="relative w-20 h-20 mb-6 flex items-center justify-center rounded-full border border-[#10b981]/50 bg-[#10b981]/5 shadow-[0_0_35px_rgba(16,185,129,0.4)]">
                  <svg className="w-8 h-8 text-[#10b981] animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold tracking-widest text-[#10b981] uppercase font-mono mb-2">RESPONSE RECEIVED</h3>
                <p className="text-white/50 text-[11px] max-w-sm leading-relaxed">اطلاعات شما با موفقیت در پایگاه داده ثبت شد. به زودی از طرف تیم توسعه با شما تماس خواهیم گرفت.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmission} className="space-y-5 relative z-10">
                
                <div className="relative group/input">
                  <input
                    type="text"
                    required
                    disabled={formState === "transmitting"}
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full bg-[#0c091f]/50 border border-white/10 rounded-xl px-5 py-3.5 text-white text-xs tracking-wider placeholder-white/20 focus:outline-none focus:border-cyan-400 focus:bg-[#0f0b29] transition-all duration-300 font-mono disabled:opacity-40"
                    placeholder="IDENTIFIER / YOUR NAME"
                  />
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-transparent group-focus-within/input:border-cyan-400 group-focus-within/input:w-3.5 group-focus-within/input:h-3.5 transition-all duration-300" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-transparent group-focus-within/input:border-cyan-400 group-focus-within/input:w-3.5 group-focus-within/input:h-3.5 transition-all duration-300" />
                </div>

                <div className="relative group/input">
                  <input
                    type="text"
                    required
                    disabled={formState === "transmitting"}
                    value={formData.contact_info}
                    onChange={(e) => handleInputChange("contact_info", e.target.value)}
                    className="w-full bg-[#0c091f]/50 border border-white/10 rounded-xl px-5 py-3.5 text-white text-xs tracking-wider placeholder-white/20 focus:outline-none focus:border-purple-400 focus:bg-[#0f0b29] transition-all duration-300 font-mono disabled:opacity-40"
                    placeholder="CONTACT INFO / Phone Number"
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
                    className="w-full bg-[#0c091f]/50 border border-white/10 rounded-xl px-5 py-3.5 text-white text-xs tracking-wider placeholder-white/20 focus:outline-none focus:border-cyan-400 focus:bg-[#0f0b29] transition-all duration-300 font-mono resize-none disabled:opacity-40"
                    placeholder="PROJECT DETAILS / MESSAGE..."
                  />
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-transparent group-focus-within/input:border-cyan-400 group-focus-within/input:w-3.5 group-focus-within/input:h-3.5 transition-all duration-300" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-transparent group-focus-within/input:border-cyan-400 group-focus-within/input:w-3.5 group-focus-within/input:h-3.5 transition-all duration-300" />
                </div>

                <button 
                  type="submit"
                  disabled={formState === "transmitting"}
                  className="unique-btn group relative w-full" 
                  style={{ "--accent-color": formState === "transmitting" ? "#c084fc" : "#38bdf8" } as React.CSSProperties}
                >
                  <span className="btn-content w-full p-2 flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-[11px] py-4 transition-all duration-300 min-h-[50px] overflow-hidden">
                    {formState === "transmitting" ? (
                      <div className="flex items-center gap-2.5 animate-fade-in w-full justify-center relative">
                        <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
                          <span className="absolute inset-0 rounded-full border border-dashed border-cyan-400/40 animate-spin" style={{ animationDuration: '3s' }} />
                          <span className="absolute w-2.5 h-2.5 rounded-full border border-purple-400/60 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
                          <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                        </div>
                        <span className="font-mono text-[9px] tracking-widest text-cyan-300 font-bold">{loadingStage}...</span>
                        
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent btn-scan-line pointer-events-none" />
                      </div>
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
        </div>
      </div>

      {/* Styled JSX (Keeping original styles preserved) */}
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

        .unique-btn {
          position: relative;
          display: block;
          width: 100%;
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

        @keyframes scanHorizontal {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .btn-scan-line {
          animation: scanHorizontal 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </>
  );
}