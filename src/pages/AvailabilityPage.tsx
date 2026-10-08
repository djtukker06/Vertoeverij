import { PageHero } from "../components/page/PageHero";
import { asset } from "../lib/config";
import { AvailabilityOverview } from "../components/page/AvailabilityOverview";
import { BookingSection } from "../components/BookingSection";
import { HouseIntro } from "../components/HouseIntro";
import { nextFreePeriods } from "../lib/availability";
import { TEXT } from "../lib/content";

const dayFmt = new Intl.DateTimeFormat("nl-NL", { weekday: "short", day: "numeric", month: "short" });

/** Kerngegeven rechtsonder in de paginakop (ook los gebruikt als eiland in het WordPress-theme). */
export function NextPeriod() {
  const next = nextFreePeriods(1)[0];
  if (!next) return null;
  return (
    <div className="border-t border-bone/20 pt-5 md:border-t-0 md:border-l md:pt-0 md:pl-8">
      <p className="text-[0.8125rem] text-bone/70">{TEXT.nextPeriodLabel}</p>
      <p className="mt-1 font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight font-light tracking-[-0.02em]">
        {dayFmt.format(next.start)} tot {dayFmt.format(next.end)}
      </p>
    </div>
  );
}

export function AvailabilityPage() {
  return (
    <>
      <PageHero
        title={["Klaar om", "te vertoeven?"]}
        intro="Bekijk de beschikbaarheid van De Zandloper en boek je verblijf. De privé wellness boek je er eenvoudig bij."
        image={asset("/foto/accommodatie/huis-zomer.webp")}
        aside={<NextPeriod />}
      />
      <AvailabilityOverview />
      <BookingSection />
      <HouseIntro />
    </>
  );
}
