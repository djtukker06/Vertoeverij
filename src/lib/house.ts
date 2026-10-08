import { asset } from "./config";

// Inhoud uit de aangeleverde teksten en Booking.com. Foto's zijn de oude foto's van Booking.com.
// TODO: klantdata. Vervangen door de nieuwe foto's van Marith (public/foto/accommodatie/).

export const HOUSE_FACTS = [
  { value: "2", label: "slaapkamers" },
  { value: "2", label: "badkamers" },
  { value: "4", label: "personen" },
  { value: "Eigen", label: "terras" },
  { value: "Privé", label: "wellness" },
];

export type Room = { key: string; title: string; text: string; image: string; alt: string };

const a = (name: string) => asset(`/foto/accommodatie/${name}.webp`);

export const ROOMS: Room[] = [
  {
    key: "woonkamer",
    title: "Woonkamer",
    text: "Gezellig ingericht, met tuindeuren naar het terras en het uitzicht over de weilanden.",
    image: a("woonkamer-2"),
    alt: "Woonkamer met bank, fauteuils en televisie",
  },
  {
    key: "slaapkamer-1",
    title: "Slaapkamer met eigen badkamer",
    text: "Ruim tweepersoonsbed en een eigen badkamer met toilet.",
    image: a("slaapkamer-1"),
    alt: "Slaapkamer met tweepersoonsbed en sfeerverlichting",
  },
  {
    key: "slaapkamer-2",
    title: "Tweede slaapkamer",
    text: "Ook met eigen badkamer. Met z'n tweeën? Dan gebruik je één kamer.",
    image: a("slaapkamer-3"),
    alt: "Tweede slaapkamer met tweepersoonsbed onder het schuine dak",
  },
  // TODO: klantdata. Er is nog geen foto van de keuken (staat op de fotolijst voor Marith); tot die tijd het terras.
  {
    key: "terras",
    title: "Terras",
    text: "Via de tuindeuren loop je zo naar buiten, met uitzicht over de weilanden.",
    image: a("terras"),
    alt: "Terras met tuinset en vrij uitzicht over de weilanden",
  },
  {
    key: "badkamer",
    title: "Badkamers",
    text: "Twee badkamers met inloopdouche, wastafel en toilet.",
    image: a("badkamer"),
    alt: "Badkamer met inloopdouche en toilet",
  },
];

export type AmenityGroup = { title: string; items: string[] };

export const AMENITIES: AmenityGroup[] = [
  {
    title: "Wonen en koken",
    items: ["Ruime woonkamer met televisie", "Volledig uitgeruste keuken", "Gratis wifi", "Rookvrij"],
  },
  {
    title: "Slapen",
    items: ["Twee ruime slaapkamers", "Elke slaapkamer een eigen badkamer", "Met z'n tweeën ook één slaapkamer", "Kinderbedje op verzoek (0 tot 3 jaar)"],
  },
  {
    title: "Buiten",
    items: ["Eigen terras", "Tuin met uitzicht over de weilanden", "Buitenhaard en barbecue", "Gratis parkeren"],
  },
  {
    title: "Wellness",
    items: ["Privé wellness, volledig voor jullie alleen", "Sauna, jacuzzi en Turks stoombad", "Bij je verblijf of los te boeken", "Onbemand: alle rust en privacy"],
  },
];

/** Wellness De Zandloper: sectie op de homepage (zelfde opbouw als de kennismaking in het ontwerp) */
export const WELLNESS = {
  title: "Even helemaal ontspannen",
  image: asset("/foto/wellness/samen.webp"),
  alt: "Twee gasten in badjas in de sauna",
  story: [
    "Bij De Zandloper kun je gebruikmaken van een privé wellness. De wellness is volledig voor jullie alleen en is onbemand.",
    "Je hoeft dus met niemand rekening te houden. Je hebt alle privacy en maakt er rustig je eigen moment van. Bij je verblijf, of los te boeken.",
  ],
  facts: [
    { value: "Sauna", label: "en Turks stoombad" },
    { value: "Jacuzzi", label: "voor jullie alleen" },
  ],
};
