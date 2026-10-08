import { useId, useRef, useState, type KeyboardEvent } from "react";
import { asset } from "../lib/config";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ChatCircleText, Check, Plus } from "@phosphor-icons/react";
import { PageHero } from "../components/page/PageHero";
import { SectionHeading } from "../components/page/SectionHeading";
import { Stepper } from "../components/booking/Stepper";
import { RATES, formatEuro, lowestRate, quote } from "../lib/pricing";
import { MAX_GUESTS, MAX_PETS } from "../lib/booking";
import { MIN_NIGHTS, CHECK_IN, CHECK_OUT } from "../lib/availability";
import { addDays, startOfDay } from "../lib/dates";
import { Link, ROUTES } from "../lib/router";
import { TEXT } from "../lib/content";

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = (reduce: boolean | null, delay = 0) =>
  reduce
    ? {}
    : {
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.25 },
        transition: { duration: 0.9, ease, delay },
      };

// Uit de aangeleverde teksten (Booking.com). TODO: klantdata, inbegrepen voorzieningen bevestigen.
const INCLUDED = [
  "Twee slaapkamers, elk met eigen badkamer",
  "Volledig uitgeruste keuken",
  "Gratis wifi",
  "Gratis parkeren",
  "Eigen terras met buitenhaard en barbecue",
  "Kinderbedje op verzoek (0 tot 3 jaar)",
];

// Uit de huisregels van Booking.com. TODO: klantdata, betaling en annulering voor directe boekingen bevestigen.
const FAQ = [
  {
    q: "Wanneer betaal ik?",
    a: "Na je aanvraag bevestigen we je verblijf. De betaalwijze en de termijn hoor je bij de bevestiging.",
  },
  {
    q: "Wat als ik moet annuleren?",
    a: "De annuleringsvoorwaarden krijg je bij de bevestiging van je boeking. Neem bij twijfel gerust contact op.",
  },
  {
    q: "Kan ik de wellness los boeken?",
    a: `Ja. De privé wellness is bij je verblijf te boeken, maar ook zonder overnachting. Een tijdslot kost ${formatEuro(RATES.wellnessPerStay)}.`,
  },
  {
    q: "Hoe laat kan ik inchecken en uitchecken?",
    a: `Inchecken kan van ${CHECK_IN} tot 00:00 uur. Laat ons vooraf weten hoe laat je aankomt. Uitchecken doe je uiterlijk om ${CHECK_OUT} uur.`,
  },
  {
    q: "Mag ik mijn huisdier meenemen?",
    a: "Huisdieren zijn op verzoek toegestaan. Er kunnen extra kosten aan verbonden zijn. Geef het aan bij je aanvraag.",
  },
  {
    q: "Is er een minimumleeftijd?",
    a: "Ja, de minimumleeftijd om in te checken is 23 jaar. Roken en feesten zijn niet toegestaan.",
  },
];

export function PricesPage() {
  return (
    <>
      <PageHero
        title={["Wat een verblijf", "bij ons kost"]}
        intro="Eén prijs per nacht, plus schoonmaak en toeristenbelasting. De privé wellness boek je erbij of los."
        image={asset("/foto/accommodatie/slaapkamer-3.webp")}
        aside={
          <div className="border-t border-bone/20 pt-5 md:border-t-0 md:border-l md:pt-0 md:pl-8">
            <p className="text-[0.8125rem] text-bone/70">Vanaf</p>
            <p className="mt-1 font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-none font-light tracking-[-0.02em] tabular-nums">
              {formatEuro(lowestRate)}
            </p>
            <p className="mt-1.5 text-[0.8125rem] text-bone/75">per nacht</p>
          </div>
        }
      />
      <Rates />
      <Costs />
      <Questions />
    </>
  );
}

