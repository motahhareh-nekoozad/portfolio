"use client";
import React, { useRef, useEffect, useState, memo, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Plane } from "@react-three/drei";
import * as THREE from "three";
import { ProjectDetail, Project } from "@/components/project-detail";

gsap.registerPlugin(ScrollTrigger);

const PROJECTS: Project[] = [
  {
    id: "01",
    title: "NEXUS BEYOND",
    color: "#0a0303",
    accent: "#ef4444", 
    desc: "آینده‌نگری در طراحی رابط کاربری با تمرکز بر تعاملات سه بعدی و سرعت رندرینگ فوق‌العاده.",
    img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564",
    gallery: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564",
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1000",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000",
    ]
  },
  {
    id: "02",
    title: "CYBER PULSE",
    color: "#030712",
    accent: "#3b82f6", 
    desc: "سیستم مانیتورینگ هوشمند برای دیتاسنترهای نسل جدید با پالت رنگی نئون.",
    img: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=2564",
    gallery: [
      "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=2564",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000",
    ]
  },
  {
    id: "03",
    title: "LIQUID MIND",
    color: "#03140d",
    accent: "#10b981", 
    desc: "تجربه‌ای فراتر از واقعیت در دنیای دیجیتال با هوش مصنوعی.",
    img: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2564",
    gallery: [
      "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2564",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000",
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1000",
    ]
  },
  {
    id: "04",
    title: "SOLARIS WAVE",
    color: "#140c03",
    accent: "#f59e0b", 
    desc: "شبکه‌های هوشمند نسل جدید مبتنی بر بلاکچین برای مدیریت توزیع انرژی پاک.",
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2564",
    gallery: [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2564",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000",
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1000",
    ]
  }
];

const GlobalMercuryBackground = memo(() => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<any>(null!);
  const { viewport } = useThree();
  const lastIndexRef = useRef(0);

  const projectColors = useMemo(() => PROJECTS.map(p => new THREE.Color(p.accent)), []);
  
  const zoomObj = useMemo(() => ({ value: 0 }), []);

  useEffect(() => {
    const handleProjectChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      const index = customEvent.detail.index;
      
      if (index === lastIndexRef.current) return;
      lastIndexRef.current = index;

      if (materialRef.current) {
        const targetColor = projectColors[index];
        gsap.to(materialRef.current.color, {
          r: targetColor.r * 0.05,
          g: targetColor.g * 0.05,
          b: targetColor.b * 0.05,
          duration: 0.8,
          ease: "power2.out"
        });
      }
    };

    const handleExplore = () => {
      gsap.to(zoomObj, {
        value: 1,
        duration: 1.2,
        ease: "power3.inOut"
      });
    };

    const handleBack = () => {
      gsap.to(zoomObj, {
        value: 0,
        duration: 1.0,
        ease: "power3.out"
      });
    };

    window.addEventListener("project-change", handleProjectChange);
    window.addEventListener("project-explore", handleExplore);
    window.addEventListener("project-back", handleBack);

    return () => {
      window.removeEventListener("project-change", handleProjectChange);
      window.removeEventListener("project-explore", handleExplore);
      window.removeEventListener("project-back", handleBack);
    };
  }, [projectColors, zoomObj]);

  useFrame((state) => {
    const { clock, mouse, camera } = state;

    camera.position.z = THREE.MathUtils.lerp(4, -1.2, zoomObj.value);
    camera.fov = THREE.MathUtils.lerp(50, 105, zoomObj.value);
    camera.updateProjectionMatrix();

    if (meshRef.current) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mouse.y * 0.08, 0.05);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mouse.x * 0.08, 0.05);
    }
    if (materialRef.current) {
      materialRef.current.distort = 0.3 + Math.sin(clock.getElapsedTime() * 0.3) * 0.05;
    }
  });

  return (
    <Plane args={[viewport.width * 2, viewport.height * 2, 8, 8]} ref={meshRef}>
      <MeshDistortMaterial
        ref={materialRef}
        speed={1}
        distort={0.3}
        color={projectColors[0].clone().multiplyScalar(0.05)}
        roughness={0.2}
        metalness={0.8}
      />
    </Plane>
  );
});
GlobalMercuryBackground.displayName = "GlobalMercuryBackground";

