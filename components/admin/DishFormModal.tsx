"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import type { Allergen, CategoryId, DishBadge, DietaryTag, MenuItem, NewMenuItem } from "@/lib/types";
import { CATEGORIES } from "@/lib/seed";
import { cn, formatPrice } from "@/lib/utils";
import DishCard from "@/components/menu/DishCard";
import { BADGE_STYLES } from "@/components/menu/DishCard";

const ALLERGENS: Allergen[] = ["dairy", "gluten", "nuts", "shellfish", "eggs", "soy", "fish", "sesame"];
const DIETS: DietaryTag[] = ["vegetarian", "vegan", "gluten-free", "halal"];
const BADGES: Array<DishBadge | ""> = ["", "Signature", "Spicy", "Chef's Pick"];

interface FormState {
  name: string;
  category: CategoryId;
  price: string;
  description: string;
  imageUrl: string;
  dietary: DietaryTag[];
  allergens: Allergen[];
  ingredientsText: string;
  badge: DishBadge | "";
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  available: boolean;
  featured: boolean;
}

function fromItem(item: MenuItem): FormState {
  return {
    name: item.name,
    category: item.category,
    price: String(item.price),
    description: item.description,
    imageUrl: item.imageUrl,
    dietary: item.dietary,
    allergens: item.allergens,
    ingredientsText: item.ingredients.join(", "),
    badge: item.badge ?? "",
    calories: String(item.nutrition.calories),
    protein: item.nutrition.protein,
    carbs: item.nutrition.carbs,
    fat: item.nutrition.fat,
    available: item.available,
    featured: item.featured,
  };
}

