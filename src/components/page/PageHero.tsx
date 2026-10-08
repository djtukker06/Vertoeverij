import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { SiteHeader } from "../SiteHeader";

const ease = [0.16, 1, 0.3, 1] as const;

type Props = {
  /** Kopregels, elke regel komt los omhoog (zelfde reveal als de home-hero) */
  title: string[];
  intro: string;
  image: string;
  /** Rechterkolom onderin, bijvoorbeeld een prijs of kernfeiten */
  aside?: ReactNode;
};

// Paginakop voor subpagina's: dezelfde afgeronde fotokaart, navigatie en typografie als de home-hero, maar lager.
export function PageHero({ title, intro, image, aside }: Props) {
  const reduce = useReducedMotion();
  const rise: Variants = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 16 },
    show: (delay: number) => ({ opacity: 1, y: 0, transition: { duration: 0.9, ease, delay } }),
  };
  const line: Variants = {
    hidden: reduce ? { y: 0 } : { y: "105%" },
    show: (i: number) => ({ y: 0, transition: { duration: 1.1, ease, delay: 0.35 + i * 0.12 } }),
  };

  return (
    <section className="p-2.5 md:p-2">
      <div className="relative isolate flex min-h-[36rem] flex-col rounded-[28px] bg-forest-950 text-bone md:h-[78dvh] md:max-h-[54rem]">
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-[28px]">
          <motion.img
            src={image}
            alt=""
            initial={reduce ? false : { scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.2, ease }}
            className="size-full object-cover"
          />
          {/* Zelfde lagen als de home-hero: overal iets donkerder, extra links en onder voor de tekst */}
          <div className="absolute inset-0 bg-forest-950/45" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(12_20_15/0.7)_0%,rgb(12_20_15/0.2)_50%,rgb(12_20_15/0.45)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(12_20_15/0.35)_0%,rgb(12_20_15/0)_25%,rgb(12_20_15/0)_55%,rgb(12_20_15/0.6)_100%)]" />
        </div>

        <motion.header initial="hidden" animate="show" custom={0.15} variants={rise} className="relative z-20 px-5 pt-5 md:px-10 md:pt-7">
          <SiteHeader />
        </motion.header>

        <div className="mt-auto grid gap-8 px-5 pt-16 pb-7 md:grid-cols-[1fr_auto] md:items-end md:gap-16 md:px-10 md:pb-11">
          <div>
            <h1 className="font-display text-[clamp(2.5rem,5.4vw,4.75rem)] leading-[1] font-medium tracking-[-0.035em]">
              {title.map((text, i) => (
                <span key={text} className="block overflow-hidden pb-[0.08em]">
                  <motion.span className="block" initial="hidden" animate="show" custom={i} variants={line}>
                    {text}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p initial="hidden" animate="show" custom={0.8} variants={rise} className="mt-5 max-w-[44ch] text-sm leading-[1.65] text-bone/80">
              {intro}
            </motion.p>
          </div>
          {aside && (
            <motion.div initial="hidden" animate="show" custom={0.95} variants={rise}>
              {aside}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
