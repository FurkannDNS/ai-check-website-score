import React from "react";
import { cn } from "@/lib/utils";

export function BackgroundGlow({ className }: { className?: string }) {
  return (
    <div className={cn("fixed inset-0 pointer-events-none overflow-hidden -z-10", className)}>
      {/* Top Center Ambient Cyber Orb */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[650px] h-[550px] bg-gradient-to-b from-cyan-500/15 via-blue-600/10 to-transparent rounded-full blur-[120px]" />

      {/* Subtle Right Orb */}
      <div className="absolute top-1/3 -right-32 w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-[130px]" />

      {/* Subtle Left Orb */}
      <div className="absolute top-2/3 -left-32 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px]" />

      {/* Cyber Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(to right, #38bdf8 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />
    </div>
  );
}
