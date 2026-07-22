"use client";
import React, { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProjectDetail } from "@/components/projectDetail/project-detail";
import { PROJECTS } from "@/data/project-data"
import { DesktopCard } from "@/components/portfolio/desktop-card";
import { MobileCard } from "@/components/portfolio/mobile-card";

const BackgroundCanvas = dynamic(
  () =>
    import("@/components/portfolio/background-canvas").then((m) => ({
      default: m.BackgroundCanvas,
    })),
  { ssr: false }
);

gsap.registerPlugin(ScrollTrigger);

export function PortfolioSection() {
  const [hasMounted, setHasMounted] = useState(false);
  const [activeProject, setActiveProject] = useState<any>(null);
  const [isDetailed, setIsDetailed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<any>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => setIsTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isDetailed ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isDetailed]);

  const handleExploreProject = (project: any, cardIndex: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const isDesktop = window.innerWidth >= 1024;
    const cardEl = isDesktop 
      ? document.querySelectorAll(".desktop-card")[cardIndex]
      : document.querySelectorAll(".mobile-card")[cardIndex];

    const infoInner = cardEl?.querySelector(isDesktop ? ".info-inner" : ".mobile-info-inner");
    const imgPortal = cardEl?.querySelector(".img-portal");
    const lampContainer = cardEl?.querySelector(".lamp-container");
    const lightCone = cardEl?.querySelector(".light-cone");
    const imageGlowOverlay = cardEl?.querySelector(".image-glow-overlay");
    const projectImg = cardEl?.querySelector(".project-img");

    const lampTimeline = gsap.timeline({
      onComplete: () => {
        window.dispatchEvent(new CustomEvent("project-explore"));

        if (infoInner) {
          gsap.to(infoInner, {
            xPercent: isDesktop ? -40 : 0,
            yPercent: isDesktop ? 0 : 30,
            opacity: 0,
            duration: 1.0,
            ease: "power3.inOut",
            force3D: true
          });
        }

        if (imgPortal) {
          gsap.to(imgPortal, {
            scale: isDesktop ? 3.5 : 2.0,
            rotateY: isDesktop ? 15 : 0,
            z: isDesktop ? 300 : 80,
            opacity: 0,
            duration: 1.2,
            ease: "power3.inOut",
            force3D: true
          });
        }
        
        gsap.to([".circuit-bg-container", ".portfolio-webgl-bg"], {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          force3D: true
        });

        setActiveProject(project);
        setIsDetailed(true);

        setTimeout(() => {
          gsap.fromTo(".project-detail-container", 
            { scale: 0.35, opacity: 0, filter: "blur(25px)", transformOrigin: "center center" },
            { 
              scale: 1.0, 
              opacity: 1, 
              filter: "blur(0px)",
              duration: 1.3, 
              ease: "power4.out",
              force3D: true,
              onComplete: () => {
                const trigger = scrollTriggerRef.current;
                if (trigger && isDesktop) {
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
        }, 30);
      }
    });

    if (lampContainer && lightCone && imageGlowOverlay && projectImg) {
      lampTimeline
        .to(lampContainer, { opacity: 1, duration: 0.1 })
        .to(lightCone, { opacity: 0.8, scaleY: 1.1, duration: 0.08, ease: "rough" })
        .to(lightCone, { opacity: 0.2, scaleY: 0.9, duration: 0.05 })
        .to(lightCone, { opacity: 1, scaleY: 1.0, duration: 0.12 })
        .to(imageGlowOverlay, { opacity: 1, duration: 0.2 }, "<")
        .to(projectImg, { filter: "brightness(1.15) contrast(1.05)", duration: 0.2 }, "<")
        .to({}, { duration: 0.4 });
    } else {
      lampTimeline.to({}, { duration: 0.1 });
    }
  };

  const handleBackToGrid = () => {
    if (!activeProject || isTransitioning) return;
    setIsTransitioning(true);
    setIsDetailed(false);

    const currentProject = activeProject;
    const cardIndex = PROJECTS.findIndex(p => p.id === currentProject.id);

    const isDesktop = window.innerWidth >= 1024;
    const cardEl = isDesktop 
      ? document.querySelectorAll(".desktop-card")[cardIndex]
      : document.querySelectorAll(".mobile-card")[cardIndex];

    const infoInner = cardEl?.querySelector(isDesktop ? ".info-inner" : ".mobile-info-inner");
    const imgPortal = cardEl?.querySelector(".img-portal");

    window.dispatchEvent(new CustomEvent("project-back"));

    gsap.to(".project-detail-container", {
      scale: 1.4,
      opacity: 0,
      filter: "blur(20px)",
      duration: 1.1,
      ease: "power3.inOut",
      force3D: true,
      onComplete: () => {
        setActiveProject(null);
        setIsTransitioning(false);
      }
    });

    setTimeout(() => {
      if (imgPortal) {
        gsap.fromTo(imgPortal, 
          { scale: isDesktop ? 3.5 : 2.0, rotateY: isDesktop ? 15 : 0, z: isDesktop ? 300 : 80, opacity: 0 }, 
          { 
            scale: 1.0, 
            rotateY: 0,
            z: 0,
            opacity: 1, 
            duration: 1.2, 
            ease: "power3.out",
            force3D: true,
            onComplete: () => {
              gsap.set(imgPortal, { clearProps: "scale,transform,opacity,rotateY,z" });
              if (isDesktop && scrollTriggerRef.current && scrollTriggerRef.current.animation) {
                scrollTriggerRef.current.animation.progress(scrollTriggerRef.current.progress);
              }
            }
          }
        );
      }

      if (infoInner) {
        gsap.fromTo(infoInner,
          { xPercent: isDesktop ? -40 : 0, yPercent: isDesktop ? 0 : 30, opacity: 0 },
          {
            xPercent: 0,
            yPercent: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            force3D: true,
            onComplete: () => {
              gsap.set(infoInner, { clearProps: "transform,xPercent,yPercent,opacity" });
            }
          }
        );
      }

      gsap.to(".lamp-container", { opacity: 0, duration: 0.4 });
      gsap.to(".light-cone", { opacity: 0, duration: 0.4 });
      gsap.to(".image-glow-overlay", { opacity: 0, duration: 0.4 });
      gsap.to(".project-img", { filter: "brightness(0.7) contrast(1)", duration: 0.4 });

      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.update();
      }

      gsap.fromTo(".circuit-bg-container", { opacity: 0 }, { opacity: 0.35, duration: 0.8, ease: "power2.out", force3D: true });
      gsap.fromTo(".portfolio-webgl-bg", { opacity: 0 }, { opacity: 0.4, duration: 0.8, ease: "power2.out", force3D: true });
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
            onToggle: (self) => { setIsInView(self.isActive); }
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
            const index = Math.min(Math.floor(progress * PROJECTS.length), PROJECTS.length - 1);
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

        if (info) tl.fromTo(info, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, force3D: true }, positionInTimeline + 1.2);
        if (imgPortal) tl.fromTo(imgPortal, { scale: 1.15, rotateX: -5, opacity: 0 }, { scale: 1, rotateX: 0, opacity: 1, duration: 1.5, force3D: true }, positionInTimeline + 0.8);
        if (circuit) tl.fromTo(circuit, { opacity: 0 }, { opacity: 0.35, duration: 2, force3D: true }, positionInTimeline + 0.5);
      });
    });

    mm.add("(max-width: 1023px)", () => {
      const clampSkew = gsap.utils.clamp(-12, 12);
      const clampScale = gsap.utils.clamp(0.96, 1.08);

      const mainMobileTimeline = gsap.to(horizontalRef.current, {
        x: () => -(horizontalRef.current!.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: { 
          trigger: containerRef.current, 
          pin: true, 
          scrub: 0.5, 
          end: () => `+=${horizontalRef.current!.scrollWidth}`,
          onUpdate: (self) => {
            const velocity = self.getVelocity();
            const skew = clampSkew(-velocity / 300);
            const scale = clampScale(1 + Math.abs(velocity) / 6000);
            
            gsap.to(".mobile-card", {
              skewX: skew,
              scaleX: scale,
              transformOrigin: velocity > 0 ? "right center" : "left center",
              duration: 0.45,
              ease: "power2.out",
              overwrite: "auto"
            });
          },
          onToggle: (self) => {
            if (!self.isActive) {
              gsap.to(".mobile-card", { skewX: 0, scaleX: 1, duration: 0.6, ease: "power2.out" });
            }
          }
        }
      });

      const mobileCards = gsap.utils.toArray<HTMLElement>(".mobile-card");
      mobileCards.forEach((card) => {
        const info = card.querySelector(".mobile-info-inner");
        const img = card.querySelector(".img-portal");
        
        gsap.fromTo(info, 
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: mainMobileTimeline,
              start: "left 85%",
              end: "left 40%",
              scrub: true,
            }
          }
        );

        gsap.fromTo(img,
          { scale: 0.9, opacity: 0.6, rotateY: -10 },
          {
            scale: 1,
            opacity: 1,
            rotateY: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: mainMobileTimeline,
              start: "left 90%",
              end: "left 45%",
              scrub: true,
            }
          }
        );
      });
    });

    return () => mm.revert();
  }, [hasMounted]);

  return (
    <div 
      ref={containerRef} 
      className={`portfolio-section-container relative w-full overflow-hidden bg-[#030303] ${isDetailed ? "is-detailed" : ""}`}
    >
      {hasMounted && <BackgroundCanvas active={isInView && isTabVisible && !activeProject} />}

      {activeProject && (
        <ProjectDetail project={activeProject} onBack={handleBackToGrid} />
      )}

      {/* DESKTOP VERSION */}
      <div className="hidden lg:block relative h-screen w-full">
        {PROJECTS.map((project, i) => (
          <DesktopCard 
            key={project.id} 
            project={project} 
            index={i} 
            onExplore={handleExploreProject} 
          />
        ))}
      </div>

      {/* MOBILE VERSION */}
      <div ref={horizontalRef} className="flex lg:hidden h-screen items-center px-6 gap-6 w-max relative z-10 layer-optimized">
        {PROJECTS.map((project, i) => (
          <MobileCard 
            key={project.id} 
            project={project} 
            index={i} 
            onExplore={handleExploreProject} 
          />
        ))}
      </div>

      <style jsx global>{`
        .portfolio-section-container .scrollbar-hide::-webkit-scrollbar {
          display: none !important;
        }
        .portfolio-section-container .scrollbar-hide {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
        .portfolio-section-container .container-optimized {
          content-visibility: auto;
          contain-intrinsic-size: 500px;
        }

        .project-detail-container {
          opacity: 0;
          transform: scale(0.35);
          filter: blur(25px);
          will-change: transform, opacity, filter;
        }

        .portfolio-section-container .portfolio-webgl-bg,
        .portfolio-section-container .circuit-bg-container,
        .portfolio-section-container .desktop-card > .grid,
        .portfolio-section-container .mobile-card {
          transition: opacity 0.4s ease-in-out, visibility 0.4s ease-in-out;
        }

        /* [تغییر کوچک] برای مهار نورهای اضافی در حاشیه گرد کارت موبایل */
        .portfolio-section-container .mobile-card {
          overflow: hidden !important;
          -webkit-mask-image: -webkit-radial-gradient(white, black);
        }

        body.is-nav-scrolling .portfolio-section-container .portfolio-webgl-bg,
        body.is-nav-scrolling .portfolio-section-container .circuit-bg-container,
        body.is-nav-scrolling .portfolio-section-container .desktop-card > .grid,
        body.is-nav-scrolling .portfolio-section-container .mobile-card {
          opacity: 0 !important;
          visibility: hidden !important;
          transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
        }

        .portfolio-section-container.is-detailed .circuit-bg-container,
        .portfolio-section-container.is-detailed .portfolio-webgl-bg,
        .portfolio-section-container.is-detailed .desktop-card,
        .portfolio-section-container.is-detailed .mobile-card {
          visibility: hidden !important;
          pointer-events: none !important;
        }
        .portfolio-section-container.is-detailed .pulse-line,
        .portfolio-section-container.is-detailed .circuit-dot {
          animation-play-state: paused !important;
        }

        .portfolio-section-container .layer-optimized {
          will-change: transform, opacity;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        .portfolio-section-container .desktop-card {
          backface-visibility: hidden;
          transform-style: preserve-3d;
          will-change: transform, opacity;
          transform: translateZ(0);
        }

        /* [تغییر کوچک] اعمال ماسک گردی کارت به درگاه تصویر در زمان انیمیشن ها */
        .portfolio-section-container .img-portal {
          overflow: hidden !important;
          -webkit-mask-image: -webkit-radial-gradient(white, black);
        }

        .portfolio-section-container .img-portal, 
        .portfolio-section-container .info-inner, 
        .portfolio-section-container .mobile-info-inner {
          will-change: transform, opacity;
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        .portfolio-section-container .circuit-bg-container svg {
          transform: translateZ(0);
          contain: paint layout;
        }
        .portfolio-section-container .pulse-line, 
        .portfolio-section-container .circuit-dot {
          transform: translateZ(0);
          will-change: stroke-dashoffset, opacity;
        }
        .portfolio-section-container .shine-effect {
          background: linear-gradient(90deg, #fff 0%, #555 25%, #fff 50%, #555 75%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 6s linear infinite;
        }
        @keyframes shine { to { background-position: 200% center; } }
        .portfolio-section-container .perspective-1000 { perspective: 1200px; }

        .portfolio-section-container .pulse-line {
          stroke-dashoffset: 0;
          animation: circuitFlow 7s linear infinite;
          opacity: 0.6;
          will-change: stroke-dashoffset;
        }

        .portfolio-section-container .path-long { stroke-dasharray: 200 1200; }
        .portfolio-section-container .path-mid { stroke-dasharray: 120 800; animation-duration: 5s; }
        .portfolio-section-container .path-vert { stroke-dasharray: 80 600; animation-duration: 6s; }

        .portfolio-section-container .delay-1 { animation-delay: -1.5s; animation-direction: reverse; }
        .portfolio-section-container .delay-2 { animation-delay: -3s; }
        .portfolio-section-container .delay-3 { animation-delay: -4.5s; animation-direction: reverse; }
        .portfolio-section-container .delay-4 { animation-delay: -1s; }
        .portfolio-section-container .delay-5 { animation-delay: -2.5s; }
        .portfolio-section-container .delay-6 { animation-delay: -5s; animation-direction: reverse; }

        @keyframes circuitFlow {
          0% { stroke-dashoffset: 1400; }
          100% { stroke-dashoffset: 0; }
        }

        .portfolio-section-container .circuit-dot {
          animation: dotPulse 1.5s ease-in-out infinite alternate;
          will-change: opacity, r;
        }
        .portfolio-section-container .dot-delay { animation-delay: -0.75s; }

        @keyframes dotPulse {
          0% { opacity: 0.4; r: 2.5px; }
          100% { opacity: 1; r: 4.5px; }
        }

        .portfolio-section-container .lamp-emitter {
          position: relative;
          z-index: 30;
        }
        .portfolio-section-container .light-cone {
          filter: blur(8px);
          pointer-events: none;
          transform-style: preserve-3d;
          will-change: opacity, transform;
        }

        .portfolio-section-container .bg-grid-pattern {
          background-size: 24px 24px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
        }

        .portfolio-section-container .unique-btn {
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
        .portfolio-section-container .unique-btn::before {
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
        .portfolio-section-container .btn-content {
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
        .portfolio-section-container .unique-btn:hover {
          box-shadow: 0 0 35px var(--accent-color);
          transform: translateY(-2px);
        }
        .portfolio-section-container .unique-btn:hover .btn-content {
          background: transparent;
          color: #000;
          font-weight: 900;
        }
        .portfolio-section-container .unique-btn:hover::before {
          background: var(--accent-color);
          animation: none;
        }
      `}</style>
    </div>
  );
}