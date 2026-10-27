"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Star } from "lucide-react";
import { RESTAURANT } from "@/lib/seed";
import { useReserve } from "../ReserveProvider";
import StatusBadge from "../StatusBadge";
import { ease } from "../Reveal";

const WORDS = ["City", "View", "Cafe", ];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { openReserve } = useReserve();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const contentFade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[640px] overflow-hidden">
      {/* Background + parallax */}
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950" />
        <Image
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2200&q=80"
          alt="Nocturne dining room at night"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,rgba(8,8,10,0.85)_100%)]" />
      </motion.div>

      {/* Floating accents */}
      <div className="pointer-events-none absolute top-[22%] left-[12%] h-40 w-40 rounded-full bg-gold-500/10 blur-3xl animate-float" />
      <div className="pointer-events-none absolute right-[10%] bottom-[24%] h-56 w-56 rounded-full bg-gold-700/10 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute top-[38%] right-[24%] hidden h-3 w-3 rotate-45 bg-gold-400/70 animate-float lg:block" />

      <motion.div
        style={{ y: contentY, opacity: contentFade }}
        className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-5 pt-24 sm:px-8"
      >
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          animate={{ opacity: 1, letterSpacing: "0.42em" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-[11px] text-gold-400 uppercase sm:text-xs"
        >
          Est. 2026· Kegalle, Sri Lanka
        </motion.p>

        <h1 className="mt-6 max-w-4xl font-display leading-[0.95] text-neutral-50">
          {WORDS.map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 60, rotateX: -40 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.85, delay: 0.3 + i * 0.12, ease }}
              className="mr-4 inline-block text-5xl sm:text-7xl lg:text-8xl"
            >
              {word}
            </motion.span>
          ))}
          <motion.span
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.66, ease }}
            className="inline-block text-5xl italic text-gradient-gold sm:text-7xl lg:text-8xl"
          >
            Experience.
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.95, ease }}
          className="mt-7 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg"
        >
          {RESTAURANT.subline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.15, ease }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link
            href="/menu"
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-gold-400 to-gold-600 px-9 py-4 text-sm font-semibold tracking-[0.16em] text-ink-950 uppercase transition-shadow duration-300 hover:shadow-[0_22px_50px_-16px_rgba(228,180,98,0.75)]"
          >
            <span className="relative z-10">Explore Menu</span>
            <span className="absolute inset-0 -translate-x-full bg-white/30 transition-transform duration-500 group-hover:translate-x-full" />
          </Link>
          
          
        </motion.div>
      </motion.div>

      {/* Bottom bar */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.4 }}
        className="absolute inset-x-0 bottom-6 z-10 mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 sm:px-8"
      >
        <StatusBadge />
        <motion.a
          href="#story"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-gold-300 backdrop-blur-md transition hover:border-gold-400/70"
          aria-label="Scroll to our story"
        >
          <ArrowDown className="h-4 w-4" />
        </motion.a>
        <p className="hidden text-xs tracking-[0.3em] text-neutral-400 uppercase sm:block">
          Tasting menu · Wed–Sun
        </p>
      </motion.div>
    </section>
  );
}
