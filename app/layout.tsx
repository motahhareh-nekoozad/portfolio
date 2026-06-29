// app/layout.tsx
"use client"; 
import React, { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import "@/lib/gsap-setup"; 

import SmoothScroll from "@/components/smooth-scroll";
import CustomCursor from "@/hooks/custom-cursor";
import Preloader from "@/components/preloader"; 

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showPreloader, setShowPreloader] = useState(true);

  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, 
      },
    },
  }));

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning 
    >
    <body className="flex flex-col" suppressHydrationWarning>
      <QueryClientProvider client={queryClient}>
        
        {showPreloader && <Preloader onComplete={() => setShowPreloader(false)} />}

        <div id="scroll-cover" className="fixed inset-0 z-[9999] bg-[#030303] opacity-0 pointer-events-none transition-opacity duration-300" />
        <CustomCursor />
        
        <SmoothScroll>
          {children}
        </SmoothScroll>

      </QueryClientProvider>
    </body>
    </html>
  );
}