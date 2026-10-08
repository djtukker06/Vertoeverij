import { motion, useReducedMotion } from "motion/react";
import { HOUSE_FACTS, ROOMS, type Room } from "../../lib/house";

const ease = [0.16, 1, 0.3, 1] as const;

// Eerste sectie na de hero: het huis zelf, kamer voor kamer in een fotobento, met de kerncijfers eronder.
export function HouseSection() {
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
  const [living, ...rest] = ROOMS;

  return (
    <section id="het-huis" aria-labelledby="het-huis-titel" className="relative isolate overflow-hidden px-[1.875rem] hl-sy md:px-12">
      {/* Statisch merkwoord achter de kop. Bewust zonder scroll-animatie. */}
      <p
        aria-hidden
        className="pointer-events-none absolute top-8 left-1/2 -z-10 -translate-x-1/2 font-display text-[clamp(6rem,19vw,17rem)] leading-[0.8] font-semibold tracking-[-0.05em] whitespace-nowrap text-forest-950/[0.04] select-none md:top-12"
      >
        Vertoeverij
      </p>

      <motion.div {...fadeUp()} className="mx-auto max-w-2xl text-center">
        <h2
          id="het-huis-titel"
          className="font-display text-[clamp(2rem,3.8vw,3.25rem)] leading-[1.08] font-medium tracking-[-0.035em] text-balance text-forest-950"
        >
          Comfortabel verblijven in het buitengebied
        </h2>
        <p className="mx-auto mt-4 max-w-[46ch] text-sm leading-[1.65] text-forest-950/65">
          Een ruim appartement voor maximaal vier personen, met twee slaapkamers die elk een eigen badkamer hebben.
        </p>
      </motion.div>

      <ul className="mt-10 grid grid-cols-2 gap-3 md:mt-12 md:gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] lg:grid-rows-2">
        <motion.li {...fadeUp(0.05)} className="col-span-2 lg:col-span-1 lg:row-span-2">
          <RoomCard room={living} large />
        </motion.li>
        {rest.map((room, i) => (
          <motion.li key={room.key} {...fadeUp(0.1 + i * 0.06)}>
            <RoomCard room={room} />
          </motion.li>
        ))}
      </ul>

      <motion.dl
        {...fadeUp(0.1)}
        className="mt-3 grid grid-cols-2 gap-y-6 rounded-[20px] border border-forest-950/8 bg-[var(--panel)] px-6 py-6 text-forest-950 sm:grid-cols-3 md:mt-4 md:px-9 md:py-7 lg:grid-cols-5"
      >
        {HOUSE_FACTS.map((f) => (
          <div key={f.label} className="flex flex-col-reverse gap-1 lg:border-l lg:border-forest-950/8 lg:pl-8 lg:first:border-l-0 lg:first:pl-0">
            <dt className="text-[0.8125rem] text-forest-950/60">{f.label}</dt>
            <dd className="font-display text-[clamp(1.75rem,2.6vw,2.25rem)] leading-none font-light tracking-[-0.03em] tabular-nums">{f.value}</dd>
          </div>
        ))}
      </motion.dl>
    </section>
  );
}

function RoomCard({ room, large = false }: { room: Room; large?: boolean }) {
  return (
    <figure
      className={`relative isolate flex h-full flex-col justify-end overflow-hidden rounded-[20px] bg-forest-900 text-bone ${
        large ? "min-h-[420px] p-6 md:min-h-[560px] md:p-8" : "min-h-[210px] p-4 sm:min-h-[260px] sm:p-5 md:min-h-[272px] md:p-6"
      }`}
    >
      <img src={room.image} alt={room.alt} loading="lazy" decoding="async" className="absolute inset-0 -z-10 size-full object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(12_20_15/0)_45%,rgb(12_20_15/0.75)_100%)]" />
      <figcaption>
        <span className={`block font-display font-medium tracking-[-0.03em] ${large ? "text-xl md:text-2xl" : "text-base leading-tight sm:text-lg"}`}>{room.title}</span>
        {/* Smalle kaarten op mobiel: alleen de naam, de foto vertelt de rest */}
        <span className={`mt-1 max-w-[38ch] leading-[1.55] text-bone/80 ${large ? "block text-sm" : "hidden text-[0.8125rem] sm:block"}`}>{room.text}</span>
      </figcaption>
    </figure>
  );
}
