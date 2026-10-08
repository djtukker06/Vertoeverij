import { asset } from "./config";

export type Activity = { title: string; text: string; image: string; alt: string; duration: string; distance: string };

// Uit de aangeleverde teksten en de afstanden van Booking.com. De sfeerbeelden zijn gegenereerd
// (geen foto's van deze plekken). TODO: klantdata, vervangen door eigen of rechtenvrije foto's.
export const ACTIVITIES: Activity[] = [
  {
    title: "Wandelen in de natuur",
    text: "Trek je wandelschoenen aan. In de buurt vind je verschillende wandelroutes en natuurgebieden, zoals de Fayersheide.",
    image: asset("/foto/omgeving/heide.webp"),
    alt: "Zandpad door de heide met berken en dennen",
    duration: "Halve dag",
    distance: "12 km",
  },
  {
    title: "Fietsen langs de weilanden",
    text: "Vlakke fietspaden langs weilanden en bos. Ommen, Hardenberg en Ootmarsum zijn een mooie dagtocht.",
    image: asset("/foto/omgeving/fietspad.webp"),
    alt: "Fietspad tussen weilanden met twee geparkeerde fietsen",
    duration: "Dag",
    distance: "Vanaf de deur",
  },
  {
    title: "Koffie bij het theehuis",
    text: "Restaurant De Kleinhaar ligt op 1,7 kilometer. Ook Koffie- & Theehuys Hongerdyck en Jet's Theehuus zijn dichtbij.",
    image: asset("/foto/omgeving/terras.webp"),
    alt: "Koffie en appeltaart op een terras in een theetuin",
    duration: "Ochtend",
    distance: "1,7 km",
  },
  {
    title: "Een dagje uit",
    text: "Bezoek het Vechtpark in Hardenberg, het Giga Konijnenhol of steek de grens over naar Duitsland.",
    image: asset("/foto/omgeving/vecht.webp"),
    alt: "Rivier met rietkragen en wilgen in de avond",
    duration: "Dag",
    distance: "11 km",
  },
  {
    title: "Over de grens",
    text: "Duitsland ligt om de hoek. Uelsen, met de Abenteuerspielplatz en het Bronzezeithof, ligt op 16 kilometer.",
    image: asset("/foto/omgeving/gras-zonsondergang.webp"),
    alt: "Grassen in tegenlicht bij zonsondergang",
    duration: "Dag",
    distance: "16 km",
  },
];
