"use client";

import { useEffect, useState } from "react";
import { getOpenStatus, type OpenStatus } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function StatusBadge({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const [status, setStatus] = useState<OpenStatus>({ open: false, message: "…" });

  useEffect(() => {
    setStatus(getOpenStatus());
    const id = window.setInterval(() => setStatus(getOpenStatus()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-xs tracking-[0.16em] uppercase backdrop-blur-md",
        status.open
          ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
          : "border-rose-400/30 bg-rose-500/10 text-rose-300",
        className,
      )}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full animate-ping-slow",
            status.open ? "bg-emerald-400" : "bg-rose-400",
          )}
        />
        <span
          className={cn(
            "relative inline-flex h-2 w-2 rounded-full",
            status.open ? "bg-emerald-400" : "bg-rose-400",
          )}
        />
      </span>
      {compact ? (status.open ? "Open" : "Closed") : status.message}
    </span>
  );
}
