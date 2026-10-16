import { useCallback, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "../../lib/useMediaQuery";
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

// Eerste sectie na de hero: gecentreerde kop met een vaag woord erachter (zelfde als Reviews), kerncijfers op
// één regel eronder, daaronder de ruimtes: vanaf lg drie naast elkaar en de andere twee breder eronder.
// Onder lg is die rij een schuifrij (transform, geen scroll): pijlen, streepjes en vegen per kaart. Geen eigen
// scrollvak, dus geen witte iOS-vervaging en niet verticaal te slepen; touch-pan-y laat de pagina gewoon scrollen.
export function HouseSection() {
  const reduce = useReducedMotion();
  const carousel = useMediaQuery("(max-width: 1023.98px)"); // onder lg een schuifrij, daarboven een raster
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  /** Verschuiving (px) waarbij kaart i links uitlijnt; nooit verder dan het einde van de rij. */
  const offsetFor = useCallback((i: number) => {
    const el = track.current;
    const vp = viewport.current;
    const item = el?.children[i] as HTMLElement | undefined;
    if (!el || !vp || !item) return 0;
    const max = Math.max(0, el.scrollWidth - vp.clientWidth);
    return -Math.min(item.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft), max);
  }, []);

  /** Zet de rij op een positie; animate = uitglijden (bij loslaten en knoppen), anders direct (vinger volgen). */
  const setX = useCallback(
    (x: number, animate: boolean) => {
      const el = track.current;
      if (!el) return;
      el.style.transition = animate && !reduce ? "transform 520ms cubic-bezier(0.16, 1, 0.3, 1)" : "none";
      el.style.transform = `translate3d(${x}px, 0, 0)`;
    },
    [reduce],
  );

  const goTo = useCallback(
    (index: number) => {
      const i = Math.max(0, Math.min(ROOMS.length - 1, index));
      activeRef.current = i;
      setActive(i);
      setX(offsetFor(i), true);
    },
    [offsetFor, setX],
  );

  // Raster vanaf lg: geen verschuiving. Bij draaien of vergroten van het scherm de positie opnieuw uitrekenen.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (!carousel) {
      el.style.transform = "";
      el.style.transition = "";
      return;
    }
    const sync = () => setX(offsetFor(activeRef.current), false);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [carousel, offsetFor, setX]);

  /*
   * Veegbewegingen (alleen touch). De rij volgt je vinger 1-op-1 via transform (geen scroll, dus geen witte
   * iOS-vervaging en niet verticaal te slepen) en glijdt bij loslaten naar de volgende of vorige kaart.
   * Telt als veeg: 40 px of meer, of een snelle korte flick. Voorbij de eerste/laatste kaart rekt hij licht mee.
   * Verticale bewegingen laten de pagina scrollen (touch-pan-y).
   */
  const drag = useRef<{ x: number; y: number; base: number; axis: "x" | "y" | null; t: number; lastX: number; lastT: number; v: number } | null>(null);
  const frame = useRef(0);

  function onTouchStart(e: React.TouchEvent) {
    if (!carousel || e.touches.length > 1) return;
    const t = e.touches[0];
    const now = performance.now();
    drag.current = { x: t.clientX, y: t.clientY, base: offsetFor(activeRef.current), axis: null, t: now, lastX: t.clientX, lastT: now, v: 0 };
  }

  function onTouchMove(e: React.TouchEvent) {
    const d = drag.current;
    if (!d) return;
    const t = e.touches[0];
    const dx = t.clientX - d.x;
    const dy = t.clientY - d.y;
    if (!d.axis && Math.hypot(dx, dy) > 6) d.axis = Math.abs(dx) > Math.abs(dy) * 1.1 ? "x" : "y";
    if (d.axis !== "x") return;
    // Snelheid (px/ms), licht gedempt, voor een flick
    const now = performance.now();
    const dt = Math.max(1, now - d.lastT);
    d.v = 0.7 * ((t.clientX - d.lastX) / dt) + 0.3 * d.v;
    d.lastX = t.clientX;
    d.lastT = now;
    // Rek aan de randen: voorbij de eerste of laatste kaart beweegt de rij maar een derde mee
    const min = offsetFor(ROOMS.length - 1);
    let x = d.base + dx;
    if (x > 0) x = x * 0.35;
    else if (x < min) x = min + (x - min) * 0.35;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => setX(x, false));
  }

  function onTouchEnd(e: React.TouchEvent) {
    const d = drag.current;
    drag.current = null;
    cancelAnimationFrame(frame.current);
    if (!d || d.axis !== "x") return;
    const dx = e.changedTouches[0].clientX - d.x;
    const start = activeRef.current;
    // Flick: snel bewogen (snelheid bij loslaten) of een korte veeg binnen 250 ms, minimaal 15 px
    const quick = performance.now() - d.t < 250;
    const flick = (Math.abs(d.v) > 0.3 || quick) && Math.abs(dx) > 15;
    const dir = dx < -40 || (flick && dx < 0) ? 1 : dx > 40 || (flick && dx > 0) ? -1 : 0;
    goTo(start + dir);
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
    <section id="het-huis" aria-labelledby="het-huis-titel" className="relative isolate overflow-hidden px-[1.875rem] hl-sy md:px-12">
      {/* Statisch woord achter de titel, zelfde opbouw als bij Reviews. Geen scroll-animatie. */}
      <p
        aria-hidden
        className="pointer-events-none absolute top-8 left-1/2 -z-10 -translate-x-1/2 font-display text-[18vw] leading-[0.8] md:text-[clamp(6rem,19vw,17rem)] font-semibold tracking-[-0.05em] whitespace-nowrap text-forest-950/[0.04] select-none md:top-12"
      >
        Vertoeverij
      </p>
      <div className="hl-wrap">
      <motion.div {...fadeUp()} className="mx-auto max-w-3xl text-center">
        <p className="text-[0.8125rem] font-medium text-forest-700">Het huis</p>
        <h2
          id="het-huis-titel"
          className="mt-3 font-display text-[clamp(2.5rem,5vw,4.25rem)] leading-[1.04] font-medium tracking-[-0.035em] text-balance text-forest-950"
        >
          Comfortabel verblijven in het buitengebied
        </h2>
        <p className="mx-auto mt-4 max-w-[46ch] text-sm leading-[1.65] text-forest-950/65">
          Een ruim huis voor maximaal vier personen, met twee slaapkamers die elk een eigen badkamer hebben.
        </p>
        <dl className="mt-8 grid grid-cols-2 gap-x-5 gap-y-2.5 border-t border-forest-950/10 pt-5 text-left text-[0.8125rem] text-forest-950 sm:flex sm:flex-wrap sm:justify-center md:gap-x-8">
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

      {/* Mobiel: één rij die je met pijlen, streepjes of een horizontale veeg bedient. Vanaf lg: 3 + 2 raster. */}
      <div
        ref={viewport}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        className="-mx-[1.875rem] mt-8 overflow-hidden touch-pan-y md:-mx-12 md:mt-12 xl:mt-14 lg:mx-0 lg:overflow-visible"
      >
      <ul
        ref={track}
        aria-label="Ruimtes in het huis"
        className="flex gap-3 px-[1.875rem] pb-1 will-change-transform md:px-12 lg:grid lg:grid-cols-6 lg:gap-x-4 lg:gap-y-10 lg:px-0 lg:pb-0 lg:will-change-auto"
      >
        {ROOMS.map((room, i) => (
          <motion.li
            key={room.key}
            {...fadeUp(0.05 + i * 0.05)}
            aria-current={i === active ? "true" : undefined}
            className={`w-[80%] shrink-0 sm:w-[45%] lg:w-auto ${i < 3 ? "lg:col-span-2" : "lg:col-span-3"}`}
          >
            <RoomCard room={room} wide={i >= 3} />
          </motion.li>
        ))}
      </ul>
      </div>

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
      </div>
    </section>
  );
}

// Onderste rij (wide) is breder: lagere verhouding zodat beide rijen even hoge foto's hebben.
function RoomCard({ room, wide = false }: { room: Room; wide?: boolean }) {
  return (
    <figure>
      <div className={`aspect-[4/3] overflow-hidden rounded-2xl bg-forest-900 ${wide ? "lg:aspect-[2/1]" : ""}`}>
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
