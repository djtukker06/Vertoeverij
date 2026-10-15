import { asset } from "./config";

export type Credit = { author: string; license: string; url: string };
export type Activity = {
  title: string;
  text: string;
  image: string;
  alt: string;
  duration: string;
  distance: string;
  /** Naamsvermelding (verplicht bij CC BY/CC BY-SA) */
  credit?: Credit;
};

// Echte foto's van plekken in de buurt, van Wikimedia Commons (vrije licentie, naamsvermelding verplicht).
// Afstanden hemelsbreed vanaf Crullsweg 12 (opnamelocatie uit de GPS-gegevens van de foto).
// TODO: klantdata, eventueel vervangen door eigen foto's van Marith.
export const ACTIVITIES: Activity[] = [
  {
    title: "Wandelen langs de Vecht",
    text: "In de Boswachterij Hardenberg slingert de Vecht door bloeiend grasland. Vanaf de Distelberg kijk je ver over het dal.",
    image: asset("/foto/omgeving/vecht-distelberg.webp"),
    alt: "De Vecht bij de Distelberg met een wandelpad door gele bloemen",
    duration: "Halve dag",
    distance: "8 km",
    credit: { author: "Ahospers", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Boswachterij_Hardenberg_Vecht_Distelberg_06_47_41_196000.jpeg" },
  },
  {
    title: "Ootmarsum",
    text: "Een stadje met kinderkopjes, oude boerderijen en galeries. Gasten raden het aan als dagje uit vanaf De Zandloper.",
    image: asset("/foto/omgeving/ootmarsum.webp"),
    alt: "Een straatje met kinderkopjes en rode bakstenen huizen in Ootmarsum",
    duration: "Dag",
    distance: "18 km",
    credit: { author: "Ben Bender", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:7631_Ootmarsum,_Netherlands_-_panoramio_(8).jpg" },
  },
  {
    title: "Ommen",
    text: "Wandel langs de kade met de molen, drink wat op een terras aan het water of huur een kano voor een stuk op de rivier.",
    image: asset("/foto/omgeving/ommen.webp"),
    alt: "De Vecht in Ommen met een molen aan de kade",
    duration: "Middag",
    distance: "16 km",
    credit: { author: "Janko Hoener", license: "CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:2017_Kitsch-Portrait_von_Ommen_(Kitsch_portret_van_Ommen)_(124STOUT_5987).jpg" },
  },
  {
    title: "Over de grens naar Uelsen",
    text: "Een Duits dorp met een oude kerk, het voormalige raadhuis en terrasjes in de straat.",
    image: asset("/foto/omgeving/uelsen.webp"),
    alt: "De kerk en het oude raadhuis van Uelsen",
    duration: "Dag",
    distance: "14 km",
    credit: { author: "Weefemwe", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Uelsen_(Germany)_church_and_old_town_hall_DSCN9447Com.jpg" },
  },
  {
    title: "Koffie bij het theehuis",
    text: "Restaurant De Kleinhaar ligt op 1,7 kilometer. Ook Koffie- & Theehuys Hongerdyck en Jet's Theehuus zijn dichtbij.",
    image: asset("/foto/omgeving/terras.webp"),
    alt: "Koffie en appeltaart op een terras in een theetuin",
    duration: "Ochtend",
    distance: "1,7 km",
  },
];
