"use client";
import { useEffect, RefObject } from "react";
import { MobileParticle } from "@/types/type";

function buildConnectionGrid(
  particles: { x: number; y: number }[],
  start: number,
  end: number,
  cellSize: number,
  width: number,
  height: number
) {
  const cols = Math.ceil(width / cellSize) + 1;
  const rows = Math.ceil(height / cellSize) + 1;
  const grid: number[][] = Array.from({ length: cols * rows }, () => []);

  for (let i = start; i < end; i++) {
    const p = particles[i];
    const col = Math.min(cols - 1, Math.max(0, Math.floor(p.x / cellSize)));
    const row = Math.min(rows - 1, Math.max(0, Math.floor(p.y / cellSize)));
    grid[row * cols + col].push(i);
  }

  return { grid, cols, rows };
}

function drawGridConnections(
  ctx: CanvasRenderingContext2D,
  particles: { x: number; y: number }[],
  grid: number[][],
  cols: number,
  rows: number,
  maxDistanceSq: number
) {
  ctx.beginPath();
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = grid[row * cols + col];
      if (!cell.length) continue;

      for (let a = 0; a < cell.length; a++) {
        const i = cell[a];
        const p1 = particles[i];

        for (let b = a + 1; b < cell.length; b++) {
          const j = cell[b];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          if (dx * dx + dy * dy < maxDistanceSq) {
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
          }
        }

        for (let nr = row; nr <= row + 1; nr++) {
          for (let nc = col + (nr === row ? 1 : 0); nc <= col + 1; nc++) {
            if (nr >= rows || nc >= cols) continue;
            const neighbor = grid[nr * cols + nc];
            for (let k = 0; k < neighbor.length; k++) {
              const j = neighbor[k];
              if (j <= i) continue;
              const p2 = particles[j];
              const dx = p1.x - p2.x;
              const dy = p1.y - p2.y;
              if (dx * dx + dy * dy < maxDistanceSq) {
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
              }
            }
          }
        }
      }
    }
  }
  ctx.stroke();
}

export function useHeroCanvas(
  containerRef: RefObject<HTMLDivElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>
) {
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

      const maxBackgroundParticles = 48;
      const maxSparks = 20;
      const totalParticles = maxBackgroundParticles + maxSparks;
      const particles: MobileParticle[] = [];
      let animationFrameId: number;
      
      let containerOffsetTop = 0;
      let containerOffsetLeft = 0;

      const calculateOffsets = () => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
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
        if (document.hidden) {
          animationFrameId = requestAnimationFrame(animate);
          return;
        }

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
        const { grid, cols, rows } = buildConnectionGrid(
          particles,
          0,
          maxBackgroundParticles,
          connectionDistance,
          width,
          height
        );
        drawGridConnections(ctx, particles, grid, cols, rows, connectionDistanceSq);

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
                const pushStrength = (120 - dist) * 0.00833333;
                const invDist = 1 / (dist || 1);
                p.vx += dxTouch * invDist * pushStrength * 3.2;
                p.vy += dyTouch * invDist * pushStrength * 3.2;
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
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
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
        if (scrollRafId !== null) return;
        scrollRafId = requestAnimationFrame(() => {
          scrollRafId = null;
          const dX = window.scrollX - lastScrollX;
          const dY = window.scrollY - lastScrollY;

          lastScrollX = window.scrollX;
          lastScrollY = window.scrollY;

          mouse.x += dX;
          mouse.y += dY;

          updateMousePosition();
        });
      };

      let scrollRafId: number | null = null;

      let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
      const onResize = () => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
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

        if (document.hidden) {
          animationFrameId = requestAnimationFrame(animate);
          return;
        }

        ctx.clearRect(0, 0, width, height);

        mouse.x += (mouse.tx - mouse.x) * 0.08;
        mouse.y += (mouse.ty - mouse.y) * 0.08;

        const len = particles.length;

        for (let i = 0; i < len; i++) {
          const p1 = particles[i];
          p1.update();

          const dx = p1.x - mouse.x;
          const dy = p1.y - mouse.y;
          nearMouseFlags[i] = dx * dx + dy * dy < mouseLimitSq;
        }

        ctx.lineWidth = 0.5;

        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        for (let i = 0; i < len; i++) {
          const p1 = particles[i];
          if (p1.isGlowOrb) continue;
          const p1x = p1.x;
          const p1y = p1.y;

          for (let j = i + 1; j < len; j++) {
            const p2 = particles[j];
            if (p2.isGlowOrb) continue;

            const dx = p1x - p2.x;
            const dy = p1y - p2.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < targetDistanceSq && !nearMouseFlags[i] && !nearMouseFlags[j]) {
              ctx.moveTo(p1x, p1y);
              ctx.lineTo(p2.x, p2.y);
            }
          }
        }
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
        for (let i = 0; i < len; i++) {
          const p1 = particles[i];
          if (p1.isGlowOrb) continue;
          const p1x = p1.x;
          const p1y = p1.y;

          if (nearMouseFlags[i]) {
            ctx.moveTo(p1x, p1y);
            ctx.lineTo(mouse.x, mouse.y);
          }

          for (let j = i + 1; j < len; j++) {
            const p2 = particles[j];
            if (p2.isGlowOrb) continue;

            const dx = p1x - p2.x;
            const dy = p1y - p2.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < targetDistanceSq && (nearMouseFlags[i] || nearMouseFlags[j])) {
              ctx.moveTo(p1x, p1y);
              ctx.lineTo(p2.x, p2.y);
            }
          }
        }
        ctx.stroke();

        ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
        ctx.beginPath();
        for (let i = 0; i < len; i++) {
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
        if (resizeTimeout) clearTimeout(resizeTimeout);
        if (scrollRafId !== null) cancelAnimationFrame(scrollRafId);
        clearTimeout(startTimeout);
        stopLoop();
      };
    };

    if (isMobile) {
      return initMobileCanvas();
    } else {
      return initDesktopCanvas();
    }
  }, [containerRef, canvasRef]);
}