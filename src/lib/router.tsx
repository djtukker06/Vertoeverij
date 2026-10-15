import { createContext, useCallback, useContext, useEffect, useRef, useState, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { scrollToId, smoothScrollTo } from "./scroll";

// Onepager: alle onderdelen staan op de homepage; de "routes" zijn ankers. Alleen huisregels is een eigen pagina.
export const ROUTES = {
  home: "/",
  accommodation: "/#het-huis",
  wellness: "/#wellness",
  surroundings: "/#omgeving",
  availability: "/#boeken",
  reviews: "/#reviews",
  contact: "/#contact",
  houseRules: "/huisregels",
} as const;

/** Oude adressen (losse pagina's) sturen door naar hun sectie op de homepage. */
export const LEGACY_PATHS: Record<string, string> = {
  "/accommodatie": ROUTES.accommodation,
  "/wellness": ROUTES.wellness,
  "/omgeving": ROUTES.surroundings,
  "/boeken": ROUTES.availability,
  "/beschikbaarheid": ROUTES.availability,
  "/prijzen": ROUTES.availability,
  "/contact": ROUTES.contact,
};

type RouterValue = { path: string; navigate: (href: string) => void };
const RouterContext = createContext<RouterValue | null>(null);

const normalize = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);

/**
 * Minimale client-side router (geen extra dependency nodig voor vier pagina's).
 * Ankers op dezelfde pagina scrollen vloeiend; naar een andere pagina eerst wisselen, dan naar het anker scrollen.
 * Productie: de host moet alle paden naar index.html sturen (SPA-fallback).
 */
/** Pagina's laden lazy: wacht tot het anker in de DOM staat (max. 3 s) en scroll dan pas. */
function scrollWhenPresent(id: string, waited = 0) {
  if (document.getElementById(id)) {
    window.setTimeout(() => scrollToId(id), 80);
    return;
  }
  if (waited < 3000) window.setTimeout(() => scrollWhenPresent(id, waited + 50), 50);
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => normalize(window.location.pathname));
  const pendingHash = useRef<string | null>(null);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const onPop = () => {
      setPath(normalize(window.location.pathname));
      pendingHash.current = window.location.hash || null;
    };
    window.addEventListener("popstate", onPop);
    // Direct binnenkomen op een anker (bijv. /#reviews)
    if (window.location.hash) pendingHash.current = window.location.hash;
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Na een paginawissel: naar boven, en daarna eventueel vloeiend naar het anker
  useEffect(() => {
    const hash = pendingHash.current;
    pendingHash.current = null;
    window.scrollTo(0, 0);
    if (hash) scrollWhenPresent(decodeURIComponent(hash.slice(1)));
  }, [path]);

  const navigate = useCallback((href: string) => {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) {
      window.location.href = href;
      return;
    }
    const target = normalize(url.pathname);
    if (target === normalize(window.location.pathname)) {
      history.replaceState(null, "", url.pathname + url.hash);
      if (url.hash) scrollToId(decodeURIComponent(url.hash.slice(1)));
      else smoothScrollTo(0);
      return;
    }
    history.pushState(null, "", target + url.hash);
    pendingHash.current = url.hash || null;
    setPath(target);
  }, []);

  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>;
}

/**
 * Voor het WordPress-theme: PHP levert de pagina's, dus geen client-side wissel.
 * Ankers op dezelfde pagina scrollen vloeiend; andere pagina's laden gewoon.
 */
export function StaticRouterProvider({ children }: { children: ReactNode }) {
  const navigate = useCallback((href: string) => {
    const url = new URL(href, window.location.href);
    const samePage = url.origin === window.location.origin && normalize(url.pathname) === normalize(window.location.pathname);
    if (samePage && url.hash) {
      history.replaceState(null, "", url.hash);
      scrollToId(decodeURIComponent(url.hash.slice(1)));
      return;
    }
    window.location.href = url.href;
  }, []);
  return <RouterContext.Provider value={{ path: normalize(window.location.pathname), navigate }}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter moet binnen <RouterProvider> staan");
  return ctx;
}

/** Interne link: wisselt pagina zonder herladen en scrollt vloeiend naar ankers. */
export function Link({ href, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const { navigate } = useRouter();
  function handle(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || rest.target) return;
    if (/^(mailto:|tel:|https?:)/.test(href) && !href.startsWith(window.location.origin)) return;
    e.preventDefault();
    navigate(href);
  }
  return <a href={href} onClick={handle} {...rest} />;
}
