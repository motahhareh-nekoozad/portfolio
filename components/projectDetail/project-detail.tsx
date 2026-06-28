"use client";
import React, { useRef, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Project } from "@/types/type";
import { TechGridBg } from "@/components/projectDetail/tech-grid-bg";
import { BackButton } from "@/components/projectDetail/back-button";
import { DetailsPane } from "@/components/projectDetail/details-pane";
import { GalleryPane } from "@/components/projectDetail/gallery-pane";
import { ToggleButton } from "@/components/projectDetail/toggle-button";

gsap.registerPlugin(ScrollTrigger);

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export const ProjectDetail = ({ project, onBack }: ProjectDetailProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolledToGallery, setIsScrolledToGallery] = useState(false);

  const handleMainScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (scrollTop > 180) {
      setIsScrolledToGallery((prev) => (prev ? prev : true));
    } else {
      setIsScrolledToGallery((prev) => (prev ? false : prev));
    }
  }, []);

  const handleToggleSection = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: isScrolledToGallery ? 0 : window.innerHeight,
        behavior: "smooth"
      });
    }
  }, [isScrolledToGallery]);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(".tech-grid-bg", { opacity: 0 }, { opacity: 1, duration: 1.2 });
    
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

    tl.fromTo(".piece-0", { x: -60, y: -60, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 1.1, ease: "power4.out" }, "-=0.8");
    tl.fromTo(".piece-1", { x: 60, y: -60, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 1.1, ease: "power4.out" }, "-=0.95");
    tl.fromTo(".piece-2", { x: -60, y: 60, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 1.1, ease: "power4.out" }, "-=0.95");
    tl.fromTo(".piece-3", { x: 60, y: 60, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 1.1, ease: "power4.out" }, "-=0.95");

  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef} 
      onScroll={handleMainScroll}
      className="project-detail-container fixed inset-0 z-50 bg-[#030303] text-white flex flex-col lg:flex-row overflow-y-auto overflow-x-hidden lg:overflow-hidden select-none"
      dir="rtl"
      style={{ '--accent-glow': project.accent } as React.CSSProperties}
    >
      <TechGridBg project={project} />

      <BackButton project={project} onBack={onBack} />

      <DetailsPane project={project} />

      <GalleryPane project={project} />

      <ToggleButton 
        isScrolledToGallery={isScrolledToGallery} 
        onClick={handleToggleSection} 
        accent={project.accent} 
      />
    </div>
  );
};