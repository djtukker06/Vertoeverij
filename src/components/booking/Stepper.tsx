import { useId } from "react";
import { Minus, Plus } from "@phosphor-icons/react";

type Props = {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  /** Uitleg waarom + niet verder kan (bijv. maximale bezetting) */
  maxReason?: string;
};

export function Stepper({ label, hint, value, min, max, onChange, maxReason }: Props) {
  const id = useId();
  const atMax = value >= max;

  return (
    <div role="group" aria-labelledby={`${id}-label`} className="flex items-center justify-between gap-4 py-4">
      <div>
        <p id={`${id}-label`} className="text-sm font-medium">
          {label}
        </p>
        <p className="mt-0.5 text-[0.8125rem] text-forest-950/55">{atMax && maxReason ? maxReason : hint}</p>
      </div>
      <div className="flex items-center gap-3">
        <StepButton label={`Minder ${label.toLowerCase()}`} disabled={value <= min} onClick={() => onChange(value - 1)}>
          <Minus size={16} aria-hidden />
        </StepButton>
        <output aria-live="polite" aria-label={`${value} ${label.toLowerCase()}`} className="w-6 text-center text-base font-medium tabular-nums">
          {value}
        </output>
        <StepButton label={`Meer ${label.toLowerCase()}`} disabled={atMax} onClick={() => onChange(value + 1)}>
          <Plus size={16} aria-hidden />
        </StepButton>
      </div>
    </div>
  );
}

function StepButton({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-11 cursor-pointer place-items-center rounded-full border border-forest-950/20 transition-[background-color,border-color,transform] duration-150 hover:border-forest-950 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-forest-950/20 disabled:active:scale-100"
    >
      {children}
    </button>
  );
}
