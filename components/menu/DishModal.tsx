"use client";

import Image from "next/image";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Heart, Leaf, X } from "lucide-react";
import type { MenuItem } from "@/lib/types";
import { CATEGORIES } from "@/lib/seed";
import { cn, formatPrice } from "@/lib/utils";
import { BADGE_STYLES } from "./DishCard";

export default function DishModal({
  dish,
  favorite,
  onToggleFavorite,
  onClose,
}: {
  dish: MenuItem;
  favorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const category = CATEGORIES.find((c) => c.id === dish.category)?.label ?? dish.category;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-950/85 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={dish.name}
    >
      <motion.div
        initial={{ opacity: 0, y: 44, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.97 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative grid max-h-[92vh] w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-gold-700/25 bg-ink-850 shadow-[0_60px_140px_-50px_rgba(0,0,0,1)] md:grid-cols-2"
      >
        {/* Image */}
        <div className="relative min-h-[240px] md:min-h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-ink-700 to-ink-900" />
          <Image
            src={dish.imageUrl}
            alt={dish.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized={dish.imageUrl.startsWith("data:")}
            className={cn("object-cover", !dish.available && "grayscale")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-ink-850/60" />
          {dish.badge && (
            <span
              className={cn(
                "absolute top-4 left-4 rounded-full px-3 py-1.5 text-[10px] font-bold tracking-[0.18em] uppercase",
                BADGE_STYLES[dish.badge],
              )}
            >
              {dish.badge}
            </span>
          )}
          {!dish.available && (
            <span className="absolute top-4 right-4 rounded-full bg-rose-600/95 px-3 py-1.5 text-[10px] font-bold tracking-[0.18em] text-white uppercase md:right-auto md:top-auto md:bottom-4 md:left-4">
              Sold out tonight
            </span>
          )}
        </div>

        {/* Details */}
        <div className="max-h-[92vh] overflow-y-auto p-7 sm:p-9">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-ink-950/60 text-neutral-300 backdrop-blur-md transition hover:border-gold-500/70 hover:text-gold-300"
          >
            <X className="h-4 w-4" />
          </button>

          <p className="text-[10px] tracking-[0.35em] text-gold-500 uppercase">{category}</p>
          <div className="mt-2 flex items-start justify-between gap-4">
            <h2 className="font-display text-3xl leading-tight text-neutral-50 sm:text-4xl">
              {dish.name}
            </h2>
            <span className="font-display text-3xl text-gradient-gold">
              {formatPrice(dish.price)}
            </span>
          </div>

          <p className="mt-4 leading-relaxed text-neutral-400">{dish.description}</p>

          {dish.ingredients.length > 0 && (
            <div className="mt-6">
              <h3 className="text-[11px] tracking-[0.28em] text-gold-400 uppercase">
                Ingredients
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {dish.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="rounded-full border border-white/10 bg-ink-800 px-3 py-1.5 text-xs text-neutral-300"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-4 gap-3 rounded-2xl border border-white/8 bg-ink-900/70 p-4 text-center">
            {[
              { label: "Calories", value: `${dish.nutrition.calories}` },
              { label: "Protein", value: dish.nutrition.protein },
              { label: "Carbs", value: dish.nutrition.carbs },
              { label: "Fat", value: dish.nutrition.fat },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-lg text-gold-200">{stat.value}</p>
                <p className="mt-0.5 text-[9px] tracking-[0.18em] text-neutral-500 uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-[11px] tracking-[0.28em] text-gold-400 uppercase">Dietary</h3>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {dish.dietary.length === 0 ? (
                  <span className="text-sm text-neutral-500">No dietary claims</span>
                ) : (
                  dish.dietary.map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] tracking-[0.12em] uppercase",
                        tag === "vegan" || tag === "vegetarian"
                          ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-300"
                          : "border-white/12 text-neutral-300",
                      )}
                    >
                      {tag === "vegan" || tag === "vegetarian" ? (
                        <Leaf className="h-3 w-3" />
                      ) : (
                        <Flame className="h-3 w-3" />
                      )}
                      {tag}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div>
              <h3 className="text-[11px] tracking-[0.28em] text-gold-400 uppercase">Allergens</h3>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {dish.allergens.length === 0 ? (
                  <span className="text-sm text-neutral-500">No declared allergens</span>
                ) : (
                  dish.allergens.map((a) => (
                    <span
                      key={a}
                      className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-[11px] tracking-[0.12em] text-amber-200 uppercase"
                    >
                      {a}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              disabled={!dish.available}
              onClick={() => {
                onToggleFavorite(dish.id);
                onClose();
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 py-3.5 text-sm font-semibold tracking-[0.14em] text-ink-950 uppercase transition-shadow duration-300 hover:shadow-[0_18px_42px_-16px_rgba(228,180,98,0.8)] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Heart className={cn("h-4 w-4", favorite && "fill-ink-950")} />
              {favorite ? "Remove from list" : "Add to tasting list"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
