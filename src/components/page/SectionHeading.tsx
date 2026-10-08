import { motion, useReducedMotion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

type Props = {
  id: string;
  title: string;
  text?: string;
  align?: "center" | "left";
  /** Groot, vaag woord achter de kop (statisch, klantwens). Maximaal één per pagina. */
  watermark?: string;
  tone?: "light" | "dark";
};

// Sectiekop in de huisstijl: font-display, 14px intro, optioneel stil woord erachter.
export function SectionHeading({ id, title, text, align = "center", watermark, tone = "light" }: Props) {
  const reduce = useReducedMotion();
  const center = align === "center";
  const ink = tone === "dark" ? "text-bone" : "text-forest-950";

  return (
    <div className="relative">
      {watermark && (
        <p
          aria-hidden
          className={`pointer-events-none absolute -top-12 left-1/2 -z-10 -translate-x-1/2 font-display text-[clamp(6rem,19vw,17rem)] leading-[0.8] font-semibold tracking-[-0.05em] whitespace-nowrap select-none md:-top-14 ${
            tone === "dark" ? "text-bone/[0.045]" : "text-forest-950/[0.04]"
          }`}
        >
          {watermark}
        </p>
      )}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, ease }}
        className={center ? "mx-auto max-w-2xl text-center" : "max-w-xl"}
      >
        <h2 id={id} className={`font-display text-[clamp(2rem,3.8vw,3.25rem)] leading-[1.08] font-medium tracking-[-0.035em] text-balance ${ink}`}>
          {title}
        </h2>
        {text && (
          <p
            className={`mt-4 max-w-[46ch] text-sm leading-[1.65] ${center ? "mx-auto" : ""} ${tone === "dark" ? "text-bone/65" : "text-forest-950/65"}`}
          >
            {text}
          </p>
        )}
      </motion.div>
    </div>
  );
}
