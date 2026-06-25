// components/smooth-scroll.tsx
"use client";
import { ReactLenis } from 'lenis/react';
import { ReactNode, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis 
      ref={lenisRef}
      root 
      options={{ 
        lerp: 0.07, 
        duration: 1.2, 
        smoothWheel: true,
        syncTouch: false, 
        autoRaf: false, 
      }}
    >
      {children}
    </ReactLenis>
  );
}