const BackgroundCanvas = memo(({ active }: { active: boolean }) => {
  return (
    <div className="portfolio-webgl-bg hidden lg:block fixed inset-0 z-0 pointer-events-none opacity-0 will-change-transform">
      <Canvas 
        camera={{ position: [0, 0, 4] }} 
        frameloop={active ? "always" : "never"}
        gl={{ 
          antialias: false, 
          powerPreference: "high-performance", 
          alpha: false,
          stencil: false,
          depth: false,
          failIfMajorPerformanceCaveat: true
        }}
        dpr={1}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[4, 4, 3]} intensity={2.5} color="#ffffff" />
        <directionalLight position={[-4, -4, -3]} intensity={1.5} color="#555555" />
        <pointLight position={[0, 0, 5]} intensity={1.0} />
        <GlobalMercuryBackground />
      </Canvas>
    </div>
  );
}, (prev, next) => prev.active === next.active);
BackgroundCanvas.displayName = "BackgroundCanvas";

export function PortfolioSection() {
  const [hasMounted, setHasMounted] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInView, setIsInView] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  
  const scrollTriggerRef = useRef<any>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleExploreProject = (project: Project, cardIndex: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const clickX = e.clientX;
    const clickY = e.clientY;

    window.dispatchEvent(new CustomEvent("project-explore"));

    gsap.to(".desktop-card", {
      scale: 1.3,
      opacity: 0,
      duration: 1.2,
      ease: "power3.inOut"
    });
    
    gsap.to([".circuit-bg-container", ".portfolio-webgl-bg"], {
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    });

    setActiveProject(project);

    setTimeout(() => {
      gsap.fromTo(".project-detail-container", 
        { clipPath: `circle(0% at ${clickX}px ${clickY}px)` },
        { 
          clipPath: `circle(150% at ${clickX}px ${clickY}px)`, 
          duration: 1.2, 
          ease: "power3.inOut",
          onComplete: () => {
            const trigger = scrollTriggerRef.current;
            if (trigger) {
              const start = trigger.start;
              const end = trigger.end;
              const totalScroll = end - start;
              const targetProgress = cardIndex / (PROJECTS.length - 1);
              const targetScroll = start + totalScroll * targetProgress;
              
              window.scrollTo(0, targetScroll);
              trigger.scroll(targetScroll);
              trigger.update();
            }
            setIsTransitioning(false);
          }
        }
      );
    }, 20);
  };

  const handleBackToGrid = () => {
    if (!activeProject || isTransitioning) return;
    setIsTransitioning(true);

    const currentProject = activeProject;
    const cardIndex = PROJECTS.findIndex(p => p.id === currentProject.id);
    const cardEl = document.querySelectorAll(".desktop-card")[cardIndex];
    const btnEl = cardEl?.querySelector(".unique-btn");

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    if (btnEl) {
      const btnRect = btnEl.getBoundingClientRect();
      targetX = btnRect.left + btnRect.width / 2;
      targetY = btnRect.top + btnRect.height / 2;
    }

    window.dispatchEvent(new CustomEvent("project-back"));

    gsap.to(".project-detail-container", {
      clipPath: `circle(0% at ${targetX}px ${targetY}px)`,
      duration: 1.0,
      ease: "power3.inOut",
      onComplete: () => {
        setActiveProject(null);
        setIsTransitioning(false);
      }
    });

    setTimeout(() => {
      gsap.fromTo(".desktop-card", 
        { scale: 1.3, opacity: 0 }, 
        { scale: 1.0, opacity: 1, duration: 1.0, ease: "power3.out" }
      );
      gsap.fromTo(".circuit-bg-container", 
        { opacity: 0 }, 
        { opacity: 0.35, duration: 0.8, ease: "power2.out" }
      );
      gsap.fromTo(".portfolio-webgl-bg", 
        { opacity: 0 }, 
        { opacity: 0.4, duration: 0.8, ease: "power2.out" }
      );
    }, 50);
  };

  useGSAP(() => {
    if (!hasMounted) return;

    let mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      gsap.fromTo(".portfolio-webgl-bg", 
        { opacity: 0 }, 
        {
          opacity: 0.4,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play reverse play reverse",
            onToggle: (self) => {
              setIsInView(self.isActive);
            }
          }
        }
      );

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

      gsap.set(cards.slice(1), { visibility: "hidden" });

      let lastIndex = 0;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${PROJECTS.length * 105}%`, 
          pin: true,
          scrub: 0.5, 
          invalidateOnRefresh: true, 
          anticipatePin: 1,          
          refreshPriority: 10,
          onUpdate: (self) => {
            const progress = self.progress;
            const index = Math.min(
              Math.floor(progress * PROJECTS.length),
              PROJECTS.length - 1
            );
            if (index !== lastIndex) {
              lastIndex = index;
              window.dispatchEvent(new CustomEvent("project-change", { detail: { index } }));
            }
          }
        }
      });

      scrollTriggerRef.current = tl.scrollTrigger;

      cards.forEach((card, i) => {
        if (i === 0) return;

        const positionInTimeline = (i - 1) * 3; 
        const isBottomToTop = i % 2 == 0; 

        tl.set(card, { visibility: "visible" }, positionInTimeline);

        if (isBottomToTop) {
          tl.fromTo(card, 
            { yPercent: 120, clipPath: "polygon(0 10%, 100% 0%, 100% 100%, 0% 100%)" }, 
            { yPercent: 0, clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", ease: "power2.inOut", duration: 3, force3D: true }, 
            positionInTimeline
          );
          tl.to(cards[i - 1], { scale: 0.93, opacity: 0, yPercent: -15, duration: 3, ease: "power2.inOut", force3D: true }, positionInTimeline);
        } else {
          tl.fromTo(card, 
            { xPercent: -100, clipPath: "polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)" }, 
            { xPercent: 0, clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", ease: "power2.inOut", duration: 3, force3D: true }, 
            positionInTimeline
          );
          tl.to(cards[i - 1], { scale: 0.93, opacity: 0, xPercent: 15, duration: 3, ease: "power2.inOut", force3D: true }, positionInTimeline);
        }

        tl.set(cards[i - 1], { visibility: "hidden" }, positionInTimeline + 3);

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
        scrollTrigger: { 
          trigger: containerRef.current, 
          pin: true, 
          scrub: 0.5, 
          end: () => `+=${horizontalRef.current!.scrollWidth}` 
        }
      });
    });

    return () => mm.revert();
  }, [hasMounted]);

  return (
    <div ref={containerRef} className="portfolio-section-container relative w-full overflow-hidden bg-[#030303]">
      {hasMounted && <BackgroundCanvas active={isInView && !activeProject} />}

      {activeProject && (
        <ProjectDetail project={activeProject} onBack={handleBackToGrid} />
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

                <button 
                  onClick={(e) => handleExploreProject(project, i, e)}
                  className="unique-btn group relative" 
                  style={{ '--accent-color': project.accent } as React.CSSProperties}
                >
                  <span className="btn-content">
                    EXPLORE PROJECT
                    <svg className="w-5 h-5 mr-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </button>
              </div>

              <div className="col-span-6 flex items-center justify-end p-6 perspective-1000 relative">
                <div className="img-portal relative w-[80%] aspect-[4/5] group transition-all duration-700 ease-out layer-optimized mt-16">
                   <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-transparent">
                      <img src={project.img} className="w-full h-full object-cover scale-105 group-hover:scale-100 group-hover:rotate-1 transition-all duration-[1.5s] ease-out filter brightness-[0.7] group-hover:brightness-100" alt={project.title} />
                   </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div ref={horizontalRef} className="flex lg:hidden h-screen items-center px-6 gap-6 w-max relative z-10 layer-optimized">
        {PROJECTS.map((project) => (
          <div key={project.id} className="mobile-card w-[85vw] h-[70vh] shrink-0 rounded-[2.5rem] overflow-hidden border border-white/10 relative">
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
        :global(.scrollbar-hide::-webkit-scrollbar) {
          display: none !important;
        }
        :global(.scrollbar-hide) {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
        .container-optimized {
          content-visibility: auto;
          contain-intrinsic-size: 500px;
        }

        .portfolio-webgl-bg,
        .circuit-bg-container,
        .desktop-card > .grid,
        .mobile-card {
          transition: opacity 0.4s ease-in-out, visibility 0.4s ease-in-out;
        }

        :global(body.is-nav-scrolling) .portfolio-webgl-bg,
        :global(body.is-nav-scrolling) .circuit-bg-container,
        :global(body.is-nav-scrolling) .desktop-card > .grid,
        :global(body.is-nav-scrolling) .mobile-card {
          opacity: 0 !important;
          visibility: hidden !important;
          transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
        }

        .layer-optimized {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        .desktop-card {
          backface-visibility: hidden;
          transform-style: preserve-3d;
          will-change: transform;
        }

        .circuit-bg-container svg {
          transform: translateZ(0);
        }
        .pulse-line, .circuit-dot {
          transform: translateZ(0);
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
          opacity: 0.6;
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
          will-change: transform;
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
    </div>
  );
}