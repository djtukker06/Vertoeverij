import { useId, useRef, useState, type FormEvent, type ReactNode, type RefObject } from "react";
import { Field, inputClass } from "./booking/shared";
import { asset } from "../lib/config";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CalendarBlank, Check, CheckCircle, IdentificationCard, UsersThree, type Icon } from "@phosphor-icons/react";
import { RangeCalendar } from "./booking/RangeCalendar";
import { Stepper } from "./booking/Stepper";
import { BOOKING_SECTION_ID, MAX_GUESTS, MAX_PETS, useBooking, type BookingStep } from "../lib/booking";
import { CHECK_IN, CHECK_OUT, MIN_NIGHTS, latestDeparture } from "../lib/availability";
import { RATES, formatEuro, lowestRate, quote, type Quote } from "../lib/pricing";
import { BRAND_NAME } from "./Logo";
import { scrollToElement, scrollToId } from "../lib/scroll";
import { TEXT } from "../lib/content";
import { ROUTES } from "../lib/router";
import { submitBookingRequest } from "../lib/bookingApi";

const toIso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const ease = [0.16, 1, 0.3, 1] as const;
const dayFmt = new Intl.DateTimeFormat("nl-NL", { weekday: "short", day: "numeric", month: "short" });

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const guestsLabel = (adults: number, children: number) =>
  [plural(adults, "volwassene", "volwassenen"), children > 0 ? plural(children, "kind", "kinderen") : null].filter(Boolean).join(", ");
const petsLabel = (pets: number) => (pets === 0 ? "Geen huisdieren" : plural(pets, "huisdier", "huisdieren"));

type Details = { name: string; email: string; phone: string; note: string; agree: boolean };
type DetailErrors = Partial<Record<"name" | "email" | "phone" | "agree", string>>;

function validate(d: Details): DetailErrors {
  const errors: DetailErrors = {};
  if (d.name.trim().length < 2) errors.name = "Vul je naam in.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) errors.email = "Vul een geldig e-mailadres in, bijvoorbeeld naam@voorbeeld.nl.";
  if (d.phone.replace(/[^\d]/g, "").length < 9) errors.phone = "Vul je telefoonnummer in, zodat de eigenaar je kan bereiken.";
  if (!d.agree) errors.agree = "Ga akkoord met de huisregels om je aanvraag te versturen.";
  return errors;
}

