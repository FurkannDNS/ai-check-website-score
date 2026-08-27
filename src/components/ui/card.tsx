import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glowBorder?: boolean;
}

export function Card({
  className,
  hoverEffect = true,
  glowBorder = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 relative overflow-hidden transition-all duration-300",
        "bg-slate-900/60 backdrop-blur-xl border border-slate-800/80",
        hoverEffect &&
          "hover:border-cyan-500/40 hover:bg-slate-900/80 hover:shadow-[0_10px_35px_-10px_rgba(0,229,255,0.15)] hover:-translate-y-1",
        glowBorder && "border-cyan-500/40 shadow-[0_0_25px_rgba(0,229,255,0.1)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-xl font-bold text-white tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-slate-400 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pt-2", className)} {...props}>{children}</div>;
}
