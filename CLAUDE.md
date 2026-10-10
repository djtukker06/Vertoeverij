# Vertoeverij De Zandloper

Bed & Wellness in Kloosterhaar (Overijssel): appartement voor vier personen plus een privé wellness (sauna, jacuzzi, Turks stoombad), samen of los te boeken. Doelgroep: rustige stellen en oudere koppels. Uitstraling: rustig, luxe, hotelchique, warm. Tone of voice: netjes maar nuchter, niet mooier maken dan het is.

**Dit project is een kopie van de Heidelust-site (`../Vakantiehuis`) met alleen de huisstijl, inhoud en foto's vervangen. Het ontwerp (opbouw, componenten, animaties, afstanden) blijft exact gelijk; wijzig het niet.**

Stack: Vite + React 19 + TS, Tailwind v4 (`@theme` in `src/index.css`), Motion (`motion/react`), Remotion Player, Phosphor icons.
Dev: `npm run dev` (poort 5174, ook in `.claude/launch.json`). Check: `npx tsc -b`.

## Huisstijl (brandbook, bindend)

- Kleuren, alleen deze: zwart `#101211`, donkergroen `#1F3D2B`, saliegroen `#677D64`, beige `#F6F0DF`. Absoluut geen felle kleuren. De tokens uit het ontwerp blijven bestaan maar wijzen naar dit palet: `forest-950` = donkergroen, `forest-700` = salie, `bone` = beige, `amber` = salie, `--surface` = beige, `--panel` = `#FBF8EF`.
- Fonts: Higuen (koppen, `font-display`, één snede; `src/assets/fonts/higuen-serif.woff2`) en Montserrat (tekst). `.font-display` krijgt tracking -0.01em in plaats van de strakke tracking van het grotesk-ontwerp.
- Logo: eerste opzet uit het brandbook als masker (`public/brand/logo-vertoeverij.png`, `zandloper.png`), kleur volgt `currentColor`. Definitief logo volgt (TODO). Watermerk achter koppen: "Vertoeverij", nooit de hele naam.
- Menu (briefing): Accommodatie | Wellness | Omgeving | Boeken, knop rechts "Boek je verblijf". Routes in `src/lib/router.tsx`: `/`, `/accommodatie`, `/wellness`, `/omgeving`, `/boeken` (= de oude Beschikbaarheid-pagina), `/prijzen`, `/contact`, `/huisregels`.
- Inhoud: `src/lib/site.ts` (adres, contact TODO), `house.ts` (kamers, voorzieningen, wellness-sectie), `surroundings.ts`, `components/Reviews.tsx` (echte Booking.com-reviews, 8,3 uit 57), `pricing.ts` (voorbeeldtarieven incl. `wellnessPerStay`, TODO). Bron: `.claude/_bron/` (briefing, teksten, kleurenpalet, moodboard uit de WeTransfer van 7 oktober 2026).
- Foto's: `public/foto/accommodatie/` = oude foto's van Booking.com, `public/foto/wellness/` = stock (wellness is in aanbouw), `public/foto/omgeving/` = gegenereerde sfeerbeelden. Allemaal vervangen door de foto's van Marith (TODO). Nog geen foto van de keuken: in de kamers-grid staat daarom het terras. Hero-slideshow in `src/lib/content.ts`.
- Boeken: `BookingProvider` heeft `wellness` (privé wellness bij het verblijf, checkbox in stap 2, in de prijs via `quote(..., wellness)`). Alleen wellness boeken loopt nog via contact (TODO: tijdsloten).

## Skills: wanneer welke (staan in `.claude/skills/`, laad ze pas als de taak erom vraagt)

| Taak | Skill | Gebruik vooral |
|---|---|---|
| Nieuwe sectie/component bouwen of reviewen | `design-taste-frontend` | §4.7 layout-regels, §9 AI-tells, §14 pre-flight. Draai §14 vóór oplevering. |
| Kleur, font, UX/a11y-vraag of review | `ui-ux-pro-max` | `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain ux` (of `color`, `typography`). Niet opnieuw `--design-system` draaien: de keuzes hieronder staan vast. |
| Elke zichtbare tekst (koppen, knoppen, alt, meta) | `stop-slop` | Core Rules + Quick Checks, toegepast op Nederlands. |
| Geanimeerde achtergrond, intro, video-asset | `remotion` | `remotion-markup` voor composities, `remotion-saas/player.md` voor de Player. |

Remotion is voor tijdlijn-animatie (beeld, licht, video). UI-motion (reveals, hover, stagger) doe je met Motion of CSS, niet met Remotion.

## Vastgelegde ontwerpkeuzes

