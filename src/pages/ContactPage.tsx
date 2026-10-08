import { useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, CalendarBlank, CheckCircle, EnvelopeSimple, InstagramLogo, MapPin, MapTrifold, Phone, Receipt, type Icon } from "@phosphor-icons/react";
import { PageHero } from "../components/page/PageHero";
import { SectionHeading } from "../components/page/SectionHeading";
import { Field, inputClass } from "../components/booking/shared";
import { asset } from "../lib/config";
import { ADDRESS, EMAIL, INSTAGRAM, PHONE } from "../lib/site";
import { CHECK_IN, CHECK_OUT } from "../lib/availability";
import { Link, ROUTES } from "../lib/router";
import { TEXT } from "../lib/content";
import { submitContactMessage } from "../lib/contactApi";
import { scrollToId } from "../lib/scroll";

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = (reduce: boolean | null, delay = 0) =>
  reduce
    ? {}
    : {
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.9, ease, delay },
      };

const SUBJECTS = ["Verblijf", "Wellness", "Huisdier", "Iets anders"];
const telHref = `tel:${PHONE.replace(/\s/g, "")}`;

export function ContactPage() {
  return (
    <>
      <PageHero
        title={["Vragen?", "Laat het ons weten"]}
        intro="Over je verblijf, de wellness of iets anders. Stuur een bericht of bel, dan helpen we je graag verder."
        image={asset("/foto/accommodatie/terras.webp")}
        aside={
          <div className="border-t border-bone/20 pt-5 md:border-t-0 md:border-l md:pt-0 md:pl-8">
            <p className="text-[0.8125rem] text-bone/70">Liever bellen?</p>
            <a
              href={telHref}
              className="mt-1 block font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight font-light tracking-[-0.02em] whitespace-nowrap tabular-nums underline decoration-bone/0 underline-offset-4 transition-colors hover:decoration-bone/60"
            >
              {PHONE}
            </a>
          </div>
        }
      />
      <ContactSection />
      <Shortcuts />
    </>
  );
}

/* ---------- Formulier en gegevens ---------- */

type Form = { subject: string; name: string; email: string; phone: string; message: string };
type FormErrors = Partial<Record<"name" | "email" | "phone" | "message", string>>;

function validate(f: Form): FormErrors {
  const errors: FormErrors = {};
  if (f.name.trim().length < 2) errors.name = "Vul je naam in.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) errors.email = "Vul een geldig e-mailadres in, bijvoorbeeld naam@voorbeeld.nl.";
  if (f.phone.trim() && f.phone.replace(/[^\d]/g, "").length < 9) errors.phone = "Dit telefoonnummer lijkt niet compleet.";
  if (f.message.trim().length < 10) errors.message = "Schrijf je vraag in een paar woorden.";
  return errors;
}

function ContactSection() {
  const reduce = useReducedMotion();
  return (
    <section id="contact" aria-labelledby="contact-titel" className="relative isolate scroll-mt-[var(--hl-section-y)] overflow-hidden px-[1.875rem] hl-sy md:px-12">
      <SectionHeading
        id="contact-titel"
        title="Stuur een bericht"
        text="Vul je vraag in, dan krijg je antwoord per mail. Wil je liever gebeld worden, laat dan je nummer achter."
        watermark="Contact"
      />

      <div className="mt-10 grid grid-cols-1 gap-3 md:mt-12 md:gap-4 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-start">
        <motion.div {...fadeUp(reduce, 0.05)} className="rounded-[20px] border border-forest-950/8 bg-[var(--panel)] p-6 text-forest-950 md:p-9">
          <ContactForm />
        </motion.div>
        <motion.div {...fadeUp(reduce, 0.12)} className="lg:sticky lg:top-6">
          <Details />
        </motion.div>
      </div>
    </section>
  );
}

