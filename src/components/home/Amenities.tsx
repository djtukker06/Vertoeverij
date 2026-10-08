import { motion, useReducedMotion } from "motion/react";
import { Bathtub, Bed, Check, Couch, Tree, type Icon } from "@phosphor-icons/react";
import { SectionHeading } from "../page/SectionHeading";
import { AMENITIES } from "../../lib/house";
import { asset } from "../../lib/config";

const ease = [0.16, 1, 0.3, 1] as const;
const ICONS: Icon[] = [Couch, Bed, Tree, Bathtub];

// Voorzieningen per ruimte: kop en buitenfoto links, vier lichte panelen rechts.
export function Amenities() {
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
    <section aria-labelledby="voorzieningen-titel" className="px-[1.875rem] hl-sb md:px-12">
      <div className="grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <div className="flex flex-col gap-8 lg:pr-8">
          <SectionHeading
            id="voorzieningen-titel"
            title="Dit vind je bij De Zandloper"
            text="Of je nu een paar dagen wilt wandelen en fietsen of even weg wilt uit de drukte: hier heb je de ruimte."
            align="left"
          />
          <motion.figure {...fadeUp(0.05)} className="relative isolate mt-auto min-h-[260px] flex-1 overflow-hidden rounded-[20px] bg-forest-900 lg:min-h-[300px]">
            <img
              src={asset("/foto/accommodatie/buitenhaard.webp")}
              alt="Buitenhaard met barbecue op het overdekte terras"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 -z-10 size-full object-cover"
            />
            <figcaption className="glass absolute bottom-4 left-4 rounded-full px-4 py-2 text-[0.8125rem] font-medium text-bone">
              Buitenhaard en barbecue
            </figcaption>
          </motion.figure>
        </div>

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
          {AMENITIES.map((group, i) => {
            const GroupIcon = ICONS[i % ICONS.length];
            return (
              <motion.li
                key={group.title}
                {...fadeUp(0.08 + i * 0.06)}
                className="rounded-[20px] border border-forest-950/8 bg-[var(--panel)] p-6 text-forest-950 md:p-7"
              >
                <div className="flex items-center gap-3">
                  <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-forest-950/[0.06] text-forest-700">
                    <GroupIcon size={20} />
                  </span>
                  <h3 className="font-display text-lg font-medium tracking-[-0.03em]">{group.title}</h3>
                </div>
                <ul className="mt-5 flex flex-col gap-3 border-t border-forest-950/8 pt-5">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-[1.5] text-forest-950/80">
                      <Check size={15} aria-hidden className="mt-[3px] shrink-0 text-forest-700" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
