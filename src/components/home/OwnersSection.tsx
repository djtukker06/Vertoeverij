import { motion, useReducedMotion } from "motion/react";
import { useMediaQuery } from "../../lib/useMediaQuery";
import { ArrowRight } from "@phosphor-icons/react";
import { WELLNESS } from "../../lib/house";
import { WellnessCarousel } from "./WellnessCarousel";
import { SectionHeading } from "../page/SectionHeading";
import { useBooking } from "../../lib/booking";

const ease = [0.16, 1, 0.3, 1] as const;

// Wellness De Zandloper: donkergroene kaart met de vaste sectiekop, daaronder een fotocarrousel en het verhaal.
export function OwnersSection() {
  // Mobiel: alleen sectiekoppen animeren, inhoud staat direct stil zodat scrollen rustig oogt
  const mobile = useMediaQuery("(max-width: 767.98px)");
  const reduce = useReducedMotion() || mobile;
  const { setWellness, goToBooking } = useBooking();
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
    <section id="wellness" aria-labelledby="wellness-titel" className="scroll-mt-0 p-2.5 md:p-2">
      <div className="rounded-[28px] bg-forest-950 px-5 hl-sy text-bone md:px-10">
        <div className="hl-wrap">
          <SectionHeading align="center"
            id="wellness-titel"
            eyebrow="Wellness De Zandloper"
            title={WELLNESS.title}
            text="Sauna, jacuzzi en Turks stoombad, helemaal voor jullie alleen."
            tone="dark"
            action={
              // Naar de boekingssectie met de privé wellness al aangevinkt
              <button
                type="button"
                onClick={() => {
                  setWellness(true);
                  goToBooking(1);
                }}
                className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-bone px-5 text-sm font-medium text-forest-950 transition-[transform,background-color] duration-200 hover:bg-white active:scale-[0.97]"
              >
                Boek met wellness
                <ArrowRight size={16} aria-hidden />
              </button>
            }
          />

          <div className="mt-10 grid grid-cols-1 gap-3 md:mt-12 md:gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <motion.div {...fadeUp(0.05)}>
              <WellnessCarousel slides={WELLNESS.images} className="h-full min-h-[440px] md:min-h-[600px]" />
            </motion.div>

            <motion.div {...fadeUp(0.12)} className="flex flex-col rounded-[20px] border border-bone/10 bg-forest-900 p-7 md:p-10 lg:p-12">
              <div className="flex flex-col gap-5 text-[0.9375rem] leading-[1.7] text-bone/75">
                {WELLNESS.story.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              {/* Sauna, Turks stoombad en jacuzzi als drie losse regels */}
              <dl className="mt-8 border-t border-bone/15 lg:mt-auto">
                {WELLNESS.facts.map((f) => (
                  <div key={f.value} className="flex items-baseline justify-between gap-6 border-b border-bone/10 py-4">
                    <dt className="font-display text-[clamp(1.375rem,2vw,1.75rem)] leading-tight font-light tracking-[-0.03em]">{f.value}</dt>
                    <dd className="text-right text-[0.8125rem] text-bone/60">{f.label}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
