import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { CaretDown, CaretLeft, CaretRight, type Icon } from "@phosphor-icons/react";
import { FieldShell, Popover, triggerClass, useDismiss } from "./shared";
import { WEEKDAYS, addDays, addMonths, dayKey, longFmt, monthCells, monthFmt, sameDay, startOfDay, startOfMonth } from "../../lib/dates";

const shortFmt = new Intl.DateTimeFormat("nl-NL", { weekday: "short", day: "numeric", month: "short" });

type Props = {
  label: string;
  icon: Icon;
  value: Date | null;
  onChange: (d: Date) => void;
  min: Date;
  /** Aankomstdatum, zodat de vertrekkalender de periode toont */
  rangeStart?: Date | null;
  /** Extra dagen die niet kiesbaar zijn (bijv. bezette nachten) */
  isUnavailable?: (d: Date) => boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
  popoverClass?: string;
};

// Dialog met maandraster. Pijltjes verplaatsen per dag/week, PageUp/PageDown per maand, Enter kiest, Escape sluit.
export function DatePicker({ label, icon, value, onChange, min, rangeStart, isUnavailable, open, onOpenChange, className, popoverClass = "" }: Props) {
  const id = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const [focusDay, setFocusDay] = useState<Date>(value ?? min);
  const [view, setView] = useState<Date>(startOfMonth(value ?? min));
  const today = startOfDay(new Date());

  const isBlocked = (d: Date) => d < min || !!isUnavailable?.(d);

  useDismiss(wrap, open, () => onOpenChange(false));

  useEffect(() => {
    if (!open) return;
    // Start op de gekozen dag, anders op de eerste kiesbare dag vanaf min
    let start = value && value >= min ? value : min;
    for (let i = 0; i < 120 && !value && isBlocked(start); i++) start = addDays(start, 1);
    setFocusDay(start);
    setView(startOfMonth(start));
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (open) grid.current?.querySelector<HTMLButtonElement>(`[data-day="${dayKey(focusDay)}"]`)?.focus();
  }, [open, focusDay, view]);

  function moveFocus(d: Date) {
    if (d < min) d = min;
    setFocusDay(d);
    setView(startOfMonth(d));
  }

  function select(d: Date) {
    if (isBlocked(d)) return;
    // Eerst sluiten en terugfocussen, dan pas de waarde: de ouder kan zo direct het volgende veld openen.
    trigger.current?.focus();
    onOpenChange(false);
    onChange(d);
  }

  function onGridKey(e: KeyboardEvent) {
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

  const cells = monthCells(view);
  const canGoBack = view > startOfMonth(min);

  return (
    <FieldShell ref={wrap} label={label} labelId={`${id}-label`} icon={icon} className={className}>
      <button
        ref={trigger}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${label}: ${value ? longFmt.format(value) : "nog niet gekozen"}`}
        onClick={() => onOpenChange(!open)}
        className={triggerClass}
      >
        <span className={value ? "" : "text-forest-950/60"}>{value ? shortFmt.format(value) : "Kies datum"}</span>
        <CaretDown size={14} aria-hidden className={`shrink-0 opacity-60 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <Popover open={open} className={`w-[19.5rem] p-3 ${popoverClass}`}>
        <div
          role="dialog"
          aria-label={`${label} kiezen`}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              trigger.current?.focus();
              onOpenChange(false);
            }
          }}
        >
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              aria-label="Vorige maand"
              disabled={!canGoBack}
              onClick={() => setView(addMonths(view, -1))}
              className="grid size-10 cursor-pointer place-items-center rounded-full transition-colors hover:bg-forest-950/[0.07] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <CaretLeft size={16} aria-hidden />
            </button>
            <p aria-live="polite" className="font-display text-base font-semibold tracking-[-0.01em] first-letter:uppercase">
              {monthFmt.format(view)}
            </p>
            <button
              type="button"
              aria-label="Volgende maand"
              onClick={() => setView(addMonths(view, 1))}
              className="grid size-10 cursor-pointer place-items-center rounded-full transition-colors hover:bg-forest-950/[0.07]"
            >
              <CaretRight size={16} aria-hidden />
            </button>
          </div>

          <div className="grid grid-cols-7 pb-1 text-center text-xs text-forest-950/55" aria-hidden>
            {WEEKDAYS.map((d) => (
              <span key={d} className="py-1">
                {d}
              </span>
            ))}
          </div>

          <div ref={grid} onKeyDown={onGridKey} className="grid grid-cols-7 gap-y-1">
            {cells.map((d, i) => {
              if (!d) return <span key={`blank-${i}`} />;
              const disabled = isBlocked(d);
              const selected = sameDay(d, value);
              const isStart = sameDay(d, rangeStart ?? null);
              const inRange = !!rangeStart && !!value && d > rangeStart && d < value;
              const isFocus = sameDay(d, focusDay) && view.getMonth() === focusDay.getMonth();
              return (
                <button
                  key={dayKey(d)}
                  type="button"
                  data-day={dayKey(d)}
                  tabIndex={isFocus ? 0 : -1}
                  aria-disabled={disabled || undefined}
                  aria-pressed={selected}
                  aria-label={`${longFmt.format(d)}${disabled && d >= min ? ", niet beschikbaar" : ""}`}
                  onClick={() => select(d)}
                  className={[
                    "mx-auto grid size-10 place-items-center rounded-full text-sm tabular-nums transition-colors duration-150",
                    disabled && "cursor-not-allowed text-forest-950/25",
                    !disabled && !selected && "cursor-pointer hover:bg-forest-950/[0.07]",
                    selected && "bg-forest-950 font-medium text-bone",
                    inRange && "bg-forest-950/[0.06]",
                    isStart && !selected && "ring-1 ring-forest-950/40",
                    sameDay(d, today) && !selected && "font-semibold text-forest-700",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      </Popover>
    </FieldShell>
  );
}
