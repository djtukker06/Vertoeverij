import { ArrowRight } from "@phosphor-icons/react";
import { asset } from "../lib/config";
import { PageHero } from "../components/page/PageHero";
import { Link, ROUTES } from "../lib/router";

// Voor paden die (nog) niet bestaan, zoals voorwaarden en privacy. TODO: die pagina's maken.
export function NotFoundPage() {
  return (
    <PageHero
      title={["Deze pagina", "volgt nog"]}
      intro="Hier komt binnenkort meer informatie. Tot die tijd vind je het belangrijkste op de homepage."
      image={asset("/foto/accommodatie/weiland.webp")}
      aside={
        <Link
          href={ROUTES.home}
          className="inline-flex h-12 items-center gap-2 rounded-xl bg-bone px-6 text-sm font-medium text-forest-950 transition-[transform,background-color] duration-200 hover:bg-white active:scale-[0.97]"
        >
          Naar de homepage
          <ArrowRight size={16} aria-hidden />
        </Link>
      }
    />
  );
}
