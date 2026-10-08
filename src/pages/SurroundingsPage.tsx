import { motion, useReducedMotion } from "motion/react";
import { asset } from "../lib/config";
import { ACTIVITIES, type Activity } from "../lib/surroundings";
import {
  ArrowUpRight,
  Airplane,
  Clock,
  Coffee,
  Key,
  MapPin,
  Mountains,
  Train,
  Tree,
  type Icon,
} from "@phosphor-icons/react";
import { PageHero } from "../components/page/PageHero";
import { SectionHeading } from "../components/page/SectionHeading";
import { ADDRESS } from "../lib/site";
import { CHECK_IN } from "../lib/availability";

const ease = [0.16, 1, 0.3, 1] as const;

type Distance = { icon: Icon; label: string; value: string; how: string };

// Afstanden van Booking.com (aangeleverd in de briefing)
const DISTANCES: Distance[] = [
  { icon: Coffee, label: "Restaurant De Kleinhaar", value: "1,7 km", how: "Ook Hongerdyck (3 km) en Jet's Theehuus (4,9 km)" },
  { icon: Tree, label: "Vechtpark Hardenberg", value: "11 km", how: "Dagje uit aan de Vecht" },
  { icon: Mountains, label: "Fayersheide", value: "12 km", how: "Natuurgebied, wandelen" },
  { icon: MapPin, label: "Giga Konijnenhol", value: "12 km", how: "Dagje uit" },
  { icon: Train, label: "Station Mariënberg", value: "10 km", how: "Ook station Hardenberg, 10 km" },
  { icon: Airplane, label: "Groningen Airport Eelde", value: "83 km", how: "Dichtstbijzijnde luchthaven" },
];

export function SurroundingsPage() {
  return (
    <>
      <PageHero
        title={["Wat is er", "in de buurt?"]}
        intro="Vanaf De Zandloper is er genoeg te ontdekken. Of je nu zin hebt in natuur, een gezellig terras of een dagje uit."
        image={asset("/foto/omgeving/gras-zonsondergang.webp")}
        aside={
          <div className="border-t border-bone/20 pt-5 md:border-t-0 md:border-l md:pt-0 md:pl-8">
            <p className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-none font-light tracking-[-0.02em] tabular-nums">16 km</p>
            <p className="mt-1.5 text-[0.8125rem] text-bone/75">tot de Duitse grens</p>
          </div>
        }
      />
      <Activities />
      <Distances />
      <Route />
    </>
  );
}

