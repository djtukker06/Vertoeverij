import { ArrowRight } from "@phosphor-icons/react";
import { MAX_NIGHTS, MIN_NIGHTS, nextFreePeriods } from "../lib/availability";
import { useBooking } from "../lib/booking";
import { addDays } from "../lib/dates";
import { TEXT } from "../lib/content";

const PERIODS_SHOWN = 4;
const DEFAULT_NIGHTS = 7;
const dayFmt = new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "short" });
const weekdayFmt = new Intl.DateTimeFormat("nl-NL", { weekday: "short" });

// Eerstvolgende vrije periodes: één klik zet de data klaar in de boekingssectie.
export function NextFreeCard() {
  const { setArrive, setLeave, goToBooking } = useBooking();
  const periods = nextFreePeriods(PERIODS_SHOWN);

  return (
    <div className="flex flex-col rounded-[20px] border border-forest-950/8 bg-[var(--panel)] p-5 text-forest-950 md:p-6">
      <h3 className="font-display text-xl font-medium tracking-[-0.03em]">{TEXT.nextFreeTitle}</h3>
      <p className="mt-1 text-[0.8125rem] text-forest-950/60">{TEXT.nextFreeIntro}</p>

      {periods.length === 0 ? (
        <p className="mt-5 text-sm text-forest-950/70">Het komende jaar is volgeboekt. Stel gerust een vraag over annuleringen.</p>
      ) : (
        <ul className="mt-4 divide-y divide-forest-950/8">
          {periods.map((p) => {
            // Lange vrije periodes niet helemaal vastzetten: een week als voorstel, aanpasbaar in de kalender
            const nights = Math.min(p.nights, DEFAULT_NIGHTS, MAX_NIGHTS);
            const leave = addDays(p.start, nights);
            const open = p.nights > DEFAULT_NIGHTS;
            return (
              <li key={p.start.getTime()}>
                <button
                  type="button"
                  onClick={() => {
                    setArrive(p.start);
                    setLeave(leave);
                    goToBooking(2);
                  }}
                  className="group flex w-full cursor-pointer items-center justify-between gap-4 py-3.5 text-left"
                >
                  <span>
                    <span className="block text-sm font-medium">
                      {weekdayFmt.format(p.start)} {dayFmt.format(p.start)} tot {weekdayFmt.format(p.end)} {dayFmt.format(p.end)}
                    </span>
                    <span className="block text-[0.8125rem] text-forest-950/55">
                      {open
                        ? `${p.nights} nachten vrij, voorstel ${nights} nachten`
                        : `${p.nights} ${p.nights === 1 ? "nacht" : "nachten"} vrij`}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="grid size-9 shrink-0 place-items-center rounded-full border border-forest-950/15 transition-colors duration-200 group-hover:border-forest-950 group-hover:bg-forest-950 group-hover:text-bone"
                  >
                    <ArrowRight size={16} />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-auto pt-3 text-[0.8125rem] text-forest-950/50">Minimaal {MIN_NIGHTS} nachten.</p>
    </div>
  );
}
