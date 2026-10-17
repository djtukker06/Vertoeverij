import { asset } from "./config";

// Inhoud uit de aangeleverde teksten en Booking.com. Foto's zijn de oude foto's van Booking.com.
// TODO: klantdata. Vervangen door de nieuwe foto's van Marith (public/foto/accommodatie/).

export const HOUSE_FACTS: { value: string; label: string; note?: string }[] = [
  { value: "2", label: "slaapkamers" },
  { value: "2", label: "badkamers" },
  { value: "4", label: "personen" },
  { value: "Eigen", label: "terras" },
  { value: "Privé", label: "wellness", note: "(optioneel)" },
];

export type Room = { key: string; title: string; text: string; image: string; alt: string };

const a = (name: string) => asset(`/foto/accommodatie/${name}.webp`);

// Volgorde = volgorde in de fotorij: eerst de leefruimtes, dan slapen en badkamers.
export const ROOMS: Room[] = [
  {
    key: "woonkamer",
    title: "Woonkamer",
    text: "Gezellig ingericht, met tuindeuren die direct op het terras uitkomen.",
    image: a("woonkamer-2"),
    alt: "Woonkamer met bank, fauteuils en televisie",
  },
  // TODO: klantdata. Er is nog geen foto van de keuken (staat op de fotolijst voor Marith); tot die tijd het terras.
  {
    key: "terras",
    title: "Terras",
    text: "Je eigen terras met tuinset en vrij uitzicht over de weilanden.",
    image: a("terras"),
    alt: "Terras met tuinset en vrij uitzicht over de weilanden",
  },
  {
    key: "slaapkamer-1",
    title: "Eerste slaapkamer",
    text: "Ruim tweepersoonsbed en een eigen badkamer met toilet.",
    image: a("slaapkamer-1"),
    alt: "Slaapkamer met tweepersoonsbed en sfeerverlichting",
  },
  {
    key: "slaapkamer-2",
    title: "Tweede slaapkamer",
    text: "Onder het schuine dak, ook met een eigen badkamer.",
    image: a("slaapkamer-3"),
    alt: "Tweede slaapkamer met tweepersoonsbed onder het schuine dak",
  },
  {
    key: "badkamer",
    title: "Badkamers",
    text: "Twee badkamers met inloopdouche, wastafel en toilet.",
    // Breedste badkamerfoto: inloopdouche, wastafelmeubel en toilet in één beeld
    image: a("badkamer-2"),
    alt: "Badkamer met inloopdouche, wastafelmeubel en toilet",
  },
];

// Per groep één foto die in de sectie meewisselt. TODO: klantdata, vervangen door de foto's van Marith.
export type AmenityGroup = { title: string; items: string[]; image: string; alt: string };

export const AMENITIES: AmenityGroup[] = [
  {
    title: "Wonen en koken",
    items: ["Ruime woonkamer met televisie", "Volledig uitgeruste keuken", "Gratis wifi", "Rookvrij"],
    image: a("woonkamer-3"),
    alt: "Lichte woonkamer met bank, fauteuils, salontafel en een eiken buffetkast",
  },
  {
    title: "Slapen",
    items: ["Twee ruime slaapkamers", "Elke slaapkamer een eigen badkamer", "Met z'n tweeën ook één slaapkamer", "Kinderbedje op verzoek (0 tot 3 jaar)"],
    image: a("slaapkamer-4"),
    alt: "Slaapkamer met tweepersoonsbed en twee ramen met uitzicht op het weiland",
  },
  {
    title: "Buiten",
    items: ["Eigen terras", "Tuin met uitzicht over de weilanden", "Buitenhaard en barbecue", "Gratis parkeren"],
    image: a("terras-huis"),
    alt: "Het huis met het terras en de tuinset in de zon",
  },
  {
    title: "Wellness",
    items: ["Privé wellness, volledig voor jullie alleen", "Sauna, jacuzzi en Turks stoombad", "Bij je verblijf of los te boeken", "Onbemand: alle rust en privacy"],
    image: asset("/foto/wellness/sauna-warm.webp"),
    alt: "Sauna met houten banken, saunastenen en warm licht",
  },
];

/** Wellness De Zandloper: sectie op de homepage (zelfde opbouw als de kennismaking in het ontwerp) */
export const WELLNESS = {
  title: "Even helemaal ontspannen",
  image: asset("/foto/wellness/samen.webp"),
  alt: "Twee gasten in badjas in de sauna",
  // Carrousel in de wellness-sectie. TODO: klantdata, stockfoto's vervangen door foto's van de echte wellness.
  images: [
    { src: asset("/foto/wellness/samen.webp"), alt: "Twee gasten in badjas in de sauna", caption: "Samen in de sauna" },
    { src: asset("/foto/wellness/jacuzzi.webp"), alt: "Jacuzzi met warm licht", caption: "Jacuzzi" },
    { src: asset("/foto/wellness/sauna-glas.webp"), alt: "Stoomruimte achter een glazen deur", caption: "Turks stoombad" },
    { src: asset("/foto/wellness/sauna-warm.webp"), alt: "Sauna met houten banken en een emmer bij de saunakachel", caption: "Sauna" },
    { src: asset("/foto/wellness/regendouche.webp"), alt: "Regendouche naast de sauna", caption: "Regendouche", position: "50% 0%" },
  ],
  // Uit de aangeleverde teksten (Teksten.pdf, Wellness De Zandloper)
  story: [
    "Bij De Zandloper kun je gebruikmaken van een privé wellness. De wellness is volledig voor jullie alleen en is onbemand.",
    "Je hoeft dus met niemand rekening te houden. Je hebt alle privacy en maakt er rustig je eigen moment van.",
    "De wellness is een fijne aanvulling op je verblijf, maar is ook los te boeken. Even ontspannen na een wandeling of fietstocht, of omdat je zin hebt in wat rust.",
    "Geen drukte, geen andere gasten. Een moment voor jezelf.",
  ],
  facts: [
    { value: "Sauna", label: "om op te warmen" },
    { value: "Turks stoombad", label: "vochtige warmte" },
    { value: "Jacuzzi", label: "bruisend water" },
  ],
};