function Rates() {
  const reduce = useReducedMotion();
  const rates = [
    { label: "Doordeweeks", value: RATES.weekday, note: "Zondag- tot en met donderdagnacht" },
    { label: "Weekend", value: RATES.weekend, note: "Vrijdag- en zaterdagnacht" },
  ];
  return (
    <section aria-labelledby="tarieven-titel" className="relative isolate overflow-hidden px-[1.875rem] hl-sy md:px-12">
      <SectionHeading
        id="tarieven-titel"
        title="Prijs per nacht"
        text="De prijs hangt af van de nacht waarin je slaapt. Een weekend combineert dus meerdere tarieven."
        watermark="Tarieven"
      />
      <ul className="mt-10 grid grid-cols-1 gap-3 md:mt-12 md:grid-cols-3 md:gap-4">
        {rates.map((r, i) => (
          <motion.li
            key={r.label}
            {...fadeUp(reduce, 0.05 + i * 0.08)}
            className="flex min-h-[17rem] flex-col rounded-[20px] border border-forest-950/8 bg-[var(--panel)] p-6 text-forest-950 md:min-h-[20rem] md:p-8"
          >
            <RateBody label={r.label} value={r.value} note={r.note} />
          </motion.li>
        ))}
        {/* Zomertarief als fotokaart: het duurste tarief krijgt het seizoen erbij in beeld */}
        <motion.li
          {...fadeUp(reduce, 0.21)}
          className="relative isolate flex min-h-[17rem] flex-col overflow-hidden rounded-[20px] bg-forest-950 p-6 text-bone md:min-h-[20rem] md:p-8"
        >
          <img
            src={asset("/foto/accommodatie/terras.webp")}
            alt=""
            loading="lazy"
            decoding="async"
            width={900}
            height={672}
            className="absolute inset-0 -z-10 size-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(12_20_15/0.6)_0%,rgb(12_20_15/0.35)_35%,rgb(12_20_15/0.8)_100%)]" />
          <RateBody label="Zomer" value={RATES.highSeason} note="Elke nacht in juli en augustus" dark />
        </motion.li>
      </ul>
      <p className="mt-5 text-center text-[0.8125rem] text-forest-950/55">
        {MIN_NIGHTS > 1 ? `Minimaal ${MIN_NIGHTS} nachten. ` : ""}Prijzen voor het hele appartement, tot {MAX_GUESTS} personen.
      </p>
    </section>
  );
}

function RateBody({ label, value, note, dark = false }: { label: string; value: number; note: string; dark?: boolean }) {
  return (
    <>
      <h3 className={`text-sm font-medium ${dark ? "text-bone/85" : "text-forest-950/70"}`}>{label}</h3>
      <p className="mt-auto pt-10 font-display text-[clamp(2.5rem,5vw,3.75rem)] leading-none font-light tracking-[-0.04em] tabular-nums">
        {formatEuro(value)}
      </p>
      <p className={`mt-1 text-[0.8125rem] ${dark ? "text-bone/70" : "text-forest-950/55"}`}>per nacht</p>
      <p className={`mt-6 border-t pt-4 text-[0.8125rem] ${dark ? "border-bone/20 text-bone/80" : "border-forest-950/8 text-forest-950/65"}`}>{note}</p>
    </>
  );
}

