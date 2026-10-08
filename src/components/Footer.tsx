import { useId, useState, type FormEvent } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { BRAND_NAME, Hourglass, Logo } from "./Logo";
import { ADDRESS, EMAIL, PHONE, TAGLINE } from "../lib/site";

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ADDRESS.street}, ${ADDRESS.postal} ${ADDRESS.city}`)}`;
import { Link, ROUTES } from "../lib/router";
import { TEXT } from "../lib/content";

type FooterLink = { label: string; href: string; external?: boolean };

// Footer uit de aangeleverde teksten: navigatie, contact, goed om te weten.
// TODO: klantdata. Telefoon en e-mail volgen; pagina's voorwaarden en privacy bestaan nog niet.
const COLUMNS: { title: string; id?: string; links: FooterLink[] }[] = [
  {
    title: "Navigatie",
    links: [
      { label: "Accommodatie", href: ROUTES.accommodation },
      { label: "Wellness", href: ROUTES.wellness },
      { label: "Omgeving", href: ROUTES.surroundings },
      { label: "Boeken", href: ROUTES.availability },
      { label: "Prijzen", href: ROUTES.prices },
      { label: "Contact", href: ROUTES.contact },
    ],
  },
  {
    title: "Contact",
    id: "contact",
    links: [
      { label: EMAIL, href: `mailto:${EMAIL}` },
      { label: PHONE, href: `tel:${PHONE.replace(/\s/g, "")}` },
      { label: `${ADDRESS.street}, ${ADDRESS.city}`, href: MAPS_URL, external: true },
    ],
  },
  {
    title: "Goed om te weten",
    links: [
      { label: "Huisregels", href: ROUTES.houseRules },
      { label: "Algemene voorwaarden", href: "/voorwaarden" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="p-2.5 md:p-2">
      <div className="rounded-[28px] border border-forest-950/8 bg-[var(--panel)] px-5 pt-10 pb-5 text-forest-950 md:px-10 md:pt-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-[1fr_1fr_1fr_minmax(0,1.8fr)] md:items-start md:gap-x-10">
          {COLUMNS.map((col) => (
            <nav key={col.title} id={col.id} aria-label={col.title} className="scroll-mt-8">
              <h2 className="font-display text-lg font-medium tracking-[-0.03em]">{col.title}</h2>
              <ul className="mt-3 flex flex-col gap-1.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="inline-flex items-center gap-1 py-0.5 text-sm break-all text-forest-950/60 transition-colors duration-200 hover:text-forest-950"
                    >
                      {link.label}
                      {link.external && (
                        <>
                          <ArrowUpRight size={13} aria-hidden />
                          <span className="sr-only"> (opent in een nieuw tabblad)</span>
                        </>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <Newsletter />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-forest-950/8 pt-5">
          <Logo />
          <p className="text-[0.8125rem] text-forest-950/55">
            {TAGLINE} &copy; {new Date().getFullYear()} {BRAND_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}

export function Newsletter() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Vul een geldig e-mailadres in.");
      return;
    }
    setError("");
    // TODO: koppelen aan nieuwsbriefdienst (bijv. Mailchimp of Laposta)
    setDone(true);
  }

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="relative isolate col-span-2 overflow-hidden rounded-[20px] bg-forest-950/[0.045] p-5 md:col-span-1 md:p-6"
    >
      {/* Zandloper uit het logo, afgesneden in de hoek (alleen vanaf md, op mobiel botst het met het formulier) */}
      <Hourglass className="pointer-events-none absolute -right-4 -bottom-10 -z-10 hidden h-44 text-forest-950/[0.08] md:block" />

      <h2 id={`${id}-title`} className="max-w-[19rem] font-display text-lg leading-[1.2] font-medium tracking-[-0.03em]">
        {TEXT.newsletterTitle}
      </h2>
      <p className="mt-1 text-[0.8125rem] text-forest-950/60">{TEXT.newsletterIntro}</p>

      {done ? (
        <p aria-live="polite" className="mt-4 max-w-[19rem] text-sm font-medium text-forest-700">
          {TEXT.newsletterSuccess}
        </p>
      ) : (
        <form onSubmit={onSubmit} noValidate className="mt-4 md:max-w-[19rem] [&_:focus-visible]:outline-forest-700">
          <label htmlFor={`${id}-email`} className="text-[0.8125rem] font-medium">
            E-mailadres
          </label>
          <div className="mt-1 flex items-center gap-2">
            <input
              id={`${id}-email`}
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!error || undefined}
              aria-describedby={error ? `${id}-error` : undefined}
              className="block h-11 min-w-0 flex-1 border-b border-forest-950/25 bg-transparent text-sm outline-none placeholder:text-forest-950/40 focus:border-forest-950"
              placeholder="naam@voorbeeld.nl"
            />
            <button
              type="submit"
              className="inline-flex h-11 shrink-0 cursor-pointer items-center rounded-full bg-forest-950 px-5 text-sm font-medium text-bone transition-[transform,background-color] duration-200 hover:bg-forest-900 active:scale-[0.97]"
            >
              Aanmelden
            </button>
          </div>
          {error && (
            <p id={`${id}-error`} role="alert" className="mt-2 text-[0.8125rem] text-[#9b3b24]">
              {error}
            </p>
          )}
        </form>
      )}
    </section>
  );
}
