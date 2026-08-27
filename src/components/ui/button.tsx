import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "cyan-pill";
  size?: "sm" | "md" | "lg" | "xl";
  glow?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      glow = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none cursor-pointer";

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20 rounded-xl hover:shadow-cyan-500/35",
      secondary:
        "bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700/80 rounded-xl backdrop-blur-sm",
      outline:
        "border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 rounded-xl",
      ghost:
        "text-slate-300 hover:text-white hover:bg-slate-800/40 rounded-xl",
      "cyan-pill":
        "border border-cyan-400/40 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-900/40 hover:border-cyan-300 rounded-full shadow-[0_0_15px_rgba(0,229,255,0.2)]",
    };

    const sizeStyles = {
      sm: "text-xs px-3.5 py-1.5 gap-1.5",
      md: "text-sm px-5 py-2.5 gap-2",
      lg: "text-base px-6 py-3.5 gap-2.5 rounded-2xl",
      xl: "text-lg px-8 py-4 gap-3 rounded-2xl font-bold",
    };

    const glowStyle = glow ? "cyan-glow-box" : "";

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          glowStyle,
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