function Activities() {
  const reduce = useReducedMotion();
  const fadeUp = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.25 },
          transition: { duration: 0.9, ease, delay },
        };
  const [hero, second, third, ...rest] = ACTIVITIES;

  return (
    <section aria-labelledby="activiteiten-titel" className="relative isolate overflow-hidden px-[1.875rem] hl-sy md:px-12">
      <SectionHeading
        id="activiteiten-titel"
        title="Wandelen, fietsen en er op uit"
        text="Vijf dingen om te doen vanuit De Zandloper. En daarna? Lekker terug en heerlijk vertoeven."
        watermark="Omgeving"
      />

      <div className="mt-12 grid grid-cols-1 gap-3 md:mt-14 md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] md:grid-rows-2 md:gap-4">
        <motion.div {...fadeUp(0.08)} className="md:row-span-2">
          <ActivityCard activity={hero} large />
        </motion.div>
        <motion.div {...fadeUp(0.16)}>
          <ActivityCard activity={second} />
        </motion.div>
        <motion.div {...fadeUp(0.24)}>
          <ActivityCard activity={third} />
        </motion.div>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 md:mt-4 md:grid-cols-2 md:gap-4">
        {rest.map((a, i) => (
          <motion.div key={a.title} {...fadeUp(0.08 + i * 0.08)}>
            <ActivityCard activity={a} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ActivityCard({ activity: a, large = false }: { activity: Activity; large?: boolean }) {
  return (
    <article
      className={`relative isolate flex h-full flex-col justify-end overflow-hidden rounded-[20px] bg-forest-900 text-bone ${
        large ? "min-h-[440px] p-6 md:min-h-[600px] md:p-9" : "min-h-[300px] p-5 md:p-7"
      }`}
    >
      <img src={a.image} alt={a.alt} loading="lazy" decoding="async" width={900} height={672} className="absolute inset-0 -z-10 size-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(12_20_15/0)_35%,rgb(12_20_15/0.85)_100%)]" />
      <h3 className={`font-display font-medium tracking-[-0.03em] ${large ? "text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05]" : "text-xl"}`}>
        {a.title}
      </h3>
      <p className="mt-2 max-w-[44ch] text-sm leading-[1.6] text-bone/80">{a.text}</p>
      <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[0.8125rem] text-bone/75">
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Duur</dt>
          <Clock size={15} aria-hidden />
          <dd>{a.duration}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Afstand</dt>
          <MapPin size={15} aria-hidden />
          <dd>{a.distance}</dd>
        </div>
      </dl>
    </article>
  );
}

function Distances() {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="afstanden-titel" className="p-2.5 md:p-2">
      <div className="relative isolate overflow-hidden rounded-[28px] bg-forest-950 px-5 hl-sy text-bone md:px-10">
        <SectionHeading
          id="afstanden-titel"
          title="Alles binnen bereik"
          text="Afstanden vanaf De Zandloper. In het noordoosten van Overijssel, dicht bij de Duitse grens."
          tone="dark"
        />
        <ul className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 md:mt-14 md:grid-cols-3 md:gap-4">
          {DISTANCES.map((d, i) => (
            <motion.li
              key={d.label}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease, delay: (i % 3) * 0.08 }}
              className="rounded-[20px] border border-bone/10 bg-forest-900 p-5 md:p-6"
            >
              <span className="flex items-center gap-2 text-[0.8125rem] text-bone/70">
                <d.icon size={18} aria-hidden />
                {d.label}
              </span>
              <span className="mt-4 block font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-none font-light tracking-[-0.03em] tabular-nums">
                {d.value}
              </span>
              <span className="mt-2 block text-[0.8125rem] text-bone/55">{d.how}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Route() {
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${ADDRESS.street}, ${ADDRESS.postal} ${ADDRESS.city}`)}`;
  return (
    <section id="route" aria-labelledby="route-titel" className="scroll-mt-[var(--hl-section-y)] px-[1.875rem] hl-sy md:px-12">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-4">
        <div className="flex flex-col rounded-[20px] border border-forest-950/8 bg-[var(--panel)] p-6 text-forest-950 md:p-9">
          <h2 id="route-titel" className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.08] font-medium tracking-[-0.035em]">
            Zo kom je er
          </h2>
          <address className="mt-5 text-sm leading-[1.65] not-italic">
            <span className="block font-medium">{ADDRESS.street}</span>
            <span className="block text-forest-950/65">
              {ADDRESS.postal} {ADDRESS.city}
            </span>
          </address>
          <p className="mt-3 max-w-[44ch] text-sm leading-[1.65] text-forest-950/65">
            In het buitengebied van Kloosterhaar, Overijssel. Parkeren is gratis bij de accommodatie.
          </p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-12 items-center gap-2 self-start rounded-xl bg-forest-950 px-6 text-sm font-medium text-bone transition-[transform,background-color] duration-200 hover:bg-forest-900 active:scale-[0.97]"
          >
            Plan je route
            <ArrowUpRight size={16} aria-hidden />
            <span className="sr-only">(opent Google Maps in een nieuw tabblad)</span>
          </a>
        </div>

        <div className="rounded-[20px] border border-forest-950/8 bg-[var(--panel)] p-6 text-forest-950 md:p-9">
          <h3 className="font-display text-xl font-medium tracking-[-0.03em]">Bij aankomst</h3>
          <ul className="mt-5 flex flex-col divide-y divide-forest-950/8">
            {/* TODO: klantdata. Werkwijze sleutelkluisje bevestigen (komt uit een review op Booking.com). */}
            <RouteRow icon={Clock} title={`Vanaf ${CHECK_IN} welkom`} text="Inchecken kan tot middernacht. Laat ons vooraf weten hoe laat je ongeveer aankomt." />
            <RouteRow icon={Key} title="Sleutel in het kluisje" text="De accommodatie is onbemand. Voor je aankomst krijg je de code van het sleutelkluisje." />
            <RouteRow icon={Train} title="Met het openbaar vervoer" text="Station Mariënberg en station Hardenberg liggen allebei op 10 kilometer." />
          </ul>
        </div>
      </div>
    </section>
  );
}

function RouteRow({ icon: RowIcon, title, text }: { icon: Icon; title: string; text: string }) {
  return (
    <li className="flex gap-4 py-4 first:pt-0 last:pb-0">
      <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-forest-700/12">
        <RowIcon size={18} />
      </span>
      <span>
        <span className="block text-sm font-medium">{title}</span>
        <span className="mt-0.5 block text-[0.8125rem] leading-[1.6] text-forest-950/60">{text}</span>
      </span>
    </li>
  );
}
