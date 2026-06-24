"use client";
import React, { useRef, useEffect, useState, memo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Plane, Environment } from "@react-three/drei";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  { 
    id: "01", title: "NEXUS BEYOND", color: "#050b14", accent: "#38bdf8", 
    desc: "آینده‌نگری در طراحی رابط کاربری با تمرکز بر تعاملات سه بعدی و سرعت رندرینگ فوق‌العاده.",
    img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564" 
  },
  { 
    id: "02", title: "CYBER PULSE", color: "#0d0d0d", accent: "#c084fc", 
    desc: "سیستم مانیتورینگ هوشمند برای دیتاسنترهای نسل جدید با پالت رنگی نئون.",
    img: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=2564" 
  },
  { 
    id: "03", title: "LIQUID MIND", accent: "#34d399", color: "#050505",
    desc: "تجربه‌ای فراتر از واقعیت در دنیای دیجیتال با هوش مصنوعی.",
    img: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2564" 
  },
];

const GlobalMercuryBackground = memo(({ activeIndex }: { activeIndex: number }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<any>(null!);
  const { viewport } = useThree();

  useEffect(() => {
    if (materialRef.current) {
      const targetColor = new THREE.Color(PROJECTS[activeIndex].accent);
      gsap.to(materialRef.current.color, {
        r: targetColor.r * 0.05, 
        g: targetColor.g * 0.05,
        b: targetColor.b * 0.05,
        duration: 1,
        ease: "power2.out"
      });
    }
  }, [activeIndex]);

  useFrame((state) => {
    const { clock, mouse } = state;
    if (meshRef.current) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mouse.y * 0.1, 0.05);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mouse.x * 0.1, 0.05);
    }
    if (materialRef.current) {
      materialRef.current.distort = 0.3 + Math.sin(clock.getElapsedTime() * 0.3) * 0.05;
    }
  });

  return (
    <Plane args={[viewport.width * 2, viewport.height * 2, 16, 16]} ref={meshRef}>
      <MeshDistortMaterial 
        ref={materialRef}
        color="#030303" 
        metalness={0.95} 
        roughness={0.15} 
        distort={0.3} 
        speed={1.2} 
      />
    </Plane>
  );
});
GlobalMercuryBackground.displayName = "GlobalMercuryBackground";