- Design read: vakantieverhuur voor gezinnen/stellen, rustig en natuurlijk, foto-gedreven. Dials: variance 6, motion 5, density 3.
- Hero: afgeronde fotokaart (28px) met marge, kop links, feitenkolom rechts, lichte boekingsbalk onderin (referentie: `.claude/_bron/referentie-hero-2.png`). Andere secties: wissel layoutfamilies af.
- Fonts: Bricolage Grotesque (koppen, `font-display`, gewicht 500-600, tracking -0.035em) + Geist (tekst). Geen serif (klant wil het niet), geen Inter.
- **Nooit cursief in koppen of logo.** Nadruk alleen via gewicht.
- Uitlijning: sectie-inhoud start op dezelfde lijn als de hero-inhoud (`px-[1.875rem] md:px-12`).
- Geen decoratie zonder functie: geen pijlknoppen of links die nergens heen gaan, geen hover-effecten op niet-klikbare kaarten. Groot merkwoord achter een kop mag (klantwens), maar altijd statisch, nooit met scroll-animatie.
- Pagina-achtergrond `#f7f7f5` (gebroken wit), ook in dark mode. Donkergroen alleen binnen de fotokaart.
- Palet "Forest": `forest-950/900/700`, `bone`, `bone-muted`, één accent `amber` (focus, fouten, kleine details). Geen beige+brass, geen paars.
- Type-schaal: body/paragraaf 14px (`text-sm`, leading 1.65, max 44ch), labels 13px, knoppen 14px. Geen 16px+ lopende tekst in compacte UI.
- Vormen: kaarten 28px, panelen 20px, velden en knoppen in panelen 12px (`rounded-xl`), losse knoppen in de nav pill. Glas (`.glass`) alleen op foto's.
- Formuliervelden: custom `Select` en `DatePicker` in `src/components/booking/` (ARIA listbox/dialog, toetsenbord, openen naar boven). Geen native `<select>`/`<input type=date>` gebruiken.
- Iconen: alleen `@phosphor-icons/react`, regular weight. Geen eigen SVG-iconen (logo is de uitzondering).

## Pagina's en navigatie

- Routes in `src/lib/router.tsx` (eigen mini-router, geen dependency): `/`, `/beschikbaarheid`, `/omgeving`, `/prijzen`, `/contact`; onbekend pad = `NotFoundPage`. Pagina's in `src/pages/`, titel en description per pagina in `App.tsx`. Productie-host moet alle paden naar `index.html` sturen.
- Interne links altijd via `<Link>` (ook ankers zoals `/#reviews` en `#contact`): wisselt zonder herladen en scrollt vloeiend.
- Vloeiend scrollen via `smoothScrollTo`/`scrollToId` in `src/lib/scroll.ts` (ease-in-out, 600-1400 ms, stopt bij eigen scroll van de bezoeker, direct bij reduced motion). Niet `scrollIntoView({behavior:"smooth"})` gebruiken.
- Sectie-afstand: `.hl-sy` (boven en onder) of `.hl-sb` (alleen onder). Volgt een lichte sectie op een lichte sectie, dan krijgt de tweede `.hl-sb`, anders ontstaat dubbel wit. Ankers zonder bovenpadding: `scroll-mt-[var(--hl-section-y)]` (`scrollToId` leest scroll-margin).
- Contact: alle "Stel een vraag"-knoppen gaan naar `/contact` (`src/pages/ContactPage.tsx`, formulier via `src/lib/contactApi.ts`, gesimuleerd zolang er geen endpoint is). Prijzen heeft geen rekenhulp meer (`Calculator` bestaat alleen nog voor het WordPress-eiland).
- Navigatie: `SiteHeader` (logo, links met `aria-current`, contactknop, mobiel menu) in de home-hero en elke `PageHero`.
- Nieuwe pagina = `PageHero` (zelfde fotokaart als home, lager) + secties met `SectionHeading` + bestaande kaartstijlen: lichte panelen `bg-[#fcfcfa]` 20px, donkergroene kaart 28px met `p-2.5 md:p-2` marge, fotokaarten 20px. Maximaal één achtergrondwoord per pagina (`watermark`).
- Demo-inhoud op Omgeving en Prijzen (activiteiten, afstanden, adres in `src/lib/site.ts`, FAQ, inbegrepen) is verzonnen (TODO klantdata). Prijzen-pagina en rekenhulp lezen `RATES` uit `src/lib/pricing.ts`.


## Animatieregels

