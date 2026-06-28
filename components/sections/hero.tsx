"use client";
import React, { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function HeroSection() {
  const container = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const initMobileCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      let width = window.innerWidth;
      let height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      interface MobileParticle {
        x: number;
        y: number;
        vx: number;
        vy: number;
        anchorX: number;
        anchorY: number;
        vxDrift: number;
        vyDrift: number;
        radius: number;
        alpha: number;
        isSpark: boolean;
        active: boolean;
        color: string;
        life: number;
        maxLife: number;
      }

      const maxBackgroundParticles = 48;
      const maxSparks = 20;
      const totalParticles = maxBackgroundParticles + maxSparks;
      const particles: MobileParticle[] = [];
      let animationFrameId: number;
      
      let containerOffsetTop = 0;
      let containerOffsetLeft = 0;

      const calculateOffsets = () => {
        if (!container.current) return;
        const rect = container.current.getBoundingClientRect();
        containerOffsetTop = rect.top + window.scrollY;
        containerOffsetLeft = rect.left + window.scrollX;
      };
      calculateOffsets();

      const connectionDistance = 90;
      const connectionDistanceSq = connectionDistance * connectionDistance;

      for (let i = 0; i < maxBackgroundParticles; i++) {
        const colorRand = Math.random();
        let color = "255, 255, 255";
        if (colorRand > 0.65) color = "56, 189, 248";
        else if (colorRand > 0.35) color = "168, 85, 247";

        const spawnX = Math.random() * width;
        const spawnY = Math.random() * height;

        particles.push({
          x: spawnX,
          y: spawnY,
          vx: 0,
          vy: 0,
          anchorX: spawnX,
          anchorY: spawnY,
          vxDrift: (Math.random() - 0.5) * 0.75,
          vyDrift: (Math.random() - 0.5) * 0.75,
          radius: Math.random() * 1.3 + 0.6,
          alpha: Math.random() * 0.45 + 0.15,
          isSpark: false,
          active: true,
          color,
          life: 0,
          maxLife: 0,
        });
      }

      for (let i = 0; i < maxSparks; i++) {
        particles.push({
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          anchorX: 0,
          anchorY: 0,
          vxDrift: 0,
          vyDrift: 0,
          radius: 0,
          alpha: 0,
          isSpark: true,
          active: false,
          color: "56, 189, 248",
          life: 0,
          maxLife: 0,
        });
      }

      let touchActive = false;
      let touchX = 0;
      let touchY = 0;
      let touchGlowAlpha = 0;

      const spawnSparkle = (clientX: number, clientY: number) => {
        const x = clientX - containerOffsetLeft;
        const y = clientY - containerOffsetTop;

        let spawned = 0;
        for (let i = maxBackgroundParticles; i < totalParticles; i++) {
          if (!particles[i].active) {
            const p = particles[i];
            p.active = true;
            p.x = x;
            p.y = y;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2.8 + 1.2; 
            p.vx = Math.cos(angle) * speed;
            p.vy = Math.sin(angle) * speed - 0.5;
            p.radius = Math.random() * 1.4 + 0.8;
            p.alpha = 1.0;
            p.color = Math.random() > 0.5 ? "56, 189, 248" : "168, 85, 247";
            p.life = 30;
            p.maxLife = 30;
            
            spawned++;
            if (spawned >= 2) break;
          }
        }
      };

      const updateTouch = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          touchActive = true;
          touchX = e.touches[0].clientX - containerOffsetLeft;
          touchY = e.touches[0].clientY - containerOffsetTop;
          spawnSparkle(e.touches[0].clientX, e.touches[0].clientY);
        }
      };

      const onTouchEnd = () => {
        touchActive = false;
      };

      window.addEventListener("touchmove", updateTouch, { passive: true });
      window.addEventListener("touchstart", updateTouch, { passive: true });
      window.addEventListener("touchend", onTouchEnd, { passive: true });

      const animate = () => {
        ctx.clearRect(0, 0, width, height);

        if (touchActive) {
          touchGlowAlpha += (1 - touchGlowAlpha) * 0.12;
        } else {
          touchGlowAlpha += (0 - touchGlowAlpha) * 0.08;
        }

        if (touchGlowAlpha > 0.01) {
          const grad = ctx.createRadialGradient(touchX, touchY, 0, touchX, touchY, 130);
          grad.addColorStop(0, `rgba(168, 85, 247, ${touchGlowAlpha * 0.16})`);
          grad.addColorStop(0.5, `rgba(56, 189, 248, ${touchGlowAlpha * 0.07})`);
          grad.addColorStop(1, "rgba(9, 9, 13, 0)");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
        }

        ctx.beginPath();
        ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
        ctx.lineWidth = 0.55;
        for (let i = 0; i < maxBackgroundParticles; i++) {
          const p1 = particles[i];
          for (let j = i + 1; j < maxBackgroundParticles; j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < connectionDistanceSq) {
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
            }
          }
        }
        ctx.stroke();

        for (let i = 0; i < totalParticles; i++) {
          const p = particles[i];
          if (!p.active) continue;

          if (p.isSpark) {
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            p.alpha = p.life / p.maxLife;
            if (p.life <= 0) {
              p.active = false;
              continue;
            }
          } else {
            p.anchorX += p.vxDrift;
            p.anchorY += p.vyDrift;

            if (p.anchorX < 0 || p.anchorX > width) p.vxDrift *= -1;
            if (p.anchorY < 0 || p.anchorY > height) p.vyDrift *= -1;

            if (touchActive) {
              const dxTouch = p.x - touchX;
              const dyTouch = p.y - touchY;
              const distSq = dxTouch * dxTouch + dyTouch * dyTouch;
              if (distSq < 14400) {
                const dist = Math.sqrt(distSq);
                const pushStrength = (120 - dist) / 120;
                p.vx += (dxTouch / (dist || 1)) * pushStrength * 3.2;
                p.vy += (dyTouch / (dist || 1)) * pushStrength * 3.2;
              }
            }

            const springForce = 0.025; 
            const dxAnchor = p.anchorX - p.x;
            const dyAnchor = p.anchorY - p.y;
            p.vx += dxAnchor * springForce;
            p.vy += dyAnchor * springForce;

            p.vx *= 0.92;
            p.vy *= 0.92;

            p.x += p.vx;
            p.y += p.vy;

            p.alpha += (Math.random() - 0.5) * 0.02;
            if (p.alpha < 0.12) p.alpha = 0.12;
            if (p.alpha > 0.55) p.alpha = 0.55;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
          ctx.fill();

          if (p.isSpark) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color}, ${p.alpha * 0.25})`;
            ctx.fill();
          }
        }

        animationFrameId = requestAnimationFrame(animate);
      };

      let isLoopRunning = false;
      const startLoop = () => {
        if (!isLoopRunning) {
          isLoopRunning = true;
          animate();
        }
      };
      const stopLoop = () => {
        if (isLoopRunning) {
          isLoopRunning = false;
          cancelAnimationFrame(animationFrameId);
        }
      };

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) startLoop();
            else stopLoop();
          });
        },
        { threshold: 0.01 }
      );

      observer.observe(canvas);

      return () => {
        window.removeEventListener("touchmove", updateTouch);
        window.removeEventListener("touchstart", updateTouch);
        window.removeEventListener("touchend", onTouchEnd);
        observer.disconnect();
        stopLoop();
      };
    };

    const initDesktopCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      let width = window.innerWidth;
      let height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      const particleCount = 80;
      const targetDistance = 100;
      const targetDistanceSq = targetDistance * targetDistance;
      const mouseLimit = 150;
      const mouseLimitSq = mouseLimit * mouseLimit;
      const particles: any[] = [];
      let animationFrameId: number;

      const mouse = { x: width / 2, y: height / 2, tx: width / 2, ty: height / 2 };

      let containerOffsetTop = 0;
      let containerOffsetLeft = 0;

      const calculateOffsets = () => {
        if (!container.current) return;
        const rect = container.current.getBoundingClientRect();
        containerOffsetTop = rect.top + window.scrollY;
        containerOffsetLeft = rect.left + window.scrollX;
      };

      calculateOffsets();

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

      let lastClientX = width / 2;
      let lastClientY = height / 2;
      let lastScrollY = window.scrollY;
      let lastScrollX = window.scrollX;

      const updateMousePosition = () => {
        mouse.tx = lastClientX - containerOffsetLeft + window.scrollX;
        mouse.ty = lastClientY - containerOffsetTop + window.scrollY;
      };

      const onMouseMove = (e: MouseEvent) => {
        lastClientX = e.clientX;
        lastClientY = e.clientY;
        updateMousePosition();
      };

      const onScroll = () => {
        const dX = window.scrollX - lastScrollX;
        const dY = window.scrollY - lastScrollY;

        lastScrollX = window.scrollX;
        lastScrollY = window.scrollY;

        mouse.x += dX;
        mouse.y += dY;

        updateMousePosition();
      };

      let resizeTimeout: NodeJS.Timeout;
      const onResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          if (!canvas) return;
          width = window.innerWidth;
          height = window.innerHeight;
          canvas.width = width * dpr;
          canvas.height = height * dpr;
          ctx.scale(dpr, dpr);
          calculateOffsets();
          updateMousePosition();
        }, 100);
      };

      window.addEventListener("mousemove", onMouseMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize, { passive: true });

      updateMousePosition();

      const nearMouseFlags = new Array(particleCount);

      const animate = () => {
        if (!ctx || !canvas) return;

        ctx.clearRect(0, 0, width, height);

        mouse.x += (mouse.tx - mouse.x) * 0.08;
        mouse.y += (mouse.ty - mouse.y) * 0.08;

        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          p1.update();

          const dx = p1.x - mouse.x;
          const dy = p1.y - mouse.y;
          nearMouseFlags[i] = dx * dx + dy * dy < mouseLimitSq;
        }

        ctx.lineWidth = 0.5;

        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          if (p1.isGlowOrb) continue;

          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            if (p2.isGlowOrb) continue;

            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < targetDistanceSq && !nearMouseFlags[i] && !nearMouseFlags[j]) {
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
            }
          }
        }
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          if (p1.isGlowOrb) continue;

          if (nearMouseFlags[i]) {
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
          }

          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            if (p2.isGlowOrb) continue;

            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < targetDistanceSq && (nearMouseFlags[i] || nearMouseFlags[j])) {
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
            }
          }
        }
        ctx.stroke();

        ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
        ctx.beginPath();
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (!p.isGlowOrb) {
            ctx.moveTo(p.x + p.radius, p.y);
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          }
        }
        ctx.fill();

        animationFrameId = requestAnimationFrame(animate);
      };

      let isLoopRunning = false;

      const startLoop = () => {
        if (!isLoopRunning) {
          isLoopRunning = true;
          animate();
        }
      };

      const stopLoop = () => {
        if (isLoopRunning) {
          isLoopRunning = false;
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
        }
      };

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startLoop();
            } else {
              stopLoop();
            }
          });
        },
        { threshold: 0.01 }
      );

      const startTimeout = setTimeout(() => {
        observer.observe(canvas);
      }, 350);

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        observer.disconnect();
        clearTimeout(resizeTimeout);
        clearTimeout(startTimeout);
        stopLoop();
      };
    };

    if (isMobile) {
      return initMobileCanvas();
    } else {
      return initDesktopCanvas();
    }
  }, []);

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
      className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-[#09090d]"
      style={{ fontFamily: "'Quicksand', 'Inter', sans-serif" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80" />

      <div className="z-10 text-center select-none max-w-5xl px-6 relative gpu-accelerated">
        {/* <h2 className="reveal-item text-[11px] md:text-xs tracking-[1.2em] text-white/30 uppercase mb-6 font-light">
          Next Gen Agency
        </h2> */}

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

        {/* <p className="reveal-item mt-10 text-white/20 max-w-md mx-auto text-xs md:text-sm tracking-[0.15em] font-light leading-relaxed">
          ما مرزهای واقعیت و دنیای دیجیتال را با هنر کدنویسی جابه‌جا می‌کنیم.
        </p> */}
      </div>

      <div
        onClick={scrollToNextSection}
        className="reveal-item absolute bottom-12 left-1/2 -translate-x-1/2 z-20 cursor-none group pointer-events-auto flex flex-col items-center justify-center gpu-accelerated"
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