import { CONFIG } from "./config";

export type ContactMessage = {
  subject: string;
  name: string;
  email: string;
  phone: string;
  message: string;
};

/**
 * Verstuurt een bericht uit het contactformulier. In WordPress naar het REST-endpoint van het theme;
 * in de Vite-site (geen endpoint) wordt het versturen gesimuleerd.
 */
export async function submitContactMessage(data: ContactMessage): Promise<void> {
  if (!CONFIG.contactEndpoint) {
    await new Promise((r) => window.setTimeout(r, 700));
    return;
  }
  const res = await fetch(CONFIG.contactEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(CONFIG.restNonce ? { "X-WP-Nonce": CONFIG.restNonce } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Bericht versturen mislukt (${res.status})`);
}
