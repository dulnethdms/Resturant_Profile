"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Trash2, X } from "lucide-react";
import { useMenu } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import DishCard from "./DishCard";

export default function TastingTray() {
  const { items, favorites, toggleFavorite, clearFavorites } = useMenu();
  const [open, setOpen] = useState(false);

  const saved = favorites
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const total = saved.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 bottom-16 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-gold-700/30 bg-ink-850/95 shadow-[0_40px_90px_-40px_rgba(0,0,0,1)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
              <div>
                <p className="text-[10px] tracking-[0.3em] text-gold-500 uppercase">
                  Tasting List
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {saved.length} {saved.length === 1 ? "dish" : "dishes"} saved on this device
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close tasting list"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-neutral-400 transition hover:border-gold-500/60 hover:text-gold-300"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="max-h-72 space-y-2 overflow-y-auto p-3">
              <AnimatePresence initial={false}>
                {saved.length === 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-2 py-6 text-center text-sm text-neutral-500"
                  >
                    Tap the ♡ on any dish to build your list.
                  </motion.p>
                )}
                {saved.map((dish) => (
                  <motion.div
                    key={dish.id}
                    layout
                    initial={{ opacity: 0, x: 26 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 26 }}
                    transition={{ duration: 0.28 }}
                  >
                    <DishCard
                      dish={dish}
                      compact
                      onOpen={() => setOpen(false)}
                      onToggleFavorite={toggleFavorite}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {saved.length > 0 && (
              <div className="border-t border-white/8 px-5 py-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-400">Estimated total</span>
                  <span className="font-display text-lg text-gradient-gold">
                    {formatPrice(total)}
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={clearFavorites}
                    className="flex items-center gap-1.5 rounded-full border border-white/12 px-4 py-2.5 text-[11px] tracking-[0.16em] text-neutral-400 uppercase transition hover:border-rose-500/50 hover:text-rose-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Clear
                  </button>
                  <button
                    className="flex-1 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 px-4 py-2.5 text-[11px] font-semibold tracking-[0.16em] text-ink-950 uppercase transition hover:shadow-[0_14px_30px_-12px_rgba(228,180,98,0.75)]"
                  >
                    Show to waiter
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.94 }}
        className="flex items-center gap-2.5 rounded-full border border-gold-500/40 bg-ink-900/90 px-5 py-3.5 text-sm font-medium text-gold-200 shadow-[0_24px_50px_-24px_rgba(0,0,0,1)] backdrop-blur-xl transition-colors hover:border-gold-400"
        aria-label="Open tasting list"
      >
        <Heart className="h-4 w-4" />
        <span className="tracking-[0.12em] uppercase">Tasting List</span>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={saved.length}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 24 }}
            className="flex h-6 min-w-6 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-600 px-1.5 text-xs font-bold text-ink-950"
          >
            {saved.length}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
