import { useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { WEEKDAYS, addMonths, dayKey, longFmt, monthCells, monthFmt, sameDay, startOfDay, startOfMonth } from "../../lib/dates";

type Props = {
  value: Date | null;
  onChange: (d: Date) => void;
  /** Welke dagen kiesbaar zijn (bijv. dag met een vrij wellness-tijdslot) */
  isSelectable: (d: Date) => boolean;
  /** Eerste maand die getoond wordt */
  start?: Date;
  monthsAhead?: number;
};

// Kalender voor één dag (wellness). Niet-kiesbare dagen zijn uitgeschakeld; vandaag heeft een ring.
export function DayCalendar({ value, onChange, isSelectable, start, monthsAhead = 11 }: Props) {
  const today = startOfDay(new Date());
  const first = startOfMonth(start ?? today);
  const last = addMonths(startOfMonth(today), monthsAhead);
  const [view, setView] = useState(() => startOfMonth(value ?? first));

  return (
    <div className="max-w-sm">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setView((v) => addMonths(v, -1))}
          disabled={view <= first}
          aria-label="Vorige maand"
          className="grid size-10 cursor-pointer place-items-center rounded-full text-ink transition-colors hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-25"
        >
          <CaretLeft size={16} />
        </button>
        <p aria-live="polite" className="text-sm font-medium first-letter:uppercase">
          {monthFmt.format(view)}
        </p>
        <button
          type="button"
          onClick={() => setView((v) => addMonths(v, 1))}
          disabled={view >= last}
          aria-label="Volgende maand"
          className="grid size-10 cursor-pointer place-items-center rounded-full text-ink transition-colors hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-25"
        >
          <CaretRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-[0.6875rem] text-ink/45" aria-hidden>
        {WEEKDAYS.map((d) => (
          <span key={d} className="pb-1.5">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {monthCells(view).map((d, i) => {
          if (!d) return <span key={`b-${i}`} />;
          const ok = isSelectable(d);
          const selected = sameDay(d, value);
          return (
            <button
              key={dayKey(d)}
              type="button"
              disabled={!ok}
              onClick={() => onChange(d)}
              aria-pressed={selected}
              aria-label={`${longFmt.format(d)}${ok ? "" : ": niet beschikbaar"}`}
              className={`mx-auto grid size-11 cursor-pointer place-items-center rounded-full text-sm tabular-nums transition-colors duration-150 disabled:cursor-not-allowed ${
                selected ? "bg-pine font-medium text-cream" : ok ? "font-medium text-pine hover:bg-pine/10" : "text-ink/25"
              } ${sameDay(d, today) && !selected ? "ring-1 ring-ink/30 ring-inset" : ""}`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
