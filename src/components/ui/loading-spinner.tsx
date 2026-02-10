"use client"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function LoadingSpinner({ className, size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-10 w-10 border-4",
    lg: "h-16 w-16 border-4"
  }

  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          "relative",
          sizeClasses[size],
          className
        )}
      >
        <div className="absolute inset-0 rounded-full border-primary/20" />
        <div className="absolute inset-0 animate-spin rounded-full border-primary border-t-transparent" />
      </div>
    </div>
  )
}
