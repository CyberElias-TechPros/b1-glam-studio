import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import b1Logo from "@/assets/logos/b1_brown_logo.png";

const EASE = [0.16, 1, 0.3, 1] as const;

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.3, ease: [0.65, 0, 0.35, 1] as const },
  },
};

/**
 * Route-level cinema: a curtain lifts off every navigation while the incoming
 * page settles into place. Deliberately brief so browsing never feels gated.
 */
function Curtain({ trigger }: { trigger: string }) {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduce) return;
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 900);
    return () => window.clearTimeout(timer);
  }, [trigger, reduce]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={trigger}
          className="pointer-events-none fixed inset-0 z-[950]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
        >
          <motion.div
            className="absolute inset-x-0 top-0 bg-[hsl(20_14%_3.5%_/_0.97)]"
            initial={{ height: "100%" }}
            animate={{ height: "0%" }}
            transition={{ duration: 0.9, ease: EASE }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-px bg-gradient-gold"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          />
          <motion.img
            src={b1Logo}
            alt=""
            aria-hidden
            className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 object-contain"
            initial={{ opacity: 0, scale: 0.86, y: 8 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.86, 1, 1, 0.96], y: [8, 0, 0, -10] }}
            transition={{ duration: 0.85, ease: EASE, times: [0, 0.3, 0.6, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface PageTransitionProps {
  children: ReactNode;
  location?: string;
  /** Admin routes use the plain fade — the staff portal should feel like tooling. */
  withCurtain?: boolean;
}

export function PageTransition({ children, location, withCurtain = true }: PageTransitionProps) {
  const route = useLocation();
  const key = location ?? route.pathname;

  return (
    <>
      {withCurtain && <Curtain trigger={key} />}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={key} variants={pageVariants} initial="initial" animate="enter" exit="exit">
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

/** Retained for backwards compatibility — the curtain above supersedes it. */
export function LogoTransition() {
  return null;
}

export default PageTransition;
