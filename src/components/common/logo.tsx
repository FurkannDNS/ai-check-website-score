import * as React from "react";
import { cn } from "@/lib/utils";

export interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showMetafonics?: boolean;
}

export function Logo({ className, size = "md", showMetafonics = false }: LogoProps) {
  const sizeMap = {
    sm: { height: 28, text: "text-base", subText: "text-[9px]" },
    md: { height: 38, text: "text-lg", subText: "text-[10px]" },
    lg: { height: 50, text: "text-2xl", subText: "text-xs" },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={cn("inline-flex items-center gap-3 select-none", className)}>
      {/* Stylized AI Monogram with embedded checkmark */}
      <div className="relative flex items-center justify-center">
        <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 p-[1.5px] border border-cyan-400/40 shadow-[0_0_15px_rgba(0,229,255,0.3)]">
          <div className="w-full h-full bg-slate-950/90 rounded-[10px] flex items-center justify-center">
            <svg
              className="w-5 h-5 text-cyan-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* 'A' with checkmark crossbar */}
              <path d="M4 20L10.5 4L13.5 11" />
              <path d="M8 14l3 3 5-6" />
              {/* 'I' */}
              <path d="M19 4v16" />
            </svg>
          </div>
        </div>
        <div className="absolute -inset-1 bg-cyan-400/20 blur-md -z-10 rounded-full" />
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={cn("font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-slate-200", currentSize.text)}>
            AI READY
          </span>
          <span className={cn("font-light tracking-widest text-slate-400", currentSize.text)}>
            BUSINESS
          </span>
        </div>
        {showMetafonics && (
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] tracking-wider">
            {/* Metafonics Soundwave Bars */}
            <div className="flex items-center gap-[2px] h-3">
              <span className="w-[2px] h-1.5 bg-cyan-400 rounded-full animate-pulse" />
              <span className="w-[2px] h-3 bg-cyan-300 rounded-full" />
              <span className="w-[2px] h-2 bg-cyan-400 rounded-full" />
              <span className="w-[2px] h-3.5 bg-cyan-200 rounded-full" />
              <span className="w-[2px] h-1 bg-cyan-400 rounded-full" />
            </div>
            <span className="font-semibold text-slate-300">METAFONICS</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Yapay Zeka Teknolojileri</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function MetafonicsSignature({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <div className="flex items-center gap-[3px] h-5">
        <span className="w-[2.5px] h-2.5 bg-cyan-400 rounded-full" />
        <span className="w-[2.5px] h-4 bg-cyan-300 rounded-full" />
        <span className="w-[2.5px] h-3 bg-cyan-400 rounded-full" />
        <span className="w-[2.5px] h-5 bg-cyan-200 rounded-full animate-pulse" />
        <span className="w-[2.5px] h-3.5 bg-cyan-300 rounded-full" />
        <span className="w-[2.5px] h-2 bg-cyan-400 rounded-full" />
      </div>
      <div className="flex flex-col text-left">
        <span className="text-xs font-bold tracking-widest text-slate-200 uppercase">
          METAFONICS
        </span>
        <span className="text-[10px] text-slate-400 tracking-wider">
          Yapay Zeka Teknolojileri
        </span>
      </div>
    </div>
  );
}