function ContactForm() {
  const id = useId();
  const [form, setForm] = useState<Form>({ subject: SUBJECTS[0], name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [sent, setSent] = useState<{ name: string; email: string } | null>(null);

  const change = (patch: Partial<Form>) => setForm((f) => ({ ...f, ...patch }));
  // Na een eerste fout per veld opnieuw controleren bij verlaten, zodat de melding verdwijnt zodra het klopt
  const recheck = (key: keyof FormErrors) => {
    if (!errors[key]) return;
    setErrors((e) => ({ ...e, [key]: validate(form)[key] }));
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    const firstInvalid = (["name", "email", "phone", "message"] as const).find((k) => found[k]);
    if (firstInvalid) {
      (e.currentTarget.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }
    setSending(true);
    setSendError("");
    try {
      await submitContactMessage({
        subject: form.subject,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
      });
    } catch {
      setSending(false);
      setSendError(TEXT.contactError);
      return;
    }
    setSending(false);
    setSent({ name: form.name.trim().split(/\s+/)[0], email: form.email.trim() });
    window.setTimeout(() => scrollToId("contact"), 30);
  }

  if (sent) {
    return (
      <div role="status" className="flex flex-col items-start gap-4 py-6 md:py-10">
        <CheckCircle size={40} weight="light" aria-hidden className="text-forest-700" />
        <div>
          <h3 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight font-medium tracking-[-0.03em]">Bedankt, {sent.name}</h3>
          <p className="mt-2 max-w-[44ch] text-sm leading-[1.65] text-forest-950/65">
            {TEXT.contactThanks} Het antwoord gaat naar <span className="font-medium text-forest-950">{sent.email}</span>.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSent(null);
            setForm((f) => ({ ...f, message: "" }));
          }}
          className="mt-2 cursor-pointer rounded-full py-2 text-sm font-medium underline decoration-forest-950/25 underline-offset-4 hover:decoration-forest-950"
        >
          Nog een bericht sturen
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="[&_:focus-visible]:outline-forest-700">
      <p id={`${id}-subject`} className="text-[0.8125rem] font-medium">
        Waar gaat je vraag over?
      </p>
      <Chips labelledBy={`${id}-subject`} options={SUBJECTS} value={form.subject} onChange={(subject) => change({ subject })} />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field id={`${id}-name`} label="Naam" error={errors.name} className="sm:col-span-2">
          <input
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={(e) => change({ name: e.target.value })}
            onBlur={() => recheck("name")}
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
            value={form.email}
            onChange={(e) => change({ email: e.target.value })}
            onBlur={() => recheck("email")}
            aria-invalid={!!errors.email || undefined}
            aria-describedby={errors.email ? `${id}-email-error` : undefined}
            className={inputClass(!!errors.email)}
          />
        </Field>
        <Field id={`${id}-phone`} label="Telefoonnummer" optional error={errors.phone}>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => change({ phone: e.target.value })}
            onBlur={() => recheck("phone")}
            aria-invalid={!!errors.phone || undefined}
            aria-describedby={errors.phone ? `${id}-phone-error` : undefined}
            className={inputClass(!!errors.phone)}
          />
        </Field>
        <Field id={`${id}-message`} label="Je vraag" error={errors.message} className="sm:col-span-2">
          <textarea
            id={`${id}-message`}
            name="message"
            rows={6}
            value={form.message}
            onChange={(e) => change({ message: e.target.value })}
            onBlur={() => recheck("message")}
            aria-invalid={!!errors.message || undefined}
            aria-describedby={errors.message ? `${id}-message-error` : `${id}-message-help`}
            className={`${inputClass(!!errors.message)} h-auto resize-y py-3`}
          />
          {!errors.message && (
            <p id={`${id}-message-help`} className="mt-1.5 text-[0.8125rem] text-forest-950/55">
              Noem je data erbij als je vraag over een verblijf of de wellness gaat.
            </p>
          )}
        </Field>
      </div>

      {sendError && (
        <p role="alert" className="mt-5 rounded-xl bg-[#9b3b24]/8 px-4 py-3 text-[0.8125rem] text-[#9b3b24]">
          {sendError}
        </p>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-forest-950/8 pt-5">
        <p className="max-w-[34ch] text-[0.8125rem] leading-[1.5] text-forest-950/55">
          We gebruiken je gegevens alleen om je vraag te beantwoorden.
        </p>
        <button
          type="submit"
          disabled={sending}
          aria-busy={sending || undefined}
          className="inline-flex h-12 cursor-pointer items-center justify-center rounded-xl bg-forest-950 px-7 text-sm font-medium text-bone transition-[transform,background-color,opacity] duration-200 hover:bg-forest-900 active:scale-[0.97] disabled:cursor-wait disabled:opacity-60"
        >
          {sending ? "Versturen..." : TEXT.contactSubmit}
        </button>
      </div>
    </form>
  );
}

/** Onderwerp als radiogroep met chips: klikken of pijltjestoetsen. */
function Chips({ labelledBy, options, value, onChange }: { labelledBy: string; options: string[]; value: string; onChange: (v: string) => void }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = Math.max(0, options.indexOf(value));

  function onKeyDown(e: KeyboardEvent) {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault();
    const dir = e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 1;
    const next = (current + dir + options.length) % options.length;
    onChange(options[next]);
    refs.current[next]?.focus();
  }

  return (
    <div role="radiogroup" aria-labelledby={labelledBy} onKeyDown={onKeyDown} className="mt-2 flex flex-wrap gap-2">
      {options.map((o, i) => {
        const checked = i === current;
        return (
          <button
            key={o}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            onClick={() => onChange(o)}
            className={`h-10 cursor-pointer rounded-xl px-4 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
              checked ? "bg-forest-950 text-bone" : "bg-forest-950/[0.06] text-forest-950/75 hover:bg-forest-950/10 hover:text-forest-950"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function Details() {
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${ADDRESS.street}, ${ADDRESS.postal} ${ADDRESS.city}`)}`;
  const rows: { icon: Icon; label: string; value: string; href: string; external?: boolean }[] = [
    { icon: EnvelopeSimple, label: "E-mail", value: EMAIL, href: `mailto:${EMAIL}` },
    { icon: Phone, label: "Telefoon", value: PHONE, href: telHref },
    { icon: InstagramLogo, label: "Instagram", value: INSTAGRAM.handle, href: INSTAGRAM.url, external: true },
  ];
  return (
    <aside aria-label="Contactgegevens" className="flex flex-col gap-3 md:gap-4">
      <div className="rounded-[20px] bg-forest-950 p-6 text-bone md:p-8">
        <h3 className="font-display text-xl font-medium tracking-[-0.03em] md:text-2xl">Gegevens</h3>
        <ul className="mt-5 divide-y divide-bone/12">
          {rows.map((r) => (
            <li key={r.label}>
              <a
                href={r.href}
                {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex items-center gap-3.5 py-3.5 first:pt-0"
              >
                <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-bone/10 transition-colors duration-200 group-hover:bg-bone/20">
                  <r.icon size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.8125rem] text-bone/60">{r.label}</span>
                  <span className="block truncate text-sm font-medium underline decoration-bone/0 underline-offset-4 transition-colors group-hover:decoration-bone/60">
                    {r.value}
                  </span>
                </span>
                {r.external && (
                  <>
                    <ArrowUpRight size={14} aria-hidden className="ml-auto shrink-0 text-bone/60" />
                    <span className="sr-only"> (opent in een nieuw tabblad)</span>
                  </>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[20px] border border-forest-950/8 bg-[var(--panel)] p-6 text-forest-950 md:p-8">
        <div className="flex items-start gap-3.5">
          <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-forest-950/[0.06] text-forest-700">
            <MapPin size={18} />
          </span>
          <address className="text-sm leading-[1.6] not-italic">
            <span className="block text-[0.8125rem] text-forest-950/55">Adres</span>
            <span className="block font-medium">{ADDRESS.street}</span>
            <span className="block">
              {ADDRESS.postal} {ADDRESS.city}
            </span>
          </address>
        </div>
        <p className="mt-4 border-t border-forest-950/8 pt-4 text-[0.8125rem] leading-[1.6] text-forest-950/60">
          Aankomst vanaf {CHECK_IN}, vertrek voor {CHECK_OUT}.
        </p>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 rounded-full py-1 text-sm font-medium underline decoration-forest-950/25 underline-offset-4 hover:decoration-forest-950"
        >
          Route plannen
          <ArrowUpRight size={14} aria-hidden />
          <span className="sr-only"> (opent Google Maps in een nieuw tabblad)</span>
        </a>
      </div>
    </aside>
  );
}

/* ---------- Snelkoppelingen ---------- */

function Shortcuts() {
  const reduce = useReducedMotion();
  const items: { icon: Icon; title: string; text: string; href: string }[] = [
    { icon: CalendarBlank, title: "Beschikbaarheid", text: "Vrije nachten van de komende zes maanden.", href: ROUTES.availability },
    { icon: Receipt, title: "Prijzen en huisregels", text: "Tarieven, de wellness, betalen en annuleren.", href: ROUTES.prices },
    { icon: MapTrifold, title: "Route en omgeving", text: "Aankomst, afstanden en wat er te doen is.", href: `${ROUTES.surroundings}#route` },
  ];
  return (
    <section aria-labelledby="snel-titel" className="px-[1.875rem] hl-sb md:px-12">
      <h2 id="snel-titel" className="font-display text-xl font-medium tracking-[-0.03em] text-forest-950 md:text-2xl">
        Misschien staat je antwoord er al
      </h2>
      <ul className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
        {items.map((item, i) => (
          <motion.li key={item.title} {...fadeUp(reduce, i * 0.08)}>
            <Link
              href={item.href}
              className="group flex h-full items-start gap-4 rounded-[20px] border border-forest-950/8 bg-[var(--panel)] p-5 text-forest-950 transition-colors duration-200 hover:border-forest-950/20 md:p-6"
            >
              <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-forest-950/[0.06] text-forest-700">
                <item.icon size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg font-medium tracking-[-0.03em]">{item.title}</span>
                <span className="mt-0.5 block text-[0.8125rem] leading-[1.55] text-forest-950/60">{item.text}</span>
              </span>
              <ArrowRight size={16} aria-hidden className="mt-1 shrink-0 text-forest-950/40 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-forest-950" />
            </Link>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
