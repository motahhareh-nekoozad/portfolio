"use client";
import React, { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function HeroSection() {
  const container = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particleCount = 130;
    const targetDistance = 100;
    const particles: any[] = [];
    let animationFrameId: number;

    const mouse = { x: width / 2, y: height / 2, tx: width / 2, ty: height / 2 };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      isGlowOrb: boolean;
      alpha: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        
        this.isGlowOrb = Math.random() > 0.9;
        this.radius = this.isGlowOrb ? Math.random() * 15 + 10 : 1.5;
        this.alpha = this.isGlowOrb ? Math.random() * 0.04 + 0.02 : 0.4;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const onMouseMove = (e: MouseEvent) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();

        if (p1.isGlowOrb) continue;

        const mDx = p1.x - mouse.x;
        const mDy = p1.y - mouse.y;
        const mDist = Math.sqrt(mDx * mDx + mDy * mDy);

        if (mDist < 150) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          
          const alphaFactor = 0.25 * (1 - mDist / 150);
          ctx.strokeStyle = `rgba(56, 189, 248, ${alphaFactor})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          if (p2.isGlowOrb) continue;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < targetDistance) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - dist / targetDistance)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        
        if (p.isGlowOrb) {
          const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          glowGrad.addColorStop(0, `rgba(168, 85, 247, ${p.alpha})`);
          glowGrad.addColorStop(1, "rgba(168, 85, 247, 0)");
          ctx.fillStyle = glowGrad;
        } else {
          ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
        }
        
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useGSAP(() => {
    gsap.from(".reveal-item", {
      opacity: 0,
      scale: 0.8,
      filter: "blur(15px)",
      stagger: 0.35,
      duration: 1.8,
      ease: "power4.out",
      clearProps: "all",
    });
  }, { scope: container });

  const scrollToNextSection = () => {
    const nextSection = container.current?.nextElementSibling;
    if (nextSection) {
      const targetScroll = nextSection.getBoundingClientRect().top + window.scrollY;
      const scrollObj = { y: window.scrollY };
      
      gsap.to(scrollObj, {
        y: targetScroll,
        duration: 1.4,
        ease: "power4.inOut",
        onUpdate: () => {
          window.scrollTo(0, scrollObj.y);
        }
      });
    }
  };

  const futureText = "FUTURE".split("");

  return (
    <section
      id="hero" 
      ref={container}
      className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-[#09090d]"
      style={{ fontFamily: "'Quicksand', 'Inter', sans-serif" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80" />

      <div className="z-10 text-center select-none max-w-5xl px-6 relative">
        <h2 className="reveal-item text-[11px] md:text-xs tracking-[1.2em] text-white/30 uppercase mb-6 font-light">
          Next Gen Agency
        </h2>
        
        <h1 className="reveal-item text-[7vw] md:text-[5.5vw] font-extralight tracking-[0.25em] text-white uppercase leading-none">
          <span className="bg-gradient-to-r from-white via-white/90 to-white/50 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            UNFOLDING{" "}
          </span>
          <span className="inline-block font-normal tracking-[0.2em] uppercase shine-text">
            {futureText.map((letter, index) => (
              <span
                key={index}
                className="dynamic-letter inline-block cursor-none px-[2px]"
              >
                {letter}
              </span>
            ))}
          </span>
        </h1>

        <p className="reveal-item mt-10 text-white/20 max-w-md mx-auto text-xs md:text-sm tracking-[0.15em] font-light leading-relaxed">
          ما مرزهای واقعیت و دنیای دیجیتال را با هنر کدنویسی جابه‌جا می‌کنیم.
        </p>
      </div>

      <div 
        onClick={scrollToNextSection}
        className="reveal-item absolute bottom-12 left-1/2 -translate-x-1/2 z-20 cursor-none group pointer-events-auto flex flex-col items-center justify-center"
      >
        <div className="relative w-16 h-16 flex items-center justify-center rounded-full border border-white/5 bg-white/[0.01] backdrop-blur-[2px] transition-all duration-500 group-hover:border-purple-500/40 group-hover:bg-purple-950/10">
          <div className="absolute inset-0 rounded-full border border-cyan-500/20 radar-pulse-1" />
          <div className="absolute inset-0 rounded-full border border-purple-500/30 radar-pulse-2" />
          
          <svg 
            className="w-4 h-4 text-white/40 group-hover:text-cyan-400 transition-colors duration-300 arrow-slide" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
        
        <span className="text-[9px] tracking-[0.5em] text-white/20 uppercase font-light mt-3 block pl-[0.5em] transition-all duration-300 group-hover:text-white/50 group-hover:tracking-[0.6em]">
          Explore
        </span>
      </div>

      <style jsx>{`
        .shine-text {
          filter: drop-shadow(0 0 25px rgba(168, 85, 247, 0.35));
        }

        .dynamic-letter {
          background: linear-gradient(
            120deg,
            #ffffff 20%,
            #c084fc 40%,
            #38bdf8 60%,
            #ffffff 80%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: textShine 5s linear infinite;

          transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.8s ease;
          will-change: transform, opacity;
          display: inline-block;
        }

        @keyframes textShine {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes radarEcho1 {
          0% { transform: scale(0.9); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        @keyframes radarEcho2 {
          0% { transform: scale(0.8); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: scale(1.9); opacity: 0; }
        }

        @keyframes arrowBounce {
          0%, 100% { transform: translateY(-2px); }
          50% { transform: translateY(4px); }
        }

        .radar-pulse-1 {
          animation: radarEcho1 2.5s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
        }

        .radar-pulse-2 {
          animation: radarEcho2 2.5s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
          animation-delay: 0.8s;
        }

        .arrow-slide {
          animation: arrowBounce 1.8s ease-in-out infinite;
        }

        .dynamic-letter:hover {
          opacity: 0.8;
          transition: transform 0.15s ease-out, opacity 0.15s ease-out;
        }
        .dynamic-letter:nth-child(1):hover { transform: translateY(-12px) rotate(-15deg); }
        .dynamic-letter:nth-child(2):hover { transform: translateY(-18px) rotate(10deg); }
        .dynamic-letter:nth-child(3):hover { transform: translateY(-10px) rotate(-8deg); }
        .dynamic-letter:nth-child(4):hover { transform: translateY(-22px) rotate(15deg); }
        .dynamic-letter:nth-child(5):hover { transform: translateY(-14px) rotate(-12deg); }
        .dynamic-letter:nth-child(6):hover { transform: translateY(-16px) rotate(8deg); }
      `}</style>
    </section>
  );
}