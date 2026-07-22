"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/lib/gsap-setup";
import SmoothScroll from "@/components/smooth-scroll";
import CustomCursor from "@/hooks/custom-cursor";
import Preloader from "@/components/preloader";

export function Providers({ children }: { children: React.ReactNode }) {
  const [showPreloader, setShowPreloader] = useState(true);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {showPreloader && <Preloader onComplete={() => setShowPreloader(false)} />}

      <div
        id="scroll-cover"
        className="fixed inset-0 z-[9999] bg-[#030303] opacity-0 pointer-events-none transition-opacity duration-300"
      />
      <CustomCursor />

      <SmoothScroll>{children}</SmoothScroll>
    </QueryClientProvider>
  );
}
