import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence, Variants, Transition } from "framer-motion";
import b1BrownLogo from "@/assets/logos/b1_brown_logo.png";

interface PageTransitionProps {
  children: ReactNode;
  location?: string;
}

// Logo overlay variants for the loading transition
const logoOverlayVariants: Variants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn",
      delay: 0.1,
    },
  },
};

// Logo animation variants - subtle scale effect
const logoVariants: Variants = {
  initial: {
    scale: 0.8,
    opacity: 0,
  },
  enter: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1] as Transition["ease"],
    },
  },
  exit: {
    scale: 1.05,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.6, 1] as Transition["ease"],
    },
  },
};

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as Transition["ease"],
      when: "beforeChildren",
    } as Transition,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.6, 1] as Transition["ease"],
    } as Transition,
  },
};

const contentVariants: Variants = {
  initial: { opacity: 0, y: 30 },
  enter: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as Transition["ease"],
      delay: 0.1,
    } as Transition,
  },
  exit: { 
    opacity: 0, 
    y: -30,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.6, 1] as Transition["ease"],
    } as Transition,
  },
};

// Logo Loading Transition Component - shows during navigation
export function LogoTransition() {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Start showing logo when location changes
    setIsNavigating(true);
    
    // Hide logo after a short delay
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 400); // Total transition time

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-sm pointer-events-none"
          variants={logoOverlayVariants}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <motion.img
            src={b1BrownLogo}
            alt="B1 Glam Studio"
            className="w-64 h-64 md:w-96 md:h-96 object-contain"
            variants={logoVariants}
            initial="initial"
            animate="enter"
            exit="exit"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PageTransition({ children, location }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        <motion.div variants={contentVariants}>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default PageTransition;
