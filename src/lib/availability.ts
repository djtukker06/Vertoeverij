import { addDays, dayKey, startOfDay } from "./dates";
import { CONFIG } from "./config";

// Tijden uit de huisregels (Booking.com). TODO: klantdata, minimaal en maximaal verblijf bevestigen.
export const MIN_NIGHTS = CONFIG.minNights ?? 1;
export const MAX_NIGHTS = CONFIG.maxNights ?? 14;
export const CHECK_IN = CONFIG.checkIn ?? "14:00";
export const CHECK_OUT = CONFIG.checkOut ?? "11:00";

// TODO: vervangen door de agenda uit het boekingssysteem.
// Voorbeeldbezetting, relatief aan de huidige maand zodat de demo nooit verloopt.
// Per maand: [eerste nacht, aantal nachten].
const SAMPLE_BOOKINGS: [number, number][][] = [
  [[3, 4], [9, 3], [16, 7], [27, 3]],
  [[1, 2], [6, 5], [14, 3], [20, 4]],
  [[4, 7], [18, 3], [24, 5]],
  [[2, 3], [10, 4], [21, 7]],
];

const booked = new Set<string>();
const isoToKey = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return dayKey(new Date(y, m - 1, d));
};
if (Array.isArray(CONFIG.bookedNights)) {
  // Echte bezetting (later uit de booking-plugin via WordPress)
  for (const iso of CONFIG.bookedNights) booked.add(isoToKey(iso));
} else if (CONFIG.demoAvailability !== false) (() => {
  const now = new Date();
  for (let offset = -1; offset <= 12; offset++) {
    const pattern = SAMPLE_BOOKINGS[((offset % SAMPLE_BOOKINGS.length) + SAMPLE_BOOKINGS.length) % SAMPLE_BOOKINGS.length];
    for (const [first, nights] of pattern) {
      for (let i = 0; i < nights; i++) booked.add(dayKey(new Date(now.getFullYear(), now.getMonth() + offset, first + i)));
    }
  }
})();

/** Is de nacht die op deze dag begint al verhuurd? */
export const isNightBooked = (d: Date) => booked.has(dayKey(d));

/** Aankomst kan als de dag niet in het verleden ligt en er minimaal MIN_NIGHTS vrije nachten volgen. */
export function canArriveOn(d: Date) {
  if (d < startOfDay(new Date())) return false;
  for (let i = 0; i < MIN_NIGHTS; i++) if (isNightBooked(addDays(d, i))) return false;
  return true;
}

/** Laatst mogelijke vertrekdag bij deze aankomst: de dag waarop de eerstvolgende boeking begint (wisseldag). */
export function latestDeparture(arrive: Date, maxNights = MAX_NIGHTS) {
  let d = arrive;
  for (let i = 0; i < maxNights && !isNightBooked(d); i++) d = addDays(d, 1);
  return d;
}

export type FreePeriod = { start: Date; end: Date; nights: number };

/** Eerstvolgende vrije periodes van minimaal MIN_NIGHTS nachten (end = vertrekdag). */
export function nextFreePeriods(count: number, from = startOfDay(new Date()), horizonDays = 365): FreePeriod[] {
  const periods: FreePeriod[] = [];
  let d = from;
  for (let i = 0; i < horizonDays && periods.length < count; i++) {
    if (canArriveOn(d) && (i === 0 || isNightBooked(addDays(d, -1)) || addDays(d, -1) < from)) {
      let end = d;
      while (!isNightBooked(end) && end < addDays(from, horizonDays)) end = addDays(end, 1);
      const nights = Math.round((end.getTime() - d.getTime()) / 86_400_000);
      periods.push({ start: d, end, nights });
      d = end;
      i += nights;
      continue;
    }
    d = addDays(d, 1);
  }
  return periods;
}
