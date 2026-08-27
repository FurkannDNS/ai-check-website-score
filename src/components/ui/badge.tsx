import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "cyan" | "blue" | "success" | "outline" | "pill";
  glow?: boolean;
}

export function Badge({
  className,
  variant = "cyan",
  glow = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    cyan: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
    blue: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    success: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    outline: "bg-transparent text-slate-300 border-slate-700",
    pill: "bg-slate-900/80 text-cyan-300 border-cyan-500/40 rounded-full",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm tracking-wide uppercase",
        variantStyles[variant],
        glow && "shadow-[0_0_12px_rgba(0,229,255,0.3)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