export function BookingSection() {
  const reduce = useReducedMotion();
  const { arrive, leave, adults, children, pets, wellness, step, setArrive, setLeave, setAdults, setChildren, setPets, setWellness, setStep } = useBooking();
  const [details, setDetails] = useState<Details>({ name: "", email: "", phone: "", note: "", agree: false });
  const [errors, setErrors] = useState<DetailErrors>({});
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [sent, setSent] = useState<{ name: string; email: string } | null>(null);

  const panels = { 1: useRef<HTMLElement>(null), 2: useRef<HTMLElement>(null), 3: useRef<HTMLElement>(null) };
  const datesDone = !!arrive && !!leave;
  // Stap 2 en 3 kunnen pas als de data compleet zijn (ook als de stap van buitenaf gezet wordt)
  const activeStep: BookingStep = datesDone ? step : 1;
  const q = datesDone ? quote(arrive, leave, adults + children, pets, wellness) : null;

  // Stap waar we naartoe scrollen zodra het openklappen klaar is.
  // Eerder scrollen gaat mis: de vorige stap klapt dan nog in en alles schuift daarna honderden pixels omhoog.
  const pendingScroll = useRef<BookingStep | null>(null);

  function goTo(next: BookingStep) {
    pendingScroll.current = next;
    setStep(next);
    // Vangnet als de animatie geen "klaar" meldt (onderbroken, tabblad op de achtergrond): na de animatieduur alsnog
    window.setTimeout(() => onPanelOpened(next), 450);
  }

  function onPanelOpened(n: BookingStep) {
    if (pendingScroll.current !== n) return;
    pendingScroll.current = null;
    // Eén frame wachten tot de ingeklapte stap echt uit de layout is
    window.setTimeout(() => scrollToElement(panels[n].current, 24), 20);
  }

  function stateOf(n: BookingStep): PanelState {
    if (n === activeStep) return "active";
    if (n === 1) return datesDone ? "done" : "upcoming";
    if (n === 2) return datesDone && activeStep === 3 ? "done" : "upcoming";
    return "upcoming";
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate(details);
    setErrors(found);
    const firstInvalid = (["name", "email", "phone", "agree"] as const).find((k) => found[k]);
    if (firstInvalid) {
      (e.currentTarget.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }
    setSending(true);
    setSendError("");
    try {
      await submitBookingRequest({
        arrive: toIso(arrive!),
        leave: toIso(leave!),
        adults,
        children,
        pets,
        wellness,
        name: details.name.trim(),
        email: details.email.trim(),
        phone: details.phone.trim(),
        note: details.note.trim(),
        total: q?.total ?? 0,
      });
    } catch {
      setSending(false);
      setSendError(TEXT.bookingError);
      return;
    }
    setSending(false);
    setSent({ name: details.name.trim().split(/\s+/)[0], email: details.email.trim() });
    window.setTimeout(() => scrollToId(BOOKING_SECTION_ID), 30);
  }

  function startOver() {
    setSent(null);
    setArrive(null);
    setLeave(null);
    setDetails((d) => ({ ...d, note: "", agree: false }));
    setStep(1);
  }

  return (
    <section
      id={BOOKING_SECTION_ID}
      aria-labelledby="boeken-titel"
      className="scroll-mt-[var(--hl-section-y)] px-[1.875rem] hl-sb text-forest-950 md:px-12"
    >
      <div className="max-w-xl">
        <h2 id="boeken-titel" className="font-display text-[clamp(2rem,3.8vw,3.25rem)] leading-[1.08] font-medium tracking-[-0.035em]">
          {TEXT.bookingTitle}
        </h2>
        <p className="mt-4 max-w-[46ch] text-sm leading-[1.65] text-forest-950/65">
          {TEXT.bookingIntro}
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 md:mt-12 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-start lg:gap-6">
        <div className="flex flex-col gap-3">
          {sent ? (
            <Confirmation name={sent.name} email={sent.email} onStartOver={startOver} />
          ) : (
            <>
              <Panel
                panelRef={panels[1]}
                icon={CalendarBlank}
                title="Wanneer kom je?"
                state={stateOf(1)}
                summary={datesDone ? `${dayFmt.format(arrive)} tot ${dayFmt.format(leave)}, ${plural(q!.nights, "nacht", "nachten")}` : undefined}
                onEdit={() => goTo(1)}
                onOpened={() => onPanelOpened(1)}
              >
                <DatesStep
                  arrive={arrive}
                  leave={leave}
                  onChange={(a, l) => {
                    setArrive(a);
                    setLeave(l);
                  }}
                  footer={
                    <StepFooter q={q} label="Verder" disabled={!datesDone} disabledHint="Kies eerst je aankomst- en vertrekdag" onClick={() => goTo(2)} />
                  }
                />
              </Panel>

              <Panel
                panelRef={panels[2]}
                icon={UsersThree}
                title="Met wie kom je?"
                state={stateOf(2)}
                summary={[guestsLabel(adults, children), petsLabel(pets).toLowerCase(), wellness ? "met privé wellness" : null].filter(Boolean).join(", ")}
                onEdit={() => goTo(2)}
                onOpened={() => onPanelOpened(2)}
              >
                <div className="divide-y divide-forest-950/8">
                  <Stepper
                    label="Volwassenen"
                    hint="18 jaar en ouder"
                    value={adults}
                    min={1}
                    max={MAX_GUESTS - children}
                    maxReason={`Het appartement is geschikt voor maximaal ${MAX_GUESTS} personen`}
                    onChange={setAdults}
                  />
                  <Stepper
                    label="Kinderen"
                    hint="Tot 18 jaar"
                    value={children}
                    min={0}
                    max={MAX_GUESTS - adults}
                    maxReason={`Het appartement is geschikt voor maximaal ${MAX_GUESTS} personen`}
                    onChange={setChildren}
                  />
                  <Stepper
                    label="Huisdieren"
                    hint={`Op verzoek, ${formatEuro(RATES.petPerStay)} per verblijf`}
                    value={pets}
                    min={0}
                    max={MAX_PETS}
                    maxReason={`Maximaal ${MAX_PETS} huisdier`}
                    onChange={setPets}
                  />
                  {/* Privé wellness bij het verblijf (brandbook: samen of los te boeken) */}
                  <label className="flex cursor-pointer items-center justify-between gap-4 py-4">
                    <span>
                      <span className="block text-sm font-medium">Privé wellness erbij</span>
                      <span className="mt-0.5 block text-[0.8125rem] text-forest-950/55">
                        Sauna, jacuzzi en stoombad, {formatEuro(RATES.wellnessPerStay)} per tijdslot. Tijd kiezen we samen met je.
                      </span>
                    </span>
                    <input type="checkbox" checked={wellness} onChange={(e) => setWellness(e.target.checked)} className="size-5 shrink-0 cursor-pointer accent-forest-950" />
                  </label>
                </div>
                <StepFooter q={q} label="Verder" onClick={() => goTo(3)} />
              </Panel>

              <Panel
                panelRef={panels[3]}
                icon={IdentificationCard}
                title="Je gegevens"
                state={stateOf(3)}
                onEdit={() => goTo(3)}
                onOpened={() => onPanelOpened(3)}
              >
                <DetailsForm
                  details={details}
                  errors={errors}
                  sending={sending}
                  sendError={sendError}
                  q={q}
                  onChange={(patch) => {
                    setDetails((d) => ({ ...d, ...patch }));
                    // Fout verdwijnt zodra het veld klopt
                    setErrors((prev) => {
                      const next = { ...prev };
                      for (const key of Object.keys(patch) as (keyof DetailErrors)[]) {
                        if (prev[key] && !validate({ ...details, ...patch })[key]) delete next[key];
                      }
                      return next;
                    });
                  }}
                  onBlurField={(key) => {
                    const err = validate(details)[key];
                    // Pas melden na verlaten van een ingevuld veld, niet bij het eerste tabben
                    if (err && (details[key] as string | boolean)) setErrors((prev) => ({ ...prev, [key]: err }));
                  }}
                  onSubmit={onSubmit}
                />
              </Panel>
            </>
          )}
        </div>

        <Summary arrive={arrive} leave={leave} adults={adults} children={children} pets={pets} wellness={wellness} q={q} />
      </div>
    </section>
  );
}

/* ---------- Stappen ---------- */

type PanelState = "active" | "done" | "upcoming";

function Panel({
  panelRef,
  icon: PanelIcon,
  title,
  state,
  summary,
  onEdit,
  onOpened,
  children,
}: {
  panelRef: RefObject<HTMLElement | null>;
  icon: Icon;
  title: string;
  state: PanelState;
  summary?: string;
  onEdit: () => void;
  /** Wordt aangeroepen als het openklappen klaar is */
  onOpened: () => void;
  children: ReactNode;
}) {
  const id = useId();
  const reduce = useReducedMotion();
  return (
    <section
      ref={panelRef}
      aria-labelledby={`${id}-title`}
      className={`scroll-mt-6 rounded-[20px] border bg-[var(--panel)] transition-colors duration-300 ${
        state === "active" ? "border-forest-950/15 shadow-[0_18px_50px_rgb(16_28_20/0.07)]" : "border-forest-950/8"
      }`}
    >
      <div className="flex items-center gap-4 p-5 md:px-7 md:py-6">
        <span
          aria-hidden
          className={`grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-300 ${
            state === "done" ? "bg-forest-950 text-bone" : state === "active" ? "bg-forest-700/12 text-forest-950" : "bg-forest-950/[0.05] text-forest-950/35"
          }`}
        >
          {state === "done" ? <Check size={18} weight="bold" /> : <PanelIcon size={20} />}
        </span>
        <div className="min-w-0 flex-1">
          <h3
            id={`${id}-title`}
            className={`font-display text-lg font-medium tracking-[-0.03em] md:text-xl ${state === "upcoming" ? "text-forest-950/40" : ""}`}
          >
            {title}
          </h3>
          {state === "done" && summary && <p className="mt-0.5 truncate text-[0.8125rem] text-forest-950/60">{summary}</p>}
        </div>
        {state === "done" && (
          <button
            type="button"
            onClick={onEdit}
            aria-label={`${title} wijzigen`}
            className="shrink-0 cursor-pointer rounded-full px-3 py-2 text-sm font-medium underline decoration-forest-950/25 underline-offset-4 transition-colors hover:decoration-forest-950"
          >
            Wijzig
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {state === "active" && (
          <motion.div
            key="content"
            initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, height: "auto" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease }}
            // Alleen het openen telt (animate-doel heeft opacity 1), niet het inklappen
            onAnimationComplete={(definition) => {
              if ((definition as { opacity?: number }).opacity === 1) onOpened();
            }}
            className="overflow-hidden"
          >
            <div className="border-t border-forest-950/8 px-5 pt-4 pb-5 md:px-7 md:pb-7">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function DatesStep({
  arrive,
  leave,
  onChange,
  footer,
}: {
  arrive: Date | null;
  leave: Date | null;
  onChange: (arrive: Date | null, leave: Date | null) => void;
  footer: ReactNode;
}) {
  const lastDeparture = arrive && !leave ? latestDeparture(arrive) : null;
  const message = !arrive
    ? `Kies je aankomstdag. Je blijft minimaal ${MIN_NIGHTS} nachten.`
    : !leave
      ? `Kies je vertrekdag, uiterlijk ${dayFmt.format(lastDeparture!)}.`
      : `${dayFmt.format(arrive)} tot ${dayFmt.format(leave)}`;

  return (
    <div>
      <div className="mb-4 flex min-h-10 flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <p aria-live="polite" className="text-sm text-forest-950/70">
          {message}
        </p>
        {arrive && (
          <button
            type="button"
            onClick={() => onChange(null, null)}
            className="cursor-pointer rounded-full py-2 text-sm font-medium underline decoration-forest-950/25 underline-offset-4 hover:decoration-forest-950"
          >
            Data wissen
          </button>
        )}
      </div>
      <RangeCalendar arrive={arrive} leave={leave} onChange={onChange} />
      <div className="mt-4 flex items-center gap-4 text-[0.8125rem] text-forest-950/60">
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="booked-hatch size-3.5 rounded" />
          Bezet
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="size-3.5 rounded-full ring-1 ring-forest-950/30 ring-inset" />
          Vandaag
        </span>
      </div>
      {footer}
    </div>
  );
}

function StepFooter({
  q,
  label,
  disabled = false,
  disabledHint,
  onClick,
}: {
  q: Quote | null;
  label: string;
  disabled?: boolean;
  disabledHint?: string;
  onClick: () => void;
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-forest-950/8 pt-5">
      {/* Op kleine schermen staat het overzicht onder de stappen: totaal hier herhalen */}
      <p className="text-sm lg:invisible">
        {q ? (
          <>
            <span className="text-forest-950/60">Totaal </span>
            <span className="font-semibold">{formatEuro(q.total)}</span>
          </>
        ) : (
          <span className="text-forest-950/60">{disabledHint}</span>
        )}
      </p>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="inline-flex h-12 cursor-pointer items-center justify-center rounded-xl bg-forest-950 px-7 text-sm font-medium text-bone transition-[transform,background-color,opacity] duration-200 hover:bg-forest-900 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-35 disabled:active:scale-100"
      >
        {label}
      </button>
    </div>
  );
}

function DetailsForm({
  details,
  errors,
  sending,
  sendError,
  q,
  onChange,
  onBlurField,
  onSubmit,
}: {
  details: Details;
  errors: DetailErrors;
  sending: boolean;
  sendError: string;
  q: Quote | null;
  onChange: (patch: Partial<Details>) => void;
  onBlurField: (key: keyof DetailErrors) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  const id = useId();
  return (
    <form onSubmit={onSubmit} noValidate className="[&_:focus-visible]:outline-forest-700">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field id={`${id}-name`} label="Naam" error={errors.name} className="sm:col-span-2">
          <input
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            value={details.name}
            onChange={(e) => onChange({ name: e.target.value })}
            onBlur={() => onBlurField("name")}
            aria-invalid={!!errors.name || undefined}
            aria-describedby={errors.name ? `${id}-name-error` : undefined}
            className={inputClass(!!errors.name)}
          />
        </Field>
        <Field id={`${id}-email`} label="E-mailadres" error={errors.email}>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={details.email}
            onChange={(e) => onChange({ email: e.target.value })}
            onBlur={() => onBlurField("email")}
            aria-invalid={!!errors.email || undefined}
            aria-describedby={errors.email ? `${id}-email-error` : undefined}
            className={inputClass(!!errors.email)}
          />
        </Field>
        <Field id={`${id}-phone`} label="Telefoonnummer" error={errors.phone}>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={details.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            onBlur={() => onBlurField("phone")}
            aria-invalid={!!errors.phone || undefined}
            aria-describedby={errors.phone ? `${id}-phone-error` : undefined}
            className={inputClass(!!errors.phone)}
          />
        </Field>
        <Field id={`${id}-note`} label="Opmerking" optional className="sm:col-span-2">
          <textarea
            id={`${id}-note`}
            name="note"
            rows={3}
            value={details.note}
            onChange={(e) => onChange({ note: e.target.value })}
            className={`${inputClass(false)} h-auto resize-y py-3`}
            aria-describedby={`${id}-note-help`}
          />
          <p id={`${id}-note-help`} className="mt-1.5 text-[0.8125rem] text-forest-950/55">
            Bijvoorbeeld een vroege aankomst of een kinderbedje.
          </p>
        </Field>
      </div>

      <div className="mt-5">
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="agree"
            checked={details.agree}
            onChange={(e) => onChange({ agree: e.target.checked })}
            aria-invalid={!!errors.agree || undefined}
            aria-describedby={errors.agree ? `${id}-agree-error` : undefined}
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-forest-950"
          />
          <span className="leading-[1.5]">
            Ik ga akkoord met de{" "}
            <a href={ROUTES.houseRules} target="_blank" rel="noopener" className="font-medium underline underline-offset-4">
              huisregels
            </a>
            . Inchecken kan vanaf 23 jaar.
          </span>
        </label>
        {errors.agree && (
          <p id={`${id}-agree-error`} role="alert" className="mt-2 text-[0.8125rem] text-[#9b3b24]">
            {errors.agree}
          </p>
        )}
      </div>

      {sendError && (
        <p role="alert" className="mt-5 rounded-xl bg-[#9b3b24]/8 px-4 py-3 text-[0.8125rem] text-[#9b3b24]">
          {sendError}
        </p>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-forest-950/8 pt-5">
        <p className="text-sm lg:invisible">
          {q && (
            <>
              <span className="text-forest-950/60">Totaal </span>
              <span className="font-semibold">{formatEuro(q.total)}</span>
            </>
          )}
        </p>
        <button
          type="submit"
          disabled={sending}
          aria-busy={sending || undefined}
          className="inline-flex h-12 cursor-pointer items-center justify-center rounded-xl bg-forest-950 px-7 text-sm font-medium text-bone transition-[transform,background-color,opacity] duration-200 hover:bg-forest-900 active:scale-[0.97] disabled:cursor-wait disabled:opacity-60"
        >
          {sending ? "Aanvraag versturen..." : TEXT.bookingSubmit}
        </button>
      </div>
    </form>
  );
}

/* ---------- Overzicht en bevestiging ---------- */

function Summary({
  arrive,
  leave,
  adults,
  children,
  pets,
  wellness,
  q,
}: {
  arrive: Date | null;
  leave: Date | null;
  adults: number;
  children: number;
  pets: number;
  wellness: boolean;
  q: Quote | null;
}) {
  return (
    <aside aria-label="Overzicht van je boeking" className="rounded-[20px] border border-forest-950/8 bg-[var(--panel)] p-5 lg:sticky lg:top-6 md:p-6">
      <div className="flex items-center gap-4">
        <img src={asset("/foto/accommodatie/slaapkamer-1.webp")} alt="" width={1024} height={683} loading="lazy" className="size-16 shrink-0 rounded-xl object-cover" />
        <div>
          <p className="font-display text-lg font-medium tracking-[-0.03em]">{BRAND_NAME}</p>
          <p className="text-[0.8125rem] text-forest-950/60">
            {TEXT.bookingHouse}, max. {MAX_GUESTS} personen
          </p>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-forest-950/8 pt-5 text-sm">
        <SummaryItem label="Aankomst" value={arrive ? `${dayFmt.format(arrive)}, vanaf ${CHECK_IN}` : "Nog kiezen"} muted={!arrive} />
        <SummaryItem label="Vertrek" value={leave ? `${dayFmt.format(leave)}, voor ${CHECK_OUT}` : "Nog kiezen"} muted={!leave} />
        <SummaryItem label="Gasten" value={guestsLabel(adults, children)} />
        <SummaryItem label="Huisdieren" value={petsLabel(pets)} />
        <SummaryItem label="Wellness" value={wellness ? "Privé wellness erbij" : "Niet gekozen"} muted={!wellness} />
      </dl>

      <div className="mt-5 border-t border-forest-950/8 pt-5">
        {q ? (
          <>
            <dl className="flex flex-col gap-2.5 text-sm">
              <PriceRow label={`Verblijf, ${plural(q.nights, "nacht", "nachten")}`} value={q.lodging} />
              <PriceRow label="Schoonmaak" value={q.cleaning} />
              <PriceRow label="Toeristenbelasting" value={q.touristTax} />
              {q.pets > 0 && <PriceRow label={petsLabel(pets)} value={q.pets} />}
              {q.wellness > 0 && <PriceRow label="Privé wellness" value={q.wellness} />}
            </dl>
            <div className="mt-4 flex items-baseline justify-between border-t border-forest-950/8 pt-4">
              <span className="font-medium">Totaal</span>
              <span aria-live="polite" className="font-display text-2xl font-medium tracking-[-0.03em] tabular-nums">
                {formatEuro(q.total)}
              </span>
            </div>
            {/* TODO: klantdata. Betaalproces bevestigen met de eigenaar. */}
            <p className="mt-3 text-[0.8125rem] leading-[1.55] text-forest-950/55">
              {TEXT.bookingPaymentNote}
            </p>
          </>
        ) : (
          <div>
            <p className="text-sm">
              <span className="text-forest-950/60">Vanaf </span>
              <span className="font-display text-2xl font-medium tracking-[-0.03em]">{formatEuro(lowestRate)}</span>
              <span className="text-forest-950/60"> per nacht</span>
            </p>
            <p className="mt-2 text-[0.8125rem] text-forest-950/55">Kies je data om de totaalprijs te zien.</p>
          </div>
        )}
      </div>
    </aside>
  );
}

function SummaryItem({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div>
      <dt className="text-[0.8125rem] text-forest-950/55">{label}</dt>
      <dd className={`mt-0.5 font-medium ${muted ? "text-forest-950/40" : ""}`}>{value}</dd>
    </div>
  );
}

function PriceRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-forest-950/70">{label}</dt>
      <dd className="tabular-nums">{formatEuro(value)}</dd>
    </div>
  );
}

function Confirmation({ name, email, onStartOver }: { name: string; email: string; onStartOver: () => void }) {
  return (
    <div role="status" className="rounded-[20px] border border-forest-950/15 bg-[var(--panel)] p-6 md:p-9">
      <CheckCircle size={40} weight="fill" aria-hidden className="text-forest-700" />
      <h3 className="mt-4 font-display text-2xl font-medium tracking-[-0.03em] md:text-3xl">Bedankt, {name}. Je aanvraag is verstuurd.</h3>
      {/* TODO: bevestigingsmail en reactietermijn afstemmen met de eigenaar */}
      <p className="mt-3 max-w-[48ch] text-sm leading-[1.65] text-forest-950/70">
        {TEXT.bookingThanks} Een kopie van je aanvraag ontvang je op {email}.
      </p>
      <button
        type="button"
        onClick={onStartOver}
        className="mt-6 inline-flex h-12 cursor-pointer items-center rounded-xl border border-forest-950/20 px-6 text-sm font-medium transition-colors hover:border-forest-950"
      >
        Nieuwe aanvraag
      </button>
    </div>
  );
}
