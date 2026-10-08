import { Suspense, lazy } from "react";
import { HERO_PHOTOS } from "../lib/content";
import { useReducedMotion } from "motion/react";

// Remotion (± 450 kB) laadt na de foto, zodat de LCP de statische afbeelding is.
const HeroPlayer = lazy(() => import("./HeroPlayer"));

// Container query units laten de 16:9 compositie de hero "coveren".
export function HeroBackground() {
  const reduce = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden [container-type:size]" aria-hidden>
      <img src={HERO_PHOTOS[0]} alt="" className="absolute inset-0 size-full object-cover object-[50%_60%]" />
      {!reduce && (
        <div className="hero-fade-in absolute top-1/2 left-1/2 aspect-video w-[max(100cqw,177.78cqh)] -translate-x-1/2 -translate-y-1/2">
          <Suspense fallback={null}>
            <HeroPlayer />
          </Suspense>
        </div>
      )}
      {/* Donkere laag over het hele beeld, extra links voor de kop en onder voor het boekingspaneel */}
      <div className="absolute inset-0 bg-forest-950/45" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(12_20_15/0.7)_0%,rgb(12_20_15/0.2)_50%,rgb(12_20_15/0.55)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(12_20_15/0.35)_0%,rgb(12_20_15/0)_25%,rgb(12_20_15/0)_60%,rgb(12_20_15/0.6)_100%)]" />
    </div>
  );
}
