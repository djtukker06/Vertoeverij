import { useEffect, useRef, useState } from "react";
import { asset } from "../lib/config";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Star } from "@phosphor-icons/react";
import { REVIEW_SCORE } from "../lib/site";

// TODO: klantdata. Link naar de Booking.com-pagina (nieuwe naam bevestigen).
const BOOKING_URL = "https://www.booking.com/hotel/nl/peerd-van-ome-luuks-appartement-met-een-of-twee-slaapkamers.nl.html";

type Review = { quote: string; name: string; party: string; stay: string; rating: number; photo: string; caption: string };

// Echte beoordelingen van Booking.com (aangeleverd in Teksten.pdf), alleen het positieve deel, spelling licht rechtgezet.
// Sterren: score 9,0 = 5 sterren, 8,0 = 4 sterren. Foto's zijn oude foto's van Booking.com (TODO: nieuwe foto's van Marith).
const REVIEWS: Review[] = [
  {
    quote: "Keurig netjes en heel schoon appartement. Heel fijn dat elke slaapkamer zijn eigen badkamer heeft met eigen toilet. Goede bedden. Landelijk gelegen.",
    name: "Ron",
    party: "Nederland",
    stay: "maart 2026",
    rating: 5,
    photo: asset("/foto/accommodatie/slaapkamer-1.webp"),
    caption: "Elke slaapkamer een eigen badkamer",
  },
  {
    quote: "Super compleet ingerichte vakantiewoning met een fijn terras voor het huis. Prachtige omgeving en heerlijk rustige ligging, uitzicht op weilanden met paarden.",
    name: "Andries",
    party: "Stel, 4 nachten",
    stay: "september 2024",
    rating: 5,
    photo: asset("/foto/accommodatie/weiland-paarden.webp"),
    caption: "Uitzicht op weilanden met paarden",
  },
  {
    quote: "Erg mooie, rustige ligging. Mooi uitzicht over de weilanden. Het ziet er allemaal erg netjes uit. Mooie slaapkamers, erg ruim en netjes. Badkamers ook top.",
    name: "Jet",
    party: "Nederland, 3 nachten",
    stay: "september 2025",
    rating: 4,
    photo: asset("/foto/accommodatie/terras.webp"),
    caption: "Het terras met vrij uitzicht",
  },
  {
    quote: "Het was een leuk en ruim appartement met mooie slaapkamers en badkamers. Alles was aanwezig en zeer proper. Mooi en rustig gelegen in de natuur.",
    name: "Diane",
    party: "Stel uit België, 3 nachten",
    stay: "januari 2026",
    rating: 5,
    photo: asset("/foto/accommodatie/badkamer.webp"),
    caption: "Alles aanwezig en zeer proper",
  },
  {
    quote: "Prima geregeld. Ontvingen tijdig de melding dat de sleutel klaar lag in het kluisje met de daarbij behorende code. Top locatie en zeker voor herhaling vatbaar.",
    name: "Lucas",
    party: "Nederland",
    stay: "juli 2024",
    rating: 5,
    photo: asset("/foto/accommodatie/huis-avond.webp"),
    caption: "Het huis in de avond",
  },
];

const SLIDE_COUNT = REVIEWS.length + 1; // reviews + Booking.com-kaart
const START_INDEX = 1;
const ease = [0.16, 1, 0.3, 1] as const;

