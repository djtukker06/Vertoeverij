import type { FormEvent } from "react";
import { CalendarBlank, CalendarCheck, PawPrint, UsersThree } from "@phosphor-icons/react";
import { DatePicker } from "./booking/DatePicker";
import { Select, type Option } from "./booking/Select";
import { addDays, startOfDay } from "../lib/dates";
import { MIN_NIGHTS, canArriveOn, latestDeparture } from "../lib/availability";
import { MAX_GUESTS, useBooking, type FieldKey } from "../lib/booking";
import { TEXT } from "../lib/content";

const GUESTS: Option<string>[] = Array.from({ length: MAX_GUESTS }, (_, i) => i + 1).map((n) => ({
  value: String(n),
  label: `${n} ${n === 1 ? "persoon" : "personen"}`,
}));
const PETS: Option<string>[] = [
  { value: "nee", label: "Geen" },
  { value: "hond", label: "Hond mee" },
];

export function BookingBar() {
  const { arrive, leave, adults, children, pets, open, setArrive, setLeave, setAdults, setChildren, setPets, setOpen, goToBooking } =
    useBooking();

  const today = startOfDay(new Date());
  const openFor = (key: FieldKey) => (next: boolean) => setOpen(next ? key : null);

  // De hero kent alleen een totaal; kinderen uit de boekingssectie blijven behouden waar dat past.
  function setGuestTotal(total: number) {
    const keptChildren = Math.min(children, total - 1);
    setChildren(keptChildren);
    setAdults(total - keptChildren);
  }

  // Altijd door naar de boekingssectie, met alles al ingevuld. Ontbreken de data, dan opent daar de kalender.
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    goToBooking(arrive && leave ? 3 : 1);
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-[20px] bg-bone p-4 text-forest-950 shadow-[0_30px_80px_rgb(8_14_10/0.35)] md:p-5 [&_:focus-visible]:outline-forest-700"
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:items-end md:gap-4 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
        <DatePicker
          label="Aankomst"
          icon={CalendarBlank}
          value={arrive}
          min={today}
          isUnavailable={(d) => !canArriveOn(d)}
          open={open === "aankomst"}
          onOpenChange={openFor("aankomst")}
          onChange={(d) => {
            setArrive(d);
            // Vertrek blijft alleen staan als die nog past bij de nieuwe aankomst
            if (leave && (leave < addDays(d, MIN_NIGHTS) || leave > latestDeparture(d))) setLeave(null);
            setOpen("vertrek");
          }}
          popoverClass="left-0"
        />
        <DatePicker
          label="Vertrek"
          icon={CalendarCheck}
          value={leave}
          min={addDays(arrive ?? today, MIN_NIGHTS)}
          rangeStart={arrive}
          isUnavailable={arrive ? (d) => d > latestDeparture(arrive) : undefined}
          open={open === "vertrek"}
          onOpenChange={openFor("vertrek")}
          onChange={(d) => {
            setLeave(d);
          }}
          popoverClass="right-0 md:right-auto md:left-0"
        />
        <Select
          label="Gasten"
          icon={UsersThree}
          options={GUESTS}
          value={String(adults + children)}
          onChange={(v) => setGuestTotal(Number(v))}
          open={open === "gasten"}
          onOpenChange={openFor("gasten")}
          popoverClass="left-0"
        />
        <Select
          label="Huisdier"
          icon={PawPrint}
          options={PETS}
          value={pets > 0 ? "hond" : "nee"}
          onChange={(v) => setPets(v === "nee" ? 0 : Math.max(1, pets))}
          open={open === "huisdier"}
          onOpenChange={openFor("huisdier")}
          popoverClass="right-0 md:right-auto md:left-0"
        />
        <button
          type="submit"
          className="col-span-2 inline-flex h-12 md:col-span-4 lg:col-span-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-forest-950 px-7 text-sm font-medium whitespace-nowrap text-bone transition-[transform,background-color] duration-200 ease-(--ease-out-soft) hover:bg-forest-900 active:scale-[0.97]"
        >
          {TEXT.heroCta}
        </button>
      </div>
    </form>
  );
}
