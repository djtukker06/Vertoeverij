import { motion, useReducedMotion } from "motion/react";
import { SectionHeading } from "./SectionHeading";
import { WEEKDAYS, addMonths, dayKey, daysInMonth, longFmt, monthCells, monthFmt, sameDay, startOfDay, startOfMonth } from "../../lib/dates";
import { MIN_NIGHTS, canArriveOn, isNightBooked } from "../../lib/availability";
import { useBooking } from "../../lib/booking";
import { TEXT } from "../../lib/content";

const MONTHS = 6;
const ease = [0.16, 1, 0.3, 1] as const;

// Zes maanden in één oogopslag. Een vrije dag aanklikken = aankomst invullen en door naar de boekingssectie.
export function AvailabilityOverview() {
  const reduce = useReducedMotion();
  const { arrive, setArrive, setLeave, goToBooking } = useBooking();
  const today = startOfDay(new Date());
  const months = Array.from({ length: MONTHS }, (_, i) => addMonths(startOfMonth(today), i));

  function choose(d: Date) {
    setArrive(d);
    setLeave(null);
    goToBooking(1);
  }

  return (
    <section aria-labelledby="overzicht-titel" className="relative isolate overflow-hidden px-[1.875rem] hl-sy md:px-12">
      <SectionHeading
        id="overzicht-titel"
        title={TEXT.overviewTitle}
        text={TEXT.overviewIntro}
        watermark={TEXT.overviewWatermark}
      />

      <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-14 md:gap-4 xl:grid-cols-3">
        {months.map((month, mi) => {
          const free = Array.from({ length: daysInMonth(month) }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)).filter(
            (d) => d >= today && !isNightBooked(d),
          ).length;
          return (
            <motion.div
              key={month.getTime()}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease, delay: (mi % 3) * 0.08 }}
              className="rounded-[20px] border border-forest-950/8 bg-[var(--panel)] p-5 md:p-6"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-lg font-medium tracking-[-0.03em] first-letter:uppercase">{monthFmt.format(month)}</h3>
                <p className="text-[0.8125rem] text-forest-950/55">{free === 0 ? "Vol" : `${free} ${free === 1 ? "nacht" : "nachten"} vrij`}</p>
              </div>
              <div className="mt-4 grid grid-cols-7 text-center text-[0.6875rem] text-forest-950/45" aria-hidden>
                {WEEKDAYS.map((d) => (
                  <span key={d} className="pb-1.5">
                    {d}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {monthCells(month).map((d, i) => {
                  if (!d) return <span key={`blank-${i}`} />;
                  const past = d < today;
                  const arrivable = canArriveOn(d);
                  const booked = !past && isNightBooked(d);
                  const selected = sameDay(d, arrive);
                  if (arrivable) {
                    return (
                      <button
                        key={dayKey(d)}
                        type="button"
                        onClick={() => choose(d)}
                        aria-label={`${longFmt.format(d)}: vrij. Kies als aankomstdag`}
                        aria-pressed={selected}
                        className={`grid h-9 cursor-pointer place-items-center rounded-lg text-[0.8125rem] font-medium tabular-nums transition-colors duration-150 ${
                          selected ? "bg-forest-950 text-bone" : "bg-free text-forest-950 hover:bg-forest-950 hover:text-bone"
                        }`}
                      >
                        {d.getDate()}
                      </button>
                    );
                  }
                  return (
                    <span
                      key={dayKey(d)}
                      title={!past && !booked ? `Minimaal ${MIN_NIGHTS} nachten` : undefined}
                      className={`grid h-9 place-items-center rounded-lg text-[0.8125rem] tabular-nums ${
                        past ? "text-forest-950/20" : booked ? "booked-hatch text-forest-950/35" : "text-forest-950/40"
                      }`}
                    >
                      <span aria-hidden>{d.getDate()}</span>
                      <span className="sr-only">
                        {`${longFmt.format(d)}: ${past ? "voorbij" : booked ? "bezet" : `vrij, maar korter dan ${MIN_NIGHTS} nachten`}`}
                      </span>
                    </span>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.8125rem] text-forest-950/60">
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="size-3.5 rounded bg-free" />
          Vrij
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="booked-hatch size-3.5 rounded" />
          Bezet
        </span>
        <span>Minimaal {MIN_NIGHTS} nachten</span>
      </div>
    </section>
  );
}
