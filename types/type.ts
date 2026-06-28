export interface MobileParticle {
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

export interface Project {
  id: string;
  title: string;
  color: string;
  accent: string;
  desc: string;
  img: string;
  link?: string;
  gallery?: string[];
}