const EMPTY: FormState = {
  name: "",
  category: "mains",
  price: "",
  description: "",
  imageUrl: "",
  dietary: [],
  allergens: [],
  ingredientsText: "",
  badge: "",
  calories: "",
  protein: "",
  carbs: "",
  fat: "",
  available: true,
  featured: false,
};

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between text-[11px] tracking-[0.2em] text-neutral-400 uppercase">
        {label}
        {hint && <span className="text-[10px] tracking-normal normal-case text-neutral-600">{hint}</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-rose-400">{error}</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-ink-900 px-4 py-3 text-sm text-neutral-200 placeholder:text-neutral-600 transition-colors focus:border-gold-500/70 focus:outline-none";

export default function DishFormModal({
  item,
  onClose,
  onSubmit,
}: {
  item: MenuItem | null;
  onClose: () => void;
  onSubmit: (draft: NewMenuItem) => void;
}) {
  const [form, setForm] = useState<FormState>(item ? fromItem(item) : EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleIn = <T extends string>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 900_000) {
      setErrors((e) => ({ ...e, imageUrl: "Please choose an image under ~900 KB." }));
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      set("imageUrl", String(reader.result));
      setErrors((e) => ({ ...e, imageUrl: "" }));
      setUploading(false);
    };
    reader.onerror = () => {
      setUploading(false);
      setErrors((e) => ({ ...e, imageUrl: "Could not read that file." }));
    };
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    const price = Number(form.price);
    const calories = Number(form.calories || 0);

    if (!form.name.trim()) nextErrors.name = "Give the dish a name.";
    if (!form.description.trim()) nextErrors.description = "A short description is required.";
    if (!form.price.trim() || Number.isNaN(price) || price <= 0)
      nextErrors.price = "Enter a price greater than 0.";
    if (Number.isNaN(calories) || calories < 0) nextErrors.calories = "Enter valid calories.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    const draft: NewMenuItem = {
      name: form.name.trim(),
      category: form.category,
      price: Math.round(price * 100) / 100,
      description: form.description.trim(),
      imageUrl:
        form.imageUrl.trim() ||
        `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1400&q=80`,
      dietary: form.dietary,
      allergens: form.allergens,
      ingredients: form.ingredientsText
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean),
      nutrition: {
        calories: calories || 0,
        protein: form.protein.trim() || "—",
        carbs: form.carbs.trim() || "—",
        fat: form.fat.trim() || "—",
      },
      available: form.available,
      featured: form.featured,
    };
    if (form.badge) draft.badge = form.badge;

    window.setTimeout(() => onSubmit(draft), 350);
  };

  const previewItem: MenuItem = {
    id: "preview",
    name: form.name.trim() || "Untitled dish",
    category: form.category,
    price: Number(form.price) || 0,
    description: form.description.trim() || "Your description will appear here…",
    imageUrl:
      form.imageUrl.trim() ||
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1400&q=80",
    dietary: form.dietary,
    allergens: form.allergens,
    ingredients: form.ingredientsText.split(/[,\n]/).map((s) => s.trim()).filter(Boolean),
    nutrition: {
      calories: Number(form.calories || 0),
      protein: form.protein || "—",
      carbs: form.carbs || "—",
      fat: form.fat || "—",
    },
    available: form.available,
    featured: form.featured,
    createdAt: Date.now(),
  };
  if (form.badge) previewItem.badge = form.badge;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink-950/85 p-3 backdrop-blur-md sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item ? "Edit dish" : "Add dish"}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 26, scale: 0.97 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative grid max-h-[94vh] w-full max-w-5xl grid-cols-1 gap-0 overflow-hidden rounded-3xl border border-gold-700/25 bg-ink-850 shadow-[0_60px_140px_-50px_rgba(0,0,0,1)] lg:grid-cols-[1.4fr_1fr]"
      >
        {/* Form */}
        <div className="max-h-[94vh] overflow-y-auto p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] tracking-[0.35em] text-gold-500 uppercase">
                {item ? "Edit dish" : "New dish"}
              </p>
              <h3 className="mt-1.5 font-display text-3xl text-neutral-50">
                {item ? item.name : "Add to the menu"}
              </h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-neutral-400 transition hover:border-gold-500/60 hover:text-gold-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" error={errors.name}>
                <input
                  className={inputCls}
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Charred Octopus"
                />
              </Field>
              <Field label="Category">
                <select
                  className={inputCls}
                  value={form.category}
                  onChange={(e) => set("category", e.target.value as CategoryId)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Price (USD)" error={errors.price}>
                <input
                  className={inputCls}
                  inputMode="decimal"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="24.00"
                />
              </Field>
              <Field label="Badge">
                <select
                  className={inputCls}
                  value={form.badge}
                  onChange={(e) => set("badge", e.target.value as DishBadge | "")}
                >
                  {BADGES.map((b) => (
                    <option key={b || "none"} value={b}>
                      {b || "No badge"}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Description" error={errors.description}>
              <textarea
                className={`${inputCls} min-h-24 resize-y`}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="What makes it worth ordering?"
              />
            </Field>

            <Field label="Image" hint="URL or upload" error={errors.imageUrl}>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[12rem]">
                  <input
                    className={`${inputCls} pr-11`}
                    value={form.imageUrl.startsWith("data:") ? "Uploaded image ✓" : form.imageUrl}
                    onChange={(e) => set("imageUrl", e.target.value)}
                    placeholder="https://images.unsplash.com/…"
                    disabled={form.imageUrl.startsWith("data:")}
                  />
                  <ImagePlus className="absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 rounded-full border border-white/12 px-4 py-2.5 text-[11px] tracking-[0.14em] text-neutral-300 uppercase transition hover:border-gold-500/60 hover:text-gold-300 disabled:opacity-60"
                >
                  {uploading && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}
                  {uploading ? "Reading…" : "Upload file"}
                </button>
                {form.imageUrl && (
                  <button
                    type="button"
                    onClick={() => set("imageUrl", "")}
                    className="text-[11px] tracking-[0.14em] text-rose-400 uppercase hover:text-rose-300"
                  >
                    Clear
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </div>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Ingredients" hint="comma separated">
                <textarea
                  className={`${inputCls} min-h-20 resize-y`}
                  value={form.ingredientsText}
                  onChange={(e) => set("ingredientsText", e.target.value)}
                  placeholder="Octopus, smoked paprika, lemon…"
                />
              </Field>
              <div className="space-y-4">
                <Field label="Nutrition" hint="per serving">
                  <div className="grid grid-cols-4 gap-2">
                    <input
                      className={`${inputCls} px-2 text-center`}
                      value={form.calories}
                      onChange={(e) => set("calories", e.target.value)}
                      placeholder="kcal"
                      inputMode="numeric"
                    />
                    <input
                      className={`${inputCls} px-2 text-center`}
                      value={form.protein}
                      onChange={(e) => set("protein", e.target.value)}
                      placeholder="P"
                    />
                    <input
                      className={`${inputCls} px-2 text-center`}
                      value={form.carbs}
                      onChange={(e) => set("carbs", e.target.value)}
                      placeholder="C"
                    />
                    <input
                      className={`${inputCls} px-2 text-center`}
                      value={form.fat}
                      onChange={(e) => set("fat", e.target.value)}
                      placeholder="F"
                    />
                  </div>
                </Field>
                <Field label="Dietary tags">
                  <div className="flex flex-wrap gap-2">
                    {DIETS.map((diet) => (
                      <button
                        key={diet}
                        type="button"
                        onClick={() => set("dietary", toggleIn(form.dietary, diet))}
                        className={cn(
                          "rounded-full border px-3.5 py-2 text-[10px] tracking-[0.14em] uppercase transition",
                          form.dietary.includes(diet)
                            ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-300"
                            : "border-white/12 text-neutral-400 hover:text-neutral-200",
                        )}
                      >
                        {diet}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            </div>

            <Field label="Allergens">
              <div className="flex flex-wrap gap-2">
                {ALLERGENS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => set("allergens", toggleIn(form.allergens, a))}
                    className={cn(
                      "rounded-full border px-3.5 py-2 text-[10px] tracking-[0.14em] uppercase transition",
                      form.allergens.includes(a)
                        ? "border-amber-400/60 bg-amber-500/15 text-amber-200"
                        : "border-white/12 text-neutral-400 hover:text-neutral-200",
                    )}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </Field>

            <div className="flex flex-wrap gap-5 border-t border-white/8 pt-5">
              <label className="flex cursor-pointer items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.available}
                  onClick={() => set("available", !form.available)}
                  className={cn(
                    "relative h-6 w-11 rounded-full transition-colors",
                    form.available ? "bg-emerald-500" : "bg-ink-600",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all",
                      form.available ? "left-[22px]" : "left-0.5",
                    )}
                  />
                </button>
                <span className="text-xs tracking-[0.14em] text-neutral-300 uppercase">
                  In stock
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.featured}
                  onClick={() => set("featured", !form.featured)}
                  className={cn(
                    "relative h-6 w-11 rounded-full transition-colors",
                    form.featured ? "bg-gold-500" : "bg-ink-600",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all",
                      form.featured ? "left-[22px]" : "left-0.5",
                    )}
                  />
                </button>
                <span className="text-xs tracking-[0.14em] text-neutral-300 uppercase">
                  Chef&apos;s special
                </span>
              </label>
            </div>

            <div className="flex gap-3 pb-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-full border border-white/12 px-5 py-3.5 text-xs tracking-[0.16em] text-neutral-300 uppercase transition hover:border-white/30"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex flex-[1.6] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 px-5 py-3.5 text-xs font-semibold tracking-[0.16em] text-ink-950 uppercase transition-shadow hover:shadow-[0_18px_42px_-16px_rgba(228,180,98,0.8)] disabled:opacity-70"
              >
                {saving && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {saving ? "Saving…" : item ? "Save changes" : "Add dish"}
              </button>
            </div>
          </form>
        </div>

        {/* Live preview */}
        <div className="hidden flex-col border-t border-white/8 bg-ink-900/70 p-6 lg:flex lg:border-t-0 lg:border-l">
          <div className="flex items-center justify-between">
            <p className="text-[10px] tracking-[0.3em] text-gold-500 uppercase">Card preview</p>
            <span className="text-[10px] tracking-[0.14em] text-neutral-500 uppercase">
              Live
            </span>
          </div>
          <div className="mt-4">
            <DishCard dish={previewItem} />
          </div>
          <div className="mt-5 rounded-2xl border border-white/8 bg-ink-950/60 p-4 text-[11px] leading-relaxed text-neutral-500">
            <p className="text-neutral-400">How it renders</p>
            <p className="mt-1.5">
              {form.badge ? (
                <>
                  Badge:{" "}
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase",
                      BADGE_STYLES[form.badge],
                    )}
                  >
                    {form.badge}
                  </span>{" "}
                  ·{" "}
                </>
              ) : (
                <>No badge · </>
              )}
              {formatPrice(Number(form.price) || 0)} ·{" "}
              {form.available ? "shown as available" : "shown as sold out"}
              {form.featured ? " · featured on the homepage" : ""}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
