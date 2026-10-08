import { CONFIG, asset } from "./config";

/**
 * Teksten in de React-onderdelen. In WordPress overschrijfbaar via window.zandloperConfig.texts
 * (Heidelust > Instellingen). De standaardwaarden hieronder zijn de teksten van de Vite-site.
 */
const DEFAULT_TEXTS = {
  heroCta: "Boek je verblijf",
  bookingTitle: "Even heerlijk vertoeven?",
  bookingIntro: "Kies je data, vul je gezelschap in en geef aan of je de privé wellness erbij wilt. De prijs zie je direct.",
  bookingHouse: "Appartement met privé wellness",
  bookingPaymentNote: "Je betaalt pas als we je aanvraag hebben bevestigd.",
  bookingSubmit: "Boeking aanvragen",
  bookingThanks: "We bekijken je aanvraag en nemen zo snel mogelijk contact met je op.",
  bookingError: "Versturen lukte niet. Probeer het opnieuw of mail ons direct.",
  nextFreeTitle: "Eerstvolgende vrije periodes",
  nextFreeIntro: "Kies een periode om meteen verder te boeken.",
  nextPeriodLabel: "Eerstvolgende vrije periode",
  overviewTitle: "De komende zes maanden",
  overviewIntro: "Groen is vrij. Klik op een dag om die als aankomst te kiezen, daarna kies je hieronder je vertrek.",
  overviewWatermark: "Agenda",
  calculatorTitle: "Reken je verblijf uit",
  calculatorIntro: "Een indicatie op basis van een aankomst op maandag. De exacte prijs zie je zodra je data kiest.",
  calculatorCta: "Kies je data",
  contactSubmit: "Bericht versturen",
  // TODO: klantdata. Reactietijd laten bevestigen door de eigenaar.
  contactThanks: "Je bericht is binnen. We reageren zo snel mogelijk.",
  contactError: "Versturen lukte niet. Probeer het opnieuw of mail ons direct.",
  newsletterTitle: "Als eerste weten wanneer de wellness open is?",
  newsletterIntro: "Eén mail per seizoen, met vrije weekenden en nieuws over de wellness.",
  newsletterSuccess: "Gelukt. Je hoort van ons zodra er nieuws is.",
};

export type TextKey = keyof typeof DEFAULT_TEXTS;

export const TEXT: Record<TextKey, string> = { ...DEFAULT_TEXTS };
for (const [key, value] of Object.entries(CONFIG.texts ?? {})) {
  if (key in TEXT && typeof value === "string" && value.trim()) TEXT[key as TextKey] = value;
}

/** Slideshow-foto's in de hero (volledige URL's). Eerste foto = statische foto en LCP.
 *  TODO: klantdata. Nu een wellness-stockfoto (de wellness is in aanbouw) en twee oude foto's van Booking.com;
 *  vervangen door de nieuwe foto's van Marith. */
export const HERO_PHOTOS: string[] = CONFIG.heroPhotos?.length
  ? CONFIG.heroPhotos
  : ["foto/wellness/sauna-warm.webp", "foto/accommodatie/huis-avond.webp", "foto/wellness/jacuzzi.webp"].map(asset);
