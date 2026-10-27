"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, Menu as MenuIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReserve } from "./ReserveProvider";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  
  
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openReserve } = useReserve();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  // The admin dashboard has its own chrome.
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-white/5 bg-ink-950/85 py-3 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl"
            : "border-b border-transparent py-5",
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
          <Link href="/" className="group flex items-baseline gap-1.5">
            <span className="font-display text-xl tracking-[0.32em] text-gold-200 sm:text-2xl">
              Belmont
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500 transition-transform duration-300 group-hover:scale-150" />
          </Link>

          <div className="hidden items-center gap-9 lg:flex">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative text-[13px] tracking-[0.2em] uppercase text-neutral-300 transition-colors hover:text-gold-300",
                  pathname === link.href && "text-gold-300",
                )}
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              title="Staff dashboard"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 text-neutral-400 transition hover:border-gold-500/60 hover:text-gold-300 sm:flex"
            >
              <Lock className="h-4 w-4" />
            </Link>
            
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gold-200 lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-ink-950/97 backdrop-blur-xl lg:hidden"
          >
            <div className="flex h-full flex-col items-center justify-center gap-7">
              {LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ delay: 0.06 * i, duration: 0.45 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-display text-4xl text-gold-200 transition hover:text-gold-400"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="mt-2 flex items-center gap-2 text-sm tracking-[0.2em] text-neutral-400 uppercase"
              >
                <Lock className="h-3.5 w-3.5" /> Staff Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
