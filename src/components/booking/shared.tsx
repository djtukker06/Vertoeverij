import { useEffect, type ReactNode, type Ref, type RefObject } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Icon } from "@phosphor-icons/react";

const ease = [0.16, 1, 0.3, 1] as const;

export const triggerClass =
  "flex h-12 w-full cursor-pointer items-center justify-between gap-1.5 rounded-xl bg-forest-950/[0.06] px-3 text-left text-sm whitespace-nowrap sm:gap-2 sm:px-4 text-forest-950 transition-colors duration-200 hover:bg-forest-950/10 aria-expanded:bg-forest-950/10";

// Sluit bij klik of focus buiten het veld (Tab weg, ander veld aanklikken).
export function useDismiss(ref: RefObject<HTMLElement | null>, open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: Event) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    document.addEventListener("pointerdown", handler);
    document.addEventListener("focusin", handler);
    return () => {
      document.removeEventListener("pointerdown", handler);
      document.removeEventListener("focusin", handler);
    };
  }, [open, onClose, ref]);
}

export function FieldShell({
  label,
  labelId,
  icon: FieldIcon,
  ref,
  className = "",
  children,
}: {
  label: string;
  labelId: string;
  icon: Icon;
  ref: Ref<HTMLDivElement>;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div ref={ref} className={`relative flex flex-col gap-2 ${className}`}>
      <span id={labelId} className="flex items-center gap-1.5 text-[0.8125rem] font-medium text-forest-950">
        <FieldIcon size={16} aria-hidden className="text-forest-700" />
        {label}
      </span>
      {children}
    </div>
  );
}

// Opent naar boven: het boekingspaneel staat onderaan de hero.
export function Popover({ open, className = "", children }: { open: boolean; className?: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.22, ease } }}
          exit={{ opacity: 0, y: reduce ? 0 : 4, transition: { duration: 0.14 } }}
          className={`absolute bottom-full z-20 mb-2 origin-bottom rounded-2xl border border-forest-950/10 bg-[var(--panel)] p-2 text-forest-950 shadow-[0_24px_60px_rgb(16_28_20/0.28)] ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Formuliervelden (boekingsgegevens en contactformulier) ---------- */

export const inputClass = (invalid: boolean) =>
  `block h-12 w-full rounded-xl border bg-white px-4 text-sm text-forest-950 outline-none transition-colors duration-150 placeholder:text-forest-950/40 focus:border-forest-950 ${
    invalid ? "border-[#9b3b24]" : "border-forest-950/15 hover:border-forest-950/30"
  }`;

export function Field({
  id,
  label,
  error,
  optional = false,
  className = "",
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[0.8125rem] font-medium">
        {label}
        {optional && <span className="font-normal text-forest-950/50"> (optioneel)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-[0.8125rem] text-[#9b3b24]">
          {error}
        </p>
      )}
    </div>
  );
}
