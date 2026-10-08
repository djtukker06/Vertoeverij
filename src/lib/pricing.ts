import { addDays } from "./dates";
import { CONFIG } from "./config";

// TODO: klantdata. Voorbeeldtarieven; vervangen door de echte prijzen (of uit het boekingssysteem halen).
export const RATES = {
  ...{
  weekday: 115,
  weekend: 135, // vrijdag- en zaterdagnacht
  highSeason: 145, // juli en augustus
  cleaning: 35,
  touristTaxPerPersonNight: 1.5,
  petPerStay: 15,
  deposit: 100, // borg, alleen ter info: niet in het totaal
  wellnessPerStay: 79, // privé wellness, één tijdslot van 2,5 uur voor het hele gezelschap
  },
  ...CONFIG.rates,
};

/** Prijs van de nacht die op deze dag begint. */
export function nightRate(d: Date) {
  const month = d.getMonth();
  if (month === 6 || month === 7) return RATES.highSeason;
  const day = d.getDay();
  return day === 5 || day === 6 ? RATES.weekend : RATES.weekday;
}

export const lowestRate = Math.min(RATES.weekday, RATES.weekend, RATES.highSeason);

export type Quote = {
  nights: number;
  lodging: number;
  cleaning: number;
  touristTax: number;
  pets: number;
  wellness: number;
  total: number;
};

export function quote(arrive: Date, leave: Date, guests: number, pets: number, wellness = false): Quote {
  const nights = Math.round((leave.getTime() - arrive.getTime()) / 86_400_000);
  let lodging = 0;
  for (let i = 0; i < nights; i++) lodging += nightRate(addDays(arrive, i));
  const touristTax = Math.round(RATES.touristTaxPerPersonNight * guests * nights * 100) / 100;
  const petCost = pets * RATES.petPerStay;
  const wellnessCost = wellness ? RATES.wellnessPerStay : 0;
  return {
    nights,
    lodging,
    cleaning: RATES.cleaning,
    touristTax,
    pets: petCost,
    wellness: wellnessCost,
    total: lodging + RATES.cleaning + touristTax + petCost + wellnessCost,
  };
}

const eur = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" });
const eurRound = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
/** Bedrag zonder centen als het een heel getal is, anders met centen. */
export const formatEuro = (n: number) => (Number.isInteger(n) ? eurRound.format(n) : eur.format(n));
