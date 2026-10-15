import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Plus } from "@phosphor-icons/react";
import { SectionHeading } from "../page/SectionHeading";
import { AMENITIES } from "../../lib/house";

const ease = [0.16, 1, 0.3, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

// Voorzieningen als index: links één grote foto die meewisselt, rechts de vier groepen als genummerde regels.
// De laatst geopende groep bepaalt de foto (ook als je hem weer dichtklapt). Op mobiel staat de foto in de open groep zelf.
export function Amenities() {
  const reduce = useReducedMotion();
  const id = useId();
  const [open, setOpen] = useState<number | null>(0);
  const [shown, setShown] = useState(0);

  function toggle(i: number) {
    if (open === i) return setOpen(null);
    setOpen(i);
    setShown(i);
  }
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
    <section id="voorzieningen" aria-labelledby="voorzieningen-titel" className="px-[1.875rem] hl-sy md:px-12">
      <div className="hl-wrap">
      <SectionHeading align="center"
        id="voorzieningen-titel"
        eyebrow="Voorzieningen"
        title="Dit vind je bij De Zandloper"
        text="Of je nu een paar dagen wilt wandelen en fietsen of even weg wilt uit de drukte: hier heb je de ruimte."
      />
      <div className="mt-10 grid grid-cols-1 gap-10 md:mt-12 lg:grid-cols-12 lg:items-start lg:gap-x-16">
        <motion.figure
          {...fadeUp(0.05)}
          className="relative isolate hidden overflow-hidden rounded-[20px] bg-forest-900 lg:sticky lg:top-8 lg:col-span-6 lg:block lg:h-[min(70svh,36rem)]"
        >
          {AMENITIES.map((group, i) => (
            <img
              key={group.title}
              src={group.image}
              alt={i === shown ? group.alt : ""}
              aria-hidden={i !== shown}
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 -z-10 size-full object-cover transition-[opacity,transform] duration-700 ease-(--ease-out-soft) motion-reduce:transition-none ${
                i === shown ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
              }`}
            />
          ))}
          <figcaption className="glass absolute bottom-5 left-5 flex items-center gap-3 rounded-full py-2 pr-4 pl-2 text-[0.8125rem] text-bone">
            <span className="rounded-full bg-bone px-2.5 py-0.5 font-medium text-forest-950 tabular-nums">
              {pad(shown + 1)}/{pad(AMENITIES.length)}
            </span>
            <span className="font-medium">{AMENITIES[shown].title}</span>
          </figcaption>
        </motion.figure>

        <div className="lg:col-span-6">
          <motion.ul {...fadeUp(0.1)} className="border-t border-forest-950/10">
            {AMENITIES.map((group, i) => {
              const isOpen = i === open;
              const buttonId = `${id}-knop-${i}`;
              const panelId = `${id}-paneel-${i}`;
              return (
                <li key={group.title} className="border-b border-forest-950/10">
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(i)}
                      className="group grid w-full cursor-pointer grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center py-5 text-left md:grid-cols-[3.5rem_minmax(0,1fr)_auto] md:py-6"
                    >
                      <span className="text-[0.8125rem] text-forest-700 tabular-nums">{pad(i + 1)}</span>
                      <span
                        className={`font-display text-[clamp(1.625rem,2.6vw,2.25rem)] leading-tight transition-colors duration-300 ${
                          isOpen ? "text-forest-950" : "text-forest-950/40 group-hover:text-forest-950/70"
                        }`}
                      >
                        {group.title}
                      </span>
                      <span
                        aria-hidden
                        className={`grid size-9 place-items-center rounded-full border transition-[transform,background-color,border-color,color] duration-300 ${
                          isOpen ? "rotate-45 border-forest-950 bg-forest-950 text-bone" : "border-forest-950/15 text-forest-950"
                        }`}
                      >
                        <Plus size={16} />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    inert={!isOpen}
                    className={`grid transition-[grid-template-rows] duration-500 ease-(--ease-out-soft) motion-reduce:transition-none ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="pb-7 md:pl-14">
                        <img
                          src={group.image}
                          alt={group.alt}
                          loading="lazy"
                          decoding="async"
                          className="mb-5 aspect-[16/10] w-full rounded-2xl object-cover lg:hidden"
                        />
                        <ul className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                          {group.items.map((item) => (
                            <li key={item} className="border-t border-forest-950/8 py-3 text-sm leading-[1.5] text-forest-950/75">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </motion.ul>
        </div>
      </div>
      </div>
    </section>
  );
}
