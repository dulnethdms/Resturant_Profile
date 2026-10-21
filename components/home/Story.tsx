"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Quote } from "lucide-react";
import Reveal, { staggerContainer, staggerItem } from "../Reveal";

const STATS = [
  { value: "27", label: "Seats nightly" },
  { value: "1", label: "Open kitchen" },
  { value: "5", label: "Course tasting" },
  { value: "2016", label: "Founded" },
];

export default function Story() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "8%"]);
  const img2Y = useTransform(scrollYProgress, [0, 1], ["8%", "-6%"]);

  return (
    <section ref={ref} id="story" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-gold-700/10 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        {/* Image collage */}
        <div className="relative order-2 h-[440px] sm:h-[540px] lg:order-1">
          <motion.div
            style={{ y: imgY }}
            className="absolute top-0 left-0 h-[75%] w-[72%] overflow-hidden rounded-3xl border border-white/5 shadow-[0_40px_90px_-45px_rgba(0,0,0,1)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-ink-700 to-ink-900" />
            <Image
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80"
              alt="Chef plating a dish at the pass"
              fill
              sizes="(max-width: 1024px) 70vw, 36vw"
              className="object-cover"
            />
          </motion.div>

          <motion.div
            style={{ y: img2Y }}
            className="absolute right-0 bottom-0 h-[60%] w-[58%] overflow-hidden rounded-3xl border border-gold-700/25 shadow-[0_40px_90px_-40px_rgba(0,0,0,1)]"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-ink-800 to-ink-700" />
            <Image
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80"
              alt="Candlelit table setting"
              fill
              sizes="(max-width: 1024px) 60vw, 28vw"
              className="object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="absolute top-[58%] left-[8%] rounded-2xl border border-gold-600/30 bg-ink-900/90 px-6 py-5 backdrop-blur-md animate-float"
          >
            <p className="font-display text-3xl text-gradient-gold">4.9★</p>
            <p className="mt-1 text-[11px] tracking-[0.24em] text-neutral-400 uppercase">
              1,240 diners
            </p>
          </motion.div>
        </div>

        {/* Copy */}
        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="text-[11px] tracking-[0.42em] text-gold-500 uppercase">Our Story</p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-neutral-50 sm:text-5xl">
              Fire, season, and <span className="italic text-gradient-gold">restraint</span>.
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-6 leading-relaxed text-neutral-400">
              Nocturne began in a 27-seat room on Lantern Row with a single hearth and a stubborn
              idea: that dinner should feel like the quietest, richest hour of your day. We cook
              modern European — butter, smoke, acid, patience — with produce from three farms
              within ninety miles.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <blockquote className="mt-8 border-l-2 border-gold-500/70 pl-6">
              <Quote className="h-5 w-5 text-gold-500/70" />
              <p className="mt-3 font-display text-xl leading-relaxed text-gold-100 italic sm:text-2xl">
                “Cook less than you think, season more than you dare, and let the fire have the last
                word.”
              </p>
              <footer className="mt-3 text-xs tracking-[0.3em] text-neutral-500 uppercase">
                Elena Márquez — Executive Chef
              </footer>
            </blockquote>
          </Reveal>

          <motion.dl
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4"
          >
            {STATS.map((stat) => (
              <motion.div key={stat.label} variants={staggerItem}>
                <dt className="font-display text-3xl text-gold-300">{stat.value}</dt>
                <dd className="mt-1 text-[11px] tracking-[0.2em] text-neutral-500 uppercase">
                  {stat.label}
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
