import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";

interface SmoothScrollContextValue {
  lenis: Lenis | null;
  scrollTo: (target: number | string | HTMLElement, options?: { offset?: number; immediate?: boolean }) => void;
  stop: () => void;
  start: () => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenis: null,
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

/**
 * Cinematic but restrained inertia scrolling.
 * Disabled entirely for users who prefer reduced motion, and for touch devices
 * where native momentum feels better.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReduced || isCoarse) return;

    const instance = new Lenis({
      duration: 1.15,
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      smoothWheel: true,
      anchors: { offset: -80 },
    });

    const raf = (time: number) => {
      instance.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);
    setLenis(instance);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  const scrollTo = useCallback<SmoothScrollContextValue["scrollTo"]>(
    (target, options = {}) => {
      const { offset = 0, immediate = false } = options;
      if (lenis) {
        lenis.scrollTo(target as never, { offset, immediate, duration: immediate ? 0 : 1.3 });
        return;
      }
      // Fallback for reduced-motion / coarse pointers
      if (typeof target === "number") {
        window.scrollTo({ top: target + offset, behavior: immediate ? "auto" : "smooth" });
      } else if (typeof target === "string") {
        document.querySelector(target)?.scrollIntoView({ behavior: immediate ? "auto" : "smooth", block: "start" });
      } else if (target instanceof HTMLElement) {
        window.scrollTo({ top: target.offsetTop + offset, behavior: immediate ? "auto" : "smooth" });
      }
    },
    [lenis]
  );

  const value = useMemo<SmoothScrollContextValue>(
    () => ({
      lenis,
      scrollTo,
      stop: () => lenis?.stop(),
      start: () => lenis?.start(),
    }),
    [lenis, scrollTo]
  );

  return <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>;
}

export default SmoothScrollProvider;
