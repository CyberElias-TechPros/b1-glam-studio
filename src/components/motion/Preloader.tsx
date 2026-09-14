import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import b1BrownLogo from "@/assets/logos/b1_brown_logo.png";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * First-impression cinema. Preloads the hero art, counts the house in, then
 * lifts a curtain off the page. Plays once per session; skipped for
 * reduced-motion users and during test runs.
 */
export function Preloader({ imageSources = [] }: { imageSources?: string[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(() => {
    if (typeof window === "undefined") return false;
    if (import.meta.env.MODE === "test") return false;
    try {
      if (sessionStorage.getItem("b1_intro_played") === "1") return false;
    } catch {
      /* storage unavailable — show the intro anyway */
    }
    return true;
  });
  const [progress, setProgress] = useState(0);
  const [curtain, setCurtain] = useState(false);
  const finished = useRef(false);

  // Prevent scroll while the curtain is down
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);

  // Drive progress from real asset decoding, with a floor so it never flashes
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    const started = Date.now();
    const MIN_DURATION = reduce ? 200 : 1400;

    const preload = async () => {
      await Promise.all(
        imageSources.slice(0, 3).map(
          (src) =>
            new Promise<void>((resolve) => {
              const img = new Image();
              img.onload = () => resolve();
              img.onerror = () => resolve();
              img.src = src;
            })
        )
      );
    };

    const tick = window.setInterval(() => {
      if (cancelled) return;
      const elapsed = Date.now() - started;
      const ratio = Math.min(elapsed / MIN_DURATION, 1);
      // ease-out so the counter feels like it is settling, not stalling
      setProgress(Math.round((1 - Math.pow(1 - ratio, 2)) * 100));

      if (elapsed >= MIN_DURATION && !finished.current) {
        finished.current = true;
        window.clearInterval(tick);
        preload().finally(() => {
          if (cancelled) return;
          setCurtain(true);
          window.setTimeout(() => {
            if (cancelled) return;
            setActive(false);
            try {
              sessionStorage.setItem("b1_intro_played", "1");
            } catch {
              /* ignore */
            }
          }, reduce ? 0 : 1000);
        });
      }
    }, 40);

    preload();

    return () => {
      cancelled = true;
      window.clearInterval(tick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reduce]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[9998] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          aria-hidden
        >
          {/* Curtain panels */}
          <div className="absolute inset-0 flex">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="relative h-full flex-1 bg-[hsl(20_14%_3%)]"
                animate={curtain ? { y: "-101%" } : { y: 0 }}
                transition={{ duration: 1, ease: EASE, delay: curtain ? i * 0.07 : 0 }}
              >
                <div className="absolute inset-y-0 right-0 w-px bg-gold/15" />
              </motion.div>
            ))}
          </div>

          {/* Aura */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,hsl(40_62%_62%_/_0.16),transparent_68%)] animate-aura-pulse" />
          </div>

          <motion.div
            className="relative z-10 flex h-full flex-col items-center justify-center px-6"
            animate={curtain ? { opacity: 0, y: -30, filter: "blur(6px)" } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <motion.img
              src={b1BrownLogo}
              alt="B1touch Artistry"
              className="h-20 w-20 object-contain sm:h-24 sm:w-24"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: EASE }}
            />

            <motion.div
              className="mt-7 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.8 }}
            >
              <motion.p
                className="display-md text-center text-[1.35rem] tracking-[0.04em] text-foreground sm:text-[1.75rem]"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.25, duration: 1, ease: EASE }}
              >
                B1touch <span className="display-italic text-gradient-gold">Artistry</span>
              </motion.p>
            </motion.div>

            <motion.p
              className="eyebrow-muted mt-4 text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.8 }}
            >
              Lagos · Bridal · Editorial
            </motion.p>

            <div className="mt-12 w-56 max-w-[72vw]">
              <div className="relative h-px w-full overflow-hidden bg-gold/15">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-gold"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="eyebrow-muted text-[0.5625rem]">Preparing the studio</span>
                <span className="numeral text-xs text-gold-light">{String(progress).padStart(3, "0")}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Preloader;
