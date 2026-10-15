import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { Logo } from "./Logo";
import { Link, ROUTES, useRouter } from "../lib/router";

// Menu: Accommodatie | Wellness | Omgeving | Contact (Home zit in het logo; Boeken via de knop "Boek je verblijf")
export const NAV = [
  { label: "Accommodatie", href: ROUTES.accommodation },
  { label: "Wellness", href: ROUTES.wellness },
  { label: "Omgeving", href: ROUTES.surroundings },
  { label: "Contact", href: ROUTES.contact },
];

const ease = [0.16, 1, 0.3, 1] as const;

// Navigatie bovenin elke fotokaart (home-hero en paginakoppen): logo, links, contactknop, mobiel menu.
export function SiteHeader() {
  const { path } = useRouter();

  return (
    <div className="flex items-center justify-between gap-6">
      <Logo />
      <div className="flex items-center gap-3 lg:gap-8">
        <nav aria-label="Hoofdmenu" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {NAV.map((item) => {
              const current = item.href === path;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={`relative py-2 text-sm transition-colors duration-200 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-bone after:transition-transform after:duration-300 hover:text-bone hover:after:scale-x-100 ${
                      current ? "text-bone after:scale-x-100" : "text-bone/75 after:scale-x-0"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <Link
          href={ROUTES.availability}
          className="hidden h-10 items-center rounded-full bg-bone px-5 text-sm font-medium whitespace-nowrap text-forest-950 transition-[transform,background-color] duration-200 hover:bg-white active:scale-[0.97] sm:inline-flex"
        >
          Boek je verblijf
        </Link>
        <MobileMenu />
      </div>
    </div>
  );
}

function MobileMenu() {
  const reduce = useReducedMotion();
  const { path } = useRouter();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // Sluiten bij paginawissel
  useEffect(() => setOpen(false), [path]);

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!panel.current?.contains(e.target as Node) && !toggle.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={toggle}
        type="button"
        aria-expanded={open}
        aria-controls="mobiel-menu"
        onClick={() => setOpen((o) => !o)}
        className="glass inline-flex h-10 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-medium text-bone"
      >
        {open ? <X size={18} aria-hidden /> : <List size={18} aria-hidden />}
        Menu
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panel}
            id="mobiel-menu"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.25, ease } }}
            exit={{ opacity: 0, y: reduce ? 0 : -6, transition: { duration: 0.15 } }}
            className="absolute inset-x-2.5 top-[4.75rem] z-40 rounded-[20px] bg-bone p-3 text-forest-950 shadow-[0_24px_60px_rgb(8_14_10/0.35)]"
          >
            <nav aria-label="Menu">
              <ul className="flex flex-col">
                {[{ label: "Home", href: ROUTES.home }, ...NAV].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={item.href === path ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className="flex min-h-12 items-center rounded-xl px-4 font-display text-lg font-medium tracking-[-0.03em] transition-colors hover:bg-forest-950/[0.06] aria-[current=page]:bg-forest-950/[0.06]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <Link
              href={ROUTES.availability}
              onClick={() => setOpen(false)}
              className="mt-2 flex h-12 items-center justify-center rounded-xl bg-forest-950 text-sm font-medium text-bone"
            >
              Boek je verblijf
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
