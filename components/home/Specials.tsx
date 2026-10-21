"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useMenu } from "@/lib/store";
import { CATEGORIES } from "@/lib/seed";
import { cn, formatPrice } from "@/lib/utils";
import Reveal from "../Reveal";

const BADGE_STYLES: Record<string, string> = {
  Signature: "bg-gold-400/90 text-ink-950",
  Spicy: "bg-rose-500/90 text-white",
  "Chef's Pick": "bg-emerald-500/90 text-ink-950",
};

function wrapDelta(index: number, active: number, total: number) {
  let d = index - active;
  if (d > total / 2) d -= total;
  if (d < -total / 2) d += total;
  return d;
}

export default function Specials() {
  const { items, toggleFavorite, favorites } = useMenu();
  const [active, setActive] = useState(0);

  const featured = useMemo(() => {
    const pool = items.filter((item) => item.featured && item.available);
    return pool.length >= 3 ? pool : items.filter((i) => i.available).slice(0, 6);
  }, [items]);

  const total = featured.length;
  const go = (dir: number) => setActive((prev) => (prev + dir + total) % total);

  if (total === 0) return null;

  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-ink-900/60 py-24 sm:py-32">
      <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-gold-600/8 blur-3xl" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] tracking-[0.42em] text-gold-500 uppercase">
              From the pass
            </p>
            <h2 className="mt-4 font-display text-4xl text-neutral-50 sm:text-5xl">
              Chef&apos;s <span className="italic text-gradient-gold">Specials</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => go(-1)}
              aria-label="Previous dish"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-gold-200 transition hover:border-gold-400 hover:bg-gold-400/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next dish"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-gold-200 transition hover:border-gold-400 hover:bg-gold-400/10"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </Reveal>

        {/* Carousel stage */}
        <div className="relative mt-12 h-[540px] [perspective:1600px] sm:h-[600px]">
          <motion.div
            className="absolute inset-0"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.14}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) go(1);
              else if (info.offset.x > 70) go(-1);
            }}
          >
            <AnimatePresence initial={false}>
              {featured.map((dish, index) => {
                const delta = wrapDelta(index, active, total);
                const visible = Math.abs(delta) <= 2;
                if (!visible) return null;
                const isActive = delta === 0;
                const fav = favorites.includes(dish.id);
                const category = CATEGORIES.find((c) => c.id === dish.category)?.label ?? "";

                return (
                  <motion.article
                    key={dish.id}
                    initial={false}
                    animate={{
                      x: `calc(-50% + ${delta * 54}%)`,
                      scale: 1 - Math.abs(delta) * 0.14,
                      rotateY: delta * -24,
                      opacity: Math.abs(delta) === 0 ? 1 : Math.abs(delta) === 1 ? 0.72 : 0.35,
                      zIndex: 10 - Math.abs(delta),
                      filter: isActive ? "blur(0px)" : "blur(1.5px)",
                    }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformStyle: "preserve-3d" }}
                    className={cn(
                      "absolute top-0 left-1/2 w-[86%] max-w-[430px] cursor-grab overflow-hidden rounded-[28px] border border-white/10 bg-ink-850 shadow-[0_60px_120px_-50px_rgba(0,0,0,1)] active:cursor-grabbing",
                      !isActive && "pointer-events-none",
                    )}
                    onClick={() => !isActive && setActive(index)}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-ink-700 to-ink-900" />
                      <Image
                        src={dish.imageUrl}
                        alt={dish.name}
                        fill
                        sizes="(max-width: 640px) 90vw, 430px"
                        unoptimized={dish.imageUrl.startsWith("data:")}
                        className={cn(
                          "object-cover transition-transform duration-[900ms] ease-out",
                          isActive && "hover:scale-110",
                        )}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/25 to-transparent" />

                      {dish.badge && (
                        <span
                          className={cn(
                            "absolute top-4 left-4 rounded-full px-3 py-1.5 text-[10px] font-bold tracking-[0.18em] uppercase backdrop-blur-sm",
                            BADGE_STYLES[dish.badge] ?? "bg-gold-400 text-ink-950",
                          )}
                        >
                          {dish.badge}
                        </span>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(dish.id);
                        }}
                        aria-label={fav ? "Remove from tasting list" : "Save to tasting list"}
                        className={cn(
                          "absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300",
                          fav
                            ? "border-gold-400 bg-gold-400/20 text-gold-300"
                            : "border-white/20 bg-ink-950/40 text-neutral-200 hover:border-gold-400/70",
                        )}
                      >
                        <Heart className={cn("h-4 w-4", fav && "fill-gold-300")} />
                      </button>

                      <div className="absolute inset-x-0 bottom-0 p-6">
                        <p className="text-[10px] tracking-[0.3em] text-gold-400 uppercase">
                          {category}
                        </p>
                        <div className="mt-1.5 flex items-end justify-between gap-3">
                          <h3 className="font-display text-2xl text-neutral-50">{dish.name}</h3>
                          <span className="shrink-0 font-display text-2xl text-gradient-gold">
                            {formatPrice(dish.price)}
                          </span>
                        </div>
                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden text-sm leading-relaxed text-neutral-300"
                            >
                              <span className="pt-3 block">{dish.description}</span>
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Controls */}
          <button
            onClick={() => go(-1)}
            aria-label="Previous"
            className="absolute top-1/2 -left-1 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-ink-950/60 text-gold-200 backdrop-blur-md transition hover:border-gold-400 sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next"
            className="absolute top-1/2 -right-1 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-ink-950/60 text-gold-200 backdrop-blur-md transition hover:border-gold-400 sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2.5">
          {featured.map((dish, index) => (
            <button
              key={dish.id}
              onClick={() => setActive(index)}
              aria-label={`Go to ${dish.name}`}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                index === active ? "w-9 bg-gold-400" : "w-3 bg-ink-600 hover:bg-ink-500",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
