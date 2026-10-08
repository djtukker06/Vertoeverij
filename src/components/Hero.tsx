import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type Variants } from "motion/react";
import { useMediaQuery } from "../lib/useMediaQuery";
import { SiteHeader } from "./SiteHeader";
import { HeroBackground } from "./HeroBackground";
import { BookingBar } from "./BookingBar";

// Uit de aangeleverde teksten: appartement voor vier, twee slaapkamers met eigen badkamer, privé wellness.
const FACTS = [
  { value: "4", label: "personen" },
  { value: "2", label: "slaapkamers" },
  { value: "Privé", label: "wellness" },
];

const HEADLINE = ["Een fijne plek", "om heerlijk", "te vertoeven."];

const ease = [0.16, 1, 0.3, 1] as const;

// Moet gelijk lopen met de media query van .hero-track/.hero-pin/.after-hero in index.css.
// Op kleine of lage schermen en bij reduced motion scrolt de hero gewoon mee.
const PIN_QUERY = "(min-width: 768px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)";

export function Hero() {
  const reduce = useReducedMotion();
  const pinned = useMediaQuery(PIN_QUERY);
  const track = useRef<HTMLDivElement>(null);

  // Zodra je begint te scrollen opent de kaart in 0.7 s naar fullscreen (tijd-gebaseerd, los van scrollsnelheid).
  const { scrollY } = useScroll();
  const [expanded, setExpanded] = useState(() => window.scrollY > 4);
  useMotionValueEvent(scrollY, "change", (y) => setExpanded(y > 4));

  // Track is 200dvh hoog, dus 100dvh scrollbaar: de volgende sectie schuift vanaf de eerste pixel
  // over de gepinde hero heen. Progress 0 - 1 = sectie onderaan tot sectie volledig in beeld.
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const dim = useTransform(scrollYProgress, [0, 1], [0, 0.55]);

  // Volgorde: eerst het huis (Remotion intro), dan de kop, dan feiten en boeken.
  const rise: Variants = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 16 },
    show: (delay: number) => ({ opacity: 1, y: 0, transition: { duration: 0.9, ease, delay } }),
  };
  const line: Variants = {
    hidden: reduce ? { y: 0 } : { y: "105%" },
    show: (i: number) => ({ y: 0, transition: { duration: 1.1, ease, delay: 0.6 + i * 0.12 } }),
  };

  return (
    <section ref={track} className="hero-track relative">
      <div className="hero-pin">
        <motion.div
          initial={false}
          animate={pinned ? { clipPath: expanded ? "inset(0px round 0px)" : "inset(8px round 28px)" } : undefined}
          transition={{ duration: 0.7, ease }}
          className="relative isolate flex h-full min-h-[100dvh] flex-col overflow-hidden bg-forest-950 text-bone [clip-path:inset(10px_round_28px)] md:[clip-path:inset(8px_round_28px)]"
        >
          <HeroBackground />

          <motion.header
            initial="hidden"
            animate="show"
            custom={0.3}
            variants={rise}
            className="relative z-20 px-[1.875rem] pt-[1.875rem] md:px-12 md:pt-9"
          >
            <SiteHeader />
          </motion.header>

          <div className="relative z-10 flex flex-1 flex-col px-[1.875rem] pb-[1.875rem] md:px-12 md:pb-12">
            <div className="grid flex-1 items-center gap-10 pt-12 pb-10 md:grid-cols-[1fr_auto] md:gap-16 md:pt-8">
              <div>
                <h1 className="font-display text-[clamp(2.5rem,5.4vw,4.75rem)] leading-[1] font-medium tracking-[-0.035em]">
                  {HEADLINE.map((text, i) => (
                    <span key={text} className="block overflow-hidden pb-[0.08em]">
                      <motion.span className="block" initial="hidden" animate="show" custom={i} variants={line}>
                        {text}
                      </motion.span>
                    </span>
                  ))}
                </h1>
                <motion.p
                  initial="hidden"
                  animate="show"
                  custom={1.05}
                  variants={rise}
                  className="mt-6 max-w-[44ch] text-sm leading-[1.65] text-bone/80"
                >
                  In het buitengebied van Kloosterhaar, met vrij uitzicht over de weilanden. Een comfortabel appartement
                  met een privé wellness die je eenvoudig bij je verblijf boekt.
                </motion.p>
              </div>

              <motion.dl
                initial="hidden"
                animate="show"
                custom={1.2}
                variants={rise}
                className="grid grid-cols-3 gap-4 border-t border-bone/20 pt-5 md:grid-cols-1 md:gap-7 md:border-t-0 md:border-l md:pt-0 md:pl-8"
              >
                {FACTS.map((f) => (
                  <div key={f.label} className="flex flex-col-reverse gap-1">
                    <dt className="text-[0.8125rem] text-bone/75">{f.label}</dt>
                    <dd className="text-[clamp(1.75rem,3vw,2.5rem)] leading-none font-light tracking-[-0.02em] tabular-nums">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </motion.dl>
            </div>

            <motion.div initial="hidden" animate="show" custom={1.4} variants={rise}>
              <BookingBar />
            </motion.div>
          </div>

          {pinned && (
            <motion.div aria-hidden style={{ opacity: dim }} className="pointer-events-none absolute inset-0 z-30 bg-forest-950" />
          )}
        </motion.div>
      </div>
    </section>
  );
}