- Hero: Remotion-slideshow `src/remotion/HeroScene.tsx` (foto's in `HERO_PHOTOS`, 11 s per foto, langzame zoom 1.00-1.05, 3 s crossfade, naadloze loop). Lazy geladen; statische eerste foto eronder is LCP en reduced-motion fallback. Foto toevoegen = bestand in `public/` + naam in `HERO_PHOTOS`.
- Hero (home): beeldvullend (`min-h-[100svh]`, geen witte rand, geen afgeronde hoeken), geen pin en geen scroll-effect: de volgende sectie begint gewoon onder de hero.
- Tekst-reveals: Motion, ease `[0.16, 1, 0.3, 1]`, stagger 0.1-0.15s, alleen `transform`/`opacity`.
- Elke animatie heeft een reden (hiërarchie, volgorde, feedback). Geen loops, geen marquees tenzij één keer met reden.
- Altijd `useReducedMotion()` respecteren. Geen `window.addEventListener('scroll')`; gebruik `whileInView`/`useScroll`.

## Tekst (stop-slop, NL)

- Geen em-/en-dash (`—` `–`). Check: `grep -rn "—\|–" src`.
- Geen "niet X, maar Y"-constructies, geen opvulwoorden (echt, gewoon, eigenlijk, volledig), geen "ontdek/beleef/unieke ervaring".
- Concreet en met "je": noem het riet, de tuin, het bos. Subtekst max 20 woorden, kop max 2 regels.
- Geen verzonnen cijfers (prijzen, m², reviewscores) zonder `// TODO: klantdata`.

## Open punten

- `public/huisje.webp` is 1642px breed: prima voor nu, origineel van de klant (min. 2400px) blijft wenselijk.
- Naam/logo in `src/components/Logo.tsx` en `index.html` vervangen zodra huisstijl binnen is.
- `BookingBar` valideert alleen datums; koppeling met boekingssysteem ontbreekt (TODO in code).
- Homepage gaat over het huis, niet over boeken: `Hero` (boekingsbalk is de enige boek-ingang; `goToBooking` gaat naar `/beschikbaarheid#boeken` als er geen boekingssectie op de pagina staat, data blijven bewaard), dan: `HouseSection` (#het-huis, kop links + intro rechts, kerncijfers op één regel, alle ruimtes in één rij kleine foto's (onder lg een carrousel met pijlen en streepjes zoals Reviews) met onderschrift onder de foto, geen watermerk), `Amenities` (voorzieningen als genummerde index: grote meewisselende foto links (sticky, vanaf lg), rechts vier uitklapbare groepen; foto per groep in `AMENITIES` in `house.ts`, op mobiel in de open groep), `NearbySection` (donkere kaart, 4 activiteiten uit `src/lib/surroundings.ts`), `OwnersSection` (#eigenaren), `Reviews`. Componenten in `src/components/home/`, inhoud in `src/lib/house.ts`.
- Interieur- en eigenarenfoto's in `public/interieur/` zijn met Nano Banana gemaakt (placeholders, TODO: echte foto's). Namen, verhaal en indeling van de eigenaren zijn verzonnen.
- `HouseIntro` (#goed-om-te-weten, aankomst/vertrek, vrije periodes, vragen) en `BookingSection` staan alleen op Beschikbaarheid.
- `Reviews` (#reviews): afgeronde donkergroene kaart (zelfde marge als hero), gecentreerde scroll-snap carrousel, kaart = quote, persoon (initialen, geen nepgezichten), foto met onderschrift en sterren; statisch woord "Reviews" achter de titel, pijlknoppen naast de streepjes-indicator onder de carrousel, laatste kaart linkt naar Instagram. Foto's in `public/sfeer/` zijn met Nano Banana gegenereerde omgevingsbeelden (geen buitenfoto's van het huis genereren; interieur en eigenaren zijn tijdelijke placeholders). Reviews en Instagram-account zijn voorbeelddata (TODO): nooit verzonnen reviews live zetten.
- Beschikbaarheid en prijzen: `src/lib/availability.ts` en `src/lib/pricing.ts` (voorbeelddata, TODO: boekingssysteem/channel manager). Alle kalenders en de prijsberekening lezen daaruit: bezette nachten, `MIN_NIGHTS`/`MAX_NIGHTS`, wisseldag als laatste vertrekdag.
- Boekingsstatus: één `BookingProvider` (`src/lib/booking.tsx`) voor hero-balk, vrije periodes en `BookingSection`. `goToBooking(stap)` scrolt naar #boeken en opent die stap; hero met data = stap 3, zonder data = stap 1.
- `BookingSection` (#boeken): drie stappen als inklapbare panelen (data via `RangeCalendar`, gezelschap via `Stepper`, gegevens met validatie per veld), meelopend `Summary` met prijsopbouw (sticky vanaf lg), bevestiging na versturen. Versturen is nog niet gekoppeld (TODO).
- `Footer`: lichte afgeronde kaart, linkkolommen (Contact heeft `id="contact"`), compacte nieuwsbrief (invoer en knop op één regel) met dakmerk (alleen vanaf md). Nieuwsbrief en pagina's huisregels/annuleren/privacy/cookies nog niet gekoppeld (TODO). Contactgegevens en Instagram in `src/lib/site.ts`.
- Anker-links (`#omgeving`, `#prijzen`) wijzen nog naar niet-bestaande secties.
