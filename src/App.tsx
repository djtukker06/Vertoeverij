import { Suspense, lazy, useEffect } from "react";
import { Footer } from "./components/Footer";
import { BRAND_NAME } from "./components/Logo";
import { BookingProvider } from "./lib/booking";
import { ROUTES, RouterProvider, useRouter } from "./lib/router";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";

// Subpagina's pas laden als iemand ze opent: de homepage blijft licht
const AvailabilityPage = lazy(() => import("./pages/AvailabilityPage").then((m) => ({ default: m.AvailabilityPage })));
const SurroundingsPage = lazy(() => import("./pages/SurroundingsPage").then((m) => ({ default: m.SurroundingsPage })));
const ContactPage = lazy(() => import("./pages/ContactPage").then((m) => ({ default: m.ContactPage })));
const AccommodationPage = lazy(() => import("./pages/AccommodationPage").then((m) => ({ default: m.AccommodationPage })));
const WellnessPage = lazy(() => import("./pages/WellnessPage").then((m) => ({ default: m.WellnessPage })));
const HouseRulesPage = lazy(() => import("./pages/HouseRulesPage").then((m) => ({ default: m.HouseRulesPage })));
const PricesPage = lazy(() => import("./pages/PricesPage").then((m) => ({ default: m.PricesPage })));

const PAGES: Record<string, { title: string; description: string; render: () => React.ReactNode }> = {
  [ROUTES.home]: {
    title: `${BRAND_NAME} | Bed & Wellness in Kloosterhaar`,
    description: "Comfortabel appartement in het buitengebied van Kloosterhaar, met vrij uitzicht over de weilanden en een privé wellness.",
    render: () => <HomePage />,
  },
  [ROUTES.accommodation]: {
    title: `Accommodatie | ${BRAND_NAME}`,
    description: "Ruim appartement voor maximaal vier personen, met twee slaapkamers en twee badkamers, een eigen terras en uitzicht over de weilanden.",
    render: () => <AccommodationPage />,
  },
  [ROUTES.wellness]: {
    title: `Wellness | ${BRAND_NAME}`,
    description: "Privé wellness met sauna, jacuzzi en Turks stoombad. Volledig voor jullie alleen, bij je verblijf of los te boeken.",
    render: () => <WellnessPage />,
  },
  [ROUTES.surroundings]: {
    title: `Omgeving | ${BRAND_NAME}`,
    description: "Wandelen, fietsen, eten en drinken en dagjes uit rond Kloosterhaar, dicht bij de Duitse grens.",
    render: () => <SurroundingsPage />,
  },
  [ROUTES.availability]: {
    title: `Boeken | ${BRAND_NAME}`,
    description: "Bekijk de beschikbaarheid en boek je verblijf, met of zonder privé wellness.",
    render: () => <AvailabilityPage />,
  },
  [ROUTES.prices]: {
    title: `Prijzen | ${BRAND_NAME}`,
    description: "Prijzen per nacht, de privé wellness, bijkomende kosten en antwoord op veelgestelde vragen.",
    render: () => <PricesPage />,
  },
  [ROUTES.contact]: {
    title: `Contact | ${BRAND_NAME}`,
    description: "Stel je vraag over je verblijf of de wellness via het contactformulier, per mail of telefoon.",
    render: () => <ContactPage />,
  },
  [ROUTES.houseRules]: {
    title: `Huisregels | ${BRAND_NAME}`,
    description: "In- en uitchecken, kinderen, huisdieren en andere huisregels van De Zandloper.",
    render: () => <HouseRulesPage />,
  },
};

function Pages() {
  const { path } = useRouter();
  const page = PAGES[path];

  useEffect(() => {
    document.title = page?.title ?? `Pagina volgt | ${BRAND_NAME}`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", page?.description ?? "");
  }, [page]);

  return (
    <>
      {/* key: elke pagina start met een schone staat en eigen intro-animatie */}
      {/* Fallback met minimale hoogte, zodat de footer niet even omhoog springt tijdens het laden */}
      <main key={path}>
        <Suspense fallback={<div className="min-h-[100dvh]" />}>{page ? page.render() : <NotFoundPage />}</Suspense>
      </main>
      <Footer />
    </>
  );
}

export function App() {
  return (
    <RouterProvider>
      <BookingProvider>
        <Pages />
      </BookingProvider>
    </RouterProvider>
  );
}
