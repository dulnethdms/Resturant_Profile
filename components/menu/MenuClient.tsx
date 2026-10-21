"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Leaf, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import type { CategoryId, DietaryTag, MenuItem } from "@/lib/types";
import { CATEGORIES } from "@/lib/seed";
import { useMenu } from "@/lib/store";
import { cn } from "@/lib/utils";
import DishCard from "./DishCard";
import DishModal from "./DishModal";
import TastingTray from "./TastingTray";

const DIET_FILTERS: DietaryTag[] = ["vegetarian", "vegan", "gluten-free", "halal"];
type CategoryFilter = CategoryId | "all";

function GridSkeleton({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-white/6 bg-ink-850"
          style={{ animationDelay: `${i * 70}ms` }}
        >
          <div className="skeleton aspect-[16/11]" />
          <div className="space-y-3 p-5">
            <div className="skeleton h-3 w-16 rounded-full" />
            <div className="skeleton h-5 w-3/4 rounded-full" />
            <div className="skeleton h-4 w-full rounded-full" />
            <div className="skeleton h-4 w-2/3 rounded-full" />
            <div className="flex gap-2 pt-1">
              <div className="skeleton h-6 w-20 rounded-full" />
              <div className="skeleton h-6 w-16 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default function MenuClient() {
  const { items, loading, favorites, toggleFavorite } = useMenu();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [diets, setDiets] = useState<DietaryTag[]>([]);
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const [pending, setPending] = useState(true);

  // Brief skeleton beat whenever the filters change (as specified).
  useEffect(() => {
    setPending(true);
    const t = window.setTimeout(() => setPending(false), 260);
    return () => window.clearTimeout(t);
  }, [query, category, diets]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((dish) => {
      if (category !== "all" && dish.category !== category) return false;
      if (diets.length > 0 && !diets.every((d) => dish.dietary.includes(d))) return false;
      if (!q) return true;
      const haystack = [
        dish.name,
        dish.description,
        dish.category,
        ...dish.ingredients,
        ...dish.dietary,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [items, query, category, diets]);

  const counts = useMemo(() => {
    const map = new Map<CategoryFilter, number>();
    map.set("all", items.length);
    for (const c of CATEGORIES) {
      map.set(c.id, items.filter((d) => d.category === c.id).length);
    }
    return map;
  }, [items]);

  const toggleDiet = (diet: DietaryTag) =>
    setDiets((prev) => (prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet]));

  const clearAll = () => {
    setQuery("");
    setCategory("all");
    setDiets([]);
  };

  const showSkeletons = loading || pending;
  const hasActiveFilters = query.trim() !== "" || category !== "all" || diets.length > 0;

  return (
    <div className="pb-28">
      {/* Page header */}
      <header className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-ink-850 to-ink-950 pt-32 pb-10 sm:pt-40 sm:pb-14">
        <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-gold-600/10 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -left-16 h-52 w-52 rounded-full bg-gold-700/8 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[11px] tracking-[0.42em] text-gold-500 uppercase"
          >
            Season · Fire · Restraint
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="mt-4 font-display text-5xl text-neutral-50 sm:text-6xl"
          >
            The <span className="italic text-gradient-gold">Menu</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16 }}
            className="mt-4 max-w-2xl leading-relaxed text-neutral-400"
          >
            Sixteen plates that change with the market. Everything is prepared to order — tell us
            about allergies and the kitchen will adapt.
          </motion.p>

          {/* Search + dietary filters */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24 }}
            className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center"
          >
            <div className="group flex w-full items-center gap-3 rounded-full border border-white/10 bg-ink-900/80 px-5 py-3.5 transition-colors focus-within:border-gold-500/70 lg:max-w-md">
              <Search className="h-4 w-4 shrink-0 text-gold-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dishes, ingredients…"
                aria-label="Search the menu"
                className="w-full bg-transparent text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="text-neutral-500 transition hover:text-gold-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 hidden items-center gap-1.5 text-[11px] tracking-[0.2em] text-neutral-500 uppercase sm:flex">
                <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
              </span>
              {DIET_FILTERS.map((diet) => {
                const active = diets.includes(diet);
                return (
                  <button
                    key={diet}
                    onClick={() => toggleDiet(diet)}
                    aria-pressed={active}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-[11px] tracking-[0.14em] uppercase transition-all duration-300",
                      active
                        ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-300 shadow-[0_10px_26px_-14px_rgba(16,185,129,0.8)]"
                        : "border-white/12 text-neutral-400 hover:border-white/30 hover:text-neutral-200",
                    )}
                  >
                    <Leaf className="h-3 w-3" />
                    {diet}
                  </button>
                );
              })}
              {hasActiveFilters && (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1.5 rounded-full border border-gold-600/40 px-4 py-2.5 text-[11px] tracking-[0.14em] text-gold-300 uppercase transition hover:bg-gold-500/10"
                >
                  <RotateCcw className="h-3 w-3" /> Reset
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </header>

      {/* Sticky category tabs */}
      <div className="sticky top-0 z-30 border-b border-white/5 bg-ink-950/85 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl overflow-x-auto px-5 no-scrollbar sm:px-8">
          <div className="flex min-w-max items-center gap-1.5 py-3.5">
            {(["all", ...CATEGORIES.map((c) => c.id)] as CategoryFilter[]).map((tab) => {
              const meta = CATEGORIES.find((c) => c.id === tab);
              const label = meta ? meta.label : "All";
              const active = category === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setCategory(tab)}
                  className={cn(
                    "relative rounded-full px-5 py-2.5 text-[12px] tracking-[0.16em] uppercase transition-colors duration-300",
                    active ? "text-ink-950" : "text-neutral-400 hover:text-gold-200",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="category-pill"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-gold-300 to-gold-500"
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {label}
                    <span
                      className={cn(
                        "text-[10px] tabular-nums",
                        active ? "text-ink-950/70" : "text-neutral-600",
                      )}
                    >
                      {counts.get(tab) ?? 0}
                    </span>
                  </span>
                </button>
              );
            })}
            <span className="ml-auto hidden pl-6 text-xs text-neutral-500 sm:block">
              {filtered.length} {filtered.length === 1 ? "dish" : "dishes"}
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12">
        <motion.div
          layout
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          style={{ minHeight: 320 }}
        >
          {showSkeletons ? (
            <GridSkeleton count={6} />
          ) : (
            <AnimatePresence mode="popLayout" initial={false}>
              {filtered.map((dish) => (
                <motion.div
                  key={dish.id}
                  layout
                  initial={{ opacity: 0, y: 22, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                >
                  <DishCard
                    dish={dish}
                    favorite={favorites.includes(dish.id)}
                    onOpen={setSelected}
                    onToggleFavorite={toggleFavorite}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>

        {!showSkeletons && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-10 max-w-md rounded-3xl border border-white/8 bg-ink-850/70 px-8 py-14 text-center"
          >
            <Search className="mx-auto h-7 w-7 text-gold-500/70" />
            <h3 className="mt-5 font-display text-2xl text-neutral-100">Nothing matches that</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              Try another keyword, or loosen the dietary filters — the kitchen is flexible.
            </p>
            <button
              onClick={clearAll}
              className="mt-6 rounded-full border border-gold-500/50 px-6 py-3 text-xs tracking-[0.16em] text-gold-200 uppercase transition hover:bg-gold-500/10"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </section>

      <TastingTray />

      <AnimatePresence>
        {selected && (
          <DishModal
            dish={selected}
            favorite={favorites.includes(selected.id)}
            onToggleFavorite={toggleFavorite}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