export function PortfolioSection() {
  const [hasMounted, setHasMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    setHasMounted(true); 
  }, []);

  useGSAP(() => {
    if (!hasMounted) return;

    let mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const cards = gsap.utils.toArray<HTMLElement>(".desktop-card");
      
      const firstCard = cards[0];
      if (firstCard) {
        const firstInfo = firstCard.querySelector(".info-inner");
        const firstImg = firstCard.querySelector(".img-portal");
        const firstCircuit = firstCard.querySelector(".circuit-bg-container");

        gsap.fromTo(firstInfo, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" });
        gsap.fromTo(firstImg, { scale: 1.1, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.5, ease: "power3.out" });
        gsap.fromTo(firstCircuit, { opacity: 0 }, { opacity: 0.35, duration: 2, ease: "power3.out" });
      }

      let lastIndex = 0;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${PROJECTS.length * 150}%`,
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const index = Math.min(
              Math.floor(progress * PROJECTS.length),
              PROJECTS.length - 1
            );
            if (index !== lastIndex) {
              lastIndex = index;
              setActiveIndex(index);
            }
          }
        }
      });

      cards.forEach((card, i) => {
        if (i === 0) return;

        const positionInTimeline = (i - 1) * 3; 

        tl.fromTo(card, 
          { 
            yPercent: 120, 
            clipPath: "polygon(0 10%, 100% 0%, 100% 100%, 0% 100%)",
            opacity: 1 
          }, 
          { 
            yPercent: 0, 
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            ease: "power2.inOut", 
            duration: 3 
          }, 
          positionInTimeline
        );

        tl.to(cards[i - 1], {
          scale: 0.93,
          opacity: 0, 
          yPercent: -15,
          duration: 3,
          ease: "power2.inOut"
        }, positionInTimeline);

        const info = card.querySelector(".info-inner");
        const imgPortal = card.querySelector(".img-portal");
        const circuit = card.querySelector(".circuit-bg-container");

        if (info) tl.fromTo(info, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, positionInTimeline + 1.2);
        if (imgPortal) tl.fromTo(imgPortal, { scale: 1.15, rotateX: -5, opacity: 0 }, { scale: 1, rotateX: 0, opacity: 1, duration: 1.5 }, positionInTimeline + 0.8);
        if (circuit) tl.fromTo(circuit, { opacity: 0 }, { opacity: 0.35, duration: 2 }, positionInTimeline + 0.5);
      });
    });

    mm.add("(max-width: 1023px)", () => {
      gsap.to(horizontalRef.current, {
        x: () => -(horizontalRef.current!.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: { trigger: containerRef.current, pin: true, scrub: 1, end: () => `+=${horizontalRef.current!.scrollWidth}` }
      });
    });

    return () => mm.revert();
  }, [hasMounted]);

  return (
    <section id="portfolio"  ref={containerRef} suppressHydrationWarning className="relative w-full bg-[#030303] overflow-hidden text-white font-sans h-screen select-none">

      {hasMounted && (
        <div className="hidden lg:block fixed inset-0 z-0 pointer-events-none opacity-40 will-change-transform">
          <Canvas camera={{ position: [0, 0, 4] }} gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}>
            <Environment preset="studio" />
            <GlobalMercuryBackground activeIndex={activeIndex} />
          </Canvas>
        </div>
      )}

      <div className="hidden lg:block relative h-screen w-full">
        {PROJECTS.map((project, i) => (
          <div 
            key={project.id} 
            className="desktop-card absolute inset-0 h-screen w-full flex overflow-hidden bg-gradient-to-b from-transparent to-[#030303] will-change-transform" 
            style={{ zIndex: (i + 1) * 10, '--accent-color': project.accent } as React.CSSProperties}
          >
            <div className="circuit-bg-container absolute inset-0 w-full h-full opacity-35 pointer-events-none transition-opacity duration-1000 layer-optimized">
              <svg className="w-full h-full" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 150H300L450 300H900L1000 200H1500L1580 280H1920" stroke="rgba(255,255,255,0.02)" strokeWidth="1.5" />
                <path d="M1920 850H1600L1450 700H1100L950 850H400L300 750H0" stroke="rgba(255,255,255,0.02)" strokeWidth="1.5" />
                <path d="M500 0V400L650 550V1080" stroke="rgba(255,255,255,0.01)" strokeWidth="1" />
                <path d="M1400 1080V680L1250 530V0" stroke="rgba(255,255,255,0.01)" strokeWidth="1" />
                
                <path d="M0 450H200L320 570H750L820 500H1300L1420 620H1920" stroke="rgba(255,255,255,0.02)" strokeWidth="1.2" />
                <path d="M150 1080V800L280 670H600L700 770V1080" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
                <path d="M1750 0V350L1600 500H1150L1050 400V0" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
                <path d="M960 0V250L900 310H450" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />

                <path className="pulse-line path-long" d="M0 150H300L450 300H900L1000 200H1500L1580 280H1920" stroke="var(--accent-color)" strokeWidth="2.5" strokeLinecap="round" />
                <path className="pulse-line path-long delay-1" d="M1920 850H1600L1450 700H1100L950 850H400L300 750H0" stroke="var(--accent-color)" strokeWidth="2.5" strokeLinecap="round" />
                <path className="pulse-line path-vert delay-2" d="M500 0V400L650 550V1080" stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" />
                <path className="pulse-line path-vert delay-3" d="M1400 1080V680L1250 530V0" stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" />
                
                <path className="pulse-line path-mid delay-4" d="M0 450H200L320 570H750L820 500H1300L1420 620H1920" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" />
                <path className="pulse-line path-vert delay-5" d="M150 1080V800L280 670H600L700 770V1080" stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" />
                <path className="pulse-line path-mid delay-6" d="M1750 0V350L1600 500H1150L1050 400V0" stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" />

                <circle cx="300" cy="150" r="4" fill="var(--accent-color)" className="circuit-dot" />
                <circle cx="450" cy="300" r="4" fill="var(--accent-color)" className="circuit-dot" />
                <circle cx="1000" cy="200" r="4" fill="var(--accent-color)" className="circuit-dot" />
                <circle cx="1450" cy="700" r="4" fill="var(--accent-color)" className="circuit-dot" />
                <circle cx="400" cy="850" r="4" fill="var(--accent-color)" className="circuit-dot" />
                <circle cx="200" cy="450" r="3.5" fill="var(--accent-color)" className="circuit-dot dot-delay" />
                <circle cx="320" cy="570" r="3.5" fill="var(--accent-color)" className="circuit-dot" />
                <circle cx="820" cy="500" r="3.5" fill="var(--accent-color)" className="circuit-dot dot-delay" />
                <circle cx="1420" cy="620" r="3.5" fill="var(--accent-color)" className="circuit-dot" />
                <circle cx="280" cy="670" r="3" fill="var(--accent-color)" className="circuit-dot dot-delay" />
                <circle cx="1600" cy="500" r="3" fill="var(--accent-color)" className="circuit-dot" />
              </svg>
            </div>

            <div className="grid grid-cols-12 w-full h-full relative z-10 px-20 xl:px-32 items-center">
              <div className="info-inner col-span-6 flex flex-col justify-center relative pr-12 border-r border-white/5">
                <span className="text-[18rem] font-black text-white/[0.01] absolute -top-36 right-0 leading-none select-none italic font-mono">{project.id}</span>
                
                <h2 className="text-7xl xl:text-8xl font-black text-white leading-none tracking-tighter mb-6 shine-effect select-none">
                  {project.title}
                </h2>
                
                <p className="text-white/60 text-lg xl:text-xl font-light max-w-lg mb-10 leading-relaxed text-justify">
                  {project.desc}
                </p>

                <button className="unique-btn group relative" style={{ '--accent-color': project.accent } as React.CSSProperties}>
                  <span className="btn-content">
                    EXPLORE PROJECT
                    <svg className="w-5 h-5 mr-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </button>
              </div>

              <div className="col-span-6 flex items-center justify-end p-6 perspective-1000">
                <div className="img-portal relative w-[80%] aspect-[4/5] group transition-all duration-700 ease-out layer-optimized">
                   <div className="absolute -inset-1 bg-gradient-to-r from-transparent to-white/10 rounded-[2.5rem] blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-700" />
                   <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.9)] bg-zinc-900">
                      <img src={project.img} className="w-full h-full object-cover scale-105 group-hover:scale-100 group-hover:rotate-1 transition-all duration-[1.5s] ease-out filter brightness-70 group-hover:brightness-100" alt={project.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent opacity-70" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div ref={horizontalRef} className="flex lg:hidden h-screen items-center px-6 gap-6 w-max relative z-10 layer-optimized">
        {PROJECTS.map((project) => (
          <div key={project.id} className="mobile-card w-[85vw] h-[70vh] shrink-0 rounded-[2.5rem] overflow-hidden border border-white/10 relative shadow-2xl">
            <img src={project.img} className="absolute inset-0 w-full h-full object-cover opacity-40" alt={project.title} />
            <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black via-black/40 to-transparent">
              <span className="text-xs font-mono tracking-widest text-white/40 mb-2">{project.id} / PROJECT</span>
              <h3 className="text-4xl font-black text-white leading-none">{project.title}</h3>
              <div className="w-16 h-[2px] mt-4" style={{ backgroundColor: project.accent }} />
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .layer-optimized {
          will-change: transform;
          contain: paint;
        }
        .shine-effect {
          background: linear-gradient(90deg, #fff 0%, #555 25%, #fff 50%, #555 75%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 6s linear infinite;
        }
        @keyframes shine { to { background-position: 200% center; } }
        .perspective-1000 { perspective: 1200px; }

        .pulse-line {
          stroke-dashoffset: 0;
          animation: circuitFlow 7s linear infinite;
          filter: drop-shadow(0 0 10px var(--accent-color)) drop-shadow(0 0 3px var(--accent-color));
          opacity: 0.85;
          will-change: stroke-dashoffset;
        }

        .path-long { stroke-dasharray: 200 1200; }
        .path-mid { stroke-dasharray: 120 800; animation-duration: 5s; }
        .path-vert { stroke-dasharray: 80 600; animation-duration: 6s; }

        .delay-1 { animation-delay: -1.5s; animation-direction: reverse; }
        .delay-2 { animation-delay: -3s; }
        .delay-3 { animation-delay: -4.5s; animation-direction: reverse; }
        .delay-4 { animation-delay: -1s; }
        .delay-5 { animation-delay: -2.5s; }
        .delay-6 { animation-delay: -5s; animation-direction: reverse; }

        @keyframes circuitFlow {
          0% { stroke-dashoffset: 1400; }
          100% { stroke-dashoffset: 0; }
        }

        .circuit-dot {
          animation: dotPulse 1.5s ease-in-out infinite alternate;
          filter: drop-shadow(0 0 5px var(--accent-color));
          will-change: opacity, r;
        }
        .dot-delay { animation-delay: -0.75s; }

        @keyframes dotPulse {
          0% { opacity: 0.4; r: 2.5px; }
          100% { opacity: 1; r: 4.5px; }
        }

        .unique-btn {
          position: relative;
          width: fit-content;
          padding: 3px;
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
          background: conic-gradient(transparent, transparent, var(--accent-color), transparent);
          animation: rotateBtnBorder 4s linear infinite;
          z-index: 1;
        }
        @keyframes rotateBtnBorder { 100% { transform: rotate(360deg); } }
        .btn-content {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px 32px;
          background: #09090b;
          border-radius: 10px;
          color: #fff;
          font-weight: 700;
          font-size: 0.875rem;
          letter-spacing: 0.15em;
          z-index: 2;
          transition: all 0.3s ease;
        }
        .unique-btn:hover {
          box-shadow: 0 0 35px var(--accent-color);
          transform: translateY(-2px);
        }
        .unique-btn:hover .btn-content {
          background: transparent;
          color: #000;
          font-weight: 900;
        }
        .unique-btn:hover::before {
          background: var(--accent-color);
          animation: none;
        }
      `}</style>
    </section>
  );
}