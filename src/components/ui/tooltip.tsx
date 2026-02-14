"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  label: string;
  children: ReactNode;
  side?: "top" | "bottom";
}

export function Tooltip({
  label,
  children,
  side = "top",
}: TooltipProps) {
  return (
    <div className="relative inline-flex group">
      {children}

      <span
        className={cn(
          "pointer-events-none absolute z-50 whitespace-nowrap rounded-md px-2 py-1 text-xs text-white bg-slate-900 opacity-0 group-hover:opacity-100 transition-all duration-150",
          side === "top"
            ? "-top-9 left-1/2 -translate-x-1/2"
            : "top-9 left-1/2 -translate-x-1/2"
        )}
      >
        {label}
      </span>
    </div>
  );
}
