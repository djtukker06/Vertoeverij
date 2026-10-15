import { useState } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowUpRight, Pause, Play, Star, StarHalf } from "@phosphor-icons/react";
import { REVIEWS, type Review } from "../lib/reviews";
import { REVIEW_SCORE } from "../lib/site";
import { SectionHeading } from "./page/SectionHeading";

// TODO: klantdata. Link naar de Booking.com-pagina (nieuwe naam bevestigen).
const BOOKING_URL = "https://www.booking.com/hotel/nl/peerd-van-ome-luuks-appartement-met-een-of-twee-slaapkamers.nl.html";


const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

/**
 * Reviews als doorlopende rij (klantwens): de rij schuift langzaam en eindeloos, na de laatste komt de eerste
 * weer in beeld. Dat werkt met twee kopieën van de lijst die samen 50% opschuiven. Pauzeert bij hover en focus,
 * met een knop om te stoppen (WCAG 2.2.2). Bij reduced motion staat de rij stil en kun je zelf scrollen.
 */
export function Reviews() {
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);

  return (
    <section id="reviews" aria-labelledby="reviews-titel" className="scroll-mt-0 p-2.5 md:p-2">
      <div className="overflow-hidden rounded-[28px] bg-forest-950 hl-sy text-bone">
        <div className="px-5 md:px-10">
          <div className="hl-wrap">
          <SectionHeading align="center"
            id="reviews-titel"
            eyebrow="Ervaringen"
            title="Zij waren je al voor"
            text="Lees hoe onze gasten het vertoeven bij De Zandloper hebben ervaren."
            tone="dark"
            action={
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 text-sm">
                <span className="rounded-lg bg-bone px-2.5 py-1 font-display text-lg leading-none font-medium text-forest-950 tabular-nums">{REVIEW_SCORE.score}</span>
                <span className="text-bone/80 underline decoration-bone/25 underline-offset-4 transition-colors group-hover:text-bone group-hover:decoration-bone/60">
                  {REVIEW_SCORE.label}, {REVIEW_SCORE.count} beoordelingen op Booking.com
                </span>
                <ArrowUpRight size={14} aria-hidden className="text-bone/70" />
                <span className="sr-only"> (opent in een nieuw tabblad)</span>
              </a>
            }
          />
          </div>
        </div>

        <div
          className={`reviews-track mt-12 md:mt-16 ${reduce ? "overflow-x-auto px-5 [scrollbar-width:none] md:px-10 [&::-webkit-scrollbar]:hidden" : "overflow-hidden"}`}
        >
          <div
            className={`flex w-max ${reduce ? "" : "reviews-marquee"} hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]`}
            // Pauzeren zet de animatie stil op de huidige plek (niet weghalen: dan springt de rij terug)
            style={{ ["--reviews-duration" as string]: `${REVIEWS.length * 7}s`, animationPlayState: paused ? "paused" : undefined }}
          >
            <ReviewList reviews={REVIEWS} label="Reviews van gasten" />
            {/* Tweede kopie voor de naadloze lus; voor schermlezers en toetsenbord onzichtbaar */}
            {!reduce && <ReviewList reviews={REVIEWS} hidden />}
          </div>
        </div>

        {!reduce && (
          <div className="mt-8 flex justify-center px-5 md:mt-10">
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
              aria-label={paused ? "Reviews afspelen" : "Reviews pauzeren"}
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-bone/20 px-5 text-sm font-medium text-bone/85 transition-colors hover:border-bone/50 hover:text-bone"
            >
              {paused ? <Play size={16} weight="fill" aria-hidden /> : <Pause size={16} weight="fill" aria-hidden />}
              {paused ? "Afspelen" : "Pauzeren"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function ReviewList({ reviews, label, hidden = false }: { reviews: Review[]; label?: string; hidden?: boolean }) {
  return (
    <ul aria-label={label} aria-hidden={hidden || undefined} inert={hidden || undefined} className="flex shrink-0 gap-4 pr-4">
      {reviews.map((r) => (
        <li key={r.name + r.date} className="flex w-[80vw] shrink-0 sm:w-[22rem]">
          <figure className="flex w-full flex-col rounded-[20px] border border-bone/10 bg-forest-900 p-6">
            <Stars score={r.score} />
            <blockquote className="mt-4 flex-1 text-[0.875rem] leading-[1.65] text-bone/85">
              <p>&ldquo;{r.quote}&rdquo;</p>
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-bone/10 pt-5">
              <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-bone text-[0.75rem] font-semibold text-forest-950">
                {initials(r.name)}
              </span>
              <span className="text-[0.8125rem] leading-snug">
                <span className="block font-medium">
                  {r.name}, {r.country}
                </span>
                <span className="block text-bone/55">
                  {r.party}, {r.nights} {r.nights === 1 ? "nacht" : "nachten"}, {r.date}
                </span>
              </span>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

/** Sterren uit de Booking.com-score (op 10): 9,0 = 4,5 ster. */
function Stars({ score }: { score: number }) {
  const stars = Math.round(score) / 2;
  return (
    <span className="flex gap-0.5 text-bone" role="img" aria-label={`${stars.toString().replace(".", ",")} van 5 sterren (score ${score} op Booking.com)`}>
      {Array.from({ length: 5 }, (_, i) =>
        stars >= i + 1 ? (
          <Star key={i} size={16} weight="fill" />
        ) : stars > i ? (
          <StarHalf key={i} size={16} weight="fill" />
        ) : (
          <Star key={i} size={16} className="text-bone/30" />
        ),
      )}
    </span>
  );
}
