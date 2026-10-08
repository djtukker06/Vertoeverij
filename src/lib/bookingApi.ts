import { CONFIG } from "./config";

export type BookingRequest = {
  arrive: string; // JJJJ-MM-DD
  leave: string;
  adults: number;
  children: number;
  pets: number;
  /** Privé wellness bij het verblijf */
  wellness: boolean;
  name: string;
  email: string;
  phone: string;
  note: string;
  /** Prijs zoals de bezoeker die zag (ter info; de server rekent zelf opnieuw) */
  total: number;
};

/**
 * Verstuurt een boekingsaanvraag. In WordPress naar het REST-endpoint van het theme
 * (later het boekingssysteem).
 * In de Vite-site (geen endpoint) wordt het versturen gesimuleerd.
 */
export async function submitBookingRequest(data: BookingRequest): Promise<void> {
  if (!CONFIG.bookingEndpoint) {
    await new Promise((r) => window.setTimeout(r, 700));
    return;
  }
  const res = await fetch(CONFIG.bookingEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(CONFIG.restNonce ? { "X-WP-Nonce": CONFIG.restNonce } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Boekingsaanvraag mislukt (${res.status})`);
}
