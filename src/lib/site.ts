import { CONFIG } from "./config";

// Adres uit de aangeleverde teksten. TODO: klantdata. Telefoon en e-mail volgen (Marith vraagt ze op), Instagram bevestigen.
export const INSTAGRAM = CONFIG.instagram ?? { handle: "@vertoeverijdezandloper", url: "https://www.instagram.com/" };
export const EMAIL = CONFIG.email ?? "info@vertoeverijdezandloper.nl";
export const ADDRESS = CONFIG.address ?? { street: "Crullsweg 12", postal: "7694 TA", city: "Kloosterhaar" };
export const PHONE = CONFIG.phone ?? "+31 6 00 00 00 00";
export const TAGLINE = "Een fijne plek om heerlijk te vertoeven.";
/** Score op Booking.com (uit de aangeleverde teksten, stand oktober 2026) */
export const REVIEW_SCORE = { score: "8,3", label: "Erg goed", count: 57 };
