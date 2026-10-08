import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ChatCircleText, Plus } from "@phosphor-icons/react";
import { PageHero } from "../components/page/PageHero";
import { SectionHeading } from "../components/page/SectionHeading";
import { HouseSection } from "../components/home/HouseSection";
import { Amenities } from "../components/home/Amenities";
import { Reviews } from "../components/Reviews";
import { asset } from "../lib/config";
import { CHECK_IN, CHECK_OUT } from "../lib/availability";
import { Link, ROUTES } from "../lib/router";

const ease = [0.16, 1, 0.3, 1] as const;

const a = (name: string) => asset(`/foto/accommodatie/${name}.webp`);

// Meer foto's van Booking.com voor de galerij. TODO: klantdata, vervangen door de nieuwe foto's van Marith.
const MORE_PHOTOS = [
  { src: a("tuin-uitzicht"), alt: "De tuin met het uitzicht over de weilanden", caption: "De tuin" },
  { src: a("slaapkamer-2"), alt: "Tweede slaapkamer onder het schuine dak", caption: "Slaapkamer onder het dak" },
  { src: a("buitenhaard"), alt: "Buitenhaard met barbecue op het overdekte terras", caption: "Buitenhaard en barbecue" },
  { src: a("woonkamer-hoek"), alt: "Zithoek in de woonkamer", caption: "De zithoek" },
  { src: a("badkamer-2"), alt: "Wastafel en toilet in de tweede badkamer", caption: "Tweede badkamer" },
  { src: a("huis-zomer"), alt: "Het huis tussen de weilanden in de zomer", caption: "Het huis in de zomer" },
  { src: a("weiland-paarden"), alt: "Paarden in de weilanden rond het huis", caption: "Het uitzicht" },
  { src: a("huis-avond"), alt: "Het huis in de avond", caption: "In de avond" },
];

// Uit de huisregels van Booking.com. TODO: klantdata, punten met een TODO laten bevestigen.
const FAQ = [
  {
    q: "Hoe laat kan ik inchecken en uitchecken?",
    a: `Inchecken kan van ${CHECK_IN} tot 00:00 uur. Laat ons vooraf weten hoe laat je ongeveer aankomt. Uitchecken doe je uiterlijk om ${CHECK_OUT} uur.`,
  },
  { q: "Kunnen we met z'n tweeën één slaapkamer gebruiken?", a: "Ja. Kom je met z'n tweeën, dan kun je ook één slaapkamer gebruiken. Dat geef je aan bij het boeken." },
  // TODO: klantdata. Werkwijze sleutelkluisje bevestigen (komt uit een review).
  { q: "Hoe kom ik binnen?", a: "De accommodatie is onbemand. Voor je aankomst krijg je bericht met de code van het sleutelkluisje." },
  // TODO: klantdata. Indeling bevestigen (een gast noemt dat er beneden geen toilet is).
  { q: "Is er een toilet op de begane grond?", a: "Nee. Beide slaapkamers hebben een eigen badkamer met toilet. Beneden is geen toilet." },
  { q: "Mag ik mijn huisdier meenemen?", a: "Huisdieren zijn op verzoek toegestaan. Er kunnen extra kosten aan verbonden zijn. Geef het aan bij je aanvraag, dan nemen we contact met je op." },
  { q: "Zijn kinderen welkom?", a: "Kinderen van alle leeftijden zijn welkom. Voor kinderen van 0 tot 3 jaar is op verzoek gratis een kinderbedje beschikbaar. Extra bedden zijn er niet." },
  { q: "Is er een minimumleeftijd?", a: "Ja, de minimumleeftijd om in te checken is 23 jaar. Roken en feesten zijn niet toegestaan." },
];

