"use client";

import Link from "next/link";
import { ArrowUpRight, Monitor } from "lucide-react";
import { useMenu } from "@/lib/store";
import { CATEGORIES } from "@/lib/seed";
import { cn } from "@/lib/utils";
import DishCard from "@/components/menu/DishCard";
import { useState } from "react";

export default function PreviewPanel() {
  const { items, loading } = useMenu();
  const [tab, setTab] = useState<string>("all");

  const visible = items
    .filter((item) => (tab === "all" ? true : item.category === tab))
    .slice(0, 4);

  return (
    <aside className="lg:sticky lg:top-6">
      <div className="overflow-hidden rounded-3xl border border-white/8 bg-ink-850">
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <Monitor className="h-4 w-4 text-gold-400" />
            <div>
              <p className="text-[10px] tracking-[0.3em] text-gold-500 uppercase">Live preview</p>
              <p className="text-xs text-neutral-500">Updates as you manage dishes</p>
            </div>
          </div>
          <Link
            href="/menu"
            target="_blank"
            className="flex items-center gap-1 text-[11px] tracking-[0.14em] text-gold-300 uppercase transition hover:text-gold-200"
          >
            Open <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="flex gap-1.5 overflow-x-auto border-b border-white/8 px-4 py-3 no-scrollbar">
          {["all", ...CATEGORIES.map((c) => c.id)].map((id) => {
            const label = CATEGORIES.find((c) => c.id === id)?.label ?? "All";
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-1.5 text-[10px] tracking-[0.14em] uppercase transition",
                  tab === id
                    ? "bg-gradient-to-r from-gold-300 to-gold-500 text-ink-950"
                    : "border border-white/10 text-neutral-400 hover:text-gold-200",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="max-h-[640px] space-y-4 overflow-y-auto p-4">
          {loading && (
            <>
              {[0, 1].map((i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-white/6">
                  <div className="skeleton aspect-[16/11]" />
                  <div className="space-y-3 p-5">
                    <div className="skeleton h-4 w-3/4 rounded-full" />
                    <div className="skeleton h-3 w-1/2 rounded-full" />
                  </div>
                </div>
              ))}
            </>
          )}
          {!loading && visible.length === 0 && (
            <p className="px-2 py-8 text-center text-sm text-neutral-500">
              No dishes in this category yet.
            </p>
          )}
          {!loading &&
            visible.map((dish) => <DishCard key={dish.id} dish={dish} />)}
        </div>
      </div>

      <p className="mt-3 px-2 text-[11px] leading-relaxed text-neutral-600">
        This preview reads the same store as the public menu — changes appear on the Menu page
        instantly (and in other open tabs).
      </p>
    </aside>
  );
}
