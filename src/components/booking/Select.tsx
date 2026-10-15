import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { CaretDown, Check, type Icon } from "@phosphor-icons/react";
import { FieldShell, Popover, triggerClass, useDismiss } from "./shared";

export type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  label: string;
  icon: Icon;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
  popoverClass?: string;
};

// Listbox-patroon (WAI-ARIA): pijltjes, Home/End, Enter/Spatie kiest, Escape sluit.
export function Select<T extends string>({ label, icon, options, value, onChange, open, onOpenChange, className, popoverClass = "" }: Props<T>) {
  const id = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const current = options.find((o) => o.value === value);

  useDismiss(wrap, open, () => onOpenChange(false));

  useEffect(() => {
    if (!open) return;
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    list.current?.focus();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  function close() {
    trigger.current?.focus();
    onOpenChange(false);
  }

  function pick(i: number) {
    close();
    onChange(options[i].value);
  }

  function onListKey(e: KeyboardEvent) {
    const last = options.length - 1;
    const keys: Record<string, () => void> = {
      ArrowDown: () => setActive((a) => Math.min(last, a + 1)),
      ArrowUp: () => setActive((a) => Math.max(0, a - 1)),
      Home: () => setActive(0),
      End: () => setActive(last),
      Enter: () => pick(active),
      " ": () => pick(active),
      Escape: close,
    };
    if (keys[e.key]) {
      e.preventDefault();
      keys[e.key]();
    }
  }

  return (
    <FieldShell ref={wrap} label={label} labelId={`${id}-label`} icon={icon} className={className}>
      <button
        ref={trigger}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label ${id}-value`}
        onClick={() => onOpenChange(!open)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            onOpenChange(true);
          }
        }}
        className={triggerClass}
      >
        <span id={`${id}-value`} className="min-w-0 truncate">{current?.label}</span>
        <CaretDown size={14} aria-hidden className={`shrink-0 opacity-60 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <Popover open={open} className={`w-max min-w-[11rem] ${popoverClass}`}>
        <ul
          ref={list}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={`${id}-label`}
          aria-activedescendant={`${id}-opt-${active}`}
          onKeyDown={onListKey}
          className="flex flex-col gap-0.5 outline-none"
        >
          {options.map((o, i) => {
            const selected = o.value === value;
            return (
              <li
                key={o.value}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={selected}
                onPointerEnter={() => setActive(i)}
                onClick={() => pick(i)}
                className={`flex min-h-11 cursor-pointer items-center justify-between gap-6 rounded-xl px-3 text-sm transition-colors duration-150 ${i === active ? "bg-forest-950/[0.07]" : ""}`}
              >
                {o.label}
                {selected && <Check size={16} aria-hidden className="text-forest-700" />}
              </li>
            );
          })}
        </ul>
      </Popover>
    </FieldShell>
  );
}
