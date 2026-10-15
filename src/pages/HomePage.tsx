import { Hero } from "../components/Hero";
import { HouseSection } from "../components/home/HouseSection";
import { Amenities } from "../components/home/Amenities";
import { NearbySection } from "../components/home/NearbySection";
import { OwnersSection as WellnessSection } from "../components/home/OwnersSection";
import { BookingSection } from "../components/BookingSection";
import { Reviews } from "../components/Reviews";

// Onepager. Vast ritme: lichte en donkergroene secties wisselen elkaar af, elke sectie begint met dezelfde
// kop (label, titel, intro). Alleen de eerste sectie is gecentreerd met een vaag woord erachter.
// Contact staat in de footer (id="contact").
export function HomePage() {
  return (
    <>
      <Hero />
      <HouseSection />
      <WellnessSection />
      <Amenities />
      <NearbySection />
      <BookingSection />
      <Reviews />
    </>
  );
}
