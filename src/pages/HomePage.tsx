import { Hero } from "../components/Hero";
import { HouseSection } from "../components/home/HouseSection";
import { Amenities } from "../components/home/Amenities";
import { NearbySection } from "../components/home/NearbySection";
import { OwnersSection } from "../components/home/OwnersSection";
import { Reviews } from "../components/Reviews";

// Home gaat over het huis. Boeken loopt via de balk in de hero naar /beschikbaarheid (daar staan agenda en boekingssectie).
export function HomePage() {
  return (
    <>
      <Hero />
      {/* .after-hero: schuift over de gepinde hero. Eén laag met achtergrond voor alle secties, zodat de hero nergens doorschijnt. */}
      <div className="after-hero relative z-10 bg-[var(--surface)]">
        <HouseSection />
        <Amenities />
        <NearbySection />
        <OwnersSection />
        <Reviews />
      </div>
    </>
  );
}
