import { motion, useReducedMotion } from "motion/react";
import { ChatCircleText } from "@phosphor-icons/react";
import { NextFreeCard } from "./NextFreeCard";
import { StayTimesCard } from "./StayTimesCard";
import { Link, ROUTES } from "../lib/router";

const ease = [0.16, 1, 0.3, 1] as const;

// Op Beschikbaarheid, na de boekingssectie (lichte sectie na lichte sectie: .hl-sb).
export function HouseIntro() {
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
    <section
      id="goed-om-te-weten"
      aria-labelledby="goed-om-te-weten-titel"
      className="relative isolate overflow-hidden px-[1.875rem] hl-sb md:px-12"
    >
      <motion.div {...fadeUp()} className="relative mx-auto max-w-2xl text-center">
        <h2
          id="goed-om-te-weten-titel"
          className="font-display text-[clamp(2rem,3.8vw,3.25rem)] leading-[1.08] font-medium tracking-[-0.035em] text-balance text-forest-950"
        >
          Goed om te weten voor je boekt
        </h2>
        <p className="mx-auto mt-4 max-w-[46ch] text-sm leading-[1.65] text-forest-950/65">
          Aankomst- en vertrektijden, de eerstvolgende vrije periodes en antwoord op je vragen.
        </p>
      </motion.div>

      <div className="relative mt-12 grid grid-cols-1 gap-3 md:mt-14 md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] md:grid-rows-[auto_1fr] md:gap-4">
        <motion.div {...fadeUp(0.08)} className="md:row-span-2">
          <StayTimesCard />
        </motion.div>

        <motion.div {...fadeUp(0.16)}>
          <NextFreeCard />
        </motion.div>

        <motion.article
          {...fadeUp(0.24)}
          className="flex flex-col gap-5 rounded-[20px] bg-forest-950 p-5 text-bone md:p-7"
        >
          <div className="flex items-start gap-3">
            <ChatCircleText size={24} aria-hidden className="mt-0.5 shrink-0 text-bone/80" />
            <div>
              <h3 className="font-display text-xl font-medium tracking-[-0.03em]">Vragen over je verblijf?</h3>
              <p className="mt-1.5 max-w-[40ch] text-[0.8125rem] leading-[1.6] text-bone/70">
                Een langer verblijf, je huisdier of de wellness erbij: stuur een bericht, dan krijg je snel antwoord.
              </p>
            </div>
          </div>
          <Link
            href={ROUTES.contact}
            className="inline-flex h-11 items-center justify-center self-start rounded-xl bg-bone px-5 text-sm font-medium text-forest-950 transition-[transform,background-color] duration-200 hover:bg-white active:scale-[0.97]"
          >
            Stel een vraag
          </Link>
        </motion.article>
      </div>
    </section>
  );
}
