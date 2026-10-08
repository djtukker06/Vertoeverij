import { Moon } from "@phosphor-icons/react";
import { asset } from "../lib/config";
import { CHECK_IN, CHECK_OUT, MIN_NIGHTS } from "../lib/availability";

// Je verblijf als tijdlijn: aankomsttijd, de nachten ertussen, vertrektijd.
// TODO: klantdata. Oude foto van Booking.com; vervangen door een nieuwe foto van Marith.
export function StayTimesCard() {
  return (
    <article className="relative isolate flex h-full min-h-[460px] flex-col justify-between overflow-hidden rounded-[20px] bg-forest-900 p-6 text-bone md:min-h-0 md:p-9">
      <img
        src={asset("/foto/accommodatie/terras-huis.webp")}
        alt=""
        loading="lazy"
        decoding="async"
        width={1024}
        height={768}
        className="absolute inset-0 -z-10 size-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(12_20_15/0.7)_0%,rgb(12_20_15/0.1)_38%,rgb(12_20_15/0.15)_55%,rgb(12_20_15/0.85)_100%)]" />

      <div>
        <h3 className="font-display text-xl font-medium tracking-[-0.03em] md:text-2xl">Aankomst en vertrek</h3>
        <p className="mt-1.5 max-w-[36ch] text-[0.8125rem] leading-[1.6] text-bone/75">
          Vertrekken kan op de dag dat de volgende gast aankomt.
        </p>
      </div>

      {/* Smal scherm: nachten-label op eigen regel boven de tijden. Vanaf sm: tijdlijn op één regel. */}
      <dl className="grid grid-cols-2 items-end gap-x-3 gap-y-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-x-5">
        <div>
          <dt className="text-[0.8125rem] text-bone/70">Aankomst vanaf</dt>
          <dd className="mt-1 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.9] font-light tracking-[-0.04em] tabular-nums">
            {CHECK_IN}
          </dd>
        </div>

        <div className="relative order-first col-span-2 flex items-center justify-center sm:order-none sm:col-span-1 sm:mb-[0.9em]">
          <span aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-[linear-gradient(90deg,transparent,rgb(243_241_234/0.5)_15%,rgb(243_241_234/0.5)_85%,transparent)]" />
          <dt className="sr-only">Minimaal verblijf</dt>
          <dd className="relative flex items-center gap-1.5 rounded-full border border-bone/25 bg-forest-950/70 px-3 py-1.5 text-[0.8125rem] whitespace-nowrap backdrop-blur-sm">
            <span aria-hidden className="flex items-center gap-0.5">
              {Array.from({ length: MIN_NIGHTS }, (_, i) => (
                <Moon key={i} size={13} weight="fill" />
              ))}
            </span>
            <span>min. {MIN_NIGHTS} nachten</span>
          </dd>
        </div>

        <div className="text-right">
          <dt className="text-[0.8125rem] text-bone/70">Vertrek voor</dt>
          <dd className="mt-1 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.9] font-light tracking-[-0.04em] tabular-nums">
            {CHECK_OUT}
          </dd>
        </div>
      </dl>
    </article>
  );
}
