import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Clock, Key, LockSimple, UsersThree, type Icon } from "@phosphor-icons/react";
import { PageHero } from "../components/page/PageHero";
import { SectionHeading } from "../components/page/SectionHeading";
import { OwnersSection as WellnessIntro } from "../components/home/OwnersSection";
import { asset } from "../lib/config";
import { useBooking } from "../lib/booking";
import { RATES, formatEuro } from "../lib/pricing";
import { Link, ROUTES } from "../lib/router";

const ease = [0.16, 1, 0.3, 1] as const;
const w = (name: string) => asset(`/foto/wellness/${name}.webp`);

// Stockfoto's als tijdelijke beelden: de wellness is nog in aanbouw. TODO: vervangen door de foto's van Marith.
const FACILITIES: Facility[] = [
  { title: "Sauna", text: "Warm hout, zacht licht en alle tijd om op te warmen.", image: w("sauna-warm"), alt: "Sauna met houten banken en warm licht" },
  { title: "Jacuzzi", text: "Ontspannen in het warme, bruisende water.", image: w("jacuzzi"), alt: "Jacuzzi met warm licht" },
  { title: "Turks stoombad", text: "Vochtige warmte die je helemaal laat ontspannen.", image: w("sauna-glas"), alt: "Stoomruimte met glazen deur" },
  // Staande foto met de douchekop bovenin: in de brede kaart de bovenkant tonen
  { title: "Regendouche", text: "Even afkoelen tussen de rondes door.", image: w("regendouche"), alt: "Regendouche naast de sauna", position: "50% 0%" },
];

export function WellnessPage() {
  return (
    <>
      <PageHero
        title={["Jouw eigen moment", "van ontspanning"]}
        intro="Privé wellness. Volledige rust. Alle tijd. Bij je verblijf of los te boeken."
        image={w("sauna-donker")}
        aside={
          <div className="border-t border-bone/20 pt-5 md:border-t-0 md:border-l md:pt-0 md:pl-8">
            <p className="text-[0.8125rem] text-bone/70">Vanaf</p>
            <p className="mt-1 font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-none font-light tracking-[-0.02em] tabular-nums">
              {formatEuro(RATES.wellnessPerStay)}
            </p>
            <p className="mt-1.5 text-[0.8125rem] text-bone/75">per tijdslot van 2,5 uur</p>
          </div>
        }
      />
      <WellnessIntro />
      <Facilities />
      <HowItWorks />
    </>
  );
}

