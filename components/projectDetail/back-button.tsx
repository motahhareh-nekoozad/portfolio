"use client";
import React from "react";
import { Project } from "@/types/type";

interface BackButtonProps {
  project: Project;
  onBack: () => void;
}

export const BackButton = React.memo(({ project, onBack }: BackButtonProps) => {
  return (
    <>
      {/* دکمه دسکتاپ */}
      <button 
        onClick={onBack} 
        className="unique-btn group hidden lg:flex items-center justify-center"
        style={{ '--accent-glow': project.accent } as React.CSSProperties}
      >
          <svg 
            className="w-5 h-5 relative z-10" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
      </button>

      <button 
        onClick={onBack} 
        className="mobile-back-btn lg:hidden fixed top-6 left-6 z-50 flex items-center justify-center w-11 h-11 rounded-full border border-white/10 text-white bg-black/80 shadow-[0_4px_24px_rgba(0,0,0,0.8)] active:scale-90 transition-all duration-300"
        style={{ '--accent-glow': project.accent } as React.CSSProperties}
      >
        <span className="absolute inset-0 rounded-full opacity-25 animate-pulse" style={{ boxShadow: `0 0 15px var(--accent-glow)` }} />
        <span className="absolute inset-[2px] rounded-full border border-dashed animate-[rotateClockwise_15s_linear_infinite] opacity-30" style={{ borderColor: project.accent }} />
        <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <style jsx>{`
        .unique-btn {
          position: fixed;
          right: 24px;
          top: 50%;
          transform: translateY(-50%); 
          width: 52px;
          height: 52px;
          padding: 2px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.03);
          transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          z-index: 60;
          overflow: hidden; 
          isolation: isolate; 
        }
        .unique-btn:hover {
          transform: translateY(-50%) translateX(-8px);
          box-shadow: 0 0 35px var(--accent-glow);
        }
        .unique-btn::before {
          content: '';
          position: absolute;
          inset: -50%;
          background: conic-gradient(transparent, transparent, var(--accent-glow), transparent);
          animation: rotateBtnBorder 4s linear infinite;
          z-index: -1;
        }
        @keyframes rotateBtnBorder { 100% { transform: rotate(360deg); } }
        
        .btn-content {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: #09090b;
          border-radius: 9999px;
          z-index: 10;
          transition: all 0.3s ease;
          transform: translate3d(0, 0, 0);
        }
        .unique-btn:hover .btn-content {
          background: transparent;
        }
        .unique-btn:hover::before {
          background: var(--accent-glow);
          animation: none;
        }

        .mobile-back-btn {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        @keyframes rotateClockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
});

BackButton.displayName = "BackButton";