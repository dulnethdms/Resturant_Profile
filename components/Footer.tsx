"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "./SocialIcons";
import { RESTAURANT, WEEKLY_HOURS } from "@/lib/seed";

const SOCIALS = [
  { href: "https://instagram.com", icon: InstagramIcon, label: "Instagram" },
  { href: "https://facebook.com", icon: FacebookIcon, label: "Facebook" },
  { href: "https://youtube.com", icon: YoutubeIcon, label: "YouTube" },
];

const HOUR_ORDER = [0, 1, 2, 3, 4, 5, 6];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");

  const subscribe = (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || state !== "idle") return;
    setState("loading");
    window.setTimeout(() => setState("success"), 800);
  };

  return (
    <footer className="relative border-t border-white/5 bg-ink-900">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gold-600/70 to-transparent" />

      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-10">
        <div>
          <p className="font-display text-2xl tracking-[0.3em] text-gold-200">NOCTURNE</p>
          <p className="mt-1 text-xs tracking-[0.35em] text-gold-600 uppercase">
            {RESTAURANT.tagline}
          </p>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-neutral-400">
            {RESTAURANT.subline}
          </p>
          <div className="mt-6 flex gap-3">
            {SOCIALS.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-neutral-400 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/60 hover:text-gold-300"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs tracking-[0.3em] text-gold-400 uppercase">Visit</h4>
          <ul className="mt-5 space-y-3 text-sm text-neutral-400">
            <li>{RESTAURANT.address}</li>
            <li>
              <a href={`tel:${RESTAURANT.phone}`} className="transition hover:text-gold-300">
                {RESTAURANT.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${RESTAURANT.email}`} className="transition hover:text-gold-300">
                {RESTAURANT.email}
              </a>
            </li>
            <li>
              <Link href="/menu" className="transition hover:text-gold-300">
                Explore the menu →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs tracking-[0.3em] text-gold-400 uppercase">Hours</h4>
          <ul className="mt-5 space-y-2 text-sm text-neutral-400">
            {HOUR_ORDER.map((day) => (
              <li key={day} className="flex justify-between gap-4">
                <span>{WEEKLY_HOURS[day].label.split(" · ")[0]}</span>
                <span className="text-neutral-500">
                  {WEEKLY_HOURS[day].label.split(" · ")[1]}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs tracking-[0.3em] text-gold-400 uppercase">The Quiet List</h4>
          <p className="mt-5 text-sm leading-relaxed text-neutral-400">
            Seasonal menus, cellar dinners and one-night collaborations — never more than twice a
            month.
          </p>
          <form onSubmit={subscribe} className="mt-5">
            <div className="group flex items-center gap-2 border-b border-white/15 pb-2 transition-colors focus-within:border-gold-500">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                disabled={state !== "idle"}
                className="w-full bg-transparent text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                disabled={state !== "idle"}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500 text-ink-950 transition-all duration-300 hover:bg-gold-400 disabled:opacity-70"
              >
                {state === "loading" ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : state === "success" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>
            </div>
            <div className="mt-3 h-5 text-xs">
              <AnimatePresence mode="wait">
                {state === "success" ? (
                  <motion.p
                    key="ok"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-gold-300"
                  >
                    Welcome to the list — check your inbox. ✦
                  </motion.p>
                ) : (
                  <motion.p
                    key="hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600"
                  >
                    No spam. Unsubscribe any time.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-neutral-500 sm:flex-row sm:px-8">
          <p>
            © {new Date().getFullYear()} {RESTAURANT.name} Kitchen & Bar. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <span>Privacy</span>
            <span>Terms</span>
            <Link href="/admin" className="flex items-center gap-1.5 transition hover:text-gold-300">
              Staff
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
