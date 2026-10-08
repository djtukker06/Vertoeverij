import { motion, useReducedMotion } from "motion/react";
import { PageHero } from "../components/page/PageHero";
import { asset } from "../lib/config";
import { CHECK_IN, CHECK_OUT } from "../lib/availability";

const ease = [0.16, 1, 0.3, 1] as const;

// Huisregels zoals aangeleverd (Booking.com). TODO: klantdata, eigen annuleringsvoorwaarden en betaalwijze voor directe boekingen.
const RULES: [string, string[]][] = [
  ["Inchecken", [`Van ${CHECK_IN} tot 00:00 uur.`, "Laat ons van tevoren weten hoe laat je aankomt."]],
  ["Uitchecken", [`Uiterlijk om ${CHECK_OUT} uur.`]],
  ["Annuleren en vooruitbetalen", ["De voorwaarden voor annuleren en vooruitbetalen hoor je bij de bevestiging van je boeking."]],
  [
    "Kinderen en bedden",
    ["Kinderen van alle leeftijden zijn welkom.", "Voor kinderen van 0 tot 3 jaar is op verzoek gratis een kinderbedje beschikbaar, zolang de voorraad strekt.", "Extra bedden zijn er niet."],
  ],
  ["Leeftijd", ["De minimumleeftijd om in te checken is 23 jaar."]],
  ["Huisdieren", ["Huisdieren zijn op verzoek toegestaan. Er kunnen extra kosten aan verbonden zijn."]],
  ["Roken", ["Roken is niet toegestaan."]],
  ["Feesten", ["Feesten en bijeenkomsten zijn niet toegestaan."]],
];

export function HouseRulesPage() {
  const reduce = useReducedMotion();
  return (
    <>
      <PageHero title={["Huisregels"]} intro="Zo blijft het voor iedereen rustig en prettig bij De Zandloper." image={asset("/foto/accommodatie/weiland-paarden.webp")} />
      <section aria-label="Huisregels" className="px-[1.875rem] hl-sy md:px-12">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease }}
          className="mx-auto max-w-4xl rounded-[20px] border border-forest-950/8 bg-[var(--panel)] p-6 text-forest-950 md:p-9"
        >
          <dl className="divide-y divide-forest-950/8">
            {RULES.map(([title, lines]) => (
              <div key={title} className="grid grid-cols-1 gap-2 py-5 first:pt-0 last:pb-0 md:grid-cols-[14rem_1fr] md:gap-8">
                <dt className="text-sm font-medium">{title}</dt>
                <dd className="flex flex-col gap-1.5 text-sm leading-[1.65] text-forest-950/70">
                  {lines.map((l) => (
                    <p key={l}>{l}</p>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </section>
    </>
  );
}
