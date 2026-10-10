import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Bathtub, Bed, Drop, SunHorizon, UsersThree, type Icon } from "@phosphor-icons/react";
import { HOUSE_FACTS, ROOMS, type Room } from "../../lib/house";

const ease = [0.16, 1, 0.3, 1] as const;

const FACT_ICONS: Record<string, Icon> = {
  slaapkamers: Bed,
  badkamers: Bathtub,
  personen: UsersThree,
  terras: SunHorizon,
  wellness: Drop,
};

// Eerste sectie na de hero: kop links, intro rechts, kerncijfers op één regel eronder,
// daaronder alle ruimtes in één rij kleine foto's met het onderschrift onder de foto.
// Onder lg is die rij een carrousel (veegbaar, met pijlen en streepjes zoals bij Reviews).
export function HouseSection() {
  const reduce = useReducedMotion();
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  // Startpositie van een kaart in de rij (kaarten klikken links vast, na de zijmarge)
  const slideLeft = (el: HTMLUListElement, item: HTMLElement) => item.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft);

  // Actieve kaart = de kaart die het dichtst bij de linkerkant staat; helemaal rechts = de laatste
  function onScroll() {
    const el = track.current;
    if (!el) return;
    const items = Array.from(el.children) as HTMLElement[];
    if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 2) return setActive(items.length - 1);
    let nearest = 0;
    items.forEach((item, i) => {
      if (Math.abs(slideLeft(el, item) - el.scrollLeft) < Math.abs(slideLeft(el, items[nearest]) - el.scrollLeft)) nearest = i;
    });
    setActive(nearest);
  }

  function goTo(index: number) {
    const el = track.current;
    const item = el?.children[index] as HTMLElement | undefined;
    if (!el || !item) return;
    el.scrollTo({ left: slideLeft(el, item), behavior: reduce ? "auto" : "smooth" });
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
    <section id="het-huis" aria-labelledby="het-huis-titel" className="px-[1.875rem] hl-sy md:px-12">
      <motion.div {...fadeUp()} className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-x-12 lg:gap-y-8">
        <h2
          id="het-huis-titel"
          className="font-display text-[clamp(2rem,3.8vw,3.25rem)] leading-[1.08] font-medium text-balance text-forest-950 lg:col-span-6"
        >
          Comfortabel verblijven in het buitengebied
        </h2>
        <p className="max-w-[46ch] text-sm leading-[1.65] text-forest-950/65 lg:col-span-5 lg:col-start-8">
          Een ruim appartement voor maximaal vier personen, met twee slaapkamers die elk een eigen badkamer hebben.
        </p>
        <dl className="grid grid-cols-2 gap-x-5 gap-y-2.5 border-t border-forest-950/10 pt-5 text-[0.8125rem] text-forest-950 sm:flex sm:flex-wrap md:gap-x-8 lg:col-span-12 lg:gap-x-10">
          {HOUSE_FACTS.map((f) => {
            const FactIcon = FACT_ICONS[f.label];
            return (
              <div key={f.label} className="flex items-center gap-2">
                {FactIcon && <FactIcon size={18} aria-hidden className="text-forest-700" />}
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <span className="font-medium">{f.value}</span> {f.label}
                </dd>
              </div>
            );
          })}
        </dl>
      </motion.div>

      {/* Mobiel: één veegbare rij. Vanaf lg: alle vijf ruimtes naast elkaar, zodat de sectie compact blijft. */}
      <ul
        ref={track}
        onScroll={onScroll}
        aria-label="Ruimtes in het appartement, horizontaal scrollbaar"
        tabIndex={0}
        className="relative -mx-[1.875rem] mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-[1.875rem] pb-1 [scrollbar-width:none] focus-visible:outline-offset-[-4px] md:-mx-12 md:mt-12 md:px-12 xl:mt-14 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
      >
        {ROOMS.map((room, i) => (
          <motion.li
            key={room.key}
            {...fadeUp(0.05 + i * 0.05)}
            aria-current={i === active ? "true" : undefined}
            className="w-[80%] shrink-0 snap-start scroll-ml-[1.875rem] sm:w-[45%] md:scroll-ml-12 lg:w-auto"
          >
            <RoomCard room={room} />
          </motion.li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-center gap-4 lg:hidden">
        <NavButton label="Vorige ruimte" disabled={active === 0} onClick={() => goTo(active - 1)}>
          <ArrowLeft size={18} aria-hidden />
        </NavButton>
        <div className="flex gap-1.5">
          {ROOMS.map((room, i) => (
            <button
              key={room.key}
              type="button"
              aria-label={`Ga naar ${room.title.toLowerCase()}`}
              aria-current={i === active ? "true" : undefined}
              onClick={() => goTo(i)}
              className="group grid h-11 cursor-pointer place-items-center"
            >
              <span
                className={`block h-0.5 rounded-full transition-[width,background-color] duration-500 ease-(--ease-out-soft) ${
                  i === active ? "w-8 bg-forest-950" : "w-4 bg-forest-950/20 group-hover:bg-forest-950/40"
                }`}
              />
            </button>
          ))}
        </div>
        <NavButton label="Volgende ruimte" disabled={active === ROOMS.length - 1} onClick={() => goTo(active + 1)}>
          <ArrowRight size={18} aria-hidden />
        </NavButton>
      </div>
    </section>
  );
}

function RoomCard({ room }: { room: Room }) {
  return (
    <figure>
      <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-forest-900">
        <img src={room.image} alt={room.alt} loading="lazy" decoding="async" className="size-full object-cover" />
      </div>
      <figcaption className="mt-3 text-forest-950">
        <span className="block font-display text-base leading-tight lg:text-lg">{room.title}</span>
        <span className="mt-1 block text-[0.8125rem] leading-[1.55] text-forest-950/60">{room.text}</span>
      </figcaption>
    </figure>
  );
}

function NavButton({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full bg-forest-950 text-bone transition-[transform,opacity,background-color] duration-200 hover:bg-forest-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-25 disabled:active:scale-100"
    >
      {children}
    </button>
  );
}