const initials = (name: string) =>
  name
    .split(/\s+en\s+|\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export function Reviews() {
  const reduce = useReducedMotion();
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(START_INDEX);

  // Actieve kaart = de kaart die de middenband van de carrousel raakt (geen scroll-listener nodig).
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const items = Array.from(el.children);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(items.indexOf(entry.target));
        }
      },
      { root: el, rootMargin: "0px -45% 0px -45%", threshold: 0 },
    );
    items.forEach((item) => io.observe(item));

    // Start op de tweede kaart, zodat er links en rechts een kaart in beeld staat
    const start = items[START_INDEX] as HTMLElement | undefined;
    if (start) el.scrollLeft = start.offsetLeft - (el.clientWidth - start.offsetWidth) / 2;

    return () => io.disconnect();
  }, []);

  function goTo(index: number) {
    const el = track.current;
    const item = el?.children[index] as HTMLElement | undefined;
    if (!el || !item) return;
    el.scrollTo({
      left: item.offsetLeft - (el.clientWidth - item.offsetWidth) / 2,
      behavior: reduce ? "auto" : "smooth",
    });
  }

  return (
    <section id="reviews" aria-labelledby="reviews-titel" className="p-2.5 md:p-2">
      <div className="relative isolate overflow-hidden rounded-[28px] bg-forest-950 hl-sy text-bone">
        {/* Statisch woord achter de titel, zelfde idee als het merkwoord bij beschikbaarheid. Geen scroll-animatie. */}
        <p
          aria-hidden
          className="pointer-events-none absolute top-10 left-1/2 -z-10 -translate-x-1/2 font-display text-[clamp(6rem,19vw,17rem)] leading-[0.8] font-semibold tracking-[-0.05em] whitespace-nowrap text-bone/[0.045] select-none md:top-14"
        >
          Reviews
        </p>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease }}
          className="mx-auto max-w-2xl px-5 text-center"
        >
          <h2
            id="reviews-titel"
            className="font-display text-[clamp(2rem,3.8vw,3.25rem)] leading-[1.08] font-medium tracking-[-0.035em] text-balance"
          >
            Zij waren je al voor
          </h2>
          <p className="mx-auto mt-4 max-w-[44ch] text-sm leading-[1.65] text-bone/65">
            Lees hoe onze gasten het vertoeven bij De Zandloper hebben ervaren.
          </p>
        </motion.div>

        <div className="relative mt-12 md:mt-16">
          <ul
            ref={track}
            aria-label="Reviews, horizontaal scrollbaar"
            tabIndex={0}
            className="reviews-track relative flex snap-x snap-mandatory gap-4 overflow-x-auto px-[calc(50%-39vw)] py-2 [scrollbar-width:none] focus-visible:outline-offset-[-4px] sm:px-[calc(50%-10.5rem)] [&::-webkit-scrollbar]:hidden"
          >
            {REVIEWS.map((r, i) => (
              <li key={r.name} aria-current={i === active ? "true" : undefined} className="flex w-[78vw] shrink-0 snap-center sm:w-[21rem]">
                <figure className="flex w-full flex-col rounded-[20px] border border-bone/10 bg-forest-900 p-3">
                  <blockquote className="flex-1 px-3 pt-3 text-[0.875rem] leading-[1.65] text-bone/85">
                    <p>&ldquo;{r.quote}&rdquo;</p>
                  </blockquote>
                  <figcaption className="flex items-center gap-3 px-3 pt-5 pb-4">
                    <span
                      aria-hidden
                      className="grid size-9 shrink-0 place-items-center rounded-full bg-bone text-[0.75rem] font-semibold tracking-[-0.01em] text-forest-950"
                    >
                      {initials(r.name)}
                    </span>
                    <span className="text-[0.8125rem] leading-snug">
                      <span className="block font-medium">{r.name}</span>
                      <span className="block text-bone/55">
                        {r.party}, {r.stay}
                      </span>
                    </span>
                  </figcaption>
                  <div className="relative isolate aspect-[4/3] overflow-hidden rounded-[14px] bg-forest-950">
                    <img
                      src={r.photo}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      width={1024}
                      height={768}
                      className="absolute inset-0 -z-10 size-full object-cover"
                    />
                    <span className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(12_20_15/0)_45%,rgb(12_20_15/0.8)_100%)]" />
                    <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                      <span className="font-display text-[1.0625rem] leading-tight font-medium tracking-[-0.02em]">{r.caption}</span>
                      <span className="flex shrink-0 gap-0.5" role="img" aria-label={`${r.rating} van 5 sterren`}>
                        {Array.from({ length: 5 }, (_, s) => (
                          <Star key={s} size={12} weight="fill" className={s < r.rating ? "text-bone" : "text-bone/30"} />
                        ))}
                      </span>
                    </span>
                  </div>
                </figure>
              </li>
            ))}

            <li aria-current={active === REVIEWS.length ? "true" : undefined} className="flex w-[78vw] shrink-0 snap-center sm:w-[21rem]">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative isolate flex min-h-[19rem] w-full flex-col justify-between overflow-hidden rounded-[20px] p-6 md:p-7"
              >
                <img
                  src={asset("/foto/accommodatie/huis-zomer.webp")}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={1024}
                  height={768}
                  className="absolute inset-0 -z-10 size-full object-cover transition-transform duration-700 ease-(--ease-out-soft) group-hover:scale-[1.04]"
                />
                <span className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(12_20_15/0.35),rgb(12_20_15/0.85))]" />
                <span className="flex items-start justify-between">
                  <span className="rounded-lg bg-bone px-2.5 py-1 font-display text-xl font-medium text-forest-950 tabular-nums">{REVIEW_SCORE.score}</span>
                  <ArrowUpRight
                    size={20}
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
                <span>
                  <span className="block font-display text-2xl font-medium tracking-[-0.03em]">{REVIEW_SCORE.label} op Booking.com</span>
                  <span className="mt-1 block text-[0.8125rem] text-bone/75">
                    Alle {REVIEW_SCORE.count} beoordelingen lezen
                    <span className="sr-only"> (opent in een nieuw tabblad)</span>
                  </span>
                </span>
              </a>
            </li>
          </ul>

        </div>

        <div className="mt-8 flex items-center justify-center gap-4 px-5 md:mt-10 md:gap-6">
          <NavButton label="Vorige review" disabled={active === 0} onClick={() => goTo(active - 1)}>
            <ArrowLeft size={18} aria-hidden />
          </NavButton>
          <div className="flex gap-1.5 sm:gap-2">
            {Array.from({ length: SLIDE_COUNT }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-label={i === REVIEWS.length ? "Ga naar Booking.com-kaart" : `Ga naar review ${i + 1}`}
                aria-current={i === active ? "true" : undefined}
                onClick={() => goTo(i)}
                className="group grid h-11 cursor-pointer place-items-center"
              >
                <span
                  className={`block h-0.5 rounded-full transition-[width,background-color] duration-500 ease-(--ease-out-soft) ${
                    i === active ? "w-8 bg-bone sm:w-12" : "w-4 bg-bone/25 group-hover:bg-bone/50 sm:w-7"
                  }`}
                />
              </button>
            ))}
          </div>
          <NavButton label="Volgende review" disabled={active === SLIDE_COUNT - 1} onClick={() => goTo(active + 1)}>
            <ArrowRight size={18} aria-hidden />
          </NavButton>
        </div>
      </div>
    </section>
  );
}

function NavButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full bg-bone text-forest-950 transition-[transform,opacity,background-color] duration-200 hover:bg-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-25 disabled:active:scale-100"
    >
      {children}
    </button>
  );
}
