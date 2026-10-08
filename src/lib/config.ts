// Runtime-configuratie. In de Vite-site is deze leeg (standaardwaarden hieronder gelden).
// In het WordPress-theme zet functions.php `window.zandloperConfig` vanuit inc/config.php: één bron voor PHP én JS.
type RuntimeConfig = {
  assetBase?: string;
  minNights?: number;
  maxNights?: number;
  checkIn?: string;
  checkOut?: string;
  maxGuests?: number;
  maxPets?: number;
  rates?: Partial<{
    weekday: number;
    weekend: number;
    highSeason: number;
    cleaning: number;
    touristTaxPerPersonNight: number;
    petPerStay: number;
    deposit: number;
  }>;
  instagram?: { handle: string; url: string };
  email?: string;
  phone?: string;
  address?: { street: string; postal: string; city: string };
  /** Teksten in de React-onderdelen (zie src/lib/content.ts voor de sleutels en standaardteksten) */
  texts?: Record<string, string>;
  /** Volledige URL's van de slideshow-foto's in de hero */
  heroPhotos?: string[];
  /** Bezette nachten als "JJJJ-MM-DD" (later uit de booking-plugin). Ontbreekt dit: demo-bezetting. */
  bookedNights?: string[];
  /** false = geen demo-bezetting tonen als er geen echte gegevens zijn */
  demoAvailability?: boolean;
  /** REST-endpoint voor boekingsaanvragen (WordPress). Ontbreekt dit: aanvraag wordt alleen gesimuleerd. */
  bookingEndpoint?: string;
  /** REST-endpoint voor het contactformulier (WordPress). Ontbreekt dit: versturen wordt alleen gesimuleerd. */
  contactEndpoint?: string;
  restNonce?: string;
};

export const CONFIG: RuntimeConfig = (globalThis as { zandloperConfig?: RuntimeConfig }).zandloperConfig ?? {};

/** Pad naar een afbeelding uit /public (Vite) of uit assets/images van het theme (WordPress). */
export const asset = (path: string) =>
  /^https?:\/\//.test(path) ? path : `${CONFIG.assetBase ?? "/"}${path.replace(/^\//, "")}`;
