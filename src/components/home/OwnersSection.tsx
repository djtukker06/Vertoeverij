import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { WELLNESS } from "../../lib/house";
import { Link, ROUTES } from "../../lib/router";

const ease = [0.16, 1, 0.3, 1] as const;

// Wellness De Zandloper: foto als fotokaart, tekst ernaast (zelfde opbouw als de kennismaking in het ontwerp).
export function OwnersSection() {
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

  return (
    <section id="wellness" aria-labelledby="wellness-titel" className="px-[1.875rem] hl-sy md:px-12">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-4">
        <motion.figure {...fadeUp()} className="relative isolate min-h-[420px] overflow-hidden rounded-[20px] bg-forest-900 md:min-h-[560px]">
          <img src={WELLNESS.image} alt={WELLNESS.alt} loading="lazy" decoding="async" className="absolute inset-0 -z-10 size-full object-cover object-[50%_30%]" />
        </motion.figure>

        <motion.div
          {...fadeUp(0.1)}
          className="flex flex-col rounded-[20px] border border-forest-950/8 bg-[var(--panel)] p-6 text-forest-950 md:p-10 lg:p-12"
        >
          <p className="text-[0.8125rem] font-medium text-forest-700">Wellness De Zandloper</p>
          <h2 id="wellness-titel" className="mt-3 font-display text-[clamp(2rem,3.8vw,3.25rem)] leading-[1.08] font-medium tracking-[-0.035em] text-balance">
            {WELLNESS.title}
          </h2>
          <div className="mt-6 flex max-w-[52ch] flex-col gap-4 text-sm leading-[1.65] text-forest-950/70">
            {WELLNESS.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-forest-950/8 pt-6 md:mt-auto md:pt-8">
            {WELLNESS.facts.map((f) => (
              <div key={f.label} className="flex flex-col-reverse gap-1">
                <dt className="text-[0.8125rem] text-forest-950/60">{f.label}</dt>
                <dd className="font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-none font-light tracking-[-0.03em]">{f.value}</dd>
              </div>
            ))}
          </dl>

          <Link
            href={ROUTES.wellness}
            className="mt-8 inline-flex h-11 items-center gap-2 self-start rounded-xl bg-forest-950 px-5 text-sm font-medium text-bone transition-[transform,background-color] duration-200 hover:bg-forest-900 active:scale-[0.97]"
          >
            Alles over de wellness
            <ArrowRight size={16} aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
