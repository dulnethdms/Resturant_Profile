"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Check, Clock, LoaderCircle, Users, X } from "lucide-react";

const TIME_SLOTS = ["5:30 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM"];

function tomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default function ReservationModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState(tomorrow());
  const [time, setTime] = useState("7:30 PM");
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || state !== "idle") return;
    setState("loading");
    window.setTimeout(() => setState("success"), 900);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-950/80 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-gold-700/30 bg-ink-850 p-8 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.95)]"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-neutral-400 transition hover:border-gold-500/60 hover:text-gold-300"
        >
          <X className="h-4 w-4" />
        </button>

        {state === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-500/15 text-gold-300 ring-1 ring-gold-500/40"
            >
              <Check className="h-7 w-7" />
            </motion.div>
            <h3 className="mt-6 font-display text-3xl text-gold-200">Table requested</h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              Thank you, {name.split(" ")[0]}. We&apos;ve pencilled in{" "}
              <span className="text-gold-300">
                {guests} {guests === 1 ? "guest" : "guests"}
              </span>{" "}
              on <span className="text-gold-300">{date}</span> at{" "}
              <span className="text-gold-300">{time}</span>. Our maître d&apos; will confirm by
              phone shortly.
            </p>
            <button
              onClick={onClose}
              className="mt-7 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 px-8 py-3 text-sm font-semibold tracking-[0.14em] text-ink-950 uppercase"
            >
              Done
            </button>
          </motion.div>
        ) : (
          <>
            <p className="text-xs tracking-[0.35em] text-gold-500 uppercase">Reservations</p>
            <h3 className="mt-2 font-display text-3xl text-gold-200">Reserve a table</h3>
            <p className="mt-2 text-sm text-neutral-400">
              Tables are held for 15 minutes. For parties over 8, please call us.
            </p>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[11px] tracking-[0.2em] text-neutral-500 uppercase">
                    Name
                  </span>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-white/10 bg-ink-800 px-4 py-3 text-sm text-neutral-200 placeholder:text-neutral-600 focus:border-gold-500/70 focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[11px] tracking-[0.2em] text-neutral-500 uppercase">
                    Phone
                  </span>
                  <input
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-xl border border-white/10 bg-ink-800 px-4 py-3 text-sm text-neutral-200 placeholder:text-neutral-600 focus:border-gold-500/70 focus:outline-none"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-[11px] tracking-[0.2em] text-neutral-500 uppercase">
                    <Users className="h-3 w-3" /> Guests
                  </span>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-ink-800 px-3 py-3 text-sm text-neutral-200 focus:border-gold-500/70 focus:outline-none"
                  >
                    {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-[11px] tracking-[0.2em] text-neutral-500 uppercase">
                    <Calendar className="h-3 w-3" /> Date
                  </span>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-ink-800 px-3 py-3 text-sm text-neutral-200 focus:border-gold-500/70 focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-[11px] tracking-[0.2em] text-neutral-500 uppercase">
                    <Clock className="h-3 w-3" /> Time
                  </span>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-ink-800 px-3 py-3 text-sm text-neutral-200 focus:border-gold-500/70 focus:outline-none"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <button
                type="submit"
                disabled={state === "loading"}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 py-3.5 text-sm font-semibold tracking-[0.16em] text-ink-950 uppercase transition-all duration-300 hover:shadow-[0_18px_44px_-14px_rgba(228,180,98,0.7)] disabled:opacity-70"
              >
                {state === "loading" && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {state === "loading" ? "Confirming…" : "Confirm request"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
