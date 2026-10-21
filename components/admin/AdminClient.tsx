"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  Lock,
  LogOut,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import type { CategoryId, MenuItem, NewMenuItem } from "@/lib/types";
import { CATEGORIES, RESTAURANT } from "@/lib/seed";
import { useMenu } from "@/lib/store";
import { cn, formatPrice } from "@/lib/utils";
import DishFormModal from "./DishFormModal";
import ConfirmDialog from "./ConfirmDialog";
import PreviewPanel from "./PreviewPanel";
import { BADGE_STYLES } from "@/components/menu/DishCard";

type AuthState = "checking" | "logged-out" | "authenticated";
type StatusFilter = "all" | "in" | "out";

/* ----------------------------- Login screen ----------------------------- */

function LoginScreen({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) onSuccess();
      else {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Login failed.");
      }
    } catch {
      setError("Network error — is the server running?");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-ink-850 via-ink-950 to-ink-950 px-5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md rounded-3xl border border-gold-700/25 bg-ink-850/80 p-8 shadow-[0_50px_120px_-50px_rgba(0,0,0,1)] backdrop-blur-xl sm:p-10"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-600 text-ink-950">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-2xl tracking-[0.2em] text-gold-200">NOCTURNE</p>
            <p className="text-[10px] tracking-[0.32em] text-neutral-500 uppercase">
              Staff dashboard
            </p>
          </div>
        </div>

        <h1 className="mt-8 font-display text-3xl text-neutral-50">Welcome back</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Enter the kitchen password to manage tonight&apos;s menu.
        </p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[11px] tracking-[0.2em] text-neutral-500 uppercase">
              Password
            </span>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-ink-900 px-4 py-3.5 text-sm text-neutral-200 placeholder:text-neutral-600 focus:border-gold-500/70 focus:outline-none"
            />
          </label>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-rose-400"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={busy || !password}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 py-3.5 text-sm font-semibold tracking-[0.16em] text-ink-950 uppercase transition-shadow hover:shadow-[0_18px_44px_-16px_rgba(228,180,98,0.8)] disabled:opacity-50"
          >
            {busy ? "Checking…" : "Enter dashboard"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-xs text-neutral-600">
          <span>Default password: admin123</span>
          <Link href="/" className="flex items-center gap-1.5 transition hover:text-gold-300">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to site
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------ Dashboard ------------------------------- */

export default function AdminClient() {
  const { items, loading, addItem, updateItem, deleteItem, toggleAvailability, resetMenu } =
    useMenu();
  const [auth, setAuth] = useState<AuthState>("checking");

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [status, setStatus] = useState<StatusFilter>("all");

  const [formState, setFormState] = useState<MenuItem | "new" | null>(null);
  const [confirmState, setConfirmState] = useState<
    { kind: "delete"; item: MenuItem } | { kind: "reset" } | null
  >(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d: { authed?: boolean }) => {
        if (!cancelled) setAuth(d.authed ? "authenticated" : "logged-out");
      })
      .catch(() => !cancelled && setAuth("logged-out"));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const stats = useMemo(() => {
    const inStock = items.filter((i) => i.available).length;
    return {
      total: items.length,
      inStock,
      soldOut: items.length - inStock,
      featured: items.filter((i) => i.featured).length,
    };
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((item) => {
        if (category !== "all" && item.category !== category) return false;
        if (status === "in" && !item.available) return false;
        if (status === "out" && item.available) return false;
        if (!q) return true;
        return `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(q);
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [items, query, category, status]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    setAuth("logged-out");
  };

  const handleSave = (draft: NewMenuItem) => {
    if (formState === "new") {
      addItem(draft);
      setToast(`“${draft.name}” added to the menu`);
    } else if (formState) {
      updateItem(formState.id, draft);
      setToast(`“${draft.name}” updated`);
    }
    setFormState(null);
  };

  if (auth === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950">
        <UtensilsCrossed className="h-7 w-7 animate-pulse text-gold-400" />
      </div>
    );
  }

  if (auth === "logged-out") {
    return <LoginScreen onSuccess={() => setAuth("authenticated")} />;
  }

  const selectCls =
    "rounded-xl border border-white/10 bg-ink-900 px-4 py-3 text-sm text-neutral-300 focus:border-gold-500/70 focus:outline-none";

  return (
    <div className="min-h-screen bg-ink-950 pb-16">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-600 text-ink-950">
              <UtensilsCrossed className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="font-display text-lg tracking-[0.22em] text-gold-200">
                NOCTURNE
              </p>
              <p className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase">
                Menu administration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/menu"
              target="_blank"
              className="flex items-center gap-2 rounded-full border border-white/12 px-4 py-2.5 text-[11px] tracking-[0.14em] text-neutral-300 uppercase transition hover:border-gold-500/60 hover:text-gold-300"
            >
              <Eye className="h-3.5 w-3.5" /> View live menu
            </Link>
            <button
              onClick={() => setConfirmState({ kind: "reset" })}
              title="Restore the original demo menu"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-neutral-400 transition hover:border-gold-500/60 hover:text-gold-300"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-full border border-white/12 px-4 py-2.5 text-[11px] tracking-[0.14em] text-neutral-300 uppercase transition hover:border-rose-500/60 hover:text-rose-300"
            >
              <LogOut className="h-3.5 w-3.5" /> Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 pt-8 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="font-display text-4xl text-neutral-50">Dashboard</h1>
            <p className="mt-2 text-sm text-neutral-400">
              Manage {RESTAURANT.name}&apos;s menu — changes appear on the public menu instantly.
            </p>
          </div>
          <button
            onClick={() => setFormState("new")}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3.5 text-xs font-semibold tracking-[0.16em] text-ink-950 uppercase transition-shadow hover:shadow-[0_18px_44px_-16px_rgba(228,180,98,0.8)]"
          >
            <Plus className="h-4 w-4" /> Add dish
          </button>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total dishes", value: stats.total, tone: "text-gold-200" },
            { label: "In stock", value: stats.inStock, tone: "text-emerald-300" },
            { label: "Sold out", value: stats.soldOut, tone: "text-rose-300" },
            { label: "Chef's specials", value: stats.featured, tone: "text-gold-300" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="rounded-2xl border border-white/8 bg-ink-850 p-5"
            >
              <p className={cn("font-display text-3xl", stat.tone)}>{stat.value}</p>
              <p className="mt-1 text-[10px] tracking-[0.22em] text-neutral-500 uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_370px]">
          {/* List column */}
          <div>
            {/* Controls */}
            <div className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-ink-850 p-4 sm:flex-row">
              <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-ink-900 px-4 py-2.5 focus-within:border-gold-500/70">
                <Search className="h-4 w-4 shrink-0 text-gold-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search dishes…"
                  className="w-full bg-transparent text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none"
                />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId | "all")}
                className={selectCls}
              >
                <option value="all">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusFilter)}
                className={selectCls}
              >
                <option value="all">Any status</option>
                <option value="in">In stock</option>
                <option value="out">Sold out</option>
              </select>
            </div>

            {/* Rows */}
            <div className="mt-5 space-y-3">
              {loading && (
                <>
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 rounded-2xl border border-white/6 bg-ink-850 p-4">
                      <div className="skeleton h-16 w-20 rounded-lg" />
                      <div className="flex-1 space-y-2.5">
                        <div className="skeleton h-4 w-1/3 rounded-full" />
                        <div className="skeleton h-3 w-2/3 rounded-full" />
                      </div>
                      <div className="skeleton h-8 w-24 rounded-full" />
                    </div>
                  ))}
                </>
              )}

              {!loading &&
                filtered.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="group flex flex-col gap-4 rounded-2xl border border-white/8 bg-ink-850 p-4 transition-colors hover:border-gold-700/35 sm:flex-row sm:items-center"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-ink-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className={cn(
                            "h-full w-full object-cover",
                            !item.available && "grayscale opacity-70",
                          )}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate font-medium text-neutral-100">{item.name}</h3>
                          {item.badge && (
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[9px] font-bold tracking-[0.14em] uppercase",
                                BADGE_STYLES[item.badge],
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                          {item.featured && (
                            <span className="rounded-full border border-gold-500/40 px-2 py-0.5 text-[9px] tracking-[0.14em] text-gold-300 uppercase">
                              Special
                            </span>
                          )}
                        </div>
                        <p className="mt-1 truncate text-xs text-neutral-500">
                          {CATEGORIES.find((c) => c.id === item.category)?.label} ·{" "}
                          {formatPrice(item.price)}
                          {item.dietary.length > 0 && ` · ${item.dietary.join(", ")}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <button
                        onClick={() => toggleAvailability(item.id)}
                        title={item.available ? "Mark as sold out" : "Mark as in stock"}
                        className={cn(
                          "flex items-center gap-2 rounded-full border px-3.5 py-2 text-[10px] tracking-[0.14em] uppercase transition",
                          item.available
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                            : "border-rose-500/40 bg-rose-500/10 text-rose-300",
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            item.available ? "bg-emerald-400" : "bg-rose-400",
                          )}
                        />
                        {item.available ? "In stock" : "Sold out"}
                      </button>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setFormState(item)}
                          aria-label={`Edit ${item.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-neutral-400 transition hover:border-gold-500/60 hover:text-gold-300"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmState({ kind: "delete", item })}
                          aria-label={`Delete ${item.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-neutral-400 transition hover:border-rose-500/60 hover:text-rose-300"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}

              {!loading && filtered.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/12 bg-ink-850/60 px-6 py-14 text-center">
                  <Search className="mx-auto h-6 w-6 text-gold-500/70" />
                  <p className="mt-4 font-display text-xl text-neutral-200">No dishes found</p>
                  <p className="mt-1.5 text-sm text-neutral-500">
                    Adjust the filters, or add a new dish to the menu.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Preview column */}
          <div className="xl:order-last">
            <PreviewPanel />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {formState && (
          <DishFormModal
            item={formState === "new" ? null : formState}
            onClose={() => setFormState(null)}
            onSubmit={handleSave}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmState?.kind === "delete" && (
          <ConfirmDialog
            title="Delete this dish?"
            message={`“${confirmState.item.name}” will be permanently removed from the menu. This cannot be undone.`}
            confirmLabel="Delete dish"
            onCancel={() => setConfirmState(null)}
            onConfirm={() => {
              deleteItem(confirmState.item.id);
              setToast(`“${confirmState.item.name}” deleted`);
              setConfirmState(null);
            }}
          />
        )}
        {confirmState?.kind === "reset" && (
          <ConfirmDialog
            title="Reset the menu?"
            message="All of your edits will be discarded and the original demo menu will be restored."
            confirmLabel="Reset menu"
            onCancel={() => setConfirmState(null)}
            onConfirm={() => {
              resetMenu();
              setToast("Menu restored to defaults");
              setConfirmState(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 rounded-full border border-gold-600/40 bg-ink-850/95 px-6 py-3.5 text-sm text-gold-100 shadow-[0_30px_70px_-30px_rgba(0,0,0,1)] backdrop-blur-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
