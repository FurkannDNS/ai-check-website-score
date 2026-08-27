"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Star, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIReadyBadge3DProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
}

export function AIReadyBadge3D({
  className,
  size = "md",
  interactive = true,
}: AIReadyBadge3DProps) {
  const [isHovered, setIsHovered] = useState(false);

  // 3D Motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [18, -18]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-18, 18]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const scaleMap = {
    sm: "w-48 h-48",
    md: "w-64 h-64 sm:w-72 sm:h-72",
    lg: "w-72 h-72 sm:w-88 sm:h-88",
  };

  return (
    <div
      className={cn("relative flex flex-col items-center justify-center select-none py-6", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      {/* Background radial ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-cyan-500/25 rounded-full blur-3xl pointer-events-none -z-10 transition-opacity duration-500" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] bg-blue-600/30 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Main 3D Medal / Coin container */}
      <motion.div
        style={{
          rotateX: interactive ? rotateX : 0,
          rotateY: interactive ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "relative flex items-center justify-center rounded-full transition-transform duration-200",
          scaleMap[size]
        )}
      >
        {/* Outer Metallic Bezel Ring */}
        <div className="absolute inset-0 rounded-full p-[3px] bg-gradient-to-b from-slate-300 via-slate-700 to-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          {/* Inner Cyan Neon Glow Rim */}
          <div className="w-full h-full rounded-full p-[3px] bg-gradient-to-tr from-cyan-600 via-cyan-400 to-blue-500 shadow-[0_0_25px_rgba(0,229,255,0.7)]">
            {/* Inner Dark Chrome Dial */}
            <div className="w-full h-full rounded-full bg-gradient-to-b from-slate-900 via-[#0a0f1d] to-[#040711] flex flex-col items-center justify-center p-4 relative overflow-hidden border border-cyan-500/30">
              {/* Glass Reflection Highlight */}
              <div className="absolute -top-1/2 left-0 right-0 h-full bg-gradient-to-b from-white/15 to-transparent rounded-full transform -rotate-12 pointer-events-none" />

              {/* Cyan Accent Ring Behind Icon */}
              <div className="absolute w-28 h-28 rounded-full bg-cyan-500/10 blur-xl pointer-events-none" />

              {/* Stylized AI Monogram Logo */}
              <div className="relative mb-1 flex items-center justify-center">
                <svg
                  className="w-20 h-20 sm:w-24 sm:h-24 filter drop-shadow-[0_0_12px_rgba(0,229,255,0.85)]"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Left leg of 'A' */}
                  <path
                    d="M20 85 L44 18 C46 12 50 12 52 18 L60 38"
                    stroke="url(#cyanBlueGrad)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Checkmark inside 'A' and extending right */}
                  <path
                    d="M34 60 L46 72 L68 45"
                    stroke="url(#cyanGlowGrad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Letter 'I' */}
                  <path
                    d="M78 18 L78 85"
                    stroke="url(#cyanBlueGrad)"
                    strokeWidth="9"
                    strokeLinecap="round"
                  />

                  {/* Gradients */}
                  <defs>
                    <linearGradient id="cyanBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="50%" stopColor="#00e5ff" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                    <linearGradient id="cyanGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a5f3fc" />
                      <stop offset="100%" stopColor="#00e5ff" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Badge Heading Text */}
              <div className="text-center z-10 flex flex-col items-center">
                <span className="font-extrabold text-xs sm:text-sm tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-cyan-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  AI READY
                </span>
                <span className="font-light text-[9px] sm:text-[10px] tracking-[0.25em] text-slate-300 -mt-0.5">
                  BUSINESS
                </span>
              </div>

              {/* 5 Cyan Stars */}
              <div className="flex items-center gap-1 my-1 z-10">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 text-cyan-400 fill-cyan-400 filter drop-shadow-[0_0_4px_rgba(0,229,255,0.8)]"
                  />
                ))}
              </div>

              {/* VERIFIED Text Banner */}
              <div className="z-10 mt-0.5">
                <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-cyan-300 uppercase filter drop-shadow-[0_0_6px_rgba(0,229,255,0.7)]">
                  VERIFIED
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tiered Illuminated Pedestal (as in reference photo) */}
      <div className="relative -mt-4 sm:-mt-6 flex flex-col items-center w-full max-w-[280px] sm:max-w-[340px] pointer-events-none">
        {/* Upper Tier Disc with Cyan Edge Glow */}
        <div className="w-48 sm:w-56 h-5 sm:h-6 rounded-[100%] bg-gradient-to-b from-slate-800 to-slate-950 border border-cyan-400/60 shadow-[0_0_20px_rgba(0,229,255,0.45)]" />
        
        {/* Mid Pedestal Cylinder */}
        <div className="w-56 sm:w-68 h-4 sm:h-5 -mt-2.5 rounded-[100%] bg-gradient-to-b from-slate-900 to-[#050811] border-t border-cyan-500/40" />

        {/* Lower Base Ring */}
        <div className="w-64 sm:w-80 h-4 sm:h-5 -mt-2 rounded-[100%] bg-gradient-to-b from-slate-950 to-[#020409] border-t border-cyan-600/30" />

        {/* Ambient Floor Glow underneath */}
        <div className="w-72 sm:w-96 h-10 -mt-3 pedestal-glow blur-md" />
      </div>
    </div>
  );
}
