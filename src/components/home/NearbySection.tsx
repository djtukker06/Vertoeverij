import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, MapPin } from "@phosphor-icons/react";
import { ACTIVITIES } from "../../lib/surroundings";
import { Link, ROUTES } from "../../lib/router";

const ease = [0.16, 1, 0.3, 1] as const;

// Wat er in de buurt is: donkergroene kaart (zelfde marge als de hero) met vier fotokaarten en een link naar Omgeving.
export function NearbySection() {
  const reduce = useReducedMotion();
  const items = ACTIVITIES.slice(0, 4);

  return (
    <section aria-labelledby="buurt-titel" className="p-2.5 md:p-2">
      <div className="rounded-[28px] bg-forest-950 px-5 hl-sy text-bone md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, ease }}
            className="max-w-xl"
          >
            <h2 id="buurt-titel" className="font-display text-[clamp(2rem,3.8vw,3.25rem)] leading-[1.08] font-medium tracking-[-0.035em] text-balance">
              Natuur, dorpen en omgeving
            </h2>
            <p className="mt-4 max-w-[46ch] text-sm leading-[1.65] text-bone/65">
              Wandelen, fietsen, een terras of een dagje uit: vanuit De Zandloper is er genoeg te ontdekken.
            </p>
          </motion.div>
          <Link
            href={ROUTES.surroundings}
            className="inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-xl bg-bone px-5 text-sm font-medium text-forest-950 transition-[transform,background-color] duration-200 hover:bg-white active:scale-[0.97] md:self-auto"
          >
            Alles over de omgeving
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-12 md:gap-4 lg:grid-cols-4">
          {items.map((a, i) => (
            <motion.li
              key={a.title}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease, delay: i * 0.08 }}
            >
              <figure className="relative isolate flex h-full min-h-[300px] flex-col justify-between overflow-hidden rounded-[20px] p-5 md:min-h-[360px]">
                <img src={a.image} alt={a.alt} loading="lazy" decoding="async" className="absolute inset-0 -z-10 size-full object-cover" />
                <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(12_20_15/0.35)_0%,rgb(12_20_15/0)_30%,rgb(12_20_15/0.1)_50%,rgb(12_20_15/0.8)_100%)]" />
                <span className="glass inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1.5 text-[0.8125rem] font-medium">
                  <MapPin size={14} aria-hidden />
                  {a.distance}
                </span>
                <figcaption>
                  <span className="block font-display text-lg font-medium tracking-[-0.03em]">{a.title}</span>
                  <span className="mt-1 block text-[0.8125rem] leading-[1.55] text-bone/75">{a.text}</span>
                </figcaption>
              </figure>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
