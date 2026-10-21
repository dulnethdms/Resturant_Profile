"use client";

import { MapPin, Navigation, Phone } from "lucide-react";
import { RESTAURANT, WEEKLY_HOURS } from "@/lib/seed";
import { cn, formatTime } from "@/lib/utils";
import Reveal from "../Reveal";
import StatusBadge from "../StatusBadge";

const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

function MapCanvas() {
  return (
    <div className="relative h-full min-h-[380px] overflow-hidden rounded-3xl border border-gold-700/25 bg-ink-850">
      <svg viewBox="0 0 400 320" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="mapbg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#14171e" />
            <stop offset="100%" stopColor="#0b0c10" />
          </linearGradient>
        </defs>
        <rect width="400" height="320" fill="url(#mapbg)" />

        {/* City blocks */}
        {[30, 110, 190, 270, 350].map((x) =>
          [30, 105, 180, 255].map((y) => (
            <rect
              key={`${x}-${y}`}
              x={x - 34}
              y={y - 26}
              width="62"
              height="46"
              rx="4"
              fill="#1b1f28"
              stroke="#262b36"
              strokeWidth="1"
            />
          )),
        )}

        {/* Streets */}
        {[30, 105, 180, 255].map((y) => (
          <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} stroke="#262b36" strokeWidth="7" />
        ))}
        {[30, 110, 190, 270, 350].map((x) => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="320" stroke="#262b36" strokeWidth="7" />
        ))}

        {/* Diagonal avenue */}
        <line x1="-20" y1="300" x2="420" y2="40" stroke="#262b36" strokeWidth="11" />
        <line
          x1="-20"
          y1="300"
          x2="420"
          y2="40"
          stroke="#d59f43"
          strokeWidth="1.5"
          strokeDasharray="7 9"
          opacity="0.55"
        />

        {/* Park */}
        <rect x="270" y="128" width="66" height="52" rx="8" fill="#15251d" stroke="#1e3a2b" />

        {/* Water band */}
        <path
          d="M0 0 L70 0 C60 60 30 90 0 105 Z"
          fill="#101a26"
          stroke="#17293c"
          strokeWidth="1.5"
        />
      </svg>

      {/* Pin */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
        <div className="relative flex flex-col items-center">
          <span className="absolute top-6 h-6 w-6 rounded-full bg-gold-400/60 animate-ping-slow" />
          <div className="flex h-11 w-11 rotate-45 items-center justify-center rounded-full rounded-br-none bg-gradient-to-br from-gold-300 to-gold-600 shadow-[0_16px_30px_-10px_rgba(228,180,98,0.8)]">
            <MapPin className="h-5 w-5 -rotate-45 text-ink-950" />
          </div>
          <span className="mt-2 rounded-full border border-gold-600/40 bg-ink-950/90 px-3 py-1 text-[10px] font-semibold tracking-[0.22em] text-gold-200 uppercase backdrop-blur-sm">
            Nocturne
          </span>
        </div>
      </div>

      <p className="absolute bottom-4 left-5 text-[10px] tracking-[0.3em] text-neutral-500 uppercase">
        SoHo · New York
      </p>
    </div>
  );
}

export default function HoursLocation() {
  const today = new Date().getDay();

  return (
    <section id="visit" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="text-center">
          <p className="text-[11px] tracking-[0.42em] text-gold-500 uppercase">Find us</p>
          <h2 className="mt-4 font-display text-4xl text-neutral-50 sm:text-5xl">
            Hours & <span className="italic text-gradient-gold">Location</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {/* Hours */}
          <Reveal className="h-full">
            <div className="flex h-full flex-col rounded-3xl border border-white/8 bg-ink-850/70 p-8 backdrop-blur-sm sm:p-10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="font-display text-2xl text-gold-100">Opening hours</h3>
                <StatusBadge compact />
              </div>

              <ul className="mt-7 space-y-1">
                {DAY_ORDER.map((day) => {
                  const hours = WEEKLY_HOURS[day];
                  const isToday = day === today;
                  const [dayName, time] = hours.label.split(" · ");
                  return (
                    <li
                      key={day}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-colors",
                        isToday
                          ? "bg-gold-500/10 text-gold-200 ring-1 ring-gold-600/30"
                          : "text-neutral-400",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span className={cn(isToday && "text-gold-400")}>{dayName}</span>
                        {isToday && (
                          <span className="rounded-full bg-gold-500/20 px-2 py-0.5 text-[10px] tracking-[0.18em] text-gold-300 uppercase">
                            Today
                          </span>
                        )}
                      </span>
                      <span className="tabular-nums">
                        {time === undefined
                          ? "Closed"
                          : `${formatTime(hours.open)} – ${formatTime(hours.close)}`}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-7 flex items-start gap-3 rounded-2xl border border-white/8 bg-ink-900/60 p-5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <div className="text-sm">
                  <p className="text-neutral-300">Large parties & private dining</p>
                  <a
                    href={`tel:${RESTAURANT.phone}`}
                    className="text-gold-300 transition hover:text-gold-200"
                  >
                    {RESTAURANT.phone}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Map */}
          <Reveal delay={0.12} className="h-full">
            <div className="flex h-full flex-col gap-5">
              <MapCanvas />
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/8 bg-ink-850/70 px-6 py-5">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  <p className="text-sm leading-relaxed text-neutral-300">
                    {RESTAURANT.address}
                  </p>
                </div>
                <a
                  href={RESTAURANT.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-full border border-gold-500/50 px-5 py-2.5 text-xs font-semibold tracking-[0.16em] text-gold-200 uppercase transition hover:bg-gold-500/10"
                >
                  <Navigation className="h-3.5 w-3.5" /> Directions
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
