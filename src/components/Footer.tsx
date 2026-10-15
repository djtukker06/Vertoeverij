import { ArrowUpRight, EnvelopeSimple, MapPin, Phone, type Icon } from "@phosphor-icons/react";
import { BRAND_NAME, Hourglass, Logo } from "./Logo";
import { CHECK_IN, CHECK_OUT } from "../lib/availability";
import { ADDRESS, EMAIL, PHONE } from "../lib/site";

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ADDRESS.street}, ${ADDRESS.postal} ${ADDRESS.city}`)}`;
import { Link, ROUTES } from "../lib/router";

type FooterLink = { label: string; href: string; external?: boolean };

// Footer uit de aangeleverde teksten: navigatie, goed om te weten en contact (id="contact": doel van de menulink).
// TODO: klantdata. Telefoon en e-mail volgen; pagina's voorwaarden en privacy bestaan nog niet.
const COLUMNS: { title: string; id?: string; links: FooterLink[] }[] = [
  {
    title: "Navigatie",
    links: [
      { label: "Accommodatie", href: ROUTES.accommodation },
      { label: "Wellness", href: ROUTES.wellness },
      { label: "Omgeving", href: ROUTES.surroundings },
      { label: "Boeken", href: ROUTES.availability },
      { label: "Reviews", href: ROUTES.reviews },
      { label: "Contact", href: ROUTES.contact },
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
    <footer id="contact" className="scroll-mt-0 p-2.5 pt-12 md:p-2 md:pt-20">
      <div className="rounded-[28px] border border-forest-950/8 bg-[var(--panel)] px-5 pt-10 pb-5 text-forest-950 md:px-10 md:pt-10">
        <div className="hl-wrap">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-[1fr_1fr_minmax(0,1.8fr)] md:items-start md:gap-x-10">
          {COLUMNS.map((col) => (
            <nav key={col.title} id={col.id} aria-label={col.title} className="scroll-mt-8">
              <h2 className="font-display text-lg font-medium tracking-[-0.03em]">{col.title}</h2>
              <ul className="mt-3 flex flex-col gap-1.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="inline-flex items-center gap-1 py-0.5 text-sm [overflow-wrap:anywhere] text-forest-950/60 transition-colors duration-200 hover:text-forest-950"
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

          <ContactBlock />
        </div>

        {/* Onderregel: logo links, copyright in het midden, maker rechts (mobiel onder elkaar) */}
        <div className="mt-10 grid grid-cols-1 items-center gap-4 border-t border-forest-950/8 pt-5 md:grid-cols-[1fr_auto_1fr]">
          <Logo />
          <p className="text-[0.8125rem] text-forest-950/55 md:text-center">
            &copy; {new Date().getFullYear()} {BRAND_NAME}
          </p>
          <p className="text-[0.8125rem] text-forest-950/55 md:text-right">
            Website door:{" "}
            <a
              href="https://studio-levant.nl"
              target="_blank"
              rel="noopener"
              className="font-medium text-forest-950 underline decoration-forest-950/25 underline-offset-4 transition-colors hover:decoration-forest-950"
            >
              Studio Levant
              <span className="sr-only"> (opent in een nieuw tabblad)</span>
            </a>
          </p>
        </div>
        </div>
      </div>
    </footer>
  );
}

/** Contactgegevens in de footer, op de plek van de vroegere nieuwsbrief. TODO: klantdata, telefoon en e-mail volgen. */
function ContactBlock() {
  const rows: { icon: Icon; label: string; value: string; href: string; external?: boolean }[] = [
    { icon: Phone, label: "Telefoon", value: PHONE, href: `tel:${PHONE.replace(/\s/g, "")}` },
    { icon: EnvelopeSimple, label: "E-mail", value: EMAIL, href: `mailto:${EMAIL}` },
    { icon: MapPin, label: "Adres", value: `${ADDRESS.street}, ${ADDRESS.postal} ${ADDRESS.city}`, href: MAPS_URL, external: true },
  ];
  return (
    <section aria-labelledby="footer-contact-titel" className="relative isolate col-span-2 overflow-hidden rounded-[20px] bg-forest-950 p-5 text-bone md:col-span-1 md:p-6">
      {/* Zandloper uit het logo, afgesneden in de hoek (alleen vanaf md) */}
      <Hourglass className="pointer-events-none absolute -right-4 -bottom-10 -z-10 hidden h-44 text-bone/[0.07] md:block" />
      <h2 id="footer-contact-titel" className="font-display text-lg leading-[1.2] font-medium tracking-[-0.03em]">
        Vragen? Neem contact op
      </h2>
      <p className="mt-1 text-[0.8125rem] text-bone/60">
        Inchecken vanaf {CHECK_IN}, uitchecken voor {CHECK_OUT}.
      </p>
      <ul className="mt-4 flex flex-col gap-2.5">
        {rows.map((r) => (
          <li key={r.label}>
            <a
              href={r.href}
              {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group inline-flex items-center gap-3 text-sm text-bone/85 transition-colors hover:text-bone"
            >
              <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-bone/10 transition-colors group-hover:bg-bone/20">
                <r.icon size={15} />
              </span>
              <span className="[overflow-wrap:anywhere]">
                <span className="sr-only">{r.label}: </span>
                {r.value}
              </span>
              {r.external && <span className="sr-only"> (opent Google Maps in een nieuw tabblad)</span>}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
