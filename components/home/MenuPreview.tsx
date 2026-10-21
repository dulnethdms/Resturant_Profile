"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, UtensilsCrossed } from "lucide-react";
import { useMenu } from "@/lib/store";
import { CATEGORIES } from "@/lib/seed";
import { cn, formatPrice } from "@/lib/utils";
import Reveal, { staggerContainer, staggerItem } from "../Reveal";

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/5 bg-ink-850">
      <div className="skeleton aspect-[16/11]" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-3 w-20 rounded-full" />
        <div className="skeleton h-5 w-3/4 rounded-full" />
        <div className="skeleton h-4 w-1/3 rounded-full" />
      </div>
    </div>
  );
}

export default function MenuPreview() {
  const { items, loading } = useMenu();

  const preview = useMemo(
    () => items.filter((item) => item.available).slice(0, 3),
    [items],
  );

  return (
    <section className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold-700/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] tracking-[0.42em] text-gold-500 uppercase">
              On the menu tonight
            </p>
            <h2 className="mt-4 font-display text-4xl text-neutral-50 sm:text-5xl">
              A taste of the <span className="italic text-gradient-gold">card</span>
            </h2>
          </div>
          <Link
            href="/menu"
            className="group flex items-center gap-2 text-sm tracking-[0.18em] text-gold-300 uppercase transition hover:text-gold-200"
          >
            View full menu
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
          </Link>
        </Reveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-70px" }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {loading
            ? [0, 1, 2].map((i) => <CardSkeleton key={i} />)
            : preview.map((dish) => (
                <motion.div key={dish.id} variants={staggerItem}>
                  <Link
                    href="/menu"
                    className="card-shimmer group block overflow-hidden rounded-2xl border border-white/8 bg-ink-850 transition-all duration-500 hover:-translate-y-2 hover:border-gold-600/40 hover:shadow-[0_40px_80px_-40px_rgba(0,0,0,1)]"
                  >
                    <div className="relative aspect-[16/11] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-ink-700 to-ink-900" />
                      <Image
                        src={dish.imageUrl}
                        alt={dish.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized={dish.imageUrl.startsWith("data:")}
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      {!dish.available && (
                        <span className="absolute top-3 left-3 rounded-full bg-rose-500/90 px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-white uppercase">
                          Sold out
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <p className="text-[10px] tracking-[0.3em] text-gold-500 uppercase">
                        {CATEGORIES.find((c) => c.id === dish.category)?.label}
                      </p>
                      <div className="mt-2 flex items-baseline justify-between gap-3">
                        <h3 className="font-display text-xl text-neutral-100 transition-colors group-hover:text-gold-200">
                          {dish.name}
                        </h3>
                        <span className="font-display text-lg text-gradient-gold">
                          {formatPrice(dish.price)}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-500">
                        {dish.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {dish.dietary.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className={cn(
                              "rounded-full border px-2.5 py-1 text-[10px] tracking-[0.14em] uppercase",
                              tag === "vegan" || tag === "vegetarian"
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                                : "border-white/12 text-neutral-400",
                            )}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </motion.div>

        <Reveal delay={0.2} className="mt-14 text-center">
          <div className="inline-flex flex-col items-center gap-4 rounded-3xl border border-gold-700/25 bg-gradient-to-b from-ink-850 to-ink-900 px-10 py-9">
            <UtensilsCrossed className="h-6 w-6 text-gold-400" />
            <p className="max-w-md font-display text-2xl text-neutral-100">
              Sixteen plates, four moods, one hearth.
            </p>
            <Link
              href="/menu"
              className="rounded-full bg-gradient-to-r from-gold-400 to-gold-600 px-8 py-3.5 text-sm font-semibold tracking-[0.16em] text-ink-950 uppercase transition-shadow duration-300 hover:shadow-[0_20px_44px_-16px_rgba(228,180,98,0.75)]"
            >
              Explore the menu
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
