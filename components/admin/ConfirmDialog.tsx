"use client";

import { motion } from "framer-motion";
import { TriangleAlert, X } from "lucide-react";

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink-950/85 p-4 backdrop-blur-md"
      onClick={onCancel}
      role="alertdialog"
      aria-modal="true"
      aria-label={title}
    >
      <motion.div
        initial={{ opacity: 0, y: 26, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.96 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-ink-850 p-7 shadow-[0_50px_120px_-45px_rgba(0,0,0,1)]"
      >
        <button
          onClick={onCancel}
          aria-label="Cancel"
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-neutral-400 transition hover:border-gold-500/60 hover:text-gold-300"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-500/12 text-rose-300 ring-1 ring-rose-500/30">
          <TriangleAlert className="h-5 w-5" />
        </div>
        <h3 className="mt-5 font-display text-2xl text-neutral-50">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-400">{message}</p>

        <div className="mt-7 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-full border border-white/12 px-5 py-3 text-xs tracking-[0.16em] text-neutral-300 uppercase transition hover:border-white/30"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 px-5 py-3 text-xs font-semibold tracking-[0.16em] text-white uppercase transition hover:shadow-[0_16px_34px_-14px_rgba(244,63,94,0.8)]"
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
