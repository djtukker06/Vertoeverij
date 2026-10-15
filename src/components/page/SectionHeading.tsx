import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

type Props = {
  id: string;
  /** Klein label boven de titel (elke sectie heeft er één, voor een vast ritme) */
  eyebrow?: string;
  title: string;
  text?: string;
  /**
   * center = eerste sectie onder de hero (gecentreerd, met watermerk).
   * left / right = kant van de titel; de intro staat ernaast aan de andere kant. Wissel per sectie af.
   */
  align?: "center" | "left" | "right";
  /** Groot, vaag woord achter de kop. Alleen bij de eerste sectie onder de hero. */
  watermark?: string;
  tone?: "light" | "dark";
  /** Optioneel element (knop of link), onder de intro */
  action?: ReactNode;
};

/**
 * Vaste sectiekop. Vanaf md staan titel en intro naast elkaar (titel links of rechts, afwisselend per sectie);
 * op mobiel onder elkaar. Alleen de eerste sectie is gecentreerd met een watermerk.
 */
export function SectionHeading({ id, eyebrow, title, text, align = "left", watermark, tone = "light", action }: Props) {
  const reduce = useReducedMotion();
  const dark = tone === "dark";
  const reveal = (delay = 0) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.6 }, transition: { duration: 0.9, ease, delay } };

  const label = eyebrow && <p className={`text-[0.8125rem] font-medium ${dark ? "text-bone/60" : "text-forest-700"}`}>{eyebrow}</p>;
  const h2 = (
    <h2
      id={id}
      className={`font-display text-[clamp(2.5rem,5vw,4.25rem)] leading-[1.04] font-medium tracking-[-0.035em] text-balance ${eyebrow ? "mt-3" : ""} ${
        dark ? "text-bone" : "text-forest-950"
      }`}
    >
      {title}
    </h2>
  );
  const intro = text && <p className={`max-w-[46ch] text-sm leading-[1.65] ${dark ? "text-bone/65" : "text-forest-950/65"}`}>{text}</p>;

  if (align === "center") {
    return (
      <div className="relative">
        {watermark && (
          <p
            aria-hidden
            className={`pointer-events-none absolute -top-12 left-1/2 -z-10 -translate-x-1/2 font-display text-[clamp(6rem,19vw,17rem)] leading-[0.8] font-semibold tracking-[-0.05em] whitespace-nowrap select-none md:-top-14 ${
              dark ? "text-bone/[0.045]" : "text-forest-950/[0.04]"
            }`}
          >
            {watermark}
          </p>
        )}
        <motion.div {...reveal()} className="mx-auto max-w-3xl text-center">
          {label}
          {h2}
          {intro && <div className="mt-4 flex justify-center">{intro}</div>}
          {action && <div className="mt-6 flex justify-center">{action}</div>}
        </motion.div>
      </div>
    );
  }

  const right = align === "right";
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-end md:gap-x-16">
      <motion.div {...reveal()} className={right ? "md:order-2 md:text-right" : ""}>
        {label}
        {h2}
      </motion.div>
      {(intro || action) && (
        <motion.div
          {...reveal(0.08)}
          className={`flex flex-col gap-6 md:pb-1.5 ${right ? "md:order-1 md:items-start" : "md:items-end"}`}
        >
          {intro}
          {action}
        </motion.div>
      )}
    </div>
  );
}
