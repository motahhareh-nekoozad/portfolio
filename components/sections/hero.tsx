"use client";
import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useHeroCanvas } from "@/hooks/useHeroCnvas";

export default function HeroSection() {
  const container = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [introFinished, setIntroFinished] = useState(false);

  useHeroCanvas(container, canvasRef);

  useGSAP(() => {
    const isMobile = window.innerWidth < 768;

    gsap.set(".reveal-item", { autoAlpha: 0, scale: 0.96 });

    gsap.to(".reveal-item", {
      autoAlpha: 1,
      scale: 1,
      duration: 1.2,
      stagger: 0.15,
      ease: "power2.out",
      force3D: true,
      onComplete: () => {
        setIntroFinished(true);

        if (isMobile) {
          gsap.to(".dynamic-letter", {
            y: "random(-6, 6)",
            rotation: "random(-5, 5)",
            duration: "random(2.0, 3.0)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: {
              amount: 0.8,
              from: "random"
            }
          });

          const energyWave = gsap.timeline({ repeat: -1, repeatDelay: 3.2 });
          energyWave.to(".dynamic-letter", {
            scale: 1.15,
            duration: 0.5,
            stagger: 0.12,
            ease: "power2.out"
          })
          .to(".dynamic-letter", {
            scale: 1.0,
            duration: 0.5,
            stagger: 0.12,
            ease: "power2.in"
          }, "-=0.35");

        } else {
          gsap.to(".dynamic-letter", {
            y: "random(-6, 6)", 
            rotation: "random(-4, 4)", 
            duration: "random(2.5, 4)", 
            repeat: -1,
            yoyo: true, 
            ease: "sine.inOut",
            stagger: {
              amount: 1.2,
              from: "random"
            }
          });
        }
      },
    });
  }, { scope: container });

  const scrollToNextSection = () => {
    const nextSection = container.current?.nextElementSibling;
    if (nextSection) {
      const targetScroll = nextSection.getBoundingClientRect().top + window.scrollY;
      const scrollObj = { y: window.scrollY };

      gsap.to(scrollObj, {
        y: targetScroll,
        duration: 1.2,
        ease: "power3.inOut",
        onUpdate: () => {
          window.scrollTo(0, scrollObj.y);
        },
      });
    }
  };

  const futureText = "FUTURE".split("");

  return (
    <section
      id="hero"
      ref={container}
      className="h-screen h-[100dvh] w-full flex flex-col items-center justify-center relative overflow-hidden bg-[#09090d]"
      style={{ fontFamily: "'Quicksand', 'Inter', sans-serif" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80" />

      <div className="z-10 text-center select-none max-w-5xl px-6 relative gpu-accelerated">
        <h1 className="reveal-item text-[7vw] md:text-[5.5vw] font-extralight tracking-[0.25em] text-white uppercase leading-none shine-text">
          <span className="bg-gradient-to-r from-white via-white/90 to-white/50 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            UNFOLDING{" "}
          </span>
          <span className="inline-block font-normal tracking-[0.2em] uppercase">
            {futureText.map((letter, index) => (
              <span
                key={index}
                className={`${introFinished ? "dynamic-letter" : "inline-block"} cursor-none px-[2px] touch-none`}
              >
                {letter}
              </span>
            ))}
          </span>
        </h1>
      </div>

      <div
        onClick={scrollToNextSection}
        className="reveal-item absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20 cursor-none group pointer-events-auto flex flex-col items-center justify-center gpu-accelerated"
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
        .gpu-accelerated {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
          will-change: transform, opacity;
        }

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
          transition: transform 1.2s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.8s ease;
          will-change: transform, opacity;
          display: inline-block;
        }

        @keyframes textShine {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes radarEcho1 {
          0% { transform: scale(0.9) translateZ(0); opacity: 0.8; }
          100% { transform: scale(1.5) translateZ(0); opacity: 0; }
        }

        @keyframes radarEcho2 {
          0% { transform: scale(0.8) translateZ(0); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: scale(1.9) translateZ(0); opacity: 0; }
        }

        @keyframes arrowBounce {
          0%, 100% { transform: translateY(-2px) translateZ(0); }
          50% { transform: translateY(4px) translateZ(0); }
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
        .dynamic-letter:nth-child(1):hover { transform: translateY(-12px) rotate(-15deg) translateZ(0); }
        .dynamic-letter:nth-child(2):hover { transform: translateY(-18px) rotate(10deg) translateZ(0); }
        .dynamic-letter:nth-child(3):hover { transform: translateY(-10px) rotate(-8deg) translateZ(0); }
        .dynamic-letter:nth-child(4):hover { transform: translateY(-22px) rotate(15deg) translateZ(0); }
        .dynamic-letter:nth-child(5):hover { transform: translateY(-14px) rotate(-12deg) translateZ(0); }
        .dynamic-letter:nth-child(6):hover { transform: translateY(-16px) rotate(8deg) translateZ(0); }
      `}</style>
    </section>
  );
}