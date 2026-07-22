"use client";

import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  loading?: "lazy" | "eager";
}

export function OptimizedImage({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 85vw, (max-width: 1280px) 50vw, 600px",
  loading,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      loading={loading ?? (priority ? "eager" : "lazy")}
      className={`${className} ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
      onLoad={() => setLoaded(true)}
      quality={80}
    />
  );
}
