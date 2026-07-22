"use client";
import React, { useRef, useEffect, memo, useMemo } from "react";
import gsap from "gsap";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Plane } from "@react-three/drei";
import * as THREE from "three";
import { PROJECTS } from  "@/data/project-data";

export const GlobalMercuryBackground = memo(() => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<any>(null!);
  const { viewport } = useThree();
  const lastIndexRef = useRef(0);
  const lastZoomValRef = useRef(-1);

  const projectColors = useMemo(() => PROJECTS.map(p => new THREE.Color(p.accent)), []);
  const initialColor = useMemo(() => projectColors[0].clone().multiplyScalar(0.05), [projectColors]);
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
    const pCamera = camera as THREE.PerspectiveCamera;

    const currentZoom = zoomObj.value;
    if (Math.abs(currentZoom - lastZoomValRef.current) > 0.0001) {
      pCamera.position.z = THREE.MathUtils.lerp(4, -1.2, currentZoom);
      pCamera.fov = THREE.MathUtils.lerp(50, 105, currentZoom);
      pCamera.updateProjectionMatrix();
      lastZoomValRef.current = currentZoom;
    }

    if (meshRef.current) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mouse.y * 0.08, 0.05);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mouse.x * 0.08, 0.05);
    }
    if (materialRef.current) {
      materialRef.current.distort = 0.3 + Math.sin(clock.getElapsedTime() * 0.3) * 0.05;
    }
  });

  return (
    <Plane args={[viewport.width * 2, viewport.height * 2, 6, 6]} ref={meshRef}>
      <MeshDistortMaterial
        ref={materialRef}
        speed={1}
        distort={0.3}
        color={initialColor}
        roughness={0.2}
        metalness={0.8}
      />
    </Plane>
  );
});
GlobalMercuryBackground.displayName = "GlobalMercuryBackground";

export const BackgroundCanvas = memo(({ active }: { active: boolean }) => {
  const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 1.5) : 1;

  return (
    <div 
      className="portfolio-webgl-bg enhanced-canvas hidden lg:block fixed inset-0 z-0 pointer-events-none opacity-0 will-change-transform"
      style={{ visibility: active ? "visible" : "hidden" }}
    >
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
        dpr={dpr}
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