import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { scrollToId } from "./scroll";
import { CONFIG } from "./config";
import { ROUTES, useRouter } from "./router";

export type FieldKey = "aankomst" | "vertrek" | "gasten" | "huisdier";
export type BookingStep = 1 | 2 | 3;

// Maximaal vier personen (twee slaapkamers). Huisdieren op verzoek, maximaal één. TODO: klantdata, bevestigen.
export const MAX_GUESTS = CONFIG.maxGuests ?? 4;
export const MAX_PETS = CONFIG.maxPets ?? 1;
export const BOOKING_SECTION_ID = "boeken";

type BookingContextValue = {
  arrive: Date | null;
  leave: Date | null;
  adults: number;
  children: number;
  pets: number;
  /** Privé wellness bij het verblijf */
  wellness: boolean;
  /** Open veld in de hero-boekingsbalk */
  open: FieldKey | null;
  /** Actieve stap in de boekingssectie */
  step: BookingStep;
  setArrive: (d: Date | null) => void;
  setLeave: (d: Date | null) => void;
  setAdults: (n: number) => void;
  setChildren: (n: number) => void;
  setPets: (n: number) => void;
  setWellness: (v: boolean) => void;
  setOpen: (key: FieldKey | null) => void;
  setStep: (step: BookingStep) => void;
  /** Naar de boekingssectie scrollen en de gegeven stap openen */
  goToBooking: (step: BookingStep) => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

// Eén boekingsstatus voor de hele pagina: hero-balk, vrije periodes en de boekingssectie lezen en schrijven hier.
export function BookingProvider({ children: content }: { children: ReactNode }) {
  const [arrive, setArrive] = useState<Date | null>(null);
  const [leave, setLeave] = useState<Date | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(0);
  const [wellness, setWellness] = useState(false);
  const [open, setOpen] = useState<FieldKey | null>(null);
  const [step, setStep] = useState<BookingStep>(1);

  const { navigate } = useRouter();
  const goToBooking = useCallback(
    (next: BookingStep) => {
      setOpen(null);
      setStep(next);
      // Staat de boekingssectie op deze pagina: na de render scrollen, zodat de juiste stap al open staat.
      // Anders (homepage) naar Beschikbaarheid; de gekozen data blijven bewaard.
      if (document.getElementById(BOOKING_SECTION_ID)) window.setTimeout(() => scrollToId(BOOKING_SECTION_ID), 30);
      else navigate(`${ROUTES.availability}#${BOOKING_SECTION_ID}`);
    },
    [navigate],
  );

  return (
    <BookingContext.Provider
      value={{
        arrive,
        leave,
        adults,
        children,
        pets,
        wellness,
        open,
        step,
        setArrive,
        setLeave,
        setAdults,
        setChildren,
        setPets,
        setWellness,
        setOpen,
        setStep,
        goToBooking,
      }}
    >
      {content}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking moet binnen <BookingProvider> staan");
  return ctx;
}
