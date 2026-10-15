import { Suspense, lazy, useEffect } from "react";
import { Footer } from "./components/Footer";
import { BRAND_NAME } from "./components/Logo";
import { BookingProvider } from "./lib/booking";
import { LEGACY_PATHS, ROUTES, RouterProvider, useRouter } from "./lib/router";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";

// Onepager: alles staat op de homepage. Alleen de huisregels zijn een losse pagina (lazy geladen).
const HouseRulesPage = lazy(() => import("./pages/HouseRulesPage").then((m) => ({ default: m.HouseRulesPage })));

const PAGES: Record<string, { title: string; description: string; render: () => React.ReactNode }> = {
  [ROUTES.home]: {
    title: `${BRAND_NAME} | Bed & Wellness in Kloosterhaar`,
    description: "Comfortabel vakantiehuis in het buitengebied van Kloosterhaar, met vrij uitzicht over de weilanden en een privé wellness.",
    render: () => <HomePage />,
  },
  [ROUTES.houseRules]: {
    title: `Huisregels | ${BRAND_NAME}`,
    description: "In- en uitchecken, kinderen, huisdieren en andere huisregels van De Zandloper.",
    render: () => <HouseRulesPage />,
  },
};

function Pages() {
  const { path, navigate } = useRouter();
  const legacy = LEGACY_PATHS[path];
  const page = PAGES[legacy ? ROUTES.home : path];

  // Oude adressen van de losse pagina's (bijv. /accommodatie) naar de juiste sectie op de homepage
  useEffect(() => {
    if (legacy) navigate(legacy);
  }, [legacy, navigate]);

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