/* In de wellness vind je: fotokaarten in dezelfde bento als de activiteiten op Omgeving */
function Facilities() {
  const reduce = useReducedMotion();
  const fadeUp = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.25 },
          transition: { duration: 0.9, ease, delay },
        };
  const [first, ...rest] = FACILITIES;
  return (
    <section aria-labelledby="faciliteiten-titel" className="relative isolate overflow-hidden px-[1.875rem] hl-sb md:px-12">
      <SectionHeading id="faciliteiten-titel" title="In de wellness vind je" text="Sauna, jacuzzi en Turks stoombad, helemaal voor jullie alleen." watermark="Wellness" />
      <div className="mt-12 grid grid-cols-1 gap-3 md:mt-14 md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-4">
        <motion.div {...fadeUp(0.08)} className="md:row-span-1">
          <FacilityCard item={first} large />
        </motion.div>
        {rest.map((item, i) => (
          <motion.div key={item.title} {...fadeUp(0.16 + i * 0.08)} className={i === 2 ? "md:col-span-3" : ""}>
            <FacilityCard item={item} wide={i === 2} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

type Facility = { title: string; text: string; image: string; alt: string; position?: string };

function FacilityCard({ item, large = false, wide = false }: { item: Facility; large?: boolean; wide?: boolean }) {
  return (
    <figure
      className={`relative isolate flex h-full flex-col justify-end overflow-hidden rounded-[20px] bg-forest-900 text-bone ${
        large ? "min-h-[420px] p-6 md:min-h-[520px] md:p-9" : wide ? "min-h-[260px] p-5 md:min-h-[300px] md:p-7" : "min-h-[260px] p-5 md:p-7"
      }`}
    >
      <img src={item.image} alt={item.alt} loading="lazy" decoding="async" style={{ objectPosition: item.position }} className="absolute inset-0 -z-10 size-full object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(12_20_15/0)_40%,rgb(12_20_15/0.8)_100%)]" />
      <figcaption>
        <span className={`block font-display font-medium tracking-[-0.03em] ${large ? "text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05]" : "text-xl"}`}>{item.title}</span>
        <span className="mt-2 block max-w-[44ch] text-sm leading-[1.6] text-bone/80">{item.text}</span>
      </figcaption>
    </figure>
  );
}

/* Zo werkt het: twee lichte panelen (zelfde opbouw als de routekaart op Omgeving) en een boekkaart */
function HowItWorks() {
  const { setWellness, goToBooking } = useBooking();
  // TODO: klantdata. Duur, prijs en werkwijze (toegangscode) van de wellness bevestigen.
  const points: { icon: Icon; title: string; text: string }[] = [
    { icon: LockSimple, title: "Helemaal privé", text: "Tijdens jullie tijdslot is de wellness alleen voor jullie. Geen drukte, geen andere gasten." },
    { icon: Key, title: "Onbemand", text: "Je krijgt vooraf alle informatie om zelf binnen te komen." },
    { icon: Clock, title: "Tweeënhalf uur", text: `Per tijdslot, ${formatEuro(RATES.wellnessPerStay)} voor het hele gezelschap.` },
    { icon: UsersThree, title: "Los of bij je verblijf", text: "Boek de wellness tijdens je verblijf, of kom alleen voor de wellness." },
  ];
  return (
    <section aria-labelledby="zo-werkt-het-titel" className="px-[1.875rem] hl-sb md:px-12">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] md:gap-4">
        <div className="rounded-[20px] border border-forest-950/8 bg-[var(--panel)] p-6 text-forest-950 md:p-9">
          <h2 id="zo-werkt-het-titel" className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.08] font-medium tracking-[-0.035em]">
            Privé en rustig
          </h2>
          <p className="mt-3 max-w-[48ch] text-sm leading-[1.65] text-forest-950/65">
            De wellness is een fijne aanvulling op je verblijf, maar is ook los te boeken. Even ontspannen na een wandeling of fietstocht, of gewoon omdat je er zin in hebt.
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
            {points.map((p) => (
              <li key={p.title} className="flex gap-4 border-t border-forest-950/8 py-4">
                <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-forest-700/12">
                  <p.icon size={18} />
                </span>
                <span>
                  <span className="block text-sm font-medium">{p.title}</span>
                  <span className="mt-0.5 block text-[0.8125rem] leading-[1.6] text-forest-950/60">{p.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-5 rounded-[20px] bg-forest-950 p-6 text-bone md:p-9">
          <div>
            <h3 className="font-display text-xl font-medium tracking-[-0.03em] md:text-2xl">Even helemaal ontspannen?</h3>
            <p className="mt-2 max-w-[40ch] text-[0.8125rem] leading-[1.6] text-bone/70">
              Kies je data en vink de privé wellness aan. Kom je alleen voor de wellness? Stuur dan een bericht, dan plannen we een tijdslot.
            </p>
          </div>
          <div className="mt-auto flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setWellness(true);
                goToBooking(1);
              }}
              className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-bone px-5 text-sm font-medium text-forest-950 transition-[transform,background-color] duration-200 hover:bg-white active:scale-[0.97]"
            >
              Bekijk de beschikbaarheid
              <ArrowRight size={16} aria-hidden />
            </button>
            <Link href={ROUTES.contact} className="inline-flex h-11 items-center justify-center rounded-xl border border-bone/30 px-5 text-sm font-medium text-bone transition-colors hover:border-bone">
              Alleen de wellness
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
