import { Link } from "../lib/router";
import { asset } from "../lib/config";

export const BRAND_NAME = "Vertoeverij De Zandloper";

// Logo uit het brandbook (eerste opzet) als masker: de kleur volgt currentColor, net als het oude lijnmerk.
// TODO: klantdata. Vervangen door het definitieve logobestand (SVG) zodra dat klaar is.
export function Logo({ className = "" }: { className?: string }) {
  const src = asset("/brand/logo-vertoeverij.png");
  return (
    <Link href="/" aria-label={`${BRAND_NAME}, naar de homepage`} className={`inline-flex items-center ${className}`}>
      <span
        aria-hidden
        className="block h-9 aspect-[1610/368] bg-current md:h-10"
        style={{ maskImage: `url(${src})`, WebkitMaskImage: `url(${src})`, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat" }}
      />
    </Link>
  );
}

/** Alleen de zandloper (beeldmerk), bijvoorbeeld als dakmerk in de nieuwsbrief. */
export function Hourglass({ className = "" }: { className?: string }) {
  const src = asset("/brand/zandloper.png");
  return (
    <span
      aria-hidden
      className={`block aspect-[521/854] bg-current ${className}`}
      style={{ maskImage: `url(${src})`, WebkitMaskImage: `url(${src})`, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat" }}
    />
  );
}
