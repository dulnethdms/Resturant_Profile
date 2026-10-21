import { WEEKLY_HOURS } from "./seed";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

export function formatTime(minutesFromMidnight: number) {
  const m = ((minutesFromMidnight % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  const min = m % 60;
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(min).padStart(2, "0")} ${suffix}`;
}

export interface OpenStatus {
  open: boolean;
  message: string;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function getOpenStatus(now: Date = new Date()): OpenStatus {
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const today = WEEKLY_HOURS[day];
  const yesterday = WEEKLY_HOURS[(day + 6) % 7];

  // Service that crossed midnight is still running in the early hours.
  if (yesterday && !yesterday.closed && yesterday.close > 1440) {
    if (mins < yesterday.close - 1440) {
      return { open: true, message: "Open now · serving until late" };
    }
  }

  if (today && !today.closed && mins >= today.open && mins < Math.min(today.close, 1440)) {
    return {
      open: true,
      message: `Open now · kitchen closes ${formatTime(Math.min(today.close, 1440))}`,
    };
  }

  if (today && !today.closed && mins < today.open) {
    return { open: false, message: `Closed · opens today at ${formatTime(today.open)}` };
  }

  for (let offset = 1; offset <= 7; offset++) {
    const next = WEEKLY_HOURS[(day + offset) % 7];
    if (next && !next.closed) {
      const when = offset === 1 ? "tomorrow" : DAY_NAMES[(day + offset) % 7];
      return { open: false, message: `Closed · opens ${when} at ${formatTime(next.open)}` };
    }
  }

  return { open: false, message: "Closed" };
}
