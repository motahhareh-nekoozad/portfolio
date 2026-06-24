"use client";
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, GradientTexture, Sphere } from "@react-three/drei";
import * as THREE from "three";

const FluidShape = () => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const { clock, mouse } = state;
    if (meshRef.current) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mouse.y * 0.5, 0.05);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mouse.x * 0.5, 0.05);
      meshRef.current.position.y = Math.sin(clock.getElapsedTime()) * 0.2;
    }
  });

  return (
    <Sphere args={[1, 128, 128]} scale={2.8} ref={meshRef}>
      <MeshDistortMaterial
        color="#ffffff"
        speed={3}
        distort={0.4}
        radius={1}
        metalness={0.9}
        roughness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.1}
        reflectivity={1}
      >
        <GradientTexture
          stops={[0, 0.5, 1]}
          colors={["#4f46e5", "#ec4899", "#06b6d4"]} 
        />
      </MeshDistortMaterial>
    </Sphere>
  );
};

export const LiquidBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 h-screen w-full bg-[#030303]">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#fff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#4f46e5" />
        
        <FluidShape />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
    </div>
  );
};

import { Stars } from "@react-three/drei";