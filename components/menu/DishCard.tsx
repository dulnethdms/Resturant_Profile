"use client";

import Image from "next/image";
import { Heart, Plus } from "lucide-react";
import type { MenuItem } from "@/lib/types";
import { CATEGORIES } from "@/lib/seed";
import { cn, formatPrice } from "@/lib/utils";

export const BADGE_STYLES: Record<string, string> = {
  Signature: "bg-gold-400/90 text-ink-950",
  Spicy: "bg-rose-500/90 text-white",
  "Chef's Pick": "bg-emerald-500/90 text-ink-950",
};

export default function DishCard({
  dish,
  favorite,
  onOpen,
  onToggleFavorite,
  compact = false,
}: {
  dish: MenuItem;
  favorite?: boolean;
  onOpen?: (dish: MenuItem) => void;
  onToggleFavorite?: (id: string) => void;
  compact?: boolean;
}) {
  const category = CATEGORIES.find((c) => c.id === dish.category)?.label ?? dish.category;

  return (
    <article
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onClick={() => onOpen?.(dish)}
      onKeyDown={(e) => {
        if (onOpen && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onOpen(dish);
        }
      }}
      className={cn(
        "card-shimmer group relative overflow-hidden rounded-2xl border border-white/8 bg-ink-850 transition-all duration-500",
        onOpen && "cursor-pointer hover:-translate-y-1.5 hover:border-gold-600/45 hover:shadow-[0_44px_90px_-45px_rgba(0,0,0,1)]",
        compact && "flex gap-4 rounded-xl p-3",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          compact ? "h-20 w-24 shrink-0 rounded-lg" : "aspect-[16/11]",
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-ink-700 to-ink-900" />
        <Image
          src={dish.imageUrl}
          alt={dish.name}
          fill
          sizes={compact ? "96px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
          unoptimized={dish.imageUrl.startsWith("data:")}
          className={cn(
            "object-cover transition-transform duration-700 ease-out",
            !dish.available && "grayscale",
            onOpen && "group-hover:scale-110",
          )}
        />
        {!dish.available && (
          <div className="absolute inset-0 bg-ink-950/55" />
        )}

        {!compact && dish.badge && (
          <span
            className={cn(
              "absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.16em] uppercase backdrop-blur-sm",
              BADGE_STYLES[dish.badge] ?? "bg-gold-400 text-ink-950",
            )}
          >
            {dish.badge}
          </span>
        )}

        {!dish.available && (
          <span className="absolute top-3 right-3 rounded-full bg-rose-600/95 px-2.5 py-1 text-[10px] font-bold tracking-[0.16em] text-white uppercase">
            Sold out
          </span>
        )}

        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(dish.id);
            }}
            aria-label={favorite ? "Remove from tasting list" : "Save to tasting list"}
            className={cn(
              "absolute right-3 bottom-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full border opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100",
              favorite
                ? "border-gold-400 bg-gold-400/25 text-gold-200 opacity-100! translate-y-0!"
                : "border-white/25 bg-ink-950/60 text-neutral-100 hover:border-gold-400/70",
            )}
          >
            <Heart className={cn("h-4 w-4", favorite && "fill-gold-300")} />
          </button>
        )}
      </div>

      {!compact && (
        <div className="p-5">
          <p className="text-[10px] tracking-[0.3em] text-gold-500 uppercase">{category}</p>
          <div className="mt-1.5 flex items-baseline justify-between gap-3">
            <h3 className="font-display text-xl leading-snug text-neutral-100 transition-colors duration-300 group-hover:text-gold-200">
              {dish.name}
            </h3>
            <span className="shrink-0 font-display text-lg text-gradient-gold">
              {formatPrice(dish.price)}
            </span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-500">
            {dish.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {dish.dietary.map((tag) => (
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
            {dish.allergens.slice(0, 2).map((a) => (
              <span
                key={a}
                className="rounded-full border border-amber-500/25 bg-amber-500/8 px-2.5 py-1 text-[10px] tracking-[0.14em] text-amber-200/80 uppercase"
              >
                {a}
              </span>
            ))}
            {onOpen && (
              <span className="ml-auto flex items-center gap-1 text-[11px] tracking-[0.16em] text-gold-500/80 uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Plus className="h-3 w-3" /> Details
              </span>
            )}
          </div>
        </div>
      )}

      {compact && (
        <div className="min-w-0 flex-1 py-0.5">
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="truncate text-sm font-medium text-neutral-100">{dish.name}</h4>
            <span className="shrink-0 text-sm text-gold-300">{formatPrice(dish.price)}</span>
          </div>
          <p className="mt-1 line-clamp-1 text-xs text-neutral-500">{dish.description}</p>
          <p className="mt-1.5 text-[10px] tracking-[0.2em] text-gold-600 uppercase">{category}</p>
        </div>
      )}
    </article>
  );
}
