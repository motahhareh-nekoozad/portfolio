"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const RAD_TO_DEG = 180 / Math.PI;

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  
  const state = useRef({
    pos: { x: 0, y: 0 },
    vel: { x: 0, y: 0 },
    mouse: { x: 0, y: 0 },
    hoverScale: 1, 
    isHovered: false,
    revealProgress: 0, 
    hasMoved: false
  });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    document.body.style.cursor = "none";
    gsap.set(cursor, { opacity: 0 });

    const current = state.current;
    let isTicking = false;
    let lastTarget: EventTarget | null = null;

    const updateCursor = () => {
      const dt = 0.15; 
      
      const { mouse, pos, vel } = current;

      const dx = mouse.x - pos.x;
      const dy = mouse.y - pos.y;

      const isHoverTweenActive = gsap.isTweening(current);
      if (
        Math.abs(dx) < 0.05 && 
        Math.abs(dy) < 0.05 && 
        current.revealProgress === 1 && 
        !isHoverTweenActive
      ) {
        pos.x = mouse.x;
        pos.y = mouse.y;
        vel.x = 0;
        vel.y = 0;

        const scaleX = current.hoverScale;
        const scaleY = current.hoverScale;
        cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) rotate(0deg) scale(${scaleX}, ${scaleY})`;
        
        gsap.ticker.remove(updateCursor);
        isTicking = false;
        return;
      }

      pos.x += dx * dt;
      pos.y += dy * dt;

      vel.x = mouse.x - pos.x;
      vel.y = mouse.y - pos.y;
      
      const speedSq = vel.x * vel.x + vel.y * vel.y;
      const speed = Math.min(speedSq * 0.00003, 0.6); 

      const scaleX = (1 + speed) * current.hoverScale * current.revealProgress;
      const scaleY = (1 - speed * 0.5) * current.hoverScale * current.revealProgress;
      
      const angle = Math.atan2(vel.y, vel.x) * RAD_TO_DEG;

      cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;
    };

    const wakeTicker = () => {
      if (!isTicking) {
        isTicking = true;
        gsap.ticker.add(updateCursor);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (document.hidden) return;
      current.mouse.x = e.clientX;
      current.mouse.y = e.clientY;
      
      if (!current.hasMoved) {
        current.hasMoved = true;
        gsap.to(current, {
          revealProgress: 1,
          duration: 0.4,
          ease: "power2.out",
          onUpdate: wakeTicker
        });
        gsap.to(cursor, { opacity: 1, duration: 0.3, overwrite: "auto" });
      }

      if (e.target !== lastTarget) {
        lastTarget = e.target;
        const target = (e.target as HTMLElement).closest?.("button, a, .interactive");
        const shouldHover = !!target;
        
        if (shouldHover !== current.isHovered) {
          current.isHovered = shouldHover;
          if (shouldHover) {
            cursor.classList.add("cursor-hover-active");
            gsap.to(current, {
              hoverScale: 1.8, 
              duration: 0.25,
              overwrite: "auto",
              onUpdate: wakeTicker
            });
          } else {
            cursor.classList.remove("cursor-hover-active");
            gsap.to(current, {
              hoverScale: 1,
              duration: 0.25,
              overwrite: "auto",
              onUpdate: wakeTicker
            });
          }
        }
      }

      wakeTicker();
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const onVisibilityChange = () => {
      if (document.hidden) {
        gsap.ticker.remove(updateCursor);
        isTicking = false;
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      gsap.ticker.remove(updateCursor);
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[99999] mix-blend-screen will-change-transform custom-mercury-cursor"
      />
      
      <style jsx global>{`
        @media (pointer: fine) {
          body, button, a, input, select, textarea, .interactive, button *, a * {
            cursor: none !important;
          }
        }

        @media (pointer: coarse) {
          .custom-mercury-cursor {
            display: none !important;
          }
        }

        .custom-mercury-cursor {
          background: linear-gradient(135deg, #ffffff 0%, #a5f3fc 50%, #38bdf8 100%);
          box-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
          transition: background 0.3s, box-shadow 0.3s, filter 0.3s;
          transform: translate3d(0, 0, 0) translate(-50%, -50%) scale(0);
        }

        .custom-mercury-cursor.cursor-hover-active {
          background: linear-gradient(135deg, #38bdf8 0%, #c084fc 100%) !important;
          box-shadow: 0 0 18px rgba(168, 85, 247, 0.7);
          filter: blur(1px);
        }
      `}</style>
    </>
  );
}