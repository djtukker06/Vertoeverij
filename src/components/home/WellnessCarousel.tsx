import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Pause, Play } from "@phosphor-icons/react";

export type Slide = { src: string; alt: string; caption: string; position?: string };

const INTERVAL = 6000; // 6 s per foto, rustig tempo
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Fotocarrousel voor de wellness: foto's vloeien langzaam in elkaar over (crossfade met lichte zoom).
 * Loopt vanzelf; teller (zelfde stijl als de voorzieningen), pijlen en een pauzeknop om zelf te bladeren. Staat stil bij hover/focus,
 * als het tabblad verborgen is en bij reduced motion.
 */
export function WellnessCarousel({ slides, className = "" }: { slides: Slide[]; className?: string }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const running = !reduce && !paused && !hovered && slides.length > 1;

  const go = useCallback((n: number) => setIndex((n + slides.length) % slides.length), [slides.length]);

  // Elke handmatige stap zet de timer opnieuw (index in de deps), zodat je niet meteen doorschiet
  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => {
      if (document.visibilityState === "visible") go(index + 1);
    }, INTERVAL);
    return () => window.clearTimeout(t);
  }, [running, index, go]);

  return (
    <figure
      aria-roledescription="carrousel"
      aria-label="Foto's van de wellness"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={`relative isolate overflow-hidden rounded-[20px] bg-forest-900 ${className}`}
    >
      {slides.map((s, i) => {
        const active = i === index;
        return (
          <img
            key={s.src}
            src={s.src}
            alt={active ? s.alt : ""}
            aria-hidden={!active}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            style={{ objectPosition: s.position ?? "50% 30%" }}
            className={`absolute inset-0 -z-10 size-full object-cover transition-[opacity,transform] duration-[1600ms] ease-in-out motion-reduce:transition-none ${
              active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
            }`}
          />
        );
      })}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(12_20_15/0)_55%,rgb(12_20_15/0.65)_100%)]" />

      {/* Mobiel: teller linksboven, knoppen rechtsonder (anders vallen ze buiten de foto). Vanaf sm samen onderin. */}
      <figcaption className="absolute inset-0 flex flex-col items-start justify-between gap-3 p-4 text-bone sm:inset-x-0 sm:top-auto sm:flex-row sm:items-end sm:p-5 md:p-6">
        {/* Teller in dezelfde stijl als bij de voorzieningen (01/04 + titel) */}
        <span aria-live={running ? "off" : "polite"} className="glass flex items-center gap-3 rounded-full py-2 pr-4 pl-2 text-[0.8125rem]">
          <span className="rounded-full bg-bone px-2.5 py-0.5 font-medium text-forest-950 tabular-nums">
            {pad(index + 1)}/{pad(slides.length)}
          </span>
          <span className="font-medium">{slides[index].caption}</span>
        </span>
        <span className="flex items-center gap-2 self-end sm:self-auto">
          <CarouselButton label="Vorige foto" onClick={() => go(index - 1)}>
            <ArrowLeft size={16} aria-hidden />
          </CarouselButton>
          {!reduce && (
            <CarouselButton label={paused ? "Foto's afspelen" : "Foto's pauzeren"} pressed={paused} onClick={() => setPaused((p) => !p)}>
              {paused ? <Play size={14} weight="fill" aria-hidden /> : <Pause size={14} weight="fill" aria-hidden />}
            </CarouselButton>
          )}
          <CarouselButton label="Volgende foto" onClick={() => go(index + 1)}>
            <ArrowRight size={16} aria-hidden />
          </CarouselButton>
        </span>
      </figcaption>
    </figure>
  );
}

function CarouselButton({ label, pressed, onClick, children }: { label: string; pressed?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className="glass grid size-10 cursor-pointer place-items-center rounded-full text-bone transition-transform duration-200 active:scale-95"
    >
      {children}
    </button>
  );
}
