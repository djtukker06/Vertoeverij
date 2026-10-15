import { motion, useReducedMotion } from "motion/react";
import { MapPin } from "@phosphor-icons/react";
import { ACTIVITIES } from "../../lib/surroundings";
import { SectionHeading } from "../page/SectionHeading";

const ease = [0.16, 1, 0.3, 1] as const;

// Wat er in de buurt is: donkergroene kaart met de vaste sectiekop en vier fotokaarten van echte plekken.
export function NearbySection() {
  const reduce = useReducedMotion();
  const items = ACTIVITIES.slice(0, 4);

  return (
    <section id="omgeving" aria-labelledby="buurt-titel" className="scroll-mt-0 p-2.5 md:p-2">
      <div className="rounded-[28px] bg-forest-950 px-5 hl-sy text-bone md:px-10">
        <div className="hl-wrap">
        <SectionHeading align="center"
          id="buurt-titel"
          eyebrow="Omgeving"
          title="Natuur, dorpen en omgeving"
          text="Wandelen, fietsen, een terras of een dagje uit: vanuit De Zandloper is er genoeg te ontdekken."
          tone="dark"
        />

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
                <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(12_20_15/0.3)_0%,rgb(12_20_15/0)_22%,rgb(12_20_15/0.55)_52%,rgb(12_20_15/0.92)_100%)]" />
                <span className="glass inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1.5 text-[0.8125rem] font-medium">
                  <MapPin size={14} aria-hidden />
                  {a.distance}
                </span>
                <figcaption>
                  <span className="block font-display text-lg font-medium tracking-[-0.03em]">{a.title}</span>
                  <span className="mt-1 block text-[0.8125rem] leading-[1.55] text-bone/75">{a.text}</span>
                  {/* Naamsvermelding van de fotograaf (verplicht bij de licentie van Wikimedia Commons) */}
                  {a.credit && (
                    <a
                      href={a.credit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-[0.6875rem] text-bone/50 underline decoration-bone/20 underline-offset-2 transition-colors hover:text-bone/80"
                    >
                      Foto: {a.credit.author}, {a.credit.license}
                      <span className="sr-only"> (opent Wikimedia Commons in een nieuw tabblad)</span>
                    </a>
                  )}
                </figcaption>
              </figure>
            </motion.li>
          ))}
        </ul>
        </div>
      </div>
    </section>
  );
}