export function AccommodationPage() {
  return (
    <>
      <PageHero
        title={["Comfortabel verblijven", "in het buitengebied"]}
        intro="Een ruim appartement voor maximaal vier personen, met vrij uitzicht over de weilanden en rondom volop ruimte."
        image={a("slaapkamer-1")}
        aside={
          <dl className="grid grid-cols-3 gap-6 border-t border-bone/20 pt-5 md:grid-cols-1 md:gap-5 md:border-t-0 md:border-l md:pt-0 md:pl-8">
            {[
              ["4", "personen"],
              ["2", "slaapkamers"],
              ["2", "badkamers"],
            ].map(([value, label]) => (
              <div key={label} className="flex flex-col-reverse gap-1">
                <dt className="text-[0.8125rem] text-bone/75">{label}</dt>
                <dd className="text-[clamp(1.75rem,3vw,2.5rem)] leading-none font-light tracking-[-0.02em] tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        }
      />
      <HouseSection />
      <MorePhotos />
      <Amenities />
      <Questions />
      <Reviews />
    </>
  );
}

/* Grote fotogalerij: zelfde fotokaarten als de kamers hierboven */
function MorePhotos() {
  const reduce = useReducedMotion();
  const fadeUp = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.9, ease, delay },
        };
  return (
    <section aria-labelledby="rondkijken-titel" className="px-[1.875rem] hl-sb md:px-12">
      <motion.div {...fadeUp()} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 id="rondkijken-titel" className="font-display text-xl font-medium tracking-[-0.03em] text-forest-950 md:text-2xl">
          Kijk gerust even rond
        </h2>
        <p className="text-[0.8125rem] text-forest-950/55">Van het terras tot de tweede badkamer, en het uitzicht erbij.</p>
      </motion.div>
      <ul className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {MORE_PHOTOS.map((p, i) => (
          <motion.li key={p.src} {...fadeUp((i % 4) * 0.06)}>
            <figure className="relative isolate flex min-h-[210px] flex-col justify-end overflow-hidden rounded-[20px] bg-forest-900 p-4 text-bone sm:min-h-[260px] sm:p-5 md:min-h-[272px]">
              <img src={p.src} alt={p.alt} loading="lazy" decoding="async" className="absolute inset-0 -z-10 size-full object-cover" />
              <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(12_20_15/0)_50%,rgb(12_20_15/0.7)_100%)]" />
              <figcaption className="text-[0.8125rem] font-medium">{p.caption}</figcaption>
            </figure>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

/* Veelgestelde vragen: zelfde opbouw als op de Prijzen-pagina */
function Questions() {
  const id = useId();
  return (
    <section aria-labelledby={`${id}-titel`} className="px-[1.875rem] hl-sb md:px-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionHeading id={`${id}-titel`} title="Veelgestelde vragen" text="Over aankomst, de slaapkamers, kinderen en huisdieren." align="left" />
          <div className="flex flex-col gap-4 rounded-[20px] bg-forest-950 p-6 text-bone max-lg:order-last md:p-7 lg:max-w-sm">
            <div className="flex items-start gap-3">
              <ChatCircleText size={24} aria-hidden className="mt-0.5 shrink-0 text-bone/80" />
              <div>
                <h3 className="font-display text-xl font-medium tracking-[-0.03em]">Staat je vraag er niet bij?</h3>
                <p className="mt-1.5 text-[0.8125rem] leading-[1.6] text-bone/70">Stuur een bericht, dan krijg je snel antwoord.</p>
              </div>
            </div>
            <Link
              href={ROUTES.contact}
              className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-bone px-5 text-sm font-medium text-forest-950 transition-[transform,background-color] duration-200 hover:bg-white active:scale-[0.97]"
            >
              Stel je vraag
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {FAQ.map((item) => (
            <details key={item.q} className="group rounded-[20px] border border-forest-950/8 bg-[var(--panel)] text-forest-950 open:border-forest-950/15">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-5 md:px-7 [&::-webkit-details-marker]:hidden">
                <span className="text-sm font-medium md:text-[0.9375rem]">{item.q}</span>
                <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full border border-forest-950/15 transition-transform duration-300 group-open:rotate-45">
                  <Plus size={16} />
                </span>
              </summary>
              <p className="max-w-[60ch] px-5 pb-5 text-sm leading-[1.65] text-forest-950/70 md:px-7 md:pb-6">{item.a}</p>
            </details>
          ))}
          <Link href={ROUTES.houseRules} className="mt-2 self-start rounded-full py-2 text-sm font-medium underline decoration-forest-950/25 underline-offset-4 hover:decoration-forest-950">
            Alle huisregels
          </Link>
        </div>
      </div>
    </section>
  );
}
