import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { WEEKDAYS, addDays, addMonths, dayKey, longFmt, monthCells, monthFmt, sameDay, startOfDay, startOfMonth } from "../../lib/dates";
import { MIN_NIGHTS, canArriveOn, isNightBooked, latestDeparture } from "../../lib/availability";
import { useMediaQuery } from "../../lib/useMediaQuery";

const MONTHS_AHEAD = 11;

type Props = {
  arrive: Date | null;
  leave: Date | null;
  onChange: (arrive: Date | null, leave: Date | null) => void;
};

/**
 * Bereikkalender: eerst aankomst, dan vertrek. Alleen geldige dagen zijn klikbaar:
 * aankomst = minimaal MIN_NIGHTS vrije nachten, vertrek = na MIN_NIGHTS en uiterlijk op de wisseldag.
 * Toetsenbord: pijltjes per dag/week, PageUp/PageDown per maand, Enter of spatie kiest.
 */
export function RangeCalendar({ arrive, leave, onChange }: Props) {
  const today = startOfDay(new Date());
  const firstMonth = startOfMonth(today);
  const lastMonth = addMonths(firstMonth, MONTHS_AHEAD);
  const twoMonths = useMediaQuery("(min-width: 768px)");
  const monthsShown = twoMonths ? 2 : 1;

  const [view, setView] = useState(() => startOfMonth(arrive ?? today));
  const [focusDay, setFocusDay] = useState<Date>(() => arrive ?? today);
  const [hover, setHover] = useState<Date | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const keyboardMove = useRef(false);

  const choosingDeparture = !!arrive && !leave;
  const lastDeparture = arrive ? latestDeparture(arrive) : null;

  const isValidDeparture = (d: Date) =>
    !!arrive && !!lastDeparture && d >= addDays(arrive, MIN_NIGHTS) && d <= lastDeparture;

  function isSelectable(d: Date) {
    if (!choosingDeparture) return canArriveOn(d);
    if (sameDay(d, arrive)) return true; // nogmaals klikken = aankomst wissen
    if (isValidDeparture(d)) return true;
    // Opnieuw beginnen kan alleen buiten de vertrekreeks, anders verwar je "te kort" met "nieuwe aankomst"
    return canArriveOn(d) && (d < arrive! || d > lastDeparture!);
  }

  function select(d: Date) {
    if (!isSelectable(d)) return;
    if (!choosingDeparture) return onChange(d, null);
    if (sameDay(d, arrive)) return onChange(null, null);
    if (isValidDeparture(d)) return onChange(arrive, d);
    onChange(d, null);
  }

  // Bij een nieuwe aankomst van buitenaf (hero, vrije periodes) de kalender daarheen laten springen
  useEffect(() => {
    if (!arrive) return;
    setFocusDay(arrive);
    setView((v) => (arrive < v || arrive >= addMonths(v, monthsShown) ? startOfMonth(arrive) : v));
  }, [arrive]); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus volgt de toetsenbordbeweging (niet bij muisklikken)
  useEffect(() => {
    if (!keyboardMove.current) return;
    keyboardMove.current = false;
    grid.current?.querySelector<HTMLButtonElement>(`[data-day="${dayKey(focusDay)}"]`)?.focus();
  }, [focusDay, view]);

  function moveFocus(d: Date) {
    if (d < today) d = today;
    if (d > addMonths(lastMonth, 1)) return;
    keyboardMove.current = true;
    setFocusDay(d);
    setHover(d);
    if (d < view) setView(startOfMonth(d));
    else if (d >= addMonths(view, monthsShown)) setView(addMonths(startOfMonth(d), -(monthsShown - 1)));
  }

  function onKeyDown(e: KeyboardEvent) {
    const keys: Record<string, () => void> = {
      ArrowLeft: () => moveFocus(addDays(focusDay, -1)),
      ArrowRight: () => moveFocus(addDays(focusDay, 1)),
      ArrowUp: () => moveFocus(addDays(focusDay, -7)),
      ArrowDown: () => moveFocus(addDays(focusDay, 7)),
      PageUp: () => moveFocus(new Date(focusDay.getFullYear(), focusDay.getMonth() - 1, focusDay.getDate())),
      PageDown: () => moveFocus(new Date(focusDay.getFullYear(), focusDay.getMonth() + 1, focusDay.getDate())),
      Enter: () => select(focusDay),
      " ": () => select(focusDay),
    };
    if (keys[e.key]) {
      e.preventDefault();
      keys[e.key]();
    }
  }

  // Bereik dat oplicht: gekozen periode, of tijdens vertrek kiezen de periode tot de dag onder muis/focus
  const rangeEnd = leave ?? (choosingDeparture && hover && isValidDeparture(hover) ? hover : null);
  const focusVisible = focusDay >= view && focusDay < addMonths(view, monthsShown);
  const months = Array.from({ length: monthsShown }, (_, i) => addMonths(view, i));

  return (
    <div>
      <div className="flex items-center justify-between">
        <NavButton label="Vorige maand" disabled={view <= firstMonth} onClick={() => setView(addMonths(view, -1))}>
          <CaretLeft size={16} aria-hidden />
        </NavButton>
        <div className="grid flex-1 grid-cols-1 text-center md:grid-cols-2">
          {months.map((m) => (
            <p key={m.getTime()} aria-live="polite" className="text-sm font-medium first-letter:uppercase">
              {monthFmt.format(m)}
            </p>
          ))}
        </div>
        <NavButton
          label="Volgende maand"
          disabled={addMonths(view, monthsShown - 1) >= lastMonth}
          onClick={() => setView(addMonths(view, 1))}
        >
          <CaretRight size={16} aria-hidden />
        </NavButton>
      </div>

      <div ref={grid} onKeyDown={onKeyDown} onMouseLeave={() => setHover(null)} className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-2">
        {months.map((month) => (
          <div key={month.getTime()}>
            <div className="grid grid-cols-7 text-center text-xs text-forest-950/50" aria-hidden>
              {WEEKDAYS.map((d) => (
                <span key={d} className="pb-2">
                  {d}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-1">
              {monthCells(month).map((d, i) => {
                if (!d) return <span key={`blank-${i}`} />;
                const past = d < today;
                const selectable = !past && isSelectable(d);
                const isArrive = sameDay(d, arrive);
                const isLeave = sameDay(d, leave) || (!leave && sameDay(d, rangeEnd));
                const inRange = !!arrive && !!rangeEnd && d > arrive && d < rangeEnd;
                const booked = !past && isNightBooked(d) && !selectable;
                const isFocusTarget = focusVisible ? sameDay(d, focusDay) : d.getDate() === 1 && sameDay(month, view);
                const status = past
                  ? "voorbij"
                  : isArrive
                    ? "aankomst"
                    : sameDay(d, leave)
                      ? "vertrek"
                      : selectable
                        ? choosingDeparture && isValidDeparture(d)
                          ? "kies als vertrekdag"
                          : "kies als aankomstdag"
                        : booked
                          ? "bezet"
                          : "niet beschikbaar";

                // Band achter de dag: loopt door tussen aankomst en vertrek
                const band = inRange
                  ? "bg-forest-700/12"
                  : isArrive && rangeEnd
                    ? "bg-[linear-gradient(90deg,transparent_50%,rgb(52_80_61/0.12)_50%)]"
                    : isLeave && arrive
                      ? "bg-[linear-gradient(90deg,rgb(52_80_61/0.12)_50%,transparent_50%)]"
                      : "";

                return (
                  <div key={dayKey(d)} className={`flex justify-center ${band}`}>
                    <button
                      type="button"
                      data-day={dayKey(d)}
                      tabIndex={isFocusTarget ? 0 : -1}
                      aria-disabled={!selectable || undefined}
                      aria-pressed={isArrive || sameDay(d, leave)}
                      aria-label={`${longFmt.format(d)}, ${status}`}
                      onClick={() => select(d)}
                      onMouseEnter={() => setHover(d)}
                      onFocus={() => {
                        setFocusDay(d);
                        setHover(d);
                      }}
                      className={[
                        "grid size-11 place-items-center rounded-full text-sm tabular-nums transition-colors duration-150",
                        isArrive || isLeave
                          ? "bg-forest-950 font-medium text-bone"
                          : selectable
                            ? "cursor-pointer font-medium text-forest-950 hover:bg-forest-950/10"
                            : booked
                              ? "booked-hatch cursor-not-allowed text-forest-950/30"
                              : past
                                ? "cursor-not-allowed text-forest-950/20"
                                : "cursor-not-allowed text-forest-950/35",
                        sameDay(d, today) && !isArrive && !isLeave ? "ring-1 ring-forest-950/30 ring-inset" : "",
                      ].join(" ")}
                    >
                      {d.getDate()}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NavButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full transition-colors duration-150 hover:bg-forest-950/[0.07] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}
