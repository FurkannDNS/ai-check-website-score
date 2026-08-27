import * as React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "sm" | "lg" | "fluid";
}

export function Container({
  className,
  size = "default",
  children,
  ...props
}: ContainerProps) {
  const sizeStyles = {
    sm: "max-w-4xl",
    default: "max-w-7xl",
    lg: "max-w-[1400px]",
    fluid: "max-w-full",
  };

  return (
    <div
      className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8 w-full",
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
