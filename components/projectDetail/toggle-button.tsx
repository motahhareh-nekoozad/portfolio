"use client";
import React from "react";

interface ToggleButtonProps {
  isScrolledToGallery: boolean;
  onClick: () => void;
  accent: string;
}

export const ToggleButton = React.memo(({ isScrolledToGallery, onClick, accent }: ToggleButtonProps) => {
  return (
    <button 
      onClick={onClick}
      className="lg:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 w-[85%] max-w-[270px] pointer-events-auto active:scale-[0.98] transition-transform duration-200"
    >
      <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-black/85 backdrop-blur-md w-full justify-center shadow-lg hover:border-white/25 transition-colors">
        <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: accent }} />
        <span className="text-[9px] font-mono tracking-widest text-white/80 text-center uppercase">
          {isScrolledToGallery 
            ? "Scroll up for details" 
            : "Scroll down for gallery"
          }
        </span>
      </div>
      <div className="w-[1px] h-7 bg-gradient-to-b from-white/30 to-transparent relative overflow-hidden">
        <div 
          className={`absolute left-0 w-full h-1/2 bg-white rounded-full ${
            isScrolledToGallery ? "animate-scroll-indicator-v-reverse" : "animate-scroll-indicator-v"
          }`} 
          style={{ backgroundColor: accent }} 
        />
      </div>
      
      <style jsx>{`
        @keyframes scrollIndicatorV {
          0% { transform: translateY(-100%); opacity: 0; }
          40% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(200%); opacity: 0; }
        }
        @keyframes scrollIndicatorVReverse {
          0% { transform: translateY(200%); opacity: 0; }
          40% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(-100%); opacity: 0; }
        }
        .animate-scroll-indicator-v {
          animation: scrollIndicatorV 2.2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          will-change: transform, opacity;
        }
        .animate-scroll-indicator-v-reverse {
          animation: scrollIndicatorVReverse 2.2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          will-change: transform, opacity;
        }
      `}</style>
    </button>
  );
});

ToggleButton.displayName = "ToggleButton";