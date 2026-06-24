"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  
  const state = useRef({
    pos: { x: 0, y: 0 },
    vel: { x: 0, y: 0 },
    mouse: { x: 0, y: 0 },
    hoverScale: 1, 
    isHovered: false
  });

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    document.body.style.cursor = "none";
    gsap.set(cursor, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });

    const current = state.current;

    const onMouseMove = (e: MouseEvent) => {
      current.mouse.x = e.clientX;
      current.mouse.y = e.clientY;
      if (gsap.getProperty(cursor, "opacity") === 0) {
        gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.3, overwrite: "auto" });
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const updateCursor = () => {
      const dt = 0.15; 
      current.pos.x += (current.mouse.x - current.pos.x) * dt;
      current.pos.y += (current.mouse.y - current.pos.y) * dt;

      current.vel.x = current.mouse.x - current.pos.x;
      current.vel.y = current.mouse.y - current.pos.y;
      
      const speedSq = current.vel.x * current.vel.x + current.vel.y * current.vel.y;
      const speed = Math.min(speedSq * 0.00003, 0.6); 

      const scaleX = (1 + speed) * current.hoverScale;
      const scaleY = (1 - speed * 0.5) * current.hoverScale;
      const angle = Math.atan2(current.vel.y, current.vel.x) * (180 / Math.PI);

      gsap.set(cursor, {
        x: current.pos.x,
        y: current.pos.y,
        rotation: angle,
        scaleX: scaleX,
        scaleY: scaleY,
      });
    };

    gsap.ticker.add(updateCursor);

    const onMouseEnter = () => {
      current.isHovered = true;
      cursor.classList.add("cursor-hover-active");
      gsap.to(current, {
        hoverScale: 1.8, 
        duration: 0.25,
        overwrite: "auto"
      });
    };

    const onMouseLeave = () => {
      current.isHovered = false;
      cursor.classList.remove("cursor-hover-active");
      gsap.to(current, {
        hoverScale: 1,
        duration: 0.25,
        overwrite: "auto"
      });
    };

    const interactiveElements = document.querySelectorAll("button, a, .interactive");
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", onMouseEnter);
      el.addEventListener("mouseleave", onMouseLeave);
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      gsap.ticker.remove(updateCursor);
      document.body.style.cursor = "auto";
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnter);
        el.removeEventListener("mouseleave", onMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[99999] mix-blend-screen will-change-transform custom-mercury-cursor"
      />
      
      <style jsx global>{`
        body, button, a, input, select, textarea, .interactive, button *, a * {
          cursor: none !important;
        }

        .custom-mercury-cursor {
          background: linear-gradient(135deg, #ffffff 0%, #a5f3fc 50%, #38bdf8 100%);
          box-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
          transition: background 0.3s, box-shadow 0.3s, filter 0.3s;
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