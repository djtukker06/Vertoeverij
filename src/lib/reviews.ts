// Echte beoordelingen van Booking.com (aangeleverd in Teksten.pdf), alleen het positieve deel. Alleen spelling en interpunctie licht rechtgezet.
export type Review = { name: string; country: string; date: string; score: string; title: string; text: string; stay: string };

export const REVIEWS: Review[] = [
  {
    name: "Andries",
    country: "Nederland",
    date: "september 2024",
    score: "9,0",
    title: "Heerlijk rustige dagen gehad in compleet ingerichte vakantiewoning",
    text: "Super compleet ingerichte vakantiewoning met een fijn terras voor het huis. Prachtige omgeving en heerlijk rustige ligging, uitzicht op weilanden met paarden. Leuke plaatsen als Ootmarsum, Ommen en Hardenberg makkelijk bereikbaar met de auto. Contact met verhuurder vlot en makkelijk. Kortom een aanrader!",
    stay: "4 nachten, stel",
  },
  {
    name: "Ron",
    country: "Nederland",
    date: "maart 2026",
    score: "9,0",
    title: "Keurig appartement, zeer comfortabel",
    text: "Keurig netjes en heel schoon appartement. Heel fijn dat elke slaapkamer zijn eigen badkamer heeft met eigen toilet. Goede bedden. Landelijk gelegen. Communicatie als zorgvuldig ervaren.",
    stay: "1 nacht",
  },
  {
    name: "Jet",
    country: "Nederland",
    date: "september 2025",
    score: "8,0",
    title: "Super accommodatie, erg netjes en schoon",
    text: "Erg mooie, rustige ligging. Mooi uitzicht over de weilanden. Het ziet er allemaal erg netjes uit. Mooie slaapkamers, erg ruim en netjes. Badkamers ook top.",
    stay: "3 nachten",
  },
  {
    name: "Diane",
    country: "België",
    date: "januari 2026",
    score: "9,0",
    title: "Leuk en ruim appartement",
    text: "Het was een leuk en ruim appartement met mooie slaapkamers en badkamers. Alles was aanwezig en zeer proper. Mooi en rustig gelegen in de natuur.",
    stay: "3 nachten, stel",
  },
  {
    name: "Lucas",
    country: "Nederland",
    date: "juli 2024",
    score: "9,0",
    title: "Fantastisch",
    text: "Prima geregeld. Ontvingen tijdig de melding dat de sleutel klaar lag in het kluisje met de daarbij behorende code. Communicatie uitstekend, de accommodatie uitstekend, de verzorging en hygiëne uitstekend. Top locatie en zeker voor herhaling vatbaar.",
    stay: "1 nacht",
  },
];