function Costs() {
  const reduce = useReducedMotion();
  const costs = [
    { label: "Schoonmaak", value: formatEuro(RATES.cleaning), note: "per verblijf" },
    { label: "Toeristenbelasting", value: formatEuro(RATES.touristTaxPerPersonNight), note: "per persoon per nacht" },
    { label: "Privé wellness", value: formatEuro(RATES.wellnessPerStay), note: "per tijdslot van 2,5 uur, bij je verblijf of los" },
    { label: "Huisdier", value: formatEuro(RATES.petPerStay), note: `op verzoek, per verblijf, maximaal ${MAX_PETS}` },
  ];
  return (
    <section aria-label="Bijkomende kosten en inbegrepen" className="px-[1.875rem] hl-sb md:px-12">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        <motion.div {...fadeUp(reduce, 0.05)} className="rounded-[20px] border border-forest-950/8 bg-[var(--panel)] p-6 text-forest-950 md:p-9">
          <h2 className="font-display text-xl font-medium tracking-[-0.03em] md:text-2xl">Bijkomende kosten</h2>
          <dl className="mt-5 divide-y divide-forest-950/8">
            {costs.map((c) => (
              <div key={c.label} className="flex items-baseline justify-between gap-6 py-4 first:pt-0 last:pb-0">
                <dt>
                  <span className="block text-sm font-medium">{c.label}</span>
                  <span className="block text-[0.8125rem] text-forest-950/55">{c.note}</span>
                </dt>
                <dd className="font-display text-xl font-light tracking-[-0.02em] tabular-nums">{c.value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div {...fadeUp(reduce, 0.12)} className="rounded-[20px] bg-forest-950 p-6 text-bone md:p-9">
          <h2 className="font-display text-xl font-medium tracking-[-0.03em] md:text-2xl">Altijd inbegrepen</h2>
          <ul className="mt-5 flex flex-col gap-3.5">
            {INCLUDED.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-[1.5]">
                <span aria-hidden className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-bone/12">
                  <Check size={12} weight="bold" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

/** Eerstvolgende maandag vanaf een datum, eventueel binnen of buiten juli en augustus. */
function sampleMonday(summer: boolean) {
  let d = startOfDay(new Date());
  for (let i = 0; i < 400; i++) {
    const month = d.getMonth();
    const isSummer = month === 6 || month === 7;
    if (d.getDay() === 1 && isSummer === summer) return d;
    d = addDays(d, 1);
  }
  return d;
}

/** Rekenhulp. Niet meer op de Prijzen-pagina (klantwens); alleen nog als eiland in het WordPress-theme tot dat is bijgewerkt. */
export function Calculator() {
  const reduce = useReducedMotion();
  const [summer, setSummer] = useState(false);
  const [nights, setNights] = useState(7);
  const [guests, setGuests] = useState(4);
  const [pets, setPets] = useState(0);

  const arrive = sampleMonday(summer);
  const q = quote(arrive, addDays(arrive, nights), guests, pets);

  return (
    <section aria-labelledby="rekenhulp-titel" className="px-[1.875rem] hl-sb md:px-12">
      <motion.div
        {...fadeUp(reduce)}
        className="grid grid-cols-1 overflow-hidden rounded-[20px] border border-forest-950/8 bg-[var(--panel)] text-forest-950 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
      >
        <div className="p-6 md:p-9">
          <h2 id="rekenhulp-titel" className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.08] font-medium tracking-[-0.035em]">
            {TEXT.calculatorTitle}
          </h2>
          <p className="mt-3 max-w-[44ch] text-sm leading-[1.65] text-forest-950/65">
            {TEXT.calculatorIntro}
          </p>

          <div className="mt-6">
            <p id="periode-label" className="text-[0.8125rem] font-medium">
              Periode
            </p>
            <Segmented
              labelledBy="periode-label"
              options={[
                { value: false, label: "Buiten de zomer" },
                { value: true, label: "Juli en augustus" },
              ]}
              value={summer}
              onChange={setSummer}
            />
          </div>

          <div className="mt-4 divide-y divide-forest-950/8">
            <Stepper label="Nachten" hint={`Minimaal ${MIN_NIGHTS}`} value={nights} min={MIN_NIGHTS} max={21} onChange={setNights} />
            <Stepper
              label="Gasten"
              hint="Volwassenen en kinderen samen"
              value={guests}
              min={1}
              max={MAX_GUESTS}
              maxReason={`Maximaal ${MAX_GUESTS} gasten`}
              onChange={setGuests}
            />
            <Stepper label="Honden" hint={`${formatEuro(RATES.petPerStay)} per hond`} value={pets} min={0} max={MAX_PETS} onChange={setPets} />
          </div>
        </div>

        <div className="flex flex-col bg-forest-950 p-6 text-bone md:p-9">
          <p className="text-[0.8125rem] text-bone/70">Indicatie voor {nights} nachten</p>
          <p aria-live="polite" className="mt-2 font-display text-[clamp(2.75rem,5vw,4rem)] leading-none font-light tracking-[-0.04em] tabular-nums">
            {formatEuro(q.total)}
          </p>
          <dl className="mt-8 flex flex-col gap-2.5 border-t border-bone/15 pt-5 text-sm">
            <Row label={`Verblijf, ${nights} nachten`} value={q.lodging} />
            <Row label="Schoonmaak" value={q.cleaning} />
            <Row label="Toeristenbelasting" value={q.touristTax} />
            {q.pets > 0 && <Row label={pets === 1 ? "1 hond" : `${pets} honden`} value={q.pets} />}
          </dl>
          <Link
            href={`${ROUTES.availability}#boeken`}
            className="mt-auto inline-flex h-12 items-center justify-center gap-2 self-start rounded-xl bg-bone px-6 text-sm font-medium text-forest-950 transition-[transform,background-color] duration-200 hover:bg-white active:scale-[0.97] max-lg:mt-8"
          >
            {TEXT.calculatorCta}
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-bone/70">{label}</dt>
      <dd className="tabular-nums">{formatEuro(value)}</dd>
    </div>
  );
}

/** Segmented control als radiogroep: klikken of pijltjestoetsen. */
function Segmented<T>({
  labelledBy,
  options,
  value,
  onChange,
}: {
  labelledBy: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = options.findIndex((o) => o.value === value);

  function onKeyDown(e: KeyboardEvent) {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault();
    const dir = e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 1;
    const next = (current + dir + options.length) % options.length;
    onChange(options[next].value);
    refs.current[next]?.focus();
  }

  return (
    <div role="radiogroup" aria-labelledby={labelledBy} onKeyDown={onKeyDown} className="mt-2 inline-grid grid-cols-2 rounded-xl bg-forest-950/[0.06] p-1">
      {options.map((o, i) => {
        const checked = i === current;
        return (
          <button
            key={o.label}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            onClick={() => onChange(o.value)}
            className={`h-10 cursor-pointer rounded-lg px-4 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
              checked ? "bg-forest-950 text-bone" : "text-forest-950/70 hover:text-forest-950"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Questions() {
  const id = useId();
  return (
    <section aria-labelledby={`${id}-titel`} className="px-[1.875rem] hl-sb md:px-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionHeading id={`${id}-titel`} title="Goed om te weten" text="De vragen die we het vaakst krijgen over betalen, de wellness en de huisregels." align="left" />
          <div className="flex flex-col gap-4 rounded-[20px] bg-forest-950 p-6 text-bone max-lg:order-last md:p-7 lg:max-w-sm">
            <div className="flex items-start gap-3">
              <ChatCircleText size={24} aria-hidden className="mt-0.5 shrink-0 text-bone/80" />
              <div>
                <h3 className="font-display text-xl font-medium tracking-[-0.03em]">Staat je vraag er niet bij?</h3>
                <p className="mt-1.5 text-[0.8125rem] leading-[1.6] text-bone/70">Stuur een bericht, dan krijg je antwoord van de eigenaar.</p>
              </div>
            </div>
            <Link
              href={ROUTES.contact}
              className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-bone px-5 text-sm font-medium text-forest-950 transition-[transform,background-color] duration-200 hover:bg-white active:scale-[0.97]"
            >
              Stel je vraag
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {FAQ.map((item) => (
            <details key={item.q} className="group rounded-[20px] border border-forest-950/8 bg-[var(--panel)] text-forest-950 open:border-forest-950/15">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-5 md:px-7 [&::-webkit-details-marker]:hidden">
                <span className="text-sm font-medium md:text-[0.9375rem]">{item.q}</span>
                <span
                  aria-hidden
                  className="grid size-9 shrink-0 place-items-center rounded-full border border-forest-950/15 transition-transform duration-300 group-open:rotate-45"
                >
                  <Plus size={16} />
                </span>
              </summary>
              <p className="max-w-[60ch] px-5 pb-5 text-sm leading-[1.65] text-forest-950/70 md:px-7 md:pb-6">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
